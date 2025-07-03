"use client";

import { AdvancedTable } from '@/components/ui/advanced-table';
import { PageTitle } from '@/components/ui/page-title';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { DollarSign } from 'lucide-react';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Eye, XCircle, Edit, Save, X } from 'lucide-react';

interface StaffBonus {
  amount: number;
  date: string;
  notes?: string;
}

interface HiredStaffMember {
  id: string;
  name: string;
  avatarUrl?: string;
  role: string;
  country: string;
  billRate: number;
  currency: string;
  joinDate: string;
  bonuses?: StaffBonus[];
  email?: string;
  phone?: string;
  experience?: string;
  certifications?: string[];
  languages?: string[];
  specializations?: string[];
  availability?: string;
  notes?: string;
}

const staff: HiredStaffMember[] = [
  { 
    id: "1", 
    name: "Ana Torres", 
    avatarUrl: undefined, 
    role: "Registered Nurse", 
    country: "🇺🇸 United States", 
    billRate: 2200, 
    currency: "USD", 
    joinDate: "2024-01-15", 
    email: "ana.torres@email.com",
    phone: "+1 (305) 555-0123",
    experience: "5+ years in pediatric and emergency care",
    certifications: ["RN License", "BLS Certified", "ACLS", "PALS"],
    languages: ["English", "Spanish"],
    specializations: ["Pediatrics", "Emergency Care", "ICU"],
    availability: "Full-time, flexible shifts including nights",
    notes: "Excellent patient care skills, bilingual, great team player",
    bonuses: [ { amount: 50, date: "2024-05-01", notes: "Great performance in May" }, { amount: 25, date: "2024-03-15" } ] 
  },
  { 
    id: "2", 
    name: "Luis Fernández", 
    avatarUrl: undefined, 
    role: "Medical Assistant", 
    country: "🇺🇸 United States", 
    billRate: 1500, 
    currency: "USD", 
    joinDate: "2024-02-20", 
    email: "luis.fernandez@email.com",
    phone: "+1 (305) 555-0124",
    experience: "3 years in family medicine",
    certifications: ["MA Certificate", "Phlebotomy Certified"],
    languages: ["English", "Spanish"],
    specializations: ["Family Medicine", "Patient Intake"],
    availability: "Part-time, weekdays only",
    notes: "Detail-oriented, excellent with patient scheduling",
    bonuses: [] 
  },
  { 
    id: "3", 
    name: "Emily Brown", 
    avatarUrl: undefined, 
    role: "Lab Technician", 
    country: "🇨🇦 Canada", 
    billRate: 1800, 
    currency: "CAD", 
    joinDate: "2024-03-10", 
    email: "emily.brown@email.com",
    phone: "+1 (416) 555-0125",
    experience: "4 years in clinical diagnostics",
    certifications: ["Lab Tech Certificate", "Safety Training"],
    languages: ["English"],
    specializations: ["Blood Analysis", "Microbiology", "Chemistry"],
    availability: "Full-time, rotating shifts",
    notes: "Highly accurate, maintains excellent lab safety standards",
    bonuses: [ { amount: 100, date: "2024-04-10", notes: "Handled extra shifts" } ] 
  },
  { 
    id: "4", 
    name: "Carlos Ruiz", 
    avatarUrl: undefined, 
    role: "Physician Assistant", 
    country: "🇺🇸 United States", 
    billRate: 3000, 
    currency: "USD", 
    joinDate: "2024-01-05",
    email: "carlos.ruiz@email.com",
    phone: "+1 (305) 555-0126",
    experience: "7 years in outpatient care",
    certifications: ["PA License", "DEA Registration"],
    languages: ["English", "Spanish"],
    specializations: ["Primary Care", "Minor Procedures"],
    availability: "Full-time, regular business hours",
    notes: "Experienced in suturing and minor surgical procedures"
  },
  { 
    id: "5", 
    name: "Sofia Martinez", 
    avatarUrl: undefined, 
    role: "Receptionist", 
    country: "🇺🇸 United States", 
    billRate: 1200, 
    currency: "USD", 
    joinDate: "2024-02-01",
    email: "sofia.martinez@email.com",
    phone: "+1 (305) 555-0127",
    experience: "2 years in medical office administration",
    certifications: ["Office Admin Certificate"],
    languages: ["English", "Spanish"],
    specializations: ["Front Desk", "Patient Scheduling"],
    availability: "Full-time, regular business hours",
    notes: "Friendly demeanor, excellent customer service skills"
  },
  { 
    id: "6", 
    name: "John Smith", 
    avatarUrl: undefined, 
    role: "Nurse Practitioner", 
    country: "🇺🇸 United States", 
    billRate: 3500, 
    currency: "USD", 
    joinDate: "2024-01-20",
    email: "john.smith@email.com",
    phone: "+1 (305) 555-0128",
    experience: "8 years in primary care",
    certifications: ["NP License", "DEA Registration", "ANCC Board Certified"],
    languages: ["English"],
    specializations: ["Primary Care", "Chronic Disease Management"],
    availability: "Full-time, flexible schedule",
    notes: "Strong diagnostic skills, excellent patient educator"
  },
  { 
    id: "7", 
    name: "Maria Lopez", 
    avatarUrl: undefined, 
    role: "Billing Coordinator", 
    country: "🇺🇸 United States", 
    billRate: 1600, 
    currency: "USD", 
    joinDate: "2024-03-01",
    email: "maria.lopez@email.com",
    phone: "+1 (305) 555-0129",
    experience: "5 years in medical billing",
    certifications: ["Certified Professional Biller"],
    languages: ["English", "Spanish"],
    specializations: ["Insurance Billing", "Claims Processing"],
    availability: "Full-time, regular business hours",
    notes: "Reduced claim denials by 30% in previous role"
  },
  { 
    id: "8", 
    name: "Patricia Gomez", 
    avatarUrl: undefined, 
    role: "X-Ray Technician", 
    country: "🇺🇸 United States", 
    billRate: 1700, 
    currency: "USD", 
    joinDate: "2024-02-15",
    email: "patricia.gomez@email.com",
    phone: "+1 (305) 555-0130",
    experience: "6 years in radiology",
    certifications: ["Radiology Tech License", "ARRT Certified"],
    languages: ["English", "Spanish"],
    specializations: ["General Radiology", "Emergency Imaging"],
    availability: "Full-time, rotating shifts",
    notes: "Specializes in emergency and trauma imaging"
  },
  { 
    id: "9", 
    name: "David Kim", 
    avatarUrl: undefined, 
    role: "Medical Biller", 
    country: "🇺🇸 United States", 
    billRate: 1400, 
    currency: "USD", 
    joinDate: "2024-03-15",
    email: "david.kim@email.com",
    phone: "+1 (305) 555-0131",
    experience: "4 years in medical billing",
    certifications: ["Certified Medical Biller", "CPC Certified"],
    languages: ["English", "Korean"],
    specializations: ["Medical Coding", "Claims Submission"],
    availability: "Full-time, regular business hours",
    notes: "Expert in ICD-10 and CPT coding",
    bonuses: [ { amount: 75, date: "2024-05-15", notes: "Excellent billing accuracy" } ] 
  },
  { 
    id: "10", 
    name: "Lisa Anderson", 
    avatarUrl: undefined, 
    role: "Registered Nurse", 
    country: "🇺🇸 United States", 
    billRate: 2400, 
    currency: "USD", 
    joinDate: "2024-01-10",
    email: "lisa.anderson@email.com",
    phone: "+1 (305) 555-0132",
    experience: "6 years in critical care",
    certifications: ["RN License", "BLS", "ACLS", "CCRN"],
    languages: ["English"],
    specializations: ["ICU", "Critical Care", "Ventilator Management"],
    availability: "Full-time, night shift preferred",
    notes: "ICU specialist with ventilator management expertise",
    bonuses: [ { amount: 150, date: "2024-04-20", notes: "ICU excellence award" } ] 
  },
  { 
    id: "11", 
    name: "Robert Wilson", 
    avatarUrl: undefined, 
    role: "Physician Assistant", 
    country: "🇺🇸 United States", 
    billRate: 3200, 
    currency: "USD", 
    joinDate: "2024-02-10",
    email: "robert.wilson@email.com",
    phone: "+1 (305) 555-0133",
    experience: "9 years in emergency medicine",
    certifications: ["PA License", "DEA Registration", "ATLS"],
    languages: ["English"],
    specializations: ["Emergency Medicine", "Trauma Care"],
    availability: "Full-time, rotating shifts",
    notes: "Emergency medicine specialist with trauma experience"
  },
  { 
    id: "12", 
    name: "Jennifer Davis", 
    avatarUrl: undefined, 
    role: "Medical Assistant", 
    country: "🇺🇸 United States", 
    billRate: 1600, 
    currency: "USD", 
    joinDate: "2024-03-20",
    email: "jennifer.davis@email.com",
    phone: "+1 (305) 555-0134",
    experience: "3 years in dermatology",
    certifications: ["MA Certificate", "Dermatology Training"],
    languages: ["English"],
    specializations: ["Dermatology", "Skin Procedures"],
    availability: "Full-time, regular business hours",
    notes: "Specializes in dermatology procedures and patient prep",
    bonuses: [ { amount: 30, date: "2024-05-10", notes: "Great patient care" } ] 
  },
];

export default function ClientStaffPage() {
  const [modal, setModal] = useState<null | 'view' | 'bonus' | 'terminate'>(null);
  const [selectedStaff, setSelectedStaff] = useState<HiredStaffMember | null>(null);
  const [bonusAmount, setBonusAmount] = useState<string | number>("");
  const [bonusPreset, setBonusPreset] = useState<string | null>(null);
  const [bonusNotes, setBonusNotes] = useState("");
  const [terminateReason, setTerminateReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<HiredStaffMember>>({});

  const handleStaffAction = (action: 'view' | 'bonus' | 'terminate', staff: HiredStaffMember) => {
    setSelectedStaff(staff);
    setModal(action);
  };

  const handleBonusPreset = (amount: string) => {
    setBonusPreset(amount);
    setBonusAmount(amount);
  };
  const handleBonusOther = () => {
    setBonusPreset("other");
    setBonusAmount("");
  };
  const handleBonusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success(`Bonus of $${bonusAmount} sent to ${selectedStaff?.name}!`);
    setModal(null);
    setBonusAmount("");
    setBonusPreset(null);
    setBonusNotes("");
    setIsLoading(false);
  };
  const handleTerminateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success(`${selectedStaff?.name} has been terminated.`);
    setModal(null);
    setTerminateReason("");
    setIsLoading(false);
  };

  const handleEdit = () => {
    if (selectedStaff) {
      setEditForm({
        email: selectedStaff.email || "",
        phone: selectedStaff.phone || "",
        experience: selectedStaff.experience || "",
        availability: selectedStaff.availability || "",
        notes: selectedStaff.notes || "",
        languages: selectedStaff.languages || [],
        specializations: selectedStaff.specializations || [],
        certifications: selectedStaff.certifications || []
      });
      setIsEditing(true);
    }
  };

  const handleSaveEdit = async () => {
    if (selectedStaff) {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the selectedStaff with new data
      Object.assign(selectedStaff, editForm);
      
      toast.success(`${selectedStaff.name}'s information has been updated.`);
      setIsEditing(false);
      setEditForm({});
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({});
  };

  const handleEditFieldChange = (field: keyof HiredStaffMember, value: string | number | string[]) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

const columns = [
  { key: 'name' as keyof HiredStaffMember, header: 'Name', searchable: true },
  { key: 'role' as keyof HiredStaffMember, header: 'Role', searchable: true },
  { key: 'billRate' as keyof HiredStaffMember, header: 'Bill Rate', type: 'currency' as const },
  { key: 'joinDate' as keyof HiredStaffMember, header: 'Join Date', type: 'date' as const },
    {
      key: 'actions' as keyof HiredStaffMember,
      header: 'Actions',
      type: 'action' as const,
      render: (_: unknown, row: HiredStaffMember) => (
        <div className="flex items-center gap-2 justify-end">
          <Button
            size="icon"
            variant="ghost"
            aria-label="View"
            title="View"
            style={{ background: '#eaf1f5', color: '#1976a2', border: 'none', boxShadow: 'none' }}
            className="hover:bg-[#eaf1f5] focus:bg-[#eaf1f5] active:bg-[#eaf1f5]"
            onClick={e => { e.stopPropagation(); handleStaffAction('view', row); }}
          >
            <Eye className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            aria-label="Bonus"
            title="Bonus"
            style={{ background: '#eafaf1', color: '#22c55e', border: 'none', boxShadow: 'none' }}
            className="hover:bg-[#eafaf1] focus:bg-[#eafaf1] active:bg-[#eafaf1]"
            onClick={e => { e.stopPropagation(); handleStaffAction('bonus', row); }}
          >
            <DollarSign className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            aria-label="Terminate"
            title="Terminate"
            onClick={e => { e.stopPropagation(); handleStaffAction('terminate', row); }}
          >
            <XCircle className="w-5 h-5 text-white" />
          </Button>
        </div>
      )
    }
];

const filters = [
  { key: 'role' as keyof HiredStaffMember, label: 'Role', type: 'text' as const, placeholder: 'e.g. Nurse' },
  { key: 'joinDate' as keyof HiredStaffMember, label: 'Join Date From', type: 'date' as const, placeholder: 'From' },
  { key: 'joinDate' as keyof HiredStaffMember, label: 'Join Date To', type: 'date' as const, placeholder: 'To' },
];

  return (
    <div className="min-h-screen bg-background flex">
      <main className="flex-1 p-6 md:p-10 w-full max-w-none px-4 sm:px-8">
        <PageTitle title="My Hired Staff" />
        <p className="text-muted-foreground mb-8">See and manage your hired staff</p>
        <div className="max-w-7xl mx-auto">
          <AdvancedTable
            data={staff}
            columns={columns}
            filters={filters}
            defaultPageSize={10}
            showPagination={true}
            showSearch={true}
            showFilters={true}
            showPageSize={true}
            searchPlaceholder="Search staff..."
            emptyMessage="No staff found."
            className="mb-8"
          />
        </div>
        {/* Bonus Modal */}
        <Dialog open={modal === "bonus"} onOpenChange={open => { 
          if (!open) { 
            setModal(null); 
            setBonusPreset(null); 
            setBonusAmount(""); 
            setBonusNotes(""); 
          } 
        }}>
          <DialogContent className="max-w-md w-full">
            <DialogTitle className="sr-only">Staff Dialog</DialogTitle>
            <form onSubmit={handleBonusSubmit} className="flex flex-col gap-4">
              <DialogHeader>
                <DialogTitle>Give {selectedStaff?.name} a Bonus</DialogTitle>
                <DialogDescription>Reward your staff for outstanding work.</DialogDescription>
              </DialogHeader>
              <div className="flex gap-2">
                {["25", "50", "100"].map((amt) => (
                  <Button
                    key={amt}
                    type="button"
                    variant={bonusPreset === amt ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => handleBonusPreset(amt)}
                    disabled={isLoading}
                  >
                    ${amt}
                  </Button>
                ))}
                <Button
                  type="button"
                  variant={bonusPreset === "other" ? "default" : "outline"}
                  className="flex-1"
                  onClick={handleBonusOther}
                  disabled={isLoading}
                >
                  Other
                </Button>
              </div>
              {bonusPreset === "other" && (
                <Input
                  type="number"
                  min={1}
                  placeholder="Enter amount"
                  value={bonusAmount === "other" ? "" : bonusAmount}
                  onChange={e => setBonusAmount(e.target.value)}
                  required
                  disabled={isLoading}
                />
              )}
              <Textarea
                placeholder="Notes (optional)"
                value={bonusNotes}
                onChange={e => setBonusNotes(e.target.value)}
                className="min-h-[80px]"
                disabled={isLoading}
              />
              <DialogFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <LoadingSpinner size="sm" /> : "Give Bonus"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {/* Terminate Modal */}
        <Dialog open={modal === "terminate"} onOpenChange={open => { 
          if (!open) { 
            setModal(null); 
            setTerminateReason(""); 
          } 
        }}>
          <DialogContent className="max-w-md w-full">
            <DialogTitle className="sr-only">Staff Dialog</DialogTitle>
            <form onSubmit={handleTerminateSubmit} className="flex flex-col gap-4">
              <DialogHeader>
                <DialogTitle>Terminate {selectedStaff?.name}</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. Please provide a reason for termination.
                </DialogDescription>
              </DialogHeader>
              <Textarea
                placeholder="Reason for Termination"
                value={terminateReason}
                onChange={e => setTerminateReason(e.target.value)}
                className="min-h-[100px]"
                required
                disabled={isLoading}
              />
              <DialogFooter>
                <Button type="submit" variant="destructive" className="w-full" disabled={isLoading}>
                  {isLoading ? <LoadingSpinner size="sm" /> : "Terminate Staff"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {/* View Details Sheet */}
        <Sheet open={modal === "view"} onOpenChange={open => { 
          if (!open) { 
            setModal(null); 
            setIsEditing(false);
            setEditForm({});
          } 
        }}>
          <SheetContent side="right" className="w-[40vw] min-w-[400px] max-w-[48rem] p-0">
            {selectedStaff && (
              <div className="relative h-full flex flex-col">
                {/* Sticky Header - match hire-requests style */}
                <div className="sticky top-0 z-10 bg-background px-6 pt-6 pb-4 shadow-sm border-b flex items-center gap-4">
                  <Avatar src={selectedStaff.avatarUrl} name={selectedStaff.name} className="w-14 h-14 text-2xl" />
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold">{selectedStaff.name}</h2>
                    <div className="text-lg text-muted-foreground font-medium">{selectedStaff.role}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-primary text-xl font-bold">{selectedStaff.billRate.toLocaleString(undefined, { style: 'currency', currency: selectedStaff.currency })}</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                  {!isEditing && (
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
                {/* Main Content - match hire-requests style */}
                <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2 flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2/20">{selectedStaff.country}</Badge>
                    <Badge variant="secondary" className="text-xs">Joined {selectedStaff.joinDate}</Badge>
                    {selectedStaff.bonuses && selectedStaff.bonuses.length > 0 && (
                      <Badge variant="outline" className="bg-chart-3/10 text-chart-3 border-chart-3/20">
                        <DollarSign className="w-3 h-3 mr-1" />
                        {selectedStaff.bonuses.length} Bonus{selectedStaff.bonuses.length > 1 ? 'es' : ''}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="font-semibold text-sm text-foreground mb-1">Email</div>
                      {isEditing ? (
                        <Input
                          value={editForm.email || ""}
                          onChange={(e) => handleEditFieldChange('email', e.target.value)}
                          placeholder="Enter email"
                          className="text-sm"
                        />
                      ) : (
                        <div className="text-sm text-muted-foreground">{selectedStaff.email || "Not provided"}</div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-foreground mb-1">Phone</div>
                      {isEditing ? (
                        <Input
                          value={editForm.phone || ""}
                          onChange={(e) => handleEditFieldChange('phone', e.target.value)}
                          placeholder="Enter phone"
                          className="text-sm"
                        />
                      ) : (
                        <div className="text-sm text-muted-foreground">{selectedStaff.phone || "Not provided"}</div>
                      )}
                    </div>
                  </div>

                  {/* Experience & Availability */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="font-semibold text-sm text-foreground mb-1">Experience</div>
                      {isEditing ? (
                        <Input
                          value={editForm.experience || ""}
                          onChange={(e) => handleEditFieldChange('experience', e.target.value)}
                          placeholder="Enter experience"
                          className="text-sm"
                        />
                      ) : (
                        <div className="text-sm text-muted-foreground">{selectedStaff.experience || "Not provided"}</div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-foreground mb-1">Availability</div>
                      {isEditing ? (
                        <Input
                          value={editForm.availability || ""}
                          onChange={(e) => handleEditFieldChange('availability', e.target.value)}
                          placeholder="Enter availability"
                          className="text-sm"
                        />
                      ) : (
                        <div className="text-sm text-muted-foreground">{selectedStaff.availability || "Not provided"}</div>
                      )}
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <div className="font-semibold text-sm text-foreground mb-2">Languages</div>
                    {isEditing ? (
                      <div className="space-y-2">
                        <Input
                          value={editForm.languages?.join(', ') || ""}
                          onChange={(e) => handleEditFieldChange('languages', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                          placeholder="Enter languages (comma separated)"
                          className="text-sm"
                        />
                        <div className="text-xs text-muted-foreground">Enter languages separated by commas</div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {selectedStaff.languages && selectedStaff.languages.length > 0 ? (
                          selectedStaff.languages.map((lang) => (
                            <Badge key={lang} variant="outline" className="text-xs">
                              {lang}
                            </Badge>
                          ))
                        ) : (
                          <div className="text-sm text-muted-foreground">No languages specified</div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Specializations */}
                  <div>
                    <div className="font-semibold text-sm text-foreground mb-2">Specializations</div>
                    {isEditing ? (
                      <div className="space-y-2">
                        <Input
                          value={editForm.specializations?.join(', ') || ""}
                          onChange={(e) => handleEditFieldChange('specializations', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                          placeholder="Enter specializations (comma separated)"
                          className="text-sm"
                        />
                        <div className="text-xs text-muted-foreground">Enter specializations separated by commas</div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {selectedStaff.specializations && selectedStaff.specializations.length > 0 ? (
                          selectedStaff.specializations.map((spec) => (
                            <Badge key={spec} variant="secondary" className="text-xs">
                              {spec}
                            </Badge>
                          ))
                        ) : (
                          <div className="text-sm text-muted-foreground">No specializations specified</div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Certifications */}
                  <div>
                    <div className="font-semibold text-sm text-foreground mb-2">Certifications</div>
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
                        {selectedStaff.certifications && selectedStaff.certifications.length > 0 ? (
                          selectedStaff.certifications.map((cert) => (
                            <Badge key={cert} variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                              {cert}
                            </Badge>
                          ))
                        ) : (
                          <div className="text-sm text-muted-foreground">No certifications specified</div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  <div>
                    <div className="font-semibold text-sm text-foreground mb-1">Notes</div>
                    {isEditing ? (
                      <Textarea
                        value={editForm.notes || ""}
                        onChange={(e) => handleEditFieldChange('notes', e.target.value)}
                        placeholder="Enter notes about the staff member"
                        className="text-sm min-h-[80px]"
                      />
                    ) : (
                      <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                        {selectedStaff.notes || "No notes available"}
                      </div>
                    )}
                  </div>

                  {/* Bonus History */}
                  <div>
                    <div className="font-semibold mb-2 text-foreground">Bonus History</div>
                    {selectedStaff.bonuses && selectedStaff.bonuses.length > 0 ? (
                      <ul className="flex flex-col gap-2">
                        {selectedStaff.bonuses.map((bonus, idx) => (
                          <li key={idx} className="rounded-md border bg-muted p-3 flex flex-col gap-1">
                            <div className="font-medium text-chart-2">+{bonus.amount.toLocaleString(undefined, { style: 'currency', currency: selectedStaff.currency })}</div>
                            <div className="text-xs text-muted-foreground">{bonus.date}</div>
                            {bonus.notes && <div className="text-sm text-muted-foreground">{bonus.notes}</div>}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-sm text-muted-foreground">No bonuses given yet.</div>
                    )}
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