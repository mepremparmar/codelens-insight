import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Concept } from "@/lib/demo-data";
import { Chip, ProgressBar, difficultyTone } from "./primitives";

export function ConceptCard({
  concept,
  index = 0,
  onSelect,
  ctaLabel = "Learn More",
  className,
}: {
  concept: Concept;
  index?: number;
  onSelect?: (c: Concept) => void;
  ctaLabel?: string;
  className?: string;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: Math.min(index * 0.05, 0.3), duration: 0.45 }}
      className={cn("panel hover-lift flex flex-col p-5", className)}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-mono text-sm font-semibold uppercase tracking-wide">
          {concept.name}
        </h3>
        <Chip tone={difficultyTone(concept.difficulty) as "success"}>
          {concept.difficulty}
        </Chip>
      </div>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {concept.summary}
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {concept.related.slice(0, 3).map((r) => (
          <Chip key={r}>{r}</Chip>
        ))}
      </div>
      <div className="mt-5">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Mastery</span>
          <span className="font-mono text-foreground">{concept.mastery}%</span>
        </div>
        <ProgressBar
          value={concept.mastery}
          tone={concept.mastery > 75 ? "success" : concept.mastery > 50 ? "cyan" : "warning"}
        />
      </div>
      <button
        onClick={() => onSelect?.(concept)}
        className="group mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-cyan"
      >
        {ctaLabel}
        <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </button>
    </motion.article>
  );
}
