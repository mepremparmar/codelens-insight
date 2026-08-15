import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Code2 } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { Chip, ProgressBar, difficultyTone } from "@/components/kit/primitives";
import { HISTORY } from "@/lib/demo-data";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Analysis History — CodeLens AI" },
      {
        name: "description",
        content:
          "Every project you've analyzed, filterable by language, difficulty and date, with scores and concept counts.",
      },
      { property: "og:title", content: "Analysis History — CodeLens AI" },
      {
        property: "og:description",
        content: "Revisit past analyses and continue learning where you left off.",
      },
    ],
  }),
  component: HistoryPage,
});

const LANGS = ["All", "React + TypeScript", "TypeScript", "Python", "Java", "HTML/CSS"];
const DIFFS = ["All", "Beginner", "Intermediate", "Advanced"];
const DATES = ["All time", "Last 7 days", "Last 30 days"];

function HistoryPage() {
  const [lang, setLang] = useState("All");
  const [diff, setDiff] = useState("All");
  const [date, setDate] = useState("All time");

  const items = useMemo(
    () =>
      HISTORY.filter(
        (h) =>
          (lang === "All" || h.language === lang) &&
          (diff === "All" || h.difficulty === diff) &&
          (date === "All time" ||
            (date === "Last 7 days" && !h.when.includes("week")) ||
            date === "Last 30 days"),
      ),
    [lang, diff, date],
  );

  return (
    <AppShell title="History">
      <PageHeader
        title="Analysis History"
        subtitle="Everything you've put through CodeLens, ready to pick back up."
        action={
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            <Code2 className="size-4" /> New Analysis
          </Link>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { value: lang, set: setLang, options: LANGS, label: "Language" },
          { value: diff, set: setDiff, options: DIFFS, label: "Difficulty" },
          { value: date, set: setDate, options: DATES, label: "Date" },
        ].map((f) => (
          <label key={f.label} className="flex items-center gap-2 text-xs text-muted-foreground">
            {f.label}
            <select
              value={f.value}
              onChange={(e) => f.set(e.target.value)}
              className="h-9 rounded-lg border border-border bg-surface px-3 text-sm text-foreground outline-none focus:border-primary/50"
            >
              {f.options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="panel p-14 text-center">
          <p className="text-base font-medium">No code analyzed yet.</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Your first analysis will turn code into concepts, visual flows and interactive
            challenges.
          </p>
          <Link
            to="/analyze"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Analyze Your First Code
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((h, i) => (
            <motion.article
              key={h.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="panel hover-lift flex flex-col p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold">{h.project}</h3>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                    {h.language}
                  </p>
                </div>
                <Chip tone={difficultyTone(h.difficulty) as "success"}>{h.difficulty}</Chip>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="font-mono text-lg">{h.concepts}</p>
                  <p className="text-[11px] text-muted-foreground">Concepts</p>
                </div>
                <div>
                  <p className="font-mono text-lg text-cyan">{h.score}%</p>
                  <p className="text-[11px] text-muted-foreground">Score</p>
                </div>
                <div>
                  <p className="font-mono text-lg">{h.when.split(" ")[0]}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {h.when.split(" ").slice(1).join(" ") || "ago"}
                  </p>
                </div>
              </div>
              <ProgressBar className="mt-4" value={h.score} tone="cyan" />
              <Link
                to="/analyze"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm font-medium transition-colors hover:border-border-strong"
              >
                Continue Learning <ArrowRight className="size-4" />
              </Link>
            </motion.article>
          ))}
        </div>
      )}
    </AppShell>
  );
}
