"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import React, { useState, useMemo } from "react"

// --- TypeScript interfaces ---
interface HireRequest {
  id: string
  clientName: string
  role: string
  dateSubmitted: string
  assignedTo: string
  status: "Open" | "In Review" | "Panel Scheduled" | "Closed"
}

const STATUS_OPTIONS = ["All", "Open", "In Review", "Panel Scheduled", "Closed"] as const

// --- Mock Data ---
const hireRequests: HireRequest[] = Array.from({ length: 20 }).map((_, i) => ({
  id: (i + 1).toString(),
  clientName: ["Dr. Smith", "Health Clinic", "Wellness Center", "Family Care", "Pediatrics Group"][i % 5],
  role: ["Registered Nurse", "Medical Assistant", "Lab Technician", "Receptionist", "Physician"][i % 5],
  dateSubmitted: `2024-06-${(i % 28 + 1).toString().padStart(2, "0")}`,
  assignedTo: ["Admin A", "Admin B", "Admin C", "Unassigned"][i % 4],
  status: (["Open", "In Review", "Panel Scheduled", "Closed"] as HireRequest["status"][])[i % 4],
}))

export default function HireRequestsManagement() {
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_OPTIONS)[number]>("All")

  const filteredRequests = useMemo(() => {
    return hireRequests.filter(req =>
      statusFilter === "All" || req.status === statusFilter
    )
  }, [statusFilter])

  return (
    <div className="min-h-screen bg-background flex">
      <main className="flex-1 p-6 md:p-10 w-full">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Hire Requests Queue</h1>
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
          <div className="w-full sm:w-64">
            <Select value={statusFilter} onValueChange={v => setStatusFilter(v as typeof STATUS_OPTIONS[number])}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Tabla de solicitudes */}
        <div className="rounded-lg border bg-card p-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Date Submitted</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>{req.clientName}</TableCell>
                  <TableCell>{req.role}</TableCell>
                  <TableCell>{req.dateSubmitted}</TableCell>
                  <TableCell>{req.assignedTo}</TableCell>
                  <TableCell>
                    <Badge variant={
                      req.status === "Open"
                        ? "default"
                        : req.status === "In Review"
                        ? "secondary"
                        : req.status === "Panel Scheduled"
                        ? "secondary"
                        : "outline"
                    }>
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link href={`/dashboard/admin/hire-requests/${req.id}`}>
                      <Button size="sm" variant="outline">View Details</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {filteredRequests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No hire requests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  )
} 