import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/app/AppShell";
import { ConceptCard } from "@/components/kit/ConceptCard";
import { CONCEPTS, CONCEPT_CATEGORIES } from "@/lib/demo-data";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/concepts")({
  head: () => ({
    meta: [
      { title: "Concept Library — CodeLens AI" },
      {
        name: "description",
        content:
          "A searchable library of programming, web, cloud, AWS, AI and database concepts with mastery tracking.",
      },
      { property: "og:title", content: "Concept Library — CodeLens AI" },
      {
        property: "og:description",
        content: "Browse concepts by category and track your mastery of each one.",
      },
    ],
  }),
  component: Concepts,
});

function Concepts() {
  const storeState = useAppStore();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(
    () =>
      CONCEPTS.filter(
        (c) =>
          (category === "All" || c.category === category) &&
          (c.name.toLowerCase().includes(query.toLowerCase()) ||
            c.summary.toLowerCase().includes(query.toLowerCase())),
      ),
    [query, category],
  );

  return (
    <AppShell title="Concepts">
      <PageHeader
        title="Concept Library"
        subtitle="Every concept CodeLens can detect — with your current mastery on each."
      />

      <div className="mb-6 space-y-4">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search concepts…"
            className="h-10 w-full rounded-xl border border-border bg-surface pl-9 pr-3 text-sm outline-none focus:border-primary/50"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CONCEPT_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                category === c
                  ? "border-primary/40 bg-[color-mix(in_oklab,var(--primary)_16%,transparent)] text-primary"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="panel p-12 text-center">
          <p className="text-sm font-medium">No concepts match that search.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a broader term, or switch category back to All.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c, i) => {
            const masteryVal = storeState.conceptMastery[c.id] ?? c.mastery;
            return (
              <ConceptCard
                key={c.id}
                concept={{
                  ...c,
                  mastery: masteryVal,
                }}
                index={i}
                ctaLabel="Start Learning"
                onSelect={() => {
                  toast(`Starting lesson on ${c.name}`);
                  navigate({ to: "/analyze" });
                }}
              />
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
