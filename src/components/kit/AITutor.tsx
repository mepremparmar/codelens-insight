import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CornerDownLeft, Sparkles, X } from "lucide-react";
import { useState } from "react";

type Msg = { role: "ai" | "student"; text: string };

const QUIZ = {
  question: "Before I explain further, what do you think happens if the API request fails?",
  options: [
    { id: "A", text: "The function returns undefined silently." },
    { id: "B", text: "The awaited Promise rejects and throws inside the async function." },
    { id: "C", text: "The browser retries the request automatically." },
    { id: "D", text: "Nothing — await ignores failed requests." },
  ],
  correct: "B",
  feedback:
    "Great! You understand the relationship between async/await and Promises. A rejected Promise becomes a thrown error at the await point — which is exactly why try/catch matters here.",
};

const SUGGESTIONS = [
  "Why are we using await here?",
  "What happens if res.json() fails?",
  "How would AWS Lambda handle this?",
];

export function AITutor({ className }: { className?: string }) {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "student", text: "Why are we using await here?" },
    {
      role: "ai",
      text: "`await` pauses the execution of this async function until the Promise returned by `fetch` resolves. The rest of the browser keeps running — only this function waits. Without it you'd hold a pending Promise instead of the response.",
    },
  ]);
  const [answer, setAnswer] = useState<string | null>(null);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [
      ...m,
      { role: "student", text },
      {
        role: "ai",
        text: "Good question. In this file that behaviour is driven by the `analyze` callback: it awaits the network round-trip, then hands the parsed JSON to React state so the component re-renders with real data.",
      },
    ]);
    setInput("");
  };

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <span className="grid size-9 place-items-center rounded-xl border border-primary/30 bg-[color-mix(in_oklab,var(--primary)_16%,transparent)] text-primary">
          <Sparkles className="size-4" />
        </span>
        <div>
          <p className="text-sm font-semibold">CodeLens Tutor</p>
          <p className="text-xs text-muted-foreground">Ask me anything about this code.</p>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto py-5">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("flex", m.role === "student" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl border px-4 py-3 text-sm leading-relaxed",
                m.role === "student"
                  ? "border-primary/25 bg-[color-mix(in_oklab,var(--primary)_14%,transparent)]"
                  : "border-border bg-surface-2 text-muted-foreground",
              )}
            >
              {m.text}
            </div>
          </motion.div>
        ))}

        <div className="rounded-2xl border border-cyan/25 bg-[color-mix(in_oklab,var(--cyan)_8%,var(--surface))] p-4">
          <p className="text-sm font-medium">{QUIZ.question}</p>
          <div className="mt-3 space-y-2">
            {QUIZ.options.map((o) => {
              const chosen = answer === o.id;
              const isCorrect = o.id === QUIZ.correct;
              return (
                <button
                  key={o.id}
                  disabled={!!answer}
                  onClick={() => setAnswer(o.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-all",
                    !answer && "border-border bg-surface hover:border-primary/40",
                    answer &&
                      isCorrect &&
                      "border-success/50 bg-[color-mix(in_oklab,var(--success)_12%,transparent)]",
                    answer &&
                      chosen &&
                      !isCorrect &&
                      "border-destructive/50 bg-[color-mix(in_oklab,var(--destructive)_12%,transparent)]",
                    answer && !chosen && !isCorrect && "border-border opacity-50",
                  )}
                >
                  <span className="grid size-6 shrink-0 place-items-center rounded-md border border-border font-mono text-[11px]">
                    {o.id}
                  </span>
                  <span className="flex-1">{o.text}</span>
                  {answer && isCorrect && <Check className="size-4 text-success" />}
                  {answer && chosen && !isCorrect && (
                    <X className="size-4 text-destructive" />
                  )}
                </button>
              );
            })}
          </div>
          <AnimatePresence>
            {answer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="overflow-hidden"
              >
                <p className="pt-3 text-sm leading-relaxed text-success">
                  {answer === QUIZ.correct
                    ? `✓ Correct — ${QUIZ.feedback}`
                    : "Not quite — the awaited Promise rejects, which throws inside the async function. That's why try/catch is the fix."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 focus-within:border-primary/50"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a line, a concept, or a failure case…"
            className="h-8 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            className="rounded-lg border border-border bg-surface-2 p-1.5 text-muted-foreground transition-colors hover:text-primary"
            aria-label="Send question"
          >
            <CornerDownLeft className="size-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
