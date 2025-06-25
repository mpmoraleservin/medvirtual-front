"use client";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, SearchIcon, X } from "lucide-react";
import { AdvancedTable, TableColumn } from "@/components/ui/advanced-table";

type CandidateInfo = {
  id: string;
  picture: string;
  initials: string;
  country: string;
  profession: string;
  income: string;
  languages: string;
  specializations: string[];
  skills: string[];
};

const mocked: CandidateInfo[] = [
  {
    id: "1",
    picture: "https://randomuser.me/api/portraits/women/1.jpg",
    initials: "A.T.",
    country: "🇺🇸 United States",
    profession: "Registered Nurse",
    income: "$2,200",
    languages: "English, Spanish",
    specializations: ["Pediatrics", "Emergency Care"],
    skills: ["IV Therapy", "BLS Certified"],
  },
  {
    id: "2",
    picture: "https://randomuser.me/api/portraits/men/2.jpg",
    initials: "L.F.",
    country: "🇺🇸 United States",
    profession: "Medical Assistant",
    income: "$1,500",
    languages: "English, Spanish",
    specializations: ["Family Medicine"],
    skills: ["Phlebotomy", "Patient Scheduling"],
  },
  {
    id: "3",
    picture: "https://randomuser.me/api/portraits/women/3.jpg",
    initials: "E.B.",
    country: "🇺🇸 United States",
    profession: "Lab Technician",
    income: "$1,800",
    languages: "English",
    specializations: ["Diagnostics", "Microbiology"],
    skills: ["Blood Analysis", "Lab Safety"],
  },
  {
    id: "4",
    picture: "https://randomuser.me/api/portraits/men/4.jpg",
    initials: "M.P.",
    country: "🇺🇸 United States",
    profession: "Physician Assistant",
    income: "$3,500",
    languages: "English",
    specializations: ["Internal Medicine"],
    skills: ["Patient Assessment", "Treatment Planning"],
  },
  {
    id: "5",
    picture: "https://randomuser.me/api/portraits/men/12.jpg",
    initials: "T.H.",
    country: "🇩🇪 Germany",
    profession: "Radiologist",
    income: "€1,000",
    languages: "German, English",
    specializations: ["MRI", "CT Imaging"],
    skills: ["Image Interpretation", "Diagnostic Reporting"],
  },
];

const columns: TableColumn<CandidateInfo>[] = [
  {
    key: "initials",
    header: "Name",
    width: "150px",
    searchable: true,
    type: "text"
  },
  {
    key: "profession",
    header: "Profession",
    searchable: true,
    type: "text"
  },
  {
    key: "income",
    header: "Income/Month",
    type: "currency"
  },
  {
    key: "languages",
    header: "Language",
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
      className: "rounded-full bg-[#F9F5FF] text-[#5C3CC2] text-xs font-medium"
    }
  },
  {
    key: "skills",
    header: "Skills & Certifications",
    searchable: true,
    type: "badge",
    badgeConfig: {
      variant: "outline",
      className: "rounded-full bg-[#175CD31A] text-[#175CD3] text-xs font-medium"
    }
  },
  {
    key: "id",
    header: "Actions",
    type: "action"
  }
];

const filters = [
  {
    key: "profession" as keyof CandidateInfo,
    label: "Profession",
    type: 'text' as const,
    placeholder: "e.g. Nurse"
  },
  {
    key: "languages" as keyof CandidateInfo,
    label: "Language",
    type: 'text' as const,
    placeholder: "e.g. Spanish"
  },
  {
    key: "country" as keyof CandidateInfo,
    label: "Country",
    type: 'text' as const,
    placeholder: "e.g. United States"
  }
];

export default function Home() {
  const [candidates, setCandidates] = useState<CandidateInfo[]>(mocked);

  useEffect(() => {
    setCandidates(mocked);
  }, []);

  return (
    <div className="relative w-full flex items-start bg-[#F6F8FA]">
      <div className="w-full h-screen p-4 overflow-y-scroll">
        <AdvancedTable
          data={candidates}
          columns={columns}
          title="Available Candidates"
          searchPlaceholder="Search 'Medical Assistant'"
          filters={filters}
          showPagination={true}
          showPageSize={true}
          showSearch={true}
          showFilters={true}
          className="mb-0"
        />
      </div>
    </div>
  );
}
