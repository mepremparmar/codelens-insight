import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Lightbulb, Play, Send, Trophy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { CodeEditor } from "@/components/code/CodeEditor";
import { Chip, ProgressBar } from "@/components/kit/primitives";
import { CHALLENGE_CODE, HINTS } from "@/lib/demo-data";

export const Route = createFileRoute("/challenges")({
  head: () => ({
    meta: [
      { title: "Challenges — CodeLens AI" },
      {
        name: "description",
        content:
          "Modify real code, get progressive hints and receive an understanding score per concept.",
      },
      { property: "og:title", content: "Challenges — CodeLens AI" },
      {
        property: "og:description",
        content: "Test your understanding with code challenges and progressive hints.",
      },
    ],
  }),
  component: Challenges,
});

const OTHER = [
  { n: "#05", concept: "Promises", difficulty: "Intermediate", task: "Convert the callback chain into an async function." },
  { n: "#06", concept: "React Hooks", difficulty: "Beginner", task: "Extract the fetch logic into a reusable custom hook." },
  { n: "#07", concept: "API Gateway", difficulty: "Advanced", task: "Add an auth header and handle a 401 response path." },
];

function Challenges() {
  const [code, setCode] = useState(CHALLENGE_CODE);
  const [hints, setHints] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  return (
    <AppShell title="Challenges">
      <PageHeader
        title="Test Your Understanding"
        subtitle="Change the code, not just your notes. Hints guide you — they never solve it for you."
      />

      <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <section className="panel p-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-sm text-muted-foreground">Challenge #04</span>
            <Chip tone="warning">Intermediate</Chip>
            <Chip tone="primary">Error Handling</Chip>
          </div>
          <h2 className="mt-4 text-lg font-semibold">
            Modify the function so that it gracefully handles an API request failure.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The caller should receive a safe value instead of an unhandled rejection.
          </p>

          <div className="mt-5">
            <CodeEditor code={code} onChange={setCode} />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => toast.success("Ran without runtime errors", { description: "1 test still failing: rejects on network error." })}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm transition-colors hover:border-border-strong"
            >
              <Play className="size-4" /> Run Code
            </button>
            <button
              onClick={() => {
                setSubmitted(true);
                toast.success("Submission evaluated");
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              <Send className="size-4" /> Submit
            </button>
            <button
              onClick={() => setHints((h) => Math.min(h + 1, HINTS.length))}
              className="inline-flex items-center gap-2 rounded-xl border border-cyan/30 bg-[color-mix(in_oklab,var(--cyan)_10%,transparent)] px-4 py-2.5 text-sm text-cyan transition-colors hover:bg-[color-mix(in_oklab,var(--cyan)_18%,transparent)]"
            >
              <Lightbulb className="size-4" /> Get Hint
            </button>
          </div>

          <AnimatePresence>
            {hints > 0 && (
              <motion.ul
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 space-y-2 overflow-hidden"
              >
                {HINTS.slice(0, hints).map((h, i) => (
                  <motion.li
                    key={h}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-muted-foreground"
                  >
                    <span className="mr-2 font-mono text-xs text-cyan">Hint {i + 1}</span>
                    {h}
                  </motion.li>
                ))}
                {hints === HINTS.length && (
                  <li className="px-1 text-xs text-muted-foreground">
                    That's every hint for this challenge.
                  </li>
                )}
              </motion.ul>
            )}
          </AnimatePresence>
        </section>

        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.section
                key="result"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="panel p-5"
              >
                <div className="flex items-center gap-2 text-success">
                  <Trophy className="size-4" />
                  <p className="text-sm font-semibold">Understanding Score</p>
                </div>
                <p className="mt-2 text-4xl font-semibold tracking-tight">86%</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Solid structure. Your catch block returns a fallback, but the loading flag
                  is still left on when the request fails.
                </p>
                <div className="mt-6 space-y-4">
                  <div>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span>Async/Await</span>
                      <span className="font-mono text-xs text-muted-foreground">91%</span>
                    </div>
                    <ProgressBar value={91} tone="success" />
                  </div>
                  <div>
                    <div className="mb-1.5 flex justify-between text-sm">
                      <span>Error Handling</span>
                      <span className="font-mono text-xs text-muted-foreground">58%</span>
                    </div>
                    <ProgressBar value={58} tone="warning" />
                  </div>
                </div>
              </motion.section>
            ) : (
              <motion.section
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="panel p-5 text-center"
              >
                <p className="text-sm font-medium">No submission yet</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Submit your solution to see an understanding score and per-concept
                  mastery breakdown.
                </p>
              </motion.section>
            )}
          </AnimatePresence>

          <section className="panel p-5">
            <h3 className="text-sm font-semibold">Up next</h3>
            <div className="mt-4 space-y-3">
              {OTHER.map((c) => (
                <div
                  key={c.n}
                  className="hover-lift rounded-xl border border-border bg-surface-2 p-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">
                      Challenge {c.n}
                    </span>
                    <Chip
                      tone={
                        c.difficulty === "Beginner"
                          ? "success"
                          : c.difficulty === "Advanced"
                            ? "danger"
                            : "warning"
                      }
                    >
                      {c.difficulty}
                    </Chip>
                  </div>
                  <p className="mt-2 text-sm">{c.task}</p>
                  <p className="mt-2 font-mono text-[11px] uppercase text-cyan">
                    {c.concept}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
