import { AdvancedTable, TableColumn } from "@/components/ui/advanced-table"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ClipboardList, CalendarCheck, Hourglass, Ticket, TrendingUp, AlertTriangle } from "lucide-react"
import React from "react"
import Link from "next/link"

// --- TypeScript interfaces ---
interface AdminDashboardStats {
  newHireRequests: number
  panelsToSchedule: number
  pendingClientDecisions: number
  openSupportTickets: number
}

// Unified Hire Request Status Type - imported from StatusBadge component

interface RecentHireRequest {
  id: string
  clientName: string
  roleRequested: string
  status: string
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
// Status configuration is now handled by StatusBadge component

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
      "Pending Signature": "bg-chart-5 text-primary-foreground border-transparent",
      "New": "bg-muted-foreground text-primary-foreground border-transparent",
      "Sourcing": "bg-primary text-primary-foreground border-transparent",
      "Panel Ready": "bg-chart-3 text-primary-foreground border-transparent",
      "Interview Scheduled": "bg-chart-5 text-primary-foreground border-transparent",
      "Awaiting Decision": "bg-chart-4 text-primary-foreground border-transparent",
      "Placement Complete": "bg-chart-2 text-primary-foreground border-transparent",
      "Canceled": "bg-destructive text-primary-foreground border-transparent"
    }
  },
  {
    key: "date",
    header: "Date",
    type: "date"
  }
];

// Stats Overview Component - matching client dashboard style
const StatsOverview = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* New Requests */}
      <Card className="p-6 border border-border flex flex-col justify-between rounded-2xl shadow-none">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent">
            <ClipboardList className="w-6 h-6 text-primary" />
          </div>
          <span className="text-base font-medium text-muted-foreground">New Requests</span>
        </div>
        <div className="flex w-full justify-end">
          <span className="text-3xl font-bold text-foreground">{dashboardStats.newHireRequests}</span>
        </div>
      </Card>
      {/* Panels to Schedule */}
      <Card className="p-6 border border-border flex flex-col justify-between rounded-2xl shadow-none">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-chart-3/10">
            <CalendarCheck className="w-6 h-6 text-chart-3" />
          </div>
          <span className="text-base font-medium text-muted-foreground">Panels to Schedule</span>
        </div>
        <div className="flex w-full justify-end">
          <span className="text-3xl font-bold text-foreground">{dashboardStats.panelsToSchedule}</span>
        </div>
      </Card>
      {/* Pending Decisions */}
      <Card className="p-6 border border-border flex flex-col justify-between rounded-2xl shadow-none">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-chart-4/10">
            <Hourglass className="w-6 h-6 text-chart-4" />
          </div>
          <span className="text-base font-medium text-muted-foreground">Pending Decisions</span>
        </div>
        <div className="flex w-full justify-end">
          <span className="text-3xl font-bold text-foreground">{dashboardStats.pendingClientDecisions}</span>
        </div>
      </Card>
      {/* Open Tickets */}
      <Card className="p-6 border border-border flex flex-col justify-between rounded-2xl shadow-none">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10">
            <Ticket className="w-6 h-6 text-destructive" />
          </div>
          <span className="text-base font-medium text-muted-foreground">Open Tickets</span>
        </div>
        <div className="flex w-full justify-end">
          <span className="text-3xl font-bold text-foreground">{dashboardStats.openSupportTickets}</span>
        </div>
      </Card>
    </div>
  );
};

// Quick Actions Component
const QuickActions = () => {
  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-6 text-foreground">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/dashboard/admin/hire-requests">
          <Card className="p-6 border border-border hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <ClipboardList className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Manage Requests</h3>
                <p className="text-sm text-muted-foreground">Review hire requests</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/dashboard/admin/candidates">
          <Card className="p-6 border border-border hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 bg-chart-5/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-chart-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Talent Pool</h3>
                <p className="text-sm text-muted-foreground">Browse candidates</p>
              </div>
            </div>
          </Card>
        </Link>
        <Link href="/dashboard/admin/tickets">
          <Card className="p-6 border border-border hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="p-3 bg-destructive/10 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Support Tickets</h3>
                <p className="text-sm text-muted-foreground">Handle issues</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </section>
  );
};

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview and quick actions for the admin team</p>
        </div>
        
        {/* Stats Overview */}
        <StatsOverview />
        
        {/* Quick Actions */}
        <QuickActions />

        {/* Recent Hire Requests */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-foreground">Recent Hire Requests</h2>
            <Link href="/dashboard/admin/hire-requests">
              <Button variant="outline" className="gap-2">
                <ClipboardList className="w-4 h-4" />
                View All Requests
              </Button>
            </Link>
          </div>
          <AdvancedTable
            data={recentHireRequests}
            columns={columns}
            title=""
            statusKey="status"
            searchPlaceholder="Search by client or role..."
            showPagination={false}
            showPageSize={false}
            showSearch={false}
            showFilters={false}
            className="mb-0"
          />
        </section>
      </div>
    </div>
  )
} 