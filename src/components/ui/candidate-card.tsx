import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Eye, Star, User } from "lucide-react";

interface CandidateEducation {
  institution: string;
  degree: string;
  startYear: number;
  endYear: number;
}

interface CandidateExperience {
  company: string;
  role: string;
  startYear: number;
  endYear?: number;
  description?: string;
}

interface Candidate {
  id: string;
  name: string;
  avatarUrl?: string;
  role: string;
  pricePerMonth: number;
  currency: string;
  languages: string[];
  specializations: string[];
  skills: string[];
  about: string;
  education: CandidateEducation[];
  experience: CandidateExperience[];
  experienceLevel: "Junior" | "Mid" | "Senior";
}

interface CandidateCardProps {
  candidate: Candidate;
  onViewProfile?: (candidate: Candidate) => void;
  onHire?: (candidate: Candidate) => void;
  variant?: 'default' | 'compact' | 'featured';
  showActions?: boolean;
  className?: string;
}

const experienceLevelColors = {
  Junior: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  Mid: "bg-chart-3/10 text-chart-3 border-chart-3/20", 
  Senior: "bg-chart-4/10 text-chart-4 border-chart-4/20"
};

export function CandidateCard({
  candidate,
  onViewProfile,
  onHire,
  variant = 'default',
  showActions = true,
  className = ""
}: CandidateCardProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (variant === 'compact') {
    return (
      <Card className={`p-4 hover:shadow-md transition-shadow cursor-pointer ${className}`}>
        <div className="flex items-center gap-3">
                  <Avatar name={candidate.name} className="h-10 w-10" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{candidate.name}</h3>
            <p className="text-xs text-muted-foreground truncate">{candidate.role}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold">{formatCurrency(candidate.pricePerMonth, candidate.currency)}</p>
            <p className="text-xs text-muted-foreground">/mo</p>
          </div>
        </div>
      </Card>
    );
  }

  if (variant === 'featured') {
    return (
      <div className={`relative group cursor-pointer rounded-2xl p-[2px] bg-gradient-to-br from-primary via-chart-1 to-primary/30 shadow-lg hover:scale-[1.03] transition-transform ${className}`}>
        <Card className="flex flex-col justify-between rounded-2xl p-3 md:p-4 h-full bg-background min-h-[200px] md:min-h-[230px]">
          {/* Star icon top right */}
          <div className="absolute top-2 right-2 md:top-3 md:right-3 z-10">
            <Star className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--highlight-yellow)] drop-shadow" fill="var(--highlight-yellow)" />
          </div>
          
          {/* Title and availability */}
          <div className="mb-2 pt-1 pr-5">
            <h3 className="font-bold text-base md:text-lg text-primary mb-1 leading-tight whitespace-normal">
              {candidate.role}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs md:text-sm text-muted-foreground">
                {candidate.experienceLevel} Level
              </span>
              <span className="inline-block w-1 h-1 rounded-full bg-primary/30" />
              <span className="text-xs md:text-sm text-chart-2 font-semibold">Available</span>
            </div>
          </div>
          
          {/* Languages and specialization */}
          <div className="flex flex-wrap gap-1 md:gap-2 mb-2 md:mb-3">
            {candidate.languages.slice(0, 2).map(l => (
              <Badge key={l} variant="secondary" className="text-[10px] md:text-xs px-2 py-0.5">
                {l}
              </Badge>
            ))}
            {candidate.specializations[0] && (
              <Badge variant="outline" className="text-[10px] md:text-xs px-2 py-0.5">
                {candidate.specializations[0]}
              </Badge>
            )}
          </div>
          
          {/* Top skill and price */}
          <div className="flex flex-col gap-1 mt-auto">
            <span className="text-[10px] md:text-xs text-[var(--highlight-yellow)] font-semibold bg-[var(--highlight-yellow-bg)] rounded px-2 py-1">
              Top Skill: {candidate.skills[0] || candidate.specializations[0]}
            </span>
            <span className="text-sm md:text-base text-primary font-bold bg-primary/10 rounded px-2 py-1">
              {formatCurrency(candidate.pricePerMonth, candidate.currency)}
              <span className="text-[10px] md:text-xs font-normal"> /mo</span>
            </span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <Card className={`p-6 hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-start gap-4">
        <Avatar name={candidate.name} className="h-12 w-12" />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-lg">{candidate.name}</h3>
              <p className="text-muted-foreground">{candidate.role}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-primary">
                {formatCurrency(candidate.pricePerMonth, candidate.currency)}
              </p>
              <p className="text-sm text-muted-foreground">/month</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="outline" className={experienceLevelColors[candidate.experienceLevel]}>
              {candidate.experienceLevel}
            </Badge>
            {candidate.languages.slice(0, 3).map(language => (
              <Badge key={language} variant="secondary" className="text-xs">
                {language}
              </Badge>
            ))}
          </div>
          
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {candidate.about}
          </p>
          
          {showActions && (
            <div className="flex gap-2">
              {onViewProfile && (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onViewProfile(candidate)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Profile
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-semibold">{candidate.name}</h4>
                      <p className="text-sm text-muted-foreground">{candidate.about}</p>
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.slice(0, 5).map(skill => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              )}
              
              {onHire && (
                <Button 
                  size="sm"
                  onClick={() => onHire(candidate)}
                >
                  <User className="w-4 h-4 mr-1" />
                  Hire
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
} 