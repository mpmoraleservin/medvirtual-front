import React from "react";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionTitle({ title, subtitle, className = "" }: SectionTitleProps) {
  return (
    <div className={`mb-4 ${className}`.trim()}>
      <h2 className="text-xl md:text-2xl font-semibold mb-2 text-foreground">{title}</h2>
      {subtitle && <p className="text-muted-foreground mb-4">{subtitle}</p>}
    </div>
  );
} 