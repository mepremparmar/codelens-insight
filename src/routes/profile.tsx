import { createFileRoute } from "@tanstack/react-router";
import { Brain, Code2, Flame, Swords } from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { StatCard } from "@/components/kit/StatCard";
import { Chip } from "@/components/kit/primitives";
import { RADAR } from "@/lib/demo-data";
import { useAppStore } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — CodeLens AI" },
      {
        name: "description",
        content:
          "Prem Parmar's developer learning profile: skill radar, learning style, goals and lifetime stats.",
      },
      { property: "og:title", content: "Profile — CodeLens AI" },
      {
        property: "og:description",
        content: "A developer learning profile built from real analyses and challenges.",
      },
    ],
  }),
  component: Profile,
});

function Profile() {
  const storeState = useAppStore();

  const totalAnalyses = storeState.history.length;
  const totalConcepts = Object.keys(storeState.conceptMastery).length;
  const totalChallenges = storeState.completedChallenges.length;
  const streak = storeState.profile.streak;

  const initials = storeState.profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <AppShell title="Profile">
      <PageHeader title="Profile" subtitle="Your developer learning identity." />

      <section className="panel flex flex-wrap items-center gap-5 p-6">
        <span className="grid size-20 place-items-center rounded-2xl bg-gradient-to-br from-primary to-cyan text-2xl font-semibold text-primary-foreground">
          {initials}
        </span>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{storeState.profile.name}</h2>
          <p className="text-sm text-muted-foreground">{storeState.profile.role}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {storeState.onboarding.interests.map((interest) => (
              <Chip key={interest} tone="primary">
                {interest}
              </Chip>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Analyses" value={totalAnalyses} icon={Code2} index={0} />
        <StatCard label="Concepts" value={totalConcepts} icon={Brain} index={1} />
        <StatCard label="Challenges" value={totalChallenges} icon={Swords} index={2} />
        <StatCard label="Day Streak" value={streak} icon={Flame} index={3} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <section className="panel p-6">
          <h3 className="text-base font-semibold">Skill radar</h3>
          <div className="mt-4 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={RADAR} outerRadius="72%">
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis
                  dataKey="skill"
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                />
                <Radar
                  dataKey="value"
                  stroke="var(--chart-1)"
                  fill="var(--chart-1)"
                  fillOpacity={0.35}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <div className="space-y-4">
          <section className="panel p-6">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Learning Style
            </p>
            <p className="mt-2 text-lg font-semibold">{storeState.profile.learningStyle}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              You retain most when concepts arrive attached to code you're already
              building, so CodeLens leads with your own projects.
            </p>
          </section>
          <section className="panel p-6">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Current Goal
            </p>
            <p className="mt-2 text-lg font-semibold">
              {storeState.profile.currentGoal}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Experience level: {storeState.onboarding.experience}.
            </p>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
