"use client";

import { AdvancedTable } from '@/components/ui/advanced-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageTitle } from '@/components/ui/page-title';

// Unified Hire Request Status Type
type HireRequestStatus = "New" | "Sourcing" | "Panel Ready" | "Interview Scheduled" | "Awaiting Decision" | "Placement Complete" | "Canceled";

interface HireRequest {
  id: string;
  role: string;
  department?: string;
  location?: string;
  status: HireRequestStatus;
  dateSubmitted: string;
}

// Mock data
const hireRequests: HireRequest[] = [
  {
    id: "1",
    role: "Registered Nurse",
    department: "Emergency",
    location: "Miami, FL",
    status: "New",
    dateSubmitted: "2024-06-01"
  },
  {
    id: "2",
    role: "Medical Assistant",
    department: "Family Medicine",
    location: "Fort Lauderdale, FL",
    status: "Sourcing",
    dateSubmitted: "2024-05-31"
  },
  {
    id: "3",
    role: "Lab Technician",
    department: "Laboratory",
    location: "West Palm Beach, FL",
    status: "Interview Scheduled",
    dateSubmitted: "2024-05-30"
  },
  {
    id: "4",
    role: "Receptionist",
    department: "Front Desk",
    location: "Tampa, FL",
    status: "Placement Complete",
    dateSubmitted: "2024-05-29"
  },
  {
    id: "5",
    role: "Nurse Practitioner",
    department: "Primary Care",
    location: "Orlando, FL",
    status: "Awaiting Decision",
    dateSubmitted: "2024-05-28"
  },
];

export default function ClientHireRequestsPage() {
  const columns = [
    { key: 'role' as keyof HireRequest, header: 'Role', searchable: true },
    { key: 'department' as keyof HireRequest, header: 'Department', searchable: true },
    { key: 'location' as keyof HireRequest, header: 'Location', searchable: true },
    { key: 'status' as keyof HireRequest, header: 'Status', type: 'status' as const, statusColors: {
      'New': 'bg-muted-foreground text-primary-foreground',
      'Sourcing': 'bg-primary text-primary-foreground',
      'Panel Ready': 'bg-chart-3 text-primary-foreground',
      'Interview Scheduled': 'bg-chart-5 text-primary-foreground',
      'Awaiting Decision': 'bg-chart-4 text-primary-foreground',
      'Placement Complete': 'bg-chart-2 text-primary-foreground',
      'Canceled': 'bg-destructive text-primary-foreground',
    }},
    { key: 'dateSubmitted' as keyof HireRequest, header: 'Date Submitted', type: 'date' as const },
  ];

  const filters = [
    { key: 'department' as keyof HireRequest, label: 'Department', type: 'text' as const, placeholder: 'e.g. Reception' },
    { key: 'location' as keyof HireRequest, label: 'Location', type: 'text' as const, placeholder: 'e.g. Miami, FL' },
    { key: 'dateSubmitted' as keyof HireRequest, label: 'Date From', type: 'date' as const, placeholder: 'From' },
    { key: 'dateSubmitted' as keyof HireRequest, label: 'Date To', type: 'date' as const, placeholder: 'To' },
  ];

  return (
    <div className="space-y-6">
      <PageTitle title="Hire Requests" />
      
      <Card>
        <CardHeader>
          <CardTitle>My Hire Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <AdvancedTable
            data={hireRequests}
            columns={columns}
            filters={filters}
            defaultPageSize={10}
            showPagination={true}
            showSearch={true}
            showFilters={true}
            showPageSize={true}
            searchPlaceholder="Search hire requests..."
            emptyMessage="No hire requests found."
          />
        </CardContent>
      </Card>
    </div>
  );
} 