"use client";
import { StatCard } from "@/components/ui/stat-card"
import { Badge } from "@/components/ui/badge"
import { Users, ClipboardList, CalendarCheck, Search, Clock } from "lucide-react"
import React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import Link from "next/link"

// --- TypeScript interfaces ---
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
const clientName = "Dr. Smith"

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

// Hire requests with candidates (one empty, one with candidates)
const hireRequests: HireRequest[] = [
  { 
    id: "1", 
    role: "Registered Nurse", 
    status: "Open", 
    date: "2024-06-01",
    candidates: [] // Empty candidates array to test placeholder logic
  },
  { 
    id: "2", 
    role: "Medical Receptionist", 
    status: "Interviewing", 
    date: "2024-05-28",
    candidates: [candidate1, candidate2, candidate3] // 3 candidates
  },
  { 
    id: "3", 
    role: "Lab Technician", 
    status: "Hired", 
    date: "2024-05-20",
    candidates: [candidate3] // 1 candidate
  },
];

// General talent pool candidates (at least 15 for the browse section)
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
    name: "David Wilson",
    avatarUrl: undefined,
    role: "Physical Therapist",
    pricePerMonth: 2800,
    currency: "USD",
    languages: ["English"],
    specializations: ["Orthopedics", "Sports Medicine"],
    skills: ["Manual Therapy", "Exercise Prescription", "Patient Assessment"],
    about: "Physical therapist specializing in orthopedic and sports rehabilitation.",
    education: [],
    experience: [],
    experienceLevel: "Senior",
  },
  {
    id: "10",
    name: "Lisa Chen",
    avatarUrl: undefined,
    role: "Pharmacist",
    pricePerMonth: 3200,
    currency: "USD",
    languages: ["English", "Mandarin"],
    specializations: ["Clinical Pharmacy"],
    skills: ["Medication Review", "Drug Interactions", "Patient Counseling"],
    about: "Clinical pharmacist with expertise in medication management and patient safety.",
    education: [],
    experience: [],
    experienceLevel: "Senior",
  },
  {
    id: "11",
    name: "Roberto Silva",
    avatarUrl: undefined,
    role: "Medical Technologist",
    pricePerMonth: 1900,
    currency: "USD",
    languages: ["English", "Portuguese"],
    specializations: ["Clinical Laboratory"],
    skills: ["Lab Testing", "Quality Control", "Equipment Maintenance"],
    about: "Medical technologist with experience in clinical laboratory operations.",
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

// --- StatCard Data ---
const hiredStaff = 12
const openRequests = 2
const upcomingPanels = 1

// --- Component for Candidate Teaser Card ---
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

// --- Component for Empty Candidate Placeholder ---
const EmptyCandidatePlaceholder = () => (
  <Card className="p-4 border border-dashed border-gray-300 bg-gray-50">
    <div className="flex flex-col items-center justify-center h-20 text-center">
      <Clock className="w-6 h-6 text-gray-400 mb-2" />
      <p className="text-sm text-gray-500">Sourcing the best candidates for you...</p>
    </div>
  </Card>
);

export default function ClientDashboard() {
  return (
    <div className="min-h-screen bg-background flex">
      <main className="flex-1 p-6 md:p-10 w-full max-w-none px-4 sm:px-8">
        {/* Main Title */}
        <h1 className="text-3xl font-bold mb-8 text-foreground">Welcome Back, {clientName}</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <StatCard
            title="Hired Staff"
            value={hiredStaff}
            icon={<Users className="h-5 w-5" />}
            variant="success"
            description="Total staff hired through MedVirtual"
          />
          <StatCard
            title="Open Hire Requests"
            value={openRequests}
            icon={<ClipboardList className="h-5 w-5" />}
            variant="primary"
            description="Requests currently open"
          />
          <StatCard
            title="Upcoming Panel Interviews"
            value={upcomingPanels}
            icon={<CalendarCheck className="h-5 w-5" />}
            variant="secondary"
            description="Scheduled interviews this week"
          />
        </div>

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
                    // Show 3 placeholder cards when no candidates
                    <>
                      <EmptyCandidatePlaceholder />
                      <EmptyCandidatePlaceholder />
                      <EmptyCandidatePlaceholder />
                    </>
                  ) : (
                    // Show actual candidate cards
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
            {talentPoolCandidates.slice(0, 10).map((candidate) => (
              <CandidateTeaserCard key={candidate.id} candidate={candidate} />
            ))}
          </div>
          
          {/* Show More Button */}
          <div className="flex justify-center">
            <Link href="/dashboard/client/talent-pool">
              <Button className="px-8 py-3 text-base" variant="default">
                <Search className="w-5 h-5 mr-2" />
                Show More
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
} 