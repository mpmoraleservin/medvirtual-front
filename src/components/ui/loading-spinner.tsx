import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'muted';
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6", 
  lg: "h-8 w-8",
  xl: "h-12 w-12"
};

const variantClasses = {
  primary: "text-primary",
  secondary: "text-muted-foreground",
  muted: "text-muted-foreground/60"
};

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'primary',
  className = "",
  text
}: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} ${variantClasses[variant]} animate-spin`} />
      {text && (
        <p className="text-sm text-muted-foreground mt-2">{text}</p>
      )}
    </div>
  );
} 