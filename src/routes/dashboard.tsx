import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Brain, Code2, Flame, Swords, ArrowRight } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { StatCard } from "@/components/kit/StatCard";
import { Chip, ProgressBar, difficultyTone } from "@/components/kit/primitives";
import { CONCEPTS } from "@/lib/demo-data";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — CodeLens AI" },
      {
        name: "description",
        content:
          "Your CodeLens AI learning dashboard: analyses, concepts learned, challenges completed and your current streak.",
      },
      { property: "og:title", content: "Dashboard — CodeLens AI" },
      {
        property: "og:description",
        content: "Track analyses, concepts, challenges and learning streak in one place.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const storeState = useAppStore();

  const totalAnalyses = storeState.history.length;
  const totalConceptsLearned = Object.values(storeState.conceptMastery).filter((v) => v > 60).length;
  const totalChallengesCompleted = storeState.completedChallenges.length;
  const streak = storeState.profile.streak;

  // Compute weakest concepts dynamically
  const sortedConcepts = [...CONCEPTS].sort((a, b) => {
    const ma = storeState.conceptMastery[a.id] ?? a.mastery;
    const mb = storeState.conceptMastery[b.id] ?? b.mastery;
    return ma - mb;
  });

  const weakestConcepts = sortedConcepts.slice(0, 3);

  return (
    <AppShell title="Dashboard">
      <PageHeader
        title={<>Good morning, {storeState.profile.name.split(" ")[0]} 👋</>}
        subtitle="Let's turn some code into knowledge."
        action={
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            <Code2 className="size-4" />
            Analyze Code
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Code Analyses" value={totalAnalyses} icon={Code2} hint="+3 this week" index={0} />
        <StatCard
          label="Concepts Learned"
          value={totalConceptsLearned}
          icon={Brain}
          hint={`${Object.values(storeState.conceptMastery).filter((v) => v > 80).length} at mastery > 80%`}
          index={1}
        />
        <StatCard
          label="Challenges Completed"
          value={totalChallengesCompleted}
          icon={Swords}
          hint="88% average score"
          index={2}
        />
        <StatCard
          label="Learning Streak"
          value={streak}
          suffix=" days"
          icon={Flame}
          hint="Personal best: 11 days"
          index={3}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="panel p-5 lg:col-span-2"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">Continue where you left off</h2>
            <Link
              to="/history"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {storeState.history.slice(0, 4).map((h) => (
              <Link
                key={h.id}
                to="/analyze"
                search={{ id: h.id }}
                className="hover-lift flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface-2 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{h.project}</p>
                  <p className="font-mono text-xs text-muted-foreground">{h.language}</p>
                </div>
                <Chip tone={difficultyTone(h.difficulty) as "success"}>{h.difficulty}</Chip>
                <span className="font-mono text-xs text-muted-foreground">
                  {h.concepts} concepts
                </span>
                <span className="font-mono text-sm text-cyan">{h.score}%</span>
                <ArrowRight className="size-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="panel p-5"
        >
          <h2 className="text-base font-semibold">Your weakest concepts</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Practising these moves your overall score the most.
          </p>
          <ol className="mt-5 space-y-4">
            {weakestConcepts.map((c, i) => {
              const masteryVal = storeState.conceptMastery[c.id] ?? c.mastery;
              return (
                <li key={c.id}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">
                        {i + 1}
                      </span>
                      {c.name}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {masteryVal}%
                    </span>
                  </div>
                  <ProgressBar value={masteryVal} tone="warning" />
                </li>
              );
            })}
          </ol>
          <Link
            to="/challenges"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-primary/35 bg-[color-mix(in_oklab,var(--primary)_14%,transparent)] px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-[color-mix(in_oklab,var(--primary)_22%,transparent)]"
          >
            Practice These Concepts
          </Link>
        </motion.section>
      </div>

      <section className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Recently detected concepts</h2>
          <Link
            to="/concepts"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Concept library
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {CONCEPTS.slice(0, 4).map((c, i) => {
            const m = storeState.conceptMastery[c.id] ?? c.mastery;
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 + i * 0.05 }}
                className="panel hover-lift p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-xs font-semibold uppercase">{c.name}</p>
                  <span className="font-mono text-xs text-cyan">{m}%</span>
                </div>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {c.summary}
                </p>
                <ProgressBar className="mt-3" value={m} />
              </motion.div>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}
