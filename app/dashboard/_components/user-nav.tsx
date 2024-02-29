import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { dashboardLinks } from "@/utils/nav-links-data";
import { DoorClosed } from "lucide-react";
import Link from "next/link";

import { SignOutButtonCustom } from "@/components/sign-out-button";
import { redirect } from "next/navigation";

const UserNav = ({ userDetails }: { userDetails: any }) => {
  if (!userDetails.id) {
    return redirect("/");
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10 rounded-full">
              <AvatarImage src={userDetails.imageUrl} />
              <AvatarFallback>{userDetails.firstName}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {userDetails.firstName}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {userDetails.emailAddresses[0].emailAddress}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {dashboardLinks.map((link) => (
              <DropdownMenuItem asChild key={link.name}>
                <Link
                  href={link.href}
                  className="w-full flex justify-between items-center cursor-pointer"
                >
                  {link.name}
                  <span>
                    <link.icon className="mr-2 h-4 w-4 text-primary" />
                  </span>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="w-full flex justify-between items-center cursor-pointer">
            <SignOutButtonCustom />
            <DoorClosed className="mr-2 h-4 w-4 text-primary" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserNav;
