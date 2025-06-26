import { Card } from "@/components/ui/card"
import { ArrowRight, Users, ClipboardList, CalendarCheck } from "lucide-react"

const blue = "#009FE3";

export default function ProspectDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header Section */}
        <div className="mb-12 mt-4 max-w-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground text-left relative inline-block">
              Welcome to MedVirtual
              <span className="block h-1 w-16 rounded-full mt-2" style={{ background: blue }} />
            </h1>
          </div>
          <p className="text-muted-foreground text-lg mb-2 text-left">
            Connect with top-tier healthcare professionals tailored to your specific needs
          </p>
          <p className="text-muted-foreground mb-6 text-left">
            Our curated talent pool ensures you find the perfect match for your medical practice or healthcare organization.
          </p>
        </div>

        {/* Separador celeste */}
        <div className="w-full h-1 rounded mb-10" style={{ background: blue, opacity: 0.08 }} />

        {/* Process Flow Section */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold mb-6 text-foreground text-left">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:[grid-template-columns:1fr_min-content_1fr_min-content_1fr] gap-y-8 sm:gap-x-2 items-center">
            {/* Step 1 */}
            <Card className="flex flex-col items-center justify-between p-6 w-full h-full border" style={{ borderColor: blue }}>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full font-bold border-2" style={{ background: `${blue}10`, color: blue, borderColor: blue }}>
                  <span className="text-2xl font-bold">1</span>
                </div>
                <div className="text-center">
                  <h3 className="mb-2 text-lg font-bold text-foreground">
                    Submit Request
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Tell us about your hiring needs and requirements
                  </p>
                </div>
              </div>
            </Card>
            {/* Flecha 1 */}
            <div className="flex justify-center items-center w-full h-full">
              <ArrowRight className="h-8 w-8" style={{ color: blue, opacity: 0.7 }} />
            </div>
            {/* Step 2 */}
            <Card className="flex flex-col items-center justify-between p-6 w-full h-full border" style={{ borderColor: blue }}>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full font-bold border-2" style={{ background: `${blue}10`, color: blue, borderColor: blue }}>
                  <span className="text-2xl font-bold">2</span>
                </div>
                <div className="text-center">
                  <h3 className="mb-2 text-lg font-bold text-foreground">
                    We Curate Talent
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Our experts handpick qualified candidates for you
                  </p>
                </div>
              </div>
            </Card>
            {/* Flecha 2 */}
            <div className="flex justify-center items-center w-full h-full">
              <ArrowRight className="h-8 w-8" style={{ color: blue, opacity: 0.7 }} />
            </div>
            {/* Step 3 */}
            <Card className="flex flex-col items-center justify-between p-6 w-full h-full border" style={{ borderColor: blue }}>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full font-bold border-2" style={{ background: `${blue}10`, color: blue, borderColor: blue }}>
                  <span className="text-2xl font-bold">3</span>
                </div>
                <div className="text-center">
                  <h3 className="mb-2 text-lg font-bold text-foreground">
                    Meet Your Candidates
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Connect with pre-screened professionals ready to join your team
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Why Choose MedVirtual */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-8 text-foreground text-left">Why Choose MedVirtual</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="flex items-start gap-4 p-6 border" style={{ borderColor: blue }}>
              <div className="flex items-center justify-center h-12 w-12 rounded-full" style={{ background: `${blue}10` }}>
                <Users className="h-6 w-6" style={{ color: blue }} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground mb-1">Pre-screened Talent</h3>
                <p className="text-sm text-muted-foreground">All candidates are thoroughly vetted and verified</p>
              </div>
            </Card>
            <Card className="flex items-start gap-4 p-6 border" style={{ borderColor: blue }}>
              <div className="flex items-center justify-center h-12 w-12 rounded-full" style={{ background: `${blue}10` }}>
                <ClipboardList className="h-6 w-6" style={{ color: blue }} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground mb-1">Streamlined Process</h3>
                <p className="text-sm text-muted-foreground">Simple request submission and candidate matching</p>
              </div>
            </Card>
            <Card className="flex items-start gap-4 p-6 border" style={{ borderColor: blue }}>
              <div className="flex items-center justify-center h-12 w-12 rounded-full" style={{ background: `${blue}10` }}>
                <CalendarCheck className="h-6 w-6" style={{ color: blue }} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground mb-1">Fast Turnaround</h3>
                <p className="text-sm text-muted-foreground">Quick response times and efficient hiring process</p>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
} 