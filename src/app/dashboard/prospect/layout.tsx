import Sidebar from "@/components/sidebar";
import Header from "@/components/ui/header";

export default function ProspectDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar userRole="PROSPECT" />
      <div className="flex-1 w-0 min-h-screen ml-0 sm:ml-64 flex flex-col">
        <Header userRole="PROSPECT" />
        <main className="flex-1 pt-20 pb-20 px-2 sm:px-8 overflow-x-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 