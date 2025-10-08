import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 neumorphic-flat hover:neumorphic-raised",
  {
    variants: {
      variant: {
        default:
          "border-primary/20 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[4px_4px_8px_rgba(0,0,0,0.6),-4px_-4px_8px_rgba(34,211,238,0.1)]",
        secondary:
          "border-secondary/20 bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-[4px_4px_8px_rgba(0,0,0,0.6),-4px_-4px_8px_rgba(6,182,212,0.1)]",
        outline: "text-foreground border-border bg-card/50 hover:bg-card",
        success:
          "border-success/20 bg-success text-white shadow-[4px_4px_8px_rgba(0,0,0,0.6),-4px_-4px_8px_rgba(16,185,129,0.1)]",
        warning:
          "border-warning/20 bg-warning text-white shadow-[4px_4px_8px_rgba(0,0,0,0.6),-4px_-4px_8px_rgba(245,158,11,0.1)]",
        error:
          "border-error/20 bg-error text-white shadow-[4px_4px_8px_rgba(0,0,0,0.6),-4px_-4px_8px_rgba(239,68,68,0.1)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
