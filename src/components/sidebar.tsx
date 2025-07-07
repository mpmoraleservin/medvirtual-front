"use client";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Home,
  ListChecks,
  Users,
  UserCheck,
  UserPlus,
  Ticket,
  Users2,
  ClipboardList,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle";

type UserRole = "PROSPECT" | "PROSPECT_V2" | "ACTIVE_CLIENT" | "ADMIN";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
};

const NAV_ITEMS: NavItem[] = [
  // Prospect
  {
    href: "/dashboard/prospect",
    label: "Dashboard",
    icon: <Home size={20} />, roles: ["PROSPECT"]
  },
  {
    href: "/dashboard/prospect/hire-requests",
    label: "My Hire Requests",
    icon: <ListChecks size={20} />, roles: ["PROSPECT"]
  },
  {
    href: "/dashboard/prospect/talent-pool",
    label: "Talent Pool",
    icon: <Users2 size={20} />, roles: ["PROSPECT"]
  },
  // Prospect V2
  {
    href: "/dashboard/prospect-v2",
    label: "Dashboard",
    icon: <Home size={20} />, roles: ["PROSPECT_V2"]
  },
  {
    href: "/dashboard/prospect-v2/hire-requests",
    label: "My Hire Requests",
    icon: <ListChecks size={20} />, roles: ["PROSPECT_V2"]
  },
  {
    href: "/dashboard/prospect-v2/talent-pool",
    label: "Talent Pool",
    icon: <Users2 size={20} />, roles: ["PROSPECT_V2"]
  },
  // Active Client
  {
    href: "/dashboard/client",
    label: "Dashboard",
    icon: <Home size={20} />, roles: ["ACTIVE_CLIENT"]
  },
  {
    href: "/dashboard/client/hire-requests",
    label: "My Hire Requests",
    icon: <ListChecks size={20} />, roles: ["ACTIVE_CLIENT"]
  },
  {
    href: "/dashboard/client/interview-panels",
    label: "Interview Panels",
    icon: <Users size={20} />, roles: ["ACTIVE_CLIENT"]
  },
  {
    href: "/dashboard/client/staff",
    label: "My Hired Staff",
    icon: <UserCheck size={20} />, roles: ["ACTIVE_CLIENT"]
  },
  {
    href: "/dashboard/client/talent-pool",
    label: "Talent Pool",
    icon: <Users2 size={20} />, roles: ["ACTIVE_CLIENT"]
  },
  // Admin
  {
    href: "/dashboard/admin",
    label: "Dashboard",
    icon: <Home size={20} />, roles: ["ADMIN"]
  },
  {
    href: "/dashboard/admin/hire-requests",
    label: "Hire Requests",
    icon: <ClipboardList size={20} />, roles: ["ADMIN"]
  },
  {
    href: "/dashboard/admin/candidates",
    label: "All Candidates",
    icon: <UserPlus size={20} />, roles: ["ADMIN"]
  },
  {
    href: "/dashboard/admin/clients",
    label: "All Clients",
    icon: <Users size={20} />, roles: ["ADMIN"]
  },
  {
    href: "/dashboard/admin/tickets",
    label: "Tickets",
    icon: <Ticket size={20} />, roles: ["ADMIN"]
  },
];

interface SidebarProps {
  userRole: UserRole;
  className?: string;
}

export default function Sidebar({ userRole, className }: SidebarProps) {
  const navItems = NAV_ITEMS.filter((item) => item.roles.includes(userRole));
  const pathname = usePathname();

  // Get the appropriate profile link based on user role
  const getProfileLink = () => {
    switch (userRole) {
      case "PROSPECT":
        return "/dashboard/prospect/profile";
      case "PROSPECT_V2":
        return "/dashboard/prospect-v2/profile";
      case "ACTIVE_CLIENT":
        return "/dashboard/client/profile";
      case "ADMIN":
        return "/dashboard/admin/profile";
      default:
        return "/dashboard/prospect/profile";
    }
  };

  return (
    <aside
              className={`hidden sm:flex fixed left-0 top-0 z-30 flex-col items-start justify-between w-64 h-screen bg-background border-r border-border${className ? ` ${className}` : ""}`}
    >
      <div className="p-4 w-full">
        <img src="/logo.png" alt="company logo" className="w-32 mb-6" />
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center gap-3 font-medium text-foreground text-sm rounded-[6px] px-3 py-2 transition-colors hover:bg-muted ${
                  isActive ? "sidebar-active" : ""
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="w-full flex flex-col gap-2">
        <Separator />
        {/* Dark Mode Toggle */}
        <div className="px-2">
          <DarkModeToggle />
        </div>
        <Separator />
        <Link href={getProfileLink()} className="flex items-center justify-center p-2 hover:bg-muted transition-colors">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-base flex items-center justify-center mr-4">
            DS
          </div>
          <div className="flex flex-col mr-10">
            <span className="font-medium text-sm text-foreground">
              Dr. Smith
            </span>
            <span className="font-medium text-xs text-muted-foreground">
              {userRole === "PROSPECT" ? "Prospect" : 
               userRole === "PROSPECT_V2" ? "Prospect V2" :
               userRole === "ACTIVE_CLIENT" ? "Active Client" : 
               "Super Admin"}
            </span>
          </div>
          <Button variant="ghost" size="icon" className="h-auto p-0">
            <LogOut size={16} className="text-muted-foreground" />
          </Button>
        </Link>
      </div>
    </aside>
  );
}
