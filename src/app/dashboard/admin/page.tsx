import { StatCard } from "@/components/ui/stat-card"
import { AdvancedTable, TableColumn } from "@/components/ui/advanced-table"
import { ClipboardList, CalendarCheck, Hourglass, Ticket } from "lucide-react"
import React from "react"

// --- TypeScript interfaces ---
interface AdminDashboardStats {
  newHireRequests: number
  panelsToSchedule: number
  pendingClientDecisions: number
  openSupportTickets: number
}

interface RecentHireRequest {
  id: string
  clientName: string
  roleRequested: string
  status: "Pending" | "In Review" | "Scheduled" | "Completed" | "Cancelled"
  date: string
}

// --- Mock Data ---
const dashboardStats: AdminDashboardStats = {
  newHireRequests: 8,
  panelsToSchedule: 3,
  pendingClientDecisions: 5,
  openSupportTickets: 12,
}

const recentHireRequests: RecentHireRequest[] = [
  {
    id: "1",
    clientName: "Dr. Sarah Johnson",
    roleRequested: "Registered Nurse",
    status: "Pending",
    date: "2024-06-01"
  },
  {
    id: "2",
    clientName: "Wellness Medical Center",
    roleRequested: "Medical Assistant",
    status: "In Review",
    date: "2024-05-31"
  },
  {
    id: "3",
    clientName: "Dr. Michael Chen",
    roleRequested: "Lab Technician",
    status: "Scheduled",
    date: "2024-05-30"
  },
  {
    id: "4",
    clientName: "Community Health Clinic",
    roleRequested: "Receptionist",
    status: "Completed",
    date: "2024-05-29"
  },
  {
    id: "5",
    clientName: "Dr. Emily Rodriguez",
    roleRequested: "Nurse Practitioner",
    status: "Pending",
    date: "2024-05-28"
  },
]

// --- Table Configuration ---
const statusConfig = [
  { key: "Pending", label: "Pending", color: "bg-[#009FE3] text-white border-transparent" },
  { key: "In Review", label: "In Review", color: "bg-[#00C6F2] text-white border-transparent" },
  { key: "Scheduled", label: "Scheduled", color: "bg-[#222] text-white border-transparent" },
  { key: "Completed", label: "Completed", color: "bg-white text-[#009FE3] border border-[#009FE3]" },
  { key: "Cancelled", label: "Cancelled", color: "bg-red-100 text-red-700 border-transparent" },
];

const columns: TableColumn<RecentHireRequest>[] = [
  {
    key: "clientName",
    header: "Client Name",
    searchable: true,
    type: "text"
  },
  {
    key: "roleRequested",
    header: "Role Requested",
    searchable: true,
    type: "text"
  },
  {
    key: "status",
    header: "Status",
    type: "status",
    statusColors: {
      "Pending": "bg-[#009FE3] text-white border-transparent",
      "In Review": "bg-[#00C6F2] text-white border-transparent",
      "Scheduled": "bg-[#222] text-white border-transparent",
      "Completed": "bg-white text-[#009FE3] border border-[#009FE3]",
      "Cancelled": "bg-red-100 text-red-700 border-transparent"
    }
  },
  {
    key: "date",
    header: "Date",
    type: "date"
  }
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-6">Overview and quick actions for the admin team</p>
        {/* Task-Oriented Widgets */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-6 text-foreground">Task-Oriented Widgets</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <StatCard
              title="New Hire Requests"
              value={dashboardStats.newHireRequests}
              icon={<ClipboardList className="h-5 w-5" />}
              variant="primary"
              description="Requests awaiting review"
            />
            <StatCard
              title="Panels to Schedule"
              value={dashboardStats.panelsToSchedule}
              icon={<CalendarCheck className="h-5 w-5" />}
              variant="secondary"
              description="Panels needing scheduling"
            />
            <StatCard
              title="Pending Client Decisions"
              value={dashboardStats.pendingClientDecisions}
              icon={<Hourglass className="h-5 w-5" />}
              variant="warning"
              description="Awaiting client response"
            />
            <StatCard
              title="Open Support Tickets"
              value={dashboardStats.openSupportTickets}
              icon={<Ticket className="h-5 w-5" />}
              variant="danger"
              description="Tickets requiring attention"
            />
          </div>
        </section>

        {/* Recent Hire Requests */}
        <section>
          <AdvancedTable
            data={recentHireRequests}
            columns={columns}
            title="Recent Hire Requests"
            statusConfig={statusConfig}
            statusKey="status"
            searchPlaceholder="Search by client or role..."
            showPagination={false}
            showPageSize={false}
            className="mb-0"
          />
        </section>
      </div>
    </div>
  )
} 