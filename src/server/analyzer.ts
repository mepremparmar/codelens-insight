import type { AnalysisResult } from "../lib/store";
import { CONCEPTS } from "../lib/demo-data";

export function analyzeCode(code: string, language: string, fileName?: string): AnalysisResult {
  const lines = code.split("\n");
  const lineCount = lines.length;

  const detectedConcepts: AnalysisResult["concepts"] = [];
  const flowSteps: AnalysisResult["flow"] = [];
  const explanations: string[] = [];

  // Line detection logic
  const findLineIndexes = (patterns: RegExp[]): number[] => {
    const matched: number[] = [];
    lines.forEach((line, idx) => {
      if (patterns.some((p) => p.test(line))) {
        matched.push(idx + 1);
      }
    });
    return matched.length > 0 ? matched : [1];
  };

  // 1. Async/Await & Promises
  const asyncLines = findLineIndexes([/\basync\b/, /\bawait\b/]);
  const fetchLines = findLineIndexes([/\bfetch\b/, /axios/, /http\.get/i, /requests\./]);
  const errorLines = findLineIndexes([/\btry\b/, /\bcatch\b/, /except\b/, /throw\b/, /reject/]);
  const jsonLines = findLineIndexes([/\.json\(\)/, /JSON\.parse/, /JSON\.stringify/, /jsonify/]);
  const hookLines = findLineIndexes([/useState/, /useEffect/, /useCallback/, /useMemo/, /useRef/]);
  const classLines = findLineIndexes([/class\s+/, /public\s+class/, /interface\s+/]);
  const cloudLines = findLineIndexes([/aws/i, /lambda/i, /s3/i, /dynamodb/i, /gateway/i, /cloud/i]);

  // Map to predefined CONCEPTS or dynamic concepts
  if (asyncLines.length > 0) {
    const c = CONCEPTS.find((x) => x.id === "async-await");
    if (c) detectedConcepts.push({ ...c, lines: asyncLines });
  }

  if (fetchLines.length > 0) {
    const c = CONCEPTS.find((x) => x.id === "rest-api");
    if (c) detectedConcepts.push({ ...c, lines: fetchLines });
  }

  if (asyncLines.length > 0 || fetchLines.length > 0) {
    const c = CONCEPTS.find((x) => x.id === "promises");
    if (c) detectedConcepts.push({ ...c, lines: Array.from(new Set([...asyncLines, ...fetchLines])) });
  }

  if (jsonLines.length > 0) {
    const c = CONCEPTS.find((x) => x.id === "json");
    if (c) detectedConcepts.push({ ...c, lines: jsonLines });
  }

  if (errorLines.length > 0) {
    const c = CONCEPTS.find((x) => x.id === "error-handling");
    if (c) detectedConcepts.push({ ...c, lines: errorLines });
  } else {
    // Flag missing error handling as a learning topic
    const c = CONCEPTS.find((x) => x.id === "error-handling");
    if (c) detectedConcepts.push({ ...c, summary: "Not explicitly implemented here — consider adding try/catch.", lines: [1] });
  }

  if (hookLines.length > 0) {
    const c = CONCEPTS.find((x) => x.id === "react-hooks");
    if (c) detectedConcepts.push({ ...c, lines: hookLines });

    const c2 = CONCEPTS.find((x) => x.id === "state-management");
    if (c2) detectedConcepts.push({ ...c2, lines: hookLines });
  }

  if (cloudLines.length > 0) {
    const c = CONCEPTS.find((x) => x.id === "aws-lambda");
    if (c) detectedConcepts.push({ ...c, lines: cloudLines });
  }

  // Fallback concepts if snippet is brief
  if (detectedConcepts.length === 0) {
    detectedConcepts.push(
      {
        id: "core-syntax",
        name: "Core Syntax & Logic",
        category: "Programming",
        difficulty: "Beginner",
        mastery: 85,
        summary: "Fundamental control flow, function calls, or declarations.",
        lines: [1],
      },
      {
        id: "data-structures",
        name: "Variables & State",
        category: "Programming",
        difficulty: "Beginner",
        mastery: 80,
        summary: "Declaring and passing data across functional boundaries.",
        lines: [1],
      },
    );
  }

  // Complexity & Difficulty Calculation
  let complexityScore = lineCount * 2 + detectedConcepts.length * 10;
  if (errorLines.length > 0) complexityScore += 10;
  if (cloudLines.length > 0) complexityScore += 15;

  const complexity: AnalysisResult["complexity"] =
    complexityScore > 65 ? "High" : complexityScore > 35 ? "Medium" : "Low";

  const difficulty: AnalysisResult["difficulty"] =
    complexity === "High" ? "Advanced" : complexity === "Medium" ? "Intermediate" : "Beginner";

  const score = Math.min(98, Math.max(60, 100 - lineCount + detectedConcepts.length * 4));

  // Build Execution Flow
  flowSteps.push({
    id: "step-1",
    label: "Execution Entry",
    detail: `Program starts execution at line 1 of ${fileName || "snippet"}.`,
    lines: [1],
  });

  if (hookLines.length > 0) {
    flowSteps.push({
      id: "step-2",
      label: "Component Mount / State Init",
      detail: "State hooks initialize local component memory.",
      lines: hookLines,
    });
  }

  if (fetchLines.length > 0 || asyncLines.length > 0) {
    flowSteps.push({
      id: "step-3",
      label: "Async Request Dispatch",
      detail: "Asynchronous task or network request is dispatched to the event loop.",
      lines: fetchLines.length > 0 ? fetchLines : asyncLines,
    });
    flowSteps.push({
      id: "step-4",
      label: "Await Promise Settlement",
      detail: "Function pauses execution while waiting for the response to resolve.",
      lines: asyncLines,
    });
  }

  if (jsonLines.length > 0) {
    flowSteps.push({
      id: "step-5",
      label: "Parse Data & Serialization",
      detail: "Response payload is parsed into native data structures.",
      lines: jsonLines,
    });
  }

  if (errorLines.length > 0) {
    flowSteps.push({
      id: "step-6",
      label: "Error Guard Execution",
      detail: "Exceptions are intercepted by error handling blocks.",
      lines: errorLines,
    });
  }

  flowSteps.push({
    id: "step-last",
    label: "Return / Re-render",
    detail: "Function produces its final return value or triggers a UI re-render.",
    lines: [lineCount > 0 ? lineCount : 1],
  });

  // Explanations
  explanations.push(
    `This snippet contains ${lineCount} lines of ${language} code with ${detectedConcepts.length} detected architectural concepts.`,
  );
  if (asyncLines.length > 0) {
    explanations.push(
      `Asynchronous flow is managed using \`async/await\` on lines ${asyncLines.join(", ")}, allowing asynchronous tasks to read sequentially without callback nesting.`,
    );
  }
  if (fetchLines.length > 0) {
    explanations.push(
      `Network communication occurs around line ${fetchLines[0]}, retrieving resources over HTTP.`,
    );
  }
  if (errorLines.length === 0 && (asyncLines.length > 0 || fetchLines.length > 0)) {
    explanations.push(
      `Note: There is no explicit try/catch block around your network operations. Adding error handling prevents unhandled rejections if connection fails.`,
    );
  } else if (errorLines.length > 0) {
    explanations.push(
      `Error handling is properly set up around line ${errorLines[0]} to catch exceptions cleanly.`,
    );
  }

  // Project title derivation
  const firstLineComment = lines[0]?.replace(/^(\/\/\s*|#\s*|\/\*\s*)/, "").replace(/\*\/$/, "").trim();
  const projectName =
    fileName ||
    (firstLineComment && firstLineComment.length < 35 ? firstLineComment : `${language} Snippet #${Math.floor(Math.random() * 899 + 100)}`);

  // Quiz generation
  const hasErrorHandling = errorLines.length > 0;
  const quiz = {
    question: hasErrorHandling
      ? "How does the catch block in this code benefit runtime stability?"
      : "What will happen if the network request fails in this code?",
    options: hasErrorHandling
      ? [
          { id: "A", text: "It prevents the application from crashing on network error." },
          { id: "B", text: "It speeds up HTTP request execution." },
          { id: "C", text: "It automatically retries the request 3 times." },
          { id: "D", text: "It converts JSON into XML format." },
        ]
      : [
          { id: "A", text: "It will throw an unhandled Promise rejection." },
          { id: "B", text: "It will automatically return an empty array." },
          { id: "C", text: "The browser will quietly ignore it." },
          { id: "D", text: "It will reload the web page." },
        ],
    correct: "A",
    feedback: hasErrorHandling
      ? "Correct! The catch block intercepts exceptions thrown during execution, preventing unhandled crashes."
      : "Correct! Without try/catch, a network failure produces an unhandled Promise rejection.",
  };

  return {
    id: `anl_${Date.now()}`,
    project: projectName,
    language,
    code,
    complexity,
    difficulty,
    score,
    when: "Just now",
    explanation: explanations,
    concepts: detectedConcepts,
    flow: flowSteps,
    tutorSuggestions: [
      `Why is line ${asyncLines[0] || 1} written this way?`,
      `How can we improve error handling here?`,
      `What happens if the API response is delayed?`,
    ],
    quiz,
  };
}
