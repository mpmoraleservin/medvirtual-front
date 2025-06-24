"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Eye, Filter } from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface HireRequest {
  id: string;
  role: string;
  dateSubmitted: string;
  status: "Submitted" | "AM Reviewing" | "Interview Scheduled" | "Awaiting Decision" | "Placement Complete";
  description?: string;
  location?: string;
  department?: string;
  requestedBy?: string;
}

const STATUS_OPTIONS = [
  "All",
  "Submitted",
  "AM Reviewing",
  "Interview Scheduled",
  "Awaiting Decision",
  "Placement Complete",
] as const;

const STATUS_COLORS: Record<HireRequest["status"], string> = {
  "Submitted": "bg-[#009FE3] text-white border-transparent", // azul principal
  "AM Reviewing": "bg-[#00C6F2] text-white border-transparent", // celeste
  "Interview Scheduled": "bg-[#222] text-white border-transparent", // gris oscuro
  "Awaiting Decision": "bg-[#FFB800] text-[#222] border-transparent", // amarillo de acento
  "Placement Complete": "bg-white text-[#009FE3] border border-[#009FE3]", // blanco con azul
};

const hireRequests: HireRequest[] = [
  { id: "1", role: "Medical Receptionist", dateSubmitted: "2024-06-01", status: "Submitted", description: "Front desk support for clinic.", location: "Miami, FL", department: "Reception", requestedBy: "Dr. Smith" },
  { id: "2", role: "Registered Nurse", dateSubmitted: "2024-05-28", status: "AM Reviewing", description: "Experienced RN for ER.", location: "Orlando, FL", department: "Nursing", requestedBy: "Dr. Lee" },
  { id: "3", role: "Lab Technician", dateSubmitted: "2024-05-20", status: "Interview Scheduled", description: "Bloodwork and diagnostics.", location: "Tampa, FL", department: "Lab", requestedBy: "Dr. Patel" },
  { id: "4", role: "Front Desk Specialist", dateSubmitted: "2024-05-15", status: "Awaiting Decision", description: "Patient check-in/out.", location: "Jacksonville, FL", department: "Reception", requestedBy: "Dr. Gomez" },
  { id: "5", role: "Physician Assistant", dateSubmitted: "2024-05-10", status: "Placement Complete", description: "Support for outpatient clinic.", location: "Miami, FL", department: "Medical", requestedBy: "Dr. Smith" },
  { id: "6", role: "Billing Coordinator", dateSubmitted: "2024-05-05", status: "Submitted", description: "Insurance and billing support.", location: "Orlando, FL", department: "Billing", requestedBy: "Dr. Lee" },
  { id: "7", role: "X-Ray Technician", dateSubmitted: "2024-05-01", status: "AM Reviewing", description: "Radiology support.", location: "Tampa, FL", department: "Radiology", requestedBy: "Dr. Patel" },
  { id: "8", role: "Nurse Practitioner", dateSubmitted: "2024-04-28", status: "Interview Scheduled", description: "Primary care NP.", location: "Jacksonville, FL", department: "Nursing", requestedBy: "Dr. Gomez" },
  { id: "9", role: "Medical Biller", dateSubmitted: "2024-04-25", status: "Awaiting Decision", description: "Claims and billing.", location: "Miami, FL", department: "Billing", requestedBy: "Dr. Smith" },
  { id: "10", role: "Receptionist", dateSubmitted: "2024-04-20", status: "Placement Complete", description: "Front desk support.", location: "Orlando, FL", department: "Reception", requestedBy: "Dr. Lee" },
];

const statusVariant = (status: HireRequest["status"]): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "Submitted":
      return "default";
    case "AM Reviewing":
      return "secondary";
    case "Interview Scheduled":
      return "outline";
    case "Awaiting Decision":
      return "destructive";
    case "Placement Complete":
      return "default";
    default:
      return "default";
  }
};

export default function MyHireRequestsPage() {
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_OPTIONS)[number]>("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<HireRequest | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pageSize, setPageSize] = useState<number | null>(null);
  const [manualPageSize, setManualPageSize] = useState(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    if (manualPageSize) return;
    function calculatePageSize() {
      const rowHeight = 64;
      const headerHeight = 56;
      const filterHeight = 56;
      const titleHeight = 40;
      const paginacionHeight = 56;
      const container = tableContainerRef.current;
      if (container) {
        const available = window.innerHeight - container.getBoundingClientRect().top - paginacionHeight - 24;
        const rows = Math.max(1, Math.floor((available - headerHeight - filterHeight - titleHeight) / rowHeight));
        setPageSize(rows);
      }
    }
    calculatePageSize();
    window.addEventListener("resize", calculatePageSize);
    return () => window.removeEventListener("resize", calculatePageSize);
  }, [manualPageSize]);

  useEffect(() => { setPage(1); }, [search, statusFilter, departmentFilter, locationFilter, dateFrom, dateTo, pageSize]);

  const filteredRequests = useMemo(() => {
    return hireRequests.filter(req =>
      (statusFilter === "All" || req.status === statusFilter) &&
      req.role.toLowerCase().includes(search.toLowerCase()) &&
      (departmentFilter ? (req.department || "").toLowerCase().includes(departmentFilter.toLowerCase()) : true) &&
      (locationFilter ? (req.location || "").toLowerCase().includes(locationFilter.toLowerCase()) : true) &&
      (dateFrom ? req.dateSubmitted >= dateFrom : true) &&
      (dateTo ? req.dateSubmitted <= dateTo : true)
    );
  }, [statusFilter, search, departmentFilter, locationFilter, dateFrom, dateTo]);

  const effectivePageSize = pageSize ?? 5;
  const pageCount = Math.ceil(filteredRequests.length / effectivePageSize);
  const paginatedRequests = useMemo(() =>
    filteredRequests.slice((page - 1) * effectivePageSize, page * effectivePageSize),
    [filteredRequests, page, effectivePageSize]
  );

  return (
    <div className="flex flex-col w-full max-w-none px-4 sm:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">My Hire Requests</h1>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex flex-1 gap-2">
          <Input
            type="text"
            placeholder="Search by role..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full sm:w-64"
          />
          <Select value={statusFilter} onValueChange={v => { setStatusFilter(v as typeof STATUS_OPTIONS[number]); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2 sm:hidden" onClick={() => setFilterOpen(true)} aria-label="Filter">
            <Filter className="w-4 h-4" />
          </Button>
          <Button variant="outline" className="gap-2 hidden sm:inline-flex" onClick={() => setFilterOpen(true)}>
            <Filter className="w-4 h-4" /> Filter
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select
            value={(pageSize ?? 5).toString()}
            onValueChange={v => {
              setPageSize(Number(v));
              setManualPageSize(true);
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value={String(filteredRequests.length)}>All</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex flex-col rounded-lg border bg-card p-4">
        {/* Tabla tradicional solo en desktop */}
        <div className="hidden sm:block overflow-x-auto">
          <Table className="w-full min-w-[600px]">
            <TableHeader>
              <TableRow className="bg-[#F6F6F7] border-b border-[#E5E7EB]">
                <TableHead className="font-bold text-base text-[#222] py-4">Request</TableHead>
                <TableHead className="font-bold text-base text-[#222] py-4">Status</TableHead>
                <TableHead className="font-bold text-base text-[#222] py-4">Date</TableHead>
                <TableHead className="font-bold text-base text-[#222] py-4 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRequests.map((req) => (
                <TableRow key={req.id} className="bg-white border-b border-[#F1F1F1] hover:bg-[#F6F6F7] transition-colors group">
                  <TableCell className="py-3 sm:py-4 align-middle text-xs sm:text-base">
                    <div className="font-semibold text-[#222] leading-tight">{req.role}</div>
                    {req.department && req.location && (
                      <div className="text-sm text-muted-foreground leading-tight">{req.department} &middot; {req.location}</div>
                    )}
                  </TableCell>
                  <TableCell className="py-3 sm:py-4 align-middle text-xs sm:text-base">
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 ${STATUS_COLORS[req.status]}`}>{req.status}</span>
                  </TableCell>
                  <TableCell className="py-3 sm:py-4 align-middle text-xs sm:text-base">
                    {req.dateSubmitted}
                  </TableCell>
                  <TableCell className="py-3 sm:py-4 text-center align-middle text-xs sm:text-base">
                    <div className="flex justify-center gap-2">
                      <Button
                        size="icon"
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700"
                        aria-label="View Details"
                        title="View Details"
                        onClick={() => { setSelectedRequest(req); setModalOpen(true); }}
                      >
                        <Eye className="w-5 h-5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedRequests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8 text-xs sm:text-base">
                    No hire requests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/* Cards mobile first */}
        <div className="flex flex-col gap-3 sm:hidden">
          {paginatedRequests.map((req) => (
            <div key={req.id} className="rounded-lg border bg-white p-4 flex flex-col gap-2 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="font-semibold text-[#222] leading-tight">{req.role}</div>
                  <div className="text-xs text-muted-foreground leading-tight">{req.status}</div>
                </div>
                <div className="text-xs text-muted-foreground">{req.dateSubmitted}</div>
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <Button size="icon" className="bg-blue-100 hover:bg-blue-200 text-blue-700" aria-label="View Details" title="View Details" onClick={() => { setSelectedRequest(req); setModalOpen(true); }}>
                  <Eye className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ))}
          {paginatedRequests.length === 0 && (
            <div className="text-center text-muted-foreground py-8 text-xs">No requests found.</div>
          )}
        </div>
        <div className="flex flex-wrap justify-between items-center mt-4 pt-2 border-t border-muted-foreground/10 gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <div className="flex gap-1">
            {Array.from({ length: pageCount }, (_, i) => (
              <Button
                key={i+1}
                size="sm"
                variant={page === i+1 ? "default" : "outline"}
                onClick={() => setPage(i+1)}
                className="px-3"
              >
                {i+1}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={page === pageCount || pageCount === 0}
            onClick={() => setPage(p => Math.min(pageCount, p + 1))}
          >
            Next
          </Button>
        </div>
      </div>

      {/* View Details Sheet */}
      <Sheet open={modalOpen} onOpenChange={setModalOpen}>
        <SheetContent side="right" className="w-[40vw] min-w-[400px] max-w-[48rem]">
          <div className="flex flex-col gap-2 p-4">
            <div><span className="font-semibold">Role:</span> {selectedRequest?.role}</div>
            <div><span className="font-semibold">Status:</span> <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${selectedRequest ? STATUS_COLORS[selectedRequest.status] : ''}`}>{selectedRequest?.status}</span></div>
            <div><span className="font-semibold">Date Submitted:</span> {selectedRequest?.dateSubmitted}</div>
            <div><span className="font-semibold">Department:</span> {selectedRequest?.department}</div>
            <div><span className="font-semibold">Location:</span> {selectedRequest?.location}</div>
            <div><span className="font-semibold">Requested By:</span> {selectedRequest?.requestedBy}</div>
            <div><span className="font-semibold">Description:</span> {selectedRequest?.description}</div>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="max-w-sm w-full">
          <DialogHeader>
            <DialogTitle>Advanced Filters</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-4 py-2">
            <Label htmlFor="department">Department</Label>
            <Input id="department" value={departmentFilter} onChange={e => setDepartmentFilter(e.target.value)} placeholder="e.g. Reception" />
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={locationFilter} onChange={e => setLocationFilter(e.target.value)} placeholder="e.g. Miami, FL" />
            <Label>Date Submitted From</Label>
            <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            <Label>Date Submitted To</Label>
            <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
          </div>
          <DialogFooter className="flex flex-col gap-2 mt-2">
            <Button onClick={() => { setDepartmentFilter(""); setLocationFilter(""); setDateFrom(""); setDateTo(""); }}>Clear Filters</Button>
            <Button onClick={() => setFilterOpen(false)} variant="default">Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 