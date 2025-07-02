import React from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, CheckCircle, AlertCircle, CheckSquare, XCircle } from "lucide-react";

// Unified Hire Request Status Type
export type HireRequestStatus = 
  | "Pending Signature"
  | "New" 
  | "Sourcing"
  | "Panel Ready"
  | "Interview Scheduled"
  | "Awaiting Decision"
  | "Placement Complete"
  | "Canceled";

interface StatusBadgeProps {
  status: HireRequestStatus;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const statusConfig: Record<HireRequestStatus, {
  color: string;
  icon: React.ReactNode;
  description: string;
}> = {
  "Pending Signature": {
    color: "bg-chart-5 text-primary-foreground border-transparent",
    icon: <Clock className="w-4 h-4" />,
    description: "Waiting for client to sign service agreement"
  },
  "New": {
    color: "bg-muted-foreground text-primary-foreground border-transparent",
    icon: <Clock className="w-4 h-4" />,
    description: "Client just submitted the request"
  },
  "Sourcing": {
    color: "bg-primary text-primary-foreground border-transparent",
    icon: <Users className="w-4 h-4" />,
    description: "Searching for candidates in the pool"
  },
  "Panel Ready": {
    color: "bg-chart-3 text-primary-foreground border-transparent",
    icon: <CheckCircle className="w-4 h-4" />,
    description: "Candidates selected and ready for review"
  },
  "Interview Scheduled": {
    color: "bg-chart-5 text-primary-foreground border-transparent",
    icon: <Clock className="w-4 h-4" />,
    description: "Interview scheduled with client"
  },
  "Awaiting Decision": {
    color: "bg-chart-4 text-primary-foreground border-transparent",
    icon: <AlertCircle className="w-4 h-4" />,
    description: "Waiting for client decision"
  },
  "Placement Complete": {
    color: "bg-chart-2 text-primary-foreground border-transparent",
    icon: <CheckSquare className="w-4 h-4" />,
    description: "Hiring completed successfully"
  },
  "Canceled": {
    color: "bg-destructive text-primary-foreground border-transparent",
    icon: <XCircle className="w-4 h-4" />,
    description: "Request canceled"
  }
};

const sizeClasses = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-3 py-1",
  lg: "text-base px-4 py-2"
};

export function StatusBadge({ 
  status, 
  showIcon = true, 
  size = 'md',
  className = "" 
}: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge 
      className={`${config.color} ${sizeClasses[size]} ${className}`}
      title={config.description}
    >
      {showIcon && (
        <span className="mr-1">
          {config.icon}
        </span>
      )}
      {status}
    </Badge>
  );
} 