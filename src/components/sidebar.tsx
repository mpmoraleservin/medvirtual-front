"use client";

import { Separator } from "@/components/ui/separator";
import {
  Home,
  ListChecks,
  Users,
  UserCheck,
  UserPlus,
  User,
  Ticket,
  Users2,
  PanelLeft,
  ClipboardList,
  UserCog,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

type UserRole = "PROSPECT" | "ACTIVE_CLIENT" | "ADMIN";

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
    label: "My Requests",
    icon: <ListChecks size={20} />, roles: ["PROSPECT"]
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
    href: "/dashboard/client/staff",
    label: "My Hired Staff",
    icon: <UserCheck size={20} />, roles: ["ACTIVE_CLIENT"]
  },
  {
    href: "/dashboard/client/talent-pool",
    label: "Explore Talent Pool",
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
    label: "Hire Requests Queue",
    icon: <ClipboardList size={20} />, roles: ["ADMIN"]
  },
  {
    href: "/dashboard/admin/panels",
    label: "Candidate Panels",
    icon: <PanelLeft size={20} />, roles: ["ADMIN"]
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

  return (
    <aside
      className={`hidden sm:flex fixed left-0 top-0 z-30 flex-col items-start justify-between w-64 h-screen bg-white border-r border-[#E9EAEB]${className ? ` ${className}` : ""}`}
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
                className={`w-full flex items-center gap-3 font-medium text-[#181D27] text-sm rounded-[6px] px-3 py-2 transition-colors hover:bg-gray-100 ${
                  isActive ? "bg-gray-200 text-black" : ""
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
        <div className="px-4">
          <Link
            href="/settings"
            className="w-full flex items-center gap-3 font-medium text-[#181D27] text-sm rounded-[6px] px-3 py-2 hover:bg-gray-100 transition-colors"
          >
            <UserCog size={20} />
            Settings
          </Link>
        </div>
        <Separator />
        <div className="flex items-center justify-center p-2">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGasA3GR9lZOu0QmGpOt_lz5f1o0hOJTD_RA&s"
            alt="profile"
            className="w-10 rounded-full mr-4"
          />
          <div className="flex flex-col mr-10">
            <span className="font-medium text-sm text-[#181D27]">
              Elizabeth Pascoe
            </span>
            <span className="font-medium text-xs text-[#717680]">
              Super Admin
            </span>
          </div>
          <button className="cursor-pointer">
            <LogOut size={16} color="gray" />
          </button>
        </div>
      </div>
    </aside>
  );
}
