"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { User, Mail, Phone, Building, CreditCard, Calendar } from "lucide-react";

// --- TypeScript interfaces ---
interface ClientProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  companySize: string;
  industry: string;
  status: "Active" | "Pending" | "Suspended";
  joinDate: string;
  billingInfo: {
    plan: string;
    nextBilling: string;
    paymentMethod: string;
  };
}

// --- Mock Data ---
const clientProfile: ClientProfile = {
  id: "1",
  fullName: "Dr. Smith",
  email: "dr.smith@medclinic.com",
  phone: "+1 (555) 987-6543",
  companyName: "MedClinic Associates",
  companySize: "25-50 employees",
  industry: "Healthcare",
  status: "Active",
  joinDate: "2023-06-15",
  billingInfo: {
    plan: "Professional Plan",
    nextBilling: "2024-07-15",
    paymentMethod: "Visa ending in 4242"
  }
};

export default function ClientProfilePage() {
  const handleUpdateProfile = () => {
    alert("Update profile functionality would be implemented here.");
  };

  return (
    <div className="min-h-screen bg-background flex">
      <main className="flex-1 p-6 md:p-10 w-full max-w-none px-4 sm:px-8">
        {/* Main Title */}
        <h1 className="text-3xl font-bold mb-8 text-foreground">My Profile</h1>

        {/* Profile Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl">
          {/* Personal Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar and Name Section */}
              <div className="flex items-center gap-4">
                <Avatar 
                  name={clientProfile.fullName}
                  className="w-16 h-16"
                />
                <div>
                  <h2 className="text-xl font-semibold">{clientProfile.fullName}</h2>
                  <Badge variant="secondary" className="mt-1">
                    {clientProfile.status}
                  </Badge>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{clientProfile.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{clientProfile.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="font-medium">{new Date(clientProfile.joinDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Company Name</p>
                <p className="font-medium">{clientProfile.companyName}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Company Size</p>
                <p className="font-medium">{clientProfile.companySize}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Industry</p>
                <p className="font-medium">{clientProfile.industry}</p>
              </div>
            </CardContent>
          </Card>

          {/* Billing Information Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Billing Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Current Plan</p>
                  <p className="font-medium">{clientProfile.billingInfo.plan}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Next Billing Date</p>
                  <p className="font-medium">{new Date(clientProfile.billingInfo.nextBilling).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Payment Method</p>
                  <p className="font-medium">{clientProfile.billingInfo.paymentMethod}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-4">
                  Your billing information is securely stored and processed by our payment partners. 
                  You can update your payment method or billing details through your account settings.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Update Profile Button */}
        <div className="mt-8">
          <Button 
            onClick={handleUpdateProfile}
            disabled
            className="w-full sm:w-auto"
            variant="default"
          >
            <User className="w-4 h-4 mr-2" />
            Update Profile
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Profile updates are currently disabled. Please contact support for assistance.
          </p>
        </div>
      </main>
    </div>
  );
} 