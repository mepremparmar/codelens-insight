import { cn } from "@/lib/utils";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

export function CountUp({
  to,
  suffix = "",
  duration = 1.2,
  className,
}: {
  to: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}

export function ProgressBar({
  value,
  className,
  tone = "primary",
}: {
  value: number;
  className?: string;
  tone?: "primary" | "cyan" | "success" | "warning";
}) {
  const tones: Record<string, string> = {
    primary: "bg-primary",
    cyan: "bg-cyan",
    success: "bg-success",
    warning: "bg-warning",
  };
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}>
      <motion.div
        className={cn("h-full rounded-full", tones[tone])}
        initial={{ width: 0 }}
        whileInView={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

export function Chip({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: "default" | "primary" | "cyan" | "success" | "warning" | "danger";
  className?: string;
}) {
  const tones: Record<string, string> = {
    default: "border-border bg-surface-2 text-muted-foreground",
    primary:
      "border-primary/30 bg-[color-mix(in_oklab,var(--primary)_16%,transparent)] text-primary",
    cyan: "border-cyan/30 bg-[color-mix(in_oklab,var(--cyan)_14%,transparent)] text-cyan",
    success:
      "border-success/30 bg-[color-mix(in_oklab,var(--success)_14%,transparent)] text-success",
    warning:
      "border-warning/30 bg-[color-mix(in_oklab,var(--warning)_14%,transparent)] text-warning",
    danger:
      "border-destructive/30 bg-[color-mix(in_oklab,var(--destructive)_14%,transparent)] text-destructive",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function difficultyTone(d: string) {
  return d === "Beginner" ? "success" : d === "Advanced" ? "danger" : "warning";
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-cyan">
      {children}
    </p>
  );
}

export function Panel({
  children,
  className,
  hover,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div className={cn("panel", hover && "hover-lift", className)}>{children}</div>
  );
}

export function useMouseGlow() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  return { x: useSpring(x, { stiffness: 120, damping: 20 }), y, raw: { x, y } };
}
