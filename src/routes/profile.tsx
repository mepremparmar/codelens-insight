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
  return (
    <AppShell title="Profile">
      <PageHeader title="Profile" subtitle="Your developer learning identity." />

      <section className="panel flex flex-wrap items-center gap-5 p-6">
        <span className="grid size-20 place-items-center rounded-2xl bg-gradient-to-br from-primary to-cyan text-2xl font-semibold text-primary-foreground">
          PP
        </span>
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Prem Parmar</h2>
          <p className="text-sm text-muted-foreground">Developer in Progress</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Chip tone="primary">React</Chip>
            <Chip tone="cyan">AWS</Chip>
            <Chip>TypeScript</Chip>
          </div>
        </div>
      </section>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Analyses" value={24} icon={Code2} index={0} />
        <StatCard label="Concepts" value={68} icon={Brain} index={1} />
        <StatCard label="Challenges" value={31} icon={Swords} index={2} />
        <StatCard label="Day Streak" value={7} icon={Flame} index={3} />
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
            <p className="mt-2 text-lg font-semibold">Project-based learner</p>
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
              Become a stronger full-stack/cloud developer
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Next milestones: Error Handling to 75%, API Gateway to 60%.
            </p>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
