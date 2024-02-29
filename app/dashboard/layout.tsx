import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import DashboardSidebar from "./_components/dashboard-sidebar";

async function getData({ email, id, firstName, lastName, profileImage }: any) {
  noStore();
  const user = await db.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      stripeCustomerId: true,
    },
  });

  if (!user) {
    const name = `${firstName ?? ""} ${lastName ?? ""}`;
    await db.user.create({
      data: {
        id: id,
        email: email,
        name: name,
      },
    });
  }
  //zaregistrujem usera v stripe a vezmem id, ktore poslem do db
  if (!user?.stripeCustomerId) {
    const data = await stripe.customers.create({ email: email });
    await db.user.update({
      where: {
        id: id,
      },
      data: {
        stripeCustomerId: data.id,
      },
    });
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    return redirect("/");
  }

  //insert info about registered user in db by using prisma and getData func
  await getData({
    email: user?.emailAddresses[0].emailAddress as string,
    id: user?.id as string,
    firstName: user?.firstName as string,
    lastName: user?.lastName as string,
    profileImage: user?.imageUrl as string,
  });
  return (
    <div className="flex flex-col space-y-6 mt-10">
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <aside className="hidden w-[200px] flex-col md:flex">
          <DashboardSidebar />
        </aside>
        <div className="min-h-screen  ">{children}</div>
      </div>
    </div>
  );
}
