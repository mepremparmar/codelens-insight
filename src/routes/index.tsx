import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  Boxes,
  BrainCircuit,
  ChevronDown,
  ClipboardPaste,
  Code2,
  GitBranch,
  GraduationCap,
  ListChecks,
  Play,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Workflow,
} from "lucide-react";
import { useState } from "react";
import { CodeEditor } from "@/components/code/CodeEditor";
import { Logo } from "@/components/app/AppShell";
import { Chip, SectionLabel } from "@/components/kit/primitives";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CodeLens AI — Stop copying code. Start understanding it." },
      {
        name: "description",
        content:
          "CodeLens AI turns source code into visual explanations, interactive questions and coding challenges for students and early-career developers.",
      },
      {
        property: "og:title",
        content: "CodeLens AI — Stop copying code. Start understanding it.",
      },
      {
        property: "og:description",
        content:
          "An AI learning platform that transforms code into concepts, execution flows, challenges and measurable understanding.",
      },
    ],
  }),
  component: Landing,
});

const HERO_CODE = `async function fetchUser(id) {
  try {
    const res = await fetch(\`/api/users/\${id}\`);
    if (!res.ok) throw new Error("Request failed");
    const json = await res.json();
    return json.data;
  } catch (err) {
    return null;
  }
}`;

const DETECTED = [
  "ASYNC/AWAIT",
  "API REQUEST",
  "PROMISE",
  "JSON",
  "ERROR HANDLING",
];

const NAV_LINKS = [
  { label: "Product", href: "#product" },
  { label: "How It Works", href: "#how" },
  { label: "Features", href: "#features" },
  { label: "For Students", href: "#students" },
  { label: "FAQ", href: "#faq" },
];

const STEPS = [
  {
    n: "01",
    title: "Paste Your Code",
    icon: ClipboardPaste,
    text: "Drop in a file or a snippet from any project you're trying to understand.",
  },
  {
    n: "02",
    title: "AI Understands It",
    icon: BrainCircuit,
    text: "CodeLens reads structure, intent and the concepts hiding behind the syntax.",
  },
  {
    n: "03",
    title: "Visualize the Logic",
    icon: Workflow,
    text: "See execution and data flow as a diagram tied to the exact lines involved.",
  },
  {
    n: "04",
    title: "Test Your Understanding",
    icon: ListChecks,
    text: "Answer targeted questions instead of passively reading an explanation.",
  },
  {
    n: "05",
    title: "Build Your Skills",
    icon: Rocket,
    text: "Modify real code in challenges and watch your concept mastery move.",
  },
];

const FEATURES = [
  {
    icon: Code2,
    title: "Line-level concept mapping",
    text: "Every detected concept links back to the exact lines that produced it.",
  },
  {
    icon: GitBranch,
    title: "Execution flow diagrams",
    text: "Follow a request from user action to parsed response, node by node.",
  },
  {
    icon: GraduationCap,
    title: "Socratic AI tutor",
    text: "The tutor asks before it answers, so you build the mental model yourself.",
  },
  {
    icon: Target,
    title: "Progressive hints",
    text: "Hints nudge your thinking in stages and never hand over the solution.",
  },
  {
    icon: Boxes,
    title: "Concept library",
    text: "From Promises to API Gateway — with mastery tracked across every topic.",
  },
  {
    icon: ShieldCheck,
    title: "Measurable understanding",
    text: "Understanding scores and mastery charts show what to practise next.",
  },
];

const FAQS = [
  {
    q: "Is CodeLens AI just another AI chatbot?",
    a: "No. Chat is one small part. The core loop is code → concepts → visual execution → question → challenge → understanding score, so learning is measured rather than assumed.",
  },
  {
    q: "Which languages are supported?",
    a: "JavaScript, TypeScript, Python, Java, React and HTML/CSS today, with cloud-specific analysis for AWS services such as Lambda, API Gateway and DynamoDB.",
  },
  {
    q: "Do I need to be an experienced developer?",
    a: "Not at all. Explanations adapt to beginner, intermediate and advanced levels, and the onboarding flow builds a learning path around your goals.",
  },
  {
    q: "How is my progress calculated?",
    a: "From challenge submissions, quiz answers and repeat exposure to concepts. Weak areas surface automatically with practice suggestions.",
  },
];

function HeroDemo() {
  const [analyzed, setAnalyzed] = useState(false);
  const highlight = analyzed ? [3, 4, 5, 7] : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="panel relative overflow-hidden p-4 sm:p-5"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-destructive/70" />
          <span className="size-2.5 rounded-full bg-warning/70" />
          <span className="size-2.5 rounded-full bg-success/70" />
          <span className="ml-2 font-mono text-xs text-muted-foreground">
            fetchUser.ts
          </span>
        </div>
        <button
          onClick={() => setAnalyzed((v) => !v)}
          onMouseEnter={() => setAnalyzed(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-primary/35 bg-[color-mix(in_oklab,var(--primary)_16%,transparent)] px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-[color-mix(in_oklab,var(--primary)_24%,transparent)]"
        >
          <Play className="size-3" />
          {analyzed ? "Reset" : "Analyze"}
        </button>
      </div>

      <CodeEditor code={HERO_CODE} highlight={highlight} maxHeight="15rem" />

      <AnimatePresence>
        {analyzed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Concepts detected
              </p>
              <div className="flex flex-wrap gap-1.5">
                {DETECTED.map((c, i) => (
                  <motion.span
                    key={c}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.07 }}
                  >
                    <Chip tone="primary">{c}</Chip>
                  </motion.span>
                ))}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                  className="rounded-xl border border-border bg-surface-2 p-3"
                >
                  <p className="mb-2 text-[11px] font-medium text-cyan">Execution flow</p>
                  <ol className="space-y-1 font-mono text-[11px] text-muted-foreground">
                    {["fetchUser()", "API Request", "Await Response", "Parse JSON"].map(
                      (s, i) => (
                        <motion.li
                          key={s}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 + i * 0.1 }}
                        >
                          ↓ {s}
                        </motion.li>
                      ),
                    )}
                  </ol>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 }}
                  className="rounded-xl border border-border bg-surface-2 p-3"
                >
                  <p className="mb-2 flex items-center gap-1.5 text-[11px] font-medium text-primary">
                    <Sparkles className="size-3" /> AI explanation
                  </p>
                  <p className="text-[12px] leading-relaxed text-muted-foreground">
                    This function requests a user over HTTP, waits for the Promise to
                    settle, then converts the body from JSON. The try/catch keeps a failed
                    request from crashing the caller.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Landing() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/dashboard"
              className="hidden rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
            >
              Sign In
            </Link>
            <Link
              to="/onboarding"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.99]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <section
        id="product"
        className="relative overflow-hidden border-b border-border"
        style={{ backgroundImage: "var(--gradient-hero)" }}
      >
        <div className="grid-bg absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:px-8 lg:py-28">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SectionLabel>AI-powered code learning</SectionLabel>
              <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                Stop copying code.
                <br />
                <span className="text-gradient">Start understanding it.</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                CodeLens AI transforms complex code into visual explanations,
                interactive questions, personalized challenges, and measurable learning.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/analyze"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-[1.02] active:scale-[0.99]"
                >
                  <Code2 className="size-4" />
                  Analyze My Code
                </Link>
                <a
                  href="#how"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 text-sm font-medium transition-colors hover:border-border-strong"
                >
                  See How It Works
                </a>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                <span>12k+ students</span>
                <span className="hidden h-3 w-px bg-border sm:block" />
                <span>340k analyses</span>
                <span className="hidden h-3 w-px bg-border sm:block" />
                <span>JS · TS · Python · Java · AWS</span>
              </div>
            </motion.div>
          </div>
          <HeroDemo />
        </div>
      </section>

      <section id="how" className="border-b border-border py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <SectionLabel>How it works</SectionLabel>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              A learning loop, not a one-shot answer.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Five steps that take you from unfamiliar code to demonstrated understanding.
            </p>
          </div>

          <div className="relative mt-14">
            <div className="absolute left-0 right-0 top-[42px] hidden h-px bg-gradient-to-r from-transparent via-border-strong to-transparent lg:block" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {STEPS.map((s, i) => (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="relative"
                >
                  <div className="relative z-10 mb-5 grid size-12 place-items-center rounded-2xl border border-border bg-surface text-primary">
                    <s.icon className="size-5" />
                  </div>
                  <p className="font-mono text-xs text-cyan">{s.n}</p>
                  <h3 className="mt-1 text-base font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {s.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-b border-border py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <SectionLabel>Features</SectionLabel>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Built for understanding, not autocomplete.
            </h2>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: (i % 3) * 0.07, duration: 0.45 }}
                className="panel hover-lift p-6"
              >
                <span className="mb-4 inline-grid size-10 place-items-center rounded-xl border border-border bg-surface-2 text-cyan">
                  <f.icon className="size-4" />
                </span>
                <h3 className="text-base font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="students" className="border-b border-border py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <SectionLabel>For students</SectionLabel>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Made for the gap between tutorials and real projects.
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Most learners can follow a tutorial but stall the moment they open an
              unfamiliar repository. CodeLens closes that gap by explaining real code you
              already care about — then proving you understood it.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "CS students decoding assignment starter code",
                "Beginners moving from syntax to system thinking",
                "Developers learning cloud, AWS and AI services",
                "Early-career engineers preparing for interviews",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-cyan" />
                  <span className="text-muted-foreground">{t}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/onboarding"
              className="mt-8 inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-3 text-sm font-medium transition-colors hover:border-border-strong"
            >
              Create my learning path
            </Link>
          </div>
          <div className="panel p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              The loop
            </p>
            <div className="mt-5 space-y-2.5">
              {[
                "Code",
                "Concepts",
                "Visual execution",
                "AI explanation",
                "Interactive question",
                "Coding challenge",
                "Understanding score",
                "Personalized learning",
              ].map((s, i) => (
                <motion.div
                  key={s}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3 rounded-xl border border-border bg-surface-2 px-4 py-2.5"
                >
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm">{s}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Questions, answered.
          </h2>
          <div className="mt-10 space-y-3">
            {FAQS.map((f, i) => (
              <div key={f.q} className="panel overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-medium">{f.q}</span>
                  <ChevronDown
                    className={`size-4 shrink-0 text-muted-foreground transition-transform ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:px-6 lg:flex-row lg:px-8">
          <Logo />
          <p className="text-xs text-muted-foreground">
            © 2026 CodeLens AI — Understand the code. Master the concept.
          </p>
        </div>
      </footer>
    </div>
  );
}
