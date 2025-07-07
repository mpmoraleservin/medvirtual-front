"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Calendar, User, Clock, ArrowRight, CheckCircle, XCircle, Filter, X, UserCheck, AlertCircle, CheckSquare, MoreHorizontal, ArrowLeft, RotateCcw, Trash, Edit } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar } from "@/components/ui/avatar";
import { AdvancedTable, TableColumn } from '@/components/ui/advanced-table';
import { AnimatePresence, motion } from "framer-motion";
import { Textarea } from '@/components/ui/textarea';
// import { useViewportStore } from '@/stores/viewport';


// Import the create-panel component dynamically (without SSR)
// const CreatePanelModal = dynamic(() => import('./[id]/create-panel/page'), {
//   ssr: false,
//   loading: () => <div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
// });

// --- TypeScript interfaces ---
interface Candidate {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  experience?: string;
  languages?: string[];
  specializations?: string[];
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
  winner?: string | null;
}

// --- Mock Data ---
const mockCandidates: Candidate[] = [
  { id: '1', name: 'Ana Torres', role: 'Registered Nurse' },
  { id: '2', name: 'Luis Fernández', role: 'Medical Assistant' },
  { id: '3', name: 'Emily Brown', role: 'Lab Technician' },
  { id: '4', name: 'Carlos Ruiz', role: 'Physician Assistant' },
  { id: '5', name: 'Sofia Martinez', role: 'Receptionist' },
  { id: '6', name: 'David Kim', role: 'X-Ray Technician' },
  { id: '7', name: 'Maria Lopez', role: 'Billing Coordinator' },
  { id: '8', name: 'Patricia Gomez', role: 'Medical Biller' },
  { id: '9', name: 'John Smith', role: 'Nurse Practitioner' },
  { id: '10', name: 'Lisa Anderson', role: 'Registered Nurse' },
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

  // interviewDate: 5-10 days after dateSubmitted, para todos los Interview Scheduled
  let interviewDate: string | undefined = undefined;
  let interviewTime: string | undefined = undefined;
  const status = (["New", "Sourcing", "Panel Ready", "Interview Scheduled", "Awaiting Decision", "Placement Complete", "Canceled"] as HireRequest["status"][])[i % 7];
  
  if (status === "Interview Scheduled") {
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

  // Asignar ganador solo para Placement Complete
  const winner = status === "Placement Complete" ? `panel-${(i % 5) + 1}` : undefined;
  
  // Asignar decisionDeadline solo para Awaiting Decision (1-24 horas en el futuro, excepto una que está expired)
  let decisionDeadline: string | undefined = undefined;
  if (status === "Awaiting Decision") {
    const deadline = new Date();
    if (i % 3 === 0) {
      // Una de cada 3 tarjetas Awaiting Decision estará expired (deadline en el pasado)
      deadline.setHours(deadline.getHours() - 2); // 2 horas en el pasado
    } else {
      // Las demás tendrán deadlines futuros
      deadline.setHours(deadline.getHours() + 1 + (i % 24)); // 1-24 horas en el futuro
    }
    decisionDeadline = deadline.toISOString();
  }

  return {
    id: (i + 1).toString(),
    clientName: ["Dr. Smith", "Health Clinic", "Wellness Center", "Family Care", "Pediatrics Group"][i % 5],
    role: ["Registered Nurse", "Medical Assistant", "Lab Technician", "Receptionist", "Physician"][i % 5],
    dateSubmitted: formatDate(dateSubmitted),
    assignedTo: ["Admin A", "Admin B", "Admin C", "Unassigned"][i % 4],
    status,
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
    decisionDeadline,
    winner,
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
  { key: 'matchScore', header: 'Match %', type: 'text' },
];

// Configuración de columnas y filtros para la talent pool (igual que All Candidates)
const candidateTableColumns: TableColumn<Candidate>[] = [
  { key: "name", header: "Name", searchable: true, type: "text" },
  { key: "role", header: "Role", searchable: true, type: "text" },
];
// const candidateTableFilters = [
//   { key: "name" as keyof Candidate, label: "Name", type: "text" as const, placeholder: "e.g. Ana" },
//   { key: "role" as keyof Candidate, label: "Role", type: "text" as const, placeholder: "e.g. Nurse" },
// ];



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
  // const [panelModalOpen, setPanelModalOpen] = useState(false);
  // const [panelRequestId, setPanelRequestId] = useState<string | null>(null);
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

  // Start Sourcing Modal State
  const [startSourcingModal, setStartSourcingModal] = useState<{ open: boolean; request: HireRequest | null }>({ open: false, request: null });
  const [panelCandidates, setPanelCandidates] = useState<Candidate[]>([]);
  const [candidateSearch, setCandidateSearch] = useState<string>("");

  // Mock data for candidate browser (30+ candidates)
  const allCandidates: Candidate[] = Array.from({ length: 35 }).map((_, i) => ({
    id: (i + 1).toString(),
    name: [
      "Ana Torres", "Luis Fernández", "Emily Brown", "Carlos Ruiz", "Sofia Martinez",
      "David Kim", "Maria Lopez", "Patricia Gomez", "John Smith", "Lisa Anderson",
      "Michael Johnson", "Sarah Wilson", "Robert Davis", "Jennifer Garcia", "William Rodriguez",
      "Linda Martinez", "James Anderson", "Barbara Taylor", "Richard Moore", "Elizabeth Jackson",
      "Thomas White", "Susan Harris", "Christopher Martin", "Jessica Thompson", "Daniel Garcia",
      "Amanda Martinez", "Mark Robinson", "Stephanie Clark", "Paul Lewis", "Nicole Lee",
      "Kevin Walker", "Rebecca Hall", "Brian Allen", "Sharon Young", "Jason King"
    ][i],
    role: [
      "Registered Nurse", "Medical Assistant", "Lab Technician", "Receptionist", "Physician Assistant",
      "X-Ray Technician", "Billing Coordinator", "Medical Biller", "Nurse Practitioner", "Registered Nurse",
      "Lab Technician", "Medical Assistant", "Receptionist", "Registered Nurse", "Physician Assistant",
      "Medical Biller", "Lab Technician", "Receptionist", "Registered Nurse", "Medical Assistant",
      "Physician Assistant", "Lab Technician", "Receptionist", "Medical Assistant", "Registered Nurse",
      "Medical Biller", "Lab Technician", "Receptionist", "Medical Assistant", "Registered Nurse",
      "Physician Assistant", "Lab Technician", "Receptionist", "Medical Assistant", "Registered Nurse"
    ][i],
    experience: `${2 + (i % 8)} years`,
    languages: ["English", "Spanish", "French", "German"].filter((_, idx) => (i + idx) % 2 === 0),
    specializations: ["Pediatrics", "Emergency Care", "Family Medicine", "Internal Medicine", "Surgery"].filter((_, idx) => (i + idx) % 2 === 0),
  }));

  // Filtered candidates based on search
  const filteredCandidates = useMemo(() => {
    return allCandidates.filter(candidate => 
      !panelCandidates.some(pc => pc.id === candidate.id) &&
      (candidate.name.toLowerCase().includes(candidateSearch.toLowerCase()) ||
       candidate.role.toLowerCase().includes(candidateSearch.toLowerCase()) ||
       (candidate.languages?.some(lang => lang.toLowerCase().includes(candidateSearch.toLowerCase())) || false) ||
       (candidate.specializations?.some(spec => spec.toLowerCase().includes(candidateSearch.toLowerCase())) || false))
    );
  }, [candidateSearch, panelCandidates, allCandidates]);

  // Add candidate to panel
  const handleAddToPanel = (candidate: Candidate) => {
    if (panelCandidates.length < 5 && !panelCandidates.some(c => c.id === candidate.id)) {
      setPanelCandidates([...panelCandidates, candidate]);
    }
  };

  // Remove candidate from panel
  const handleRemoveFromPanel = (candidateId: string) => {
    setPanelCandidates(panelCandidates.filter(c => c.id !== candidateId));
  };

  // Confirm panel and change status to Sourcing
  const handleConfirmPanel = () => {
    if (startSourcingModal.request) {
      setRequests(prev => prev.map(r => 
        r.id === startSourcingModal.request!.id 
          ? { ...r, status: "Sourcing", candidates: panelCandidates }
          : r
      ));
      setStartSourcingModal({ open: false, request: null });
      setPanelCandidates([]);
    }
  };

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

    console.log('Drag detected:', { sourceStatus, destStatus, draggableId });

    // Find the dragged request
    const dragged = requests.find(r => r.id === draggableId);
    if (!dragged) return;

    // Check if this transition requires confirmation
    const requiresConfirmation = checkTransitionRequiresConfirmation(sourceStatus, destStatus);
    console.log('Requires confirmation:', requiresConfirmation);
    
    if (requiresConfirmation) {
      // Show appropriate confirmation modal based on transition
      console.log('Showing confirmation modal for transition:', sourceStatus, '->', destStatus);
      showTransitionConfirmation(dragged, sourceStatus, destStatus);
    } else {
      // Direct status change
      console.log('Direct status change:', sourceStatus, '->', destStatus);
      updateRequestStatus(dragged.id, destStatus as HireRequest["status"]);
    }
  }

  // Function to check if a transition requires confirmation
  const checkTransitionRequiresConfirmation = (sourceStatus: string, destStatus: string): boolean => {
    // Simplified list of transitions that need confirmation
    const transitionsRequiringConfirmation = [
      // Cancel transitions
      { from: "Pending Signature", to: "Canceled" },
      { from: "New", to: "Canceled" },
      { from: "Sourcing", to: "Canceled" },
      { from: "Panel Ready", to: "Canceled" },
      { from: "Interview Scheduled", to: "Canceled" },
      { from: "Awaiting Decision", to: "Canceled" },
      // Mark as Complete transitions
      { from: "Panel Ready", to: "Placement Complete" },
      { from: "Interview Scheduled", to: "Placement Complete" },
      { from: "Awaiting Decision", to: "Placement Complete" },
      // Back to transitions
      { from: "Sourcing", to: "New" },
      { from: "Panel Ready", to: "Sourcing" },
      { from: "Interview Scheduled", to: "Panel Ready" },
      { from: "Awaiting Decision", to: "Panel Ready" },
      { from: "Placement Complete", to: "Panel Ready" },
      { from: "Placement Complete", to: "New" },
      { from: "Canceled", to: "New" },
      { from: "Canceled", to: "Sourcing" },
    ];

    const requiresConfirmation = transitionsRequiringConfirmation.some(
      transition => transition.from === sourceStatus && transition.to === destStatus
    );
    
    console.log('Checking transition:', sourceStatus, '->', destStatus, 'requires confirmation:', requiresConfirmation);
    return requiresConfirmation;
  };

  // Function to show appropriate confirmation modal
  const showTransitionConfirmation = (request: HireRequest, sourceStatus: string, destStatus: string) => {
    console.log('Showing confirmation for:', sourceStatus, '->', destStatus);
    
    // Cancel transitions
    if (destStatus === "Canceled") {
      console.log('Opening cancel modal');
      setCancelModal({ open: true, requestId: request.id });
    }
    // Mark as Complete transitions
    else if (destStatus === "Placement Complete") {
      console.log('Opening complete modal');
      setCompleteModal({ open: true, requestId: request.id, selectedWinner: request.winner || null });
    }
    // Back to transitions
    else if (destStatus === "New" && ["Sourcing", "Placement Complete", "Canceled"].includes(sourceStatus)) {
      console.log('Opening back modal to New');
      setBackModal({ open: true, requestId: request.id, targetStatus: "New" });
    } else if (destStatus === "Sourcing" && ["Panel Ready", "Canceled"].includes(sourceStatus)) {
      console.log('Opening back modal to Sourcing');
      setBackModal({ open: true, requestId: request.id, targetStatus: "Sourcing" });
    } else if (destStatus === "Panel Ready" && ["Interview Scheduled", "Awaiting Decision", "Placement Complete"].includes(sourceStatus)) {
      console.log('Opening back modal to Panel Ready');
      setBackModal({ open: true, requestId: request.id, targetStatus: "Panel Ready" });
    }
    // Direct transitions (no confirmation needed)
    else {
      console.log('Direct transition, updating status');
      updateRequestStatus(request.id, destStatus as HireRequest["status"]);
    }
  };

  // Function to update request status directly
  const updateRequestStatus = (requestId: string, newStatus: HireRequest["status"]) => {
    setRequests(prev => prev.map(request => 
      request.id === requestId 
        ? { ...request, status: newStatus }
        : request
    ));
  };

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
          { label: "Cancel Request", action: () => setCancelModal({ open: true, requestId: request.id }), icon: <XCircle className="w-4 h-4" /> }
        );
        break;
      case "New":
        actions.push(
          { label: "Start Sourcing", action: () => { setStartSourcingModal({ open: true, request }); setPanelCandidates([]); }, icon: <ArrowRight className="w-4 h-4" /> },
          { label: "Cancel Request", action: () => setCancelModal({ open: true, requestId: request.id }), icon: <XCircle className="w-4 h-4" /> }
        );
        break;
      case "Sourcing":
        actions.push(
          { label: "Back to New", action: () => setBackModal({ open: true, requestId: request.id, targetStatus: "New" }), icon: <ArrowLeft className="w-4 h-4" /> },
          { label: "Edit Panel", action: () => { setEditPanelModal({ open: true, request }); setPanelCandidates([]); }, icon: <Edit className="w-4 h-4" /> },
          { label: "Mark Panel Ready", action: () => setPanelReadyModal({ open: true, request }), icon: <CheckCircle className="w-4 h-4" /> },
          { label: "Cancel Request", action: () => setCancelModal({ open: true, requestId: request.id }), icon: <XCircle className="w-4 h-4" /> }
        );
        break;
      case "Panel Ready":
        actions.push(
          { label: "Back to Sourcing", action: () => setBackModal({ open: true, requestId: request.id, targetStatus: "Sourcing" }), icon: <ArrowLeft className="w-4 h-4" /> },
          { label: "View Panel", action: () => setViewPanelModal({ open: true, request }), icon: <Eye className="w-4 h-4" /> },
          { label: "Schedule Interview", action: () => setScheduleModal({ open: true, request }), icon: <Calendar className="w-4 h-4" /> },
          { label: "Awaiting Decision", action: () => setAwaitingDecisionModal({ open: true, request }), icon: <Clock className="w-4 h-4" /> },
          { label: "Mark as Complete", action: () => setCompleteModal({ open: true, requestId: request.id, selectedWinner: request.winner || null }), icon: <CheckCircle className="w-4 h-4" /> },
          { label: "Cancel Request", action: () => setCancelModal({ open: true, requestId: request.id }), icon: <XCircle className="w-4 h-4" /> }
        );
        break;
      case "Interview Scheduled":
        actions.push(
          { label: "Back to Panel Ready", action: () => setBackModal({ open: true, requestId: request.id, targetStatus: "Panel Ready" }), icon: <ArrowLeft className="w-4 h-4" /> },
          { label: "Awaiting Decision", action: () => setAwaitingDecisionModal({ open: true, request }), icon: <Clock className="w-4 h-4" /> },
          { label: "Mark as Complete", action: () => setCompleteModal({ open: true, requestId: request.id, selectedWinner: request.winner || null }), icon: <CheckCircle className="w-4 h-4" /> },
          { label: "Cancel Request", action: () => setCancelModal({ open: true, requestId: request.id }), icon: <XCircle className="w-4 h-4" /> }
        );
        break;
      case "Awaiting Decision":
        actions.push(
          { label: "Back to Panel Ready", action: () => setBackModal({ open: true, requestId: request.id, targetStatus: "Panel Ready" }), icon: <ArrowLeft className="w-4 h-4" /> },
          { label: "Allow More Time", action: () => setAwaitingDecisionModal({ open: true, request }), icon: <Clock className="w-4 h-4" /> },
          { label: "Mark as Complete", action: () => setCompleteModal({ open: true, requestId: request.id, selectedWinner: request.winner || null }), icon: <CheckCircle className="w-4 h-4" /> },
          { label: "Cancel Request", action: () => setCancelModal({ open: true, requestId: request.id }), icon: <XCircle className="w-4 h-4" /> }
        );
        break;
      case "Placement Complete":
        actions.push(
          { label: "Back to Panel Ready", action: () => setBackModal({ open: true, requestId: request.id, targetStatus: "Panel Ready" }), icon: <ArrowLeft className="w-4 h-4" /> },
          { label: "Change Winner", action: () => setChangeWinnerModal({ open: true, requestId: request.id, selectedWinner: request.winner || null }), icon: <UserCheck className="w-4 h-4" /> },
          { label: "Reopen as New", action: () => setBackModal({ open: true, requestId: request.id, targetStatus: "New" }), icon: <RotateCcw className="w-4 h-4" /> }
        );
        break;
      case "Canceled":
        actions.push(
          { label: "Reopen as New", action: () => setBackModal({ open: true, requestId: request.id, targetStatus: "New" }), icon: <RotateCcw className="w-4 h-4" /> },
          { label: "Reopen as Sourcing", action: () => setBackModal({ open: true, requestId: request.id, targetStatus: "Sourcing" }), icon: <RotateCcw className="w-4 h-4" /> }
        );
        break;
    }
    
    return actions;
  };

  const [cancelModal, setCancelModal] = useState<{ open: boolean; requestId: string | null }>({ open: false, requestId: null });
  const [completeModal, setCompleteModal] = useState<{ open: boolean; requestId: string | null; selectedWinner: string | null }>({ open: false, requestId: null, selectedWinner: null });

  // Agrega la función para editar campos
  // const handleFieldEdit = (field: keyof HireRequest, value: string | number | string[] | undefined) => {
  //   setRequests(prev =>
  //     prev.map(r =>
  //       r.id === selectedRequest?.id
  //         ? { ...r, [field]: value }
  //         : r
  //     )
  //   );
  //   setSelectedRequest(prev =>
  //     prev ? { ...prev, [field]: value } : prev
  //   );
  // };

  const [isEditing, setIsEditing] = useState(false);
  const [editBuffer, setEditBuffer] = useState<HireRequest | null>(null);

  const startEdit = () => {
    if (!selectedRequest) return;
    setEditBuffer({
      id: selectedRequest.id,
      clientName: selectedRequest.clientName || '',
      role: selectedRequest.role || '',
      dateSubmitted: selectedRequest.dateSubmitted || '',
      assignedTo: selectedRequest.assignedTo || '',
      status: selectedRequest.status,
      candidatesCount: selectedRequest.candidatesCount,
      panelDate: selectedRequest.panelDate,
      interviewDate: selectedRequest.interviewDate,
      interviewTime: selectedRequest.interviewTime,
      candidates: selectedRequest.candidates,
      description: selectedRequest.description,
      department: selectedRequest.department,
      location: selectedRequest.location || '',
      requestedBy: selectedRequest.requestedBy || '',
      practiceArea: selectedRequest.practiceArea || '',
      scheduleNeeds: selectedRequest.scheduleNeeds || '',
      roleTitle: selectedRequest.roleTitle || '',
      requiredSkills: selectedRequest.requiredSkills || [],
      keyResponsibilities: selectedRequest.keyResponsibilities || '',
      decisionDeadline: selectedRequest.decisionDeadline,
      winner: selectedRequest.winner,
    });
    setIsEditing(true);
  };
  const cancelEdit = () => {
    setIsEditing(false);
    setEditBuffer(null);
  };
  const saveEdit = () => {
    if (!editBuffer) return;
    setRequests(prev => prev.map(r => r.id === editBuffer.id ? { ...editBuffer } : r));
    setSelectedRequest({ ...editBuffer });
    setIsEditing(false);
    setEditBuffer(null);
  };
  const handleEditBufferChange = (field: keyof HireRequest, value: string | number | string[] | undefined) => {
    setEditBuffer(prev => prev ? { ...prev, [field]: value } : prev);
  };

  const [backModal, setBackModal] = useState<{ open: boolean, requestId: string | null, targetStatus: HireRequestStatus | null }>({ open: false, requestId: null, targetStatus: null });

  // Mock panel candidates data
  const mockPanelCandidates: Candidate[] = [
    { id: 'panel-1', name: 'Ana Torres', role: 'Registered Nurse', experience: '5' },
    { id: 'panel-2', name: 'Luis Fernández', role: 'Medical Assistant', experience: '3' },
    { id: 'panel-3', name: 'Emily Brown', role: 'Lab Technician', experience: '4' },
    { id: 'panel-4', name: 'Carlos Ruiz', role: 'Physician Assistant', experience: '6' },
    { id: 'panel-5', name: 'Sofia Martinez', role: 'Receptionist', experience: '2' },
  ];

  // Agrega el modal de Edit Panel
  const [editPanelModal, setEditPanelModal] = useState<{ open: boolean; request: HireRequest | null }>({ open: false, request: null });

  const handleConfirmEditPanel = () => {
    if (editPanelModal.request) {
      setRequests(prev => prev.map(r => 
        r.id === editPanelModal.request!.id 
          ? { ...r, candidates: panelCandidates }
          : r
      ));
      setEditPanelModal({ open: false, request: null });
      setPanelCandidates([]);
    }
  };

  // Agrega el modal de View Panel
  const [viewPanelModal, setViewPanelModal] = useState<{ open: boolean; request: HireRequest | null }>({ open: false, request: null });

  // Agrega el modal de Awaiting Decision
  const [awaitingDecisionModal, setAwaitingDecisionModal] = useState<{ open: boolean; request: HireRequest | null }>({ open: false, request: null });
  const [decisionDeadlineDate, setDecisionDeadlineDate] = useState<string>("");
  const [decisionDeadlineTime, setDecisionDeadlineTime] = useState<string>("");

  // Función para manejar la confirmación de Awaiting Decision
  const handleAwaitingDecisionConfirm = () => {
    if (awaitingDecisionModal.request && decisionDeadlineDate && decisionDeadlineTime) {
      const deadline = `${decisionDeadlineDate}T${decisionDeadlineTime}`;
      setRequests(prev => prev.map(r => 
        r.id === awaitingDecisionModal.request!.id 
          ? { ...r, status: "Awaiting Decision", decisionDeadline: deadline }
          : r
      ));
      setAwaitingDecisionModal({ open: false, request: null });
      setDecisionDeadlineDate("");
      setDecisionDeadlineTime("");
    }
  };

  // Función para establecer fecha por defecto (24 horas)
  const setDefaultDeadline = () => {
    const now = new Date();
    now.setHours(now.getHours() + 24);
    
    const date = now.toISOString().slice(0, 10);
    const time = now.toTimeString().slice(0, 5);
    
    setDecisionDeadlineDate(date);
    setDecisionDeadlineTime(time);
  };

  // Agrega el modal de Change Winner
  const [changeWinnerModal, setChangeWinnerModal] = useState<{ open: boolean; requestId: string | null; selectedWinner: string | null }>({ open: false, requestId: null, selectedWinner: null });

  // Función para manejar el cambio de ganador
  const handleChangeWinnerConfirm = () => {
    if (changeWinnerModal.selectedWinner && changeWinnerModal.requestId) {
      // Update the request with the new winner
      const updatedRequests = requests.map(req => 
        req.id === changeWinnerModal.requestId 
          ? { ...req, winner: changeWinnerModal.selectedWinner || undefined }
          : req
      );
      setRequests(updatedRequests);
      setChangeWinnerModal({ open: false, requestId: null, selectedWinner: null });
    }
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
                        <AnimatePresence initial={false}>
                          {groupedRequests[status].map((request, idx) => (
                            <Draggable draggableId={request.id} index={idx} key={request.id}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`mb-0 ${snapshot.isDragging ? 'opacity-80' : ''}`}
                                >
                                  <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    layout
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
                                            <span className="font-semibold text-chart-2">Winner: {request.winner}</span>
                                          </div>
                                        )}
                                      </div>
                                    </Card>
                                  </motion.div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        </AnimatePresence>
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
                    {!isEditing && (
                      <Button size="sm" variant="outline" onClick={startEdit}>Editar</Button>
                    )}
                    {isEditing && (
                      <>
                        <Button size="sm" variant="default" onClick={saveEdit}>Guardar</Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}>Cancelar</Button>
                      </>
                    )}
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
                      {isEditing ? (
                        <Input
                          value={editBuffer?.clientName || ''}
                          onChange={e => handleEditBufferChange('clientName', e.target.value)}
                          className="font-normal text-base text-muted-foreground"
                        />
                      ) : (
                        <div className="font-normal text-base text-muted-foreground">{selectedRequest.clientName}</div>
                      )}
                    </div>
                    {/* Role Title */}
                    <div>
                      <div className="font-semibold text-sm text-foreground mb-1">Role Title</div>
                      {isEditing ? (
                        <Input
                          value={editBuffer?.roleTitle || ''}
                          onChange={e => handleEditBufferChange('roleTitle', e.target.value)}
                          className="font-normal text-base text-muted-foreground"
                        />
                      ) : (
                        <div className="font-normal text-base text-muted-foreground">{selectedRequest.roleTitle}</div>
                      )}
                    </div>
                    {/* Practice Area | Schedule Needs */}
                    <div>
                      <div className="font-semibold text-sm text-foreground mb-1">Practice Area</div>
                      {isEditing ? (
                        <Input
                          value={editBuffer?.practiceArea || ''}
                          onChange={e => handleEditBufferChange('practiceArea', e.target.value)}
                          className="font-normal text-base text-muted-foreground"
                        />
                      ) : (
                        <div className="font-normal text-base text-muted-foreground">{selectedRequest.practiceArea}</div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-foreground mb-1">Schedule Needs</div>
                      {isEditing ? (
                        <Input
                          value={editBuffer?.scheduleNeeds || ''}
                          onChange={e => handleEditBufferChange('scheduleNeeds', e.target.value)}
                          className="font-normal text-base text-muted-foreground"
                        />
                      ) : (
                        <div className="font-normal text-base text-muted-foreground">{selectedRequest.scheduleNeeds}</div>
                      )}
                    </div>
                    {/* Required Skills */}
                    <div className="md:col-span-2">
                      <div className="font-semibold text-sm text-foreground mb-1">Required Skills</div>
                      {isEditing ? (
                        <Textarea
                          value={(editBuffer?.requiredSkills || []).join(', ')}
                          onChange={e => handleEditBufferChange('requiredSkills', e.target.value.split(',').map(s => s.trim()))}
                          className="font-normal text-base text-muted-foreground"
                          placeholder="Comma separated skills"
                        />
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {(selectedRequest.requiredSkills || []).map(skill => (
                            <span key={skill} className="inline-block bg-muted text-foreground rounded px-2 py-0.5 text-xs font-medium">{skill}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* Key Responsibilities */}
                    <div className="md:col-span-2">
                      <div className="font-semibold text-sm text-foreground mb-1">Key Responsibilities</div>
                      {isEditing ? (
                        <Textarea
                          value={editBuffer?.keyResponsibilities || ''}
                          onChange={e => handleEditBufferChange('keyResponsibilities', e.target.value)}
                          className="font-normal text-base text-muted-foreground"
                        />
                      ) : (
                        <div className="font-normal text-base text-muted-foreground">{selectedRequest.keyResponsibilities}</div>
                      )}
                    </div>
                    {/* Location | Contact */}
                    <div>
                      <div className="font-semibold text-sm text-foreground mb-1">Location</div>
                      {isEditing ? (
                        <Input
                          value={editBuffer?.location || ''}
                          onChange={e => handleEditBufferChange('location', e.target.value)}
                          className="font-normal text-base text-muted-foreground"
                        />
                      ) : (
                        <div className="font-normal text-base text-muted-foreground">{selectedRequest.location}</div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-foreground mb-1">Contact</div>
                      {isEditing ? (
                        <Input
                          value={editBuffer?.requestedBy || ''}
                          onChange={e => handleEditBufferChange('requestedBy', e.target.value)}
                          className="font-normal text-base text-muted-foreground"
                        />
                      ) : (
                        <div className="font-normal text-base text-muted-foreground">{selectedRequest.requestedBy}</div>
                      )}
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
                  <Tabs defaultValue="panel" className="w-full mt-6">
                    <TabsList className="w-full grid grid-cols-2">
                      <TabsTrigger value="panel" className="w-full">Panel</TabsTrigger>
                      <TabsTrigger value="ai" className="w-full">AI Top 10</TabsTrigger>
                    </TabsList>
                    <TabsContent value="panel">
                      <AdvancedTable
                        data={mockCandidates.slice(0, 5)}
                        columns={candidateTableColumns}
                        title={undefined}
                        statusKey={undefined}
                        onViewDetails={(candidate: Candidate) => {
                          if (!editPanelCandidates.includes(candidate.id) && editPanelCandidates.length < 5) {
                            setEditPanelCandidates(prev => [...prev, candidate.id]);
                          }
                        }}
                        showPagination={false}
                        showSearch={false}
                        showFilters={false}
                        showPageSize={false}
                        emptyMessage="No candidates found."
                        className="mt-4"
                      />
                    </TabsContent>
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
                        defaultPageSize={10}
                        pageSizeOptions={[10]}
                        emptyMessage="No AI candidates."
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
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={panelReadyVisible} onChange={e => setPanelReadyVisible(e.target.checked)} />
              <span>Client can see the panel</span>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> If this checkbox is checked, the client will be able to see all the candidate records within the panel, including their profiles, experience, and qualifications.
              </p>
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={handlePanelReadyConfirm}>Confirm</Button>
            </div>
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
      {/* Start Sourcing Modal */}
      <Dialog open={startSourcingModal.open} onOpenChange={open => { 
        setStartSourcingModal({ open, request: open ? startSourcingModal.request : null }); 
        if (open) {
          setPanelCandidates([]);
          setCandidateSearch("");
        }
      }}>
        <DialogContent className="!w-[70vw] !max-w-none h-screen max-h-[95vh] bg-background rounded-xl shadow-2xl flex flex-col overflow-hidden p-0">
          <div className="flex-1 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Interview Panel</h2>
                <p className="text-muted-foreground">Select 5 candidates for the interview panel</p>
              </div>
            </div>

            {/* Main content: two columns on desktop, stacked on mobile */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Left: Panel Slots */}
              <section className="md:w-1/2 p-6 border-b md:border-b-0 md:border-r flex flex-col">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Panel Slots</h3>
                  <p className="text-sm text-muted-foreground">{panelCandidates.length}/5 candidates selected</p>
                </div>
                <div className="grid grid-cols-1 gap-3 mb-6">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Card
                      key={idx}
                      className={`relative p-2 min-h-[48px] flex flex-col w-full ${
                        panelCandidates[idx] 
                          ? "bg-primary/10 border-primary" 
                          : "bg-muted border-dashed border-muted-foreground/30"
                      }`}
                    >
                      {panelCandidates[idx] ? (
                        <>
                          <button
                            type="button"
                            aria-label="Remove candidate"
                            className="absolute top-1.5 right-1.5 text-muted-foreground hover:text-destructive transition-colors"
                            onClick={() => handleRemoveFromPanel(panelCandidates[idx].id)}
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground text-sm leading-tight">{panelCandidates[idx].name}</h4>
                            <p className="text-xs text-muted-foreground leading-tight">{panelCandidates[idx].role}</p>
                            {panelCandidates[idx].experience && (
                              <p className="text-xs text-muted-foreground leading-tight">{panelCandidates[idx].experience}</p>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="flex-1 flex items-center justify-center">
                          <span className="text-muted-foreground text-xs">Empty Slot</span>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
                <div className="flex justify-end mt-auto">
                  <Button
                    onClick={handleConfirmPanel}
                    className="px-8"
                  >
                    Confirm Panel
                  </Button>
                </div>
              </section>

              {/* Right: Candidate Browser */}
              <section className="md:w-1/2 p-6 flex flex-col overflow-hidden">
                <div className="mb-4">
                  <Input
                    type="text"
                    placeholder="Search candidates by name, role, language, or specialization..."
                    value={candidateSearch}
                    onChange={(e) => setCandidateSearch(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[600px] pr-2">
                  {filteredCandidates.map(candidate => (
                    <Card key={candidate.id} className="p-4 hover:shadow-md transition-shadow w-full">
                      <div className="mb-3">
                        <h4 className="font-semibold text-foreground">{candidate.name}</h4>
                        <p className="text-sm text-muted-foreground">{candidate.role}</p>
                        {candidate.experience && (
                          <p className="text-xs text-muted-foreground">{candidate.experience}</p>
                        )}
                      </div>
                      {candidate.languages && candidate.languages.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Languages:</p>
                          <div className="flex flex-wrap gap-1">
                            {candidate.languages.map(lang => (
                              <Badge key={lang} variant="secondary" className="text-xs">{lang}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {candidate.specializations && candidate.specializations.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Specializations:</p>
                          <div className="flex flex-wrap gap-1">
                            {candidate.specializations.map(spec => (
                              <Badge key={spec} variant="outline" className="text-xs">{spec}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      <Button
                        size="sm"
                        onClick={() => handleAddToPanel(candidate)}
                        disabled={panelCandidates.length >= 5}
                        className="w-full"
                      >
                        + Add to Panel
                      </Button>
                    </Card>
                  ))}
                </div>
                {filteredCandidates.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No candidates found matching your search.
                  </div>
                )}
              </section>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Cancel Request */}
      <Dialog open={cancelModal.open} onOpenChange={open => setCancelModal({ open, requestId: open ? cancelModal.requestId : null })}>
        <DialogContent className="max-w-md w-full">
          <DialogTitle>Cancel Request</DialogTitle>
          <p>Are you sure you want to cancel this request? This action cannot be undone.</p>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setCancelModal({ open: false, requestId: null })}>No, go back</Button>
            <Button variant="destructive" onClick={() => { if (cancelModal.requestId) handleStatusChange(cancelModal.requestId, "Canceled"); setCancelModal({ open: false, requestId: null }); }}>Yes, cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Back Modal */}
      <Dialog open={backModal.open} onOpenChange={open => setBackModal({ open, requestId: open ? backModal.requestId : null, targetStatus: open ? backModal.targetStatus : null })}>
        <DialogContent className="max-w-md w-full">
          <DialogTitle>Confirm Status Change</DialogTitle>
          <p>Are you sure you want to {backModal.targetStatus === 'New' && (backModal.requestId && (requests.find(r => r.id === backModal.requestId)?.status === 'Placement Complete' || requests.find(r => r.id === backModal.requestId)?.status === 'Canceled')) ? 'reopen this request as New' : backModal.targetStatus === 'New' ? 'move this request back to New' : backModal.targetStatus === 'Sourcing' && (backModal.requestId && requests.find(r => r.id === backModal.requestId)?.status === 'Canceled') ? 'reopen this request as Sourcing' : backModal.targetStatus === 'Sourcing' ? 'back to Sourcing' : backModal.targetStatus === 'Panel Ready' ? 'back to Panel Ready' : backModal.targetStatus === 'Interview Scheduled' ? 'Interview Scheduled' : ''}? This action will update the workflow status.</p>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setBackModal({ open: false, requestId: null, targetStatus: null })}>No, go back</Button>
            <Button variant="destructive" onClick={() => { if (backModal.requestId && backModal.targetStatus) handleStatusChange(backModal.requestId, backModal.targetStatus); setBackModal({ open: false, requestId: null, targetStatus: null }); }}>Yes, confirm</Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Mark as Complete Modal */}
      <Dialog open={completeModal.open} onOpenChange={(open) => setCompleteModal({ open, requestId: null, selectedWinner: null })}>
        <DialogContent className="max-w-2xl w-full">
          <DialogTitle>Mark Request as Complete</DialogTitle>
          <div className="space-y-4">
            <p>Select the winning candidate to complete this hire request:</p>
            
                          <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
              {mockPanelCandidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className={`p-2 border rounded-lg cursor-pointer transition-all ${
                    completeModal.selectedWinner === candidate.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setCompleteModal(prev => ({ ...prev, selectedWinner: candidate.id }))}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${
                      completeModal.selectedWinner === candidate.id
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground'
                    }`}>
                      {completeModal.selectedWinner === candidate.id && (
                        <div className="w-1 h-1 bg-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{candidate.name}</h4>
                      <p className="text-xs text-muted-foreground">{candidate.role} • {candidate.experience} years experience</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {!completeModal.selectedWinner && (
              <p className="text-sm text-destructive">Please select a winning candidate to continue.</p>
            )}
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button 
              variant="outline" 
              onClick={() => setCompleteModal({ open: false, requestId: null, selectedWinner: null })}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (completeModal.selectedWinner && completeModal.requestId) {
                  // Update the request with the winner and change status
                  const updatedRequests = requests.map(req => 
                    req.id === completeModal.requestId 
                      ? { ...req, winner: completeModal.selectedWinner || undefined, status: "Placement Complete" as const }
                      : req
                  );
                  setRequests(updatedRequests);
                  setCompleteModal({ open: false, requestId: null, selectedWinner: null });
                }
              }}
              disabled={!completeModal.selectedWinner}
            >
              Mark as Complete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Edit Panel Modal */}
      <Dialog open={editPanelModal.open} onOpenChange={open => { 
        setEditPanelModal({ open, request: open ? editPanelModal.request : null }); 
        if (open) {
          setPanelCandidates([]);
          setCandidateSearch("");
        }
      }}>
        <DialogContent className="!w-[70vw] !max-w-none h-screen max-h-[95vh] bg-background rounded-xl shadow-2xl flex flex-col overflow-hidden p-0">
          <div className="flex-1 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Edit Interview Panel</h2>
                <p className="text-muted-foreground">Select 5 candidates for the interview panel</p>
              </div>
            </div>

            {/* Main content: two columns on desktop, stacked on mobile */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Left: Panel Slots */}
              <section className="md:w-1/2 p-6 border-b md:border-b-0 md:border-r flex flex-col">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">Panel Slots</h3>
                  <p className="text-sm text-muted-foreground">{panelCandidates.length}/5 candidates selected</p>
                </div>
                <div className="grid grid-cols-1 gap-3 mb-6">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Card
                      key={idx}
                      className={`relative p-2 min-h-[48px] flex flex-col w-full ${
                        panelCandidates[idx] 
                          ? "bg-primary/10 border-primary" 
                          : "bg-muted border-dashed border-muted-foreground/30"
                      }`}
                    >
                      {panelCandidates[idx] ? (
                        <>
                          <button
                            type="button"
                            aria-label="Remove candidate"
                            className="absolute top-1.5 right-1.5 text-muted-foreground hover:text-destructive transition-colors"
                            onClick={() => handleRemoveFromPanel(panelCandidates[idx].id)}
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground text-sm leading-tight">{panelCandidates[idx].name}</h4>
                            <p className="text-xs text-muted-foreground leading-tight">{panelCandidates[idx].role}</p>
                            {panelCandidates[idx].experience && (
                              <p className="text-xs text-muted-foreground leading-tight">{panelCandidates[idx].experience}</p>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="flex-1 flex items-center justify-center">
                          <span className="text-muted-foreground text-xs">Empty Slot</span>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
                <div className="flex justify-end mt-auto">
                  <Button
                    onClick={handleConfirmEditPanel}
                    className="px-8"
                  >
                    Confirm Panel
                  </Button>
                </div>
              </section>

              {/* Right: Candidate Browser */}
              <section className="md:w-1/2 p-6 flex flex-col overflow-hidden">
                <div className="mb-4">
                  <Input
                    type="text"
                    placeholder="Search candidates by name, role, language, or specialization..."
                    value={candidateSearch}
                    onChange={(e) => setCandidateSearch(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[600px] pr-2">
                  {filteredCandidates.map(candidate => (
                    <Card key={candidate.id} className="p-4 hover:shadow-md transition-shadow w-full">
                      <div className="mb-3">
                        <h4 className="font-semibold text-foreground">{candidate.name}</h4>
                        <p className="text-sm text-muted-foreground">{candidate.role}</p>
                        {candidate.experience && (
                          <p className="text-xs text-muted-foreground">{candidate.experience}</p>
                        )}
                      </div>
                      {candidate.languages && candidate.languages.length > 0 && (
                        <div className="mb-2">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Languages:</p>
                          <div className="flex flex-wrap gap-1">
                            {candidate.languages.map(lang => (
                              <Badge key={lang} variant="secondary" className="text-xs">{lang}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {candidate.specializations && candidate.specializations.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Specializations:</p>
                          <div className="flex flex-wrap gap-1">
                            {candidate.specializations.map(spec => (
                              <Badge key={spec} variant="outline" className="text-xs">{spec}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      <Button
                        size="sm"
                        onClick={() => handleAddToPanel(candidate)}
                        disabled={panelCandidates.length >= 5}
                        className="w-full"
                      >
                        + Add to Panel
                      </Button>
                    </Card>
                  ))}
                </div>
                {filteredCandidates.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No candidates found matching your search.
                  </div>
                )}
              </section>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* View Panel Modal */}
      <Dialog open={viewPanelModal.open} onOpenChange={(open) => setViewPanelModal({ open, request: null })}>
        <DialogContent className="max-w-2xl w-full">
          <DialogTitle>Interview Panel - {viewPanelModal.request?.clientName}</DialogTitle>
          <div className="space-y-4">
            <p>Review the candidates selected for this interview panel:</p>
            
                  <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
        {mockPanelCandidates.map((candidate) => (
          <div
            key={candidate.id}
            className="p-2 border rounded-lg transition-all border-border hover:border-primary/50"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-sm">{candidate.name}</h4>
                <p className="text-xs text-muted-foreground">{candidate.role} • {candidate.experience} years experience</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="text-xs px-2 py-1 h-7"
                onClick={() => {
                  // Aquí se abriría el modal del perfil del candidato
                  console.log('View profile for:', candidate.name);
                }}
              >
                <Eye className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">Total Candidates:</span> 5
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">Panel Status:</span> Ready for Client Review
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setViewPanelModal({ open: false, request: null })}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Awaiting Decision Modal */}
      <Dialog open={awaitingDecisionModal.open} onOpenChange={open => { 
        setAwaitingDecisionModal({ open, request: open ? awaitingDecisionModal.request : null }); 
        if (open) {
          setDefaultDeadline();
        }
      }}>
        <DialogContent className="max-w-md w-full">
          <DialogTitle>Set Decision Deadline</DialogTitle>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Set a deadline for the client to make their decision. The default is 24 hours from now.
            </p>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">Date:</label>
                <Input 
                  type="date" 
                  value={decisionDeadlineDate} 
                  onChange={(e) => setDecisionDeadlineDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Time:</label>
                <Input 
                  type="time" 
                  value={decisionDeadlineTime} 
                  onChange={(e) => setDecisionDeadlineTime(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setAwaitingDecisionModal({ open: false, request: null })}>
                Cancel
              </Button>
              <Button 
                onClick={handleAwaitingDecisionConfirm}
                disabled={!decisionDeadlineDate || !decisionDeadlineTime}
              >
                Set Deadline
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Change Winner Modal */}
      <Dialog open={changeWinnerModal.open} onOpenChange={(open) => setChangeWinnerModal({ open, requestId: null, selectedWinner: null })}>
        <DialogContent className="max-w-2xl w-full">
          <DialogTitle>Change Winner</DialogTitle>
          <div className="space-y-4">
            <p>Select the new winning candidate for this hire request:</p>
            
            <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
              {mockPanelCandidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className={`p-2 border rounded-lg cursor-pointer transition-all ${
                    changeWinnerModal.selectedWinner === candidate.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setChangeWinnerModal(prev => ({ ...prev, selectedWinner: candidate.id }))}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${
                      changeWinnerModal.selectedWinner === candidate.id
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground'
                    }`}>
                      {changeWinnerModal.selectedWinner === candidate.id && (
                        <div className="w-1 h-1 bg-white rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{candidate.name}</h4>
                      <p className="text-xs text-muted-foreground">{candidate.role} • {candidate.experience} years experience</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {!changeWinnerModal.selectedWinner && (
              <p className="text-sm text-destructive">Please select a new winning candidate to continue.</p>
            )}
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button 
              variant="outline" 
              onClick={() => setChangeWinnerModal({ open: false, requestId: null, selectedWinner: null })}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleChangeWinnerConfirm}
              disabled={!changeWinnerModal.selectedWinner}
            >
              Change Winner
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 