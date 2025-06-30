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

// Unified Hire Request Status Type
type HireRequestStatus = 
  | "Pending Signature"
  | "New" 
  | "Sourcing"
  | "Panel Ready"
  | "Interview Scheduled"
  | "Awaiting Decision"
  | "Placement Complete"
  | "Canceled";

interface RecentHireRequest {
  id: string
  clientName: string
  roleRequested: string
  status: HireRequestStatus
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
    status: "New",
    date: "2024-06-01"
  },
  {
    id: "2",
    clientName: "Wellness Medical Center",
    roleRequested: "Medical Assistant",
    status: "Sourcing",
    date: "2024-05-31"
  },
  {
    id: "3",
    clientName: "Dr. Michael Chen",
    roleRequested: "Lab Technician",
    status: "Interview Scheduled",
    date: "2024-05-30"
  },
  {
    id: "4",
    clientName: "Community Health Clinic",
    roleRequested: "Receptionist",
    status: "Placement Complete",
    date: "2024-05-29"
  },
  {
    id: "5",
    clientName: "Dr. Emily Rodriguez",
    roleRequested: "Nurse Practitioner",
    status: "Awaiting Decision",
    date: "2024-05-28"
  },
]

// --- Table Configuration ---
const statusConfig = [
  { key: "Pending Signature", label: "Pending Signature", color: "bg-amber-500 text-white border-transparent" },
  { key: "New", label: "New", color: "bg-gray-500 text-white border-transparent" },
  { key: "Sourcing", label: "Sourcing", color: "bg-blue-500 text-white border-transparent" },
  { key: "Panel Ready", label: "Panel Ready", color: "bg-yellow-500 text-white border-transparent" },
  { key: "Interview Scheduled", label: "Interview Scheduled", color: "bg-purple-500 text-white border-transparent" },
  { key: "Awaiting Decision", label: "Awaiting Decision", color: "bg-orange-500 text-white border-transparent" },
  { key: "Placement Complete", label: "Placement Complete", color: "bg-green-500 text-white border-transparent" },
  { key: "Canceled", label: "Canceled", color: "bg-red-500 text-white border-transparent" },
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
      "Pending Signature": "bg-amber-500 text-white border-transparent",
      "New": "bg-gray-500 text-white border-transparent",
      "Sourcing": "bg-blue-500 text-white border-transparent",
      "Panel Ready": "bg-yellow-500 text-white border-transparent",
      "Interview Scheduled": "bg-purple-500 text-white border-transparent",
      "Awaiting Decision": "bg-orange-500 text-white border-transparent",
      "Placement Complete": "bg-green-500 text-white border-transparent",
      "Canceled": "bg-red-500 text-white border-transparent"
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