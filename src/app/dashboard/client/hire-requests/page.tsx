"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Eye, Filter, Clock, Users, Calendar, CheckCircle, XCircle, X, AlertCircle, CheckSquare } from "lucide-react";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

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

interface HireRequest {
  id: string;
  role: string;
  dateSubmitted: string;
  status: HireRequestStatus;
  description?: string;
  location?: string;
  department?: string;
  requestedBy?: string;
  candidatesCount?: number;
  interviewDate?: string;
}

const STATUS_OPTIONS = [
  "All",
  "Pending Signature",
  "New",
  "Sourcing",
  "Panel Ready",
  "Interview Scheduled",
  "Awaiting Decision",
  "Placement Complete",
  "Canceled",
] as const;

// Unified status configuration using app's design system
const STATUS_CONFIG = {
  "Pending Signature": {
    color: "bg-amber-500 text-white border-transparent",
    icon: <Clock className="w-4 h-4" />,
    description: "Waiting for client to sign service agreement"
  },
  "New": {
    color: "bg-gray-500 text-white border-transparent",
    icon: <Clock className="w-4 h-4" />,
    description: "Client just submitted the request"
  },
  "Sourcing": {
    color: "bg-blue-500 text-white border-transparent",
    icon: <Users className="w-4 h-4" />,
    description: "Searching for candidates in the pool"
  },
  "Panel Ready": {
    color: "bg-yellow-500 text-white border-transparent",
    icon: <CheckCircle className="w-4 h-4" />,
    description: "Candidates selected and ready for review"
  },
  "Interview Scheduled": {
    color: "bg-purple-500 text-white border-transparent",
    icon: <Calendar className="w-4 h-4" />,
    description: "Interview scheduled with client"
  },
  "Awaiting Decision": {
    color: "bg-orange-500 text-white border-transparent",
    icon: <AlertCircle className="w-4 h-4" />,
    description: "Waiting for client decision"
  },
  "Placement Complete": {
    color: "bg-green-500 text-white border-transparent",
    icon: <CheckSquare className="w-4 h-4" />,
    description: "Hiring completed successfully"
  },
  "Canceled": {
    color: "bg-red-500 text-white border-transparent",
    icon: <XCircle className="w-4 h-4" />,
    description: "Request canceled"
  }
} as const;

// Helper functions
const getStatusColor = (status: HireRequestStatus) => STATUS_CONFIG[status].color;
const getStatusIcon = (status: HireRequestStatus) => STATUS_CONFIG[status].icon;
const getStatusDescription = (status: HireRequestStatus) => STATUS_CONFIG[status].description;

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
    { role: "Medical Receptionist", status: "New" as HireRequestStatus, description: "Front desk support for clinic.", location: "Miami, FL", department: "Reception", requestedBy: "Dr. Smith" },
    { role: "Registered Nurse", status: "Sourcing" as HireRequestStatus, description: "Experienced RN for ER.", location: "Orlando, FL", department: "Nursing", requestedBy: "Dr. Lee", candidatesCount: 12 },
    { role: "Lab Technician", status: "Panel Ready" as HireRequestStatus, description: "Bloodwork and diagnostics.", location: "Tampa, FL", department: "Lab", requestedBy: "Dr. Patel", candidatesCount: 5 },
    { role: "Front Desk Specialist", status: "Interview Scheduled" as HireRequestStatus, description: "Patient check-in/out.", location: "Jacksonville, FL", department: "Reception", requestedBy: "Dr. Gomez" },
    { role: "Physician Assistant", status: "Awaiting Decision" as HireRequestStatus, description: "Support for outpatient clinic.", location: "Miami, FL", department: "Medical", requestedBy: "Dr. Smith" },
    { role: "Billing Coordinator", status: "Placement Complete" as HireRequestStatus, description: "Insurance and billing support.", location: "Orlando, FL", department: "Billing", requestedBy: "Dr. Lee" },
    { role: "X-Ray Technician", status: "Sourcing" as HireRequestStatus, description: "Radiology support.", location: "Tampa, FL", department: "Radiology", requestedBy: "Dr. Patel", candidatesCount: 8 },
    { role: "Nurse Practitioner", status: "Interview Scheduled" as HireRequestStatus, description: "Primary care NP.", location: "Jacksonville, FL", department: "Nursing", requestedBy: "Dr. Gomez" },
    { role: "Medical Biller", status: "Awaiting Decision" as HireRequestStatus, description: "Claims and billing.", location: "Miami, FL", department: "Billing", requestedBy: "Dr. Smith" },
    { role: "Receptionist", status: "Placement Complete" as HireRequestStatus, description: "Front desk support.", location: "Orlando, FL", department: "Reception", requestedBy: "Dr. Lee" },
    { role: "Surgical Tech", status: "Canceled" as HireRequestStatus, description: "Surgical support.", location: "Miami, FL", department: "Surgery", requestedBy: "Dr. Smith" },
  ];

  return {
    id: (i + 1).toString(),
    role: base[i].role,
    dateSubmitted: formatDate(dateSubmitted),
    status: base[i].status,
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
                      {getStatusIcon(req.status)}
                      <Badge className={getStatusColor(req.status)}>
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
                  {getStatusIcon(req.status)}
                  <Badge className={`text-xs ${getStatusColor(req.status)}`}>
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

      {/* Request Details Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogTitle className="flex items-center justify-between">
            <span>Request Details</span>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setModalOpen(false)}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Role</Label>
                  <p className="text-sm">{selectedRequest.role}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(selectedRequest.status)}
                    <Badge className={getStatusColor(selectedRequest.status)}>
                      {selectedRequest.status}
                    </Badge>
                  </div>
                </div>
                {selectedRequest.department && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Department</Label>
                    <p className="text-sm">{selectedRequest.department}</p>
                  </div>
                )}
                {selectedRequest.location && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                    <p className="text-sm">{selectedRequest.location}</p>
                  </div>
                )}
                {selectedRequest.requestedBy && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Requested By</Label>
                    <p className="text-sm">{selectedRequest.requestedBy}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Date Submitted</Label>
                  <p className="text-sm">{selectedRequest.dateSubmitted}</p>
                </div>
              </div>
              {selectedRequest.description && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                  <p className="text-sm mt-1">{selectedRequest.description}</p>
                </div>
              )}
              {selectedRequest.candidatesCount && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Candidates Found</Label>
                  <p className="text-sm">{selectedRequest.candidatesCount} candidates</p>
                </div>
              )}
              {selectedRequest.interviewDate && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Interview Date</Label>
                  <p className="text-sm">{selectedRequest.interviewDate}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Advanced Filters Sheet */}
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side="right" className="w-[400px] sm:w-[540px]">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Advanced Filters</h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  placeholder="Filter by department..."
                  value={departmentFilter}
                  onChange={e => setDepartmentFilter(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Filter by location..."
                  value={locationFilter}
                  onChange={e => setLocationFilter(e.target.value)}
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
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setDepartmentFilter("");
                  setLocationFilter("");
                  setDateFrom("");
                  setDateTo("");
                }}
                className="flex-1"
              >
                Clear All
              </Button>
              <Button onClick={() => setFilterOpen(false)} className="flex-1">
                Apply Filters
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
} 