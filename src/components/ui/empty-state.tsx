import React from "react";
import { Card } from "@/components/ui/card";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  variant?: 'default' | 'minimal';
  className?: string;
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action, 
  variant = 'default',
  className = "" 
}: EmptyStateProps) {
  if (variant === 'minimal') {
    return (
      <div className={`flex flex-col items-center justify-center text-center p-8 ${className}`}>
        <div className="text-muted-foreground mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2 text-foreground">{title}</h3>
        <p className="text-muted-foreground mb-4 max-w-sm">{description}</p>
        {action && (
          <div className="flex justify-center">
            {action}
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className={`p-8 ${className}`}>
      <div className="flex flex-col items-center justify-center text-center">
        <div className="text-muted-foreground mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2 text-foreground">{title}</h3>
        <p className="text-muted-foreground mb-4 max-w-sm">{description}</p>
        {action && (
          <div className="flex justify-center">
            {action}
          </div>
        )}
      </div>
    </Card>
  );
} 