import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CornerDownLeft, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { requestTutorAnswer } from "@/lib/api";

type Msg = { role: "ai" | "student"; text: string };

type QuizType = {
  question: string;
  options: Array<{ id: string; text: string }>;
  correct: string;
  feedback: string;
};

const DEFAULT_QUIZ: QuizType = {
  question: "What determines the primary execution flow of this code snippet?",
  options: [
    { id: "A", text: "Sequential evaluation of expressions and branching control flow." },
    { id: "B", text: "Randomized thread execution order." },
    { id: "C", text: "Automatic server deployment on load." },
    { id: "D", text: "Garbage collection allocation frequencies." },
  ],
  correct: "A",
  feedback: "Correct! Statements execute top-to-bottom through scope and control structures.",
};

export function AITutor({
  code = "",
  language = "JavaScript",
  quiz = DEFAULT_QUIZ,
  className,
}: {
  code?: string;
  language?: string;
  quiz?: QuizType;
  className?: string;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [answer, setAnswer] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeQuiz = quiz || DEFAULT_QUIZ;

  // Initialize tutor welcome message whenever code or language changes
  useEffect(() => {
    setAnswer(null);

    const firstLine = code.split("\n").find((l) => l.trim().length > 0)?.trim() || "";
    const fnMatch = code.match(/(def\s+\w+|function\s+\w+|class\s+\w+|const\s+\w+)/);
    const fnName = fnMatch ? fnMatch[0] : "";

    const initialAiMsg = fnName
      ? `Hello! I'm your CodeLens Tutor. I see you're working with **${language}** and defined \`${fnName}\`. Ask me about any line, concept, or failure case!`
      : `Hello! I'm your CodeLens Tutor for **${language}**. Ask me anything about this code or how to improve it!`;

    setMessages([
      { role: "ai", text: initialAiMsg },
    ]);

    setDynamicSuggestions([
      firstLine ? "Explain line 1" : "Explain the first line",
      code.includes("try") || code.includes("catch") || code.includes("except")
        ? "How does error handling work here?"
        : "How do I add error handling?",
      code.includes("async") || code.includes("await") || code.includes("def")
        ? "What is the execution flow?"
        : "How can I refactor this snippet?",
    ]);
  }, [code, language, quiz]);

  // Scroll to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setMessages((m) => [...m, { role: "student", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await requestTutorAnswer(text, code, language);
      setMessages((m) => [...m, { role: "ai", text: res.text }]);
      if (res.suggestedNext && res.suggestedNext.length > 0) {
        setDynamicSuggestions(res.suggestedNext);
      }
    } catch {
      setMessages((m) => [
        ...m,
        { role: "ai", text: `I'm analyzing your ${language} code. Feel free to ask about specific line numbers or functions!` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <span className="grid size-9 place-items-center rounded-xl border border-primary/30 bg-[color-mix(in_oklab,var(--primary)_16%,transparent)] text-primary">
          <Sparkles className="size-4" />
        </span>
        <div>
          <p className="text-sm font-semibold">CodeLens AI Tutor</p>
          <p className="text-xs text-muted-foreground">Connected to active {language} workspace.</p>
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
                "max-w-[85%] rounded-2xl border px-4 py-3 text-sm leading-relaxed whitespace-pre-line",
                m.role === "student"
                  ? "border-primary/25 bg-[color-mix(in_oklab,var(--primary)_14%,transparent)] text-foreground"
                  : "border-border bg-surface-2 text-muted-foreground",
              )}
            >
              {m.text}
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface-2 px-4 py-3 text-xs text-muted-foreground">
              <span className="size-2 animate-ping rounded-full bg-primary" /> Analyzing snippet…
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-cyan/25 bg-[color-mix(in_oklab,var(--cyan)_8%,var(--surface))] p-4">
          <p className="text-xs font-mono uppercase tracking-wider text-cyan mb-1">Concept Quiz</p>
          <p className="text-sm font-medium">{activeQuiz.question}</p>
          <div className="mt-3 space-y-2">
            {activeQuiz.options.map((o) => {
              const chosen = answer === o.id;
              const isCorrect = o.id === activeQuiz.correct;
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
                      "border-success/50 bg-[color-mix(in_oklab,var(--success)_12%,transparent)] text-foreground",
                    answer &&
                      chosen &&
                      !isCorrect &&
                      "border-destructive/50 bg-[color-mix(in_oklab,var(--destructive)_12%,transparent)] text-foreground",
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
                  {answer === activeQuiz.correct
                    ? `✓ Correct — ${activeQuiz.feedback}`
                    : `Not quite — ${activeQuiz.feedback || "Review the execution flow for this snippet."}`}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div ref={chatEndRef} />
      </div>

      <div className="border-t border-border pt-4">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {dynamicSuggestions.map((s) => (
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
            placeholder={`Ask about line numbers, ${language} concepts, or error guards…`}
            className="h-8 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg border border-border bg-surface-2 p-1.5 text-muted-foreground transition-colors hover:text-primary disabled:opacity-50"
            aria-label="Send question"
          >
            <CornerDownLeft className="size-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
