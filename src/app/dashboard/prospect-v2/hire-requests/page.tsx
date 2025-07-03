"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AdvancedTable, TableColumn } from "@/components/ui/advanced-table";
import { AlertTriangle, Info, Clock, Eye, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

// Unified Hire Request Status Type
type HireRequestStatus = "Pending Signature";

interface HireRequest {
  id: string;
  role: string;
  dateSubmitted: string;
  status: HireRequestStatus;
  description?: string;
  // Campos del step 2 (Role) del formulario
  roleTitle: string;
  department: string;
  practiceArea: string;
  scheduleNeeds: string;
  location: string;
  requiredSkills: string[];
  keyResponsibilities: string;
  priority: "High" | "Medium" | "Low";
  estimatedStartDate?: string;
  contractLength?: string;
  remoteWork: "Yes" | "No" | "Hybrid";
  travelRequired: "Yes" | "No";
  certifications?: string[];
  experienceLevel: "Entry" | "Mid" | "Senior" | "Lead";
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  benefits?: string[];
  additionalNotes?: string;
}

// --- Mock Data ---
const hireRequests: HireRequest[] = [
  {
    id: "1",
    role: "Medical Receptionist",
    dateSubmitted: "2024-06-01",
    status: "Pending Signature",
    description: "Full-time receptionist for busy family practice",
    roleTitle: "Medical Receptionist",
    department: "Front Office",
    practiceArea: "Family Medicine",
    scheduleNeeds: "Full-time (40 hours/week)",
    location: "Miami, FL",
    requiredSkills: ["Patient Scheduling", "Insurance Verification", "Medical Records", "Customer Service", "Multi-line Phone System"],
    keyResponsibilities: "Greet patients, schedule appointments, verify insurance, maintain patient records, handle phone calls, process payments, and ensure smooth front office operations.",
    priority: "High",
    estimatedStartDate: "2024-07-01",
    contractLength: "12 months",
    remoteWork: "No",
    travelRequired: "No",
    certifications: ["Medical Office Administration Certificate"],
    experienceLevel: "Mid",
    salaryRange: {
      min: 35000,
      max: 45000,
      currency: "USD"
    },
    benefits: ["Health Insurance", "Paid Time Off", "401(k)", "Professional Development"],
    additionalNotes: "Bilingual (English/Spanish) preferred. Experience with EMR systems required."
  },
  {
    id: "2", 
    role: "Registered Nurse",
    dateSubmitted: "2024-05-28",
    status: "Pending Signature",
    description: "Part-time RN for pediatric clinic",
    roleTitle: "Registered Nurse - Pediatrics",
    department: "Nursing",
    practiceArea: "Pediatrics",
    scheduleNeeds: "Part-time (24 hours/week)",
    location: "Orlando, FL",
    requiredSkills: ["Pediatric Nursing", "IV Therapy", "Patient Assessment", "BLS Certification", "PALS Certification"],
    keyResponsibilities: "Provide direct patient care to pediatric patients, administer medications, monitor vital signs, assist physicians during procedures, educate families, and maintain accurate patient records.",
    priority: "Medium",
    estimatedStartDate: "2024-06-15",
    contractLength: "6 months",
    remoteWork: "No",
    travelRequired: "No",
    certifications: ["RN License", "BLS", "PALS"],
    experienceLevel: "Senior",
    salaryRange: {
      min: 65000,
      max: 75000,
      currency: "USD"
    },
    benefits: ["Health Insurance", "Dental Insurance", "Vision Insurance", "Paid Time Off", "Continuing Education"],
    additionalNotes: "Must have at least 3 years of pediatric nursing experience. Weekend availability required."
  }
];

// Unified status configuration
const STATUS_CONFIG = {
  "Pending Signature": {
    color: "bg-chart-5 text-primary-foreground border-transparent",
    icon: <Clock className="w-4 h-4" />,
    description: "Waiting for client to sign service agreement"
  }
};

export default function ProspectHireRequestsPage() {
  const [selectedRequest, setSelectedRequest] = useState<HireRequest | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [requestToCancel, setRequestToCancel] = useState<HireRequest | null>(null);
  const hasPandaDocLink = false;

  const handleViewRequest = (request: HireRequest) => {
    setSelectedRequest(request);
    setViewDialogOpen(true);
  };

  const handleCancelRequest = (request: HireRequest) => {
    setRequestToCancel(request);
    setCancelDialogOpen(true);
  };

  const confirmCancelRequest = () => {
    if (requestToCancel) {
      alert(`Hire request "${requestToCancel.role}" has been canceled.`);
      setCancelDialogOpen(false);
      setRequestToCancel(null);
    }
  };

  // --- Advanced Table Configuration ---
  const columns: TableColumn<HireRequest & { actions?: React.ReactNode }>[] = [
    {
      key: "role",
      header: "Role",
      searchable: true,
      type: "text"
    },
    {
      key: "dateSubmitted",
      header: "Date Submitted",
      type: "date"
    },
    {
      key: "status",
      header: "Status",
      type: "badge",
      badgeConfig: {
        variant: "secondary",
        className: STATUS_CONFIG["Pending Signature"].color
      }
    },
    {
      key: "description",
      header: "Description",
      type: "text"
    },
    {
      key: "actions",
      header: "Actions",
      type: "action",
      render: (_value, item) => (
        <div className="flex items-center gap-2 justify-end">
          <Button
            size="icon"
            variant="ghost"
            aria-label="View"
            title="View"
            style={{ background: '#eaf1f5', color: '#1976a2', border: 'none', boxShadow: 'none' }}
            className="hover:bg-[#eaf1f5] focus:bg-[#eaf1f5] active:bg-[#eaf1f5]"
            onClick={e => { e.stopPropagation(); if (hasPandaDocLink) handleViewRequest(item); }}
            disabled={!hasPandaDocLink}
          >
            <Eye className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            aria-label="Remove"
            title="Remove"
            onClick={e => { e.stopPropagation(); if (hasPandaDocLink) handleCancelRequest(item); }}
            disabled={!hasPandaDocLink}
          >
            <X className="w-5 h-5 text-white" />
          </Button>
        </div>
      )
    }
  ];

  // Muestra la tabla vacía y el mensaje custom
  const tableData: (HireRequest & { actions?: React.ReactNode })[] = [];

  return (
    <div className="min-h-screen bg-background flex">
      <main className="flex-1 p-6 md:p-10 w-full max-w-none px-4 sm:px-8">
        {/* NUEVO: Mensaje destacado si no hay PandaDoc */}
        {/* Banner eliminado por requerimiento */}

        {/* Header with Title only */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            My Hire Requests
          </h1>
        </div>

        {/* Prominent Alert Box */}
        <Card className="mb-8 p-4 border-yellow-400 bg-yellow-50">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 mt-0.5 flex-shrink-0 text-yellow-700" />
            <div className="text-yellow-800">
              <strong>Info:</strong> Your MedVirtual Concierge is preparing your service agreement. You will receive a PandaDoc to sign soon. We're working on your request!
            </div>
          </div>
        </Card>

        {/* Hire Requests Advanced Table */}
        <AdvancedTable
          data={tableData}
          columns={columns}
          searchPlaceholder="Search hire requests..."
          emptyMessage="You will be able to submit hire requests once we send you the PandaDoc."
          showSearch={true}
          showFilters={false}
          showPagination={false}
          showPageSize={false}
          showMobileCards={true}
          defaultPageSize={10}
        />

        {/* Additional Call to Action */}
        {hireRequests.length > 0 && (
          <Card className="mt-8 p-6 bg-yellow-50 border-yellow-400">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 mt-1 flex-shrink-0 text-yellow-700" />
              <div>
                <h3 className="font-semibold mb-2 text-yellow-800">
                  Service Agreement In Progress
                </h3>
                <p className="mb-4 text-yellow-800">
                  Your MedVirtual Concierge is preparing your service agreement. You will receive a PandaDoc to sign soon. We're working on your request!
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* View Hire Request Dialog */}
        <Sheet open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <SheetContent side="right" className="w-[40vw] min-w-[400px] max-w-[48rem] p-0">
            {selectedRequest && (
              <div className="relative h-full flex flex-col">
                <div className="sticky top-0 z-10 bg-background px-6 pt-6 pb-4 shadow-sm border-b flex items-center justify-between gap-2">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedRequest.roleTitle}</h2>
                    <div className="text-lg text-muted-foreground font-medium">{selectedRequest.department}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={STATUS_CONFIG[selectedRequest.status].color}>
                      {STATUS_CONFIG[selectedRequest.status].icon}
                      {selectedRequest.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2">
                  {/* Next Steps Alert - move to top */}
                  <div className="bg-yellow-50 border border-yellow-400 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 mt-0.5 text-yellow-700" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">Next Steps</p>
                        <p className="text-sm text-yellow-800/80 mt-1">
                          Your MedVirtual Concierge is preparing your service agreement. You will receive a PandaDoc to sign soon. We're working on your request!
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Main Fields: Match Role Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
                    <div>
                      <div className="font-semibold text-sm text-foreground mb-1">Role Title</div>
                      <div className="font-normal text-base text-muted-foreground">{selectedRequest.roleTitle}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-foreground mb-1">Practice Area</div>
                      <div className="font-normal text-base text-muted-foreground">{selectedRequest.practiceArea}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-foreground mb-1">Schedule Needs</div>
                      <div className="font-normal text-base text-muted-foreground">{selectedRequest.scheduleNeeds}</div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="font-semibold text-sm text-foreground mb-2">Required Skills</div>
                      <div className="flex flex-wrap gap-2">
                        {selectedRequest.requiredSkills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="font-semibold text-sm text-foreground mb-2">Key Responsibilities</div>
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground leading-relaxed">{selectedRequest.keyResponsibilities}</p>
                      </div>
                    </div>
                  </div>
                  {/* Divider */}
                  <div className="border-t border-border my-6" />
                  {/* More Details Section */}
                  <div className="mb-6">
                    <div className="font-semibold text-base text-foreground mb-2">More Details</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      <div>
                        <div className="font-semibold text-sm text-foreground mb-1">Department</div>
                        <div className="font-normal text-base text-muted-foreground">{selectedRequest.department}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground mb-1">Location</div>
                        <div className="font-normal text-base text-muted-foreground">{selectedRequest.location}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground mb-1">Experience Level</div>
                        <div className="font-normal text-base text-muted-foreground">{selectedRequest.experienceLevel}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground mb-1">Priority</div>
                        <Badge variant="outline" className={
                          selectedRequest.priority === "High" ? "border-destructive text-destructive" :
                          selectedRequest.priority === "Medium" ? "border-chart-3 text-chart-3" :
                          "border-chart-2 text-chart-2"
                        }>
                          {selectedRequest.priority}
                        </Badge>
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground mb-1">Remote Work</div>
                        <div className="font-normal text-base text-muted-foreground">{selectedRequest.remoteWork}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground mb-1">Date Submitted</div>
                        <div className="font-normal text-base text-muted-foreground">{selectedRequest.dateSubmitted}</div>
                      </div>
                      {selectedRequest.estimatedStartDate && (
                        <div>
                          <div className="font-semibold text-sm text-foreground mb-1">Estimated Start Date</div>
                          <div className="font-normal text-base text-muted-foreground">{selectedRequest.estimatedStartDate}</div>
                        </div>
                      )}
                      {selectedRequest.contractLength && (
                        <div>
                          <div className="font-semibold text-sm text-foreground mb-1">Contract Length</div>
                          <div className="font-normal text-base text-muted-foreground">{selectedRequest.contractLength}</div>
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-sm text-foreground mb-1">Travel Required</div>
                        <div className="font-normal text-base text-muted-foreground">{selectedRequest.travelRequired}</div>
                      </div>
                      {selectedRequest.salaryRange && (
                        <div>
                          <div className="font-semibold text-sm text-foreground mb-1">Salary Range</div>
                          <div className="font-normal text-base text-muted-foreground">
                            {selectedRequest.salaryRange.currency === "USD" ? "$" : selectedRequest.salaryRange.currency}
                            {selectedRequest.salaryRange.min.toLocaleString()} - {selectedRequest.salaryRange.max.toLocaleString()}
                          </div>
                        </div>
                      )}
                      {selectedRequest.certifications && selectedRequest.certifications.length > 0 && (
                        <div>
                          <div className="font-semibold text-sm text-foreground mb-1">Required Certifications</div>
                          <div className="flex flex-wrap gap-2">
                            {selectedRequest.certifications.map((cert, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {cert}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedRequest.benefits && selectedRequest.benefits.length > 0 && (
                        <div>
                          <div className="font-semibold text-sm text-foreground mb-1">Benefits</div>
                          <div className="flex flex-wrap gap-2">
                            {selectedRequest.benefits.map((benefit, index) => (
                              <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {selectedRequest.additionalNotes && (
                        <div className="md:col-span-2">
                          <div className="font-semibold text-sm text-foreground mb-1">Additional Notes</div>
                          <div className="bg-muted p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground leading-relaxed">{selectedRequest.additionalNotes}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>

        {/* Cancel Hire Request Dialog */}
        <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Cancel Hire Request</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this hire request? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {requestToCancel && (
              <div className="space-y-4">
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 mt-0.5 text-destructive" />
                    <div>
                      <p className="font-medium text-destructive">Cancel Request</p>
                      <p className="text-sm text-destructive/80 mt-1">
                        Role: <strong>{requestToCancel.role}</strong><br />
                        Submitted: {requestToCancel.dateSubmitted}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
                Keep Request
              </Button>
              <Button variant="destructive" onClick={confirmCancelRequest}>
                Cancel Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
} 