import { StatCard } from "@/components/ui/stat-card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ClipboardList, CalendarCheck, Hourglass, Ticket } from "lucide-react"
import React from "react"

// --- TypeScript interfaces ---
interface Ticket {
  id: string
  clientName: string
  subject: string
  date: string
  status: "Open" | "In Progress" | "Closed"
}

interface ActivityEvent {
  id: string
  type: "request" | "panel" | "decision" | "ticket"
  message: string
  date: string
}

// --- Mock Data ---
const actionItems = {
  newHireRequests: 5,
  panelsToSchedule: 2,
  pendingDecisions: 3,
}

const tickets: Ticket[] = [
  { id: "1", clientName: "Dr. Smith", subject: "Request for more info", date: "2024-06-01", status: "Open" },
  { id: "2", clientName: "Health Clinic", subject: "Panel reschedule", date: "2024-05-30", status: "In Progress" },
  { id: "3", clientName: "Wellness Center", subject: "Issue with candidate", date: "2024-05-29", status: "Closed" },
]

const activityFeed: ActivityEvent[] = [
  { id: "1", type: "request", message: "New hire request submitted by Dr. Smith", date: "2024-06-01" },
  { id: "2", type: "panel", message: "Panel interview scheduled for Health Clinic", date: "2024-05-31" },
  { id: "3", type: "decision", message: "Pending decision for Wellness Center", date: "2024-05-30" },
  { id: "4", type: "ticket", message: "Ticket closed for Dr. Smith", date: "2024-05-29" },
]

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background flex">
      <main className="flex-1 p-6 md:p-10 w-full">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Admin Dashboard</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Action Items */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold mb-2 text-foreground">Action Items</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                title="New Hire Requests"
                value={actionItems.newHireRequests}
                icon={<ClipboardList className="h-5 w-5" />}
                variant="primary"
                description="Requests awaiting review"
              />
              <StatCard
                title="Panels to Schedule"
                value={actionItems.panelsToSchedule}
                icon={<CalendarCheck className="h-5 w-5" />}
                variant="secondary"
                description="Panels needing scheduling"
              />
              <StatCard
                title="Pending Client Decisions"
                value={actionItems.pendingDecisions}
                icon={<Hourglass className="h-5 w-5" />}
                variant="warning"
                description="Awaiting client response"
              />
            </div>
          </section>

          {/* Open Tickets */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
              <Ticket className="h-5 w-5" /> Open Tickets
            </h2>
            <div className="rounded-lg border bg-card p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>{ticket.clientName}</TableCell>
                      <TableCell>{ticket.subject}</TableCell>
                      <TableCell>{ticket.date}</TableCell>
                      <TableCell>
                        <Badge variant={
                          ticket.status === "Open"
                            ? "default"
                            : ticket.status === "In Progress"
                            ? "secondary"
                            : "outline"
                        }>
                          {ticket.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          {/* Recent Activity */}
          <section className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Recent Activity</h2>
            <div className="rounded-lg border bg-card p-4 space-y-4">
              {activityFeed.map((event) => (
                <div key={event.id} className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {event.type === "request" && <ClipboardList className="h-4 w-4 text-primary" />}
                    {event.type === "panel" && <CalendarCheck className="h-4 w-4 text-secondary" />}
                    {event.type === "decision" && <Hourglass className="h-4 w-4 text-yellow-500" />}
                    {event.type === "ticket" && <Ticket className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <div>
                    <div className="text-sm text-foreground">{event.message}</div>
                    <div className="text-xs text-muted-foreground">{event.date}</div>
                  </div>
                </div>
              ))}
              {activityFeed.length === 0 && (
                <div className="text-muted-foreground text-sm">No recent activity.</div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
} 