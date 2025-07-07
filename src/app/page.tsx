"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle";
import { 
  ClipboardList, 
  CalendarCheck, 
  UserCheck, 
  TrendingUp, 
  Hourglass, 
  Ticket, 
  AlertTriangle 
} from "lucide-react";

export default function Home() {
  return (
    <div className="relative w-full flex flex-col items-center min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Dark Mode Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <DarkModeToggle />
      </div>
      
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto text-center py-24 px-4 sm:px-6 lg:px-8">
         <div className="max-w-4xl mx-auto">
           <div className="flex justify-center mb-8">
             <img src="/logo.png" alt="MedVirtual Logo" className="h-16 sm:h-20 lg:h-24 object-contain" />
           </div>
           <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-tight">
             Healthcare Staffing Made Simple
           </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Connect healthcare professionals with medical practices seamlessly. 
            Streamline hiring, manage panels, and find the perfect match for your team.
          </p>
                     <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
             <Button 
               size="lg" 
               className="bg-primary hover:bg-primary/90 text-lg px-8 py-4 rounded-xl shadow-lg"
               onClick={() => {
                 document.getElementById('choose-experience')?.scrollIntoView({ 
                   behavior: 'smooth' 
                 });
               }}
             >
               Get Started
             </Button>
           </div>
        </div>
      </section>
             {/* User Type Sections */}
       <section id="choose-experience" className="w-full max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Choose Your Experience
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select the portal that best fits your role in the healthcare staffing process
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {/* Admin Section */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Admin Dashboard</h3>
              <p className="text-muted-foreground mb-4">
                Manage hire requests, schedule panels, and oversee the entire staffing process.
              </p>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Review new hire requests</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Schedule interview panels</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Track pending decisions</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Monitor support tickets</span>
              </div>
            </div>
            <Link href="/dashboard/admin">
              <Button className="w-full">Access Admin Dashboard</Button>
            </Link>
          </Card>

          {/* Client Section */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarCheck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Client Portal</h3>
              <p className="text-muted-foreground mb-4">
                Browse candidates, manage interview panels, and make hiring decisions.
              </p>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Browse talent pool</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Review interview panels</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Make hiring decisions</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Track placement status</span>
              </div>
            </div>
            <Link href="/dashboard/client">
              <Button className="w-full">Access Client Portal</Button>
            </Link>
          </Card>

          {/* Prospect Section */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Prospect Experience</h3>
              <p className="text-muted-foreground mb-4">
                Explore opportunities, view your profile, and connect with healthcare practices.
              </p>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Browse available positions</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Manage your profile</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Track applications</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>View interview status</span>
              </div>
            </div>
            <Link href="/dashboard/prospect">
              <Button className="w-full">Access Prospect Portal</Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-muted/50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Why Choose Our Platform?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Efficient Matching</h3>
              <p className="text-sm text-muted-foreground">
                AI-powered candidate matching for optimal fit
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Hourglass className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Quick Turnaround</h3>
              <p className="text-sm text-muted-foreground">
                Streamlined process from request to placement
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">24/7 Support</h3>
              <p className="text-sm text-muted-foreground">
                Dedicated support team for all your needs
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Quality Assurance</h3>
              <p className="text-sm text-muted-foreground">
                Verified credentials and background checks
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
