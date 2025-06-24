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
  const [referName, setReferName] = useState("");
  const [referEmail, setReferEmail] = useState("");
  const [referMsg, setReferMsg] = useState("");
  const [referError, setReferError] = useState<{name?: string, email?: string}>({});

  function validateEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

  return (
    <header className="fixed top-0 left-0 w-full h-16 z-40 bg-white border-b border-[#E9EAEB] flex items-center justify-between px-4 sm:px-8">
      <img src="/logo.png" alt="company logo" className="h-8" />
      {userRole === "ACTIVE_CLIENT" && (
        <div className="flex gap-2 items-center">
          <Button size="lg" variant="secondary" className="gap-2" onClick={() => setReferOpen(true)} aria-label="Refer Someone">
            <UserPlus className="w-5 h-5" />
            <span className="hidden sm:inline">Refer Someone</span>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button size="lg" className="gap-2" variant="default" aria-label="Submit Hire Request">
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">Submit Hire Request</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Submit a New Hire Request</SheetTitle>
              </SheetHeader>
              <div className="p-4">
                <SubmitHireRequestForm />
              </div>
            </SheetContent>
          </Sheet>
          <Dialog open={referOpen} onOpenChange={setReferOpen}>
            <DialogContent className="max-w-md w-full">
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
    </header>
  );
} 