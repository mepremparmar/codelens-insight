import { cn } from "@/lib/utils";
import { useMemo } from "react";

const KEYWORDS =
  /\b(import|from|export|default|const|let|var|function|return|async|await|new|try|catch|finally|throw|if|else|for|while|class|extends|interface|type|of|in|typeof|null|undefined|true|false|def|self|print|public|static|void)\b/;

type Token = { text: string; cls: string };

function tokenizeLine(line: string): Token[] {
  const trimmed = line.trimStart();
  if (trimmed.startsWith("//") || trimmed.startsWith("#")) {
    return [{ text: line, cls: "tok-com" }];
  }
  const parts = line.split(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[^`]*`)/g);
  const out: Token[] = [];
  for (const part of parts) {
    if (!part) continue;
    if (/^["'`]/.test(part)) {
      out.push({ text: part, cls: "tok-str" });
      continue;
    }
    for (const word of part.split(/(\W)/g)) {
      if (!word) continue;
      if (KEYWORDS.test(word)) out.push({ text: word, cls: "tok-key" });
      else if (/^\d+$/.test(word)) out.push({ text: word, cls: "tok-num" });
      else if (/^[A-Za-z_$][\w$]*$/.test(word)) out.push({ text: word, cls: "" });
      else out.push({ text: word, cls: "tok-punc" });
    }
  }
  return out;
}

export function CodeEditor({
  code,
  onChange,
  highlight = [],
  className,
  maxHeight = "26rem",
}: {
  code: string;
  onChange?: (value: string) => void;
  highlight?: number[];
  className?: string;
  maxHeight?: string;
}) {
  const lines = useMemo(() => code.split("\n"), [code]);

  if (onChange) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-xl border border-border bg-[oklch(0.14_0.014_275)]",
          className,
        )}
      >
        <textarea
          spellCheck={false}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full resize-none bg-transparent p-4 font-mono text-[13px] leading-6 text-foreground outline-none"
          style={{ minHeight: "14rem" }}
          aria-label="Code editor"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-auto rounded-xl border border-border bg-[oklch(0.14_0.014_275)]",
        className,
      )}
      style={{ maxHeight }}
    >
      <pre className="min-w-max p-0 font-mono text-[13px] leading-6">
        <code>
          {lines.map((line, i) => {
            const n = i + 1;
            const active = highlight.includes(n);
            return (
              <div
                key={n}
                className={cn(
                  "flex px-1 transition-colors duration-300",
                  active &&
                    "bg-[color-mix(in_oklab,var(--primary)_16%,transparent)] shadow-[inset_2px_0_0_0_var(--primary)]",
                )}
              >
                <span className="w-10 shrink-0 select-none pr-3 text-right text-muted-foreground/50">
                  {n}
                </span>
                <span className="whitespace-pre pr-6">
                  {tokenizeLine(line).map((t, j) => (
                    <span key={j} className={t.cls}>
                      {t.text}
                    </span>
                  ))}
                </span>
              </div>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
