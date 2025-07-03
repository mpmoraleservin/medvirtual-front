"use client";

import { AdvancedTable } from '@/components/ui/advanced-table';
import type { TableColumn } from '@/components/ui/advanced-table';
import { PageTitle } from '@/components/ui/page-title';
import { Button } from '@/components/ui/button';
import { Eye, XCircle, Edit, Save, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useState } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

// Unified Hire Request Status Type
type HireRequestStatus = "New" | "Sourcing" | "Panel Ready" | "Interview Scheduled" | "Awaiting Decision" | "Placement Complete" | "Canceled";

interface HireRequest {
  id: string;
  role: string;
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
  salaryRange?: { min: number; max: number; currency: string };
  benefits?: string[];
  additionalNotes?: string;
  status: HireRequestStatus;
  dateSubmitted: string;
  description?: string;
}

// Mock data
const hireRequests: HireRequest[] = [
  {
    id: "1",
    role: "Registered Nurse",
    roleTitle: "Registered Nurse",
    department: "Emergency",
    practiceArea: "General Medicine",
    scheduleNeeds: "Full-time (40 hours/week)",
    location: "Miami, FL",
    requiredSkills: ["IV Therapy", "Patient Care", "BLS Certified"],
    keyResponsibilities: "Provide patient care, administer IVs, monitor vitals.",
    priority: "High",
    estimatedStartDate: "2024-07-01",
    contractLength: "12 months",
    remoteWork: "No",
    travelRequired: "No",
    certifications: ["RN License", "BLS"],
    experienceLevel: "Mid",
    salaryRange: { min: 50000, max: 60000, currency: "USD" },
    benefits: ["Health Insurance", "Paid Time Off"],
    additionalNotes: "Night shift availability required.",
    status: "New",
    dateSubmitted: "2024-06-01",
    description: "Full-time RN for ER department"
  },
  {
    id: "2",
    role: "Medical Assistant",
    roleTitle: "Medical Assistant",
    department: "Family Medicine",
    practiceArea: "Primary Care",
    scheduleNeeds: "Part-time (20 hours/week)",
    location: "Fort Lauderdale, FL",
    requiredSkills: ["Phlebotomy", "Patient Scheduling"],
    keyResponsibilities: "Assist with patient intake, scheduling, and phlebotomy.",
    priority: "Medium",
    estimatedStartDate: "2024-07-10",
    contractLength: "6 months",
    remoteWork: "No",
    travelRequired: "No",
    certifications: ["MA Certificate"],
    experienceLevel: "Entry",
    salaryRange: { min: 32000, max: 38000, currency: "USD" },
    benefits: ["Health Insurance"],
    additionalNotes: "Spanish speaking preferred.",
    status: "Sourcing",
    dateSubmitted: "2024-05-31",
    description: "Part-time MA for family practice"
  },
  {
    id: "3",
    role: "Lab Technician",
    roleTitle: "Lab Technician",
    department: "Laboratory",
    practiceArea: "Diagnostics",
    scheduleNeeds: "Full-time (40 hours/week)",
    location: "West Palm Beach, FL",
    requiredSkills: ["Blood Analysis", "Lab Safety"],
    keyResponsibilities: "Perform blood tests and ensure lab safety.",
    priority: "Low",
    estimatedStartDate: "2024-08-01",
    contractLength: "12 months",
    remoteWork: "No",
    travelRequired: "No",
    certifications: ["Lab Tech Certificate"],
    experienceLevel: "Mid",
    salaryRange: { min: 40000, max: 48000, currency: "USD" },
    benefits: ["Paid Time Off"],
    additionalNotes: "Weekend rotation required.",
    status: "Interview Scheduled",
    dateSubmitted: "2024-05-30",
    description: "Full-time lab tech for diagnostics"
  },
  {
    id: "4",
    role: "Receptionist",
    roleTitle: "Receptionist",
    department: "Front Desk",
    practiceArea: "Administration",
    scheduleNeeds: "Full-time (40 hours/week)",
    location: "Tampa, FL",
    requiredSkills: ["Customer Service", "Multi-line Phone System"],
    keyResponsibilities: "Greet patients, answer phones, schedule appointments.",
    priority: "Medium",
    estimatedStartDate: "2024-07-15",
    contractLength: "12 months",
    remoteWork: "No",
    travelRequired: "No",
    certifications: ["Office Admin Certificate"],
    experienceLevel: "Entry",
    salaryRange: { min: 30000, max: 35000, currency: "USD" },
    benefits: ["Health Insurance"],
    additionalNotes: "Bilingual preferred.",
    status: "Placement Complete",
    dateSubmitted: "2024-05-29",
    description: "Receptionist for busy front desk"
  },
  {
    id: "5",
    role: "Nurse Practitioner",
    roleTitle: "Nurse Practitioner",
    department: "Primary Care",
    practiceArea: "General Medicine",
    scheduleNeeds: "Full-time (40 hours/week)",
    location: "Orlando, FL",
    requiredSkills: ["Diagnosis", "Patient Education"],
    keyResponsibilities: "Diagnose and treat patients, provide education.",
    priority: "High",
    estimatedStartDate: "2024-07-20",
    contractLength: "12 months",
    remoteWork: "No",
    travelRequired: "No",
    certifications: ["NP License"],
    experienceLevel: "Senior",
    salaryRange: { min: 80000, max: 95000, currency: "USD" },
    benefits: ["Health Insurance", "Retirement Plan"],
    additionalNotes: "Leadership experience preferred.",
    status: "Awaiting Decision",
    dateSubmitted: "2024-05-28",
    description: "NP for primary care clinic"
  },
  {
    id: "6",
    role: "Pharmacist",
    roleTitle: "Pharmacist",
    department: "Pharmacy",
    practiceArea: "Clinical Pharmacy",
    scheduleNeeds: "Full-time (40 hours/week)",
    location: "Jacksonville, FL",
    requiredSkills: ["Medication Review", "Drug Interactions"],
    keyResponsibilities: "Review medications, check for interactions.",
    priority: "Medium",
    estimatedStartDate: "2024-07-25",
    contractLength: "12 months",
    remoteWork: "No",
    travelRequired: "No",
    certifications: ["Pharmacist License"],
    experienceLevel: "Senior",
    salaryRange: { min: 70000, max: 85000, currency: "USD" },
    benefits: ["Health Insurance", "Paid Time Off"],
    additionalNotes: "Experience with hospital pharmacy preferred.",
    status: "Panel Ready",
    dateSubmitted: "2024-05-27",
    description: "Pharmacist for hospital pharmacy"
  },
  {
    id: "7",
    role: "Physical Therapist",
    roleTitle: "Physical Therapist",
    department: "Rehabilitation",
    practiceArea: "Orthopedics",
    scheduleNeeds: "Full-time (40 hours/week)",
    location: "St. Petersburg, FL",
    requiredSkills: ["Manual Therapy", "Exercise Prescription"],
    keyResponsibilities: "Provide physical therapy, prescribe exercises.",
    priority: "Low",
    estimatedStartDate: "2024-08-05",
    contractLength: "12 months",
    remoteWork: "No",
    travelRequired: "No",
    certifications: ["PT License"],
    experienceLevel: "Mid",
    salaryRange: { min: 60000, max: 70000, currency: "USD" },
    benefits: ["Health Insurance"],
    additionalNotes: "Sports rehab experience a plus.",
    status: "Sourcing",
    dateSubmitted: "2024-05-26",
    description: "PT for ortho rehab"
  },
  {
    id: "8",
    role: "Medical Social Worker",
    roleTitle: "Medical Social Worker",
    department: "Social Services",
    practiceArea: "Case Management",
    scheduleNeeds: "Full-time (40 hours/week)",
    location: "Hialeah, FL",
    requiredSkills: ["Patient Advocacy", "Resource Coordination"],
    keyResponsibilities: "Advocate for patients, coordinate resources.",
    priority: "Medium",
    estimatedStartDate: "2024-08-10",
    contractLength: "12 months",
    remoteWork: "No",
    travelRequired: "No",
    certifications: ["MSW"],
    experienceLevel: "Mid",
    salaryRange: { min: 45000, max: 55000, currency: "USD" },
    benefits: ["Health Insurance"],
    additionalNotes: "Bilingual preferred.",
    status: "New",
    dateSubmitted: "2024-05-25",
    description: "Social worker for hospital"
  },
  {
    id: "9",
    role: "Surgical Technologist",
    roleTitle: "Surgical Technologist",
    department: "Surgery",
    practiceArea: "Operating Room",
    scheduleNeeds: "Full-time (40 hours/week)",
    location: "Cape Coral, FL",
    requiredSkills: ["Surgical Procedures", "Sterile Technique"],
    keyResponsibilities: "Assist in surgeries, maintain sterile field.",
    priority: "High",
    estimatedStartDate: "2024-08-15",
    contractLength: "12 months",
    remoteWork: "No",
    travelRequired: "No",
    certifications: ["Surgical Tech Certificate"],
    experienceLevel: "Mid",
    salaryRange: { min: 50000, max: 60000, currency: "USD" },
    benefits: ["Health Insurance"],
    additionalNotes: "Experience in ortho preferred.",
    status: "Canceled",
    dateSubmitted: "2024-05-24",
    description: "Surgical tech for OR"
  },
  {
    id: "10",
    role: "Occupational Therapist",
    roleTitle: "Occupational Therapist",
    department: "Occupational Therapy",
    practiceArea: "Rehabilitation",
    scheduleNeeds: "Full-time (40 hours/week)",
    location: "Fort Myers, FL",
    requiredSkills: ["ADL Training", "Splinting"],
    keyResponsibilities: "Help patients with daily living activities.",
    priority: "Low",
    estimatedStartDate: "2024-08-20",
    contractLength: "12 months",
    remoteWork: "No",
    travelRequired: "No",
    certifications: ["OT License"],
    experienceLevel: "Senior",
    salaryRange: { min: 65000, max: 80000, currency: "USD" },
    benefits: ["Health Insurance"],
    additionalNotes: "Pediatrics experience a plus.",
    status: "Placement Complete",
    dateSubmitted: "2024-05-23",
    description: "OT for rehab center"
  },
];

const STATUS_CONFIG = {
  "New": {
    color: "bg-muted-foreground text-primary-foreground",
    icon: <Info className="w-4 h-4" />, // You can adjust icon per status
    description: "New request submitted"
  },
  "Sourcing": {
    color: "bg-primary text-primary-foreground",
    icon: <Info className="w-4 h-4" />,
    description: "Sourcing candidates"
  },
  "Panel Ready": {
    color: "bg-chart-3 text-primary-foreground",
    icon: <Info className="w-4 h-4" />,
    description: "Panel ready for review"
  },
  "Interview Scheduled": {
    color: "bg-chart-5 text-primary-foreground",
    icon: <Info className="w-4 h-4" />,
    description: "Interview scheduled"
  },
  "Awaiting Decision": {
    color: "bg-chart-4 text-primary-foreground",
    icon: <Info className="w-4 h-4" />,
    description: "Awaiting client decision"
  },
  "Placement Complete": {
    color: "bg-chart-2 text-primary-foreground",
    icon: <Info className="w-4 h-4" />,
    description: "Placement complete"
  },
  "Canceled": {
    color: "bg-destructive text-primary-foreground",
    icon: <Info className="w-4 h-4" />,
    description: "Request canceled"
  }
};

const statusOptions = [
  { value: "New", label: "New" },
  { value: "Sourcing", label: "Sourcing" },
  { value: "Panel Ready", label: "Panel Ready" },
  { value: "Interview Scheduled", label: "Interview Scheduled" },
  { value: "Awaiting Decision", label: "Awaiting Decision" },
  { value: "Placement Complete", label: "Placement Complete" },
  { value: "Canceled", label: "Canceled" },
];

const filters = [
  { key: 'department' as keyof HireRequest, label: 'Department', type: 'text' as const, placeholder: 'e.g. Reception' },
  { key: 'location' as keyof HireRequest, label: 'Location', type: 'text' as const, placeholder: 'e.g. Miami, FL' },
  { key: 'status' as keyof HireRequest, label: 'Status', type: 'select' as const, options: statusOptions },
  { key: 'dateSubmitted' as keyof HireRequest, label: 'Date From', type: 'date' as const, placeholder: 'From' },
  { key: 'dateSubmitted' as keyof HireRequest, label: 'Date To', type: 'date' as const, placeholder: 'To' },
];

// Para la tabla, extiende el tipo temporalmente:
type HireRequestTable = HireRequest & { actions?: unknown };

export default function ClientHireRequestsPage() {
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<HireRequest | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [requestToCancel, setRequestToCancel] = useState<HireRequest | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<HireRequest>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleViewRequest = (request: HireRequest) => {
    setSelectedRequest(request);
    setViewDialogOpen(true);
  };
  const handleCancelRequest = (request: HireRequest) => {
    setRequestToCancel(request);
    setCancelDialogOpen(true);
  };
  const confirmCancelRequest = () => {
    setCancelDialogOpen(false);
    setRequestToCancel(null);
    // TODO: Add real cancel logic or toast
  };

  const handleEdit = () => {
    if (selectedRequest) {
      setEditForm({
        roleTitle: selectedRequest.roleTitle || "",
        department: selectedRequest.department || "",
        practiceArea: selectedRequest.practiceArea || "",
        scheduleNeeds: selectedRequest.scheduleNeeds || "",
        location: selectedRequest.location || "",
        keyResponsibilities: selectedRequest.keyResponsibilities || "",
        additionalNotes: selectedRequest.additionalNotes || "",
        requiredSkills: selectedRequest.requiredSkills || [],
        certifications: selectedRequest.certifications || [],
        benefits: selectedRequest.benefits || [],
        estimatedStartDate: selectedRequest.estimatedStartDate || "",
        contractLength: selectedRequest.contractLength || "",
        salaryRange: selectedRequest.salaryRange || { min: 0, max: 0, currency: "USD" }
      });
      setIsEditing(true);
    }
  };

  const handleSaveEdit = async () => {
    if (selectedRequest) {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the selectedRequest with new data
      Object.assign(selectedRequest, editForm);
      
      toast.success(`${selectedRequest.roleTitle} has been updated.`);
      setIsEditing(false);
      setEditForm({});
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({});
  };

  const handleEditFieldChange = (field: keyof HireRequest, value: string | number | string[] | { min: number; max: number; currency: string }) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const columns: TableColumn<HireRequestTable>[] = [
    { key: 'role' as keyof HireRequestTable, header: 'Role', searchable: true },
    { key: 'department' as keyof HireRequestTable, header: 'Department', searchable: true },
    { key: 'location' as keyof HireRequestTable, header: 'Location', searchable: true },
    {
      key: 'status' as keyof HireRequestTable,
      header: 'Status',
      type: 'badge' as const,
      badgeConfig: {
        variant: 'secondary' as const,
        className: ''
      },
      render: (_: unknown, row: HireRequestTable) => (
        <Badge className={STATUS_CONFIG[row.status].color} variant="secondary">
          {STATUS_CONFIG[row.status].icon}
          {row.status}
        </Badge>
      )
    },
    { key: 'dateSubmitted' as keyof HireRequestTable, header: 'Date Submitted', type: 'date' as const },
    {
      key: 'actions' as keyof HireRequestTable,
      header: 'Actions',
      type: 'action' as const,
      render: (_: unknown, row: HireRequestTable) => (
        <div className="flex items-center gap-2 justify-end">
          <Button
            size="icon"
            variant="ghost"
            aria-label="View"
            title="View"
            style={{ background: '#eaf1f5', color: '#1976a2', border: 'none', boxShadow: 'none' }}
            className="hover:bg-[#eaf1f5] focus:bg-[#eaf1f5] active:bg-[#eaf1f5]"
            onClick={e => { e.stopPropagation(); handleViewRequest(row); }}
          >
            <Eye className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            aria-label="Cancel"
            title="Cancel"
            onClick={e => { e.stopPropagation(); handleCancelRequest(row); }}
            disabled={!(row.status === 'New' || row.status === 'Sourcing')}
          >
            <XCircle className="w-5 h-5 text-white" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <main className="flex-1 p-6 md:p-10 w-full max-w-none px-4 sm:px-8">
        <PageTitle title="Hire Requests" />
        <p className="text-muted-foreground mb-8">View and manage all your hire requests</p>
        <div className="max-w-7xl mx-auto">
          <AdvancedTable
            data={hireRequests as HireRequestTable[]}
            columns={columns}
            filters={filters}
            defaultPageSize={10}
            showPagination={true}
            showSearch={true}
            showFilters={true}
            showPageSize={true}
            searchPlaceholder="Search hire requests..."
            emptyMessage="No hire requests found."
            className="mb-8"
          />
        </div>
        {/* Cancel Confirmation Dialog */}
        <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
          <DialogContent className="max-w-md w-full">
            <DialogHeader>
              <DialogTitle>Cancel Hire Request</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel the hire request{requestToCancel ? ` for "${requestToCancel.roleTitle}"` : ''}? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
                No, Keep Request
              </Button>
              <Button variant="destructive" onClick={confirmCancelRequest}>
                Yes, Cancel Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* View Request Details Sheet */}
        <Sheet open={viewDialogOpen} onOpenChange={open => { 
          if (!open) { 
            setViewDialogOpen(false); 
            setIsEditing(false);
            setEditForm({});
          } 
        }}>
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
                    {(selectedRequest.status === 'New' || selectedRequest.status === 'Sourcing') && !isEditing && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleEdit}
                        className="ml-2"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    {isEditing && (
                      <div className="flex gap-2 ml-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={handleSaveEdit}
                          disabled={isLoading}
                        >
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={handleCancelEdit}
                          disabled={isLoading}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2">
                  {/* Main Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
                    <div>
                      <div className="font-semibold text-sm text-foreground mb-1">Role Title</div>
                      {isEditing ? (
                        <Input
                          value={editForm.roleTitle || ""}
                          onChange={(e) => handleEditFieldChange('roleTitle', e.target.value)}
                          placeholder="Enter role title"
                          className="text-sm"
                        />
                      ) : (
                        <div className="font-normal text-base text-muted-foreground">{selectedRequest.roleTitle}</div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-foreground mb-1">Practice Area</div>
                      {isEditing ? (
                        <Input
                          value={editForm.practiceArea || ""}
                          onChange={(e) => handleEditFieldChange('practiceArea', e.target.value)}
                          placeholder="Enter practice area"
                          className="text-sm"
                        />
                      ) : (
                        <div className="font-normal text-base text-muted-foreground">{selectedRequest.practiceArea}</div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-foreground mb-1">Schedule Needs</div>
                      {isEditing ? (
                        <Input
                          value={editForm.scheduleNeeds || ""}
                          onChange={(e) => handleEditFieldChange('scheduleNeeds', e.target.value)}
                          placeholder="Enter schedule needs"
                          className="text-sm"
                        />
                      ) : (
                        <div className="font-normal text-base text-muted-foreground">{selectedRequest.scheduleNeeds}</div>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <div className="font-semibold text-sm text-foreground mb-2">Required Skills</div>
                      {isEditing ? (
                        <div className="space-y-2">
                          <Input
                            value={editForm.requiredSkills?.join(', ') || ""}
                            onChange={(e) => handleEditFieldChange('requiredSkills', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                            placeholder="Enter skills (comma separated)"
                            className="text-sm"
                          />
                          <div className="text-xs text-muted-foreground">Enter skills separated by commas</div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {selectedRequest.requiredSkills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <div className="font-semibold text-sm text-foreground mb-2">Key Responsibilities</div>
                      {isEditing ? (
                        <Textarea
                          value={editForm.keyResponsibilities || ""}
                          onChange={(e) => handleEditFieldChange('keyResponsibilities', e.target.value)}
                          placeholder="Enter key responsibilities"
                          className="text-sm min-h-[80px]"
                        />
                      ) : (
                        <div className="bg-muted p-4 rounded-lg">
                          <p className="text-sm text-muted-foreground leading-relaxed">{selectedRequest.keyResponsibilities}</p>
                        </div>
                      )}
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
                        {isEditing ? (
                          <Input
                            value={editForm.department || ""}
                            onChange={(e) => handleEditFieldChange('department', e.target.value)}
                            placeholder="Enter department"
                            className="text-sm"
                          />
                        ) : (
                          <div className="font-normal text-base text-muted-foreground">{selectedRequest.department}</div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground mb-1">Location</div>
                        {isEditing ? (
                          <Input
                            value={editForm.location || ""}
                            onChange={(e) => handleEditFieldChange('location', e.target.value)}
                            placeholder="Enter location"
                            className="text-sm"
                          />
                        ) : (
                          <div className="font-normal text-base text-muted-foreground">{selectedRequest.location}</div>
                        )}
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
                      <div>
                        <div className="font-semibold text-sm text-foreground mb-1">Estimated Start Date</div>
                        {isEditing ? (
                          <Input
                            type="date"
                            value={editForm.estimatedStartDate || ""}
                            onChange={(e) => handleEditFieldChange('estimatedStartDate', e.target.value)}
                            className="text-sm"
                          />
                        ) : (
                          <div className="font-normal text-base text-muted-foreground">{selectedRequest.estimatedStartDate || "Not specified"}</div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground mb-1">Contract Length</div>
                        {isEditing ? (
                          <Input
                            value={editForm.contractLength || ""}
                            onChange={(e) => handleEditFieldChange('contractLength', e.target.value)}
                            placeholder="e.g. 12 months"
                            className="text-sm"
                          />
                        ) : (
                          <div className="font-normal text-base text-muted-foreground">{selectedRequest.contractLength || "Not specified"}</div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground mb-1">Travel Required</div>
                        <div className="font-normal text-base text-muted-foreground">{selectedRequest.travelRequired}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground mb-1">Salary Range</div>
                        {isEditing ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <Input
                                type="number"
                                value={editForm.salaryRange?.min || ""}
                                onChange={(e) => handleEditFieldChange('salaryRange', {
                                  min: Number(e.target.value),
                                  max: editForm.salaryRange?.max ?? 0,
                                  currency: editForm.salaryRange?.currency ?? "USD"
                                })}
                                placeholder="Min salary"
                                className="text-sm"
                              />
                              <Input
                                type="number"
                                value={editForm.salaryRange?.max || ""}
                                onChange={(e) => handleEditFieldChange('salaryRange', {
                                  min: editForm.salaryRange?.min ?? 0,
                                  max: Number(e.target.value),
                                  currency: editForm.salaryRange?.currency ?? "USD"
                                })}
                                placeholder="Max salary"
                                className="text-sm"
                              />
                            </div>
                            <div className="text-xs text-muted-foreground">Salary range in USD</div>
                          </div>
                        ) : (
                          <div className="font-normal text-base text-muted-foreground">
                            {selectedRequest.salaryRange ? (
                              `${selectedRequest.salaryRange.currency === "USD" ? "$" : selectedRequest.salaryRange.currency}
                              ${selectedRequest.salaryRange.min.toLocaleString()} - ${selectedRequest.salaryRange.max.toLocaleString()}`
                            ) : "Not specified"}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground mb-1">Required Certifications</div>
                        {isEditing ? (
                          <div className="space-y-2">
                            <Input
                              value={editForm.certifications?.join(', ') || ""}
                              onChange={(e) => handleEditFieldChange('certifications', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                              placeholder="Enter certifications (comma separated)"
                              className="text-sm"
                            />
                            <div className="text-xs text-muted-foreground">Enter certifications separated by commas</div>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {selectedRequest.certifications && selectedRequest.certifications.length > 0 ? (
                              selectedRequest.certifications.map((cert, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">{cert}</Badge>
                              ))
                            ) : (
                              <div className="text-sm text-muted-foreground">No certifications specified</div>
                            )}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-foreground mb-1">Benefits</div>
                        {isEditing ? (
                          <div className="space-y-2">
                            <Input
                              value={editForm.benefits?.join(', ') || ""}
                              onChange={(e) => handleEditFieldChange('benefits', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                              placeholder="Enter benefits (comma separated)"
                              className="text-sm"
                            />
                            <div className="text-xs text-muted-foreground">Enter benefits separated by commas</div>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {selectedRequest.benefits && selectedRequest.benefits.length > 0 ? (
                              selectedRequest.benefits.map((benefit, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">{benefit}</Badge>
                              ))
                            ) : (
                              <div className="text-sm text-muted-foreground">No benefits specified</div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="md:col-span-2">
                        <div className="font-semibold text-sm text-foreground mb-1">Additional Notes</div>
                        {isEditing ? (
                          <Textarea
                            value={editForm.additionalNotes || ""}
                            onChange={(e) => handleEditFieldChange('additionalNotes', e.target.value)}
                            placeholder="Enter additional notes"
                            className="text-sm min-h-[80px]"
                          />
                        ) : (
                          <div className="font-normal text-base text-muted-foreground">
                            {selectedRequest.additionalNotes || "No additional notes"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </main>
    </div>
  );
} 