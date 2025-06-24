"use client";
import { StatCard } from "@/components/ui/stat-card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Users, ClipboardList, CalendarCheck, UserCheck, Star, Eye } from "lucide-react"
import React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"

// --- TypeScript interfaces ---
interface HireRequest {
  id: string
  role: string
  status: "Open" | "Interviewing" | "Hired" | "Closed"
  date: string
}

interface RecommendedTalent {
  id: string
  title: string
  experience: string
  languages: string[]
}

// --- Candidate interfaces and mock data (copied from talent pool) ---
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

// --- Mock Data ---
const clientName = "Dr. Smith"

const hireRequests: HireRequest[] = [
  { id: "1", role: "Registered Nurse", status: "Open", date: "2024-06-01" },
  { id: "2", role: "Medical Receptionist", status: "Interviewing", date: "2024-05-28" },
  { id: "3", role: "Lab Technician", status: "Hired", date: "2024-05-20" },
]

const candidates: Candidate[] = [
  {
    id: "1",
    name: "Ana Torres",
    avatarUrl: undefined,
    role: "Registered Nurse",
    pricePerMonth: 2200,
    currency: "USD",
    languages: ["English", "Spanish"],
    specializations: ["Pediatrics", "Emergency Care"],
    skills: ["IV Therapy", "BLS Certified", "Patient Care"],
    about: "Compassionate nurse with 5+ years in pediatric and emergency settings. Passionate about patient advocacy and continuous learning.",
    education: [],
    experience: [],
    experienceLevel: "Senior",
  },
  {
    id: "2",
    name: "Luis Fernández",
    avatarUrl: undefined,
    role: "Medical Assistant",
    pricePerMonth: 1500,
    currency: "USD",
    languages: ["English", "Spanish"],
    specializations: ["Family Medicine"],
    skills: ["Phlebotomy", "Patient Scheduling", "Medical Records"],
    about: "Detail-oriented medical assistant with 3 years of experience supporting family medicine practices.",
    education: [],
    experience: [],
    experienceLevel: "Mid",
  },
  {
    id: "3",
    name: "Emily Brown",
    avatarUrl: undefined,
    role: "Lab Technician",
    pricePerMonth: 1800,
    currency: "USD",
    languages: ["English"],
    specializations: ["Diagnostics", "Microbiology"],
    skills: ["Blood Analysis", "Lab Safety", "Equipment Calibration"],
    about: "Lab tech with a strong background in diagnostics and microbiology. Focused on accuracy and safety.",
    education: [],
    experience: [],
    experienceLevel: "Mid",
  },
];
const topMatches = candidates.slice(0, 3);
const handleViewProfile = (candidate: Candidate) => {
  alert(`View profile for ${candidate.name}`);
};

// --- StatCard Data ---
const hiredStaff = 12
const openRequests = 2
const upcomingPanels = 1

export default function ClientDashboard() {
  return (
    <div className="min-h-screen bg-background flex">
      <main className="flex-1 p-6 md:p-10 w-full max-w-none px-4 sm:px-8">
        {/* Título principal */}
        <h1 className="text-3xl font-bold mb-8 text-foreground">Welcome Back, {clientName}</h1>

        {/* Grid de StatCards */}
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

        {/* Recent Hire Requests */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Recent Hire Requests</h2>
          <div className="rounded-lg border bg-card p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hireRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell>{req.role}</TableCell>
                    <TableCell>
                      <Badge variant={
                        req.status === "Open"
                          ? "default"
                          : req.status === "Interviewing"
                          ? "secondary"
                          : req.status === "Hired"
                          ? "default"
                          : "outline"
                      }>
                        {req.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{req.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* Talent Recommended for You (replaced by Top Matches) */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Top Matches for You</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topMatches.map((candidate) => (
              <Card
                key={candidate.id}
                className="relative flex flex-col items-center justify-between w-full max-w-[320px] mx-auto p-4 rounded-xl border-2 border-yellow-300 bg-[#FDF8E5] shadow-lg min-h-[320px]"
              >
                {/* Star and eye */}
                <div className="absolute top-3 left-3">
                  <Star className="w-6 h-6 text-yellow-400 drop-shadow" fill="#FACC15" />
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 bg-white shadow-md hover:bg-blue-50 text-blue-600 border border-blue-100"
                  onClick={() => handleViewProfile(candidate)}
                  aria-label="View Profile"
                >
                  <Eye className="w-5 h-5" />
                </Button>
                {/* Avatar and data */}
                <div className="flex flex-col items-center gap-2 mt-6 mb-4">
                  <Avatar name={candidate.name} src={candidate.avatarUrl} className="w-12 h-12 text-xl" />
                  <div className="font-bold text-base text-[#222] text-center">{candidate.name}</div>
                  <div className="text-muted-foreground text-sm text-center">{candidate.role}</div>
                  <div className="flex flex-wrap gap-1 justify-center mt-1">
                    {candidate.specializations.map((spec) => (
                      <Badge key={spec} variant="secondary" className="text-xs px-2 py-0.5">{spec}</Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1 justify-center mt-1">
                    {candidate.skills.slice(0, 2).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs px-2 py-0.5">{skill}</Badge>
                    ))}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">Exp: <span className="font-medium">{candidate.experienceLevel}</span></div>
                </div>
                {/* Fixed button at the bottom */}
                <div className="w-full mt-auto pt-2">
                  <Button
                    className="w-full gap-2 bg-[#009FE3] hover:bg-[#007bbd] text-white font-semibold shadow-md"
                    onClick={() => alert(`Request interview with ${candidate.name}`)}
                  >
                    <UserCheck className="w-4 h-4" /> Request Interview
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
} 