import Sidebar from "@/components/sidebar";

export default function ProspectDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar userRole="PROSPECT" />
      <main className="flex-1 w-0 min-h-screen ml-0 sm:ml-64 px-2 sm:px-8 py-8 overflow-x-auto">
        {children}
      </main>
    </div>
  );
} 