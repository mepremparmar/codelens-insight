import type { AnalysisResult } from "../lib/store";

export function analyzeCode(code: string, language: string, fileName?: string): AnalysisResult {
  const lines = code.split("\n");
  const lineCount = lines.length;

  // Clean lines for analysis
  const nonCommentLines = lines.map((l, i) => ({
    text: l.trim(),
    lineNum: i + 1,
    indent: l.search(/\S|$/),
  })).filter((l) => l.text.length > 0 && !l.text.startsWith("//") && !l.text.startsWith("#") && !l.text.startsWith("/*") && !l.text.startsWith("*"));

  const detectedConcepts: AnalysisResult["concepts"] = [];
  const flowSteps: AnalysisResult["flow"] = [];
  const explanations: string[] = [];

  const findLines = (patterns: RegExp[]): number[] => {
    const matched: number[] = [];
    lines.forEach((line, idx) => {
      if (patterns.some((p) => p.test(line))) {
        matched.push(idx + 1);
      }
    });
    return matched;
  };

  const langLower = language.toLowerCase();

  // --- LANGUAGE SPECIFIC CONCEPT DETECTION ---

  // 1. Asynchronous Execution / Concurrency
  const asyncLines = findLines([/\basync\b/, /\bawait\b/, /\bPromise\b/, /\bTask\b/, /\bCompletableFuture\b/, /\bThread\b/, /\bgoroutine\b/]);
  if (asyncLines.length > 0) {
    detectedConcepts.push({
      id: "async-await",
      name: "Async / Concurrency",
      category: "Programming",
      difficulty: "Intermediate",
      mastery: 78,
      summary: "Non-blocking execution permitting concurrent task settlement.",
      lines: asyncLines,
    });
  }

  // 2. HTTP Requests & REST APIs
  const apiLines = findLines([/\bfetch\b/, /axios/, /http/i, /requests\./, /HttpClient/, /urllib/, /curl/i, /REST/i, /api/i]);
  if (apiLines.length > 0) {
    detectedConcepts.push({
      id: "rest-api",
      name: "REST / HTTP Communication",
      category: "Web Development",
      difficulty: "Intermediate",
      mastery: 72,
      summary: "Exchanging serialized payloads over HTTP network boundaries.",
      lines: apiLines,
    });
  }

  // 3. Error Handling & Exception Control
  const errorLines = findLines([/\btry\b/, /\bcatch\b/, /except\b/, /\bfinally\b/, /throw\b/, /raise\b/, /reject\b/, /throws\b/]);
  if (errorLines.length > 0) {
    detectedConcepts.push({
      id: "error-handling",
      name: "Error & Exception Guards",
      category: "Programming",
      difficulty: "Intermediate",
      mastery: 82,
      summary: "Intercepting runtime exceptions cleanly without process crash.",
      lines: errorLines,
    });
  }

  // 4. Data Serialization & JSON
  const jsonLines = findLines([/\.json/i, /JSON\./, /jsonify/, /Jackson/, /gson/i, /serializer/i, /parse/i]);
  if (jsonLines.length > 0) {
    detectedConcepts.push({
      id: "json-serialization",
      name: "JSON Serialization",
      category: "Programming",
      difficulty: "Beginner",
      mastery: 88,
      summary: "Transforming structured objects to and from text streams.",
      lines: jsonLines,
    });
  }

  // 5. State & Component Hooks (React / UI)
  const reactLines = findLines([/useState/, /useEffect/, /useCallback/, /useMemo/, /useRef/, /useContext/, /render/, /jsx/i, /<[A-Z][a-zA-Z0-9]*/]);
  if (reactLines.length > 0 || langLower.includes("react")) {
    detectedConcepts.push({
      id: "react-hooks",
      name: "React Hooks & State",
      category: "Web Development",
      difficulty: "Intermediate",
      mastery: 85,
      summary: "Managing lifecycle, side-effects, and reactive state trees.",
      lines: reactLines.length > 0 ? reactLines : [1],
    });
  }

  // 6. Object Oriented Programming (Classes, Inheritance, Interfaces)
  const oopLines = findLines([/\bclass\s+/, /\binterface\s+/, /\bextends\s+/, /\bimplements\s+/, /\bpublic\b/, /\bprivate\b/, /\bprotected\b/, /\bself\b/, /\bthis\b/]);
  if (oopLines.length > 0 && !langLower.includes("html")) {
    detectedConcepts.push({
      id: "oop-design",
      name: "Object-Oriented Architecture",
      category: "Programming",
      difficulty: "Intermediate",
      mastery: 75,
      summary: "Encapsulating state and domain logic inside reusable classes/types.",
      lines: oopLines,
    });
  }

  // 7. Functional / Control Flow (Loops & Conditionals)
  const controlLines = findLines([/\bif\b/, /\belse\b/, /\bfor\b/, /\bwhile\b/, /\bswitch\b/, /\bmap\b/, /\bfilter\b/, /\breduce\b/]);
  if (controlLines.length > 0) {
    detectedConcepts.push({
      id: "control-flow",
      name: "Control Flow & Iteration",
      category: "Programming",
      difficulty: "Beginner",
      mastery: 90,
      summary: "Branching decisions and repeatable iteration constructs.",
      lines: controlLines,
    });
  }

  // 8. Python specific constructs
  if (langLower.includes("python")) {
    const pyLines = findLines([/\bdef\s+/, /import\s+/, /from\s+.*import/, /@\w+/, /__init__/]);
    if (pyLines.length > 0) {
      detectedConcepts.push({
        id: "python-idioms",
        name: "Pythonic Functions & Modules",
        category: "Programming",
        difficulty: "Beginner",
        mastery: 84,
        summary: "Leveraging Python function definitions, module imports, and decorators.",
        lines: pyLines,
      });
    }
  }

  // 9. Java / C++ / C# type systems
  if (langLower.includes("java") || langLower.includes("c++") || langLower.includes("c#")) {
    const typeLines = findLines([/\bint\b/, /\bString\b/, /\bboolean\b/, /\bdouble\b/, /\bvoid\b/, /List</, /Map</]);
    if (typeLines.length > 0) {
      detectedConcepts.push({
        id: "static-types",
        name: "Static Type Enforcement",
        category: "Programming",
        difficulty: "Intermediate",
        mastery: 80,
        summary: "Explicit type declarations and compiler contract checking.",
        lines: typeLines,
      });
    }
  }

  // 10. HTML / CSS Elements
  if (langLower.includes("html") || langLower.includes("css") || findLines([/<html/i, /<div/i, /<body/i, /class=/i, /style=/i, /@media/i]).length > 0) {
    const htmlLines = findLines([/<[a-z1-6]+/i, /{\s*$/i, /margin|padding|color|flex|grid/i]);
    if (htmlLines.length > 0) {
      detectedConcepts.push({
        id: "dom-styling",
        name: "DOM Markup & CSS Layouts",
        category: "Web Development",
        difficulty: "Beginner",
        mastery: 92,
        summary: "Structuring semantic DOM hierarchies and layout styling rules.",
        lines: htmlLines,
      });
    }
  }

  // Fallback if no specific tags matched
  if (detectedConcepts.length === 0) {
    detectedConcepts.push({
      id: "general-logic",
      name: "Function & Expression Logic",
      category: "Programming",
      difficulty: "Beginner",
      mastery: 85,
      summary: "Fundamental program execution statements and variable evaluation.",
      lines: [1],
    });
  }

  // --- CYCLOMATIC COMPLEXITY & METRICS COMPUTATION ---
  let cyclomaticCount = 1;
  lines.forEach((l) => {
    if (/\b(if|elif|else if|for|while|catch|except|switch|case|\&\&|\|\||\?)\b/.test(l)) {
      cyclomaticCount++;
    }
  });

  const complexityScore = lineCount * 1.5 + cyclomaticCount * 8 + detectedConcepts.length * 6;
  const complexity: AnalysisResult["complexity"] =
    complexityScore > 65 ? "High" : complexityScore > 30 ? "Medium" : "Low";

  const difficulty: AnalysisResult["difficulty"] =
    cyclomaticCount > 6 || complexityScore > 60
      ? "Advanced"
      : cyclomaticCount > 2 || complexityScore > 30
        ? "Intermediate"
        : "Beginner";

  const score = Math.min(98, Math.max(65, 100 - cyclomaticCount * 3 + detectedConcepts.length * 4));

  // --- DYNAMIC EXECUTION FLOW GENERATION ---
  let stepIdx = 1;

  // Step 1: Entry / Imports
  const importLines = findLines([/import\s+/, /require\(/, /#include/, /using\s+/]);
  flowSteps.push({
    id: `step-${stepIdx++}`,
    label: "Program Entry & Imports",
    detail: importLines.length > 0
      ? `Modules & dependencies loaded at lines ${importLines.slice(0, 3).join(", ")}.`
      : `Program execution begins at line 1 of ${fileName || "file"}.`,
    lines: importLines.length > 0 ? importLines : [1],
  });

  // Step 2: Definitions / Classes / State
  const defLines = findLines([/\bdef\s+/, /\bfunction\b/, /const\s+\w+\s*=/, /class\s+/, /useState/]);
  if (defLines.length > 0) {
    flowSteps.push({
      id: `step-${stepIdx++}`,
      label: "Declaration & Scope Setup",
      detail: `Functions/Classes initialized around lines ${defLines.slice(0, 3).join(", ")}.`,
      lines: defLines,
    });
  }

  // Step 3: Main Execution / API / Logic
  if (apiLines.length > 0 || asyncLines.length > 0) {
    flowSteps.push({
      id: `step-${stepIdx++}`,
      label: "Network / Async Operation",
      detail: `Asynchronous or network call dispatched at lines ${[...apiLines, ...asyncLines].slice(0, 3).join(", ")}.`,
      lines: Array.from(new Set([...apiLines, ...asyncLines])),
    });
  } else if (controlLines.length > 0) {
    flowSteps.push({
      id: `step-${stepIdx++}`,
      label: "Control Flow Execution",
      detail: `Evaluates conditional logic and loops at lines ${controlLines.slice(0, 3).join(", ")}.`,
      lines: controlLines,
    });
  }

  // Step 4: Error Handling
  if (errorLines.length > 0) {
    flowSteps.push({
      id: `step-${stepIdx++}`,
      label: "Exception Guarding",
      detail: `Safety catch block intercepts runtime errors at lines ${errorLines.join(", ")}.`,
      lines: errorLines,
    });
  }

  // Step 5: Final Return / Output
  const returnLines = findLines([/\breturn\b/, /System\.out/, /print\(/, /console\.log/]);
  flowSteps.push({
    id: `step-${stepIdx++}`,
    label: "Return / Result Emission",
    detail: returnLines.length > 0
      ? `Produces final result or output at lines ${returnLines.slice(0, 3).join(", ")}.`
      : `Execution completes at line ${lineCount}.`,
    lines: returnLines.length > 0 ? returnLines : [lineCount > 0 ? lineCount : 1],
  });

  // --- TAILORED EXPLANATION ---
  explanations.push(
    `This snippet consists of ${lineCount} lines of ${language} code with a cyclomatic complexity rating of ${cyclomaticCount} (${complexity} Complexity).`,
  );

  detectedConcepts.forEach((c) => {
    explanations.push(
      `• ${c.name} (Lines ${c.lines.join(", ")}): ${c.summary}`,
    );
  });

  if (errorLines.length === 0 && (apiLines.length > 0 || asyncLines.length > 0)) {
    explanations.push(
      `⚠️ Safety Notice: Asynchronous network operations occur at line ${apiLines[0] || asyncLines[0]} without explicit exception guards. Adding try/catch or except blocks prevents application unhandled rejections.`,
    );
  }

  // Derive title cleanly
  const titleLine = lines.find((l) => l.trim().length > 0 && !l.trim().startsWith("//") && !l.trim().startsWith("#"))?.trim() || "";
  const cleanTitle = fileName || (titleLine.length < 32 ? titleLine : `${language} Snippet #${Math.floor(Math.random() * 800 + 100)}`);

  // --- DYNAMIC QUIZ & TUTOR SUGGESTIONS ---
  const hasErrGuard = errorLines.length > 0;
  const hasAsyncOp = asyncLines.length > 0 || apiLines.length > 0;

  const quiz = {
    question: hasErrGuard
      ? `What is the primary role of the error guard at line ${errorLines[0]}?`
      : hasAsyncOp
        ? `What occurs if the asynchronous call at line ${apiLines[0] || asyncLines[0]} fails?`
        : `What determines the execution path through this ${language} snippet?`,
    options: hasErrGuard
      ? [
          { id: "A", text: "Intercepts runtime failures to prevent unhandled process crashes." },
          { id: "B", text: "Accelerates network transfer bandwidth automatically." },
          { id: "C", text: "Converts synchronous code into multi-threaded code." },
          { id: "D", text: "Re-runs the function continuously until true." },
        ]
      : hasAsyncOp
        ? [
          { id: "A", text: "An unhandled rejection or exception is raised to the caller." },
          { id: "B", text: "The code silently substitutes an empty response." },
          { id: "C", text: "The compiler restarts the process automatically." },
          { id: "D", text: "Nothing — execution stops without throwing." },
        ]
        : [
          { id: "A", text: "Sequential evaluation of expressions and branching control flow." },
          { id: "B", text: "Randomized thread execution order." },
          { id: "C", text: "Automatic server deployment on load." },
          { id: "D", text: "Garbage collection allocation frequencies." },
        ],
    correct: "A",
    feedback: "Correct! That choice accurately describes the structural behavior of this code.",
  };

  const tutorSuggestions = [
    `How does line ${nonCommentLines[0]?.lineNum || 1} initiate execution?`,
    `Can we refactor this ${language} code to be more modular?`,
    `How would exception handling be added or improved here?`,
  ];

  return {
    id: `anl_${Date.now()}`,
    project: cleanTitle,
    language,
    code,
    complexity,
    difficulty,
    score,
    when: "Just now",
    explanation: explanations,
    concepts: detectedConcepts,
    flow: flowSteps,
    tutorSuggestions,
    quiz,
  };
}
