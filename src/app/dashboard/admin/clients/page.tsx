import { AdvancedTable } from "@/components/ui/advanced-table";
import { PageTitle } from "@/components/ui/page-title";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Client {
  id: string;
  name: string;
  industry: string;
  location: string;
  contact: string;
  status: "Active" | "Inactive";
  createdAt: string;
}

// Mock data
const clients: Client[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    industry: "Healthcare",
    location: "Miami, FL",
    contact: "Dr. Sarah Johnson",
    status: "Active",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Wellness Medical Center",
    industry: "Healthcare",
    location: "Fort Lauderdale, FL",
    contact: "Dr. Michael Chen",
    status: "Active",
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    name: "Community Health Clinic",
    industry: "Healthcare",
    location: "West Palm Beach, FL",
    contact: "Dr. Emily Rodriguez",
    status: "Inactive",
    createdAt: "2024-03-10",
  },
  {
    id: "4",
    name: "Bayside Medical Group",
    industry: "Healthcare",
    location: "Tampa, FL",
    contact: "Dr. James Wilson",
    status: "Active",
    createdAt: "2024-01-05",
  },
  {
    id: "5",
    name: "Sunshine Pediatrics",
    industry: "Healthcare",
    location: "Orlando, FL",
    contact: "Dr. Lisa Thompson",
    status: "Active",
    createdAt: "2024-02-28",
  },
];

const columns = [
  {
    key: 'name' as keyof Client,
    header: 'Company Name',
    sortable: true,
    searchable: true,
  },
  {
    key: 'industry' as keyof Client,
    header: 'Industry',
    sortable: true,
    searchable: true,
  },
  {
    key: 'location' as keyof Client,
    header: 'Location',
    sortable: true,
    searchable: true,
  },
  {
    key: 'contact' as keyof Client,
    header: 'Contact Person',
    sortable: true,
    searchable: true,
  },
  {
    key: 'status' as keyof Client,
    header: 'Status',
    sortable: true,
    type: 'status' as const,
    statusColors: {
      'Active': 'bg-green-100 text-green-800',
      'Inactive': 'bg-gray-100 text-gray-800',
    },
  },
  {
    key: 'createdAt' as keyof Client,
    header: 'Created',
    sortable: true,
    type: 'date' as const,
  },
];

const filters = [
  {
    key: 'name' as keyof Client,
    label: 'Company Name',
    type: 'text' as const,
  },
  {
    key: 'industry' as keyof Client,
    label: 'Industry',
    type: 'select' as const,
    options: [
      { value: 'technology', label: 'Technology' },
      { value: 'healthcare', label: 'Healthcare' },
      { value: 'finance', label: 'Finance' },
      { value: 'education', label: 'Education' },
      { value: 'retail', label: 'Retail' },
    ],
  },
  {
    key: 'status' as keyof Client,
    label: 'Status',
    type: 'select' as const,
    options: [
      { value: 'Active', label: 'Active' },
      { value: 'Inactive', label: 'Inactive' },
    ],
  },
  {
    key: 'location' as keyof Client,
    label: 'Location',
    type: 'text' as const,
  },
  {
    key: 'contact' as keyof Client,
    label: 'Contact Person',
    type: 'text' as const,
  },
  {
    key: 'createdAt' as keyof Client,
    label: 'Created Date',
    type: 'date' as const,
  },
];

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <PageTitle title="Clients" />
      <Card>
        <CardHeader>
          <CardTitle>Client Management</CardTitle>
        </CardHeader>
        <CardContent>
          <AdvancedTable
            data={clients}
            columns={columns}
            filters={filters}
            defaultPageSize={10}
            showPagination={true}
            showSearch={true}
            showFilters={true}
            showPageSize={true}
            searchPlaceholder="Search clients..."
            emptyMessage="No clients found."
          />
        </CardContent>
      </Card>
    </div>
  );
} 