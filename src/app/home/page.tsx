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
    picture: "https://randomuser.me/api/portraits/men/32.jpg",
    initials: "J.D.",
    country: "🇺🇸 United States",
    profession: "Cardiologist",
    income: "$18,000",
    languages: "English, Spanish",
    specializations: ["Interventional Cardiology", "Echocardiography"],
    skills: ["Patient Care"],
  },
  {
    id: "2",
    picture: "https://randomuser.me/api/portraits/women/45.jpg",
    initials: "M.L.",
    country: "🇨🇦 Canada",
    profession: "Pediatrician",
    income: "$10,000",
    languages: "English, French",
    specializations: ["Neonatology"],
    skills: ["Acute Care"],
  },
  {
    id: "3",
    picture: "https://randomuser.me/api/portraits/men/76.jpg",
    initials: "R.S.",
    country: "🇬🇧 United Kingdom",
    profession: "General Surgeon",
    income: "£12,000",
    languages: "English",
    specializations: ["Trauma Surgery"],
    skills: ["Postoperative Care", "Emergency Response"],
  },
  {
    id: "4",
    picture: "https://randomuser.me/api/portraits/women/22.jpg",
    initials: "A.K.",
    country: "🇦🇺 Australia",
    profession: "Dermatologist",
    income: "AUD 4,000",
    languages: "English, Hindi",
    specializations: ["Cosmetic Dermatology", "Skin Cancer Diagnosis"],
    skills: ["Dermatoscopy"],
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

export default function Home() {
  const [search, setSearch] = useState("");
  const [candidates, setCandidates] = useState<CandidateInfo[]>(mocked);
  const [filteredCandidates, setFilteredCandidates] =
    useState<CandidateInfo[]>(candidates);

  useEffect(() => {
    setCandidates(mocked);
  }, []);

  return (
    <div className="relative w-full flex items-start bg-[#F6F8FA]">
      <div className="w-full h-screen p-4 overflow-y-scroll">
        <div className="w-full flex flex-col mt-8">
          <h1 className="font-bold text-[32px] text-[#181D27] mb-7">
            Available Candidates
          </h1>
          <div className="w-full flex items-center justify-between mb-8">
            <div className="relative w-full max-w-98">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                className="w-full border-[1px] border-[#A4A7AE] rounded-lg pl-10 pr-8 py-2 bg-white"
                placeholder="Search 'Medical Assistant'"
                value={search}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearch(value);

                  const filtered = candidates.filter((c) =>
                    c.profession.toLowerCase().includes(value.toLowerCase())
                  );
                  setFilteredCandidates(filtered);
                }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setFilteredCandidates(candidates);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4 cursor-pointer" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-center gap-8">
              <div className="flex items-center justify-center gap-2 font-normal text-[#A4A7AE]">
                Show
                <Select>
                  <SelectTrigger className="w-18 cursor-pointer">
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent className="w-16">
                    <SelectItem value="10" className="cursor-pointer">
                      10
                    </SelectItem>
                    <SelectItem value="25" className="cursor-pointer">
                      25
                    </SelectItem>
                    <SelectItem value="50" className="cursor-pointer">
                      50
                    </SelectItem>
                  </SelectContent>
                </Select>
                per page
              </div>
            </div>
          </div>
          {filteredCandidates.length > 0 ? (
            <Table>
              <TableHeader className="bg-gray-100 text-sm font-medium text-[#414651]">
                <TableRow className="text-sm font-medium text-[#414651]">
                  <TableHead className="w-[100px]"></TableHead>
                  <TableHead className="w-[100px] text-xs font-medium text-[#414651]">
                    Name
                  </TableHead>
                  <TableHead className="text-center text-xs font-medium text-[#414651]">
                    Income/Month
                  </TableHead>
                  <TableHead className="text-center text-xs font-medium text-[#414651]">
                    Language
                  </TableHead>
                  <TableHead className="text-center text-xs font-medium text-[#414651]">
                    Specializations
                  </TableHead>
                  <TableHead className="text-center text-xs font-medium text-[#414651]">
                    Skills & Certifications
                  </TableHead>
                  <TableHead className="text-center text-xs font-medium text-[#414651]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredCandidates.map((candidate) => {
                  return (
                    <TableRow
                      key={candidate.id}
                      className="border-b-[1px] border-[#E9EAEB] hover:bg-[#01546B0D]"
                    >
                      <TableCell className="">
                        <div className="w-full h-full flex items-center justify-center">
                          <img
                            src={candidate.picture}
                            alt=""
                            className="rounded-full w-12 h-12"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="">
                        <div className="flex flex-col gap-2">
                          <span className="text-lg font-medium text-[#181D27] leading-[110%]">
                            {candidate.initials}
                          </span>
                          <span className="font-medium text-sm text-[#535862]">
                            {candidate.country}
                          </span>
                          <Badge className="bg-gray-200 rounded-full text-[#181D27] font-medium text-xs">
                            {candidate.profession}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-center">
                        {candidate.income}
                      </TableCell>
                      <TableCell className="text-center">
                        {candidate.languages}
                      </TableCell>
                      <TableCell className="">
                        <div className="w-full h-full flex items-center justify-center flex-wrap gap-1">
                          {candidate.specializations.map((spec) => {
                            return (
                              <Badge
                                key={spec}
                                className="rounded-full bg-[#F9F5FF] text-[#5C3CC2] text-xs font-medium"
                              >
                                {spec}
                              </Badge>
                            );
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="">
                        <div className="w-full h-full flex items-center justify-center flex-wrap gap-1">
                          {candidate.skills.map((skill) => {
                            return (
                              <Badge
                                key={skill}
                                className="rounded-full bg-[#175CD31A] text-[#175CD3] text-xs font-medium"
                              >
                                {skill}
                              </Badge>
                            );
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="p-0 align-middle text-center">
                        <div className="flex justify-center items-center w-full h-full">
                          <button className="w-fit rounded-lg p-3 bg-[#175CD31A] cursor-pointer">
                            <Eye color="#175CD3" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="w-full items-center justify-center bg-white py-16 rounded-lg">
              <h1 className="w-full text-center font-bold text-[32px] text-[#181D27] mb-4">
                No Candidates found
              </h1>
              <p className="w-full text-center font-normal text-sm text-[#181D27]">{`We couldn't find any candidates matching "${search}"`}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
