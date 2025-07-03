"use client";

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { UserCheck, Mail, Phone } from "lucide-react"
import React, { useState } from "react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card as UICard } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

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

// Copia el tipo Candidate y mocks de talent-pool
interface CandidateEducation {
  institution: string;
  degree: string;
  startYear: number;
  endYear: number;
}
interface CandidateExperience {
  company: string;
  role: string;
  startYear: number;
  endYear?: number;
  description?: string;
}
interface Candidate {
  id: string;
  name: string;
  avatarUrl?: string;
  role: string;
  pricePerMonth: number;
  currency: string;
  languages: string[];
  specializations: string[];
  skills: string[];
  about: string;
  education: CandidateEducation[];
  experience: CandidateExperience[];
  experienceLevel: "Junior" | "Mid" | "Senior";
}

// CandidateTeaserCard compacto reutilizable
function CandidateTeaserCard({ candidate, onClick }: { candidate: Candidate, onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full h-full min-h-[210px] bg-white border border-border rounded-xl shadow-sm p-4 flex flex-col items-start gap-2 hover:shadow-md transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
      style={{ minWidth: 0 }}
    >
      <div className="flex items-center gap-2 w-full mb-1">
        <Avatar name={candidate.name} src={candidate.avatarUrl} className="w-10 h-10 text-lg" />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-base text-foreground truncate">{candidate.role}</div>
          <div className="text-sm text-muted-foreground truncate">Senior Level</div>
        </div>
        <span className="text-yellow-400 text-xl ml-1">★</span>
      </div>
      <div className="flex flex-wrap gap-1 mb-2">
        {candidate.languages.map(l => (
          <span key={l} className="bg-gray-100 rounded-full px-2 py-0.5 text-xs">{l}</span>
        ))}
        {candidate.specializations.map(s => (
          <span key={s} className="bg-gray-100 rounded-full px-2 py-0.5 text-xs">{s}</span>
        ))}
      </div>
      <div className="bg-yellow-50 rounded px-2 py-1 text-yellow-700 font-semibold text-xs mb-2 w-fit">
        Top Skill: {candidate.skills[0]}
      </div>
      <div className="mt-auto w-full">
        <div className="bg-blue-50 rounded px-2 py-3 text-center font-bold text-xl text-[#1976a2] w-full">
          ${candidate.pricePerMonth.toLocaleString()}<span className="font-normal text-base text-gray-500"> /mo</span>
        </div>
      </div>
    </button>
  );
}

export default function ProspectDashboard() {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  // Convierte TalentCard a Candidate
  const mapTalentToCandidate = (t: TalentCard, idx: number): Candidate => ({
    id: t.id,
    name: t.title,
    avatarUrl: undefined,
    role: t.title,
    pricePerMonth: idx === 0 ? 2200 : idx === 1 ? 1500 : idx === 2 ? 2800 : 1900,
    currency: "USD",
    languages: t.languages,
    specializations: t.specialization ? [t.specialization] : [],
    skills: [t.specialization || t.languages[0]],
    about: `${t.title} with ${t.experience} of experience`,
    education: [],
    experience: [],
    experienceLevel: "Mid"
  });

  return (
    <div className="min-h-screen bg-background flex flex-col px-2 sm:px-8 pt-4 pb-20"> {/* pb-20 for mobile nav */}
      {/* Title */}
      <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-6 max-w-2xl">Welcome, Dr Smith!</h1>
      {/* Info disclaimer igual que en hire-requests */}
      <div className="mb-8 p-4 border-yellow-400 bg-yellow-50 rounded">
        <div className="flex items-start gap-3">
          <svg className="h-5 w-5 mt-0.5 flex-shrink-0 text-yellow-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
          <div className="text-yellow-800">
            <strong>Info:</strong> Your MedVirtual Concierge is preparing your service agreement. You will receive a PandaDoc to sign soon. We're working on your request!
          </div>
        </div>
      </div>

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
                <li className="flex items-start gap-2"><span className="shrink-0 bg-primary-foreground/20 p-1 rounded-full"><UserCheck className="w-4 h-4 text-primary-foreground" /></span> Top-tier vetted talent</li>
                <li className="flex items-start gap-2"><span className="shrink-0 bg-primary-foreground/20 p-1 rounded-full"><UserCheck className="w-4 h-4 text-primary-foreground" /></span> 30+ specialized roles</li>
                <li className="flex items-start gap-2"><span className="shrink-0 bg-primary-foreground/20 p-1 rounded-full"><UserCheck className="w-4 h-4 text-primary-foreground" /></span> Quick turnaround</li>
              </ul>
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
          const candidate = mapTalentToCandidate(t, idx);
          return (
            <CandidateTeaserCard
              key={t.id}
              candidate={candidate}
              onClick={() => {
                setSelectedCandidate(candidate);
                setProfileOpen(true);
              }}
            />
          );
        })}
      </div>

      {/* Sheet lateral de perfil completo */}
      <Sheet open={profileOpen} onOpenChange={setProfileOpen}>
        <SheetContent side="right" className="w-[40vw] min-w-[400px] max-w-[48rem] p-0">
          {selectedCandidate && (
            <div className="relative h-full flex flex-col">
              <div className="sticky top-0 z-10 bg-background px-6 pt-6 pb-4 shadow-sm border-b flex items-center justify-between gap-2">
                <div className="flex items-center gap-4">
                  <Avatar name={selectedCandidate.name} src={selectedCandidate.avatarUrl} className="w-14 h-14 text-2xl" />
                  <div>
                    <div className="filter blur-sm pointer-events-none select-none">
                      <h2 className="text-2xl font-bold">{selectedCandidate.name}</h2>
                    </div>
                    <div className="text-lg text-muted-foreground font-medium">{selectedCandidate.role}</div>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2">
                {/* Info principal visible */}
                <div className="flex flex-col md:flex-row md:items-center md:gap-6 mb-4">
                  <div className="flex-1 flex flex-col items-center md:items-start gap-2 mt-4 md:mt-0">
                    <div className="text-muted-foreground text-lg text-center md:text-left">{selectedCandidate.role}</div>
                    <div className="mt-1 text-base font-semibold text-primary text-center md:text-left">
                      {selectedCandidate.currency === "USD" ? "$" : selectedCandidate.currency}
                      {selectedCandidate.pricePerMonth.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">/month</span>
                    </div>
                  </div>
                </div>
                
                {/* Skills y Specializations visibles */}
                <div className="mb-4">
                  <div className="mb-2 font-semibold text-foreground">Key Skills</div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedCandidate.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                  <div className="mb-2 font-semibold text-foreground">Specializations</div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedCandidate.specializations.slice(0, 2).map((spec) => (
                      <Badge key={spec} variant="secondary">{spec}</Badge>
                    ))}
                  </div>
                </div>
                
                {/* CTA y contenido borroso */}
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-400 rounded-lg flex flex-col items-center">
                  <span className="font-bold text-yellow-800 text-lg mb-1">Unlock Full Candidate Details</span>
                  <span className="text-yellow-800 text-sm mb-2 text-center">Your MedVirtual Concierge is preparing your service agreement. You will receive a PandaDoc to sign soon. We're working on your request!</span>
                </div>
                <div className="filter blur-sm pointer-events-none select-none">
                  <div className="flex flex-col md:flex-row md:items-center md:gap-6 mb-2">
                    <div className="flex-1 flex flex-col items-center md:items-start gap-2 mt-4 md:mt-0">
                      <div className="mt-1 flex flex-wrap gap-2 text-sm justify-center md:justify-start">
                        {selectedCandidate.languages.map((lang) => (
                          <Badge key={lang} variant="outline">{lang}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                      <div className="mb-2 font-semibold text-foreground">About Me</div>
                      <div className="text-sm text-muted-foreground mb-4">
                        {selectedCandidate.about}
                      </div>
                    </div>
                  </div>
                  <Tabs defaultValue="education" className="w-full">
                    <TabsList className="mb-2">
                      <TabsTrigger value="education">Education</TabsTrigger>
                      <TabsTrigger value="experience">Experience</TabsTrigger>
                    </TabsList>
                    <TabsContent value="education">
                      <div className="flex flex-col gap-2">
                        {selectedCandidate.education.map((edu, idx) => (
                          <UICard key={idx} className="p-3 flex flex-col gap-1">
                            <div className="font-semibold">{edu.degree}</div>
                            <div className="text-sm text-muted-foreground">{edu.institution}</div>
                            <div className="text-xs text-muted-foreground">{edu.startYear} - {edu.endYear}</div>
                          </UICard>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="experience">
                      <div className="flex flex-col gap-2">
                        {selectedCandidate.experience.map((exp, idx) => (
                          <UICard key={idx} className="p-3 flex flex-col gap-1">
                            <div className="font-semibold">{exp.role}</div>
                            <div className="text-sm text-muted-foreground">{exp.company}</div>
                            <div className="text-xs text-muted-foreground">{exp.startYear} - {exp.endYear || "Present"}</div>
                            {exp.description && <div className="text-xs text-muted-foreground mt-1">{exp.description}</div>}
                          </UICard>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
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