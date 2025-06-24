"use client"

import SubmitHireRequestForm from "@/components/ui/submit-hire-request-form"
import { Card } from "@/components/ui/card"

export default function NewHireRequestPage() {
  return (
    <div className="min-h-screen bg-background flex">
      <main className="flex-1 flex items-center justify-center px-2 py-8 md:px-8">
        <div className="w-full flex justify-center">
          <Card className="w-full max-w-lg p-8 md:p-10 shadow-xl border border-border bg-white">
            <h1 className="text-2xl md:text-3xl font-bold mb-8 text-foreground text-center">
              Submit a New Hire Request
            </h1>
            <SubmitHireRequestForm />
          </Card>
        </div>
      </main>
    </div>
  )
} 