"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { PageTitle } from "@/components/ui/page-title";
import { AdvancedTable, TableColumn } from "@/components/ui/advanced-table";

// --- Candidate Types and Mock Data ---
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
    education: [
      { institution: "University of Miami", degree: "BSN", startYear: 2014, endYear: 2018 },
    ],
    experience: [
      { company: "Jackson Memorial Hospital", role: "Pediatric Nurse", startYear: 2018, endYear: 2022, description: "Provided care for children in a high-volume hospital." },
      { company: "Mercy Hospital", role: "ER Nurse", startYear: 2022, description: "Emergency care for diverse patient populations." },
    ],
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
    education: [
      { institution: "Miami Dade College", degree: "Medical Assistant Certificate", startYear: 2017, endYear: 2018 },
    ],
    experience: [
      { company: "Sunshine Clinic", role: "Medical Assistant", startYear: 2019, description: "Supported physicians and managed patient flow." },
    ],
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
    education: [
      { institution: "FIU", degree: "BSc Biology", startYear: 2013, endYear: 2017 },
    ],
    experience: [
      { company: "Quest Diagnostics", role: "Lab Technician", startYear: 2017, endYear: 2021 },
      { company: "Baptist Health", role: "Senior Lab Tech", startYear: 2021 },
    ],
    experienceLevel: "Mid",
  },
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
    education: [
      { institution: "University of Florida", degree: "MPAS", startYear: 2012, endYear: 2016 },
    ],
    experience: [
      { company: "UF Health", role: "Physician Assistant", startYear: 2016 },
    ],
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
    education: [
      { institution: "Miami Dade College", degree: "AA Business", startYear: 2015, endYear: 2017 },
    ],
    experience: [
      { company: "Bayside Medical", role: "Receptionist", startYear: 2017 },
    ],
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
    education: [
      { institution: "University of Miami", degree: "DNP", startYear: 2010, endYear: 2014 },
    ],
    experience: [
      { company: "Jackson Health", role: "Nurse Practitioner", startYear: 2014 },
    ],
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
    education: [
      { institution: "FIU", degree: "BBA Accounting", startYear: 2011, endYear: 2015 },
    ],
    experience: [
      { company: "MedBill Solutions", role: "Billing Coordinator", startYear: 2015 },
    ],
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
    education: [
      { institution: "Miami Dade College", degree: "Radiology Tech Certificate", startYear: 2012, endYear: 2014 },
    ],
    experience: [
      { company: "Baptist Health", role: "X-Ray Technician", startYear: 2014 },
    ],
    experienceLevel: "Mid",
  },
  {
    id: "9",
    name: "David Kim",
    avatarUrl: undefined,
    role: "Medical Biller",
    pricePerMonth: 1400,
    currency: "USD",
    languages: ["English", "Korean"],
    specializations: ["Medical Billing"],
    skills: ["CPT Coding", "ICD-10", "Claims Submission"],
    about: "Certified medical biller with expertise in coding and claims processing.",
    education: [
      { institution: "Miami Dade College", degree: "Medical Billing Certificate", startYear: 2016, endYear: 2017 },
    ],
    experience: [
      { company: "Medical Billing Solutions", role: "Medical Biller", startYear: 2017 },
    ],
    experienceLevel: "Mid",
  },
  {
    id: "10",
    name: "Lisa Anderson",
    avatarUrl: undefined,
    role: "Registered Nurse",
    pricePerMonth: 2400,
    currency: "USD",
    languages: ["English"],
    specializations: ["ICU", "Critical Care"],
    skills: ["Ventilator Management", "Critical Care", "ACLS"],
    about: "ICU nurse with specialized training in critical care and ventilator management.",
    education: [
      { institution: "University of Central Florida", degree: "BSN", startYear: 2015, endYear: 2019 },
    ],
    experience: [
      { company: "Orlando Health", role: "ICU Nurse", startYear: 2019 },
    ],
    experienceLevel: "Mid",
  },
  {
    id: "11",
    name: "Robert Wilson",
    avatarUrl: undefined,
    role: "Physician Assistant",
    pricePerMonth: 3200,
    currency: "USD",
    languages: ["English"],
    specializations: ["Emergency Medicine"],
    skills: ["Emergency Procedures", "Trauma Care", "Patient Stabilization"],
    about: "Emergency medicine PA with experience in trauma and emergency procedures.",
    education: [
      { institution: "Nova Southeastern University", degree: "MPAS", startYear: 2013, endYear: 2017 },
    ],
    experience: [
      { company: "Memorial Regional Hospital", role: "Emergency PA", startYear: 2017 },
    ],
    experienceLevel: "Senior",
  },
  {
    id: "12",
    name: "Jennifer Davis",
    avatarUrl: undefined,
    role: "Medical Assistant",
    pricePerMonth: 1600,
    currency: "USD",
    languages: ["English", "French"],
    specializations: ["Dermatology"],
    skills: ["Skin Procedures", "Patient Prep", "Medical Records"],
    about: "Medical assistant specializing in dermatology with experience in skin procedures.",
    education: [
      { institution: "Broward College", degree: "Medical Assistant Certificate", startYear: 2018, endYear: 2019 },
    ],
    experience: [
      { company: "Dermatology Associates", role: "Medical Assistant", startYear: 2019 },
    ],
    experienceLevel: "Mid",
  },
  {
    id: "13",
    name: "Michael Johnson",
    avatarUrl: undefined,
    role: "Lab Technician",
    pricePerMonth: 1900,
    currency: "USD",
    languages: ["English"],
    specializations: ["Molecular Biology"],
    skills: ["PCR Testing", "DNA Analysis", "Lab Equipment"],
    about: "Molecular biology lab tech with expertise in PCR testing and DNA analysis.",
    education: [
      { institution: "University of South Florida", degree: "BSc Biology", startYear: 2014, endYear: 2018 },
    ],
    experience: [
      { company: "Quest Diagnostics", role: "Molecular Lab Tech", startYear: 2018 },
    ],
    experienceLevel: "Mid",
  },
  {
    id: "14",
    name: "Sarah Thompson",
    avatarUrl: undefined,
    role: "Nurse Practitioner",
    pricePerMonth: 3800,
    currency: "USD",
    languages: ["English"],
    specializations: ["Cardiology"],
    skills: ["Cardiac Assessment", "ECG Interpretation", "Patient Education"],
    about: "Cardiology NP with specialized training in cardiac assessment and patient education.",
    education: [
      { institution: "University of Florida", degree: "DNP", startYear: 2009, endYear: 2013 },
    ],
    experience: [
      { company: "Cardiology Associates", role: "Cardiology NP", startYear: 2013 },
    ],
    experienceLevel: "Senior",
  },
  {
    id: "15",
    name: "Alex Rodriguez",
    avatarUrl: undefined,
    role: "Receptionist",
    pricePerMonth: 1300,
    currency: "USD",
    languages: ["English", "Spanish", "Portuguese"],
    specializations: ["Multi-Specialty"],
    skills: ["Multi-Language Support", "Insurance Verification", "Patient Scheduling"],
    about: "Trilingual receptionist with experience in multi-specialty medical practices.",
    education: [
      { institution: "Miami Dade College", degree: "AA Healthcare Administration", startYear: 2016, endYear: 2018 },
    ],
    experience: [
      { company: "Multi-Specialty Medical Group", role: "Receptionist", startYear: 2018 },
    ],
    experienceLevel: "Mid",
  },
];

// Table columns configuration
const columns: TableColumn<Candidate>[] = [
  {
    key: "role",
    header: "Role",
    searchable: true,
    type: "text"
  },
  {
    key: "specializations",
    header: "Specializations",
    searchable: true,
    type: "badge",
    badgeConfig: {
      variant: "secondary",
      className: "rounded-full bg-chart-5/10 text-chart-5 text-xs font-medium"
    }
  },
  {
    key: "skills",
    header: "Skills",
    searchable: true,
    type: "badge",
    badgeConfig: {
      variant: "outline",
      className: "rounded-full bg-primary/10 text-primary text-xs font-medium"
    }
  },
  {
    key: "experienceLevel",
    header: "Experience",
    type: "status",
    statusColors: {
      "Junior": "bg-primary/10 text-primary",
      "Mid": "bg-chart-3/10 text-chart-3",
      "Senior": "bg-chart-2/10 text-chart-2"
    }
  },
  {
    key: "pricePerMonth",
    header: "Price/Month",
    type: "currency"
  }
];

// Filters configuration
const filters = [
  {
    key: "role" as keyof Candidate,
    label: "Role",
    type: 'text' as const,
    placeholder: "e.g. Nurse"
  },
  {
    key: "specializations" as keyof Candidate,
    label: "Specialization",
    type: 'text' as const,
    placeholder: "e.g. Pediatrics"
  },
  {
    key: "languages" as keyof Candidate,
    label: "Language",
    type: 'text' as const,
    placeholder: "e.g. Spanish"
  },
  {
    key: "experienceLevel" as keyof Candidate,
    label: "Experience Level",
    type: 'select' as const,
    options: [
      { value: "Junior", label: "Junior" },
      { value: "Mid", label: "Mid" },
      { value: "Senior", label: "Senior" }
    ]
  },
  {
    key: "skills" as keyof Candidate,
    label: "Skills",
    type: 'text' as const,
    placeholder: "e.g. BLS Certified"
  }
];

// CandidateTeaserCard compacto reutilizable
function CandidateTeaserCard({ candidate, onClick }: { candidate: Candidate, onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full h-full min-h-[210px] bg-white border border-border rounded-xl shadow-sm p-4 flex flex-col items-start gap-2 hover:shadow-md transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
      style={{ minWidth: 0 }}
    >
      <div className="flex items-center gap-2 w-full mb-1">
        <Avatar name={candidate.name} src={candidate.avatarUrl} className="w-10 h-10 text-lg" />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-base text-foreground truncate">{candidate.role}</div>
          <div className="text-sm text-muted-foreground truncate">Senior Level</div>
        </div>
        <span className="text-yellow-400 text-xl ml-1">★</span>
      </div>
      <div className="flex flex-wrap gap-1 mb-2">
        {candidate.languages.map(l => (
          <span key={l} className="bg-gray-100 rounded-full px-2 py-0.5 text-xs">{l}</span>
        ))}
        {candidate.specializations.map(s => (
          <span key={s} className="bg-gray-100 rounded-full px-2 py-0.5 text-xs">{s}</span>
        ))}
      </div>
      <div className="bg-yellow-50 rounded px-2 py-1 text-yellow-700 font-semibold text-xs mb-2 w-fit">
        Top Skill: {candidate.skills[0]}
      </div>
      <div className="mt-auto w-full">
        <div className="bg-blue-50 rounded px-2 py-3 text-center font-bold text-xl text-[#1976a2] w-full">
          ${candidate.pricePerMonth.toLocaleString()}<span className="font-normal text-base text-gray-500"> /mo</span>
        </div>
      </div>
    </button>
  );
}

export default function ProspectTalentPoolPage() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const hasPandaDocLink = false;

  const handleViewProfile = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setProfileOpen(true);
  };

  // Top Talent: primeros 3 Senior
  const topTalent = candidates.filter(c => c.experienceLevel === 'Senior').slice(0, 3);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <PageTitle title="Talent Pool" subtitle="Browse and discover talented healthcare professionals" />

        {/* Info disclaimer igual que en hire-requests */}
        <div className="mb-8 p-4 border-yellow-400 bg-yellow-50 rounded">
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 mt-0.5 flex-shrink-0 text-yellow-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
            <div className="text-yellow-800">
              <strong>Info:</strong> Your MedVirtual Concierge is preparing your service agreement. You will receive a PandaDoc to sign soon. We're working on your request!
            </div>
          </div>
        </div>

        {/* Top Talent Section */}
        <div className="mb-8">
          <div className="font-bold text-lg mb-2 text-primary">Top Talent</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
            {topTalent.map(candidate => (
              <CandidateTeaserCard key={candidate.id} candidate={candidate} onClick={() => { setSelectedCandidate(candidate); setProfileOpen(true); }} />
            ))}
          </div>
        </div>

        <AdvancedTable
          data={candidates}
          columns={columns}
          title=""
          searchPlaceholder="Search by name, role, or skills..."
          filters={filters}
          onViewDetails={handleViewProfile}
          showPagination={true}
          showPageSize={true}
          showSearch={true}
          showFilters={true}
          pageSizeOptions={[5, 10, 20, 50]}
          defaultPageSize={5}
          emptyMessage="No candidates found."
          className="mb-8"
        />

        {/* Candidate Profile Sheet (lateral) */}
        <Sheet open={profileOpen} onOpenChange={setProfileOpen}>
          <SheetContent side="right" className="w-[40vw] min-w-[400px] max-w-[48rem] p-0">
            {selectedCandidate && (
              <div className="relative h-full flex flex-col">
                <div className="sticky top-0 z-10 bg-background px-6 pt-6 pb-4 shadow-sm border-b flex items-center justify-between gap-2">
                  <div className="flex items-center gap-4">
                    <Avatar name={selectedCandidate.name} src={selectedCandidate.avatarUrl} className="w-14 h-14 text-2xl" />
                    <div>
                      {/* Si no hay PandaDoc, nombre borroso */}
                      {hasPandaDocLink ? (
                        <h2 className="text-2xl font-bold">{selectedCandidate.name}</h2>
                      ) : (
                        <div className="filter blur-sm pointer-events-none select-none">
                          <h2 className="text-2xl font-bold">{selectedCandidate.name}</h2>
                        </div>
                      )}
                      <div className="text-lg text-muted-foreground font-medium">{selectedCandidate.role}</div>
                    </div>
                  </div>
                  {/* Si no hay PandaDoc, oculta el botón de Request Interview */}
                  {hasPandaDocLink && (
                    <div className="flex items-center gap-2">
                      <Button className="gap-2" variant="default" onClick={() => alert(`Request interview with ${selectedCandidate.name}`)}>
                        Request Interview
                      </Button>
                    </div>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2">
                  {/* Info principal visible */}
                  <div className="flex flex-col md:flex-row md:items-center md:gap-6 mb-4">
                    <div className="flex-1 flex flex-col items-center md:items-start gap-2 mt-4 md:mt-0">
                      <div className="text-muted-foreground text-lg text-center md:text-left">{selectedCandidate.role}</div>
                      <div className="mt-1 text-base font-semibold text-primary text-center md:text-left">
                        {selectedCandidate.currency === "USD" ? "$" : selectedCandidate.currency}
                        {selectedCandidate.pricePerMonth.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">/month</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Skills y Specializations visibles */}
                  <div className="mb-4">
                    <div className="mb-2 font-semibold text-foreground">Key Skills</div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedCandidate.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                    <div className="mb-2 font-semibold text-foreground">Specializations</div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedCandidate.specializations.slice(0, 2).map((spec) => (
                        <Badge key={spec} variant="secondary">{spec}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* CTA y contenido borroso si no hay PandaDoc */}
                  {!hasPandaDocLink && (
                    <div className="mb-4 p-4 bg-yellow-50 border border-yellow-400 rounded-lg flex flex-col items-center">
                      <span className="font-bold text-yellow-800 text-lg mb-1">Unlock Full Candidate Details</span>
                      <span className="text-yellow-800 text-sm mb-2 text-center">Your MedVirtual Concierge is preparing your service agreement. You will receive a PandaDoc to sign soon. We're working on your request!</span>
                    </div>
                  )}
                  <div className={hasPandaDocLink ? "" : "filter blur-sm pointer-events-none select-none"}>
                    <div className="flex flex-col md:flex-row md:items-center md:gap-6 mb-2">
                      <div className="flex-1 flex flex-col items-center md:items-start gap-2 mt-4 md:mt-0">
                        <div className="mt-1 flex flex-wrap gap-2 text-sm justify-center md:justify-start">
                          {selectedCandidate.languages.map((lang) => (
                            <Badge key={lang} variant="outline">{lang}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="flex-1">
                        <div className="mb-2 font-semibold text-foreground">About Me</div>
                        <div className="text-sm text-muted-foreground mb-4">
                          {selectedCandidate.about}
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
                          {selectedCandidate.education.map((edu, idx) => (
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
                          {selectedCandidate.experience.map((exp, idx) => (
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
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
} 