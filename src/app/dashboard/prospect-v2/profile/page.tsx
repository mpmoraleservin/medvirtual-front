"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { User, Mail, Phone, MessageCircle } from "lucide-react";

// --- TypeScript interfaces ---
interface ProspectProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  status: "Active" | "Pending" | "Inactive";
  joinDate: string;
}

// --- Mock Data ---
const prospectProfile: ProspectProfile = {
  id: "1",
  fullName: "Dr. Smith",
  email: "dr.smith@example.com",
  phone: "+1 (555) 123-4567",
  status: "Active",
  joinDate: "2024-01-15"
};

export default function ProspectProfilePage() {
  const handleContactSupport = () => {
    alert("Contacting support... Please check your email for a response within 24 hours.");
  };

  return (
    <div className="min-h-screen bg-background flex">
      <main className="flex-1 p-6 md:p-10 w-full max-w-none px-4 sm:px-8">
        {/* Main Title */}
        <h1 className="text-3xl font-bold mb-8 text-foreground">My Profile</h1>

        {/* Profile Card */}
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar and Name Section */}
            <div className="flex items-center gap-4">
              <Avatar 
                name={prospectProfile.fullName}
                className="w-16 h-16"
              />
              <div>
                <h2 className="text-xl font-semibold">{prospectProfile.fullName}</h2>
                <Badge variant="secondary" className="mt-1">
                  {prospectProfile.status}
                </Badge>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{prospectProfile.email}</p>
                </div>
              </div>
              
              {prospectProfile.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{prospectProfile.phone}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">{new Date(prospectProfile.joinDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-2">Account Status</h3>
              <p className="text-sm text-muted-foreground mb-4">
                As a prospect, you have limited account management capabilities. 
                To access full features, please complete your service agreement.
              </p>
            </div>

            {/* Contact Support Button */}
            <div className="pt-4 border-t">
              <Button 
                onClick={handleContactSupport}
                className="w-full sm:w-auto"
                variant="default"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
} 