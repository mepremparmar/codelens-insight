import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { CountUp } from "./primitives";

export function StatCard({
  label,
  value,
  suffix,
  icon: Icon,
  hint,
  index = 0,
  className,
}: {
  label: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
  hint?: string;
  index?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn("panel hover-lift p-5", className)}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <span className="rounded-lg border border-border bg-surface-2 p-1.5 text-primary">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight">
        <CountUp to={value} suffix={suffix ?? ""} />
      </p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </motion.div>
  );
}
