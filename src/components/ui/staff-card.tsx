import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
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
    <Card className={`p-6 hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-start gap-4">
        <Avatar name={member.name} className="h-12 w-12" />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-muted-foreground">{member.role}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-primary">
                {formatCurrency(member.billRate, member.currency)}
              </p>
              <p className="text-sm text-muted-foreground">/month</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2/20">
              {member.country}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Joined {formatDate(member.joinDate)}
            </Badge>
            {member.bonuses && member.bonuses.length > 0 && (
              <Badge variant="outline" className="bg-chart-3/10 text-chart-3 border-chart-3/20">
                <DollarSign className="w-3 h-3 mr-1" />
                {member.bonuses.length} Bonus{member.bonuses.length > 1 ? 'es' : ''}
              </Badge>
            )}
          </div>
          
          {member.recentActivity && (
            <p className="text-sm text-muted-foreground mb-4">
              {member.recentActivity}
            </p>
          )}
          
          {showActions && (
            <div className="flex gap-2">
              {onView && (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onView(member)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-semibold">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                      <p className="text-sm">Joined: {formatDate(member.joinDate)}</p>
                      {member.bonuses && member.bonuses.length > 0 && (
                        <div>
                          <p className="text-sm font-medium">Recent Bonuses:</p>
                          <div className="space-y-1">
                            {member.bonuses.slice(0, 3).map((bonus, index) => (
                              <div key={index} className="text-xs text-muted-foreground">
                                {formatCurrency(bonus.amount, member.currency)} - {formatDate(bonus.date)}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </HoverCardContent>
                </HoverCard>
              )}
              
              {onBonus && (
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => onBonus(member)}
                >
                  <DollarSign className="w-4 h-4 mr-1" />
                  Add Bonus
                </Button>
              )}
              
              {onTerminate && (
                <Button 
                  variant="destructive"
                  size="sm"
                  onClick={() => onTerminate(member)}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Terminate
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
} 