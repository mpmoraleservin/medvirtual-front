"use client"

import React, { useState, useMemo, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { 
  Eye, 
  Filter, 
  Calendar, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle, 
  X,
  MessageSquare,
  AlertTriangle,
  FileText
} from "lucide-react"
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Avatar } from "@/components/ui/avatar"
import { AdvancedTable, TableColumn } from '@/components/ui/advanced-table'

// --- TypeScript interfaces ---
interface Ticket {
  id: string
  clientName: string
  type: "Bonus" | "Termination" | "Interview Request"
  subject: string
  dateRaised: string
  status: "New" | "In Review" | "In Progress" | "Awaiting Response" | "Resolved" | "Closed"
  description: string
  priority: "Low" | "Medium" | "High"
  assignedTo?: string
  lastUpdated: string
  attachments?: string[]
  staffName?: string
  candidateName?: string
  department?: string
  location?: string
  requestedBy?: string
  estimatedResolution?: string
  category?: string
}

// --- Mock Data ---
const mockTickets: Ticket[] = [
  {
    id: "TKT-001",
    clientName: "Dr. Sarah Johnson",
    type: "Bonus",
    subject: "Maria Rodriguez - Performance Bonus Request",
    dateRaised: "2024-06-01",
    status: "New",
    description: "Request for performance bonus for Maria Rodriguez who has exceeded all KPIs for the past 3 months. She has maintained 98% patient satisfaction and completed 120% of her assigned tasks.",
    priority: "Medium",
    lastUpdated: "2024-06-01 14:30",
    attachments: ["performance_report.pdf", "kpi_summary.xlsx"],
    staffName: "Maria Rodriguez",
    department: "Nursing",
    location: "Miami, FL",
    requestedBy: "Dr. Sarah Johnson",
    estimatedResolution: "3-5 business days",
    category: "Performance"
  },
  {
    id: "TKT-002",
    clientName: "Wellness Medical Center",
    type: "Termination",
    subject: "James Wilson - Termination Request",
    dateRaised: "2024-05-31",
    status: "In Review",
    description: "Request to terminate James Wilson due to repeated policy violations and poor performance. Multiple warnings have been issued over the past 2 months with no improvement.",
    priority: "High",
    assignedTo: "HR Manager",
    lastUpdated: "2024-06-01 09:15",
    attachments: ["disciplinary_actions.pdf", "performance_reviews.pdf"],
    staffName: "James Wilson",
    department: "Medical",
    location: "Orlando, FL",
    requestedBy: "Wellness Medical Center",
    estimatedResolution: "1-2 business days",
    category: "Disciplinary"
  },
  {
    id: "TKT-003",
    clientName: "Dr. Michael Chen",
    type: "Interview Request",
    subject: "Emily Davis - Interview Request",
    dateRaised: "2024-05-30",
    status: "Resolved",
    description: "Request to interview Emily Davis for the Nurse Practitioner position. She has excellent qualifications and references. Interview scheduled for June 5th.",
    priority: "Medium",
    assignedTo: "Recruitment Team",
    lastUpdated: "2024-05-31 16:45",
    attachments: ["resume.pdf", "reference_letters.pdf"],
    candidateName: "Emily Davis",
    department: "Recruitment",
    location: "Tampa, FL",
    requestedBy: "Dr. Michael Chen",
    estimatedResolution: "Completed",
    category: "Recruitment"
  },
  {
    id: "TKT-004",
    clientName: "Community Health Clinic",
    type: "Bonus",
    subject: "David Thompson - Annual Bonus Request",
    dateRaised: "2024-05-29",
    status: "In Progress",
    description: "Annual bonus request for David Thompson who has been with the clinic for 2 years and consistently performs above expectations.",
    priority: "Low",
    lastUpdated: "2024-05-29 11:20",
    staffName: "David Thompson",
    department: "Administration",
    location: "Jacksonville, FL",
    requestedBy: "Community Health Clinic",
    estimatedResolution: "5-7 business days",
    category: "Compensation"
  },
  {
    id: "TKT-005",
    clientName: "Dr. Emily Rodriguez",
    type: "Interview Request",
    subject: "Sarah Martinez - Interview Request",
    dateRaised: "2024-05-28",
    status: "Awaiting Response",
    description: "Request to interview Sarah Martinez for the Medical Assistant position. She has relevant experience and good communication skills.",
    priority: "Medium",
    assignedTo: "Recruitment Team",
    lastUpdated: "2024-05-30 13:10",
    attachments: ["resume.pdf"],
    candidateName: "Sarah Martinez",
    department: "Recruitment",
    location: "Fort Lauderdale, FL",
    requestedBy: "Dr. Emily Rodriguez",
    estimatedResolution: "2-3 business days",
    category: "Recruitment"
  },
  {
    id: "TKT-006",
    clientName: "Metro Medical Group",
    type: "Termination",
    subject: "Lisa Anderson - Termination Request",
    dateRaised: "2024-05-27",
    status: "Closed",
    description: "Termination request for Lisa Anderson due to attendance issues and failure to meet performance standards despite multiple coaching sessions.",
    priority: "High",
    assignedTo: "HR Manager",
    lastUpdated: "2024-05-28 15:30",
    attachments: ["attendance_records.pdf", "coaching_notes.pdf"],
    staffName: "Lisa Anderson",
    department: "Reception",
    location: "Miami, FL",
    requestedBy: "Metro Medical Group",
    estimatedResolution: "Completed",
    category: "Disciplinary"
  },
  {
    id: "TKT-007",
    clientName: "Dr. Robert Kim",
    type: "Interview Request",
    subject: "Michael Brown - Interview Request",
    dateRaised: "2024-05-26",
    status: "New",
    description: "Request to interview Michael Brown for the Lab Technician position. He has strong technical skills and relevant certifications.",
    priority: "Medium",
    lastUpdated: "2024-05-26 10:45",
    attachments: ["resume.pdf", "certifications.pdf"],
    candidateName: "Michael Brown",
    department: "Laboratory",
    location: "Orlando, FL",
    requestedBy: "Dr. Robert Kim",
    estimatedResolution: "3-4 business days",
    category: "Recruitment"
  },
  {
    id: "TKT-008",
    clientName: "Family Care Associates",
    type: "Bonus",
    subject: "Jennifer Lee - Performance Bonus Request",
    dateRaised: "2024-05-25",
    status: "In Review",
    description: "Performance bonus request for Jennifer Lee who has consistently exceeded expectations in patient care and team collaboration.",
    priority: "Medium",
    assignedTo: "HR Manager",
    lastUpdated: "2024-05-26 14:20",
    staffName: "Jennifer Lee",
    department: "Nursing",
    location: "Tampa, FL",
    requestedBy: "Family Care Associates",
    estimatedResolution: "4-6 business days",
    category: "Performance"
  },
  {
    id: "TKT-009",
    clientName: "Pediatric Specialists",
    type: "Termination",
    subject: "Robert Garcia - Termination Request",
    dateRaised: "2024-05-24",
    status: "In Progress",
    description: "Termination request for Robert Garcia due to repeated safety violations and failure to follow protocols.",
    priority: "High",
    assignedTo: "HR Manager",
    lastUpdated: "2024-05-25 09:30",
    attachments: ["safety_violations.pdf", "protocol_breaches.pdf"],
    staffName: "Robert Garcia",
    department: "Medical",
    location: "Jacksonville, FL",
    requestedBy: "Pediatric Specialists",
    estimatedResolution: "1-2 business days",
    category: "Safety"
  },
  {
    id: "TKT-010",
    clientName: "Dr. Patricia Wilson",
    type: "Interview Request",
    subject: "Alex Johnson - Interview Request",
    dateRaised: "2024-05-23",
    status: "Resolved",
    description: "Request to interview Alex Johnson for the Physician Assistant position. Excellent clinical experience and strong references.",
    priority: "Medium",
    assignedTo: "Recruitment Team",
    lastUpdated: "2024-05-24 16:45",
    attachments: ["resume.pdf", "clinical_references.pdf"],
    candidateName: "Alex Johnson",
    department: "Medical",
    location: "Fort Lauderdale, FL",
    requestedBy: "Dr. Patricia Wilson",
    estimatedResolution: "Completed",
    category: "Recruitment"
  }
]

// --- Status Configuration ---
const statusConfig = {
  "New": { label: "New", color: "bg-gray-500 text-white", count: 0, description: "Ticket just created" },
  "In Review": { label: "In Review", color: "bg-blue-500 text-white", count: 0, description: "Under review by the team" },
  "In Progress": { label: "In Progress", color: "bg-yellow-500 text-white", count: 0, description: "Working on the solution" },
  "Awaiting Response": { label: "Awaiting Response", color: "bg-purple-500 text-white", count: 0, description: "Waiting for client response" },
  "Resolved": { label: "Resolved", color: "bg-green-500 text-white", count: 0, description: "Ticket resolved" },
  "Closed": { label: "Closed", color: "bg-red-500 text-white", count: 0, description: "Ticket closed" },
}

const typeConfig = {
  "Bonus": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Termination": "bg-red-100 text-red-800 border-red-200",
  "Interview Request": "bg-blue-100 text-blue-800 border-blue-200"
}

const priorityColors = {
  "High": "bg-red-100 text-red-700 border-red-200",
  "Medium": "bg-yellow-100 text-yellow-700 border-yellow-200",
  "Low": "bg-green-100 text-green-700 border-green-200",
}

const allStatuses = [
  "New",
  "In Review", 
  "In Progress",
  "Awaiting Response",
  "Resolved",
  "Closed"
]

// Columns for ticket details tables
const ticketHistoryColumns: TableColumn<{ id: string; date: string; action: string; user: string; details: string }>[] = [
  { key: 'date', header: 'Date', type: 'text' },
  { key: 'action', header: 'Action', type: 'text' },
  { key: 'user', header: 'User', type: 'text' },
  { key: 'details', header: 'Details', type: 'text' },
]

export default function TicketsWorkflow() {
  const [search, setSearch] = useState("")
  const [assignedFilter, setAssignedFilter] = useState("All")
  const [priorityFilter, setPriorityFilter] = useState("All")
  const [typeFilter, setTypeFilter] = useState("All")
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('ticketsVisibleColumns')
      if (stored) {
        try {
          return JSON.parse(stored)
        } catch {}
      }
    }
    return allStatuses
  })
  const [showColumnDialog, setShowColumnDialog] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('ticketsVisibleColumns', JSON.stringify(visibleColumns))
    }
  }, [visibleColumns])

  // Filter and group tickets by status
  const groupedTickets = useMemo(() => {
    const filtered = tickets.filter(ticket => {
      const matchesSearch = 
        ticket.id.toLowerCase().includes(search.toLowerCase()) ||
        ticket.clientName.toLowerCase().includes(search.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(search.toLowerCase())
      const matchesAssigned = assignedFilter === "All" || ticket.assignedTo === assignedFilter
      const matchesPriority = priorityFilter === "All" || ticket.priority === priorityFilter
      const matchesType = typeFilter === "All" || ticket.type === typeFilter
      return matchesSearch && matchesAssigned && matchesPriority && matchesType
    })
    const grouped: Record<string, Ticket[]> = {
      "New": [],
      "In Review": [],
      "In Progress": [],
      "Awaiting Response": [],
      "Resolved": [],
      "Closed": [],
    }
    filtered.forEach(t => grouped[t.status].push(t))
    Object.keys(statusConfig).forEach(status => {
      statusConfig[status as keyof typeof statusConfig].count = grouped[status as keyof typeof grouped].length
    })
    return grouped
  }, [tickets, search, assignedFilter, priorityFilter, typeFilter])

  const statusOrder = [
    "New",
    "In Review",
    "In Progress", 
    "Awaiting Response",
    "Resolved",
    "Closed"
  ]

  function onDragEnd(result: DropResult) {
    const { source, destination, draggableId } = result
    if (!destination) return
    const sourceStatus = source.droppableId
    const destStatus = destination.droppableId
    if (sourceStatus === destStatus && source.index === destination.index) return

    setTickets(prev => {
      // Find the dragged ticket
      const dragged = prev.find(t => t.id === draggableId)
      if (!dragged) return prev
      // Remove from old position
      const newList = prev.filter(t => t.id !== draggableId)
      // Update status
      const updated = { ...dragged, status: destStatus as Ticket["status"] }
      // Find the index to insert in destination
      const destTickets = newList.filter(t => t.status === destStatus)
      const before = newList.filter(t => t.status !== destStatus)
      destTickets.splice(destination.index, 0, updated)
      return [
        ...before,
        ...destTickets
      ]
    })
  }

  const getDaysSinceSubmitted = (dateSubmitted: string) => {
    const submitted = new Date(dateSubmitted)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - submitted.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getStatusIcon = (status: Ticket["status"]) => {
    switch (status) {
      case "New":
        return <FileText className="w-4 h-4" />
      case "In Review":
        return <Eye className="w-4 h-4" />
      case "In Progress":
        return <Clock className="w-4 h-4" />
      case "Awaiting Response":
        return <MessageSquare className="w-4 h-4" />
      case "Resolved":
        return <CheckCircle className="w-4 h-4" />
      case "Closed":
        return <XCircle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getTypeIcon = (type: Ticket["type"]) => {
    switch (type) {
      case "Bonus":
        return <CheckCircle className="w-3 h-3" />
      case "Termination":
        return <AlertTriangle className="w-3 h-3" />
      case "Interview Request":
        return <User className="w-3 h-3" />
      default:
        return <FileText className="w-3 h-3" />
    }
  }

  function handleToggleColumn(status: string) {
    setVisibleColumns((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">Support Tickets</h1>
            <Button variant="ghost" size="icon" onClick={() => setShowColumnDialog(true)} title="Show/Hide Columns" aria-label="Show/Hide Columns">
              <Filter className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-muted-foreground mb-6">Manage and review all client support tickets</p>
          
          {/* Column Visibility Dialog */}
          <Dialog open={showColumnDialog} onOpenChange={setShowColumnDialog}>
            <DialogContent className="max-w-xs w-full">
              <DialogTitle className="sr-only">Show/Hide Columns</DialogTitle>
              <div className="flex flex-col gap-2">
                {allStatuses.map(status => (
                  <label key={status} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={visibleColumns.includes(status)}
                      onChange={() => handleToggleColumn(status)}
                    />
                    <span>{statusConfig[status as keyof typeof statusConfig].label}</span>
                  </label>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Input
              placeholder="Search by ID, client, or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sm:w-64"
            />
            <Select value={assignedFilter} onValueChange={setAssignedFilter}>
              <SelectTrigger className="sm:w-48">
                <SelectValue placeholder="Filter by assigned" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Assigned</SelectItem>
                <SelectItem value="HR Manager">HR Manager</SelectItem>
                <SelectItem value="Recruitment Team">Recruitment Team</SelectItem>
                <SelectItem value="Admin Team">Admin Team</SelectItem>
                <SelectItem value="Unassigned">Unassigned</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="sm:w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Priorities</SelectItem>
                <SelectItem value="High">High Priority</SelectItem>
                <SelectItem value="Medium">Medium Priority</SelectItem>
                <SelectItem value="Low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Types</SelectItem>
                <SelectItem value="Bonus">Bonus</SelectItem>
                <SelectItem value="Termination">Termination</SelectItem>
                <SelectItem value="Interview Request">Interview Request</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Workflow Board - horizontal scroll */}
        <div className="overflow-x-auto pb-4 mb-8">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex flex-row gap-4 min-w-[1200px]">
              {statusOrder.filter(status => visibleColumns.includes(status)).map((status) => (
                <Droppable droppableId={status} key={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex flex-col min-w-[320px] w-[320px] rounded-xl bg-[#F6F8FA] px-2 py-3 ${snapshot.isDraggingOver ? 'ring-2 ring-blue-400' : ''}`}
                    >
                      {/* Column Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Badge className={statusConfig[status as keyof typeof statusConfig].color}>
                            {getStatusIcon(status as Ticket["status"])}
                            {statusConfig[status as keyof typeof statusConfig].label}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            ({statusConfig[status as keyof typeof statusConfig].count})
                          </span>
                        </div>
                      </div>
                      
                      {/* Column Content */}
                      <div className="flex flex-col gap-3">
                        {groupedTickets[status].map((ticket, idx) => (
                          <Draggable draggableId={ticket.id} index={idx} key={ticket.id}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`mb-0 ${snapshot.isDragging ? 'opacity-80' : ''}`}
                              >
                                <Card className="p-4 flex flex-col gap-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                  {/* Header with view button on top right */}
                                  <div className="flex items-start justify-between mb-1">
                                    <div className="flex flex-col gap-0.5">
                                      <span className="font-semibold text-base text-foreground line-clamp-1">{ticket.clientName}</span>
                                      <span className="text-xs text-muted-foreground">{ticket.subject}</span>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        title="View"
                                        aria-label="View"
                                        className="hover:bg-blue-100"
                                        onClick={() => { setSelectedTicket(ticket); setModalOpen(true); }}
                                      >
                                        <Eye className="w-5 h-5" />
                                      </Button>
                                      <Badge variant="outline" className={`text-xs px-2 py-0.5 ${priorityColors[ticket.priority]}`}>
                                        {ticket.priority}
                                      </Badge>
                                    </div>
                                  </div>
                                  
                                  {/* Type Badge */}
                                  <div className="flex items-center gap-1">
                                    <Badge className={`text-xs px-2 py-0.5 ${typeConfig[ticket.type]}`}>
                                      {getTypeIcon(ticket.type)}
                                      {ticket.type}
                                    </Badge>
                                  </div>
                                  
                                  {/* Details */}
                                  <div className="flex flex-col gap-1 text-xs text-muted-foreground mb-1">
                                    <div className="flex items-center gap-1">
                                      <User className="w-3 h-3" />
                                      <span>{ticket.assignedTo || "Unassigned"}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      <span>{formatDate(ticket.dateRaised)}</span>
                                      <span className="text-orange-600">({getDaysSinceSubmitted(ticket.dateRaised)}d ago)</span>
                                    </div>
                                    {ticket.attachments && ticket.attachments.length > 0 && (
                                      <div className="flex items-center gap-1">
                                        <span className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px]">
                                          {ticket.attachments.length}
                                        </span>
                                        <span>attachments</span>
                                      </div>
                                    )}
                                  </div>
                                </Card>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        {groupedTickets[status].length === 0 && (
                          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm border-2 border-dashed border-muted-foreground/30 rounded-lg">
                            No tickets
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>

      {/* View Details Sheet */}
      {selectedTicket && (
        <Sheet open={modalOpen} onOpenChange={setModalOpen}>
          <SheetContent side="right" className="w-[40vw] min-w-[400px] max-w-[48rem] p-0">
            {selectedTicket && (
              <div className="relative h-full flex flex-col">
                <div className="sticky top-0 z-10 bg-white px-6 pt-6 pb-4 shadow-sm border-b flex items-center justify-between gap-2">
                  <div className="flex items-center gap-4">
                    <Avatar name={selectedTicket.clientName} className="w-14 h-14 text-2xl" />
                    <div>
                      <h2 className="text-2xl font-bold">{selectedTicket.clientName}</h2>
                      <div className="text-lg text-muted-foreground font-medium">{selectedTicket.subject}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={typeConfig[selectedTicket.type]}>
                      {getTypeIcon(selectedTicket.type)}
                      {selectedTicket.type}
                    </Badge>
                    <Button size="icon" variant="ghost" aria-label="Close" onClick={() => setModalOpen(false)} className="mt-1">
                      <X className="w-6 h-6" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
                    {/* Client */}
                    <div>
                      <div className="font-semibold text-sm text-[#222] mb-1">Client</div>
                      <div className="font-normal text-base text-muted-foreground">{selectedTicket.clientName}</div>
                    </div>
                    {/* Ticket ID */}
                    <div>
                      <div className="font-semibold text-sm text-[#222] mb-1">Ticket ID</div>
                      <div className="font-normal text-base text-muted-foreground">{selectedTicket.id}</div>
                    </div>
                    {/* Type */}
                    <div>
                      <div className="font-semibold text-sm text-[#222] mb-1">Type</div>
                      <Badge className={typeConfig[selectedTicket.type]}>
                        {getTypeIcon(selectedTicket.type)}
                        {selectedTicket.type}
                      </Badge>
                    </div>
                    {/* Priority */}
                    <div>
                      <div className="font-semibold text-sm text-[#222] mb-1">Priority</div>
                      <Badge className={priorityColors[selectedTicket.priority]}>
                        {selectedTicket.priority}
                      </Badge>
                    </div>
                    {/* Status */}
                    <div>
                      <div className="font-semibold text-sm text-[#222] mb-1">Status</div>
                      <Badge className={statusConfig[selectedTicket.status].color}>
                        {selectedTicket.status}
                      </Badge>
                    </div>
                    {/* Assigned To */}
                    <div>
                      <div className="font-semibold text-sm text-[#222] mb-1">Assigned To</div>
                      <div className="font-normal text-base text-muted-foreground">
                        {selectedTicket.assignedTo || "Unassigned"}
                      </div>
                    </div>
                    {/* Date Raised */}
                    <div>
                      <div className="font-semibold text-sm text-[#222] mb-1">Date Raised</div>
                      <div className="font-normal text-base text-muted-foreground">
                        {formatDate(selectedTicket.dateRaised)}
                      </div>
                    </div>
                    {/* Last Updated */}
                    <div>
                      <div className="font-semibold text-sm text-[#222] mb-1">Last Updated</div>
                      <div className="font-normal text-base text-muted-foreground">
                        {selectedTicket.lastUpdated}
                      </div>
                    </div>
                    {/* Department */}
                    {selectedTicket.department && (
                      <div>
                        <div className="font-semibold text-sm text-[#222] mb-1">Department</div>
                        <div className="font-normal text-base text-muted-foreground">{selectedTicket.department}</div>
                      </div>
                    )}
                    {/* Location */}
                    {selectedTicket.location && (
                      <div>
                        <div className="font-semibold text-sm text-[#222] mb-1">Location</div>
                        <div className="font-normal text-base text-muted-foreground">{selectedTicket.location}</div>
                      </div>
                    )}
                    {/* Staff/Candidate Name */}
                    {(selectedTicket.staffName || selectedTicket.candidateName) && (
                      <div>
                        <div className="font-semibold text-sm text-[#222] mb-1">
                          {selectedTicket.type === "Interview Request" ? "Candidate" : "Staff Member"}
                        </div>
                        <div className="font-normal text-base text-muted-foreground">
                          {selectedTicket.staffName || selectedTicket.candidateName}
                        </div>
                      </div>
                    )}
                    {/* Category */}
                    {selectedTicket.category && (
                      <div>
                        <div className="font-semibold text-sm text-[#222] mb-1">Category</div>
                        <div className="font-normal text-base text-muted-foreground">{selectedTicket.category}</div>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <div className="font-semibold text-sm text-[#222] mb-2">Description</div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">{selectedTicket.description}</p>
                    </div>
                  </div>

                  {/* Tabs for Attachments and History */}
                  <Tabs defaultValue="attachments" className="w-full">
                    <TabsList className="w-full grid grid-cols-2">
                      <TabsTrigger value="attachments" className="w-full">Attachments</TabsTrigger>
                      <TabsTrigger value="history" className="w-full">History</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="attachments">
                      {selectedTicket.attachments && selectedTicket.attachments.length > 0 ? (
                        <div className="space-y-2 mt-4">
                          {selectedTicket.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <FileText className="w-4 h-4 text-gray-500" />
                                <span className="text-sm font-medium">{attachment}</span>
                              </div>
                              <Button variant="outline" size="sm">Download</Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No attachments available
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="history">
                      <div className="mt-4">
                        <AdvancedTable
                          data={[
                            {
                              id: '1',
                              date: selectedTicket.dateRaised,
                              action: "Ticket Created",
                              user: selectedTicket.requestedBy || "System",
                              details: "Initial ticket submission"
                            },
                            {
                              id: '2',
                              date: selectedTicket.lastUpdated,
                              action: "Status Updated",
                              user: selectedTicket.assignedTo || "System",
                              details: `Status changed to ${selectedTicket.status}`
                            }
                          ]}
                          columns={ticketHistoryColumns}
                          title={undefined}
                          statusKey={undefined}
                          showPagination={false}
                          showSearch={false}
                          showFilters={false}
                          showPageSize={false}
                          emptyMessage="No history available."
                          className="mt-4"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="font-semibold text-sm text-[#222] mb-3">Actions</div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">
                        Assign to Team
                      </Button>
                      <Button variant="outline" size="sm">
                        Update Status
                      </Button>
                      <Button variant="outline" size="sm">
                        Add Comment
                      </Button>
                      {selectedTicket.status !== "Resolved" && selectedTicket.status !== "Closed" && (
                        <Button size="sm">
                          Mark as Resolved
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
} 