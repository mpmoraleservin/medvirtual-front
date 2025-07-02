"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AdvancedTable, TableColumn } from "@/components/ui/advanced-table";
import { AlertTriangle, Info, Clock } from "lucide-react";

// Unified Hire Request Status Type
type HireRequestStatus = "Pending Signature";

interface HireRequest {
  id: string;
  role: string;
  dateSubmitted: string;
  status: HireRequestStatus;
  description?: string;
}

// --- Mock Data ---
const hireRequests: HireRequest[] = [
  {
    id: "1",
    role: "Medical Receptionist",
    dateSubmitted: "2024-06-01",
    status: "Pending Signature",
    description: "Full-time receptionist for busy family practice"
  },
  {
    id: "2", 
    role: "Registered Nurse",
    dateSubmitted: "2024-05-28",
    status: "Pending Signature",
    description: "Part-time RN for pediatric clinic"
  }
];

// Unified status configuration
const STATUS_CONFIG = {
  "Pending Signature": {
    color: "bg-chart-5 text-primary-foreground border-transparent",
    icon: <Clock className="w-4 h-4" />,
    description: "Waiting for client to sign service agreement"
  }
};

// --- Advanced Table Configuration ---
const columns: TableColumn<HireRequest>[] = [
  {
    key: "role",
    header: "Role",
    searchable: true,
    type: "text"
  },
  {
    key: "dateSubmitted",
    header: "Date Submitted",
    type: "date"
  },
  {
    key: "status",
    header: "Status",
    type: "badge",
    badgeConfig: {
      variant: "secondary",
      className: STATUS_CONFIG["Pending Signature"].color
    }
  },
  {
    key: "description",
    header: "Description",
    type: "text"
  }
];

export default function ProspectHireRequestsPage() {
  const handleCheckEmail = () => {
    // This could open email client or show instructions
    alert("Please check your email for the PandaDoc service agreement");
  };

  return (
    <div className="min-h-screen bg-background flex">
      <main className="flex-1 p-6 md:p-10 w-full max-w-none px-4 sm:px-8">
        {/* Header with Title only */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            My Hire Requests
          </h1>
        </div>

        {/* Prominent Alert Box */}
        <Card className="mb-8 p-4 border-primary bg-primary/5">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
            <div className="text-primary">
              <strong>Important:</strong> Your hire requests will be reviewed by our team once the PandaDoc service agreement is signed. Please check your email for the document.
              <Button 
                variant="link" 
                className="p-0 h-auto underline ml-1 text-primary"
                onClick={handleCheckEmail}
              >
                Check your email now
              </Button>
            </div>
          </div>
        </Card>

        {/* Hire Requests Advanced Table */}
        <AdvancedTable
          data={hireRequests}
          columns={columns}
          searchPlaceholder="Search hire requests..."
          emptyMessage="No hire requests submitted yet."
          showSearch={true}
          showFilters={false}
          showPagination={false}
          showPageSize={false}
          showMobileCards={true}
          defaultPageSize={10}
        />

        {/* Additional Call to Action */}
        {hireRequests.length > 0 && (
          <Card className="mt-8 p-6 bg-primary/5 border-primary">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 mt-1 flex-shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold mb-2 text-primary">
                  Ready to move forward?
                </h3>
                <p className="mb-4 text-primary">
                  To start reviewing candidates for your hire requests, please complete the service agreement. 
                  This document outlines our terms and ensures we can begin sourcing the best talent for your needs.
                </p>
                <Button 
                  variant="default" 
                  className="hover:opacity-90 bg-primary border-primary"
                  onClick={handleCheckEmail}
                >
                  <Info className="w-4 h-4 mr-2" />
                  Sign Service Agreement
                </Button>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
} 