"use client"

import React, { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

// --- Mock Data ---
interface Candidate {
  id: string
  name: string
  role: string
  experience: string
  languages: string[]
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
}))

const PANEL_SIZE = 5

export default function CreatePanelPage() {
  const [search, setSearch] = useState("")
  const [panel, setPanel] = useState<Candidate[]>([])

  // Filtro de candidatos por búsqueda semántica simple
  const filteredCandidates = useMemo(() => {
    return CANDIDATES.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase()) ||
      c.languages.some(lang => lang.toLowerCase().includes(search.toLowerCase()))
    ).filter(c => !panel.some(p => p.id === c.id))
  }, [search, panel])

  // Añadir candidato al panel
  const handleAddToPanel = (candidate: Candidate) => {
    if (panel.length < PANEL_SIZE && !panel.some(c => c.id === candidate.id)) {
      setPanel([...panel, candidate])
    }
  }

  // Quitar candidato del panel
  const handleRemoveFromPanel = (id: string) => {
    setPanel(panel.filter(c => c.id !== id))
  }

  // Confirmar panel (simulado)
  const handleConfirmPanel = () => {
    alert("Panel confirmed!\n" + panel.map(c => c.name).join(", "))
  }

  return (
    <div className="min-h-screen bg-background flex">
      <main className="flex-1 p-4 md:p-10 w-full">
        <h1 className="text-2xl md:text-3xl font-bold mb-8 text-foreground">Create Panel</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Columna Izquierda: Buscador y lista de candidatos */}
          <section className="w-full lg:w-[70%]">
            <div className="mb-6">
              <Input
                type="text"
                placeholder="Search candidates by name, role, or language..."
                className="text-lg py-6"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            {/* Lista de candidatos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCandidates.length === 0 && (
                <div className="col-span-2 text-center text-muted-foreground py-8">
                  No candidates found.
                </div>
              )}
              {filteredCandidates.map(candidate => (
                <Card key={candidate.id} className="flex flex-col gap-2 p-4">
                  <div className="font-semibold text-lg text-foreground">{candidate.name}</div>
                  <div className="text-sm text-muted-foreground">{candidate.role} &bull; {candidate.experience}</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {candidate.languages.map(lang => (
                      <Badge key={lang} variant="secondary">{lang}</Badge>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    className="mt-3 w-fit"
                    disabled={panel.length >= PANEL_SIZE}
                    onClick={() => handleAddToPanel(candidate)}
                  >
                    + Add to Panel
                  </Button>
                </Card>
              ))}
            </div>
          </section>

          {/* Columna Derecha: Panel en construcción */}
          <aside className="w-full lg:w-[30%]">
            <Card className="p-6 flex flex-col gap-4 sticky top-8">
              <h2 className="text-xl font-semibold mb-2 text-foreground text-center">Panel in Progress</h2>
              <div className="flex flex-col gap-3">
                {[...Array(PANEL_SIZE)].map((_, idx) => (
                  <div
                    key={idx}
                    className={
                      "flex items-center justify-between border rounded px-3 py-2 min-h-[44px] " +
                      (panel[idx] ? "bg-primary/10 border-primary" : "bg-muted border-dashed border-muted-foreground/30")
                    }
                  >
                    {panel[idx] ? (
                      <>
                        <span className="font-medium text-foreground">{panel[idx].name}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRemoveFromPanel(panel[idx].id)}
                          aria-label="Remove"
                        >
                          ×
                        </Button>
                      </>
                    ) : (
                      <span className="text-muted-foreground">Empty Slot</span>
                    )}
                  </div>
                ))}
              </div>
              <Button
                className="mt-4"
                size="lg"
                disabled={panel.length < PANEL_SIZE}
                onClick={handleConfirmPanel}
              >
                Confirm and Schedule Panel
              </Button>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  )
} 