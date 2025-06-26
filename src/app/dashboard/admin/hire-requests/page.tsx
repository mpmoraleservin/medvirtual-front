"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Calendar, User, Clock, ArrowRight, CheckCircle, XCircle, Filter, X, UserCheck } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import dynamic from 'next/dynamic';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar } from "@/components/ui/avatar";
import { AdvancedTable, TableColumn } from '@/components/ui/advanced-table';

// Importa el componente de create-panel dinámicamente (sin SSR)
const CreatePanel = dynamic(() => import('./[id]/create-panel/page'), { ssr: false });

// --- TypeScript interfaces ---
interface Candidate {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
}

interface AICandidate {
  id: string;
  rank: number;
  name: string;
  role: string;
  experience: string;
  location: string;
  skills: string[];
  matchScore: number;
  availability: string;
  certifications: string[];
}

interface HireRequest {
  id: string;
  clientName: string;
  role: string;
  dateSubmitted: string;
  assignedTo: string;
  status: "New" | "Sourcing" | "Panel Ready" | "Interview Scheduled" | "Awaiting Decision" | "Placement Complete" | "Canceled";
  priority: "High" | "Medium" | "Low";
  candidatesCount?: number;
  panelDate?: string;
  interviewDate?: string;
  candidates?: Candidate[];
  description?: string;
  department?: string;
  location?: string;
  requestedBy?: string;
  practiceArea?: string;
  scheduleNeeds?: string;
  roleTitle?: string;
  requiredSkills?: string[];
  keyResponsibilities?: string;
}

// --- Mock Data ---
const mockCandidates: Candidate[] = [
  { id: '1', name: 'Ana Torres', role: 'Registered Nurse' },
  { id: '2', name: 'Luis Fernández', role: 'Medical Assistant' },
  { id: '3', name: 'Emily Brown', role: 'Lab Technician' },
  { id: '4', name: 'Carlos Ruiz', role: 'Physician Assistant' },
  { id: '5', name: 'Sofia Martinez', role: 'Receptionist' },
];

// Fecha base: hoy es 2025-06-25
const today = new Date(2025, 5, 25); // Mes 5 = Junio (0-indexed)
function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

const hireRequests: HireRequest[] = Array.from({ length: 20 }).map((_, i) => {
  // dateSubmitted: entre hoy y hace 29 días
  const dateSubmitted = new Date(today);
  dateSubmitted.setDate(today.getDate() - (i % 30));

  // panelDate: 2-7 días después de dateSubmitted, solo para algunos
  let panelDate: string | undefined = undefined;
  if (i % 3 === 0) {
    const d = new Date(dateSubmitted);
    d.setDate(today.getDate() + 2 + (i % 6));
    panelDate = formatDate(d);
  }

  // interviewDate: 5-10 días después de dateSubmitted, solo para algunos
  let interviewDate: string | undefined = undefined;
  if (i % 4 === 0) {
    const d = new Date(dateSubmitted);
    d.setDate(today.getDate() + 5 + (i % 5));
    interviewDate = formatDate(d);
  }

  // Mock extra fields
  const departments = ["Reception", "Nursing", "Lab", "Medical", "Billing", "Radiology", "Surgery"];
  const locations = ["Miami, FL", "Orlando, FL", "Tampa, FL", "Jacksonville, FL", "Fort Lauderdale, FL"];
  const requestedBys = ["Dr. Smith", "Dr. Lee", "Dr. Patel", "Dr. Gomez", "Dr. Johnson"];

  return {
    id: (i + 1).toString(),
    clientName: ["Dr. Smith", "Health Clinic", "Wellness Center", "Family Care", "Pediatrics Group"][i % 5],
    role: ["Registered Nurse", "Medical Assistant", "Lab Technician", "Receptionist", "Physician"][i % 5],
    dateSubmitted: formatDate(dateSubmitted),
    assignedTo: ["Admin A", "Admin B", "Admin C", "Unassigned"][i % 4],
    status: (["New", "Sourcing", "Panel Ready", "Interview Scheduled", "Awaiting Decision", "Placement Complete", "Canceled"] as HireRequest["status"][])[i % 7],
    priority: (["High", "Medium", "Low"] as HireRequest["priority"][])[i % 3],
    candidatesCount: 7 + (i % 5),
    panelDate,
    interviewDate: interviewDate || formatDate(new Date(dateSubmitted.getTime() + 7 * 24 * 60 * 60 * 1000)),
    candidates: i % 2 === 0 ? mockCandidates.slice(0, 3) : mockCandidates.slice(2, 5),
    description: `This is a mock description for the role of ${["Registered Nurse", "Medical Assistant", "Lab Technician", "Receptionist", "Physician"][i % 5]}.`,
    department: departments[i % departments.length],
    location: locations[i % locations.length],
    requestedBy: requestedBys[i % requestedBys.length],
    practiceArea: ["General Medicine", "Pediatrics", "Cardiology", "Dermatology", "Radiology"][i % 5],
    scheduleNeeds: i % 2 === 0 ? "Full-time" : "Part-time",
    roleTitle: ["Registered Nurse", "Medical Assistant", "Lab Technician", "Receptionist", "Physician"][i % 5],
    requiredSkills: ["Teamwork", "Empathy", "Attention to Detail", "Communication", "Problem Solving"].slice(0, (i % 5) + 1),
    keyResponsibilities: `Key responsibilities for this role include: ${["Patient care", "Lab work", "Reception duties", "Medical assistance", "Scheduling"][i % 5]}.`,
  };
});

const statusConfig = {
  "New": { label: "New", color: "bg-gray-500 text-white", count: 0, description: "Cliente acaba de enviar la solicitud" },
  "Sourcing": { label: "Sourcing", color: "bg-blue-500 text-white", count: 0, description: "Buscando candidatos en el pool" },
  "Panel Ready": { label: "Panel Ready", color: "bg-yellow-500 text-white", count: 0, description: "5 candidatos seleccionados" },
  "Interview Scheduled": { label: "Interview Scheduled", color: "bg-purple-500 text-white", count: 0, description: "Entrevista agendada" },
  "Awaiting Decision": { label: "Awaiting Decision", color: "bg-orange-500 text-white", count: 0, description: "Esperando decisión del cliente" },
  "Placement Complete": { label: "Placement Complete", color: "bg-green-500 text-white", count: 0, description: "Contratación completada" },
  "Canceled": { label: "Canceled", color: "bg-red-500 text-white", count: 0, description: "Solicitud cancelada" },
};

const priorityColors = {
  "High": "bg-red-100 text-red-700 border-red-200",
  "Medium": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "Low": "bg-green-100 text-green-700 border-green-200",
};

const allStatuses = [
  "New",
  "Sourcing",
  "Panel Ready",
  "Interview Scheduled",
  "Awaiting Decision",
  "Placement Complete",
  "Canceled"
];

// Mock AI Top 10 candidates
const AI_TOP_10 = [
  {
    id: 'ai-1',
    rank: 1,
    name: 'Dr. Sarah Chen',
    role: 'Cardiologist',
    experience: '8 years',
    location: 'Miami, FL',
    skills: ['Interventional Cardiology', 'Echocardiography', 'Patient Care'],
    matchScore: 98,
    availability: 'Immediate',
    certifications: ['Board Certified', 'ACLS', 'BLS']
  },
  {
    id: 'ai-2',
    rank: 2,
    name: 'Maria Rodriguez',
    role: 'Registered Nurse',
    experience: '5 years',
    location: 'Orlando, FL',
    skills: ['Critical Care', 'IV Therapy', 'Patient Assessment'],
    matchScore: 95,
    availability: '2 weeks',
    certifications: ['RN License', 'BLS', 'ACLS']
  },
  {
    id: 'ai-3',
    rank: 3,
    name: 'Dr. James Wilson',
    role: 'Family Physician',
    experience: '12 years',
    location: 'Tampa, FL',
    skills: ['Primary Care', 'Preventive Medicine', 'Chronic Disease Management'],
    matchScore: 92,
    availability: '1 month',
    certifications: ['Board Certified', 'DEA License']
  },
  {
    id: 'ai-4',
    rank: 4,
    name: 'Jennifer Martinez',
    role: 'Medical Assistant',
    experience: '3 years',
    location: 'Jacksonville, FL',
    skills: ['Vital Signs', 'Phlebotomy', 'EKG'],
    matchScore: 89,
    availability: 'Immediate',
    certifications: ['CMA', 'CPR Certified']
  },
  {
    id: 'ai-5',
    rank: 5,
    name: 'Dr. Ahmed Hassan',
    role: 'Radiologist',
    experience: '6 years',
    location: 'Fort Lauderdale, FL',
    skills: ['MRI Interpretation', 'CT Scans', 'Diagnostic Imaging'],
    matchScore: 87,
    availability: '3 weeks',
    certifications: ['Board Certified', 'State License']
  },
  {
    id: 'ai-6',
    rank: 6,
    name: 'Lisa Thompson',
    role: 'Lab Technician',
    experience: '4 years',
    location: 'Miami, FL',
    skills: ['Blood Analysis', 'Microbiology', 'Quality Control'],
    matchScore: 85,
    availability: 'Immediate',
    certifications: ['MLT', 'ASCP Certified']
  },
  {
    id: 'ai-7',
    rank: 7,
    name: 'Dr. Emily Davis',
    role: 'Pediatrician',
    experience: '7 years',
    location: 'Orlando, FL',
    skills: ['Child Development', 'Vaccinations', 'Well-child Care'],
    matchScore: 83,
    availability: '2 weeks',
    certifications: ['Board Certified', 'Pediatric Advanced Life Support']
  },
  {
    id: 'ai-8',
    rank: 8,
    name: 'Carlos Mendez',
    role: 'Receptionist',
    experience: '2 years',
    location: 'Tampa, FL',
    skills: ['Patient Scheduling', 'Insurance Verification', 'Customer Service'],
    matchScore: 80,
    availability: 'Immediate',
    certifications: ['Medical Office Administration']
  },
  {
    id: 'ai-9',
    rank: 9,
    name: 'Dr. Robert Kim',
    role: 'Dermatologist',
    experience: '9 years',
    location: 'Fort Lauderdale, FL',
    skills: ['Skin Cancer Screening', 'Cosmetic Procedures', 'Dermatopathology'],
    matchScore: 78,
    availability: '1 month',
    certifications: ['Board Certified', 'Fellowship Trained']
  },
  {
    id: 'ai-10',
    rank: 10,
    name: 'Amanda Foster',
    role: 'Nurse Practitioner',
    experience: '6 years',
    location: 'Jacksonville, FL',
    skills: ['Primary Care', 'Health Assessment', 'Prescription Management'],
    matchScore: 75,
    availability: '3 weeks',
    certifications: ['APRN', 'FNP-BC', 'DEA License']
  }
];

// Columns for candidate tables
const candidateColumns: TableColumn<Candidate & { action: React.ReactNode }>[] = [
  { key: 'name', header: 'Name', searchable: true, type: 'text' },
  { key: 'role', header: 'Role', searchable: true, type: 'text' },
  { key: 'action', header: '', type: 'action' },
];

const aiTop10Columns: TableColumn<AICandidate & { action: React.ReactNode }>[] = [
  { key: 'rank', header: '#', type: 'text' },
  { key: 'name', header: 'Name', searchable: true, type: 'text' },
  { key: 'role', header: 'Role', searchable: true, type: 'text' },
  { key: 'matchScore', header: 'Match %', type: 'text' },
  { key: 'experience', header: 'Experience', type: 'text' },
  { key: 'location', header: 'Location', type: 'text' },
  { key: 'availability', header: 'Availability', type: 'text' },
  { key: 'action', header: '', type: 'action' },
];

export default function HireRequestsWorkflow() {
  const [search, setSearch] = useState("");
  const [assignedFilter, setAssignedFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [requests, setRequests] = useState<HireRequest[]>(hireRequests);
  const [selectedRequest, setSelectedRequest] = useState<HireRequest | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('hireRequestsVisibleColumns');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return allStatuses;
  });
  const [showColumnDialog, setShowColumnDialog] = useState(false);
  const [panelModalOpen, setPanelModalOpen] = useState(false);
  const [panelRequestId, setPanelRequestId] = useState<string | null>(null);
  const [candidateModal, setCandidateModal] = useState<{ open: boolean, candidate: (Candidate | AICandidate) | null }>({ open: false, candidate: null });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('hireRequestsVisibleColumns', JSON.stringify(visibleColumns));
    }
  }, [visibleColumns]);

  // Filter and group requests by status
  const groupedRequests = useMemo(() => {
    const filtered = requests.filter(request => {
      const matchesSearch = 
        request.clientName.toLowerCase().includes(search.toLowerCase()) ||
        request.role.toLowerCase().includes(search.toLowerCase());
      const matchesAssigned = assignedFilter === "All" || request.assignedTo === assignedFilter;
      const matchesPriority = priorityFilter === "All" || request.priority === priorityFilter;
      return matchesSearch && matchesAssigned && matchesPriority;
    });
    const grouped: Record<string, HireRequest[]> = {
      "New": [],
      "Sourcing": [],
      "Panel Ready": [],
      "Interview Scheduled": [],
      "Awaiting Decision": [],
      "Placement Complete": [],
      "Canceled": [],
    };
    filtered.forEach(r => grouped[r.status].push(r));
    Object.keys(statusConfig).forEach(status => {
      statusConfig[status as keyof typeof statusConfig].count = grouped[status as keyof typeof grouped].length;
    });
    return grouped;
  }, [requests, search, assignedFilter, priorityFilter]);

  const statusOrder = [
    "New",
    "Sourcing",
    "Panel Ready",
    "Interview Scheduled",
    "Awaiting Decision",
    "Placement Complete",
    "Canceled"
  ];

  function onDragEnd(result: DropResult) {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    const sourceStatus = source.droppableId;
    const destStatus = destination.droppableId;
    if (sourceStatus === destStatus && source.index === destination.index) return;

    setRequests(prev => {
      // Find the dragged request
      const dragged = prev.find(r => r.id === draggableId);
      if (!dragged) return prev;
      // Remove from old position
      const newList = prev.filter(r => r.id !== draggableId);
      // Update status
      const updated = { ...dragged, status: destStatus as HireRequest["status"] };
      // Find the index to insert in destination
      const destRequests = newList.filter(r => r.status === destStatus);
      const before = newList.filter(r => r.status !== destStatus);
      destRequests.splice(destination.index, 0, updated);
      return [
        ...before,
        ...destRequests
      ];
    });
  }

  const getDaysSinceSubmitted = (dateSubmitted: string) => {
    const submitted = new Date(dateSubmitted);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - submitted.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusIcon = (status: HireRequest["status"]) => {
    switch (status) {
      case "New":
        return <Clock className="w-4 h-4" />;
      case "Sourcing":
        return <User className="w-4 h-4" />;
      case "Panel Ready":
        return <CheckCircle className="w-4 h-4" />;
      case "Interview Scheduled":
        return <Calendar className="w-4 h-4" />;
      case "Awaiting Decision":
        return <Clock className="w-4 h-4" />;
      case "Placement Complete":
        return <CheckCircle className="w-4 h-4" />;
      case "Canceled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  function handleToggleColumn(status: string) {
    setVisibleColumns((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">Hire Requests</h1>
            <Button variant="ghost" size="icon" onClick={() => setShowColumnDialog(true)} title="Show/Hide Columns" aria-label="Show/Hide Columns">
              <Filter className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-muted-foreground mb-6">Manage and review all hire requests from clients</p>
          {/* Column Visibility Dialog */}
          <Dialog open={showColumnDialog} onOpenChange={setShowColumnDialog}>
            <DialogContent className="max-w-xs w-full">
              <DialogTitle className="sr-only">Show/Hide Columns</DialogTitle>
              <div className="flex flex-col gap-2">
                {allStatuses.map(status => (
                  <label key={status} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={visibleColumns.includes(status)}
                      onChange={() => handleToggleColumn(status)}
                    />
                    <span>{statusConfig[status as keyof typeof statusConfig].label}</span>
                  </label>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Input
              placeholder="Search by client or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sm:w-64"
            />
            <Select value={assignedFilter} onValueChange={setAssignedFilter}>
              <SelectTrigger className="sm:w-48">
                <SelectValue placeholder="Filter by assigned" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Assigned</SelectItem>
                <SelectItem value="Admin A">Admin A</SelectItem>
                <SelectItem value="Admin B">Admin B</SelectItem>
                <SelectItem value="Admin C">Admin C</SelectItem>
                <SelectItem value="Unassigned">Unassigned</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="sm:w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Priorities</SelectItem>
                <SelectItem value="High">High Priority</SelectItem>
                <SelectItem value="Medium">Medium Priority</SelectItem>
                <SelectItem value="Low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Workflow Board - horizontal scroll */}
        <div className="overflow-x-auto pb-4 mb-8">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex flex-row gap-4 min-w-[1200px]">
              {statusOrder.filter(status => visibleColumns.includes(status)).map((status) => (
                <Droppable droppableId={status} key={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex flex-col min-w-[320px] w-[320px] rounded-xl bg-[#F6F8FA] px-2 py-3 ${snapshot.isDraggingOver ? 'ring-2 ring-blue-400' : ''}`}
                    >
                      {/* Column Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Badge className={statusConfig[status as keyof typeof statusConfig].color}>
                            {getStatusIcon(status as HireRequest["status"])}
                            {statusConfig[status as keyof typeof statusConfig].label}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            ({statusConfig[status as keyof typeof statusConfig].count})
                          </span>
                        </div>
                      </div>
                      {/* Column Content */}
                      <div className="flex flex-col gap-3">
                        {groupedRequests[status].map((request, idx) => (
                          <Draggable draggableId={request.id} index={idx} key={request.id}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`mb-0 ${snapshot.isDragging ? 'opacity-80' : ''}`}
                              >
                                <Card className="p-4 flex flex-col gap-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                  {/* Header con botón de ver arriba a la derecha */}
                                  <div className="flex items-start justify-between mb-1">
                                    <div className="flex flex-col gap-0.5">
                                      <span className="font-semibold text-base text-foreground line-clamp-1">{request.clientName}</span>
                                      <span className="text-xs text-muted-foreground">{request.role}</span>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        title="View"
                                        aria-label="View"
                                        className="hover:bg-blue-100"
                                        onClick={() => { setSelectedRequest(request); setModalOpen(true); }}
                                      >
                                        <Eye className="w-5 h-5" />
                                      </Button>
                                      <Badge variant="outline" className={`text-xs px-2 py-0.5 ${priorityColors[request.priority]}`}>{request.priority}</Badge>
                                    </div>
                                  </div>
                                  {/* Details */}
                                  <div className="flex flex-col gap-1 text-xs text-muted-foreground mb-1">
                                    <div className="flex items-center gap-1">
                                      <User className="w-3 h-3" />
                                      <span>{request.assignedTo}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      <span>{request.dateSubmitted}</span>
                                      <span className="text-orange-600">({getDaysSinceSubmitted(request.dateSubmitted)}d ago)</span>
                                    </div>
                                    {request.candidatesCount && (
                                      <div className="flex items-center gap-1">
                                        <span className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px]">{request.candidatesCount}</span>
                                        <span>candidates</span>
                                      </div>
                                    )}
                                    {request.interviewDate && (
                                      <div className="flex items-center gap-1 text-green-600">
                                        <Clock className="w-3 h-3" />
                                        <span>Interview: {request.interviewDate}</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100 mt-2">
                                    {status === "Panel Ready" && (
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        title="Schedule Interview"
                                        aria-label="Schedule Interview"
                                        className="hover:bg-green-100"
                                        onClick={() => { setPanelRequestId(request.id); setPanelModalOpen(true); }}
                                      >
                                        <ArrowRight className="w-5 h-5" />
                                      </Button>
                                    )}
                                  </div>
                                </Card>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        {groupedRequests[status].length === 0 && (
                          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm border-2 border-dashed border-muted-foreground/30 rounded-lg">
                            No requests
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>
      {/* View Details Sheet */}
      {selectedRequest && (
        <Sheet open={modalOpen} onOpenChange={setModalOpen}>
          <SheetContent side="right" className="w-[40vw] min-w-[400px] max-w-[48rem] p-0">
            {selectedRequest && (
              <div className="relative h-full flex flex-col">
                <div className="sticky top-0 z-10 bg-white px-6 pt-6 pb-4 shadow-sm border-b flex items-center justify-between gap-2">
                  <div className="flex items-center gap-4">
                    <Avatar name={selectedRequest.clientName} src={selectedRequest.candidates?.[0].avatarUrl} className="w-14 h-14 text-2xl" />
                    <div>
                      <h2 className="text-2xl font-bold">{selectedRequest.clientName}</h2>
                      <div className="text-lg text-muted-foreground font-medium">{selectedRequest.roleTitle}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button className="gap-2" variant="accent" onClick={() => alert(`Request interview with ${selectedRequest.clientName}`)}>
                      <UserCheck className="w-4 h-4" /> Interview
                    </Button>
                    <Button size="icon" variant="ghost" aria-label="Close" onClick={() => setModalOpen(false)} className="mt-1">
                      <X className="w-6 h-6" />
                    </Button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
                    {/* Client */}
                    <div>
                      <div className="font-semibold text-sm text-[#222] mb-1">Client</div>
                      <div className="font-normal text-base text-muted-foreground">{selectedRequest.clientName}</div>
                    </div>
                    {/* Role Title */}
                    <div>
                      <div className="font-semibold text-sm text-[#222] mb-1">Role Title</div>
                      <div className="font-normal text-base text-muted-foreground">{selectedRequest.roleTitle}</div>
                    </div>
                    {/* Practice Area | Schedule Needs */}
                    <div>
                      <div className="font-semibold text-sm text-[#222] mb-1">Practice Area</div>
                      <div className="font-normal text-base text-muted-foreground">{selectedRequest.practiceArea}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-[#222] mb-1">Schedule Needs</div>
                      <div className="font-normal text-base text-muted-foreground">{selectedRequest.scheduleNeeds}</div>
                    </div>
                    {/* Required Skills */}
                    <div className="md:col-span-2">
                      <div className="font-semibold text-sm text-[#222] mb-1">Required Skills</div>
                      <div className="flex flex-wrap gap-2">
                        {(selectedRequest.requiredSkills || []).map(skill => (
                          <span key={skill} className="inline-block bg-gray-100 text-gray-800 rounded px-2 py-0.5 text-xs font-medium">{skill}</span>
                        ))}
                      </div>
                    </div>
                    {/* Key Responsibilities */}
                    <div className="md:col-span-2">
                      <div className="font-semibold text-sm text-[#222] mb-1">Key Responsibilities</div>
                      <div className="font-normal text-base text-muted-foreground">{selectedRequest.keyResponsibilities}</div>
                    </div>
                    {/* Location | Contact */}
                    <div>
                      <div className="font-semibold text-sm text-[#222] mb-1">Location</div>
                      <div className="font-normal text-base text-muted-foreground">{selectedRequest.location}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-[#222] mb-1">Contact</div>
                      <div className="font-normal text-base text-muted-foreground">{selectedRequest.requestedBy}</div>
                    </div>
                    {/* Status | Created */}
                    <div>
                      <div className="font-semibold text-sm text-[#222] mb-1">Status</div>
                      <Badge className={statusConfig[selectedRequest.status].color}>{selectedRequest.status}</Badge>
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-[#222] mb-1">Created</div>
                      <div className="font-normal text-base text-muted-foreground">{selectedRequest.dateSubmitted}</div>
                    </div>
                  </div>
                  {/* Tabs for Candidates Assigned and AI Top 10 */}
                  <Tabs defaultValue="ai" className="w-full mt-6">
                    <TabsList className="w-full grid grid-cols-2">
                      <TabsTrigger value="ai" className="w-full">AI Top 10</TabsTrigger>
                      <TabsTrigger value="panel" className="w-full">Panel</TabsTrigger>
                    </TabsList>
                    <TabsContent value="ai">
                      <AdvancedTable
                        data={AI_TOP_10.map(c => ({ ...c, action: <Button size="icon" className="bg-blue-100 hover:bg-blue-200 text-blue-700" onClick={() => setCandidateModal({ open: true, candidate: c })}><Eye className="w-5 h-5" /></Button> }))}
                        columns={aiTop10Columns}
                        title={undefined}
                        statusKey={undefined}
                        showPagination={false}
                        showSearch={false}
                        showFilters={false}
                        showPageSize={false}
                        defaultPageSize={5}
                        pageSizeOptions={[5]}
                        emptyMessage="No AI candidates."
                        className="mt-4 h-[600px]"
                      />
                    </TabsContent>
                    <TabsContent value="panel">
                      <AdvancedTable
                        data={(selectedRequest.candidates || []).map((c) => ({ ...c, action: <Button size="icon" className="bg-blue-100 hover:bg-blue-200 text-blue-700" onClick={() => setCandidateModal({ open: true, candidate: c })}><Eye className="w-5 h-5" /></Button> }))}
                        columns={candidateColumns}
                        title={undefined}
                        statusKey={undefined}
                        showPagination={false}
                        showSearch={false}
                        showFilters={false}
                        showPageSize={false}
                        emptyMessage="No candidates assigned."
                        className="mt-4"
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      )}
      {/* Modal Dialog para Create Panel */}
      <Dialog open={panelModalOpen} onOpenChange={open => { setPanelModalOpen(open); if (!open) setPanelRequestId(null); }}>
        <DialogContent className="w-screen h-screen max-w-5xl max-h-[95vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden p-0">
          {panelRequestId && <CreatePanel key={panelRequestId} />}
        </DialogContent>
      </Dialog>
      {/* Modal simple para ver registro de candidato */}
      {candidateModal.open && candidateModal.candidate && (
        <Dialog open={candidateModal.open} onOpenChange={open => setCandidateModal({ open, candidate: open ? candidateModal.candidate : null })}>
          <DialogContent className="max-w-md w-full">
            <DialogTitle>Candidate Record</DialogTitle>
            <div className="flex flex-col gap-2 mt-2">
              <div><span className="font-semibold">Name:</span> {candidateModal.candidate.name}</div>
              <div><span className="font-semibold">Role:</span> {candidateModal.candidate.role}</div>
              {'rank' in candidateModal.candidate && candidateModal.candidate.rank && (
                <div><span className="font-semibold">Ranking:</span> {candidateModal.candidate.rank}</div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 