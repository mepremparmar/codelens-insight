import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { CountUp, ProgressBar } from "@/components/kit/primitives";
import { ACTIVITY, CONCEPTS, MASTERY, WEAKEST } from "@/lib/demo-data";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Learning Progress — CodeLens AI" },
      {
        name: "description",
        content:
          "Charts of your concept mastery, 30-day learning activity and the weakest concepts to practise next.",
      },
      { property: "og:title", content: "Learning Progress — CodeLens AI" },
      {
        property: "og:description",
        content: "Measure understanding with mastery charts and activity trends.",
      },
    ],
  }),
  component: ProgressPage,
});

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  fontSize: 12,
} as const;

function ProgressPage() {
  return (
    <AppShell title="Progress">
      <PageHeader
        title="My Learning Progress"
        subtitle="Understanding you can actually measure — not hours logged."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="panel p-6"
        >
          <p className="text-sm text-muted-foreground">Overall Understanding</p>
          <p className="mt-3 text-5xl font-semibold tracking-tight">
            <CountUp to={78} suffix="%" />
          </p>
          <ProgressBar className="mt-5" value={78} tone="cyan" />
          <p className="mt-4 text-xs text-muted-foreground">
            Up 6 points in the last 30 days, driven mostly by React and async work.
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.07 }}
          className="panel p-6 lg:col-span-2"
        >
          <h2 className="text-base font-semibold">Concept Mastery</h2>
          <div className="mt-4 h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MASTERY} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid horizontal={false} stroke="var(--border)" />
                <XAxis type="number" domain={[0, 100]} stroke="var(--muted-foreground)" fontSize={11} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={120}
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)" }} />
                <Bar dataKey="value" fill="var(--chart-1)" radius={[0, 6, 6, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.section>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="panel mt-4 p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-semibold">Learning Activity</h2>
          <span className="font-mono text-xs text-muted-foreground">Last 30 days</span>
        </div>
        <div className="mt-5 h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ACTIVITY}>
              <defs>
                {["a", "b", "c"].map((k, i) => (
                  <linearGradient key={k} id={`grad-${k}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={`var(--chart-${i + 1})`} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={`var(--chart-${i + 1})`} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area
                type="monotone"
                dataKey="analyses"
                name="Code analyzed"
                stroke="var(--chart-1)"
                fill="url(#grad-a)"
              />
              <Area
                type="monotone"
                dataKey="challenges"
                name="Challenges completed"
                stroke="var(--chart-2)"
                fill="url(#grad-b)"
              />
              <Area
                type="monotone"
                dataKey="concepts"
                name="Concepts learned"
                stroke="var(--chart-3)"
                fill="url(#grad-c)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
        className="panel mt-4 p-6"
      >
        <h2 className="text-base font-semibold">Your Weakest Concepts</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {WEAKEST.map((w, i) => {
            const c = CONCEPTS.find((x) => x.name === w);
            return (
              <div key={w} className="rounded-xl border border-border bg-surface-2 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-xs text-warning">
                    {c?.mastery ?? 42}%
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium">{w}</p>
                <ProgressBar className="mt-3" value={c?.mastery ?? 42} tone="warning" />
              </div>
            );
          })}
        </div>
        <Link
          to="/challenges"
          className="mt-6 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
        >
          Practice These Concepts
        </Link>
      </motion.section>
    </AppShell>
  );
}
