import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import type { FlowStep } from "@/lib/demo-data";

export function FlowDiagram({
  steps,
  activeId,
  onHover,
}: {
  steps: FlowStep[];
  activeId?: string | null;
  onHover: (step: FlowStep | null) => void;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-stretch">
      {steps.map((step, i) => (
        <div key={step.id}>
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            onMouseEnter={() => onHover(step)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(step)}
            onBlur={() => onHover(null)}
            className={cn(
              "group w-full rounded-2xl border bg-surface px-4 py-3 text-left transition-all duration-300",
              activeId === step.id
                ? "border-primary/50 bg-[color-mix(in_oklab,var(--primary)_12%,var(--surface))] shadow-[0_0_0_1px_color-mix(in_oklab,var(--primary)_35%,transparent)]"
                : "border-border hover:border-border-strong",
            )}
          >
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-lg border font-mono text-[11px]",
                  activeId === step.id
                    ? "border-primary/40 bg-primary/20 text-primary"
                    : "border-border bg-surface-2 text-muted-foreground",
                )}
              >
                {i + 1}
              </span>
              <span className="font-mono text-sm font-medium">{step.label}</span>
            </div>
            <motion.p
              initial={false}
              animate={{
                height: activeId === step.id ? "auto" : 0,
                opacity: activeId === step.id ? 1 : 0,
              }}
              className="overflow-hidden pl-10 text-xs leading-relaxed text-muted-foreground"
            >
              <span className="block pt-2">{step.detail}</span>
            </motion.p>
          </motion.button>
          {i < steps.length - 1 && (
            <div className="flex h-8 items-center justify-center">
              <span className="relative flex h-full w-px justify-center bg-border">
                <ArrowDown className="absolute -bottom-1 size-3 text-muted-foreground/60" />
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
