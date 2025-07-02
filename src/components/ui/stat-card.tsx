import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statCardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm transition-colors hover:shadow-md",
  {
    variants: {
      variant: {
        default: "border-border",
        primary: "border-primary/20 bg-primary/5",
        secondary: "border-secondary/20 bg-secondary/5",
        success: "border-chart-2/20 bg-chart-2/10 dark:border-chart-2/30 dark:bg-chart-2/20",
warning: "border-chart-3/20 bg-chart-3/10 dark:border-chart-3/30 dark:bg-chart-3/20",
danger: "border-destructive/20 bg-destructive/10 dark:border-destructive/30 dark:bg-destructive/20",
      },
      size: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface StatCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statCardVariants> {
  title: string
  value: string | number
  icon?: React.ReactNode
  description?: string
  trend?: {
    value: number
    isPositive: boolean
    label?: string
  }
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, variant, size, title, value, icon, description, trend, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(statCardVariants({ variant, size }), className)}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold tracking-tight">{value}</p>
              {trend && (
                <div className="flex items-center gap-1">
                  <span
                    className={cn(
                      "text-xs font-medium",
                      trend.isPositive
                        ? "text-chart-2"
                        : "text-destructive"
                    )}
                  >
                    {trend.isPositive ? "+" : ""}{trend.value}%
                  </span>
                  {trend.label && (
                    <span className="text-xs text-muted-foreground">
                      {trend.label}
                    </span>
                  )}
                </div>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {icon && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground">
              {icon}
            </div>
          )}
        </div>
      </div>
    )
  }
)

StatCard.displayName = "StatCard"

export { StatCard, statCardVariants } 