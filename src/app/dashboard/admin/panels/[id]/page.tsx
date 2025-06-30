"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Calendar, Clock, Users, MapPin, Building, Award, CheckCircle } from "lucide-react";

// --- TypeScript interfaces ---
export interface Candidate {
  id: string;
  name: string;
  role: string;
  experience: string;
  location: string;
  avatarUrl?: string;
  languages: string[];
  specializations: string[];
  keyHighlight: string;
}

export interface HireRequest {
  id: string;
  title: string;
  clientName: string;
  department: string;
  location: string;
  requestedBy: string;
  practiceArea: string;
  scheduleNeeds: string;
  roleTitle: string;
  requiredSkills: string[];
  keyResponsibilities: string;
  priority: "High" | "Medium" | "Low";
  dateSubmitted: string;
}

export interface CandidatePanel {
  id: string;
  hireRequest: HireRequest;
  candidates: Candidate[];
  status: "Panel Ready" | "Interview Scheduled" | "Awaiting Decision" | "Placement Complete";
  dateCreated: string;
  scheduledDate?: string;
  scheduledTime?: string;
  assignedTo: string;
  winnerId?: string;
}

// --- Mock Data ---
const mockHireRequest: HireRequest = {
  id: "1",
  title: "Registered Nurse for St. Joseph's",
  clientName: "St. Joseph's Medical Center",
  department: "Nursing",
  location: "Miami, FL",
  requestedBy: "Dr. Sarah Johnson",
  practiceArea: "General Medicine",
  scheduleNeeds: "Full-time",
  roleTitle: "Registered Nurse",
  requiredSkills: ["Patient Care", "IV Therapy", "Medication Administration", "Teamwork", "Communication"],
  keyResponsibilities: "Provide direct patient care, administer medications, monitor vital signs, collaborate with healthcare team, maintain patient records.",
  priority: "High",
  dateSubmitted: "2024-06-15"
};

const mockCandidates: Candidate[] = [
  {
    id: "1",
    name: "Ana Torres",
    role: "Registered Nurse",
    experience: "5 years",
    location: "Miami, FL",
    avatarUrl: "/api/placeholder/40/40",
    languages: ["English", "Spanish"],
    specializations: ["Emergency Care", "Pediatrics"],
    keyHighlight: "Bilingual with 5 years ER experience"
  },
  {
    id: "2",
    name: "Luis Fernández",
    role: "Registered Nurse",
    experience: "3 years",
    location: "Orlando, FL",
    avatarUrl: "/api/placeholder/40/40",
    languages: ["English", "Spanish"],
    specializations: ["Medical-Surgical", "ICU"],
    keyHighlight: "ICU certified with critical care expertise"
  },
  {
    id: "3",
    name: "Emily Brown",
    role: "Registered Nurse",
    experience: "7 years",
    location: "Tampa, FL",
    avatarUrl: "/api/placeholder/40/40",
    languages: ["English"],
    specializations: ["Oncology", "Palliative Care"],
    keyHighlight: "Oncology specialist with 7 years experience"
  },
  {
    id: "4",
    name: "Carlos Ruiz",
    role: "Registered Nurse",
    experience: "4 years",
    location: "Jacksonville, FL",
    avatarUrl: "/api/placeholder/40/40",
    languages: ["English", "Spanish"],
    specializations: ["Cardiology", "Telemetry"],
    keyHighlight: "Cardiac care specialist with telemetry certification"
  },
  {
    id: "5",
    name: "Sofia Martinez",
    role: "Registered Nurse",
    experience: "6 years",
    location: "Fort Lauderdale, FL",
    avatarUrl: "/api/placeholder/40/40",
    languages: ["English", "Spanish", "Portuguese"],
    specializations: ["Labor & Delivery", "Postpartum"],
    keyHighlight: "Trilingual with maternity care expertise"
  }
];

// Mock panels with different statuses
const mockPanels: Record<string, CandidatePanel> = {
  "interview-scheduled": {
    id: "1",
    hireRequest: mockHireRequest,
    candidates: mockCandidates,
    status: "Interview Scheduled",
    dateCreated: "2024-06-20",
    scheduledDate: "2024-06-25",
    scheduledTime: "14:00",
    assignedTo: "Admin A"
  },
  "awaiting-decision": {
    id: "2",
    hireRequest: mockHireRequest,
    candidates: mockCandidates,
    status: "Awaiting Decision",
    dateCreated: "2024-06-20",
    scheduledDate: "2024-06-22",
    scheduledTime: "14:00",
    assignedTo: "Admin B"
  },
  "placement-complete": {
    id: "3",
    hireRequest: mockHireRequest,
    candidates: mockCandidates,
    status: "Placement Complete",
    dateCreated: "2024-06-20",
    scheduledDate: "2024-06-20",
    scheduledTime: "14:00",
    assignedTo: "Admin C",
    winnerId: "3" // Emily Brown is the winner
  }
};

// --- Component ---
export default function PanelDetailsPage() {
  // Usa el mock por defecto para desarrollo
  const fallbackPanel = mockPanels["awaiting-decision"];
  const usedPanel = fallbackPanel;

  const handleSelectWinner = (candidateId: string) => {
    console.log("Selected winner:", candidateId);
    // Here would go the real logic
    alert(`Candidate ${candidateId} selected as winner!`);
  };

  const getStatusColor = (status: CandidatePanel["status"]) => {
    switch (status) {
      case "Interview Scheduled":
        return "bg-purple-500 text-white";
      case "Awaiting Decision":
        return "bg-orange-500 text-white";
      case "Placement Complete":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Here would go the real logic
  // (handleSaveNotes function removed as it was unused)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Panel for &quot;{usedPanel.hireRequest.roleTitle}&quot; Request
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage candidate panel and interview details
          </p>
        </div>
        <Badge className={getStatusColor(usedPanel.status)}>
          {usedPanel.status}
        </Badge>
      </div>

      {/* Hire Request Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Hire Request Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-lg text-foreground">{usedPanel.hireRequest.title}</h3>
              <p className="text-muted-foreground">{usedPanel.hireRequest.clientName}</p>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{usedPanel.hireRequest.location}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Department</p>
              <p className="text-foreground">{usedPanel.hireRequest.department}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Practice Area</p>
              <p className="text-foreground">{usedPanel.hireRequest.practiceArea}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Schedule</p>
              <p className="text-foreground">{usedPanel.hireRequest.scheduleNeeds}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Required Skills</p>
            <div className="flex flex-wrap gap-2">
              {usedPanel.hireRequest.requiredSkills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Key Responsibilities</p>
            <p className="text-foreground text-sm">{usedPanel.hireRequest.keyResponsibilities}</p>
          </div>
        </CardContent>
      </Card>

      {/* Interview Schedule - Only show if scheduled or later */}
      {(usedPanel.status === "Interview Scheduled" || usedPanel.status === "Awaiting Decision" || usedPanel.status === "Placement Complete") && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Interview Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{usedPanel.scheduledDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{usedPanel.scheduledTime}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Candidates Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Candidates ({usedPanel.candidates.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {usedPanel.candidates.map((candidate) => (
              <Card key={candidate.id} className="relative">
                <CardContent className="p-4">
                  {/* Winner Badge for Placement Complete */}
                  {usedPanel.status === "Placement Complete" && usedPanel.winnerId === candidate.id && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-green-500 text-white flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        Winner
                      </Badge>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <Avatar 
                      src={candidate.avatarUrl} 
                      alt={candidate.name}
                      name={candidate.name}
                      className="h-12 w-12"
                    />
                    
                    <div className="flex-1 space-y-2">
                      <div>
                        <h3 className="font-semibold text-foreground">{candidate.name}</h3>
                        <p className="text-sm text-muted-foreground">{candidate.role}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-foreground font-medium">{candidate.keyHighlight}</p>
                        <p className="text-xs text-muted-foreground">{candidate.experience} • {candidate.location}</p>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {candidate.languages.map((lang) => (
                          <Badge key={lang} variant="outline" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {candidate.specializations.map((spec) => (
                          <Badge key={spec} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>

                      {/* Action Button - Only show for Awaiting Decision status */}
                      {usedPanel.status === "Awaiting Decision" && (
                        <Button
                          size="sm"
                          onClick={() => handleSelectWinner(candidate.id)}
                          className="mt-2"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Select as Winner
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 