import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { FileUp, Play, ClipboardPaste, Sparkles, CheckCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { CodeEditor } from "@/components/code/CodeEditor";
import { AITutor } from "@/components/kit/AITutor";
import { AnalyzingOverlay } from "@/components/kit/AnalyzingOverlay";
import { ConceptCard } from "@/components/kit/ConceptCard";
import { FlowDiagram } from "@/components/kit/FlowDiagram";
import { Chip, ProgressBar } from "@/components/kit/primitives";
import { LANGUAGES, SAMPLE_CODE, type FlowStep } from "@/lib/demo-data";
import { requestCodeAnalysis } from "@/lib/api";
import { appStore, useAppStore, type AnalysisResult } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/analyze")({
  validateSearch: (search: Record<string, unknown>) => ({
    id: typeof search.id === "string" ? search.id : undefined,
  }),
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

function Analyze() {
  const search = useSearch({ from: "/analyze" });
  const storeState = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [code, setCode] = useState(SAMPLE_CODE);
  const [language, setLanguage] = useState("React");
  const [tab, setTab] = useState<Tab>("Overview");
  const [analyzing, setAnalyzing] = useState(false);
  const [ready, setReady] = useState(true);
  const [hovered, setHovered] = useState<FlowStep | null>(null);
  const [activeConcept, setActiveConcept] = useState<string | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [fileName, setFileName] = useState<string | undefined>("useResumeAnalysis.ts");

  // Load existing analysis from route search or auto-analyze default code silently on mount
  useEffect(() => {
    if (search.id) {
      const existing = appStore.getAnalysis(search.id);
      if (existing) {
        setCode(existing.code);
        setLanguage(existing.language);
        setCurrentAnalysis(existing);
        setFileName(existing.project);
        return;
      }
    }
    // Silent initial analysis on mount (no modal overlay popup)
    if (!currentAnalysis) {
      handleRunAnalysis(code, language, fileName, false);
    }
  }, [search.id]);

  // Update language and run silent analysis (no modal overlay popup)
  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    handleRunAnalysis(code, newLang, fileName, false);
  };

  const handleRunAnalysis = async (
    codeToAnalyze = code,
    langToAnalyze = language,
    name = fileName,
    showOverlay = false,
  ) => {
    if (showOverlay) {
      setReady(false);
      setAnalyzing(true);
    }
    try {
      const result = await requestCodeAnalysis(codeToAnalyze, langToAnalyze, name);
      setCurrentAnalysis(result);
      appStore.addAnalysis(result);
      if (showOverlay) {
        toast.success("Analysis complete!", {
          description: `${result.concepts.length} concepts detected in ${result.project}.`,
        });
      }
    } catch (err) {
      if (showOverlay) toast.error("Analysis failed. Please try again.");
    } finally {
      if (showOverlay) {
        setAnalyzing(false);
        setReady(true);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setCode(content);
        setFileName(file.name);

        // Auto-detect language by file extension
        let detectedLang = language;
        if (file.name.endsWith(".py")) detectedLang = "Python";
        else if (file.name.endsWith(".java")) detectedLang = "Java";
        else if (file.name.endsWith(".ts") || file.name.endsWith(".tsx")) detectedLang = "TypeScript";
        else if (file.name.endsWith(".js") || file.name.endsWith(".jsx")) detectedLang = "JavaScript";
        else if (file.name.endsWith(".html") || file.name.endsWith(".css")) detectedLang = "HTML/CSS";

        setLanguage(detectedLang);
        toast.success(`Loaded ${file.name}`, { description: "Click Analyze to inspect concepts." });
        handleRunAnalysis(content, detectedLang, file.name, true);
      }
    };
    reader.readAsText(file);
  };

  const detectedConcepts = currentAnalysis?.concepts || [];
  const flowSteps = currentAnalysis?.flow || [];

  const highlight =
    hovered?.lines ??
    detectedConcepts.find((c) => c.id === activeConcept)?.lines ??
    [];

  return (
    <AppShell title="Analyze Code">
      <AnalyzingOverlay
        open={analyzing}
        onDone={() => {
          setAnalyzing(false);
          setReady(true);
        }}
      />

      <PageHeader
        title="Analyze Code"
        subtitle="Paste a file, detect the concepts behind it, then prove you understood."
      />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept=".js,.ts,.jsx,.tsx,.py,.java,.html,.css,.json,.txt"
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="panel flex flex-col p-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
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
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <FileUp className="size-4" /> Upload File
            </button>

            <button
              onClick={() => {
                setCode(SAMPLE_CODE);
                setFileName("useResumeAnalysis.ts");
                setLanguage("React");
                toast("Sample code pasted");
              }}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ClipboardPaste className="size-4" /> Sample Code
            </button>

            <button
              onClick={() => handleRunAnalysis(code, language, fileName, true)}
              className="ml-auto inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              <Play className="size-4" /> Analyze
            </button>
          </div>

          <CodeEditor code={code} onChange={setCode} highlight={highlight} maxHeight="34rem" />

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="font-mono">{fileName || "Snippet"} · {language}</span>
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
                  {tab === "Overview" && (
                    <Overview analysis={currentAnalysis} />
                  )}
                  {tab === "Concepts" && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {detectedConcepts.map((c, i) => (
                        <div
                          key={c.id || i}
                          onMouseEnter={() => setActiveConcept(c.id)}
                          onMouseLeave={() => setActiveConcept(null)}
                        >
                          <ConceptCard
                            concept={{
                              ...c,
                              mastery: storeState.conceptMastery[c.id] ?? c.mastery ?? 70,
                              related: ["Async/Await", "Promises", "Error Handling"],
                            }}
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
                        steps={flowSteps}
                        activeId={hovered?.id ?? null}
                        onHover={setHovered}
                      />
                    </div>
                  )}
                  {tab === "AI Tutor" && (
                    <AITutor
                      code={code}
                      language={language}
                      quiz={currentAnalysis?.quiz}
                      className="h-full min-h-[30rem]"
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Overview({ analysis }: { analysis: AnalysisResult | null }) {
  const metrics = [
    { label: "Code Complexity", value: analysis?.complexity || "Medium", tone: "warning" as const, pct: analysis?.complexity === "High" ? 85 : analysis?.complexity === "Low" ? 35 : 60 },
    { label: "Concepts Detected", value: `${analysis?.concepts?.length || 8}`, tone: "primary" as const, pct: Math.min(100, (analysis?.concepts?.length || 8) * 12) },
    { label: "Difficulty", value: analysis?.difficulty || "Intermediate", tone: "cyan" as const, pct: analysis?.difficulty === "Advanced" ? 85 : analysis?.difficulty === "Beginner" ? 40 : 65 },
  ];

  const explanations = analysis?.explanation || [
    "This code processes inputs, manages asynchronous state updates, and executes operations over HTTP.",
    "Functions pause at await statements allowing other tasks on the event loop to run concurrently.",
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
          {explanations.map((exp, idx) => (
            <p key={idx}>{exp}</p>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {(analysis?.concepts || []).map((c) => (
          <Chip key={c.id} tone="primary">
            {c.name.toUpperCase()}
          </Chip>
        ))}
      </div>
    </div>
  );
}
