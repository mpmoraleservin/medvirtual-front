"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdvancedTable } from "@/components/ui/advanced-table";
import { PageTitle } from '@/components/ui/page-title';
import { CandidateCard } from '@/components/ui/candidate-card';

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

// Same mock data as client page
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

// Top Matches: seleccionar los primeros 3 candidatos Senior como ejemplo
const topMatches = candidates.filter(c => c.experienceLevel === 'Senior').slice(0, 3);

// Definir columnas y filtros para AdvancedTable
const columns = [
  { key: 'name' as keyof Candidate, header: 'Name', searchable: true },
  { key: 'role' as keyof Candidate, header: 'Role', searchable: true },
  { key: 'specializations' as keyof Candidate, header: 'Specializations', type: 'badge' as const, searchable: true, badgeConfig: { variant: 'secondary' as const, className: 'bg-chart-5/10 text-chart-5 text-xs font-medium' } },
  { key: 'skills' as keyof Candidate, header: 'Skills', type: 'badge' as const, searchable: true, badgeConfig: { variant: 'outline' as const, className: 'bg-primary/10 text-primary text-xs font-medium' } },
  { key: 'experienceLevel' as keyof Candidate, header: 'Experience', type: 'status' as const, statusColors: { Junior: 'bg-chart-2/10 text-chart-2', Mid: 'bg-chart-3/10 text-chart-3', Senior: 'bg-chart-4/10 text-chart-4' } },
  { key: 'pricePerMonth' as keyof Candidate, header: 'Price/Month', type: 'currency' as const },
];
const filters = [
  { key: 'role' as keyof Candidate, label: 'Role', type: 'text' as const, placeholder: 'e.g. Nurse' },
  { key: 'specializations' as keyof Candidate, label: 'Specialization', type: 'text' as const, placeholder: 'e.g. Pediatrics' },
  { key: 'languages' as keyof Candidate, label: 'Language', type: 'text' as const, placeholder: 'e.g. Spanish' },
  { key: 'experienceLevel' as keyof Candidate, label: 'Experience Level', type: 'select' as const, options: [ { value: 'Junior', label: 'Junior' }, { value: 'Mid', label: 'Mid' }, { value: 'Senior', label: 'Senior' } ] },
  { key: 'skills' as keyof Candidate, label: 'Skills', type: 'text' as const, placeholder: 'e.g. BLS Certified' },
];

export default function ProspectTalentPoolPage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Talent Pool" />
      
      {/* Top Matches Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topMatches.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            variant="featured"
            onViewProfile={() => {}}
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Candidates</CardTitle>
        </CardHeader>
        <CardContent>
          <AdvancedTable
            data={candidates}
            columns={columns}
            filters={filters}
            defaultPageSize={10}
            showPagination={true}
            showSearch={true}
            showFilters={true}
            showPageSize={true}
            searchPlaceholder="Search candidates..."
            emptyMessage="No candidates found."
          />
        </CardContent>
      </Card>
    </div>
  );
} 