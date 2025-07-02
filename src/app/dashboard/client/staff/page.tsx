"use client";

import { AdvancedTable } from '@/components/ui/advanced-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageTitle } from '@/components/ui/page-title';

interface StaffBonus {
  amount: number;
  date: string;
  notes?: string;
}

interface HiredStaffMember {
  id: string;
  name: string;
  avatarUrl?: string;
  role: string;
  country: string;
  billRate: number;
  currency: string;
  joinDate: string;
  bonuses?: StaffBonus[];
}

const staff: HiredStaffMember[] = [
  { id: "1", name: "Jane Doe", avatarUrl: undefined, role: "Medical Assistant", country: "🇺🇸 United States", billRate: 1800, currency: "USD", joinDate: "2023-05-01", bonuses: [ { amount: 50, date: "2024-05-01", notes: "Great performance in May" }, { amount: 25, date: "2024-03-15" } ] },
  { id: "2", name: "John Smith", avatarUrl: undefined, role: "Nurse", country: "🇬🇧 United Kingdom", billRate: 1500, currency: "GBP", joinDate: "2022-11-15", bonuses: [] },
  { id: "3", name: "Emily Brown", avatarUrl: undefined, role: "Receptionist", country: "🇨🇦 Canada", billRate: 1200, currency: "CAD", joinDate: "2024-01-10", bonuses: [ { amount: 100, date: "2024-04-10", notes: "Handled extra shifts" } ] },
  { id: "4", name: "Carlos Ruiz", avatarUrl: undefined, role: "Lab Technician", country: "🇲🇽 Mexico", billRate: 1000, currency: "MXN", joinDate: "2023-09-20" },
];

// Definir columnas para AdvancedTable
const columns = [
  { key: 'name' as keyof HiredStaffMember, header: 'Name', searchable: true },
  { key: 'role' as keyof HiredStaffMember, header: 'Role', searchable: true },
  { key: 'country' as keyof HiredStaffMember, header: 'Country', searchable: true },
  { key: 'billRate' as keyof HiredStaffMember, header: 'Bill Rate', type: 'currency' as const },
  { key: 'joinDate' as keyof HiredStaffMember, header: 'Join Date', type: 'date' as const },
];

const filters = [
  { key: 'role' as keyof HiredStaffMember, label: 'Role', type: 'text' as const, placeholder: 'e.g. Nurse' },
  { key: 'country' as keyof HiredStaffMember, label: 'Country', type: 'text' as const, placeholder: 'e.g. USA' },
  { key: 'joinDate' as keyof HiredStaffMember, label: 'Join Date From', type: 'date' as const, placeholder: 'From' },
  { key: 'joinDate' as keyof HiredStaffMember, label: 'Join Date To', type: 'date' as const, placeholder: 'To' },
];

export default function ClientStaffPage() {

  return (
    <div className="space-y-6">
      <PageTitle title="Staff" />
      
      <Card>
        <CardHeader>
          <CardTitle>My Staff</CardTitle>
        </CardHeader>
        <CardContent>
          <AdvancedTable
            data={staff}
            columns={columns}
            filters={filters}
            defaultPageSize={10}
            showPagination={true}
            showSearch={true}
            showFilters={true}
            showPageSize={true}
            searchPlaceholder="Search staff..."
            emptyMessage="No staff found."
          />
        </CardContent>
      </Card>
    </div>
  );
} 