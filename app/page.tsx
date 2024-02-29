import SubHero from "@/components/sub-hero";
import { Button, buttonVariants } from "@/components/ui/button";
import { SignInButton, currentUser } from "@clerk/nextjs";
import { DoorOpen } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const user = await currentUser();

  return (
    <section className="mt-10 md:mt-48 h-full flex flex-col items-center justify-center bg-background ">
      <div className=" relative flex flex-col items-center justify-center w-full px-5 py-12 mx-auto lg:px-16 max-w-7x6 md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <div>
            <h1 className="mt-8 text-3xl font-extrabold tracking-tight lg:text-6xl">
              note<span className="text-primary">SITE</span>
            </h1>
            <p className="max-w-xl mx-auto mt-8 text-base lg:text-xl text-secondary-foreground">
              Simple, powerful and beautiful Notes.
            </p>
          </div>

          <div className="flex justify-center max-w-xs mx-auto mt-10">
            {user ? (
              <Link
                href="/dashboard"
                className={buttonVariants({
                  variant: "default",
                  size: "lg",
                })}
              >
                <DoorOpen className="mr-3 " /> Enter
              </Link>
            ) : (
              <SignInButton mode="modal">
                <Button size="lg" className="border border-primary">
                  Sign In
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>

      <SubHero />
    </section>
  );
}
