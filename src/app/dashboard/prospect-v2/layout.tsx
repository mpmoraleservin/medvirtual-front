"use client";

import Sidebar from "@/components/sidebar";
import Header from "@/components/ui/header";
import { Home, ListChecks, Users2, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProspectDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const navItems = [
    { href: "/dashboard/prospect-v2", icon: Home, label: "Dashboard" },
    { href: "/dashboard/prospect-v2/hire-requests", icon: ListChecks, label: "My Hire Requests" },
    { href: "/dashboard/prospect-v2/talent-pool", icon: Users2, label: "Talent Pool" },
    { href: "/dashboard/prospect-v2/profile", icon: User, label: "Profile" },
  ];
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar userRole="PROSPECT_V2" />
      <div className="flex-1 w-0 min-h-screen ml-0 sm:ml-64 flex flex-col">
        <Header userRole="PROSPECT_V2" />
        <main className="flex-1 pt-20 pb-20 px-2 sm:px-8 overflow-x-auto">
          {children}
        </main>
        {/* Bottom Navigation for Prospects (mobile only) */}
        <nav className="sm:hidden fixed bottom-0 left-0 w-full h-16 bg-background border-t border-border flex justify-around items-center z-50 shadow-lg">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || (href !== "/dashboard/prospect-v2" && pathname.startsWith(href));
            return (
              <Link key={href} href={href} className="flex flex-col items-center justify-center flex-1 h-full">
                <Icon className={`w-6 h-6 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`mt-1 text-xs font-medium ${isActive ? "text-primary" : "text-muted-foreground"} hidden`}>{label}</span>
                <div className={`mt-1 w-1.5 h-1.5 rounded-full ${isActive ? "bg-primary" : "bg-transparent"}`}></div>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
} 