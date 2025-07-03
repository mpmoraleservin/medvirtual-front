"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, UserPlus } from "lucide-react";
import React, { useState, useRef } from "react";
import { toast } from "sonner";
import SubmitHireRequestForm from "@/components/ui/submit-hire-request-form";

type UserRole = "PROSPECT" | "PROSPECT_V2" | "ACTIVE_CLIENT" | "ADMIN";

interface HeaderProps {
  userRole: UserRole;
}

export default function Header({ userRole }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [referOpen, setReferOpen] = useState(false);
  const [newClientOpen, setNewClientOpen] = useState(false);
  const [referName, setReferName] = useState("");
  const [referEmail, setReferEmail] = useState("");
  const [referMsg, setReferMsg] = useState("");
  const [referError, setReferError] = useState<{name?: string, email?: string}>({});
  
  // New Client form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [practiceName, setPracticeName] = useState("");
  const [clientError, setClientError] = useState<{
    firstName?: string, 
    lastName?: string, 
    jobTitle?: string, 
    companyName?: string, 
    email?: string, 
    phone?: string, 
    practiceName?: string
  }>({});

  function validateEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone: string) {
    return /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/\s/g, ''));
  }

  function handleReferSubmit(e: React.FormEvent) {
    e.preventDefault();
    const error: {name?: string, email?: string} = {};
    if (!referName.trim()) error.name = "Name is required";
    if (!referEmail.trim()) error.email = "Email is required";
    else if (!validateEmail(referEmail)) error.email = "Invalid email";
    setReferError(error);
    if (Object.keys(error).length > 0) return;
    toast.success("Referral sent!");
    setReferOpen(false);
    setReferName(""); setReferEmail(""); setReferMsg(""); setReferError({});
  }

  function handleNewClientSubmit(e: React.FormEvent) {
    e.preventDefault();
    const error: {
      firstName?: string, 
      lastName?: string, 
      jobTitle?: string, 
      companyName?: string, 
      email?: string, 
      phone?: string, 
      practiceName?: string
    } = {};
    
    if (!firstName.trim()) error.firstName = "First name is required";
    if (!lastName.trim()) error.lastName = "Last name is required";
    if (!jobTitle.trim()) error.jobTitle = "Job title is required";
    if (!companyName.trim()) error.companyName = "Company name is required";
    if (!email.trim()) error.email = "Email is required";
    else if (!validateEmail(email)) error.email = "Invalid email";
    if (!phone.trim()) error.phone = "Phone is required";
    else if (!validatePhone(phone)) error.phone = "Invalid phone number";
    if (!practiceName.trim()) error.practiceName = "Practice name is required";
    
    setClientError(error);
    if (Object.keys(error).length > 0) return;
    
    toast.success("New client created successfully!");
    setNewClientOpen(false);
    setFirstName(""); 
    setLastName(""); 
    setJobTitle(""); 
    setCompanyName(""); 
    setEmail(""); 
    setPhone(""); 
    setPracticeName(""); 
    setClientError({});
  }

  return (
    <header className="fixed top-0 left-0 w-full h-16 z-40 bg-background border-b border-border flex items-center justify-between px-4 sm:px-8">
      <img src="/logo.png" alt="company logo" className="h-8" />
      {userRole === "ACTIVE_CLIENT" && (
        <div className="flex gap-2 items-center">
          <Button size="lg" variant="secondary" className="gap-2" onClick={() => setReferOpen(true)} aria-label="Refer Someone">
            <UserPlus className="w-5 h-5" />
            <span className="hidden sm:inline">Refer Someone</span>
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <Button size="lg" className="gap-2" variant="default" aria-label="Submit Hire Request" onClick={() => setOpen(true)}>
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Submit Hire Request</span>
            </Button>
            <DialogContent className="max-w-2xl w-full">
              <DialogHeader>
                <DialogTitle>Submit a New Hire Request</DialogTitle>
              </DialogHeader>
              <div className="p-4">
                <SubmitHireRequestForm />
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={referOpen} onOpenChange={setReferOpen}>
            <DialogContent className="max-w-md w-full">
              <DialogTitle className="sr-only">User Menu</DialogTitle>
              <form onSubmit={handleReferSubmit} className="flex flex-col gap-4">
                <DialogHeader>
                  <DialogTitle>Refer Someone</DialogTitle>
                </DialogHeader>
                <div>
                  <Label htmlFor="refer-name">Name *</Label>
                  <Input id="refer-name" value={referName} onChange={e => setReferName(e.target.value)} required autoFocus />
                  {referError.name && <div className="text-destructive text-xs mt-1">{referError.name}</div>}
                </div>
                <div>
                  <Label htmlFor="refer-email">Email *</Label>
                  <Input id="refer-email" type="email" value={referEmail} onChange={e => setReferEmail(e.target.value)} required />
                  {referError.email && <div className="text-destructive text-xs mt-1">{referError.email}</div>}
                </div>
                <div>
                  <Label htmlFor="refer-msg">Message</Label>
                  <Input id="refer-msg" value={referMsg} onChange={e => setReferMsg(e.target.value)} placeholder="Write a message (optional)" />
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full">Send Referral</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      )}
      {userRole === "PROSPECT" || userRole === "PROSPECT_V2" ? (
        <div className="flex gap-2 items-center">
          <Dialog open={open} onOpenChange={setOpen}>
            <Button
              size="lg"
              className="gap-2"
              variant="default"
              aria-label="Submit Hire Request"
              onClick={() => setOpen(true)}
              disabled={userRole === "PROSPECT_V2"}
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Submit Your First Hire Request</span>
            </Button>
            <DialogContent className="max-w-2xl w-full min-h-[540px] flex flex-col">
              <div className="flex flex-col flex-1 min-h-[480px]">
                <DialogHeader className="mb-2">
                  <DialogTitle>Submit Your First Hire Request</DialogTitle>
                </DialogHeader>
                <StepperProspectHireRequest onClose={() => setOpen(false)} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : null}
      {userRole === "ADMIN" && (
        <div className="flex gap-2 items-center">
          <Button 
            size="lg" 
            variant="secondary" 
            className="gap-2" 
            onClick={() => setNewClientOpen(true)} 
            aria-label="New Client"
          >
            <UserPlus className="w-5 h-5" />
            <span className="hidden sm:inline">New Client</span>
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <Button size="lg" className="gap-2" variant="default" aria-label="New Hire Request" onClick={() => setOpen(true)}>
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">New Hire Request</span>
            </Button>
            <DialogContent className="max-w-2xl w-full">
              <DialogHeader>
                <DialogTitle>Create New Hire Request</DialogTitle>
              </DialogHeader>
              <div className="p-4">
                <SubmitHireRequestForm showClientSelection={true} />
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={newClientOpen} onOpenChange={setNewClientOpen}>
            <DialogContent className="max-w-md w-full max-h-[90vh] overflow-y-auto">
              <DialogTitle className="sr-only">New Client</DialogTitle>
              <form onSubmit={handleNewClientSubmit} className="flex flex-col gap-4">
                <DialogHeader>
                  <DialogTitle>Create New Client</DialogTitle>
                </DialogHeader>
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="first-name">First Name *</Label>
                    <Input 
                      id="first-name" 
                      value={firstName} 
                      onChange={e => setFirstName(e.target.value)} 
                      required 
                      autoFocus 
                      placeholder="John"
                    />
                    {clientError.firstName && <div className="text-destructive text-xs mt-1">{clientError.firstName}</div>}
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="last-name">Last Name *</Label>
                    <Input 
                      id="last-name" 
                      value={lastName} 
                      onChange={e => setLastName(e.target.value)} 
                      required 
                      placeholder="Smith"
                    />
                    {clientError.lastName && <div className="text-destructive text-xs mt-1">{clientError.lastName}</div>}
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label htmlFor="job-title">Job Title *</Label>
                    <Input 
                      id="job-title" 
                      value={jobTitle} 
                      onChange={e => setJobTitle(e.target.value)} 
                      required 
                      placeholder="Talent Recruiter"
                    />
                    {clientError.jobTitle && <div className="text-destructive text-xs mt-1">{clientError.jobTitle}</div>}
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="company-name">Company Name *</Label>
                    <Input 
                      id="company-name" 
                      value={companyName} 
                      onChange={e => setCompanyName(e.target.value)} 
                      required 
                      placeholder="MedVirtual"
                    />
                    {clientError.companyName && <div className="text-destructive text-xs mt-1">{clientError.companyName}</div>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                    placeholder="john.smith@example.com"
                  />
                  {clientError.email && <div className="text-destructive text-xs mt-1">{clientError.email}</div>}
                </div>

                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    required 
                    placeholder="+1 (555) 123-4567"
                  />
                  {clientError.phone && <div className="text-destructive text-xs mt-1">{clientError.phone}</div>}
                </div>

                <div>
                  <Label htmlFor="practice-name">Practice Name *</Label>
                  <Input 
                    id="practice-name" 
                    value={practiceName} 
                    onChange={e => setPracticeName(e.target.value)} 
                    required 
                    placeholder="Smith Medical Center"
                  />
                  {clientError.practiceName && <div className="text-destructive text-xs mt-1">{clientError.practiceName}</div>}
                </div>

                <DialogFooter>
                  <Button type="submit" className="w-full">Create Client</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </header>
  );
}

export function StepperProspectHireRequest({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [org, setOrg] = useState({
    companyName: "",
    companyIndustry: "",
    companyDescription: ""
  });
  const orgValid = org.companyName.trim() && org.companyIndustry.trim() && org.companyDescription.trim();

  // Ref for role form
  const roleFormRef = useRef<unknown>(null);
  const handleRoleFormSubmit = () => {
    setStep(3);
  };

  // Ref for organization form
  const orgFormRef = useRef<HTMLFormElement>(null);

  // Stepper visual
  function StepCircle({ active, number, label }: { active: boolean, number: number, label: string }) {
    return (
      <div className="flex flex-col items-center min-w-[90px]">
        <div className={`font-bold transition-all ${active ? 'border-primary text-primary bg-primary/10' : 'border-muted-foreground text-muted-foreground bg-muted'}`}>{number}</div>
        <span className={`mt-2 text-xs font-semibold ${active ? 'text-primary' : 'text-muted-foreground'}`}>{label}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-[400px]">
      {/* Stepper visual and content centered vertically */}
      <div className="flex flex-col flex-1 justify-center gap-6">
        <div className="flex items-center justify-center gap-0 mb-4">
          <StepCircle active={step === 1} number={1} label="Organization" />
          <div className={`h-1 flex-grow mx-1 sm:mx-2 ${step > 1 ? 'bg-primary' : 'bg-muted-foreground/30'} transition-all`} />
          <StepCircle active={step === 2} number={2} label="Role" />
          <div className={`h-1 flex-grow mx-1 sm:mx-2 ${step > 2 ? 'bg-primary' : 'bg-muted-foreground/30'} transition-all`} />
          <StepCircle active={step === 3} number={3} label="Agreement" />
        </div>
        {/* Step 1: Organization */}
        {step === 1 && (
          <form
            ref={orgFormRef}
            className="flex flex-col gap-4 min-h-[260px] justify-center"
            onSubmit={e => {
              e.preventDefault();
              if (orgValid) setStep(2);
            }}
          >
            <label className="font-semibold">Company Name
              <input
                name="companyName"
                type="text"
                required
                value={org.companyName}
                onChange={e => setOrg(o => ({ ...o, companyName: e.target.value }))}
                className="mt-1 block w-full rounded border px-3 py-2 text-base border-primary focus:ring-2 focus:ring-primary"
                placeholder="Your company name"
              />
            </label>
            <label className="font-semibold">Industry / What do you do?
              <input
                name="companyIndustry"
                type="text"
                required
                value={org.companyIndustry}
                onChange={e => setOrg(o => ({ ...o, companyIndustry: e.target.value }))}
                className="mt-1 block w-full rounded border px-3 py-2 text-base border-primary focus:ring-2 focus:ring-primary"
                placeholder="e.g. Healthcare, Clinic, Hospital, etc."
              />
            </label>
            <label className="font-semibold">Description
              <textarea
                name="companyDescription"
                required
                value={org.companyDescription}
                onChange={e => setOrg(o => ({ ...o, companyDescription: e.target.value }))}
                className="mt-1 block w-full rounded border px-3 py-2 text-base min-h-[100px] border-primary focus:ring-2 focus:ring-primary"
                placeholder="Describe your company"
              />
            </label>
          </form>
        )}
        {/* Step 2: Role */}
        {step === 2 && (
          <div className="flex flex-col gap-4 min-h-[260px] justify-center">
            <SubmitHireRequestForm hideSubmitButton onSubmit={handleRoleFormSubmit} ref={roleFormRef} />
          </div>
        )}
        {/* Step 3: PandaDoc */}
        {step === 3 && (
          <div className="flex flex-col items-center justify-center gap-6 min-h-[260px]">
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 12.5l3 3 5-5M12 21C6.477 21 2 16.523 2 11.001 2 5.477 6.477 1 12 1s10 4.477 10 10.001C22 16.523 17.523 21 12 21z"/></svg>
              </div>
              <h3 className="text-xl font-bold text-center text-foreground">Almost done!</h3>
              <p className="text-center text-muted-foreground max-w-md">To start the search, you must sign the PandaDoc agreement. However, your request is ready and an agent will contact you soon to guide you through the process.</p>
            </div>
          </div>
        )}
      </div>
      {/* Footer buttons always at bottom */}
      <div className="flex justify-between items-center mt-6">
        {step === 1 && <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>}
        {step === 2 && <Button type="button" variant="ghost" onClick={() => setStep(1)}>Back</Button>}
        {step === 3 && <Button type="button" variant="ghost" onClick={() => setStep(2)}>Back</Button>}
        <div className="flex-1" />
        {step === 1 && <Button type="button" disabled={!orgValid} variant="default" onClick={() => orgFormRef.current?.requestSubmit()}>Next</Button>}
        {step === 2 && <Button type="button" variant="default" onClick={() => (roleFormRef.current as { submit?: () => void })?.submit?.()}>Next</Button>}
        {step === 3 && <Button variant="default" onClick={() => { toast.success('Request submitted!'); onClose(); }}>Create Request</Button>}
      </div>
    </div>
  );
} 