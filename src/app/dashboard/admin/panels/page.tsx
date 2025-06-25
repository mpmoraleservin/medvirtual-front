"use client";
import React, { useState } from "react";
import { AdvancedTable, TableColumn } from "@/components/ui/advanced-table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, CheckCircle } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { X } from "lucide-react";
import PanelDetailsPage from "./[id]/page";
import type { HireRequest, Candidate } from "./[id]/page";
import { PageTitle } from "@/components/ui/page-title";

// --- TypeScript interfaces ---
interface CandidatePanel {
  id: string;
  hireRequestTitle: string;
  clientName: string;
  dateCreated: string;
  status: "Panel Ready" | "Interview Scheduled" | "Awaiting Decision" | "Placement Complete";
  candidatesCount: number;
  scheduledDate?: string;
  assignedTo: string;
  priority: "High" | "Medium" | "Low";
  actions?: React.ReactNode;
  hireRequest: HireRequest;
  candidates: Candidate[];
}

// --- Mock Data ---
const mockHireRequest: HireRequest = {
  id: "hr-1",
  title: "Registered Nurse for St. Joseph's",
  clientName: "St. Joseph's Medical Center",
  department: "Nursing",
  location: "Miami, FL",
  requestedBy: "Dr. Sarah Johnson",
  practiceArea: "General Medicine",
  scheduleNeeds: "Full-time",
  roleTitle: "Registered Nurse",
  requiredSkills: ["Patient Care", "IV Therapy"],
  keyResponsibilities: "Provide direct patient care, administer medications, monitor vital signs.",
  priority: "High",
  dateSubmitted: "2024-06-15"
};
const mockCandidates: Candidate[] = [
  {
    id: "1",
    name: "Ana Torres",
    role: "Registered Nurse",
    experience: "5 years",
    location: "Miami, FL",
    avatarUrl: "",
    languages: ["English", "Spanish"],
    specializations: ["Emergency Care"],
    keyHighlight: "Bilingual with 5 years ER experience"
  }
];
const candidatePanels: CandidatePanel[] = [
  {
    id: "1",
    hireRequestTitle: "Registered Nurse for St. Joseph's",
    clientName: "St. Joseph's Medical Center",
    dateCreated: "2024-06-20",
    status: "Panel Ready",
    candidatesCount: 5,
    assignedTo: "Admin A",
    priority: "High",
    hireRequest: mockHireRequest,
    candidates: mockCandidates
  },
  {
    id: "2",
    hireRequestTitle: "Medical Assistant for Wellness Clinic",
    clientName: "Wellness Medical Clinic",
    dateCreated: "2024-06-19",
    status: "Interview Scheduled",
    candidatesCount: 4,
    scheduledDate: "2024-06-25",
    assignedTo: "Admin B",
    priority: "Medium",
    hireRequest: mockHireRequest,
    candidates: mockCandidates
  },
  {
    id: "3",
    hireRequestTitle: "Lab Technician for Community Health",
    clientName: "Community Health Center",
    dateCreated: "2024-06-18",
    status: "Awaiting Decision",
    candidatesCount: 3,
    scheduledDate: "2024-06-22",
    assignedTo: "Admin C",
    priority: "Low",
    hireRequest: mockHireRequest,
    candidates: mockCandidates
  },
  {
    id: "4",
    hireRequestTitle: "Receptionist for Family Care",
    clientName: "Family Care Associates",
    dateCreated: "2024-06-17",
    status: "Placement Complete",
    candidatesCount: 5,
    scheduledDate: "2024-06-20",
    assignedTo: "Admin A",
    priority: "Medium",
    hireRequest: mockHireRequest,
    candidates: mockCandidates
  },
  {
    id: "5",
    hireRequestTitle: "Physician Assistant for Pediatrics",
    clientName: "Pediatrics Group",
    dateCreated: "2024-06-16",
    status: "Panel Ready",
    candidatesCount: 6,
    assignedTo: "Admin B",
    priority: "High",
    hireRequest: mockHireRequest,
    candidates: mockCandidates
  },
  {
    id: "6",
    hireRequestTitle: "Nurse Practitioner for Cardiology",
    clientName: "Cardiology Associates",
    dateCreated: "2024-06-15",
    status: "Interview Scheduled",
    candidatesCount: 4,
    scheduledDate: "2024-06-26",
    assignedTo: "Admin C",
    priority: "High",
    hireRequest: mockHireRequest,
    candidates: mockCandidates
  },
  {
    id: "7",
    hireRequestTitle: "Medical Scribe for Radiology",
    clientName: "Radiology Imaging Center",
    dateCreated: "2024-06-14",
    status: "Awaiting Decision",
    candidatesCount: 3,
    scheduledDate: "2024-06-21",
    assignedTo: "Admin A",
    priority: "Medium",
    hireRequest: mockHireRequest,
    candidates: mockCandidates
  }
];

// --- Status Configuration ---
const statusConfig = [
  { key: "Panel Ready", label: "Panel Ready", color: "bg-yellow-500 text-white" },
  { key: "Interview Scheduled", label: "Interview Scheduled", color: "bg-purple-500 text-white" },
  { key: "Awaiting Decision", label: "Awaiting Decision", color: "bg-orange-500 text-white" },
  { key: "Placement Complete", label: "Placement Complete", color: "bg-green-500 text-white" }
];

// --- Table Columns ---
const columns: TableColumn<CandidatePanel>[] = [
  {
    key: "hireRequestTitle",
    header: "Hire Request",
    searchable: true,
    type: "text",
    width: "25%"
  },
  {
    key: "clientName",
    header: "Client",
    searchable: true,
    type: "text",
    width: "20%"
  },
  {
    key: "status",
    header: "Status",
    type: "status",
    statusColors: {
      "Panel Ready": "bg-yellow-500 text-white border-transparent",
      "Interview Scheduled": "bg-purple-500 text-white border-transparent",
      "Awaiting Decision": "bg-orange-500 text-white border-transparent",
      "Placement Complete": "bg-green-500 text-white border-transparent"
    },
    width: "15%"
  },
  {
    key: "candidatesCount",
    header: "Candidates",
    type: "text",
    width: "10%"
  },
  {
    key: "actions",
    header: "Actions",
    type: "action",
    width: "15%"
  }
];

function ScheduleInterviewSheet({ panel, open, onOpenChange }: { panel: CandidatePanel | null, open: boolean, onOpenChange: (open: boolean) => void }) {
  const [date, setDate] = useState(panel?.scheduledDate || "");
  const [time, setTime] = useState("");
  if (!panel) return null;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[40vw] min-w-[400px] max-w-[48rem] p-0">
        <div className="relative h-full flex flex-col">
          <Button size="icon" variant="ghost" aria-label="Close" onClick={() => onOpenChange(false)} className="absolute top-4 right-4 z-10">
            <X className="w-6 h-6" />
          </Button>
          <div className="flex-1 overflow-y-auto px-6 pb-6 pt-8">
            <h2 className="text-2xl font-bold mb-4">Schedule Interview</h2>
            <div className="mb-4">
              <div className="font-semibold">Hire Request:</div>
              <div>{panel.hireRequestTitle}</div>
              <div className="font-semibold mt-2">Client:</div>
              <div>{panel.clientName}</div>
              <div className="font-semibold mt-2">Candidates:</div>
              <div>{panel.candidatesCount}</div>
            </div>
            <div className="mb-4 flex gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input type="date" className="border rounded px-2 py-1 w-full" value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input type="time" className="border rounded px-2 py-1 w-full" value={time} onChange={e => setTime(e.target.value)} />
              </div>
            </div>
            <Button className="mt-4" disabled={!date || !time} onClick={() => { alert(`Interview scheduled for ${date} at ${time}`); onOpenChange(false); }}>Confirm & Schedule</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function CandidatePanelsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedPanel, setSelectedPanel] = useState<CandidatePanel | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [schedulePanel, setSchedulePanel] = useState<CandidatePanel | null>(null);
  const [scheduleSheetOpen, setScheduleSheetOpen] = useState(false);

  // Filter data based on status
  const filteredData = candidatePanels.filter(panel => 
    statusFilter === "All" || panel.status === statusFilter
  );

  // Handle action button click
  const handleActionClick = (panel: CandidatePanel) => {
    if (panel.status === "Panel Ready") {
      setSchedulePanel(panel);
      setScheduleSheetOpen(true);
    } else {
      setSelectedPanel(panel);
      setSheetOpen(true);
    }
  };

  // Render action button based on status
  const renderActionButton = (panel: CandidatePanel) => {
    if (panel.status === "Panel Ready") {
      return (
        <Button 
          size="sm" 
          onClick={() => handleActionClick(panel)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Schedule Interview
        </Button>
      );
    } else {
      return (
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => handleActionClick(panel)}
        >
          View Details
        </Button>
      );
    }
  };

  // Custom data with actions
  const dataWithActions = filteredData.map(panel => ({
    ...panel,
    actions: renderActionButton(panel)
  }));

  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <PageTitle title="Candidate Panels" subtitle="Manage and schedule candidate panels for client interviews" />
        {/* Filtros */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Filter by Status:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Panel Ready">Panel Ready</SelectItem>
                <SelectItem value="Interview Scheduled">Interview Scheduled</SelectItem>
                <SelectItem value="Awaiting Decision">Awaiting Decision</SelectItem>
                <SelectItem value="Placement Complete">Placement Complete</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Panel Ready</p>
                <p className="text-2xl font-bold text-foreground">
                  {candidatePanels.filter(p => p.status === "Panel Ready").length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-2xl font-bold text-foreground">
                  {candidatePanels.filter(p => p.status === "Interview Scheduled").length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Awaiting Decision</p>
                <p className="text-2xl font-bold text-foreground">
                  {candidatePanels.filter(p => p.status === "Awaiting Decision").length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-foreground">
                  {candidatePanels.filter(p => p.status === "Placement Complete").length}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Data Table */}
        <div className="mb-8">
          <AdvancedTable
            data={dataWithActions}
            columns={columns}
            title=""
            searchPlaceholder="Search by hire request or client..."
            statusConfig={statusConfig}
            statusKey="status"
            showPagination={true}
            showPageSize={true}
            showSearch={true}
            showFilters={false}
            pageSizeOptions={[5, 10, 20]}
            defaultPageSize={10}
            emptyMessage="No candidate panels found."
            className=""
          />
        </div>
        {/* Sheet lateral para detalles */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent side="right" className="w-[40vw] min-w-[400px] max-w-[48rem] p-0">
            <div className="relative h-full flex flex-col">
              <Button size="icon" variant="ghost" aria-label="Close" onClick={() => setSheetOpen(false)} className="absolute top-4 right-4 z-10">
                <X className="w-6 h-6" />
              </Button>
              <div className="flex-1 overflow-y-auto px-6 pb-6 pt-8">
                {selectedPanel && <PanelDetailsPage />}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        {/* Sheet lateral para agendar entrevista */}
        <ScheduleInterviewSheet panel={schedulePanel} open={scheduleSheetOpen} onOpenChange={setScheduleSheetOpen} />
      </div>
    </div>
  );
} 