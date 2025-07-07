"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Eye, DollarSign, XCircle } from "lucide-react";

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
  recentActivity?: string;
}

interface StaffCardProps {
  member: HiredStaffMember;
  onView?: (member: HiredStaffMember) => void;
  onBonus?: (member: HiredStaffMember) => void;
  onTerminate?: (member: HiredStaffMember) => void;
  variant?: 'default' | 'compact';
  showActions?: boolean;
  className?: string;
}

export function StaffCard({
  member,
  onView,
  onBonus,
  onTerminate,
  variant = 'default',
  showActions = true,
  className = ""
}: StaffCardProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (variant === 'compact') {
    return (
      <Card className={`p-4 hover:shadow-md transition-shadow ${className}`}>
        <div className="flex items-center gap-3">
          <Avatar name={member.name} className="h-10 w-10" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{member.name}</h3>
            <p className="text-xs text-muted-foreground truncate">{member.role}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold">{formatCurrency(member.billRate, member.currency)}</p>
            <p className="text-xs text-muted-foreground">/mo</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 flex flex-col justify-between hover:shadow-md transition-shadow ${className}`} style={{ minHeight: 220 }}>
      {/* Top section: Avatar + Name/Role */}
      <div className="flex items-center gap-4 mb-2">
        <Avatar name={member.name} className="h-14 w-14" />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg leading-tight truncate">{member.name}</h3>
          <p className="text-muted-foreground text-base leading-tight truncate">{member.role}</p>
        </div>
      </div>
      {/* Price per month row */}
      <div className="mb-1">
        <span className="text-2xl font-bold text-primary">{formatCurrency(member.billRate, member.currency)}</span>
        <span className="text-sm text-muted-foreground ml-1">/month</span>
      </div>
      {/* Country row */}
      <div className="mb-1">
        <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2/20">
          {member.country}
        </Badge>
      </div>
      {/* Join date row */}
      <div className="mb-1">
        <Badge variant="secondary" className="text-xs">
          Joined {formatDate(member.joinDate)}
        </Badge>
      </div>
      {/* Bonuses row */}
      {member.bonuses && member.bonuses.length > 0 && (
        <div className="mb-1">
          <Badge variant="outline" className="bg-chart-3/10 text-chart-3 border-chart-3/20">
            <DollarSign className="w-3 h-3 mr-1" />
            {member.bonuses.length} Bonus{member.bonuses.length > 1 ? 'es' : ''}
          </Badge>
        </div>
      )}
      {/* Spacer to push actions to bottom */}
      <div className="flex-1" />
      {/* Fixed action buttons at the bottom */}
      {showActions && (
        <div className="flex gap-2 mt-4 pt-2 border-t border-border justify-between">
          {onView && (
            <Button
              variant="ghost"
              size="icon"
              className="bg-primary/10 hover:bg-primary/20 text-primary border-none flex-1"
              title="View Details"
              aria-label="View Details"
              onClick={() => onView(member)}
            >
              <Eye className="w-5 h-5" />
            </Button>
          )}
          {onBonus && (
            <Button
              variant="ghost"
              size="icon"
              className="bg-chart-2/10 hover:bg-chart-2/20 text-chart-2 border-none flex-1"
              title="Add Bonus"
              aria-label="Add Bonus"
              onClick={() => onBonus(member)}
            >
              <DollarSign className="w-5 h-5" />
            </Button>
          )}
          {onTerminate && (
            <Button
              variant="ghost"
              size="icon"
              className="bg-destructive/10 hover:bg-destructive/20 text-destructive border-none flex-1"
              title="Terminate"
              aria-label="Terminate"
              onClick={() => onTerminate(member)}
            >
              <XCircle className="w-5 h-5" />
            </Button>
          )}
        </div>
      )}
    </Card>
  );
} 