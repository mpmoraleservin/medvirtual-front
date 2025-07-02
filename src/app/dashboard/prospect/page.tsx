"use client";

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { CandidateCard } from "@/components/ui/candidate-card"
import { X, UserCheck, Mail, Phone } from "lucide-react"
import React, { useState } from "react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StepperProspectHireRequest } from "@/components/ui/header";

// --- Types ---
interface TalentCard {
  id: string;
  title: string;
  experience: string;
  languages: string[];
  specialization?: string;
}

// --- Mock Talent Data ---
const talent: TalentCard[] = [
  { id: "1", title: "Front Desk Scheduler", experience: "2 years", languages: ["English", "Spanish"] },
  { id: "2", title: "Office Aide", experience: "1+ years", languages: ["English", "Spanish"] },
  { id: "3", title: "Intake Specialist", experience: "5 years", languages: ["English"], specialization: "Pediatrics" },
  { id: "4", title: "Billing Specialist", experience: "2 years", languages: ["English", "Spanish"] }
];

export default function ProspectDashboard() {
  const [selectedTalent, setSelectedTalent] = useState<TalentCard | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [hireDialogOpen, setHireDialogOpen] = useState(false);

  const openProfile = (t: TalentCard) => {
    setSelectedTalent(t);
    setSheetOpen(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-2 sm:px-8 pt-4 pb-20"> {/* pb-20 for mobile nav */}
      {/* Title */}
      <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-6 max-w-2xl">Welcome, Dr Smith!</h1>

      {/* Top Section – two columns, flex layout for equal height */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        {/* CTA Card */}
        <Card
          className="p-0 overflow-hidden border-2 flex-1 flex flex-col justify-stretch min-w-0 border-primary"
        >
          <div
            className="flex flex-col md:flex-row items-stretch h-full bg-gradient-to-br from-primary to-chart-1"
          >
            {/* Text / bullets */}
            <div className="flex-1 p-3 md:p-5 text-primary-foreground flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-3">
                Let us find your next<br />Team Member
              </h2>
              <p className="mb-3 text-xs md:text-base max-w-md opacity-90">
                Matching elite remote medical professionals with practices across the U.S.
              </p>
              <ul className="space-y-1 mb-4 text-xs">
                <li className="flex items-start gap-2"><span className="shrink-0 bg-background p-1 rounded-full"><UserCheck className="w-4 h-4" /></span> Top-tier vetted talent</li>
                <li className="flex items-start gap-2"><span className="shrink-0 bg-background p-1 rounded-full"><UserCheck className="w-4 h-4" /></span> 30+ specialized roles</li>
                <li className="flex items-start gap-2"><span className="shrink-0 bg-background p-1 rounded-full"><UserCheck className="w-4 h-4" /></span> Quick turnaround</li>
              </ul>
              <Dialog open={hireDialogOpen} onOpenChange={setHireDialogOpen}>
                <Button
                  className="font-semibold text-sm md:text-base hover:opacity-90 bg-background text-primary"
                  onClick={() => setHireDialogOpen(true)}
                >
                  Submit a Hire Request
                </Button>
                <DialogContent className="max-w-2xl w-full min-h-[540px] flex flex-col">
                  <div className="flex flex-col flex-1 min-h-[480px]">
                    <DialogHeader className="mb-2">
                      <DialogTitle>Submit Your First Hire Request</DialogTitle>
                    </DialogHeader>
                    <StepperProspectHireRequest onClose={() => setHireDialogOpen(false)} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Card>

        {/* Right column stack */}
        <div className="flex flex-col gap-4 flex-1 justify-stretch min-w-0">
          {/* Concierge Card */}
          <Card className="flex flex-row items-center gap-3 border-2 flex-1 justify-center bg-gradient-to-r from-primary/5 to-primary/10 p-3 md:p-5 rounded-2xl shadow-sm min-w-0 border-primary">
            {/* MedVirtual Logo */}
            <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 md:w-20 md:h-20 bg-background rounded-full shadow border border-primary/20">
              <img src="/logo.png" alt="MedVirtual Logo" className="w-10 h-10 md:w-14 md:h-14 object-contain" />
            </div>
            {/* Info and actions */}
            <div className="flex-1 flex flex-col justify-center gap-1 pl-2 min-w-0">
              <h3 className="text-base md:text-xl font-bold mb-0.5 text-left">Your MedVirtual Concierge</h3>
              <p className="text-muted-foreground text-xs mb-0.5 text-left truncate">Account medvirtual</p>
              <p className="font-semibold text-xs md:text-sm mb-2 text-left truncate">Joe Coleman, DM</p>
              <div className="flex gap-2 mt-1">
                <a href="mailto:joe.coleman@medvirtual.com" aria-label="Email Joe Coleman">
                  <Button size="icon" variant="ghost" className="hover:bg-primary/10 text-primary border border-primary/20">
                    <Mail className="w-4 h-4" />
                  </Button>
                </a>
                <a href="tel:+15551234567" aria-label="Call Joe Coleman">
                  <Button size="icon" variant="ghost" className="hover:bg-primary/10 text-primary border border-primary/20">
                    <Phone className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </div>
          </Card>

          {/* Testimonial Card */}
          <Card className="p-4 flex flex-col gap-3 border-l-4 flex-1 justify-center min-w-0 border-primary">
            <div className="text-2xl leading-none text-primary">"</div>
            <p className="italic text-xs md:text-sm">
              "MedVirtual found us an amazing bilingual medical scheduler. Couldn't be happier!"
            </p>
            <div className="text-xs font-semibold">Stacy Nguyen <span className="font-normal text-muted-foreground">| Practice Manager</span></div>
          </Card>
        </div>
      </div>

      {/* Talent Section */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg md:text-2xl font-bold">Start Exploring Talent</h2>
        <a href="/dashboard/prospect/talent-pool">
          <Button
            className="font-semibold text-sm md:text-base px-4 py-2 rounded-xl shadow-md hover:opacity-90 bg-primary text-primary-foreground"
          >
            Explore Talent
          </Button>
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {talent.map((t, idx) => {
          // Convert talent data to candidate format for CandidateCard
          const candidate = {
            id: t.id,
            name: t.title,
            role: t.title,
            pricePerMonth: idx === 0 ? 2200 : idx === 1 ? 1500 : idx === 2 ? 2800 : 1900,
            currency: "USD",
            languages: t.languages,
            specializations: t.specialization ? [t.specialization] : [],
            skills: [t.specialization || t.languages[0]],
            about: `${t.title} with ${t.experience} of experience`,
            education: [],
            experience: [],
            experienceLevel: "Mid" as const
          };
          
          return (
            <CandidateCard
              key={t.id}
              candidate={candidate}
              variant="featured"
              onViewProfile={() => openProfile(t)}
              className="cursor-pointer"
            />
          );
        })}
      </div>

      {/* Talent Profile Sheet with blurred content & CTA */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-[40vw] min-w-[350px] max-w-[48rem] p-0">
          {selectedTalent && (
            <div className="relative h-full flex flex-col">
              {/* Header */}
              <div className="sticky top-0 z-10 bg-background px-6 pt-6 pb-4 shadow-sm border-b flex items-center justify-between gap-2">
                <h2 className="text-xl font-bold">{selectedTalent.title}</h2>
                <Button size="icon" variant="ghost" onClick={() => setSheetOpen(false)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>
              {/* CTA Banner */}
              <div className="p-6 bg-primary/10 border-b border-primary/20">
                <h3 className="text-lg font-bold mb-1 text-primary">Unlock Full Candidate Details</h3>
                <p className="text-sm text-primary mb-3">Sign the PandaDoc service agreement to view the complete profile.</p>
                <Button className="bg-primary text-primary-foreground hover:opacity-90">Contact Account Manager</Button>
              </div>
              {/* Blurred Content */}
              <div className="flex-1 overflow-y-auto p-6 filter blur-sm select-none pointer-events-none">
                <p className="mb-2 font-semibold">Experience</p>
                <p className="text-foreground text-sm mb-6">{selectedTalent.experience}</p>
                <p className="mb-2 font-semibold">Languages</p>
                <div className="flex gap-2 mb-6">
                  {selectedTalent.languages.map(l => (<Badge key={l} variant="outline">{l}</Badge>))}
                </div>
                {selectedTalent.specialization && (
                  <>
                    <p className="mb-2 font-semibold">Specialization</p>
                    <Badge variant="secondary" className="mb-6">{selectedTalent.specialization}</Badge>
                  </>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* FAQ Section - Interactive Accordion */}
      <section className="w-full mt-12 mb-10">
        <h2 className="text-lg md:text-2xl font-bold mb-4 text-left">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="space-y-2 w-full">
          <AccordionItem value="q1">
            <AccordionTrigger className="font-semibold text-primary text-lg">How do I start the hiring process?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
              Click the "Submit a Hire Request" button at the top of the dashboard. Our team will reach out to you and guide you through the next steps, including signing the service agreement.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger className="font-semibold text-primary text-lg">When can I view full candidate profiles?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
              Full candidate details are unlocked once you sign the PandaDoc service agreement sent to your email. This ensures privacy and a tailored experience for your practice.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger className="font-semibold text-primary text-lg">What support does MedVirtual provide?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
              You have a dedicated MedVirtual Concierge to assist you at every step, from role selection to onboarding your new team member. Contact us anytime via the buttons in your dashboard.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q4">
            <AccordionTrigger className="font-semibold text-primary text-lg">Is there a cost to submit a hire request?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
              No, submitting a hire request is free and non-binding. You only pay once you decide to move forward with a candidate and sign the service agreement.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q5">
            <AccordionTrigger className="font-semibold text-primary text-lg">How long does it take to match with a candidate?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
              Most practices receive top matches within 2-5 business days after signing the service agreement.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
} 