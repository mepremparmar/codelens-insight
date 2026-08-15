import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BookOpen, Code2 } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { Chip, ProgressBar, difficultyTone } from "@/components/kit/primitives";
import { CONCEPTS, HISTORY } from "@/lib/demo-data";

export const Route = createFileRoute("/learning")({
  head: () => ({
    meta: [
      { title: "My Learning — CodeLens AI" },
      {
        name: "description",
        content:
          "Your active learning path: in-progress concepts, current projects and the next step in the loop.",
      },
      { property: "og:title", content: "My Learning — CodeLens AI" },
      {
        property: "og:description",
        content: "Continue your personalized learning path built from code you analyzed.",
      },
    ],
  }),
  component: Learning,
});

function Learning() {
  const inProgress = CONCEPTS.filter((c) => c.mastery < 80).slice(0, 6);

  return (
    <AppShell title="My Learning">
      <PageHeader
        title="My Learning"
        subtitle="A path built from the code you actually work on."
        action={
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            <Code2 className="size-4" /> Analyze Code
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="panel p-5 lg:col-span-2">
          <h2 className="text-base font-semibold">Current learning path</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Ordered by impact on your overall understanding score.
          </p>
          <ol className="mt-5 space-y-3">
            {inProgress.map((c, i) => (
              <motion.li
                key={c.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="hover-lift rounded-xl border border-border bg-surface-2 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-xs text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-medium">{c.name}</span>
                    <Chip tone={difficultyTone(c.difficulty) as "success"}>
                      {c.difficulty}
                    </Chip>
                  </span>
                  <span className="font-mono text-xs text-cyan">{c.mastery}%</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{c.summary}</p>
                <ProgressBar className="mt-3" value={c.mastery} />
              </motion.li>
            ))}
          </ol>
        </section>

        <section className="panel p-5">
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <BookOpen className="size-4 text-cyan" /> Active projects
          </h2>
          <div className="mt-4 space-y-3">
            {HISTORY.slice(0, 3).map((h) => (
              <Link
                key={h.id}
                to="/analyze"
                className="hover-lift block rounded-xl border border-border bg-surface-2 p-4"
              >
                <p className="text-sm font-medium">{h.project}</p>
                <p className="font-mono text-xs text-muted-foreground">{h.language}</p>
                <ProgressBar className="mt-3" value={h.score} tone="cyan" />
              </Link>
            ))}
          </div>
          <Link
            to="/challenges"
            className="mt-6 flex items-center justify-center rounded-xl border border-primary/35 bg-[color-mix(in_oklab,var(--primary)_14%,transparent)] px-4 py-2.5 text-sm font-medium text-primary"
          >
            Continue with a challenge
          </Link>
        </section>
      </div>
    </AppShell>
  );
}
