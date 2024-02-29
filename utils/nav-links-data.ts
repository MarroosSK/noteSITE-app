import { CreditCard, Home, LucideIcon, Settings } from "lucide-react";

interface dashboardI {
  name: string;
  href: string;
  icon: LucideIcon;
}

export const dashboardLinks: dashboardI[] = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
];
