"use client";

import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StaffCard } from "@/components/ui/staff-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import Link from "next/link";
import { 
  Users,
  TrendingUp,
  Clock,
  UserPlus,
  Plus,
  Search,
  Eye,
  CheckCircle,
  Calendar,
  Crown
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";


// --- TypeScript interfaces ---
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
  recentActivity?: string;
}

interface CandidateEducation {
  institution: string;
  degree: string;
  startYear: number;
  endYear: number;
}

interface CandidateExperience {
  company: string;
  role: string;
  startYear: number;
  endYear?: number;
  description?: string;
}

interface Candidate {
  id: string;
  name: string;
  avatarUrl?: string;
  role: string;
  pricePerMonth: number;
  currency: string;
  languages: string[];
  specializations: string[];
  skills: string[];
  about: string;
  education: CandidateEducation[];
  experience: CandidateExperience[];
  experienceLevel: "Junior" | "Mid" | "Senior";
  email?: string;
  phone?: string;
  certifications?: string[];
  availability?: string;
  notes?: string;
}





// Status configuration is now handled by StatusBadge component

// --- Mock Data ---
const clientName = "Dr. Smith";

// Enhanced mock hired staff data
const hiredStaff: HiredStaffMember[] = [
  { 
    id: "1", 
    name: "Ana Torres", 
    avatarUrl: undefined, 
    role: "Registered Nurse", 
    country: "🇺🇸 United States", 
    billRate: 2200, 
    currency: "USD", 
    joinDate: "2024-01-15", 
    recentActivity: "Completed 40 hours this week",
    bonuses: [
      { amount: 50, date: "2024-05-01", notes: "Great performance in May" }, 
      { amount: 25, date: "2024-03-15" }
    ] 
  },
  { 
    id: "2", 
    name: "Luis Fernández", 
    avatarUrl: undefined, 
    role: "Medical Assistant", 
    country: "🇺🇸 United States", 
    billRate: 1500, 
    currency: "USD", 
    joinDate: "2024-02-20",
    bonuses: [] 
  },
  { 
    id: "3", 
    name: "Emily Brown", 
    avatarUrl: undefined, 
    role: "Lab Technician", 
    country: "🇨🇦 Canada", 
    billRate: 1800, 
    currency: "CAD", 
    joinDate: "2024-03-10",
    bonuses: [
      { amount: 100, date: "2024-04-10", notes: "Handled extra shifts" }
    ] 
  },
  { 
    id: "4", 
    name: "Carlos Ruiz", 
    avatarUrl: undefined, 
    role: "Physician Assistant", 
    country: "🇺🇸 United States", 
    billRate: 3000, 
    currency: "USD", 
    joinDate: "2024-01-05",
  },
  { 
    id: "5", 
    name: "Sofia Martinez", 
    avatarUrl: undefined, 
    role: "Receptionist", 
    country: "🇺🇸 United States", 
    billRate: 1200, 
    currency: "USD", 
    joinDate: "2024-02-01",
  },
  { 
    id: "6", 
    name: "John Smith", 
    avatarUrl: undefined, 
    role: "Nurse Practitioner", 
    country: "🇺🇸 United States", 
    billRate: 3500, 
    currency: "USD", 
    joinDate: "2024-01-20",
  },
  { 
    id: "7", 
    name: "Maria Lopez", 
    avatarUrl: undefined, 
    role: "Billing Coordinator", 
    country: "🇺🇸 United States", 
    billRate: 1600, 
    currency: "USD", 
    joinDate: "2024-03-01",
  },
  { 
    id: "8", 
    name: "Patricia Gomez", 
    avatarUrl: undefined, 
    role: "X-Ray Technician", 
    country: "🇺🇸 United States", 
    billRate: 1700, 
    currency: "USD", 
    joinDate: "2024-02-15",
  },
];

// Mock candidates for hire requests




// General talent pool candidates
const talentPoolCandidates: Candidate[] = [
  {
    id: "4",
    name: "Carlos Ruiz",
    avatarUrl: undefined,
    role: "Physician Assistant",
    pricePerMonth: 3000,
    currency: "USD",
    languages: ["English", "Spanish"],
    specializations: ["Outpatient Care"],
    skills: ["Patient Assessment", "Suturing", "Prescription Management"],
    about: "Experienced PA with a focus on outpatient care and minor procedures.",
    education: [],
    experience: [],
    experienceLevel: "Senior",
  },
  {
    id: "5",
    name: "Sofia Martinez",
    avatarUrl: undefined,
    role: "Receptionist",
    pricePerMonth: 1200,
    currency: "USD",
    languages: ["English", "Spanish"],
    specializations: ["Front Desk"],
    skills: ["Scheduling", "Customer Service", "Phone Etiquette"],
    about: "Friendly and organized receptionist with experience in busy medical offices.",
    education: [],
    experience: [],
    experienceLevel: "Junior",
  },
  {
    id: "6",
    name: "John Smith",
    avatarUrl: undefined,
    role: "Nurse Practitioner",
    pricePerMonth: 3500,
    currency: "USD",
    languages: ["English"],
    specializations: ["Primary Care"],
    skills: ["Diagnosis", "Patient Education", "Chronic Disease Management"],
    about: "Nurse practitioner with a passion for primary care and patient education.",
    education: [],
    experience: [],
    experienceLevel: "Senior",
  },
  {
    id: "7",
    name: "Maria Lopez",
    avatarUrl: undefined,
    role: "Billing Coordinator",
    pricePerMonth: 1600,
    currency: "USD",
    languages: ["English", "Spanish"],
    specializations: ["Insurance Billing"],
    skills: ["Claims Processing", "Insurance Verification", "Accounts Receivable"],
    about: "Billing specialist with a track record of reducing claim denials.",
    education: [],
    experience: [],
    experienceLevel: "Mid",
  },
  {
    id: "8",
    name: "Patricia Gomez",
    avatarUrl: undefined,
    role: "X-Ray Technician",
    pricePerMonth: 1700,
    currency: "USD",
    languages: ["English", "Spanish"],
    specializations: ["Radiology"],
    skills: ["X-Ray Operation", "Patient Prep", "Radiation Safety"],
    about: "Radiology tech with a focus on patient safety and comfort.",
    education: [],
    experience: [],
    experienceLevel: "Mid",
  },
  {
    id: "9",
    name: "David Kim",
    avatarUrl: undefined,
    role: "Physical Therapist",
    pricePerMonth: 2500,
    currency: "USD",
    languages: ["English", "Korean"],
    specializations: ["Orthopedics", "Sports Medicine"],
    skills: ["Manual Therapy", "Exercise Prescription", "Patient Assessment"],
    about: "Physical therapist with expertise in orthopedic and sports medicine rehabilitation.",
    education: [],
    experience: [],
    experienceLevel: "Senior",
  },
  {
    id: "10",
    name: "Lisa Thompson",
    avatarUrl: undefined,
    role: "Pharmacist",
    pricePerMonth: 2800,
    currency: "USD",
    languages: ["English"],
    specializations: ["Clinical Pharmacy"],
    skills: ["Medication Review", "Drug Interactions", "Patient Counseling"],
    about: "Clinical pharmacist with experience in medication management and patient education.",
    education: [],
    experience: [],
    experienceLevel: "Senior",
  },
  {
    id: "11",
    name: "Robert Wilson",
    avatarUrl: undefined,
    role: "Medical Technologist",
    pricePerMonth: 1900,
    currency: "USD",
    languages: ["English"],
    specializations: ["Clinical Laboratory"],
    skills: ["Lab Testing", "Quality Control", "Equipment Maintenance"],
    about: "Medical technologist with expertise in clinical laboratory testing and quality assurance.",
    education: [],
    experience: [],
    experienceLevel: "Mid",
  },
  {
    id: "12",
    name: "Jennifer Adams",
    avatarUrl: undefined,
    role: "Respiratory Therapist",
    pricePerMonth: 2100,
    currency: "USD",
    languages: ["English"],
    specializations: ["Critical Care"],
    skills: ["Ventilator Management", "Pulmonary Function", "Emergency Response"],
    about: "Respiratory therapist with critical care experience in hospital settings.",
    education: [],
    experience: [],
    experienceLevel: "Mid",
  },
  {
    id: "13",
    name: "Miguel Rodriguez",
    avatarUrl: undefined,
    role: "Surgical Technologist",
    pricePerMonth: 2000,
    currency: "USD",
    languages: ["English", "Spanish"],
    specializations: ["Operating Room"],
    skills: ["Surgical Procedures", "Sterile Technique", "Equipment Setup"],
    about: "Surgical technologist with expertise in operating room procedures and sterile technique.",
    education: [],
    experience: [],
    experienceLevel: "Mid",
  },
  {
    id: "14",
    name: "Amanda Foster",
    avatarUrl: undefined,
    role: "Occupational Therapist",
    pricePerMonth: 2400,
    currency: "USD",
    languages: ["English"],
    specializations: ["Pediatrics", "Rehabilitation"],
    skills: ["ADL Training", "Splinting", "Home Modifications"],
    about: "Occupational therapist specializing in pediatric and rehabilitation services.",
    education: [],
    experience: [],
    experienceLevel: "Senior",
  },
  {
    id: "15",
    name: "Thomas Kim",
    avatarUrl: undefined,
    role: "Medical Social Worker",
    pricePerMonth: 1800,
    currency: "USD",
    languages: ["English", "Korean"],
    specializations: ["Case Management"],
    skills: ["Patient Advocacy", "Resource Coordination", "Crisis Intervention"],
    about: "Medical social worker with experience in patient advocacy and case management.",
    education: [],
    experience: [],
    experienceLevel: "Mid",
  },
];

// Copio los tipos y mocks de interview-panels
interface InterviewPanel {
  id: string;
  hireRequestId: string;
  roleTitle: string;
  department: string;
  location: string;
  status: "Panel Ready" | "Awaiting Decision" | "Placement Complete";
  dateSubmitted: string;
  estimatedStartDate?: string;
  contractLength?: string;
  salaryRange?: { min: number; max: number; currency: string };
  candidates: Candidate[];
  timeLimit: number;
  startTime: number;
  selectedWinner?: Candidate;
}

const interviewPanels: InterviewPanel[] = [
  {
    id: "2",
    hireRequestId: "5",
    roleTitle: "Nurse Practitioner",
    department: "Primary Care",
    location: "Orlando, FL",
    status: "Awaiting Decision",
    dateSubmitted: "2024-05-28",
    estimatedStartDate: "2024-07-20",
    contractLength: "12 months",
    salaryRange: { min: 80000, max: 95000, currency: "USD" },
    timeLimit: 24 * 60 * 60 * 1000,
    startTime: Date.now() - (6 * 60 * 60 * 1000),
    candidates: [
      {
        id: "6",
        name: "John Smith",
        avatarUrl: undefined,
        role: "Nurse Practitioner",
        pricePerMonth: 3500,
        currency: "USD",
        languages: ["English"],
        specializations: ["Primary Care"],
        skills: ["Diagnosis", "Patient Education", "Chronic Disease Management"],
        about: "Nurse practitioner with a passion for primary care and patient education.",
        experienceLevel: "Senior",
        email: "john.smith@email.com",
        phone: "+1 (407) 555-0106",
        certifications: ["NP License", "DEA Registration", "ANCC Board Certified"],
        availability: "Full-time, flexible schedule",
        notes: "Strong diagnostic skills, excellent patient educator",
        education: [],
        experience: [],
      },
      {
        id: "7",
        name: "Dr. Maria Rodriguez",
        avatarUrl: undefined,
        role: "Nurse Practitioner",
        pricePerMonth: 3800,
        currency: "USD",
        languages: ["English", "Spanish"],
        specializations: ["Family Medicine"],
        skills: ["Pediatric Care", "Women's Health", "Geriatric Care"],
        about: "Family NP with comprehensive experience across all age groups.",
        experienceLevel: "Senior",
        email: "maria.rodriguez@email.com",
        phone: "+1 (407) 555-0107",
        certifications: ["NP License", "DEA Registration", "FNP-BC"],
        availability: "Full-time, regular business hours",
        notes: "Bilingual, comprehensive family care experience",
        education: [],
        experience: [],
      },
      {
        id: "8",
        name: "Amanda Foster",
        avatarUrl: undefined,
        role: "Nurse Practitioner",
        pricePerMonth: 3200,
        currency: "USD",
        languages: ["English"],
        specializations: ["Adult Health"],
        skills: ["Health Assessment", "Disease Prevention", "Health Promotion"],
        about: "Adult health NP with focus on preventive care and health promotion.",
        experienceLevel: "Mid",
        email: "amanda.foster@email.com",
        phone: "+1 (407) 555-0108",
        certifications: ["NP License", "DEA Registration", "ANP-BC"],
        availability: "Full-time, regular business hours",
        notes: "Specializes in preventive care",
        education: [],
        experience: [],
      },
      {
        id: "9",
        name: "Robert Kim",
        avatarUrl: undefined,
        role: "Nurse Practitioner",
        pricePerMonth: 3600,
        currency: "USD",
        languages: ["English", "Korean"],
        specializations: ["Cardiology"],
        skills: ["Cardiac Assessment", "ECG Interpretation", "Patient Education"],
        about: "Cardiology NP with specialized training in cardiac assessment.",
        experienceLevel: "Senior",
        email: "robert.kim@email.com",
        phone: "+1 (407) 555-0109",
        certifications: ["NP License", "DEA Registration", "CCRN"],
        availability: "Full-time, flexible schedule",
        notes: "Cardiology specialist",
        education: [],
        experience: [],
      },
      {
        id: "10",
        name: "Lisa Thompson",
        avatarUrl: undefined,
        role: "Nurse Practitioner",
        pricePerMonth: 3400,
        currency: "USD",
        languages: ["English"],
        specializations: ["Women's Health"],
        skills: ["Gynecological Care", "Family Planning", "Prenatal Care"],
        about: "Women's health NP with expertise in gynecological and prenatal care.",
        experienceLevel: "Mid",
        email: "lisa.thompson@email.com",
        phone: "+1 (407) 555-0110",
        certifications: ["NP License", "DEA Registration", "WHNP-BC"],
        availability: "Full-time, regular business hours",
        notes: "Women's health specialist",
        education: [],
        experience: [],
      }
    ]
  }
];

const STATUS_CONFIG = {
  "Panel Ready": {
    color: "bg-chart-3 text-primary-foreground",
    icon: <Users className="w-4 h-4" />,
    description: "Ready for candidate review"
  },
  "Awaiting Decision": {
    color: "bg-chart-4 text-primary-foreground",
    icon: <Calendar className="w-4 h-4" />,
    description: "Waiting for client decision"
  },
  "Placement Complete": {
    color: "bg-chart-2 text-primary-foreground",
    icon: <CheckCircle className="w-4 h-4" />,
    description: "Placement complete"
  }
};

const CountdownTimer = ({ panel }: { panel: InterviewPanel }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      const elapsed = now - panel.startTime;
      const remaining = Math.max(0, panel.timeLimit - elapsed);
      setTimeLeft(remaining);
    };
    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [panel]);
  const formatTime = (milliseconds: number) => {
    if (milliseconds <= 0) return "00:00:00";
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  const isExpired = timeLeft <= 0;
  const isWarning = timeLeft <= 60 * 60 * 1000;
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
      isExpired 
        ? 'bg-destructive/10 text-destructive border-destructive/20' 
        : isWarning 
        ? 'bg-chart-3/10 text-chart-3 border-chart-3/20' 
        : 'bg-primary/10 text-primary border-primary/20'
    }`}>
      <Clock className={`w-4 h-4 ${isExpired ? 'text-destructive' : isWarning ? 'text-chart-3' : 'text-primary'}`} />
      <span className="font-mono font-semibold text-sm">
        {isExpired ? 'Time Expired' : formatTime(timeLeft)}
      </span>
    </div>
  );
};

const CandidateCard = ({ candidate, panel, onViewCandidate, onSelectWinner }: { candidate: Candidate; panel: InterviewPanel; onViewCandidate: (c: Candidate) => void; onSelectWinner: (c: Candidate, p: InterviewPanel) => void }) => {
  const isWinner = panel.selectedWinner?.id === candidate.id;
  return (
    <Card className={`p-4 border transition-colors cursor-pointer flex flex-col h-full justify-between ${
      isWinner 
        ? 'border-chart-2 bg-chart-2/5 hover:border-chart-2/70' 
        : 'border-border hover:border-primary/30'
    }`} onClick={() => onViewCandidate(candidate)}>
      <div>
        <div className="flex items-start gap-3 mb-3">
          <Avatar name={candidate.name} src={candidate.avatarUrl} className="w-12 h-12 text-lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-sm text-foreground truncate">{candidate.name}</h4>
              {isWinner && (
                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 text-yellow-700 px-2 py-0.5 text-xs font-semibold">
                  <Crown className="w-4 h-4 text-yellow-500" />
                  Winner
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{candidate.role}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {candidate.experienceLevel}
              </Badge>
            </div>
          </div>
        </div>
        <div className="mb-3">
          <div className="text-sm font-semibold text-primary">
            {candidate.currency === "USD" ? "$" : candidate.currency}
            {candidate.pricePerMonth.toLocaleString()}/month
          </div>
        </div>
      </div>
      {panel.status !== "Placement Complete" && (
        <Button
          size="default"
          variant="default"
          onClick={e => { e.stopPropagation(); onSelectWinner(candidate, panel); }}
          aria-label="Select Winner"
          className="w-full mt-auto"
          disabled={panel.status === "Panel Ready"}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Select Winner
        </Button>
      )}
    </Card>
  );
};

const InterviewPanelCard = ({ panel, onViewCandidate, onSelectWinner, onViewHireRequest }: { panel: InterviewPanel; onViewCandidate: (c: Candidate) => void; onSelectWinner: (c: Candidate, p: InterviewPanel) => void; onViewHireRequest: (p: InterviewPanel) => void }) => {
  return (
    <Card className="p-6 border border-border">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-foreground">{panel.roleTitle}</h3>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {panel.estimatedStartDate && (
              <>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Interview on {panel.estimatedStartDate} 14:00
                </div>
                <Button size="sm" variant="outline" className="ml-2" onClick={() => onViewHireRequest(panel)}>
                  <Eye className="w-4 h-4 mr-1" />
                  View Request Details
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge className={STATUS_CONFIG[panel.status].color}>
            {STATUS_CONFIG[panel.status].icon}
            {panel.status}
          </Badge>
          {panel.status === "Awaiting Decision" && <CountdownTimer panel={panel} />}
        </div>
      </div>
      <div className="mb-4">
        {panel.selectedWinner && (
          <div className="text-sm text-chart-2 font-medium mb-2 flex items-center gap-2">
            <Crown className="w-4 h-4 text-yellow-500" />
            {panel.selectedWinner.name} selected as winner
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {panel.candidates.map((candidate) => (
          <CandidateCard key={candidate.id} candidate={candidate} panel={panel} onViewCandidate={onViewCandidate} onSelectWinner={onSelectWinner} />
        ))}
      </div>
    </Card>
  );
};

// --- Helper Functions ---


type ModalType = null | "bonus" | "terminate" | "view";

// --- Extracted Components ---

// Loading Spinner Component - now imported from @/components/ui/loading-spinner

// Empty State Component - now imported from @/components/ui/empty-state

// Staff Card Component - now imported from @/components/ui/staff-card

// Candidate Teaser Card Component
const CandidateTeaserCard = ({ candidate, onClick }: { candidate: Candidate, onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="group w-full h-full min-h-[210px] bg-card border border-border rounded-xl shadow-sm p-4 flex flex-col items-start gap-2 hover:shadow-md transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
    style={{ minWidth: 0 }}
  >
    <div className="flex items-center gap-2 w-full mb-1">
      <Avatar name={candidate.name} src={candidate.avatarUrl} className="w-10 h-10 text-lg" />
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-base text-foreground truncate">{candidate.role}</div>
        <div className="text-sm text-muted-foreground truncate">{candidate.experienceLevel} Level</div>
      </div>
      <span className="text-chart-5 text-xl ml-1">★</span>
    </div>
    <div className="flex flex-wrap gap-1 mb-2">
      {candidate.languages.map(l => (
        <span key={l} className="bg-muted rounded-full px-2 py-0.5 text-xs text-foreground">{l}</span>
      ))}
      {candidate.specializations.map(s => (
        <span key={s} className="bg-muted rounded-full px-2 py-0.5 text-xs text-foreground">{s}</span>
      ))}
    </div>
    <div className="bg-chart-5/10 rounded px-2 py-1 text-chart-5 font-semibold text-xs mb-2 w-fit">
      Top Skill: {candidate.skills[0]}
    </div>
    <div className="mt-auto w-full">
      <div className="bg-primary/10 rounded px-2 py-3 text-center font-bold text-xl text-primary w-full">
        ${candidate.pricePerMonth.toLocaleString()}<span className="font-normal text-base text-muted-foreground"> /mo</span>
      </div>
    </div>
  </button>
);



// Stats Overview Component
const StatsOverview = () => {
  const totalStaff = hiredStaff.length;
  const totalMonthlyCost = hiredStaff.reduce((sum, staff) => sum + staff.billRate, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <Card className="p-4 border border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Staff</p>
            <p className="text-2xl font-bold text-foreground">{totalStaff}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4 border border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-chart-5/10 rounded-lg">
            <TrendingUp className="w-5 h-5 text-chart-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Monthly Cost</p>
            <p className="text-2xl font-bold text-foreground">
              ${totalMonthlyCost.toLocaleString()}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Main Dashboard Component
export default function ClientDashboardV2() {
  const [showAllStaff, setShowAllStaff] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedCandidateProfile, setSelectedCandidateProfile] = useState<Candidate | null>(null);

  // Memoized staff list for performance
  const displayedStaff = useMemo(() => {
    return showAllStaff ? hiredStaff : hiredStaff.slice(0, 6);
  }, [showAllStaff]);

  const awaitingPanels = interviewPanels.filter(p => p.status === "Awaiting Decision");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleStaffAction = (_action: ModalType, _staff: HiredStaffMember) => {
    // Handle staff action
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleViewCandidate = (_candidate: Candidate) => {
    // Handle view candidate
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSelectWinner = (_candidate: Candidate, _panel: InterviewPanel) => {
    // Handle select winner
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleViewHireRequest = (_panel: InterviewPanel) => {
    // Handle view hire request
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleViewProfile = (candidate: Candidate) => {
    setSelectedCandidateProfile(candidate);
    setProfileOpen(true);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <main className="flex-1 p-6 md:p-10 w-full max-w-none px-4 sm:px-8">
        {/* Main Title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome Back, {clientName}</h1>
            <p className="text-muted-foreground mt-1">Here's what's happening with your team today</p>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsOverview />

        {/* Hired Staff Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-foreground">My Hired Staff</h2>
            <div className="flex gap-2">
              {hiredStaff.length > 6 && (
                <Button 
                  variant="outline" 
                  onClick={() => setShowAllStaff(!showAllStaff)}
                  className="gap-2"
                >
                  {showAllStaff ? "Show Less" : `Show All (${hiredStaff.length})`}
                </Button>
              )}
              <Link href="/dashboard/client/staff">
                <Button variant="outline" className="gap-2">
                  <Users className="w-4 h-4" />
                  Manage Staff
                </Button>
              </Link>
            </div>
          </div>
          
          {hiredStaff.length === 0 ? (
            <EmptyState
              icon={<UserPlus className="w-12 h-12" />}
              title="No Staff Hired Yet"
              description="Start building your team by submitting your first hire request. We'll help you find the perfect candidates."
              action={
                <Link href="/dashboard/client/hire-requests/new">
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Submit First Request
                  </Button>
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedStaff.map((member) => (
                <StaffCard
                  key={member.id}
                  member={member}
                  onView={(member) => handleStaffAction("view", member)}
                  onBonus={(member) => handleStaffAction("bonus", member)}
                  onTerminate={(member) => handleStaffAction("terminate", member)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Recent Hire Requests Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Awaiting Decision Panels</h2>
          {awaitingPanels.length === 0 ? (
            <Card className="p-12 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Awaiting Decision Panels</h3>
              <p className="text-muted-foreground mb-4">Panels that require your decision will appear here.</p>
            </Card>
          ) : (
            <div className="space-y-6">
              {awaitingPanels.map((panel) => (
                <InterviewPanelCard
                  key={panel.id}
                  panel={panel}
                  onViewCandidate={handleViewCandidate}
                  onSelectWinner={handleSelectWinner}
                  onViewHireRequest={handleViewHireRequest}
                />
              ))}
            </div>
          )}
        </section>

        {/* Browse Other Talents Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Browse Other Talents in Our Pool</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            {talentPoolCandidates.slice(0, 8).map((candidate) => (
              <CandidateTeaserCard key={candidate.id} candidate={candidate} onClick={() => { setSelectedCandidateProfile(candidate); setProfileOpen(true); }} />
            ))}
          </div>
          
          {/* Show More Button */}
          <div className="flex justify-center">
            <Link href="/dashboard/client/talent-pool">
              <Button className="px-8 py-3 text-base" variant="default">
                <Search className="w-5 h-5 mr-2" />
                Browse Full Talent Pool
              </Button>
            </Link>
          </div>
        </section>

        {/* Candidate Profile Sheet (lateral) */}
        <Sheet open={profileOpen} onOpenChange={setProfileOpen}>
          <SheetContent side="right" className="w-[40vw] min-w-[400px] max-w-[48rem] p-0">
            {selectedCandidateProfile && (
              <div className="relative h-full flex flex-col">
                <div className="sticky top-0 z-10 bg-background px-6 pt-6 pb-4 shadow-sm border-b flex items-center justify-between gap-2">
                  <div className="flex items-center gap-4">
                    <Avatar name={selectedCandidateProfile.name} src={selectedCandidateProfile.avatarUrl} className="w-14 h-14 text-2xl" />
                    <div>
                      <h2 className="text-2xl font-bold">{selectedCandidateProfile.name}</h2>
                      <div className="text-lg text-muted-foreground font-medium">{selectedCandidateProfile.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button className="gap-2" variant="default" onClick={() => alert(`Request interview with ${selectedCandidateProfile.name}`)}>
                      Request Interview
                    </Button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2">
                  <div className="flex flex-col md:flex-row md:items-center md:gap-6 mb-2">
                    {/* Info principal */}
                    <div className="flex-1 flex flex-col items-center md:items-start gap-2 mt-4 md:mt-0">
                      <div className="text-muted-foreground text-lg text-center md:text-left">{selectedCandidateProfile.role}</div>
                      <div className="mt-1 text-base font-semibold text-primary text-center md:text-left">
                        {selectedCandidateProfile.currency === "USD" ? "$" : selectedCandidateProfile.currency}
                        {selectedCandidateProfile.pricePerMonth.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">/month</span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-2 text-sm justify-center md:justify-start">
                        {selectedCandidateProfile.languages.map((lang) => (
                          <Badge key={lang} variant="outline">{lang}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                      <div className="mb-2 font-semibold text-foreground">Specialization</div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedCandidateProfile.specializations.map((spec) => (
                          <Badge key={spec} variant="secondary">{spec}</Badge>
                        ))}
                      </div>
                      <div className="mb-2 font-semibold text-foreground">Skills & Certifications</div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedCandidateProfile.skills.map((skill) => (
                          <Badge key={skill} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                      <div className="mb-2 font-semibold text-foreground">About Me</div>
                      <div className="text-sm text-muted-foreground mb-4">
                        {selectedCandidateProfile.about}
                      </div>
                    </div>
                  </div>
                  <Tabs defaultValue="education" className="w-full">
                    <TabsList className="mb-2">
                      <TabsTrigger value="education">Education</TabsTrigger>
                      <TabsTrigger value="experience">Experience</TabsTrigger>
                    </TabsList>
                    <TabsContent value="education">
                      <div className="flex flex-col gap-2">
                        {selectedCandidateProfile.education.map((edu, idx) => (
                          <Card key={idx} className="p-3 flex flex-col gap-1">
                            <div className="font-semibold">{edu.degree}</div>
                            <div className="text-sm text-muted-foreground">{edu.institution}</div>
                            <div className="text-xs text-muted-foreground">{edu.startYear} - {edu.endYear}</div>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="experience">
                      <div className="flex flex-col gap-2">
                        {selectedCandidateProfile.experience.map((exp, idx) => (
                          <Card key={idx} className="p-3 flex flex-col gap-1">
                            <div className="font-semibold">{exp.role}</div>
                            <div className="text-sm text-muted-foreground">{exp.company}</div>
                            <div className="text-xs text-muted-foreground">{exp.startYear} - {exp.endYear || "Present"}</div>
                            {exp.description && <div className="text-xs text-muted-foreground mt-1">{exp.description}</div>}
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </main>
    </div>
  );
}