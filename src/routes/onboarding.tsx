import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/app/AppShell";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Get Started — CodeLens AI" },
      {
        name: "description",
        content:
          "Answer three questions and CodeLens AI builds a personalized learning path around your goals.",
      },
      { property: "og:title", content: "Get Started — CodeLens AI" },
      {
        property: "og:description",
        content: "Create your personalized learning path in three quick steps.",
      },
    ],
  }),
  component: Onboarding,
});

const STEPS = [
  {
    title: "What are you learning?",
    multi: true,
    options: ["JavaScript", "Python", "Java", "React", "AWS", "AI/ML", "Other"],
  },
  {
    title: "What's your experience?",
    multi: false,
    options: ["Beginner", "Intermediate", "Advanced"],
  },
  {
    title: "What do you want to achieve?",
    multi: true,
    options: [
      "Understand existing code",
      "Improve debugging",
      "Learn cloud",
      "Prepare for interviews",
      "Build projects",
    ],
  },
];

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[][]>([[], [], []]);
  const current = STEPS[step]!;

  const toggle = (opt: string) => {
    setAnswers((prev) => {
      const next = prev.map((a) => [...a]);
      const list = next[step]!;
      if (current.multi) {
        next[step] = list.includes(opt) ? list.filter((o) => o !== opt) : [...list, opt];
      } else {
        next[step] = [opt];
      }
      return next;
    });
  };

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4 py-12">
      <div className="w-full max-w-xl">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="mb-6 flex gap-2">
          {STEPS.map((_, i) => (
            <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full bg-primary"
                animate={{ width: i <= step ? "100%" : "0%" }}
                transition={{ duration: 0.4 }}
              />
            </div>
          ))}
        </div>

        <div className="panel p-6 sm:p-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan">
            Step {step + 1} of {STEPS.length}
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
            >
              <h1 className="mt-2 text-2xl font-semibold tracking-tight">
                {current.title}
              </h1>
              <div className="mt-6 flex flex-wrap gap-2">
                {current.options.map((o) => {
                  const active = answers[step]!.includes(o);
                  return (
                    <button
                      key={o}
                      onClick={() => toggle(o)}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition-all",
                        active
                          ? "border-primary/45 bg-[color-mix(in_oklab,var(--primary)_16%,transparent)] text-foreground"
                          : "border-border bg-surface-2 text-muted-foreground hover:border-border-strong hover:text-foreground",
                      )}
                    >
                      {active && <Check className="size-3.5 text-primary" />}
                      {o}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
            >
              <ArrowLeft className="size-4" /> Back
            </button>
            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                Continue <ArrowRight className="size-4" />
              </button>
            ) : (
              <button
                onClick={() => navigate({ to: "/dashboard" })}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-[1.02]"
              >
                Create My Learning Path <ArrowRight className="size-4" />
              </button>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link to="/dashboard" className="text-primary hover:text-cyan">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
