"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Eye, Filter, Clock, Users, Calendar, CheckCircle, XCircle, X } from "lucide-react";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface HireRequest {
  id: string;
  role: string;
  dateSubmitted: string;
  status: "New" | "Sourcing" | "Panel Ready" | "Interview Scheduled" | "Awaiting Decision" | "Placement Complete" | "Canceled";
  description?: string;
  location?: string;
  department?: string;
  requestedBy?: string;
  candidatesCount?: number;
  interviewDate?: string;
}

const STATUS_OPTIONS = [
  "All",
  "New",
  "Sourcing",
  "Panel Ready",
  "Interview Scheduled",
  "Awaiting Decision",
  "Placement Complete",
  "Canceled",
] as const;

const STATUS_COLORS: Record<HireRequest["status"], string> = {
  "New": "bg-gray-500 text-white border-transparent",
  "Sourcing": "bg-blue-500 text-white border-transparent",
  "Panel Ready": "bg-yellow-500 text-white border-transparent",
  "Interview Scheduled": "bg-purple-500 text-white border-transparent",
  "Awaiting Decision": "bg-orange-500 text-white border-transparent",
  "Placement Complete": "bg-green-500 text-white border-transparent",
  "Canceled": "bg-red-500 text-white border-transparent",
};

const STATUS_ICONS: Record<HireRequest["status"], React.ReactNode> = {
  "New": <Clock className="w-4 h-4" />,
  "Sourcing": <Users className="w-4 h-4" />,
  "Panel Ready": <CheckCircle className="w-4 h-4" />,
  "Interview Scheduled": <Calendar className="w-4 h-4" />,
  "Awaiting Decision": <Clock className="w-4 h-4" />,
  "Placement Complete": <CheckCircle className="w-4 h-4" />,
  "Canceled": <XCircle className="w-4 h-4" />,
};

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

const today = new Date('2025-06-25');

const hireRequests: HireRequest[] = Array.from({ length: 11 }).map((_, i) => {
  // dateSubmitted: between today and 10 days ago
  const dateSubmitted = new Date(today);
  dateSubmitted.setDate(today.getDate() - (i % 11));

  // interviewDate: 2-7 days after dateSubmitted, only for some
  let interviewDate: string | undefined = undefined;
  if (i % 4 === 0) {
    const d = new Date(dateSubmitted);
    d.setDate(d.getDate() + 2 + (i % 6));
    interviewDate = formatDate(d);
  }

  const base = [
    { role: "Medical Receptionist", status: "New", description: "Front desk support for clinic.", location: "Miami, FL", department: "Reception", requestedBy: "Dr. Smith" },
    { role: "Registered Nurse", status: "Sourcing", description: "Experienced RN for ER.", location: "Orlando, FL", department: "Nursing", requestedBy: "Dr. Lee", candidatesCount: 12 },
    { role: "Lab Technician", status: "Panel Ready", description: "Bloodwork and diagnostics.", location: "Tampa, FL", department: "Lab", requestedBy: "Dr. Patel", candidatesCount: 5 },
    { role: "Front Desk Specialist", status: "Interview Scheduled", description: "Patient check-in/out.", location: "Jacksonville, FL", department: "Reception", requestedBy: "Dr. Gomez" },
    { role: "Physician Assistant", status: "Awaiting Decision", description: "Support for outpatient clinic.", location: "Miami, FL", department: "Medical", requestedBy: "Dr. Smith" },
    { role: "Billing Coordinator", status: "Placement Complete", description: "Insurance and billing support.", location: "Orlando, FL", department: "Billing", requestedBy: "Dr. Lee" },
    { role: "X-Ray Technician", status: "Sourcing", description: "Radiology support.", location: "Tampa, FL", department: "Radiology", requestedBy: "Dr. Patel", candidatesCount: 8 },
    { role: "Nurse Practitioner", status: "Interview Scheduled", description: "Primary care NP.", location: "Jacksonville, FL", department: "Nursing", requestedBy: "Dr. Gomez" },
    { role: "Medical Biller", status: "Awaiting Decision", description: "Claims and billing.", location: "Miami, FL", department: "Billing", requestedBy: "Dr. Smith" },
    { role: "Receptionist", status: "Placement Complete", description: "Front desk support.", location: "Orlando, FL", department: "Reception", requestedBy: "Dr. Lee" },
    { role: "Surgical Tech", status: "Canceled", description: "Surgical support.", location: "Miami, FL", department: "Surgery", requestedBy: "Dr. Smith" },
  ];

  return {
    id: (i + 1).toString(),
    role: base[i].role,
    dateSubmitted: formatDate(dateSubmitted),
    status: base[i].status as HireRequest["status"],
    description: base[i].description,
    location: base[i].location,
    department: base[i].department,
    requestedBy: base[i].requestedBy,
    candidatesCount: base[i].candidatesCount,
    interviewDate: interviewDate,
  };
});

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

  const getStatusDescription = (status: HireRequest["status"]) => {
    switch (status) {
      case "New":
        return "Client just submitted the request";
      case "Sourcing":
        return "Searching for candidates in the pool";
      case "Panel Ready":
        return "5 candidates selected";
      case "Interview Scheduled":
        return "Interview scheduled";
      case "Awaiting Decision":
        return "Waiting for client decision";
      case "Placement Complete":
        return "Hiring completed";
      case "Canceled":
        return "Request canceled";
      default:
        return "";
    }
  };

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
        {/* Traditional table only on desktop */}
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
                    {req.candidatesCount && (
                      <div className="text-xs text-blue-600 mt-1">
                        {req.candidatesCount} candidates found
                      </div>
                    )}
                    {req.interviewDate && (
                      <div className="text-xs text-green-600 mt-1">
                        Interview: {req.interviewDate}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="py-3 sm:py-4 align-middle text-xs sm:text-base">
                    <div className="flex items-center gap-2">
                      {STATUS_ICONS[req.status]}
                      <Badge className={STATUS_COLORS[req.status]}>
                        {req.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {getStatusDescription(req.status)}
                    </div>
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
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No requests found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="flex flex-col gap-3 sm:hidden">
          {paginatedRequests.map((req) => (
            <div key={req.id} className="rounded-lg border bg-white p-4 flex flex-col gap-2 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="font-semibold text-[#222] leading-tight text-sm">{req.role}</div>
                  <div className="text-xs text-muted-foreground leading-tight">{req.department} &middot; {req.location}</div>
                </div>
                <div className="flex items-center gap-2">
                  {STATUS_ICONS[req.status]}
                  <Badge className={`text-xs ${STATUS_COLORS[req.status]}`}>
                    {req.status}
                  </Badge>
                </div>
              </div>
              {req.candidatesCount && (
                <div className="text-xs text-blue-600">
                  {req.candidatesCount} candidates found
                </div>
              )}
              {req.interviewDate && (
                <div className="text-xs text-green-600">
                  Interview: {req.interviewDate}
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                {getStatusDescription(req.status)}
              </div>
              <div className="flex justify-end gap-2 mt-2">
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
            </div>
          ))}
          {paginatedRequests.length === 0 && (
            <div className="text-center text-muted-foreground py-8 text-xs">No requests found.</div>
          )}
        </div>

        {/* Pagination */}
        {pageCount > 1 && (
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
        )}
      </div>

      {/* Advanced Filters Dialog */}
      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="max-w-sm w-full">
          <DialogTitle className="sr-only">Advanced Filters</DialogTitle>
          <div className="flex flex-col space-y-4 py-2">
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={departmentFilter}
                onChange={e => setDepartmentFilter(e.target.value)}
                placeholder="e.g. Nursing"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={locationFilter}
                onChange={e => setLocationFilter(e.target.value)}
                placeholder="e.g. Miami, FL"
              />
            </div>
            <div>
              <Label htmlFor="dateFrom">Date From</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dateTo">Date To</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col gap-2 mt-2">
            <Button onClick={() => { setDepartmentFilter(""); setLocationFilter(""); setDateFrom(""); setDateTo(""); }}>Clear Filters</Button>
            <Button onClick={() => setFilterOpen(false)} variant="default">Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Sheet */}
      {selectedRequest && (
        <Sheet open={modalOpen} onOpenChange={setModalOpen}>
          <SheetContent side="right" className="w-[40vw] min-w-[400px] max-w-[48rem] p-0">
            <div className="relative h-full flex flex-col">
              <div className="sticky top-0 z-10 bg-white px-6 pt-6 pb-4 shadow-sm border-b flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedRequest.role}</h2>
                  <div className="text-lg text-muted-foreground font-medium">{selectedRequest.status}</div>
                </div>
                <Button size="icon" variant="ghost" aria-label="Close" onClick={() => setModalOpen(false)} className="mt-1">
                  <X className="w-6 h-6" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2">
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold">Status:</span>
                    <div className="flex items-center gap-2 mt-1">
                      {STATUS_ICONS[selectedRequest.status]}
                      <Badge className={STATUS_COLORS[selectedRequest.status]}>
                        {selectedRequest.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {getStatusDescription(selectedRequest.status)}
                    </p>
                  </div>
                  {selectedRequest.description && (
                    <div>
                      <span className="font-semibold">Description:</span>
                      <p className="text-sm text-muted-foreground mt-1">{selectedRequest.description}</p>
                    </div>
                  )}
                  {selectedRequest.department && (
                    <div>
                      <span className="font-semibold">Department:</span>
                      <p className="text-sm text-muted-foreground mt-1">{selectedRequest.department}</p>
                    </div>
                  )}
                  {selectedRequest.location && (
                    <div>
                      <span className="font-semibold">Location:</span>
                      <p className="text-sm text-muted-foreground mt-1">{selectedRequest.location}</p>
                    </div>
                  )}
                  {selectedRequest.requestedBy && (
                    <div>
                      <span className="font-semibold">Requested By:</span>
                      <p className="text-sm text-muted-foreground mt-1">{selectedRequest.requestedBy}</p>
                    </div>
                  )}
                  <div>
                    <span className="font-semibold">Date Submitted:</span>
                    <p className="text-sm text-muted-foreground mt-1">{selectedRequest.dateSubmitted}</p>
                  </div>
                  {selectedRequest.candidatesCount && (
                    <div>
                      <span className="font-semibold">Candidates Found:</span>
                      <p className="text-sm text-muted-foreground mt-1">{selectedRequest.candidatesCount}</p>
                    </div>
                  )}
                  {selectedRequest.interviewDate && (
                    <div>
                      <span className="font-semibold">Interview Date:</span>
                      <p className="text-sm text-muted-foreground mt-1">{selectedRequest.interviewDate}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
} 