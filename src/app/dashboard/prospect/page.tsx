"use client";

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { X, UserCheck, Mail, Phone } from "lucide-react"
import React, { useState } from "react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { StepperProspectHireRequest } from "@/components/ui/header"

// Primary brand blue
const blue = "#009FE3";

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
          className="p-0 overflow-hidden border-2 flex-1 flex flex-col justify-stretch min-w-0"
          style={{ borderColor: blue }}
        >
          <div
            className="flex flex-col md:flex-row items-stretch h-full"
            style={{ background: `linear-gradient(135deg, ${blue} 0%, #6EC7F0 100%)` }}
          >
            {/* Text / bullets */}
            <div className="flex-1 p-3 md:p-5 text-white flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-3">
                Let us find your next<br />Team Member
              </h2>
              <p className="mb-3 text-xs md:text-base max-w-md opacity-90">
                Matching elite remote medical professionals with practices across the U.S.
              </p>
              <ul className="space-y-1 mb-4 text-xs">
                <li className="flex items-start gap-2"><span className="shrink-0 bg-white/20 p-1 rounded-full"><UserCheck className="w-4 h-4" /></span> Top-tier vetted talent</li>
                <li className="flex items-start gap-2"><span className="shrink-0 bg-white/20 p-1 rounded-full"><UserCheck className="w-4 h-4" /></span> 30+ specialized roles</li>
                <li className="flex items-start gap-2"><span className="shrink-0 bg-white/20 p-1 rounded-full"><UserCheck className="w-4 h-4" /></span> Quick turnaround</li>
              </ul>
              <Dialog open={hireDialogOpen} onOpenChange={setHireDialogOpen}>
                <Button
                  style={{ backgroundColor: "#FFFFFF", color: blue }}
                  className="font-semibold text-sm md:text-base hover:opacity-90"
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
          <Card className="flex flex-row items-center gap-3 border-2 flex-1 justify-center bg-gradient-to-r from-[#f6fbff] to-[#eaf6fd] p-3 md:p-5 rounded-2xl shadow-sm min-w-0" style={{ borderColor: blue }}>
            {/* MedVirtual Logo */}
            <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 md:w-20 md:h-20 bg-white rounded-full shadow border border-blue-100">
              <img src="/logo.png" alt="MedVirtual Logo" className="w-10 h-10 md:w-14 md:h-14 object-contain" />
            </div>
            {/* Info and actions */}
            <div className="flex-1 flex flex-col justify-center gap-1 pl-2 min-w-0">
              <h3 className="text-base md:text-xl font-bold mb-0.5 text-left">Your MedVirtual Concierge</h3>
              <p className="text-muted-foreground text-xs mb-0.5 text-left truncate">Account medvirtual</p>
              <p className="font-semibold text-xs md:text-sm mb-2 text-left truncate">Joe Coleman, DM</p>
              <div className="flex gap-2 mt-1">
                <a href="mailto:joe.coleman@medvirtual.com" aria-label="Email Joe Coleman">
                  <Button size="icon" variant="ghost" className="hover:bg-blue-50 text-blue-600 border border-blue-100">
                    <Mail className="w-4 h-4" />
                  </Button>
                </a>
                <a href="tel:+15551234567" aria-label="Call Joe Coleman">
                  <Button size="icon" variant="ghost" className="hover:bg-blue-50 text-blue-600 border border-blue-100">
                    <Phone className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </div>
          </Card>

          {/* Testimonial Card */}
          <Card className="p-4 flex flex-col gap-3 border-l-4 flex-1 justify-center min-w-0" style={{ borderColor: blue }}>
            <div className="text-2xl leading-none text-[#2c7be5]">"</div>
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
            style={{ backgroundColor: blue, color: "#fff" }}
            className="font-semibold text-sm md:text-base px-4 py-2 rounded-xl shadow-md hover:opacity-90"
          >
            Explore Talent
          </Button>
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {talent.map((t, idx) => (
          <div
            key={t.id}
            className="relative group cursor-pointer rounded-2xl p-[2px] bg-gradient-to-br from-[#009FE3] via-[#6EC7F0] to-[#b2e6fa] shadow-lg hover:scale-[1.03] transition-transform"
            onClick={() => openProfile(t)}
          >
            <Card className="flex flex-col justify-between rounded-2xl p-3 md:p-4 h-full bg-white min-h-[200px] md:min-h-[230px]">
              {/* Star icon top right */}
              <div className="absolute top-2 right-2 md:top-3 md:right-3 z-10">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#FACC15" stroke="#FACC15" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              {/* Title and availability, with padding to avoid star overlap */}
              <div className="mb-2 pt-1 pr-5">
                <h3 className="font-bold text-base md:text-lg text-[#009FE3] mb-1 leading-tight whitespace-normal">{t.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs md:text-sm text-muted-foreground">{t.experience}</span>
                  <span className="inline-block w-1 h-1 rounded-full bg-blue-200" />
                  <span className="text-xs md:text-sm text-green-600 font-semibold">Available</span>
                </div>
              </div>
              {/* Languages and specialization */}
              <div className="flex flex-wrap gap-1 md:gap-2 mb-2 md:mb-3">
                {t.languages.map(l => (<Badge key={l} variant="secondary" className="text-[10px] md:text-xs px-2 py-0.5">{l}</Badge>))}
                {t.specialization && <Badge variant="outline" className="text-[10px] md:text-xs px-2 py-0.5">{t.specialization}</Badge>}
              </div>
              {/* Top skill and price, stacked vertically */}
              <div className="flex flex-col gap-1 mt-auto">
                <span className="text-[10px] md:text-xs text-yellow-700 font-semibold bg-yellow-50 rounded px-2 py-1">Top Skill: {t.specialization || t.languages[0]}</span>
                <span className="text-sm md:text-base text-blue-700 font-bold bg-blue-50 rounded px-2 py-1">${idx === 0 ? '2,200' : idx === 1 ? '1,500' : idx === 2 ? '2,800' : '1,900'}<span className="text-[10px] md:text-xs font-normal"> /mo</span></span>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Talent Profile Sheet with blurred content & CTA */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-[40vw] min-w-[350px] max-w-[48rem] p-0">
          {selectedTalent && (
            <div className="relative h-full flex flex-col">
              {/* Header */}
              <div className="sticky top-0 z-10 bg-white px-6 pt-6 pb-4 shadow-sm border-b flex items-center justify-between gap-2">
                <h2 className="text-xl font-bold">{selectedTalent.title}</h2>
                <Button size="icon" variant="ghost" onClick={() => setSheetOpen(false)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>
              {/* CTA Banner */}
              <div className="p-6 bg-blue-50 border-b border-blue-200">
                <h3 className="text-lg font-bold mb-1" style={{ color: blue }}>Unlock Full Candidate Details</h3>
                <p className="text-sm text-blue-800 mb-3">Sign the PandaDoc service agreement to view the complete profile.</p>
                <Button style={{ backgroundColor: blue }} className="hover:opacity-90">Contact Account Manager</Button>
              </div>
              {/* Blurred Content */}
              <div className="flex-1 overflow-y-auto p-6 filter blur-sm select-none pointer-events-none">
                <p className="mb-2 font-semibold">Experience</p>
                <p className="text-muted-foreground text-sm mb-6">{selectedTalent.experience}</p>
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
            <AccordionTrigger className="font-semibold text-[#009FE3] text-lg">How do I start the hiring process?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
              Click the "Submit a Hire Request" button at the top of the dashboard. Our team will reach out to you and guide you through the next steps, including signing the service agreement.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger className="font-semibold text-[#009FE3] text-lg">When can I view full candidate profiles?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
              Full candidate details are unlocked once you sign the PandaDoc service agreement sent to your email. This ensures privacy and a tailored experience for your practice.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger className="font-semibold text-[#009FE3] text-lg">What support does MedVirtual provide?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
              You have a dedicated MedVirtual Concierge to assist you at every step, from role selection to onboarding your new team member. Contact us anytime via the buttons in your dashboard.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q4">
            <AccordionTrigger className="font-semibold text-[#009FE3] text-lg">Is there a cost to submit a hire request?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
              No, submitting a hire request is free and non-binding. You only pay once you decide to move forward with a candidate and sign the service agreement.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q5">
            <AccordionTrigger className="font-semibold text-[#009FE3] text-lg">How long does it take to match with a candidate?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
              Most practices receive top matches within 2-5 business days after signing the service agreement.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
} 