import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { FileUp, Play, ClipboardPaste, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { CodeEditor } from "@/components/code/CodeEditor";
import { AITutor } from "@/components/kit/AITutor";
import { AnalyzingOverlay } from "@/components/kit/AnalyzingOverlay";
import { ConceptCard } from "@/components/kit/ConceptCard";
import { FlowDiagram } from "@/components/kit/FlowDiagram";
import { Chip, ProgressBar } from "@/components/kit/primitives";
import { CONCEPTS, FLOW, LANGUAGES, SAMPLE_CODE, type FlowStep } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: "Analyze Code — CodeLens AI" },
      {
        name: "description",
        content:
          "Paste code and get concept detection, an execution flow diagram and an AI tutor tied to your exact lines.",
      },
      { property: "og:title", content: "Analyze Code — CodeLens AI" },
      {
        property: "og:description",
        content: "A split-screen workspace that turns source code into an interactive lesson.",
      },
    ],
  }),
  component: Analyze,
});

const TABS = ["Overview", "Concepts", "Execution Flow", "AI Tutor"] as const;
type Tab = (typeof TABS)[number];

const DETECTED = CONCEPTS.filter((c) =>
  ["async-await", "rest-api", "promises", "json", "error-handling", "react-hooks", "aws-lambda", "api-gateway"].includes(
    c.id,
  ),
);

function Analyze() {
  const [code, setCode] = useState(SAMPLE_CODE);
  const [language, setLanguage] = useState("React");
  const [tab, setTab] = useState<Tab>("Overview");
  const [analyzing, setAnalyzing] = useState(false);
  const [ready, setReady] = useState(true);
  const [hovered, setHovered] = useState<FlowStep | null>(null);
  const [activeConcept, setActiveConcept] = useState<string | null>(null);

  const highlight =
    hovered?.lines ??
    DETECTED.find((c) => c.id === activeConcept)?.lines ??
    [];

  return (
    <AppShell title="Analyze Code">
      <AnalyzingOverlay
        open={analyzing}
        onDone={() => {
          setAnalyzing(false);
          setReady(true);
          toast.success("Analysis ready", {
            description: "8 concepts detected in AI Resume Analyzer.",
          });
        }}
      />

      <PageHeader
        title="Analyze Code"
        subtitle="Paste a file, detect the concepts behind it, then prove you understood."
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="panel flex flex-col p-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Language"
              className="h-9 rounded-lg border border-border bg-surface-2 px-3 text-sm outline-none focus:border-primary/50"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
            <button
              onClick={() => toast("File upload is simulated in this demo")}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <FileUp className="size-4" /> Upload File
            </button>
            <button
              onClick={() => {
                setCode(SAMPLE_CODE);
                toast("Sample code pasted");
              }}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ClipboardPaste className="size-4" /> Paste Code
            </button>
            <button
              onClick={() => {
                setReady(false);
                setAnalyzing(true);
              }}
              className="ml-auto inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              <Play className="size-4" /> Analyze
            </button>
          </div>

          <CodeEditor code={code} highlight={highlight} maxHeight="34rem" />

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="font-mono">AI Resume Analyzer · {language}</span>
            <span className="h-3 w-px bg-border" />
            <span>{code.split("\n").length} lines</span>
            {highlight.length > 0 && (
              <Chip tone="primary">Highlighting lines {highlight.join(", ")}</Chip>
            )}
          </div>
        </section>

        <section className="panel flex min-h-[36rem] flex-col p-4">
          <div className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-surface-2 p-1">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "relative whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors",
                  tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab === t && (
                  <motion.span
                    layoutId="analyze-tab"
                    className="absolute inset-0 rounded-lg border border-border bg-surface"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <span className="relative">{t}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 flex-1 overflow-y-auto">
            {!ready ? (
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-14 animate-pulse rounded-xl bg-surface-2" />
                ))}
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  {tab === "Overview" && <Overview />}
                  {tab === "Concepts" && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {DETECTED.map((c, i) => (
                        <div
                          key={c.id}
                          onMouseEnter={() => setActiveConcept(c.id)}
                          onMouseLeave={() => setActiveConcept(null)}
                        >
                          <ConceptCard
                            concept={c}
                            index={i}
                            onSelect={() =>
                              toast(c.name, { description: c.summary })
                            }
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {tab === "Execution Flow" && (
                    <div>
                      <p className="mb-6 text-sm text-muted-foreground">
                        Hover a node to highlight the lines that run at that moment.
                      </p>
                      <FlowDiagram
                        steps={FLOW}
                        activeId={hovered?.id ?? null}
                        onHover={setHovered}
                      />
                    </div>
                  )}
                  {tab === "AI Tutor" && <AITutor className="h-full min-h-[30rem]" />}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Overview() {
  const metrics = [
    { label: "Code Complexity", value: "Medium", tone: "warning" as const, pct: 58 },
    { label: "Concepts Detected", value: "8", tone: "primary" as const, pct: 80 },
    { label: "Difficulty", value: "Intermediate", tone: "cyan" as const, pct: 65 },
  ];
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-3">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-xl border border-border bg-surface-2 p-4"
          >
            <p className="text-xs text-muted-foreground">{m.label}</p>
            <p className="mt-1.5 text-lg font-semibold">{m.value}</p>
            <ProgressBar className="mt-3" value={m.pct} tone={m.tone} />
          </motion.div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-surface-2 p-5">
        <p className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Sparkles className="size-4" /> AI Explanation
        </p>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            This file exports a custom React hook called <code className="font-mono text-cyan">useResumeAnalysis</code>.
            A hook is just a function that lets a component remember things and run work
            over time — here it remembers the analysis result and whether a request is in
            flight.
          </p>
          <p>
            The <code className="font-mono text-cyan">analyze</code> function is marked{" "}
            <code className="font-mono text-cyan">async</code>, which means it can pause.
            It packs the uploaded file into a <code className="font-mono text-cyan">FormData</code>{" "}
            body and sends it to an HTTP endpoint — in this project, API Gateway forwards
            that request to an AWS Lambda function.
          </p>
          <p>
            <code className="font-mono text-cyan">await</code> pauses until the server
            responds, then <code className="font-mono text-cyan">res.json()</code> converts
            the raw body into a JavaScript object. Finally the hook stores the result in
            state so the UI re-renders with real data.
          </p>
          <p className="text-warning">
            Worth noticing: nothing here handles a failed request. If the network drops,
            the Promise rejects and the loading flag stays on forever — which is exactly
            what Challenge #04 asks you to fix.
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {DETECTED.map((c) => (
          <Chip key={c.id} tone="primary">
            {c.name.toUpperCase()}
          </Chip>
        ))}
      </div>
    </div>
  );
}
