"use client";

import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription
} from "@/components/ui/sheet";
import { toast } from "sonner";
import Link from "next/link";
import { 
  Users, 
  Search, 
  Clock, 
  DollarSign, 
  XCircle, 
  Eye, 
  Plus, 
  UserPlus,
  
  TrendingUp,
  AlertCircle
} from "lucide-react";

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
}

interface HireRequest {
  id: string;
  role: string;
  status: "Open" | "Interviewing" | "Hired" | "Closed";
  date: string;
  candidates: Candidate[];
}

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
    recentActivity: "On leave until June 15",
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
const candidate1: Candidate = {
  id: "1",
  name: "Ana Torres",
  avatarUrl: undefined,
  role: "Registered Nurse",
  pricePerMonth: 2200,
  currency: "USD",
  languages: ["English", "Spanish"],
  specializations: ["Pediatrics", "Emergency Care"],
  skills: ["IV Therapy", "BLS Certified", "Patient Care"],
  about: "Compassionate nurse with 5+ years in pediatric and emergency settings.",
  education: [],
  experience: [],
  experienceLevel: "Senior",
};

const candidate2: Candidate = {
  id: "2",
  name: "Luis Fernández",
  avatarUrl: undefined,
  role: "Medical Assistant",
  pricePerMonth: 1500,
  currency: "USD",
  languages: ["English", "Spanish"],
  specializations: ["Family Medicine"],
  skills: ["Phlebotomy", "Patient Scheduling", "Medical Records"],
  about: "Detail-oriented medical assistant with 3 years of experience.",
  education: [],
  experience: [],
  experienceLevel: "Mid",
};

const candidate3: Candidate = {
  id: "3",
  name: "Emily Brown",
  avatarUrl: undefined,
  role: "Lab Technician",
  pricePerMonth: 1800,
  currency: "USD",
  languages: ["English"],
  specializations: ["Diagnostics", "Microbiology"],
  skills: ["Blood Analysis", "Lab Safety", "Equipment Calibration"],
  about: "Lab tech with a strong background in diagnostics and microbiology.",
  education: [],
  experience: [],
  experienceLevel: "Mid",
};

// Hire requests with candidates
const hireRequests: HireRequest[] = [
  { 
    id: "1", 
    role: "Registered Nurse", 
    status: "Open", 
    date: "2024-06-01",
    candidates: []
  },
  { 
    id: "2", 
    role: "Medical Receptionist", 
    status: "Interviewing", 
    date: "2024-05-28",
    candidates: [candidate1, candidate2, candidate3]
  },
  { 
    id: "3", 
    role: "Lab Technician", 
    status: "Hired", 
    date: "2024-05-20",
    candidates: [candidate3]
  },
];

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

// --- Helper Functions ---
function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

type ModalType = null | "bonus" | "terminate" | "view";

// --- Extracted Components ---

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
  </div>
);

// Empty State Component
const EmptyStaffState = () => (
  <Card className="p-8 border border-dashed border-gray-300 bg-gray-50">
    <div className="flex flex-col items-center justify-center text-center">
      <UserPlus className="w-12 h-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Staff Hired Yet</h3>
      <p className="text-gray-600 mb-4 max-w-md">
        Start building your team by submitting your first hire request. We'll help you find the perfect candidates.
      </p>
      <Link href="/dashboard/client/hire-requests/new">
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Submit First Request
        </Button>
      </Link>
    </div>
  </Card>
);

// Staff Card Component
const StaffCard = ({ 
  member, 
  onView, 
  onBonus, 
  onTerminate 
}: { 
  member: HiredStaffMember;
  onView: () => void;
  onBonus: () => void;
  onTerminate: () => void;
}) => {
  const hasRecentBonus = member.bonuses && member.bonuses.length > 0 && 
    new Date(member.bonuses[0].date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  return (
    <Card className="p-4 border border-gray-200 hover:border-blue-300 transition-all duration-200 hover:shadow-md">
      <div className="flex items-start gap-3 mb-3">
        <div className="relative">
          <Avatar name={member.name} src={member.avatarUrl} className="w-12 h-12 text-lg" />
          {hasRecentBonus && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-sm text-gray-900 truncate">{member.name}</h4>
          </div>
          <p className="text-xs text-gray-600">{member.role}</p>
          <p className="text-xs text-gray-500">{member.country}</p>
          {member.recentActivity && (
            <p className="text-xs text-blue-600 mt-1">{member.recentActivity}</p>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center mb-3">
        <div className="text-sm">
          <span className="font-medium">{formatCurrency(member.billRate, member.currency)}</span>
          <span className="text-gray-500">/month</span>
        </div>
        <div className="text-xs text-gray-500">
          Joined: {new Date(member.joinDate).toLocaleDateString()}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button
          size="icon"
          className="bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors"
          aria-label="View Details"
          title="View Details"
          onClick={onView}
        >
          <Eye className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          className="bg-green-100 hover:bg-green-200 text-green-700 transition-colors"
          aria-label="Give Bonus"
          title="Give Bonus"
          onClick={onBonus}
        >
          <DollarSign className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          className="bg-red-100 hover:bg-red-200 text-red-700 transition-colors"
          aria-label="Terminate"
          title="Terminate"
          onClick={onTerminate}
        >
          <XCircle className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

// Candidate Teaser Card Component
const CandidateTeaserCard = ({ candidate }: { candidate: Candidate }) => (
  <Card className="p-4 border border-gray-200 hover:border-blue-300 transition-colors">
    <div className="flex items-start gap-3">
      <Avatar name={candidate.name} src={candidate.avatarUrl} className="w-12 h-12 text-lg" />
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm text-gray-900 truncate">{candidate.name}</h4>
        <p className="text-xs text-gray-600 mb-2">{candidate.role}</p>
        <div className="flex flex-wrap gap-1 mb-2">
          {candidate.skills.slice(0, 2).map((skill) => (
            <Badge key={skill} variant="outline" className="text-xs px-1.5 py-0.5">
              {skill}
            </Badge>
          ))}
        </div>
        <div className="text-xs text-gray-500">
          {candidate.experienceLevel} • ${candidate.pricePerMonth.toLocaleString()}/month
        </div>
      </div>
    </div>
  </Card>
);

// Empty Candidate Placeholder Component
const EmptyCandidatePlaceholder = () => (
  <Card className="p-4 border border-dashed border-gray-300 bg-gray-50">
    <div className="flex flex-col items-center justify-center h-20 text-center">
      <Clock className="w-6 h-6 text-gray-400 mb-2" />
      <p className="text-sm text-gray-500">Sourcing the best candidates for you...</p>
    </div>
  </Card>
);

// Stats Overview Component
const StatsOverview = () => {
  const totalStaff = hiredStaff.length;
  const totalMonthlyCost = hiredStaff.reduce((sum, staff) => sum + staff.billRate, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <Card className="p-4 border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Staff</p>
            <p className="text-2xl font-bold text-gray-900">{totalStaff}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4 border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Monthly Cost</p>
            <p className="text-2xl font-bold text-gray-900">
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
  const [modal, setModal] = useState<ModalType>(null);
  const [selectedStaff, setSelectedStaff] = useState<HiredStaffMember | null>(null);
  const [bonusAmount, setBonusAmount] = useState<string | number>("");
  const [bonusPreset, setBonusPreset] = useState<string | null>(null);
  const [bonusNotes, setBonusNotes] = useState("");
  const [terminateReason, setTerminateReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAllStaff, setShowAllStaff] = useState(false);

  // Memoized staff list for performance
  const displayedStaff = useMemo(() => {
    return showAllStaff ? hiredStaff : hiredStaff.slice(0, 6);
  }, [showAllStaff]);

  // Bonus Modal Logic
  const handleBonusPreset = (amount: string) => {
    setBonusPreset(amount);
    setBonusAmount(amount);
  };

  const handleBonusOther = () => {
    setBonusPreset("other");
    setBonusAmount("");
  };

  const handleBonusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success(`Bonus of ${formatCurrency(Number(bonusAmount), selectedStaff?.currency || "USD")} sent to ${selectedStaff?.name}!`);
    setModal(null);
    setBonusAmount("");
    setBonusPreset(null);
    setBonusNotes("");
    setIsLoading(false);
  };

  const handleTerminateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success(`${selectedStaff?.name} has been terminated.`);
    setModal(null);
    setTerminateReason("");
    setIsLoading(false);
  };

  const handleStaffAction = (action: ModalType, staff: HiredStaffMember) => {
    setSelectedStaff(staff);
    setModal(action);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <main className="flex-1 p-6 md:p-10 w-full max-w-none px-4 sm:px-8">
        {/* Main Title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome Back, {clientName}</h1>
            <p className="text-gray-600 mt-1">Here's what's happening with your team today</p>
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
            <EmptyStaffState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedStaff.map((member) => (
                <StaffCard
                  key={member.id}
                  member={member}
                  onView={() => handleStaffAction("view", member)}
                  onBonus={() => handleStaffAction("bonus", member)}
                  onTerminate={() => handleStaffAction("terminate", member)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Recent Hire Requests Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Recent Hire Requests</h2>
          <div className="space-y-6">
            {hireRequests.map((request) => (
              <Card key={request.id} className="p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{request.role}</h3>
                    <p className="text-sm text-gray-500">Created: {request.date}</p>
                  </div>
                  <Badge 
                    variant={
                      request.status === "Open" ? "default" :
                      request.status === "Interviewing" ? "secondary" :
                      request.status === "Hired" ? "default" : "outline"
                    }
                    className="text-sm"
                  >
                    {request.status}
                  </Badge>
                </div>
                
                {/* Candidates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {request.candidates.length === 0 ? (
                    <>
                      <EmptyCandidatePlaceholder />
                      <EmptyCandidatePlaceholder />
                      <EmptyCandidatePlaceholder />
                    </>
                  ) : (
                    request.candidates.map((candidate) => (
                      <CandidateTeaserCard key={candidate.id} candidate={candidate} />
                    ))
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Browse Other Talents Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Browse Other Talents in Our Pool</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            {talentPoolCandidates.slice(0, 8).map((candidate) => (
              <CandidateTeaserCard key={candidate.id} candidate={candidate} />
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

        {/* Give Bonus Modal */}
        <Dialog open={modal === "bonus"} onOpenChange={open => { 
          if (!open) { 
            setModal(null); 
            setBonusPreset(null); 
            setBonusAmount(""); 
            setBonusNotes(""); 
          } 
        }}>
          <DialogContent className="max-w-md w-full">
            <DialogTitle className="sr-only">Staff Dialog</DialogTitle>
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
                    disabled={isLoading}
                  >
                    ${amt}
                  </Button>
                ))}
                <Button
                  type="button"
                  variant={bonusPreset === "other" ? "default" : "outline"}
                  className="flex-1"
                  onClick={handleBonusOther}
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
              )}
              <Textarea
                placeholder="Notes (optional)"
                value={bonusNotes}
                onChange={e => setBonusNotes(e.target.value)}
                className="min-h-[80px]"
                disabled={isLoading}
              />
              <DialogFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <LoadingSpinner /> : "Give Bonus"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Terminate Modal */}
        <Dialog open={modal === "terminate"} onOpenChange={open => { 
          if (!open) { 
            setModal(null); 
            setTerminateReason(""); 
          } 
        }}>
          <DialogContent className="max-w-md w-full">
            <DialogTitle className="sr-only">Staff Dialog</DialogTitle>
            <form onSubmit={handleTerminateSubmit} className="flex flex-col gap-4">
              <DialogHeader>
                <DialogTitle>Terminate {selectedStaff?.name}</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. Please provide a reason for termination.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">Warning</p>
                  <p>Terminating staff will immediately end their contract and access.</p>
                </div>
              </div>
              <Textarea
                placeholder="Reason for Termination"
                value={terminateReason}
                onChange={e => setTerminateReason(e.target.value)}
                className="min-h-[100px]"
                required
                disabled={isLoading}
              />
              <DialogFooter>
                <Button type="submit" variant="destructive" className="w-full" disabled={isLoading}>
                  {isLoading ? <LoadingSpinner /> : "Terminate Staff"}
                </Button>
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
                {selectedStaff?.recentActivity && (
                  <div><span className="font-semibold">Recent Activity:</span> {selectedStaff.recentActivity}</div>
                )}
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
      </main>
    </div>
  );
}