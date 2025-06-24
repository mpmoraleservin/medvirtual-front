import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function ProspectDashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Welcome Title */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Welcome to MedVirtual
          </h1>

          {/* Introductory Paragraph */}
          <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Connect with top-tier healthcare professionals tailored to your specific needs. 
            Our curated talent pool ensures you find the perfect match for your medical practice 
            or healthcare organization.
          </p>

          {/* Primary CTA Button */}
          <div className="mb-16">
            <Link href="/dashboard/client/hire-requests/new" passHref>
              <Button 
                size="lg" 
                className="h-14 px-8 text-lg font-semibold shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                Submit Your First Hire Request
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Process Flow Section */}
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
              How It Works
            </h2>
            
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {/* Step 1 */}
              <div className="group relative">
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                    <span className="text-2xl font-bold">1</span>
                  </div>
                  <div className="text-center">
                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                      Submit Request
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Tell us about your hiring needs and requirements
                    </p>
                  </div>
                </div>
                
                {/* Arrow for desktop */}
                <div className="absolute -right-4 top-8 hidden text-muted-foreground/30 sm:block">
                  <ArrowRight className="h-6 w-6" />
                </div>
              </div>

              {/* Step 2 */}
              <div className="group relative">
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                    <span className="text-2xl font-bold">2</span>
                  </div>
                  <div className="text-center">
                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                      We Curate Talent
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Our experts handpick qualified candidates for you
                    </p>
                  </div>
                </div>
                
                {/* Arrow for desktop */}
                <div className="absolute -right-4 top-8 hidden text-muted-foreground/30 sm:block">
                  <ArrowRight className="h-6 w-6" />
                </div>
              </div>

              {/* Step 3 */}
              <div className="group">
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                    <span className="text-2xl font-bold">3</span>
                  </div>
                  <div className="text-center">
                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                      Meet Your Candidates
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Connect with pre-screened professionals ready to join your team
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile arrows */}
            <div className="flex justify-center space-x-8 sm:hidden">
              <ArrowRight className="h-6 w-6 rotate-90 text-muted-foreground/30" />
              <ArrowRight className="h-6 w-6 rotate-90 text-muted-foreground/30" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 