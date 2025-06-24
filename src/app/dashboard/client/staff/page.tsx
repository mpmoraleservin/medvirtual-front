"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { DollarSign, XCircle, Filter, Eye } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription
} from "@/components/ui/sheet";

interface StaffBonus {
  amount: number;
  date: string;
  notes?: string;
}

interface HiredStaffMember {
  id: string;
  name: string;
  avatarUrl?: string;
  role: string;
  country: string;
  billRate: number;
  currency: string;
  joinDate: string;
  bonuses?: StaffBonus[];
}

const staff: HiredStaffMember[] = [
  { id: "1", name: "Jane Doe", avatarUrl: undefined, role: "Medical Assistant", country: "🇺🇸 United States", billRate: 1800, currency: "USD", joinDate: "2023-05-01", bonuses: [ { amount: 50, date: "2024-05-01", notes: "Great performance in May" }, { amount: 25, date: "2024-03-15" } ] },
  { id: "2", name: "John Smith", avatarUrl: undefined, role: "Nurse", country: "🇬🇧 United Kingdom", billRate: 1500, currency: "GBP", joinDate: "2022-11-15", bonuses: [] },
  { id: "3", name: "Emily Brown", avatarUrl: undefined, role: "Receptionist", country: "🇨🇦 Canada", billRate: 1200, currency: "CAD", joinDate: "2024-01-10", bonuses: [ { amount: 100, date: "2024-04-10", notes: "Handled extra shifts" } ] },
  { id: "4", name: "Carlos Ruiz", avatarUrl: undefined, role: "Lab Technician", country: "🇲🇽 Mexico", billRate: 1000, currency: "MXN", joinDate: "2023-09-20" },
];

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

type ModalType = null | "bonus" | "terminate" | "view";

export default function MyHiredStaffPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<ModalType>(null);
  const [selectedStaff, setSelectedStaff] = useState<HiredStaffMember | null>(null);
  const [pageSize, setPageSize] = useState<number | null>(null);
  const [manualPageSize, setManualPageSize] = useState(false);
  const [bonusAmount, setBonusAmount] = useState<string | number>("");
  const [bonusPreset, setBonusPreset] = useState<string | null>(null);
  const [bonusNotes, setBonusNotes] = useState("");
  const [terminateReason, setTerminateReason] = useState("");
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [joinDateFrom, setJoinDateFrom] = useState("");
  const [joinDateTo, setJoinDateTo] = useState("");

  useEffect(() => {
    if (manualPageSize) return;
    function calculatePageSize() {
      const rowHeight = 64;
      const headerHeight = 56;
      const filterHeight = 56;
      const titleHeight = 40;
      const paginacionHeight = 56;
      const padding = 32 + 32;
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

  useEffect(() => { setPage(1); }, [search, roleFilter, countryFilter, joinDateFrom, joinDateTo, pageSize]);

  const filteredStaff = useMemo(() => {
    return staff.filter(member => {
      const matchesSearch =
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.role.toLowerCase().includes(search.toLowerCase()) ||
        member.country.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter ? member.role.toLowerCase().includes(roleFilter.toLowerCase()) : true;
      const matchesCountry = countryFilter ? member.country.toLowerCase().includes(countryFilter.toLowerCase()) : true;
      const matchesDateFrom = joinDateFrom ? member.joinDate >= joinDateFrom : true;
      const matchesDateTo = joinDateTo ? member.joinDate <= joinDateTo : true;
      return matchesSearch && matchesRole && matchesCountry && matchesDateFrom && matchesDateTo;
    });
  }, [search, roleFilter, countryFilter, joinDateFrom, joinDateTo]);

  const effectivePageSize = pageSize ?? 5;
  const pageCount = Math.ceil(filteredStaff.length / effectivePageSize);
  const paginatedStaff = useMemo(() =>
    filteredStaff.slice((page - 1) * effectivePageSize, page * effectivePageSize),
    [filteredStaff, page, effectivePageSize]
  );

  // Bonus Modal Logic
  function handleBonusPreset(amount: string) {
    setBonusPreset(amount);
    setBonusAmount(amount);
  }
  function handleBonusOther() {
    setBonusPreset("other");
    setBonusAmount("");
  }
  function handleBonusSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Aquí iría la lógica real de bonus
    setModal(null);
    setBonusAmount("");
    setBonusPreset(null);
    setBonusNotes("");
  }
  function handleTerminateSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Aquí iría la lógica real de terminación
    setModal(null);
    setTerminateReason("");
  }

  return (
    <div className="flex flex-col w-full max-w-none px-4 sm:px-8 py-8" ref={tableContainerRef}>
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">My Hired Staff</h1>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex flex-1 gap-2">
          <Input
            type="text"
            placeholder="Search by name, role, or country..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full sm:w-64"
          />
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
              <SelectItem value={String(filteredStaff.length)}>All</SelectItem>
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
                <TableHead className="font-bold text-base text-[#222] py-4">Name</TableHead>
                <TableHead className="font-bold text-base text-[#222] py-4">Bill Rate</TableHead>
                <TableHead className="font-bold text-base text-[#222] py-4">Join Date</TableHead>
                <TableHead className="font-bold text-base text-[#222] py-4 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStaff.map((member) => (
                <TableRow key={member.id} className="bg-white border-b border-[#F1F1F1] hover:bg-[#F6F6F7] transition-colors group">
                  <TableCell className="py-3 sm:py-4 align-middle">
                    <div className="flex items-center gap-3">
                      <Avatar src={member.avatarUrl} name={member.name} />
                      <div>
                        <div className="font-semibold text-[#222] leading-tight">{member.name}</div>
                        <div className="text-sm text-muted-foreground leading-tight">{member.role} &middot; {member.country}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 sm:py-4 align-middle font-medium text-[#222]">
                    {formatCurrency(member.billRate, member.currency)}
                  </TableCell>
                  <TableCell className="py-3 sm:py-4 align-middle text-[#222]">
                    {member.joinDate}
                  </TableCell>
                  <TableCell className="py-3 sm:py-4 text-center align-middle">
                    <div className="flex justify-center gap-2">
                      <Button
                        size="icon"
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700"
                        aria-label="View Details"
                        title="View Details"
                        onClick={() => { setSelectedStaff(member); setModal("view"); }}
                      >
                        <Eye className="w-5 h-5" />
                      </Button>
                      <Button
                        size="icon"
                        className="bg-green-100 hover:bg-green-200 text-green-700"
                        aria-label="Give Bonus"
                        title="Give Bonus"
                        onClick={() => { setSelectedStaff(member); setModal("bonus"); }}
                      >
                        <DollarSign className="w-5 h-5" />
                      </Button>
                      <Button
                        size="icon"
                        className="bg-red-100 hover:bg-red-200 text-red-700"
                        aria-label="Terminate"
                        title="Terminate"
                        onClick={() => { setSelectedStaff(member); setModal("terminate"); }}
                      >
                        <XCircle className="w-5 h-5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedStaff.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No staff found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/* Cards mobile first */}
        <div className="flex flex-col gap-3 sm:hidden">
          {paginatedStaff.map((member) => (
            <div key={member.id} className="rounded-lg border bg-white p-4 flex flex-col gap-2 shadow-sm">
              <div className="flex items-center gap-3">
                <Avatar src={member.avatarUrl} name={member.name} />
                <div className="flex-1">
                  <div className="font-semibold text-[#222] leading-tight">{member.name}</div>
                  <div className="text-xs text-muted-foreground leading-tight">{member.role} &middot; {member.country}</div>
                </div>
              </div>
              <div className="flex justify-between text-xs mt-2">
                <div><span className="font-medium">Bill Rate:</span> {formatCurrency(member.billRate, member.currency)}</div>
                <div><span className="font-medium">Join:</span> {member.joinDate}</div>
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <Button size="icon" className="bg-blue-100 hover:bg-blue-200 text-blue-700" aria-label="View Details" title="View Details" onClick={() => { setSelectedStaff(member); setModal("view"); }}>
                  <Eye className="w-5 h-5" />
                </Button>
                <Button size="icon" className="bg-green-100 hover:bg-green-200 text-green-700" aria-label="Give Bonus" title="Give Bonus" onClick={() => { setSelectedStaff(member); setModal("bonus"); }}>
                  <DollarSign className="w-5 h-5" />
                </Button>
                <Button size="icon" className="bg-red-100 hover:bg-red-200 text-red-700" aria-label="Terminate" title="Terminate" onClick={() => { setSelectedStaff(member); setModal("terminate"); }}>
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ))}
          {paginatedStaff.length === 0 && (
            <div className="text-center text-muted-foreground py-8 text-xs">No staff found.</div>
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

      {/* Give Bonus Modal */}
      <Dialog open={modal === "bonus"} onOpenChange={open => { if (!open) { setModal(null); setBonusPreset(null); setBonusAmount(""); setBonusNotes(""); } }}>
        <DialogContent className="max-w-md w-full">
          <form onSubmit={handleBonusSubmit} className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>Give {selectedStaff?.name} a Bonus</DialogTitle>
              <DialogDescription>Reward your staff for outstanding work.</DialogDescription>
            </DialogHeader>
            <div className="flex gap-2">
              {["25", "50", "100"].map((amt) => (
                <Button
                  key={amt}
                  type="button"
                  variant={bonusPreset === amt ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => handleBonusPreset(amt)}
                >
                  ${amt}
                </Button>
              ))}
              <Button
                type="button"
                variant={bonusPreset === "other" ? "default" : "outline"}
                className="flex-1"
                onClick={handleBonusOther}
              >
                Other
              </Button>
            </div>
            {bonusPreset === "other" && (
              <Input
                type="number"
                min={1}
                placeholder="Enter amount"
                value={bonusAmount === "other" ? "" : bonusAmount}
                onChange={e => setBonusAmount(e.target.value)}
                required
              />
            )}
            <Textarea
              placeholder="Notes (optional)"
              value={bonusNotes}
              onChange={e => setBonusNotes(e.target.value)}
              className="min-h-[80px]"
            />
            <DialogFooter>
              <Button type="submit" className="w-full">Give Bonus</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Terminate Modal */}
      <Dialog open={modal === "terminate"} onOpenChange={open => { if (!open) { setModal(null); setTerminateReason(""); } }}>
        <DialogContent className="max-w-md w-full">
          <form onSubmit={handleTerminateSubmit} className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>Terminate {selectedStaff?.name}</DialogTitle>
              <DialogDescription>Report an issue or end the contract for this staff member.</DialogDescription>
            </DialogHeader>
            <Textarea
              placeholder="Reason for Termination"
              value={terminateReason}
              onChange={e => setTerminateReason(e.target.value)}
              className="min-h-[100px]"
              required
            />
            <DialogFooter>
              <Button type="submit" variant="destructive" className="w-full">Terminate</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Details Sheet */}
      <Sheet open={modal === "view"} onOpenChange={open => { if (!open) { setModal(null); } }}>
        <SheetContent side="right" className="w-[40vw] min-w-[400px] max-w-[48rem]">
          <SheetHeader>
            <SheetTitle>Staff Details</SheetTitle>
            <SheetDescription>Full record for {selectedStaff?.name}</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col items-center gap-4 p-2">
            <Avatar src={selectedStaff?.avatarUrl} name={selectedStaff?.name} className="w-16 h-16 text-2xl" />
            <div className="text-center">
              <div className="font-bold text-lg text-[#222]">{selectedStaff?.name}</div>
              <div className="text-muted-foreground text-sm">{selectedStaff?.role} &middot; {selectedStaff?.country}</div>
            </div>
            <div className="w-full flex flex-col gap-2 mt-2">
              <div><span className="font-semibold">Bill Rate:</span> {selectedStaff ? formatCurrency(selectedStaff.billRate, selectedStaff.currency) : ""}</div>
              <div><span className="font-semibold">Join Date:</span> {selectedStaff?.joinDate}</div>
            </div>
            <div className="w-full mt-6">
              <div className="font-semibold mb-2 text-[#222]">Bonus History</div>
              {selectedStaff?.bonuses && selectedStaff.bonuses.length > 0 ? (
                <ul className="flex flex-col gap-2">
                  {selectedStaff.bonuses.map((bonus, idx) => (
                    <li key={idx} className="rounded-md border bg-muted p-3 flex flex-col gap-1">
                      <div className="font-medium text-green-700">+{formatCurrency(bonus.amount, selectedStaff.currency)}</div>
                      <div className="text-xs text-muted-foreground">{bonus.date}</div>
                      {bonus.notes && <div className="text-sm text-muted-foreground">{bonus.notes}</div>}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-muted-foreground">No bonuses given yet.</div>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={filterOpen} onOpenChange={setFilterOpen}>
        <DialogContent className="max-w-sm w-full">
          <DialogHeader>
            <DialogTitle>Advanced Filters</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-4 py-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" value={roleFilter} onChange={e => setRoleFilter(e.target.value)} placeholder="e.g. Nurse" />
            <Label htmlFor="country">Country</Label>
            <Input id="country" value={countryFilter} onChange={e => setCountryFilter(e.target.value)} placeholder="e.g. United States" />
            <Label>Join Date From</Label>
            <Input type="date" value={joinDateFrom} onChange={e => setJoinDateFrom(e.target.value)} />
            <Label>Join Date To</Label>
            <Input type="date" value={joinDateTo} onChange={e => setJoinDateTo(e.target.value)} />
          </div>
          <DialogFooter className="flex flex-col gap-2 mt-2">
            <Button onClick={() => { setRoleFilter(""); setCountryFilter(""); setJoinDateFrom(""); setJoinDateTo(""); }}>Clear Filters</Button>
            <Button onClick={() => setFilterOpen(false)} variant="default">Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 