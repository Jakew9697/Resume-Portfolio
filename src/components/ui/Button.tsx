"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { motion } from "framer-motion";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 neumorphic-raised hover:shadow-[8px_8px_16px_rgba(0,0,0,0.8),-8px_-8px_16px_rgba(35,35,35,0.12)] active:neumorphic-pressed",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/90 neumorphic-raised hover:shadow-[8px_8px_16px_rgba(0,0,0,0.8),-8px_-8px_16px_rgba(35,35,35,0.12)] active:neumorphic-pressed",
        outline:
          "border-2 border-border bg-card hover:bg-accent hover:text-accent-foreground neumorphic-flat hover:neumorphic-raised active:neumorphic-pressed",
        ghost:
          "hover:bg-accent/50 hover:text-accent-foreground hover:neumorphic-inset",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-lg px-4 text-sm",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, ...props }, ref) => {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...(props as any)}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
