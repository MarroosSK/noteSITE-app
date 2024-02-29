"use client";

import { cn } from "@/lib/utils";
import { dashboardLinks } from "@/utils/nav-links-data";
import Link from "next/link";
import { usePathname } from "next/navigation";

const DashboardSidebar = () => {
  const pathname = usePathname();
  return (
    <div className="grid items-start gap-2">
      {dashboardLinks.map((link) => (
        <Link key={link.name} href={link.href}>
          <span
            className={cn(
              "group flex items-center gap-x-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === link.href ? "bg-accent" : "bg-transparent"
            )}
          >
            <link.icon className="mr-2 h-4 w-4 text-primary" />
            <span>{link.name}</span>
          </span>
        </Link>
      ))}
    </div>
  );
};

export default DashboardSidebar;
