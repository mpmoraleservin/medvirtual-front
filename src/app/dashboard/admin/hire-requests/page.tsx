"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Calendar, User, Clock, ArrowRight, CheckCircle, XCircle, Filter, X, UserCheck, AlertCircle, CheckSquare, Users, MoreHorizontal, ArrowLeft, RotateCcw } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import dynamic from 'next/dynamic';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar } from "@/components/ui/avatar";
import { AdvancedTable, TableColumn } from '@/components/ui/advanced-table';


// Import the create-panel component dynamically (without SSR)
const CreatePanelModal = dynamic(() => import('./[id]/create-panel/page'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
});

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
  clientName: string;
  role: string;
  dateSubmitted: string;
  assignedTo: string;
  status: HireRequestStatus;
  candidatesCount?: number;
  panelDate?: string;
  interviewDate?: string;
  interviewTime?: string;
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
  decisionDeadline?: string;
  winner?: Candidate;
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
  // dateSubmitted: between today and 29 days ago
  const dateSubmitted = new Date(today);
  dateSubmitted.setDate(today.getDate() - (i % 30));

  // panelDate: 2-7 days after dateSubmitted, only for some
  let panelDate: string | undefined = undefined;
  if (i % 3 === 0) {
    const d = new Date(dateSubmitted);
    d.setDate(d.getDate() + 2 + (i % 6));
    panelDate = formatDate(d);
  }

  // interviewDate: 5-10 days after dateSubmitted, only for some
  let interviewDate: string | undefined = undefined;
  let interviewTime: string | undefined = undefined;
  if (i % 4 === 0) {
    const d = new Date(dateSubmitted);
    d.setDate(d.getDate() + 5 + (i % 6));
    interviewDate = formatDate(d);
    // Siempre asigna una hora para interviewTime si hay interviewDate
    interviewTime = `${9 + (i % 8)}:00`;
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
    candidatesCount: 7 + (i % 5),
    panelDate,
    interviewDate,
    interviewTime, // SIEMPRE presente si hay interviewDate
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
    decisionDeadline: i % 2 === 0 ? formatDate(new Date(today.getTime() + (i % 10) * 24 * 60 * 60 * 1000)) : undefined,
    winner: i % 2 === 0 ? mockCandidates[Math.floor(Math.random() * mockCandidates.length)] : undefined,
  };
});

// Unified status configuration using app's design system
const statusConfig = {
  "Pending Signature": { 
    label: "Pending Signature", 
    color: "bg-chart-5 text-primary-foreground", 
    count: 0, 
    description: "Waiting for client to sign service agreement" 
  },
  "New": { 
    label: "New", 
    color: "bg-muted-foreground text-primary-foreground", 
    count: 0, 
    description: "Client just submitted the request" 
  },
  "Sourcing": { 
    label: "Sourcing", 
    color: "bg-primary text-primary-foreground", 
    count: 0, 
    description: "Searching for candidates in the pool" 
  },
  "Panel Ready": { 
    label: "Panel Ready", 
    color: "bg-chart-3 text-primary-foreground", 
    count: 0, 
    description: "Candidates selected and ready for review" 
  },
  "Interview Scheduled": { 
    label: "Interview Scheduled", 
    color: "bg-chart-5 text-primary-foreground", 
    count: 0, 
    description: "Interview scheduled with client" 
  },
  "Awaiting Decision": { 
    label: "Awaiting Decision", 
    color: "bg-chart-4 text-primary-foreground", 
    count: 0, 
    description: "Waiting for client decision" 
  },
  "Placement Complete": { 
    label: "Placement Complete", 
    color: "bg-chart-2 text-primary-foreground", 
    count: 0, 
    description: "Hiring completed successfully" 
  },
  "Canceled": { 
    label: "Canceled", 
    color: "bg-destructive text-primary-foreground", 
    count: 0, 
    description: "Request canceled" 
  },
};

const allStatuses = [
  "Pending Signature",
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



const aiTop10Columns: TableColumn<AICandidate>[] = [
  { key: 'rank', header: '#', type: 'text' },
  { key: 'name', header: 'Name', searchable: true, type: 'text' },
  { key: 'role', header: 'Role', searchable: true, type: 'text' },
  { key: 'matchScore', header: 'Match %', type: 'text' },
  { key: 'experience', header: 'Experience', type: 'text' },
  { key: 'location', header: 'Location', type: 'text' },
  { key: 'availability', header: 'Availability', type: 'text' },
];

// Configuración de columnas y filtros para la talent pool (igual que All Candidates)
const candidateTableColumns: TableColumn<Candidate>[] = [
  { key: "name", header: "Name", searchable: true, type: "text" },
  { key: "role", header: "Role", searchable: true, type: "text" },
];
const candidateTableFilters = [
  { key: "name" as keyof Candidate, label: "Name", type: "text" as const, placeholder: "e.g. Ana" },
  { key: "role" as keyof Candidate, label: "Role", type: "text" as const, placeholder: "e.g. Nurse" },
];



export default function HireRequestsWorkflow() {
  const [search, setSearch] = useState("");
  const [assignedFilter, setAssignedFilter] = useState("All");
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
  const [reassignModal, setReassignModal] = useState<{ open: boolean, request: HireRequest | null }>({ open: false, request: null });
  const [scheduleModal, setScheduleModal] = useState<{ open: boolean, request: HireRequest | null }>({ open: false, request: null });

  const [seePanelModal, setSeePanelModal] = useState<{ open: boolean, request: HireRequest | null }>({ open: false, request: null });
  const [readyDecisionModal, setReadyDecisionModal] = useState<{ open: boolean, request: HireRequest | null }>({ open: false, request: null });
  const [panelReadyModal, setPanelReadyModal] = useState<{ open: boolean, request: HireRequest | null }>({ open: false, request: null });
  const [reassignAssignee, setReassignAssignee] = useState<string>("");
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const [scheduleDate, setScheduleDate] = useState<string>("");
  const [scheduleTime, setScheduleTime] = useState<string>("");
  const [decisionDeadline, setDecisionDeadline] = useState<string>("");
  const [panelReadyVisible, setPanelReadyVisible] = useState<boolean>(true);
  const [editPanelCandidates, setEditPanelCandidates] = useState<string[]>([]);

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
      return matchesSearch && matchesAssigned;
    });
    const grouped: Record<string, HireRequest[]> = {
      "Pending Signature": [],
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
  }, [requests, search, assignedFilter]);

  const statusOrder = [
    "Pending Signature",
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



  const getStatusIcon = (status: HireRequestStatus) => {
    switch (status) {
      case "Pending Signature":
        return <Clock className="w-4 h-4" />
      case "New":
        return <Clock className="w-4 h-4" />
      case "Sourcing":
        return <User className="w-4 h-4" />
      case "Panel Ready":
        return <CheckCircle className="w-4 h-4" />
      case "Interview Scheduled":
        return <Calendar className="w-4 h-4" />
      case "Awaiting Decision":
        return <AlertCircle className="w-4 h-4" />
      case "Placement Complete":
        return <CheckSquare className="w-4 h-4" />
      case "Canceled":
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  };

  function handleToggleColumn(status: string) {
    setVisibleColumns((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  }

  // Contador para Awaiting Decision
  const AwaitingDecisionCountdown = ({ deadline }: { deadline: string }) => {
    const [timeLeft, setTimeLeft] = useState<number>(() => {
      const now = new Date();
      const end = new Date(deadline);
      return Math.max(0, end.getTime() - now.getTime());
    });
    useEffect(() => {
      if (timeLeft <= 0) return;
      const interval = setInterval(() => {
        setTimeLeft(t => Math.max(0, t - 1000));
      }, 1000);
      return () => clearInterval(interval);
    }, [timeLeft]);
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    return (
              <div className={`rounded-lg px-3 py-1 text-sm font-semibold flex items-center gap-2 ${timeLeft === 0 ? 'bg-destructive/10 text-destructive' : 'bg-chart-4/10 text-chart-4'}`}>
        <Clock className="w-4 h-4" />
        {timeLeft === 0 ? 'Expired' : `${hours}h ${minutes}m ${seconds}s`}
      </div>
    );
  };

  // Reassign logic
  const handleReassignConfirm = () => {
    if (!reassignModal.request) return;
    setRequests(prev => prev.map(r => r.id === reassignModal.request!.id ? { ...r, assignedTo: reassignAssignee } : r));
    setReassignModal({ open: false, request: null });
    setReassignAssignee("");
  };

  // See Panel logic (edit candidates)
  const handleEditPanelConfirm = () => {
    if (!seePanelModal.request) return;
    const selectedCandidates = mockCandidates.filter(c => editPanelCandidates.includes(c.id));
    setRequests(prev => prev.map(r => r.id === seePanelModal.request!.id ? { ...r, candidates: selectedCandidates } : r));
    setSeePanelModal({ open: false, request: null });
    setEditPanelCandidates([]);
  };

  // Panel Ready logic
  const handlePanelReadyConfirm = () => {
    if (!panelReadyModal.request) return;
    setRequests(prev => prev.map(r => r.id === panelReadyModal.request!.id ? { ...r, status: "Panel Ready" } : r));
    setPanelReadyModal({ open: false, request: null });
    setPanelReadyVisible(true);
  };

  // Schedule Interview logic
  const handleScheduleConfirm = () => {
    if (!scheduleModal.request) return;
    setRequests(prev => prev.map(r => r.id === scheduleModal.request!.id ? { ...r, interviewDate: scheduleDate, interviewTime: scheduleTime, status: "Interview Scheduled" } : r));
    setScheduleModal({ open: false, request: null });
    setScheduleDate("");
    setScheduleTime("");
  };

  // Ready for Decision logic
  const handleReadyDecisionConfirm = () => {
    if (!readyDecisionModal.request) return;
    setRequests(prev => prev.map(r => r.id === readyDecisionModal.request!.id ? { ...r, decisionDeadline, status: "Awaiting Decision" } : r));
    setReadyDecisionModal({ open: false, request: null });
    setDecisionDeadline("");
  };

  // Handle status changes
  const handleStatusChange = (requestId: string, newStatus: HireRequest["status"]) => {
    setRequests(prev => prev.map(request => 
      request.id === requestId 
        ? { ...request, status: newStatus }
        : request
    ));
    setActionMenuOpen(null);
  };

  // Get available actions for a request based on its current status
  const getAvailableActions = (request: HireRequest) => {
    const actions = [];
    
    // Add reassign action for all statuses that support it
    if (["Pending Signature", "New", "Sourcing", "Panel Ready", "Interview Scheduled"].includes(request.status)) {
      actions.push(
        { label: "Reassign", action: () => setReassignModal({ open: true, request }), icon: <User className="w-4 h-4" /> }
      );
    }
    
    switch (request.status) {
      case "Pending Signature":
        actions.push(
          { label: "Move to New", action: () => handleStatusChange(request.id, "New"), icon: <ArrowRight className="w-4 h-4" /> },
          { label: "Cancel Request", action: () => handleStatusChange(request.id, "Canceled"), icon: <XCircle className="w-4 h-4" /> }
        );
        break;
      case "New":
        actions.push(
          { label: "Start Sourcing", action: () => handleStatusChange(request.id, "Sourcing"), icon: <ArrowRight className="w-4 h-4" /> },
          { label: "Create Interview Panel", action: () => { setPanelModalOpen(true); setPanelRequestId(request.id); }, icon: <Users className="w-4 h-4" /> },
          { label: "Cancel Request", action: () => handleStatusChange(request.id, "Canceled"), icon: <XCircle className="w-4 h-4" /> }
        );
        break;
      case "Sourcing":
        actions.push(
          { label: "Back to New", action: () => handleStatusChange(request.id, "New"), icon: <ArrowLeft className="w-4 h-4" /> },
          { label: "See Panel", action: () => setSeePanelModal({ open: true, request }), icon: <Eye className="w-4 h-4" /> },
          { label: "Mark Panel Ready", action: () => setPanelReadyModal({ open: true, request }), icon: <CheckCircle className="w-4 h-4" /> },
          { label: "Cancel Request", action: () => handleStatusChange(request.id, "Canceled"), icon: <XCircle className="w-4 h-4" /> }
        );
        break;
      case "Panel Ready":
        actions.push(
          { label: "Back to Sourcing", action: () => handleStatusChange(request.id, "Sourcing"), icon: <ArrowLeft className="w-4 h-4" /> },
          { label: "See Panel", action: () => setSeePanelModal({ open: true, request }), icon: <Eye className="w-4 h-4" /> },
          { label: "Schedule Interview", action: () => setScheduleModal({ open: true, request }), icon: <Calendar className="w-4 h-4" /> },
          { label: "Cancel Request", action: () => handleStatusChange(request.id, "Canceled"), icon: <XCircle className="w-4 h-4" /> }
        );
        break;
      case "Interview Scheduled":
        actions.push(
          { label: "Back to Panel Ready", action: () => handleStatusChange(request.id, "Panel Ready"), icon: <ArrowLeft className="w-4 h-4" /> },
          { label: "Ready for Decision", action: () => setReadyDecisionModal({ open: true, request }), icon: <ArrowRight className="w-4 h-4" /> },
          { label: "Cancel Request", action: () => handleStatusChange(request.id, "Canceled"), icon: <XCircle className="w-4 h-4" /> }
        );
        break;
      case "Awaiting Decision":
        actions.push(
          { label: "Back to Interview Scheduled", action: () => handleStatusChange(request.id, "Interview Scheduled"), icon: <ArrowLeft className="w-4 h-4" /> },
          { label: "Mark Complete", action: () => handleStatusChange(request.id, "Placement Complete"), icon: <CheckCircle className="w-4 h-4" /> },
          { label: "Cancel Request", action: () => handleStatusChange(request.id, "Canceled"), icon: <XCircle className="w-4 h-4" /> }
        );
        break;
      case "Placement Complete":
        actions.push(
          { label: "Back to Awaiting Decision", action: () => handleStatusChange(request.id, "Awaiting Decision"), icon: <ArrowLeft className="w-4 h-4" /> },
          { label: "Reopen as New", action: () => handleStatusChange(request.id, "New"), icon: <RotateCcw className="w-4 h-4" /> }
        );
        break;
      case "Canceled":
        actions.push(
          { label: "Reopen as New", action: () => handleStatusChange(request.id, "New"), icon: <RotateCcw className="w-4 h-4" /> },
          { label: "Reopen as Sourcing", action: () => handleStatusChange(request.id, "Sourcing"), icon: <RotateCcw className="w-4 h-4" /> }
        );
        break;
    }
    
    return actions;
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
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
                      className={`flex flex-col min-w-[320px] w-[320px] rounded-xl bg-muted px-2 py-3 ${snapshot.isDraggingOver ? 'ring-2 ring-primary' : ''}`}
                    >
                      {/* Column Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Badge className={statusConfig[status as keyof typeof statusConfig].color}>
                            {getStatusIcon(status as HireRequestStatus)}
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
                                <Card className="p-3 flex flex-col gap-1 bg-popover border border-border dark:border-white/10 shadow-lg hover:shadow-xl transition-shadow">
                                  {/* Header with view button and action menu on top right */}
                                  <div className="flex items-center justify-between mb-4">
                                    <div className="flex flex-col gap-0.5">
                                      <span className="font-semibold text-base text-foreground line-clamp-1">{request.clientName}</span>
                                      <span className="text-xs text-muted-foreground">{request.role}</span>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                      <div className="flex items-center gap-1">
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          title="View"
                                          aria-label="View"
                                          className="hover:bg-primary/10"
                                          onClick={() => { setSelectedRequest(request); setModalOpen(true); }}
                                        >
                                          <Eye className="w-5 h-5" />
                                        </Button>
                                        <Popover open={actionMenuOpen === request.id} onOpenChange={(open) => setActionMenuOpen(open ? request.id : null)}>
                                          <PopoverTrigger asChild>
                                            <Button
                                              size="icon"
                                              variant="ghost"
                                              title="Actions"
                                              aria-label="Actions"
                                              className="hover:bg-primary/10"
                                            >
                                              <MoreHorizontal className="w-5 h-5" />
                                            </Button>
                                          </PopoverTrigger>
                                          <PopoverContent className="w-48 p-1" align="end">
                                            <div className="space-y-1">
                                              {getAvailableActions(request).map((action, index) => (
                                                <Button
                                                  key={index}
                                                  variant="ghost"
                                                  size="sm"
                                                  className="w-full justify-start gap-2 h-8 text-sm"
                                                  onClick={action.action}
                                                >
                                                  {action.icon}
                                                  {action.label}
                                                </Button>
                                              ))}
                                            </div>
                                          </PopoverContent>
                                        </Popover>
                                      </div>
                                    </div>
                                  </div>
                                  {/* Details (sin cantidad de candidatos ni fecha) */}
                                  <div className="flex flex-col gap-1 text-xs text-muted-foreground mb-1">
                                    <div className="flex items-center gap-1">
                                      <User className="w-3 h-3" />
                                      <span>{request.assignedTo}</span>
                                    </div>
                                    {/* Si hay entrevista, mostrar solo eso */}
                                    {request.interviewDate && (
                                      <div className="flex items-center gap-1 text-chart-2">
                                        <Clock className="w-3 h-3" />
                                        <span>Interview: {request.interviewDate}{request.interviewTime ? ` ${request.interviewTime}` : ""}</span>
                                      </div>
                                    )}
                                  </div>
                                  {/* Status-specific information */}
                                  <div className="flex items-center gap-2 pt-2 mt-2 justify-end">
                                    {/* Awaiting Decision: contador */}
                                    {request.status === "Awaiting Decision" && (
                                      <AwaitingDecisionCountdown deadline={request.decisionDeadline || ''} />
                                    )}
                                    {/* Placement Complete: mostrar ganador */}
                                    {request.status === "Placement Complete" && request.winner && (
                                      <div className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-chart-2" />
                                        <span className="font-semibold text-chart-2">Winner: {request.winner.name}</span>
                                      </div>
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
                <div className="sticky top-0 z-10 bg-background px-6 pt-6 pb-4 shadow-sm border-b flex items-center justify-between gap-2">
                  <div className="flex items-center gap-4">
                    <Avatar name={selectedRequest.clientName} src={selectedRequest.candidates?.[0].avatarUrl} className="w-14 h-14 text-2xl" />
                    <div>
                      <h2 className="text-2xl font-bold">{selectedRequest.clientName}</h2>
                      <div className="text-lg text-muted-foreground font-medium">{selectedRequest.roleTitle}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button className="gap-2" variant="default" onClick={() => alert(`Request interview with ${selectedRequest.clientName}`)}>
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
                      <div className="font-semibold text-sm text-foreground mb-1">Client</div>
                      <div className="font-normal text-base text-muted-foreground">{selectedRequest.clientName}</div>
                    </div>
                    {/* Role Title */}
                    <div>
                      <div className="font-semibold text-sm text-foreground mb-1">Role Title</div>
                      <div className="font-normal text-base text-muted-foreground">{selectedRequest.roleTitle}</div>
                    </div>
                    {/* Practice Area | Schedule Needs */}
                    <div>
                      <div className="font-semibold text-sm text-foreground mb-1">Practice Area</div>
                      <div className="font-normal text-base text-muted-foreground">{selectedRequest.practiceArea}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-foreground mb-1">Schedule Needs</div>
                      <div className="font-normal text-base text-muted-foreground">{selectedRequest.scheduleNeeds}</div>
                    </div>
                    {/* Required Skills */}
                    <div className="md:col-span-2">
                      <div className="font-semibold text-sm text-foreground mb-1">Required Skills</div>
                      <div className="flex flex-wrap gap-2">
                        {(selectedRequest.requiredSkills || []).map(skill => (
                          <span key={skill} className="inline-block bg-muted text-foreground rounded px-2 py-0.5 text-xs font-medium">{skill}</span>
                        ))}
                      </div>
                    </div>
                    {/* Key Responsibilities */}
                    <div className="md:col-span-2">
                      <div className="font-semibold text-sm text-foreground mb-1">Key Responsibilities</div>
                      <div className="font-normal text-base text-muted-foreground">{selectedRequest.keyResponsibilities}</div>
                    </div>
                    {/* Location | Contact */}
                    <div>
                      <div className="font-semibold text-sm text-foreground mb-1">Location</div>
                      <div className="font-normal text-base text-muted-foreground">{selectedRequest.location}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-foreground mb-1">Contact</div>
                      <div className="font-normal text-base text-muted-foreground">{selectedRequest.requestedBy}</div>
                    </div>
                    {/* Status | Created */}
                    <div>
                      <div className="font-semibold text-sm text-foreground mb-1">Status</div>
                      <Badge className={statusConfig[selectedRequest.status].color}>{selectedRequest.status}</Badge>
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-foreground mb-1">Created</div>
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
                        data={AI_TOP_10}
                        columns={aiTop10Columns}
                        title={undefined}
                        statusKey={undefined}
                        onViewDetails={(candidate) => setCandidateModal({ open: true, candidate })}
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
                        data={mockCandidates}
                        columns={candidateTableColumns}
                        filters={candidateTableFilters}
                        showPagination={true}
                        showSearch={true}
                        showFilters={true}
                        showPageSize={true}
                        pageSizeOptions={[5, 10, 20, 50]}
                        defaultPageSize={5}
                        emptyMessage="No candidates found."
                        onViewDetails={(candidate: Candidate) => {
                          if (!editPanelCandidates.includes(candidate.id) && editPanelCandidates.length < 5) {
                            setEditPanelCandidates(prev => [...prev, candidate.id]);
                          }
                        }}
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
        <DialogContent className="w-screen h-screen max-w-5xl max-h-[95vh] bg-background rounded-xl shadow-2xl flex flex-col overflow-hidden p-0">
          {panelRequestId && <CreatePanelModal key={panelRequestId} />}
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
      {/* Modals para cada acción */}
      {/* Reassign */}
      <Dialog open={reassignModal.open} onOpenChange={open => { setReassignModal({ open, request: open ? reassignModal.request : null }); setReassignAssignee(reassignModal.request?.assignedTo || ""); }}>
        <DialogContent className="max-w-md w-full">
          <DialogTitle>Reassign Request</DialogTitle>
          <div className="mt-4">
            <Select value={reassignAssignee} onValueChange={setReassignAssignee}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Select assignee" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin A">Admin A</SelectItem>
                <SelectItem value="Admin B">Admin B</SelectItem>
                <SelectItem value="Admin C">Admin C</SelectItem>
                <SelectItem value="Unassigned">Unassigned</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex justify-end mt-4">
              <Button disabled={!reassignAssignee} onClick={handleReassignConfirm}>Confirm</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* See Panel (edit candidates) */}
      <Dialog open={seePanelModal.open} onOpenChange={open => { setSeePanelModal({ open, request: open ? seePanelModal.request : null }); setEditPanelCandidates(seePanelModal.request?.candidates?.map(c => c.id) || []); }}>
        <DialogContent className="max-w-md w-full">
          <DialogTitle>Edit Panel</DialogTitle>
          <div className="mt-4 flex flex-col gap-2">
            {mockCandidates.map(c => (
              <label key={c.id} className="flex items-center gap-2">
                <input type="checkbox" checked={editPanelCandidates.includes(c.id)} onChange={e => {
                  if (e.target.checked) setEditPanelCandidates(prev => prev.length < 5 ? [...prev, c.id] : prev);
                  else setEditPanelCandidates(prev => prev.filter(id => id !== c.id));
                }} disabled={!editPanelCandidates.includes(c.id) && editPanelCandidates.length >= 5} />
                <span>{c.name} ({c.role})</span>
              </label>
            ))}
            <div className="flex justify-end mt-4">
              <Button disabled={editPanelCandidates.length < 1} onClick={handleEditPanelConfirm}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Panel Ready */}
      <Dialog open={panelReadyModal.open} onOpenChange={open => { setPanelReadyModal({ open, request: open ? panelReadyModal.request : null }); setPanelReadyVisible(true); }}>
        <DialogContent className="max-w-md w-full">
          <DialogTitle>Confirm Panel Ready</DialogTitle>
          <div className="mt-4 flex items-center gap-2">
            <input type="checkbox" checked={panelReadyVisible} onChange={e => setPanelReadyVisible(e.target.checked)} />
            <span>Client can see the panel</span>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={handlePanelReadyConfirm}>Confirm</Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Schedule Interview */}
      <Dialog open={scheduleModal.open} onOpenChange={open => { setScheduleModal({ open, request: open ? scheduleModal.request : null }); setScheduleDate(""); setScheduleTime(""); }}>
        <DialogContent className="max-w-md w-full">
          <DialogTitle>Schedule Interview</DialogTitle>
          <div className="mt-4 flex flex-col gap-2">
            <label>Date: <Input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} /></label>
            <label>Time: <Input type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} /></label>
            <div className="flex justify-end mt-4">
              <Button disabled={!scheduleDate || !scheduleTime} onClick={handleScheduleConfirm}>Confirm</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Ready for Decision */}
      <Dialog open={readyDecisionModal.open} onOpenChange={open => { setReadyDecisionModal({ open, request: open ? readyDecisionModal.request : null }); setDecisionDeadline(""); }}>
        <DialogContent className="max-w-md w-full">
          <DialogTitle>Set Decision Deadline</DialogTitle>
          <div className="mt-4 flex flex-col gap-2">
            <label>Decision Deadline: <Input type="date" value={decisionDeadline} onChange={e => setDecisionDeadline(e.target.value)} /></label>
            <div className="flex justify-end mt-4">
              <Button disabled={!decisionDeadline} onClick={handleReadyDecisionConfirm}>Confirm</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 