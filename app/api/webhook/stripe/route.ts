//to show if user is subscribed or not

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(req: Request) {
  //mam body
  const body = await req.text();
  //mam signature
  const signature = headers().get("Stripe-Signature") as string;
  //mam event
  let event: Stripe.Event;

  //zostrojim webhook(vlozim body, signature a  event)
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error: unknown) {
    return new Response("webhook error", { status: 400 });
  }
  //mam webhook, teraz chcem extraktnut session
  const session = event.data.object as Stripe.Checkout.Session;
  //teraz mozem listen to webhook events a return co chcem vratit
  //1. ak uzivatel vykona uspesny checkout
  if (event.type === "checkout.session.completed") {
    //2: fetchnem si data subscription
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    //najdem id uzivatela
    //3. najdem id uzivatela ktory vykonal checkout
    const customerId = String(session.customer);

    //vyberiem uzivatela z databazy
    //4. pozriem ci ho mam v databaze
    const user = await db.user.findUnique({
      where: {
        stripeCustomerId: customerId,
      },
    });
    //ak nie je user, throw error
    //5. ak ho nemam v databaze, error
    if (!user) throw new Error("User not found...");

    //ak ho mam v db,tak vytvori k jeho id subscription
    await db.subscription.create({
      data: {
        stripeSubscriptionId: subscription.id,
        userId: user.id,
        currentPeriodStart: subscription.current_period_start,
        currentPeriodEnd: subscription.current_period_end,
        status: subscription.status,
        planId: subscription.items.data[0].plan.id,
        interval: String(subscription.items.data[0].plan.interval),
      },
    });
  }

  //dalsi webhook overi, ci sa platba vykonala uspesne
  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    //vytvorenie subscription pre uzivatelaak sa vykonalaplatba
    await db.subscription.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        planId: subscription.items.data[0].plan.id,
        currentPeriodStart: subscription.current_period_start,
        currentPeriodEnd: subscription.current_period_end,
        status: subscription.status,
      },
    });
  }

  //response ak bol webhook successful
  return new Response(null, { status: 200 });
}
