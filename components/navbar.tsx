import UserNav from "@/app/dashboard/_components/user-nav";
import { SignInButton, currentUser } from "@clerk/nextjs";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";

const Navbar = async () => {
  const user = await currentUser();

  return (
    <nav className="border-b bg-background h-[10vh] flex items-center">
      <div className="container flex items-center justify-between">
        <Link href="/">
          <h1 className="font-bold text-3xl">
            note<span className="text-primary">SITE</span>
          </h1>
        </Link>

        <div className="flex items-center gap-x-5">
          <ModeToggle />
          {user ? (
            <UserNav userDetails={user} />
          ) : (
            // <UserButton afterSignOutUrl="/" />
            <div className="flex items-center gap-x-5">
              <SignInButton mode="modal">
                <Button size="lg" className="border border-primary">
                  Sign In
                </Button>
              </SignInButton>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
