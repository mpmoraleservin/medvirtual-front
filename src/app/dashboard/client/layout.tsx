"use client";
import Sidebar from "@/components/sidebar";
import Header from "@/components/ui/header";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, ClipboardList, Star, User } from "lucide-react";

const navItems = [
  { href: "/dashboard/client", icon: Home, label: "Home" },
  { href: "/dashboard/client/staff", icon: Users, label: "Staff" },
  { href: "/dashboard/client/hire-requests", icon: ClipboardList, label: "Hire Requests" },
  { href: "/dashboard/client/talent-pool", icon: Star, label: "Talent Pool" },
  { href: "/dashboard/client/settings", icon: User, label: "Profile" },
];

export default function ClientDashboardLayout({ children }: { children: React.ReactNode }) {
  // Usa el hook de Next.js para pathname seguro para SSR/CSR
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar userRole="ACTIVE_CLIENT" className="hidden sm:block" />
      <div className="flex-1 w-0 min-h-screen ml-0 sm:ml-64 flex flex-col">
        <Header userRole="ACTIVE_CLIENT" />
        <main className="flex-1 pt-20 pb-20 px-2 sm:px-8 overflow-x-auto">{/* pb-20 to leave space for bottom menu */}
          {children}
        </main>
        {/* Bottom Navigation solo mobile */}
        <nav className="sm:hidden fixed bottom-0 left-0 w-full h-16 bg-white border-t border-[#E9EAEB] flex justify-around items-center z-50 shadow-lg">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || (href !== "/dashboard/client" && pathname.startsWith(href));
            return (
              <Link key={href} href={href} className="flex flex-col items-center justify-center flex-1 h-full">
                <Icon className={`w-6 h-6 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                {/* No label en mobile */}
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