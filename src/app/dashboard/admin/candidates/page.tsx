"use client";

import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserCheck, Star, Eye, Filter, X } from "lucide-react";
import { Dialog as FilterDialog, DialogContent as FilterDialogContent, DialogHeader as FilterDialogHeader, DialogTitle as FilterDialogTitle, DialogFooter as FilterDialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageTitle } from "@/components/ui/page-title";

// --- Candidate Types and Mock Data (copied from client/talent-pool) ---
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
      { company: "Radiology Associates", role: "X-Ray Technician", startYear: 2014 },
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
    languages: ["English"],
    specializations: ["Claims"],
    skills: ["Billing Software", "Data Entry", "Claims Follow-up"],
    about: "Medical biller with a keen eye for detail and accuracy.",
    education: [
      { institution: "FIU", degree: "BSc Health Administration", startYear: 2010, endYear: 2014 },
    ],
    experience: [
      { company: "HealthFirst", role: "Medical Biller", startYear: 2014 },
    ],
    experienceLevel: "Junior",
  },
  {
    id: "10",
    name: "Sara Cohen",
    avatarUrl: undefined,
    role: "Front Desk Specialist",
    pricePerMonth: 1250,
    currency: "USD",
    languages: ["English", "Spanish"],
    specializations: ["Reception"],
    skills: ["Customer Service", "Appointment Scheduling", "Multi-line Phones"],
    about: "Front desk specialist with a warm personality and strong organizational skills.",
    education: [
      { institution: "Miami Dade College", degree: "AA Communications", startYear: 2013, endYear: 2015 },
    ],
    experience: [
      { company: "Downtown Clinic", role: "Front Desk Specialist", startYear: 2015 },
    ],
    experienceLevel: "Junior",
  },
];

const topMatches = candidates.slice(0, 3);

export default function CandidatesPage() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  const [experienceLevelFilter, setExperienceLevelFilter] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [skillsFilter, setSkillsFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  React.useEffect(() => { setPage(1); }, [search, roleFilter, specializationFilter, languageFilter, pageSize]);

  const handleViewProfile = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setProfileOpen(true);
  };

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase()) ||
      c.specializations.some((s) => s.toLowerCase().includes(search.toLowerCase())) ||
      c.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchesRole = roleFilter ? c.role.toLowerCase().includes(roleFilter.toLowerCase()) : true;
    const matchesSpec = specializationFilter ? c.specializations.some((s) => s.toLowerCase().includes(specializationFilter.toLowerCase())) : true;
    const matchesLang = languageFilter ? c.languages.some((l) => l.toLowerCase().includes(languageFilter.toLowerCase())) : true;
    const matchesLevel = experienceLevelFilter && experienceLevelFilter !== "all" ? c.experienceLevel === experienceLevelFilter : true;
    const matchesPriceMin = priceMin ? c.pricePerMonth >= Number(priceMin) : true;
    const matchesPriceMax = priceMax ? c.pricePerMonth <= Number(priceMax) : true;
    const matchesSkills = skillsFilter ? c.skills.some((s) => s.toLowerCase().includes(skillsFilter.toLowerCase())) : true;
    return matchesSearch && matchesRole && matchesSpec && matchesLang && matchesLevel && matchesPriceMin && matchesPriceMax && matchesSkills;
  });

  const pageCount = Math.ceil(filteredCandidates.length / pageSize);
  const paginatedCandidates = useMemo(() =>
    filteredCandidates.slice((page - 1) * pageSize, page * pageSize),
    [filteredCandidates, page, pageSize]
  );

  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <PageTitle title="All Candidates" subtitle="Browse and manage all candidates in the system" />
        {/* Filters below the title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex flex-1 gap-2">
            <Input
              type="text"
              placeholder="Search by role..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full sm:w-64"
            />
            <Button variant="outline" className="gap-2" onClick={() => setFilterOpen(true)}>
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
        </div>
        {/* Table section, no extra title */}
        <div className="mb-8">
          {/* Mobile: cards stacked, Desktop: table */}
          <div className="flex flex-col gap-3 sm:hidden">
            {paginatedCandidates.map((candidate) => (
              <div key={candidate.id} className="rounded-lg border bg-white p-3 flex flex-col gap-2 shadow-sm">
                <div className="flex items-center gap-3">
                  <Avatar name={candidate.name} src={candidate.avatarUrl} />
                  <div className="flex-1">
                    <div className="font-semibold text-[#222] leading-tight text-sm">{candidate.name}</div>
                    <div className="text-xs text-muted-foreground leading-tight">{candidate.role}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 text-[10px] mt-1">
                  {candidate.specializations.map((spec) => (
                    <Badge key={spec} variant="secondary">{spec}</Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1 text-[10px] mt-1">
                  {candidate.skills.map((skill) => (
                    <Badge key={skill} variant="outline">{skill}</Badge>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] mt-1">
                  <div><span className="font-medium">Exp:</span> {candidate.experienceLevel}</div>
                  <div><span className="font-medium">Price:</span> {candidate.currency === "USD" ? "$" : candidate.currency}{candidate.pricePerMonth}</div>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <Button size="icon" className="bg-blue-100 hover:bg-blue-200 text-blue-700" aria-label="View Profile" title="View Profile" onClick={() => handleViewProfile(candidate)}>
                    <Eye className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ))}
            {paginatedCandidates.length === 0 && (
              <div className="text-center text-muted-foreground py-8 text-xs">No candidates found.</div>
            )}
          </div>
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <Table className="w-full min-w-[600px]">
              <TableHeader>
                <TableRow className="bg-[#F6F6F7] border-b border-[#E5E7EB]">
                  <TableHead className="font-bold text-base text-[#222] py-4">Name</TableHead>
                  <TableHead className="font-bold text-base text-[#222] py-4">Role</TableHead>
                  <TableHead className="font-bold text-base text-[#222] py-4">Specializations</TableHead>
                  <TableHead className="font-bold text-base text-[#222] py-4">Skills</TableHead>
                  <TableHead className="font-bold text-base text-[#222] py-4 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCandidates.map((candidate) => (
                  <TableRow key={candidate.id} className="bg-white border-b border-[#F1F1F1] hover:bg-[#F6F6F7] transition-colors group">
                    <TableCell className="py-4 align-middle">
                      <div className="flex items-center gap-3">
                        <Avatar name={candidate.name} src={candidate.avatarUrl} />
                        <div>
                          <div className="font-semibold text-[#222] leading-tight">{candidate.name}</div>
                          <div className="text-sm text-muted-foreground leading-tight">{candidate.role}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 align-middle text-[#222]">{candidate.role}</TableCell>
                    <TableCell className="py-4 align-middle">
                      <div className="flex flex-wrap gap-1">
                        {candidate.specializations.map((spec) => (
                          <Badge key={spec} variant="secondary">{spec}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 align-middle">
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.map((skill) => (
                          <Badge key={skill} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-center align-middle">
                      <div className="flex justify-center gap-2">
                        <Button
                          size="icon"
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700"
                          aria-label="View Profile"
                          title="View Profile"
                          onClick={() => handleViewProfile(candidate)}
                        >
                          <Eye className="w-5 h-5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedCandidates.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No candidates found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {/* Pagination Controls avanzados */}
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
          {/* Filtros avanzados en Dialog */}
          <FilterDialog open={filterOpen} onOpenChange={setFilterOpen}>
            <FilterDialogContent className="max-w-sm w-full">
              <FilterDialogHeader>
                <FilterDialogTitle>Advanced Filters</FilterDialogTitle>
              </FilterDialogHeader>
              <div className="flex flex-col space-y-4 py-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={roleFilter} onChange={e => setRoleFilter(e.target.value)} placeholder="e.g. Nurse" />
                <Label htmlFor="specialization">Specialization</Label>
                <Input id="specialization" value={specializationFilter} onChange={e => setSpecializationFilter(e.target.value)} placeholder="e.g. Pediatrics" />
                <Label htmlFor="language">Language</Label>
                <Input id="language" value={languageFilter} onChange={e => setLanguageFilter(e.target.value)} placeholder="e.g. Spanish" />
                <Label htmlFor="experienceLevel">Experience Level</Label>
                <Select value={experienceLevelFilter} onValueChange={setExperienceLevelFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Junior">Junior</SelectItem>
                    <SelectItem value="Mid">Mid</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                  </SelectContent>
                </Select>
                <Label htmlFor="priceMin">Price/Month Min</Label>
                <Input id="priceMin" type="number" value={priceMin} onChange={e => setPriceMin(e.target.value)} placeholder="Min price" />
                <Label htmlFor="priceMax">Price/Month Max</Label>
                <Input id="priceMax" type="number" value={priceMax} onChange={e => setPriceMax(e.target.value)} placeholder="Max price" />
                <Label htmlFor="skills">Skills</Label>
                <Input id="skills" value={skillsFilter} onChange={e => setSkillsFilter(e.target.value)} placeholder="e.g. BLS Certified" />
              </div>
              <FilterDialogFooter className="flex flex-col gap-2 mt-2">
                <Button onClick={() => { setRoleFilter(""); setSpecializationFilter(""); setLanguageFilter(""); setExperienceLevelFilter(""); setPriceMin(""); setPriceMax(""); setSkillsFilter(""); }}>Clear Filters</Button>
                <Button onClick={() => setFilterOpen(false)} variant="default">Apply</Button>
              </FilterDialogFooter>
            </FilterDialogContent>
          </FilterDialog>
        </div>
        {/* Candidate Profile Sheet (lateral) */}
        <Sheet open={profileOpen} onOpenChange={setProfileOpen}>
          <SheetContent side="right" className="w-[40vw] min-w-[400px] max-w-[48rem] p-0">
            {selectedCandidate && (
              <div className="relative h-full flex flex-col">
                <div className="sticky top-0 z-10 bg-white px-6 pt-6 pb-4 shadow-sm border-b flex items-center justify-between gap-2">
                  <div className="flex items-center gap-4">
                    <Avatar name={selectedCandidate.name} src={selectedCandidate.avatarUrl} className="w-14 h-14 text-2xl" />
                    <div>
                      <h2 className="text-2xl font-bold">{selectedCandidate.name}</h2>
                      <div className="text-lg text-muted-foreground font-medium">{selectedCandidate.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button className="gap-2 bg-[#009FE3] hover:bg-[#007bbd] text-white font-semibold shadow-md" onClick={() => alert(`Request interview with ${selectedCandidate.name}`)}>
                      <UserCheck className="w-4 h-4" /> Interview
                    </Button>
                    <Button size="icon" variant="ghost" aria-label="Close" onClick={() => setProfileOpen(false)} className="mt-1">
                      <X className="w-6 h-6" />
                    </Button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2">
                  <div className="flex flex-col md:flex-row md:items-center md:gap-6 mb-2">
                    {/* Info principal */}
                    <div className="flex-1 flex flex-col items-center md:items-start gap-2 mt-4 md:mt-0">
                      <div className="text-muted-foreground text-lg text-center md:text-left">{selectedCandidate.role}</div>
                      <div className="mt-1 text-base font-semibold text-[#009FE3] text-center md:text-left">
                        {selectedCandidate.currency === "USD" ? "$" : selectedCandidate.currency}
                        {selectedCandidate.pricePerMonth.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">/month</span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-2 text-sm justify-center md:justify-start">
                        {selectedCandidate.languages.map((lang) => (
                          <Badge key={lang} variant="outline">{lang}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                      <div className="mb-2 font-semibold text-[#222]">Specialization</div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedCandidate.specializations.map((spec) => (
                          <Badge key={spec} variant="secondary">{spec}</Badge>
                        ))}
                      </div>
                      <div className="mb-2 font-semibold text-[#222]">Skills & Certifications</div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedCandidate.skills.map((skill) => (
                          <Badge key={skill} variant="outline">{skill}</Badge>
                        ))}
                      </div>
                      <div className="mb-2 font-semibold text-[#222]">About Me</div>
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
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
} 