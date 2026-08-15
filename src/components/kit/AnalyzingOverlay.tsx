import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const STAGES = [
  "Reading your code…",
  "Detecting concepts…",
  "Building execution flow…",
  "Creating learning challenges…",
  "Your learning experience is ready.",
];

export function AnalyzingOverlay({
  open,
  onDone,
}: {
  open: boolean;
  onDone: () => void;
}) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!open) return;
    setStage(0);
    const timers = STAGES.map((_, i) =>
      setTimeout(() => setStage(i), i * 700),
    );
    const finish = setTimeout(onDone, STAGES.length * 700 + 500);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(finish);
    };
  }, [open, onDone]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.96, y: 8 }}
            animate={{ scale: 1, y: 0 }}
            className="panel w-full max-w-md p-6"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan">
              Analyzing
            </p>
            <h2 className="mt-2 text-lg font-semibold">Turning code into knowledge</h2>
            <ul className="mt-6 space-y-3">
              {STAGES.map((s, i) => (
                <li key={s} className="flex items-center gap-3 text-sm">
                  <span
                    className={cn(
                      "grid size-6 place-items-center rounded-full border transition-colors",
                      i < stage
                        ? "border-success/40 bg-[color-mix(in_oklab,var(--success)_16%,transparent)] text-success"
                        : i === stage
                          ? "border-primary/40 text-primary"
                          : "border-border text-muted-foreground/40",
                    )}
                  >
                    {i < stage ? (
                      <Check className="size-3.5" />
                    ) : i === stage ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <span className="size-1.5 rounded-full bg-current" />
                    )}
                  </span>
                  <span className={i <= stage ? "text-foreground" : "text-muted-foreground/50"}>
                    {s}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-cyan"
                animate={{ width: `${((stage + 1) / STAGES.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
