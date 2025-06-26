"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { User, Mail, Phone, Shield, Calendar, Settings } from "lucide-react";

// --- TypeScript interfaces ---
interface AdminProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  adminRole: "Super Admin" | "Admin" | "Support Admin";
  permissions: string[];
  status: "Active" | "Inactive";
  joinDate: string;
  lastLogin: string;
  systemAccess: {
    canManageUsers: boolean;
    canManageClients: boolean;
    canViewAnalytics: boolean;
    canManageBilling: boolean;
  };
}

// --- Mock Data ---
const adminProfile: AdminProfile = {
  id: "1",
  fullName: "Elizabeth Pascoe",
  email: "elizabeth.pascoe@medvirtual.com",
  phone: "+1 (555) 123-4567",
  adminRole: "Super Admin",
  permissions: ["User Management", "Client Management", "System Configuration", "Analytics", "Billing"],
  status: "Active",
  joinDate: "2022-03-01",
  lastLogin: "2024-06-15T10:30:00Z",
  systemAccess: {
    canManageUsers: true,
    canManageClients: true,
    canViewAnalytics: true,
    canManageBilling: true,
  }
};

export default function AdminProfilePage() {
  const handleUpdateProfile = () => {
    alert("Update profile functionality would be implemented here.");
  };

  const handleSystemSettings = () => {
    alert("System settings functionality would be implemented here.");
  };

  return (
    <div className="min-h-screen bg-background flex">
      <main className="flex-1 p-6 md:p-10 w-full max-w-none px-4 sm:px-8">
        {/* Main Title */}
        <h1 className="text-3xl font-bold mb-8 text-foreground">Admin Profile</h1>

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
                  name={adminProfile.fullName}
                  className="w-16 h-16"
                />
                <div>
                  <h2 className="text-xl font-semibold">{adminProfile.fullName}</h2>
                  <Badge variant="secondary" className="mt-1">
                    {adminProfile.status}
                  </Badge>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{adminProfile.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{adminProfile.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="font-medium">{new Date(adminProfile.joinDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Role & Permissions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Admin Role & Permissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Admin Role</p>
                <Badge variant="default" className="mt-1">
                  {adminProfile.adminRole}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Permissions</p>
                <div className="flex flex-wrap gap-1">
                  {adminProfile.permissions.map((permission) => (
                    <Badge key={permission} variant="outline" className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Last Login</p>
                <p className="font-medium">{new Date(adminProfile.lastLogin).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* System Access Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                System Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">User Management</p>
                    <p className="text-sm text-muted-foreground">Manage user accounts and permissions</p>
                  </div>
                  <Badge variant={adminProfile.systemAccess.canManageUsers ? "default" : "secondary"}>
                    {adminProfile.systemAccess.canManageUsers ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Client Management</p>
                    <p className="text-sm text-muted-foreground">Manage client accounts and data</p>
                  </div>
                  <Badge variant={adminProfile.systemAccess.canManageClients ? "default" : "secondary"}>
                    {adminProfile.systemAccess.canManageClients ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Analytics Access</p>
                    <p className="text-sm text-muted-foreground">View system analytics and reports</p>
                  </div>
                  <Badge variant={adminProfile.systemAccess.canViewAnalytics ? "default" : "secondary"}>
                    {adminProfile.systemAccess.canViewAnalytics ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Billing Management</p>
                    <p className="text-sm text-muted-foreground">Manage billing and payments</p>
                  </div>
                  <Badge variant={adminProfile.systemAccess.canManageBilling ? "default" : "secondary"}>
                    {adminProfile.systemAccess.canManageBilling ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-4">
                  As a Super Admin, you have full access to all system features. 
                  Please ensure you follow security best practices when managing sensitive data.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={handleUpdateProfile}
            disabled
            className="w-full sm:w-auto"
            variant="default"
          >
            <User className="w-4 h-4 mr-2" />
            Update Profile
          </Button>
          
          <Button 
            onClick={handleSystemSettings}
            className="w-full sm:w-auto"
            variant="outline"
          >
            <Settings className="w-4 h-4 mr-2" />
            System Settings
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground mt-2">
          Profile updates are currently disabled. Please contact the system administrator for assistance.
        </p>
      </main>
    </div>
  );
} 