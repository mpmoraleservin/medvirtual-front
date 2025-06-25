import React from "react";

interface PageTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function PageTitle({ title, subtitle, className = "" }: PageTitleProps) {
  return (
    <div className={`mb-6 ${className}`.trim()}>
      <h1 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">{title}</h1>
      {subtitle && <p className="text-muted-foreground mb-6">{subtitle}</p>}
    </div>
  );
} 