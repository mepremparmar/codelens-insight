import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Lightbulb, Play, Send, Trophy, CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { CodeEditor } from "@/components/code/CodeEditor";
import { Chip, ProgressBar } from "@/components/kit/primitives";
import { CHALLENGE_CODE, HINTS } from "@/lib/demo-data";
import { requestChallengeEvaluation } from "@/lib/api";
import { appStore, useAppStore } from "@/lib/store";

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

type ChallengeItem = {
  n: string;
  concept: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  task: string;
  initialCode: string;
  hints: string[];
};

const CHALLENGES_LIST: ChallengeItem[] = [
  {
    n: "#04",
    concept: "Error Handling",
    difficulty: "Intermediate",
    task: "Modify the function so that it gracefully handles an API request failure.",
    initialCode: CHALLENGE_CODE,
    hints: HINTS,
  },
  {
    n: "#05",
    concept: "Promises",
    difficulty: "Intermediate",
    task: "Convert the callback chain into an async function with proper error returns.",
    initialCode: `function getUserData(id, callback) {\n  fetch("/api/users/" + id)\n    .then((res) => res.json())\n    .then((data) => callback(null, data))\n    .catch((err) => callback(err, null));\n}`,
    hints: [
      "Use the async keyword before function parameters.",
      "Replace .then() chaining with await.",
      "Wrap the await statements in try/catch.",
    ],
  },
  {
    n: "#06",
    concept: "React Hooks",
    difficulty: "Beginner",
    task: "Add loading state and wrap the effect safely.",
    initialCode: `function UserProfile({ id }) {\n  const [user, setUser] = useState(null);\n  useEffect(() => {\n    fetchUser(id).then(setUser);\n  }, [id]);\n  return <div>{user?.name}</div>;\n}`,
    hints: [
      "Initialize a loading state with useState(true).",
      "Set loading to false inside a .finally() or after await.",
    ],
  },
  {
    n: "#07",
    concept: "API Gateway",
    difficulty: "Advanced",
    task: "Add an Authorization header and handle 401 unauthorized errors.",
    initialCode: `async function fetchProtected(token) {\n  const res = await fetch("/api/protected");\n  return await res.json();\n}`,
    hints: [
      "Add headers: { Authorization: 'Bearer ' + token } to fetch options.",
      "Check if res.status === 401 before parsing JSON.",
    ],
  },
];

function Challenges() {
  const storeState = useAppStore();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeChallenge = CHALLENGES_LIST[selectedIdx]!;

  const [code, setCode] = useState(activeChallenge.initialCode);
  const [hints, setHints] = useState(0);
  const [evaluating, setEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<{
    success: boolean;
    score: number;
    message: string;
    feedback: string;
    conceptScores: Record<string, number>;
  } | null>(null);

  const selectChallenge = (idx: number) => {
    setSelectedIdx(idx);
    const item = CHALLENGES_LIST[idx]!;
    setCode(item.initialCode);
    setHints(0);
    setEvalResult(null);
  };

  const handleRunCode = async () => {
    toast.info("Running syntax & pattern check…");
    const res = await requestChallengeEvaluation(activeChallenge.n, code);
    if (res.success) {
      toast.success("Code ran smoothly!", { description: "No syntax errors detected." });
    } else {
      toast.warning("Execution warning", { description: res.feedback });
    }
  };

  const handleSubmit = async () => {
    setEvaluating(true);
    try {
      const res = await requestChallengeEvaluation(activeChallenge.n, code);
      setEvalResult(res);
      if (res.success) {
        toast.success("Challenge Passed!", { description: res.message });
        appStore.completeChallenge(activeChallenge.n, res.score, res.conceptsAffected);
      } else {
        toast.error(res.message, { description: res.feedback });
      }
    } catch {
      toast.error("Evaluation error. Please try again.");
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <AppShell title="Challenges">
      <PageHeader
        title="Test Your Understanding"
        subtitle="Change the code, not just your notes. Hints guide you — they never solve it for you."
      />

      <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <section className="panel p-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-sm text-muted-foreground">
              Challenge {activeChallenge.n}
            </span>
            <Chip
              tone={
                activeChallenge.difficulty === "Beginner"
                  ? "success"
                  : activeChallenge.difficulty === "Advanced"
                    ? "danger"
                    : "warning"
              }
            >
              {activeChallenge.difficulty}
            </Chip>
            <Chip tone="primary">{activeChallenge.concept}</Chip>
            {storeState.completedChallenges.includes(activeChallenge.n) && (
              <span className="ml-auto flex items-center gap-1 font-mono text-xs text-success">
                <CheckCircle className="size-3.5" /> Completed ({storeState.challengeScores[activeChallenge.n] || 90}%)
              </span>
            )}
          </div>

          <h2 className="mt-4 text-lg font-semibold">{activeChallenge.task}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The caller should receive a safe value instead of an unhandled rejection.
          </p>

          <div className="mt-5">
            <CodeEditor code={code} onChange={setCode} />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={handleRunCode}
              disabled={evaluating}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-sm transition-colors hover:border-border-strong disabled:opacity-50"
            >
              <Play className="size-4" /> Run Code
            </button>

            <button
              onClick={handleSubmit}
              disabled={evaluating}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-50"
            >
              <Send className="size-4" /> {evaluating ? "Evaluating…" : "Submit"}
            </button>

            <button
              onClick={() => setHints((h) => Math.min(h + 1, activeChallenge.hints.length))}
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
                {activeChallenge.hints.slice(0, hints).map((h, i) => (
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
                {hints === activeChallenge.hints.length && (
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
            {evalResult ? (
              <motion.section
                key="result"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="panel p-5"
              >
                <div className="flex items-center gap-2 text-success">
                  <Trophy className="size-4" />
                  <p className="text-sm font-semibold">{evalResult.message}</p>
                </div>
                <p className="mt-2 text-4xl font-semibold tracking-tight">{evalResult.score}%</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {evalResult.feedback}
                </p>

                <div className="mt-6 space-y-4">
                  {Object.entries(evalResult.conceptScores).map(([name, sc]) => (
                    <div key={name}>
                      <div className="mb-1.5 flex justify-between text-sm">
                        <span>{name}</span>
                        <span className="font-mono text-xs text-muted-foreground">{sc}%</span>
                      </div>
                      <ProgressBar value={sc} tone={sc > 80 ? "success" : "warning"} />
                    </div>
                  ))}
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
                  Submit your solution to see an understanding score and per-concept mastery breakdown.
                </p>
              </motion.section>
            )}
          </AnimatePresence>

          <section className="panel p-5">
            <h3 className="text-sm font-semibold">Select Challenge</h3>
            <div className="mt-4 space-y-3">
              {CHALLENGES_LIST.map((c, idx) => {
                const isSelected = idx === selectedIdx;
                const isDone = storeState.completedChallenges.includes(c.n);
                return (
                  <button
                    key={c.n}
                    onClick={() => selectChallenge(idx)}
                    className={`w-full text-left rounded-xl border p-4 transition-all ${
                      isSelected
                        ? "border-primary/50 bg-surface-2"
                        : "border-border bg-surface hover:border-border-strong"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-muted-foreground">
                        Challenge {c.n}
                      </span>
                      <div className="flex items-center gap-2">
                        {isDone && <CheckCircle className="size-3.5 text-success" />}
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
                    </div>
                    <p className="mt-2 text-sm">{c.task}</p>
                    <p className="mt-2 font-mono text-[11px] uppercase text-cyan">
                      {c.concept}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
