"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SkillBadgeProps {
  name: string;
  proficiency?: number;
  icon?: React.ReactNode;
  className?: string;
}

export function SkillBadge({
  name,
  proficiency,
  icon,
  className,
}: SkillBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "group relative bg-card/80 backdrop-blur-sm border border-border rounded-xl p-4 hover:border-primary/50 neumorphic-card hover:shadow-[12px_12px_24px_rgba(0,0,0,0.95),-12px_-12px_24px_rgba(52,52,52,0.16)] transition-all duration-300",
        className
      )}>
      <div className="flex items-center gap-3">
        {icon && <div className="text-primary">{icon}</div>}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate text-white">{name}</p>
          {proficiency !== undefined && (
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Proficiency</span>
                <span>{proficiency}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden neumorphic-inset">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${proficiency}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
