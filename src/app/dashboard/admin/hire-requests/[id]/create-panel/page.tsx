"use client"

import React, { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Calendar } from "lucide-react"

// --- Mock Data ---
interface Candidate {
  id: string
  name: string
  role: string
  experience: string
  languages: string[]
  specializations: string[]
}

const CANDIDATES: Candidate[] = Array.from({ length: 30 }).map((_, i) => ({
  id: (i + 1).toString(),
  name: [
    "Alice Johnson", "Bob Smith", "Carlos Rivera", "Diana Lee", "Eva Müller",
    "Fiona Chen", "George Brown", "Hannah Kim", "Ivan Petrov", "Julia Rossi"
  ][i % 10] + ` #${i + 1}`,
  role: ["Nurse", "Medical Assistant", "Lab Tech", "Receptionist", "Physician"][i % 5],
  experience: `${2 + (i % 8)} years experience`,
  languages: ["English", "Spanish", "French", "German"].filter((_, idx) => (i + idx) % 2 === 0),
  specializations: ["Pediatrics", "Emergency Care", "Family Medicine", "Internal Medicine", "Surgery"].filter((_, idx) => (i + idx) % 2 === 0),
}))

const PANEL_SIZE = 5

export default function CreatePanelPage() {
  const [search, setSearch] = useState("")
  const [panel, setPanel] = useState<Candidate[]>([])
  const [interviewDate, setInterviewDate] = useState("")
  const [interviewTime, setInterviewTime] = useState("")

  // Simple semantic search filter for candidates
  const filteredCandidates = useMemo(() => {
    return CANDIDATES.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase()) ||
      c.languages.some(lang => lang.toLowerCase().includes(search.toLowerCase())) ||
      c.specializations.some(spec => spec.toLowerCase().includes(search.toLowerCase()))
    ).filter(c => !panel.some(p => p.id === c.id))
  }, [search, panel])

  // Add candidate to panel
  const handleAddToPanel = (candidate: Candidate) => {
    if (panel.length < PANEL_SIZE && !panel.some(c => c.id === candidate.id)) {
      setPanel([...panel, candidate])
    }
  }

  // Quitar candidato del panel
  const handleRemoveFromPanel = (id: string) => {
    setPanel(panel.filter(c => c.id !== id))
  }

  // Confirmar panel y agendar entrevista
  const handleConfirmPanel = () => {
    if (!interviewDate || !interviewTime) {
      alert("Please select interview date and time")
      return
    }
    alert(`Panel confirmed and interview scheduled!\nDate: ${interviewDate}\nTime: ${interviewTime}\nCandidates: ${panel.map(c => c.name).join(", ")}`)
  }

  return (
    <div className="h-full bg-background flex flex-col">
      <main className="flex-1 p-4 md:p-10 w-full h-full flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">Interview Panel</h1>
          <p className="text-muted-foreground">Select 5 candidates and schedule the panel interview</p>
        </div>
        <div className="flex flex-col h-full gap-4 overflow-y-auto max-h-full">
          {/* Top half: Confirm panel and schedule interview */}
          <section className="w-full flex-1 flex flex-col max-h-[48%] min-h-[320px]">
            <Card className="p-8 h-full flex flex-col justify-between">
              <div className="flex flex-row gap-8 h-full items-start">
                {/* Left: Candidates */}
                <div className="flex-1 flex flex-col gap-2 justify-start">
                  <div className="text-base font-medium text-muted-foreground mb-2 text-left">
                    {panel.length}/{PANEL_SIZE} candidates selected
                  </div>
                  {[...Array(PANEL_SIZE)].map((_, idx) => (
                    <Card
                      key={idx}
                      className={
                        "flex items-center justify-between px-3 h-[36px] min-h-[36px] shadow-none border " +
                        (panel[idx] ? "bg-primary/10 border-primary" : "bg-muted border-dashed border-muted-foreground/30")
                      }
                    >
                      {panel[idx] ? (
                        <>
                          <div className="flex-1 flex flex-col justify-center">
                            <span className="font-semibold text-foreground text-sm leading-none">{panel[idx].name}</span>
                            <div className="text-xs text-muted-foreground leading-none">{panel[idx].role}</div>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleRemoveFromPanel(panel[idx].id)}
                            aria-label="Remove"
                            className="h-6 w-6"
                          >
                            ×
                          </Button>
                        </>
                      ) : (
                        <span className="text-muted-foreground text-xs w-full text-center">Empty Slot</span>
                      )}
                    </Card>
                  ))}
                </div>
                {/* Right: Schedule Interview */}
                <div className="flex flex-col justify-center gap-4 w-full max-w-xs min-w-[220px]">
                  <h3 className="font-semibold mb-2 text-foreground text-center text-lg">Schedule Interview</h3>
                  <div>
                    <label className="text-sm font-medium text-foreground">Date</label>
                    <Input
                      type="date"
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Time</label>
                    <Input
                      type="time"
                      value={interviewTime}
                      onChange={(e) => setInterviewTime(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <Button
                    className="mt-2 w-full"
                    size="lg"
                    disabled={panel.length < PANEL_SIZE || !interviewDate || !interviewTime}
                    onClick={handleConfirmPanel}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Confirm Panel & Schedule Interview
                  </Button>
                </div>
              </div>
            </Card>
          </section>
          <div className="h-4" />
          {/* Bottom half: Search and select candidates (only if panel not full) */}
          {panel.length < PANEL_SIZE && (
            <section className="w-full flex-1 flex flex-col max-h-[52%] min-h-[300px]">
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Search candidates by name, role, language, or specialization..."
                  className="text-lg py-6"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto pr-2">
                {filteredCandidates.length === 0 && (
                  <div className="col-span-2 text-center text-muted-foreground py-8">
                    No candidates found.
                  </div>
                )}
                {filteredCandidates.map(candidate => (
                  <Card key={candidate.id} className="flex flex-col gap-3 p-4 hover:shadow-md transition-shadow">
                    <div className="font-semibold text-lg text-foreground">{candidate.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      {candidate.role} &bull; {candidate.experience}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {candidate.languages.map(lang => (
                        <Badge key={lang} variant="secondary" className="text-xs">{lang}</Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {candidate.specializations.map(spec => (
                        <Badge key={spec} variant="outline" className="text-xs">{spec}</Badge>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      className="mt-2 w-fit"
                      disabled={panel.length >= PANEL_SIZE}
                      onClick={() => handleAddToPanel(candidate)}
                    >
                      + Add to Panel
                    </Button>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  )
} 