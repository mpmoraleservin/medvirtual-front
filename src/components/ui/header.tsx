"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, UserPlus } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import SubmitHireRequestForm from "@/components/ui/submit-hire-request-form";

type UserRole = "PROSPECT" | "ACTIVE_CLIENT" | "ADMIN";

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
    <header className="fixed top-0 left-0 w-full h-16 z-40 bg-white border-b border-[#E9EAEB] flex items-center justify-between px-4 sm:px-8">
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
                  {referError.name && <div className="text-red-500 text-xs mt-1">{referError.name}</div>}
                </div>
                <div>
                  <Label htmlFor="refer-email">Email *</Label>
                  <Input id="refer-email" type="email" value={referEmail} onChange={e => setReferEmail(e.target.value)} required />
                  {referError.email && <div className="text-red-500 text-xs mt-1">{referError.email}</div>}
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
                    {clientError.firstName && <div className="text-red-500 text-xs mt-1">{clientError.firstName}</div>}
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
                    {clientError.lastName && <div className="text-red-500 text-xs mt-1">{clientError.lastName}</div>}
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
                    {clientError.jobTitle && <div className="text-red-500 text-xs mt-1">{clientError.jobTitle}</div>}
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
                    {clientError.companyName && <div className="text-red-500 text-xs mt-1">{clientError.companyName}</div>}
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
                  {clientError.email && <div className="text-red-500 text-xs mt-1">{clientError.email}</div>}
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
                  {clientError.phone && <div className="text-red-500 text-xs mt-1">{clientError.phone}</div>}
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
                  {clientError.practiceName && <div className="text-red-500 text-xs mt-1">{clientError.practiceName}</div>}
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