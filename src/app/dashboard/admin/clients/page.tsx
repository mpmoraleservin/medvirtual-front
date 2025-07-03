"use client";

import React, { useState, useMemo } from "react";
import { PageTitle } from "@/components/ui/page-title";
import { Card } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Mail, Phone, MapPin, Building, Calendar, Users, Globe, Edit, X, FileText, CheckCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableHeader, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface Client {
  id: string;
  name: string;
  industry: string;
  location: string;
  contact: string;
  status: "Active" | "Inactive";
  role: "Prospect" | "Client";
  createdAt: string;
  avatarUrl?: string;
  email?: string;
  phone?: string;
  website?: string;
  description?: string;
  employees?: number;
  founded?: string;
  specialties?: string[];
  services?: string[];
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
    role: "Client",
    createdAt: "2024-01-15",
    avatarUrl: undefined,
    email: "sarah.johnson@healthcare.com",
    phone: "+1 (305) 555-0123",
    website: "www.drsarahjohnson.com",
    description: "Private practice specializing in internal medicine with over 15 years of experience serving the Miami community.",
    employees: 8,
    founded: "2009",
    specialties: ["Internal Medicine", "Preventive Care", "Chronic Disease Management"],
    services: ["Primary Care", "Annual Physicals", "Health Screenings", "Vaccinations"],
  },
  {
    id: "2",
    name: "Wellness Medical Center",
    industry: "Healthcare",
    location: "Fort Lauderdale, FL",
    contact: "Dr. Michael Chen",
    status: "Active",
    role: "Client",
    createdAt: "2024-02-20",
    avatarUrl: undefined,
    email: "info@wellnessmedical.com",
    phone: "+1 (954) 555-0456",
    website: "www.wellnessmedical.com",
    description: "Multi-specialty medical center providing comprehensive healthcare services to the Fort Lauderdale community since 2012.",
    employees: 45,
    founded: "2012",
    specialties: ["Family Medicine", "Cardiology", "Dermatology", "Orthopedics"],
    services: ["Primary Care", "Specialty Consultations", "Diagnostic Testing", "Preventive Care", "Telemedicine"],
  },
  {
    id: "3",
    name: "Community Health Clinic",
    industry: "Healthcare",
    location: "West Palm Beach, FL",
    contact: "Dr. Emily Rodriguez",
    status: "Inactive",
    role: "Prospect",
    createdAt: "2024-03-10",
    avatarUrl: undefined,
    email: "contact@communityhealth.org",
    phone: "+1 (561) 555-0789",
    website: "www.communityhealth.org",
    description: "Non-profit community health clinic dedicated to providing affordable healthcare to underserved populations.",
    employees: 23,
    founded: "2015",
    specialties: ["Community Health", "Preventive Medicine", "Women's Health"],
    services: ["Low-cost Care", "Health Education", "Vaccination Programs", "Screening Services"],
  },
  {
    id: "4",
    name: "Bayside Medical Group",
    industry: "Healthcare",
    location: "Tampa, FL",
    contact: "Dr. James Wilson",
    status: "Active",
    role: "Client",
    createdAt: "2024-01-05",
    avatarUrl: undefined,
  },
  {
    id: "5",
    name: "Sunshine Pediatrics",
    industry: "Healthcare",
    location: "Orlando, FL",
    contact: "Dr. Lisa Thompson",
    status: "Active",
    role: "Client",
    createdAt: "2024-02-28",
    avatarUrl: undefined,
  },
  {
    id: "6",
    name: "Cardiology Associates",
    industry: "Healthcare",
    location: "Jacksonville, FL",
    contact: "Dr. Robert Kim",
    status: "Active",
    role: "Client",
    createdAt: "2024-03-15",
    avatarUrl: undefined,
  },
  {
    id: "7",
    name: "Dermatology Specialists",
    industry: "Healthcare",
    location: "Gainesville, FL",
    contact: "Dr. Patricia Wilson",
    status: "Active",
    role: "Prospect",
    createdAt: "2024-02-10",
    avatarUrl: undefined,
  },
  {
    id: "8",
    name: "Orthopedic Center",
    industry: "Healthcare",
    location: "Tallahassee, FL",
    contact: "Dr. David Martinez",
    status: "Inactive",
    role: "Client",
    createdAt: "2024-01-20",
    avatarUrl: undefined,
  },
  {
    id: "9",
    name: "Neurology Institute",
    industry: "Healthcare",
    location: "Pensacola, FL",
    contact: "Dr. Jennifer Davis",
    status: "Active",
    role: "Client",
    createdAt: "2024-03-01",
    avatarUrl: undefined,
  },
  {
    id: "10",
    name: "Oncology Partners",
    industry: "Healthcare",
    location: "Sarasota, FL",
    contact: "Dr. Christopher Lee",
    status: "Active",
    role: "Client",
    createdAt: "2024-02-05",
    avatarUrl: undefined,
  },
  {
    id: "11",
    name: "Family Medicine Group",
    industry: "Healthcare",
    location: "Naples, FL",
    contact: "Dr. Amanda Foster",
    status: "Active",
    role: "Client",
    createdAt: "2024-01-30",
    avatarUrl: undefined,
  },
  {
    id: "12",
    name: "Emergency Care Center",
    industry: "Healthcare",
    location: "Fort Myers, FL",
    contact: "Dr. Steven Brown",
    status: "Active",
    role: "Prospect",
    createdAt: "2024-03-20",
    avatarUrl: undefined,
  },
  {
    id: "13",
    name: "Pediatric Associates",
    industry: "Healthcare",
    location: "Melbourne, FL",
    contact: "Dr. Rachel Green",
    status: "Inactive",
    role: "Client",
    createdAt: "2024-02-15",
    avatarUrl: undefined,
  },
  {
    id: "14",
    name: "Internal Medicine Clinic",
    industry: "Healthcare",
    location: "Daytona Beach, FL",
    contact: "Dr. Thomas Anderson",
    status: "Active",
    role: "Client",
    createdAt: "2024-01-25",
    avatarUrl: undefined,
  },
  {
    id: "15",
    name: "Surgery Center",
    industry: "Healthcare",
    location: "Clearwater, FL",
    contact: "Dr. Maria Garcia",
    status: "Active",
    role: "Client",
    createdAt: "2024-03-05",
    avatarUrl: undefined,
  },
  {
    id: "16",
    name: "Radiology Imaging",
    industry: "Healthcare",
    location: "St. Petersburg, FL",
    contact: "Dr. Kevin Johnson",
    status: "Active",
    role: "Client",
    createdAt: "2024-02-25",
    avatarUrl: undefined,
  },
  {
    id: "17",
    name: "Physical Therapy Plus",
    industry: "Healthcare",
    location: "Lakeland, FL",
    contact: "Dr. Nicole White",
    status: "Active",
    role: "Prospect",
    createdAt: "2024-01-10",
    avatarUrl: undefined,
  },
  {
    id: "18",
    name: "Dental Care Associates",
    industry: "Healthcare",
    location: "Winter Park, FL",
    contact: "Dr. Brian Taylor",
    status: "Inactive",
    role: "Client",
    createdAt: "2024-03-12",
    avatarUrl: undefined,
  },
  {
    id: "19",
    name: "Optometry Center",
    industry: "Healthcare",
    location: "Kissimmee, FL",
    contact: "Dr. Laura Hernandez",
    status: "Active",
    role: "Client",
    createdAt: "2024-02-08",
    avatarUrl: undefined,
  },
  {
    id: "20",
    name: "Mental Health Clinic",
    industry: "Healthcare",
    location: "Port St. Lucie, FL",
    contact: "Dr. Mark Thompson",
    status: "Active",
    role: "Client",
    createdAt: "2024-01-18",
    avatarUrl: undefined,
  },
  {
    id: "21",
    name: "Rehabilitation Center",
    industry: "Healthcare",
    location: "Cape Coral, FL",
    contact: "Dr. Sarah Williams",
    status: "Active",
    role: "Prospect",
    createdAt: "2024-03-08",
    avatarUrl: undefined,
  },
  {
    id: "22",
    name: "Urgent Care Express",
    industry: "Healthcare",
    location: "Palm Bay, FL",
    contact: "Dr. James Rodriguez",
    status: "Active",
    role: "Client",
    createdAt: "2024-02-22",
    avatarUrl: undefined,
  },
  {
    id: "23",
    name: "Women's Health Center",
    industry: "Healthcare",
    location: "Hollywood, FL",
    contact: "Dr. Michelle Clark",
    status: "Active",
    role: "Client",
    createdAt: "2024-01-12",
    avatarUrl: undefined,
  },
  {
    id: "24",
    name: "Sports Medicine Clinic",
    industry: "Healthcare",
    location: "Coral Springs, FL",
    contact: "Dr. Ryan Lewis",
    status: "Inactive",
    role: "Prospect",
    createdAt: "2024-03-18",
    avatarUrl: undefined,
  },
  {
    id: "25",
    name: "Geriatric Care Partners",
    industry: "Healthcare",
    location: "Boca Raton, FL",
    contact: "Dr. Diane Moore",
    status: "Active",
    role: "Client",
    createdAt: "2024-02-03",
    avatarUrl: undefined,
  },
];

// Unified status colors using globals.css variables
const statusColors = {
  'Client': 'bg-chart-2/10 text-chart-2',
  'Prospect': 'bg-chart-5/10 text-chart-5',
  'Active': 'bg-chart-4/10 text-chart-4',
  'Inactive': 'bg-destructive/10 text-destructive',
  'Healthcare': 'bg-chart-4/10 text-chart-4',
  'Technology': 'bg-chart-2/10 text-chart-2',
  'Finance': 'bg-chart-1/10 text-chart-1',
  'Education': 'bg-chart-3/10 text-chart-3',
  'Retail': 'bg-chart-5/10 text-chart-5',
};



// Custom AdvancedTable wrapper that supports additional actions
function ClientsAdvancedTable({ 
  data, 
  columns, 
  onViewDetails, 
  onDocSigned,
  onToggleStatus
}: {
  data: Client[];
  columns: { key: keyof Client; header: string; searchable?: boolean; type?: string; statusColors?: Record<string, string>; render?: (value: unknown, item: Client) => React.ReactNode }[];
  onViewDetails: (client: Client) => void;
  onDocSigned: (client: Client) => void;
  onToggleStatus: (client: Client) => void;
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  // Filter data
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const searchMatch = !search || columns.some(col => {
        if (!col.searchable) return false;
        const value = item[col.key];
        return String(value).toLowerCase().includes(search.toLowerCase());
      });

      const filterMatch = Object.entries(filterValues).every(([key, value]) => {
        if (!value) return true;
        const itemValue = item[key as keyof Client];
        if (typeof itemValue === 'string') {
          return itemValue.toLowerCase().includes(value.toLowerCase());
        }
        return String(itemValue) === value;
      });

      return searchMatch && filterMatch;
    });
  }, [data, search, filterValues, columns]);

  // Pagination
  const pageCount = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() =>
    filteredData.slice((page - 1) * pageSize, page * pageSize),
    [filteredData, page, pageSize]
  );

  return (
    <div className="flex flex-col w-full max-w-screen-xl mx-auto mb-8">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex flex-1 gap-2 items-center">
          <Input
            type="text"
            placeholder="Search by name, industry, or location..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full sm:w-64"
          />
          <Button
            variant="ghost"
            className="ml-2"
            onClick={() => {
              setSearch("");
              setFilterValues({});
              setPage(1);
            }}
            aria-label="Clear Filters"
          >
            Clear Filters
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select
            value={pageSize.toString()}
            onValueChange={v => {
              setPageSize(Number(v));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map(size => (
                <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="flex flex-col rounded-lg border bg-card p-4">
        <div className="hidden sm:block w-full">
          <Table className="w-full rounded-xl border-[var(--table-border)] shadow-md bg-white">
            <TableHeader className="bg-[var(--table-header-bg)] text-[var(--table-header-text)] font-bold sticky top-0 z-10 shadow-none">
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={String(column.key)}
                    className="px-6 py-4 text-base align-middle"
                  >
                    {column.header}
                  </TableHead>
                ))}
                <TableHead className="text-left px-6 py-4 text-base align-middle">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item) => (
                <TableRow key={item.id} className="border-b-[var(--table-border)] hover:bg-[var(--table-row-hover-bg)] rounded-lg">
                  {columns.map((column) => (
                    <TableCell
                      key={String(column.key)}
                      className={
                        column.type === "status"
                          ? "whitespace-nowrap px-6 py-4 text-base align-middle"
                          : "px-6 py-4 text-base align-middle break-words whitespace-normal"
                      }
                    >
                      {column.render ? column.render(item[column.key], item) : renderCellContent(column, item[column.key], item)}
                    </TableCell>
                  ))}
                  <TableCell className="py-4 text-left align-middle text-base px-6 whitespace-nowrap">
                    <TooltipProvider>
                      <div className="flex items-center gap-2 justify-start">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              className="bg-primary/10 text-primary rounded-full shadow-none hover:bg-primary/20"
                              onClick={() => onViewDetails(item)}
                            >
                              <Eye className="w-5 h-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View client details</p>
                          </TooltipContent>
                        </Tooltip>
                        {item.role === 'Prospect' && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="outline"
                                className="bg-chart-4/10 text-chart-4 border-chart-4/20 hover:bg-chart-4/20"
                                onClick={() => onDocSigned(item)}
                              >
                                <FileText className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Mark document as signed</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                        {item.status === 'Active' ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="outline"
                                className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20"
                                onClick={() => onToggleStatus(item)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Deactivate client</p>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="outline"
                                className="bg-chart-2/10 text-chart-2 border-chart-2/20 hover:bg-chart-2/20"
                                onClick={() => onToggleStatus(item)}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Activate client</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="text-center text-muted-foreground py-8 text-base px-6">
                    No clients found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="flex flex-col gap-3 sm:hidden">
          {paginatedData.map((item) => (
            <div key={item.id} className="rounded-lg border bg-background p-4 flex flex-col gap-2 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  {columns.slice(0, 2).map((column) => (
                    <div key={String(column.key)} className="font-semibold text-foreground leading-tight">
                      {column.render ? column.render(item[column.key], item) : renderCellContent(column, item[column.key], item)}
                    </div>
                  ))}
                </div>
                <TooltipProvider>
                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          size="icon" 
                          className="bg-primary/10 text-primary rounded-full shadow-none hover:bg-primary/20" 
                          onClick={() => onViewDetails(item)}
                        >
                          <Eye className="w-5 h-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View client details</p>
                      </TooltipContent>
                    </Tooltip>
                    {item.role === 'Prospect' && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="outline"
                            className="bg-chart-4/10 text-chart-4 border-chart-4/20 hover:bg-chart-4/20"
                            onClick={() => onDocSigned(item)}
                          >
                            <FileText className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Mark document as signed</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {item.status === 'Active' ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="outline"
                            className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20"
                            onClick={() => onToggleStatus(item)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Deactivate client</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="outline"
                            className="bg-chart-2/10 text-chart-2 border-chart-2/20 hover:bg-chart-2/20"
                            onClick={() => onToggleStatus(item)}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Activate client</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </TooltipProvider>
              </div>
            </div>
          ))}
          {paginatedData.length === 0 && (
            <div className="text-center text-muted-foreground py-8 text-base">No clients found.</div>
          )}
        </div>

        {/* Pagination */}
        {pageCount > 1 && (
          <div className="flex flex-wrap justify-between items-center mt-4 pt-2 border-t border-muted-foreground/10 gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <div className="flex gap-1">
              {Array.from({ length: pageCount }, (_, i) => (
                <Button
                  key={i+1}
                  size="sm"
                  variant={page === i+1 ? "default" : "outline"}
                  onClick={() => setPage(i+1)}
                  className="px-3"
                >
                  {i+1}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={page === pageCount || pageCount === 0}
              onClick={() => setPage(p => Math.min(pageCount, p + 1))}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to render cell content
const renderCellContent = (column: { key: keyof Client; header: string; searchable?: boolean; type?: string; statusColors?: Record<string, string>; render?: (value: unknown, item: Client) => React.ReactNode }, value: unknown, item: Client) => {
  switch (column.type) {
    case 'status':
      const statusColors = column.statusColors || {};
      const color = statusColors[String(value)] || "bg-muted text-muted-foreground";
      return (
        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 ${color}`}>
          {String(value)}
        </span>
      );
    case 'avatar':
      const avatarUrl = item.avatarUrl;
      return (
        <div className="flex items-center gap-3">
          <Avatar name={String(value)} src={avatarUrl} className="w-8 h-8" />
          <div className="font-semibold text-foreground leading-tight">
            {String(value)}
          </div>
        </div>
      );
    default:
      return (
        <div className="font-semibold text-foreground leading-tight">
          {String(value)}
        </div>
      );
  }
};

export default function ClientsPage() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedClient, setEditedClient] = useState<Client | null>(null);
  const [docSignedModal, setDocSignedModal] = useState<{ open: boolean; client: Client | null }>({ open: false, client: null });
  const [statusToggleModal, setStatusToggleModal] = useState<{ open: boolean; client: Client | null }>({ open: false, client: null });

  const handleViewProfile = (client: Client) => {
    setSelectedClient(client);
    setEditedClient(client);
    setIsEditing(false);
    setProfileOpen(true);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedClient) {
      // Here you would typically save to the backend
      setSelectedClient(editedClient);
      setIsEditing(false);
      alert('Client information updated successfully!');
    }
  };

  const handleCancel = () => {
    setEditedClient(selectedClient);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof Client, value: string | number | string[]) => {
    if (editedClient) {
      setEditedClient({
        ...editedClient,
        [field]: value
      });
    }
  };

  const handleToggleStatus = (client: Client) => {
    setStatusToggleModal({ open: true, client });
  };

  const handleConfirmStatusToggle = () => {
    if (statusToggleModal.client) {
      const client = statusToggleModal.client;
      const newStatus: "Active" | "Inactive" = client.status === "Active" ? "Inactive" : "Active";
      const updatedClient = { ...client, status: newStatus };
      
      // If the client is currently selected, update it as well
      if (selectedClient && selectedClient.id === client.id) {
        setSelectedClient(updatedClient);
        setEditedClient(updatedClient);
      }
      
      alert(`Client ${client.name} has been ${newStatus.toLowerCase()}`);
      setStatusToggleModal({ open: false, client: null });
    }
  };

  const handleDocSigned = (client: Client) => {
    setDocSignedModal({ open: true, client });
  };

  const handleConfirmDocSigned = () => {
    if (docSignedModal.client) {
      // Here you would typically update the client's role from Prospect to Client
      // and update the backend
      alert(`Document signed for ${docSignedModal.client.name}. Client role has been updated from Prospect to Client.`);
      setDocSignedModal({ open: false, client: null });
    }
  };

  // Define columns after the functions are defined
  const columns = [
    {
      key: 'name' as keyof Client,
      header: 'Company Name',
      sortable: true,
      searchable: true,
      type: 'avatar' as const,
    },
    {
      key: 'role' as keyof Client,
      header: 'Role',
      sortable: true,
      searchable: true,
      type: 'status' as const,
      statusColors,
    },
    {
      key: 'industry' as keyof Client,
      header: 'Industry',
      sortable: true,
      searchable: true,
      type: 'status' as const,
      statusColors,
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
      statusColors,
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <PageTitle title="All Clients" subtitle="Browse and manage all clients in the system" />
        
        <ClientsAdvancedTable
            data={clients}
            columns={columns}
          onViewDetails={handleViewProfile}
          onDocSigned={handleDocSigned}
          onToggleStatus={handleToggleStatus}
        />

        {/* Client Profile Sheet (lateral) */}
        <Sheet open={profileOpen} onOpenChange={setProfileOpen}>
          <SheetContent side="right" className="w-[40vw] min-w-[400px] max-w-[48rem] p-0">
            {selectedClient && (
              <div className="relative h-full flex flex-col">
                <div className="sticky top-0 z-10 bg-background px-6 pt-6 pb-4 shadow-sm border-b flex items-center justify-between gap-2">
                  <div className="flex items-center gap-4">
                    <Avatar name={selectedClient.name} src={selectedClient.avatarUrl} className="w-14 h-14 text-2xl" />
                    <div>
                      <h2 className="text-2xl font-bold">{selectedClient.name}</h2>
                      <div className="text-lg text-muted-foreground font-medium">{selectedClient.industry}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <>
                        <Button className="gap-2" variant="default" onClick={handleSave}>
                          Save
                        </Button>
                        <Button className="gap-2" variant="outline" onClick={handleCancel}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button className="gap-2" variant="outline" onClick={handleEdit}>
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                      </>
                    )}
                    <Button size="icon" variant="ghost" aria-label="Close" onClick={() => setProfileOpen(false)} className="mt-1">
                      <X className="w-6 h-6" />
                    </Button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2">
                  <div className="flex flex-col md:flex-row md:items-center md:gap-6 mb-2">
                    {/* Info principal */}
                    <div className="flex-1 flex flex-col items-center md:items-start gap-2 mt-4 md:mt-0">
                      <div className="text-muted-foreground text-lg text-center md:text-left">{selectedClient.industry}</div>
                      <div className="mt-1 flex flex-wrap gap-2 text-sm justify-center md:justify-start">
                        <Badge variant="outline">{selectedClient.status}</Badge>
                        <Badge variant="secondary">{selectedClient.location}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                      <div className="mb-2 font-semibold text-foreground">Contact Information</div>
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          {isEditing ? (
                            <Input
                              value={editedClient?.email || ""}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              placeholder="Enter email"
                              className="flex-1"
                            />
                          ) : (
                            <span className="text-sm">{selectedClient.email || "No email provided"}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          {isEditing ? (
                            <Input
                              value={editedClient?.phone || ""}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              placeholder="Enter phone"
                              className="flex-1"
                            />
                          ) : (
                            <span className="text-sm">{selectedClient.phone || "No phone provided"}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <Globe className="w-4 h-4 text-muted-foreground" />
                          {isEditing ? (
                            <Input
                              value={editedClient?.website || ""}
                              onChange={(e) => handleInputChange('website', e.target.value)}
                              placeholder="Enter website"
                              className="flex-1"
                            />
                          ) : (
                            <span className="text-sm">{selectedClient.website || "No website provided"}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          {isEditing ? (
                            <Input
                              value={editedClient?.location || ""}
                              onChange={(e) => handleInputChange('location', e.target.value)}
                              placeholder="Enter location"
                              className="flex-1"
                            />
                          ) : (
                            <span className="text-sm">{selectedClient.location}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-2 font-semibold text-foreground">About</div>
                      {isEditing ? (
                        <Textarea
                          value={editedClient?.description || ""}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          placeholder="Enter company description"
                          className="mb-4"
                          rows={3}
                        />
                      ) : (
                        <div className="text-sm text-muted-foreground mb-4">
                          {selectedClient.description || "No description provided"}
                        </div>
                      )}
                    </div>
                  </div>
                  <Tabs defaultValue="organization" className="w-full">
                    <TabsList className="mb-2">
                      <TabsTrigger value="organization">Organization</TabsTrigger>
                      <TabsTrigger value="services">Services</TabsTrigger>
                    </TabsList>
                    <TabsContent value="organization">
                      <div className="flex flex-col gap-4">
                        <Card className="p-3 flex flex-col gap-1">
                          <div className="font-semibold">Company Details</div>
                          <div className="text-sm text-muted-foreground space-y-2">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              {isEditing ? (
                                <Input
                                  type="number"
                                  value={editedClient?.employees || ""}
                                  onChange={(e) => handleInputChange('employees', parseInt(e.target.value) || 0)}
                                  placeholder="Number of employees"
                                  className="flex-1"
                                />
                              ) : (
                                <span>{selectedClient.employees || "Unknown"} employees</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {isEditing ? (
                                <Input
                                  value={editedClient?.founded || ""}
                                  onChange={(e) => handleInputChange('founded', e.target.value)}
                                  placeholder="Founded year"
                                  className="flex-1"
                                />
                              ) : (
                                <span>Founded: {selectedClient.founded || "Unknown"}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Building className="w-4 h-4" />
                              {isEditing ? (
                                <Input
                                  value={editedClient?.industry || ""}
                                  onChange={(e) => handleInputChange('industry', e.target.value)}
                                  placeholder="Industry"
                                  className="flex-1"
                                />
                              ) : (
                                <span>Industry: {selectedClient.industry}</span>
                              )}
                            </div>
                          </div>
                        </Card>
                        {selectedClient.specialties && selectedClient.specialties.length > 0 && (
                          <Card className="p-3 flex flex-col gap-1">
                            <div className="font-semibold">Specialties</div>
                            <div className="flex flex-wrap gap-2">
                              {selectedClient.specialties.map((specialty) => (
                                <Badge key={specialty} variant="secondary">{specialty}</Badge>
                              ))}
                            </div>
                          </Card>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="services">
                      <div className="flex flex-col gap-2">
                        {selectedClient.services && selectedClient.services.length > 0 ? (
                          selectedClient.services.map((service, idx) => (
                            <Card key={idx} className="p-3 flex flex-col gap-1">
                              <div className="font-semibold">{service}</div>
      </Card>
                          ))
                        ) : (
                          <div className="text-center text-muted-foreground py-8">
                            No services information available
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>

        {/* Document Signed Confirmation Modal */}
        <Dialog open={docSignedModal.open} onOpenChange={(open) => setDocSignedModal({ open, client: open ? docSignedModal.client : null })}>
          <DialogContent className="max-w-md">
            <DialogTitle>Confirm Document Signed</DialogTitle>
            <DialogDescription className="space-y-3">
              <p>
                Are you sure you want to mark the document as signed for <strong>{docSignedModal.client?.name}</strong>?
              </p>
              <p className="text-sm text-muted-foreground">
                This action will change the client's role from <strong>Prospect</strong> to <strong>Client</strong> and grant them full access to the platform.
              </p>
            </DialogDescription>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDocSignedModal({ open: false, client: null })}>
                Cancel
              </Button>
              <Button onClick={handleConfirmDocSigned}>
                Confirm Role Change
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Status Toggle Confirmation Modal */}
        <Dialog open={statusToggleModal.open} onOpenChange={(open) => setStatusToggleModal({ open, client: open ? statusToggleModal.client : null })}>
          <DialogContent className="max-w-md">
            <DialogTitle>
              {statusToggleModal.client?.status === "Active" ? "Confirm Deactivation" : "Confirm Activation"}
            </DialogTitle>
            <DialogDescription className="space-y-3">
              <p>
                Are you sure you want to {statusToggleModal.client?.status === "Active" ? "deactivate" : "activate"} <strong>{statusToggleModal.client?.name}</strong>?
              </p>
              <p className="text-sm text-muted-foreground">
                {statusToggleModal.client?.status === "Active" 
                  ? "This will suspend the client's access to the platform and hide them from active client lists."
                  : "This will restore the client's access to the platform and make them visible in active client lists."
                }
              </p>
            </DialogDescription>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStatusToggleModal({ open: false, client: null })}>
                Cancel
              </Button>
              <Button 
                variant={statusToggleModal.client?.status === "Active" ? "destructive" : "default"}
                onClick={handleConfirmStatusToggle}
              >
                {statusToggleModal.client?.status === "Active" ? "Deactivate Client" : "Activate Client"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 