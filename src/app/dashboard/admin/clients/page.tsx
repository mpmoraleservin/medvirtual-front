"use client";

import React, { useState, useMemo, useRef } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import { Dialog as FilterDialog, DialogContent as FilterDialogContent, DialogHeader as FilterDialogHeader, DialogTitle as FilterDialogTitle, DialogFooter as FilterDialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Eye, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AdvancedTable } from "@/components/ui/advanced-table";
import { PageTitle } from "@/components/ui/page-title";

interface Client {
  id: string;
  name: string;
  industry: string;
  location: string;
  contact: string;
  status: "Active" | "Inactive";
  createdAt: string;
}

const clients: Client[] = [
  { id: "1", name: "Health Clinic", industry: "Healthcare", location: "Miami, FL", contact: "Dr. Smith", status: "Active", createdAt: "2024-01-15" },
  { id: "2", name: "Wellness Center", industry: "Wellness", location: "Orlando, FL", contact: "Jane Doe", status: "Active", createdAt: "2023-11-10" },
  { id: "3", name: "Family Care", industry: "Healthcare", location: "Tampa, FL", contact: "Carlos Rivera", status: "Inactive", createdAt: "2022-08-22" },
  { id: "4", name: "Pediatrics Group", industry: "Healthcare", location: "Jacksonville, FL", contact: "Emily Brown", status: "Active", createdAt: "2023-03-05" },
  { id: "5", name: "Sunshine Clinic", industry: "Healthcare", location: "Fort Lauderdale, FL", contact: "Luis Fernández", status: "Active", createdAt: "2024-02-18" },
  { id: "6", name: "Downtown Clinic", industry: "Healthcare", location: "Miami, FL", contact: "Sara Cohen", status: "Inactive", createdAt: "2022-12-01" },
  { id: "7", name: "Radiology Associates", industry: "Radiology", location: "Miami, FL", contact: "Patricia Gomez", status: "Active", createdAt: "2023-07-14" },
  { id: "8", name: "MedBill Solutions", industry: "Billing", location: "Orlando, FL", contact: "Maria Lopez", status: "Active", createdAt: "2023-09-30" },
  { id: "9", name: "Jackson Memorial Hospital", industry: "Hospital", location: "Miami, FL", contact: "Ana Torres", status: "Active", createdAt: "2024-04-02" },
  { id: "10", name: "Mercy Hospital", industry: "Hospital", location: "Miami, FL", contact: "Dr. Smith", status: "Inactive", createdAt: "2022-10-20" },
];

// Mock hired staff data
const hiredStaffByClient: Record<string, { name: string; role: string; status: string }[]> = {
  "1": [
    { name: "Ana Torres", role: "Registered Nurse", status: "Active" },
    { name: "Luis Fernández", role: "Medical Assistant", status: "Active" },
    { name: "Emily Brown", role: "Lab Technician", status: "Inactive" },
  ],
  "2": [
    { name: "Carlos Ruiz", role: "Physician Assistant", status: "Active" },
    { name: "Sofia Martinez", role: "Receptionist", status: "Active" },
    { name: "John Smith", role: "Nurse Practitioner", status: "Inactive" },
  ],
  "3": [
    { name: "Maria Lopez", role: "Billing Coordinator", status: "Active" },
    { name: "Patricia Gomez", role: "X-Ray Technician", status: "Active" },
    { name: "David Kim", role: "Medical Biller", status: "Inactive" },
  ],
  // ...add more for other clients as needed
};

// Mock hire requests data
const hireRequestsByClient: Record<string, { role: string; status: string; date: string }[]> = {
  "1": [
    { role: "Medical Receptionist", status: "New", date: "2025-06-25" },
    { role: "Nurse", status: "Interview Scheduled", date: "2025-06-20" },
  ],
  "2": [
    { role: "Lab Technician", status: "Placement Complete", date: "2025-05-10" },
    { role: "Receptionist", status: "Awaiting Decision", date: "2025-06-01" },
  ],
  // ...add more for other clients as needed
};

// Global status colors for the entire app
const STATUS_COLORS: Record<string, string> = {
  "Active": "bg-green-500 text-white border-transparent",
  "Inactive": "bg-gray-400 text-white border-transparent",
  "New": "bg-gray-500 text-white border-transparent",
  "Sourcing": "bg-blue-500 text-white border-transparent",
  "Panel Ready": "bg-yellow-500 text-white border-transparent",
  "Interview Scheduled": "bg-purple-500 text-white border-transparent",
  "Awaiting Decision": "bg-orange-500 text-white border-transparent",
  "Placement Complete": "bg-green-500 text-white border-transparent",
  "Canceled": "bg-red-500 text-white border-transparent",
};

export default function AdminClientsPage() {
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [industryFilter, setIndustryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [contactFilter, setContactFilter] = useState("");
  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Client | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => { setPage(1); }, [search, industryFilter, statusFilter, pageSize]);

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase()) ||
      c.contact.toLowerCase().includes(search.toLowerCase());
    const matchesIndustry = industryFilter ? c.industry.toLowerCase().includes(industryFilter.toLowerCase()) : true;
    const matchesStatus = statusFilter && statusFilter !== "all" ? c.status === statusFilter : true;
    const matchesLocation = locationFilter ? c.location.toLowerCase().includes(locationFilter.toLowerCase()) : true;
    const matchesContact = contactFilter ? c.contact.toLowerCase().includes(contactFilter.toLowerCase()) : true;
    const matchesName = nameFilter ? c.name.toLowerCase().includes(nameFilter.toLowerCase()) : true;
    const matchesCreatedFrom = createdFrom ? c.createdAt >= createdFrom : true;
    const matchesCreatedTo = createdTo ? c.createdAt <= createdTo : true;
    return matchesSearch && matchesIndustry && matchesStatus && matchesLocation && matchesContact && matchesName && matchesCreatedFrom && matchesCreatedTo;
  });

  const pageCount = Math.ceil(filteredClients.length / pageSize);
  const paginatedClients = useMemo(() =>
    filteredClients.slice((page - 1) * pageSize, page * pageSize),
    [filteredClients, page, pageSize]
  );

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setEditData(null);
    setIsEditing(false);
    setProfileOpen(true);
  };

  const handleEditChange = (field: keyof Client, value: string) => {
    if (!editData) return;
    setEditData({ ...editData, [field]: value });
  };

  const handleSave = () => {
    if (editData) {
      setSelectedClient(editData);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData(selectedClient);
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <PageTitle title="All Clients" subtitle="Browse and manage all client organizations" />
        {/* Filters below the title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex flex-1 gap-2">
            <Input
              type="text"
              placeholder="Search by name, industry, location, or contact..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full sm:w-64"
            />
            <Button variant="outline" className="gap-2" onClick={() => setFilterOpen(true)}>
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page:</span>
            <Select value={pageSize.toString()} onValueChange={v => setPageSize(Number(v))}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Table section */}
        <div className="mb-8">
          <section className="flex flex-col rounded-lg border bg-card p-4">
            <div className="hidden sm:block overflow-x-auto">
              <Table className="w-full min-w-[600px]">
                <TableHeader>
                  <TableRow className="bg-[#F6F6F7] border-b border-[#E5E7EB]">
                    <TableHead className="font-bold text-base text-[#222] py-4">Name</TableHead>
                    <TableHead className="font-bold text-base text-[#222] py-4">Industry</TableHead>
                    <TableHead className="font-bold text-base text-[#222] py-4">Location</TableHead>
                    <TableHead className="font-bold text-base text-[#222] py-4">Contact</TableHead>
                    <TableHead className="font-bold text-base text-[#222] py-4">Status</TableHead>
                    <TableHead className="font-bold text-base text-[#222] py-4">Created</TableHead>
                    <TableHead className="font-bold text-base text-[#222] py-4 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedClients.map((client) => (
                    <TableRow key={client.id} className="bg-white border-b border-[#F1F1F1] hover:bg-[#F6F6F7] transition-colors group">
                      <TableCell className="py-4 align-middle font-semibold text-[#222]">{client.name}</TableCell>
                      <TableCell className="py-4 align-middle">{client.industry}</TableCell>
                      <TableCell className="py-4 align-middle">{client.location}</TableCell>
                      <TableCell className="py-4 align-middle">{client.contact}</TableCell>
                      <TableCell className="py-4 align-middle">
                        <Badge variant={client.status === "Active" ? "secondary" : "outline"}>{client.status}</Badge>
                      </TableCell>
                      <TableCell className="py-4 align-middle">{client.createdAt}</TableCell>
                      <TableCell className="py-4 align-middle text-center">
                        <Button
                          size="icon"
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700"
                          aria-label="View Client"
                          title="View Client"
                          onClick={() => handleViewClient(client)}
                        >
                          <Eye className="w-5 h-5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginatedClients.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No clients found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {/* Mobile: cards stacked */}
            <div className="flex flex-col gap-3 sm:hidden">
              {paginatedClients.map((client) => (
                <div key={client.id} className="rounded-lg border bg-white p-3 flex flex-col gap-2 shadow-sm">
                  <div className="font-semibold text-[#222] text-base">{client.name}</div>
                  <div className="text-xs text-muted-foreground">{client.industry} · {client.location}</div>
                  <div className="text-xs text-muted-foreground">Contact: {client.contact}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={client.status === "Active" ? "secondary" : "outline"}>{client.status}</Badge>
                    <span className="text-xs text-muted-foreground">Created: {client.createdAt}</span>
                  </div>
                </div>
              ))}
              {paginatedClients.length === 0 && (
                <div className="text-center text-muted-foreground py-8 text-xs">No clients found.</div>
              )}
            </div>
            {/* Pagination Controls */}
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
            {/* Filtros avanzados en Dialog */}
            <FilterDialog open={filterOpen} onOpenChange={setFilterOpen}>
              <FilterDialogContent className="max-w-sm w-full">
                <FilterDialogHeader>
                  <FilterDialogTitle>Advanced Filters</FilterDialogTitle>
                </FilterDialogHeader>
                <div className="flex flex-col space-y-4 py-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={nameFilter} onChange={e => setNameFilter(e.target.value)} placeholder="e.g. Health Clinic" />
                  <Label htmlFor="industry">Industry</Label>
                  <Input id="industry" value={industryFilter} onChange={e => setIndustryFilter(e.target.value)} placeholder="e.g. Healthcare" />
                  <Label htmlFor="status">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" value={locationFilter} onChange={e => setLocationFilter(e.target.value)} placeholder="e.g. Miami" />
                  <Label htmlFor="contact">Contact</Label>
                  <Input id="contact" value={contactFilter} onChange={e => setContactFilter(e.target.value)} placeholder="e.g. Dr. Smith" />
                  <Label htmlFor="createdFrom">Created From</Label>
                  <Input id="createdFrom" type="date" value={createdFrom} onChange={e => setCreatedFrom(e.target.value)} />
                  <Label htmlFor="createdTo">Created To</Label>
                  <Input id="createdTo" type="date" value={createdTo} onChange={e => setCreatedTo(e.target.value)} />
                </div>
                <FilterDialogFooter className="flex flex-col gap-2 mt-2">
                  <Button onClick={() => { setIndustryFilter(""); setStatusFilter(""); setLocationFilter(""); setContactFilter(""); setCreatedFrom(""); setCreatedTo(""); setNameFilter(""); }}>Clear Filters</Button>
                  <Button onClick={() => setFilterOpen(false)} variant="default">Apply</Button>
                </FilterDialogFooter>
              </FilterDialogContent>
            </FilterDialog>
          </section>
        </div>
        <Sheet open={profileOpen} onOpenChange={open => { setProfileOpen(open); setIsEditing(false); }}>
          <SheetContent side="right" className="w-[40vw] min-w-[400px] max-w-[48rem] p-0">
            {selectedClient && (
              <div className="relative h-full flex flex-col">
                <div className="sticky top-0 z-10 bg-white px-6 pt-6 pb-4 shadow-sm border-b flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{isEditing ? (
                      <input
                        ref={inputRef}
                        className="font-bold text-2xl text-[#222] border rounded px-2 py-1 w-full"
                        value={editData?.name || ""}
                        onChange={e => handleEditChange("name", e.target.value)}
                      />
                    ) : (
                      selectedClient.name
                    )}</h2>
                    <div className="text-lg text-muted-foreground font-medium">
                      {isEditing ? (
                        <input
                          className="text-lg border rounded px-2 py-1 w-full"
                          value={editData?.industry || ""}
                          onChange={e => handleEditChange("industry", e.target.value)}
                        />
                      ) : (
                        selectedClient.industry
                      )}
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" aria-label="Close" onClick={() => setProfileOpen(false)} className="mt-1">
                    <X className="w-6 h-6" />
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2">
                  <div className="mb-4">
                    <div className="flex flex-col gap-1 text-sm">
                      <div><span className="font-semibold">Location:</span> {isEditing ? (
                        <input
                          className="text-sm border rounded px-2 py-1 w-full"
                          value={editData?.location || ""}
                          onChange={e => handleEditChange("location", e.target.value)}
                        />
                      ) : (
                        selectedClient.location
                      )}</div>
                      <div><span className="font-semibold">Contact:</span> {isEditing ? (
                        <input
                          className="text-sm border rounded px-2 py-1 w-full"
                          value={editData?.contact || ""}
                          onChange={e => handleEditChange("contact", e.target.value)}
                        />
                      ) : (
                        selectedClient.contact
                      )}</div>
                      <div><span className="font-semibold">Status:</span> {isEditing ? (
                        <select
                          className="text-sm border rounded px-2 py-1 w-full"
                          value={editData?.status || "Active"}
                          onChange={e => handleEditChange("status", e.target.value as "Active" | "Inactive")}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      ) : (
                        <Badge variant={selectedClient.status === "Active" ? "secondary" : "outline"}>{selectedClient.status}</Badge>
                      )}</div>
                      <div><span className="font-semibold">Created:</span> {isEditing ? (
                        <input
                          className="text-sm border rounded px-2 py-1 w-full"
                          type="date"
                          value={editData?.createdAt || ""}
                          onChange={e => handleEditChange("createdAt", e.target.value)}
                        />
                      ) : (
                        selectedClient.createdAt
                      )}</div>
                    </div>
                    {isEditing && (
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="default" onClick={handleSave}>Save</Button>
                        <Button size="sm" variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                      </div>
                    )}
                  </div>
                  {/* Tabs for Hired Staff and Hire Requests */}
                  <div className="mt-8">
                    <Tabs defaultValue="staff" className="w-full">
                      <TabsList className="mb-4 w-full">
                        <TabsTrigger value="staff" className="flex-1">Hired Staff</TabsTrigger>
                        <TabsTrigger value="requests" className="flex-1">Hire Requests</TabsTrigger>
                      </TabsList>
                      <TabsContent value="staff">
                        <AdvancedTable
                          data={(hiredStaffByClient[selectedClient.id] || []).map((s, i) => ({ ...s, id: String(i) }))}
                          columns={[
                            { key: "name", header: "Name", type: "text", searchable: true },
                            { key: "role", header: "Role", type: "text", searchable: true },
                            { key: "status", header: "Status", type: "status", statusColors: STATUS_COLORS },
                          ]}
                          title={undefined}
                          showPagination={false}
                          showPageSize={false}
                          showSearch={false}
                          showFilters={false}
                          emptyMessage="No staff hired for this client."
                          className="mb-0"
                        />
                      </TabsContent>
                      <TabsContent value="requests">
                        <AdvancedTable
                          data={(hireRequestsByClient[selectedClient.id] || []).map((r, i) => ({ ...r, id: String(i) }))}
                          columns={[
                            { key: "role", header: "Role", type: "text", searchable: true },
                            { key: "status", header: "Status", type: "status", statusColors: STATUS_COLORS },
                            { key: "date", header: "Date", type: "date" },
                          ]}
                          title={undefined}
                          showPagination={false}
                          showPageSize={false}
                          showSearch={false}
                          showFilters={false}
                          emptyMessage="No hire requests for this client."
                          className="mb-0"
                        />
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
} 