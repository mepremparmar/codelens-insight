export type TutorResponse = {
  text: string;
  suggestedNext?: string[];
};

export function answerTutorQuestion(
  question: string,
  code: string,
  language: string,
  suggestions?: string[],
): TutorResponse {
  const q = question.trim().toLowerCase();
  const lines = code.split("\n").map((l) => l.trim());
  const nonBlankLines = lines.map((text, i) => ({ text, lineNum: i + 1 })).filter((l) => l.text.length > 0);

  // 1. Line-specific query detection ("line 3", "line 12", etc.)
  const lineMatch = q.match(/line\s*(\d+)/i);
  if (lineMatch && lineMatch[1]) {
    const lineNo = parseInt(lineMatch[1], 10);
    const targetLine = lines[lineNo - 1];
    if (targetLine !== undefined) {
      return {
        text: `On line ${lineNo}: \`${targetLine || "(empty line)"}\`\n\nThis line ${
          targetLine.includes("=")
            ? "assigns or updates a variable value"
            : targetLine.includes("return")
              ? "returns the calculated result to the caller"
              : targetLine.includes("if") || targetLine.includes("else")
                ? "evaluates a conditional decision branch"
                : targetLine.includes("import") || targetLine.includes("from") || targetLine.includes("#include")
                  ? "imports an external dependency or module"
                  : targetLine.includes("def ") || targetLine.includes("function") || targetLine.includes("class")
                    ? "defines a functional or type boundary"
                    : "executes a statement within the program scope"
        }.`,
        suggestedNext: [
          `What happens right after line ${lineNo}?`,
          "How can we handle errors here?",
          "Can we optimize this line?",
        ],
      };
    }
  }

  // 2. Function / Method / Def questions
  if (q.includes("function") || q.includes("def ") || q.includes("method") || q.includes("parameters") || q.includes("argument")) {
    const fnLine = nonBlankLines.find((l) => /def\s|function\s|class\s|=>/.test(l.text));
    return {
      text: fnLine
        ? `In this ${language} code, line ${fnLine.lineNum} (\`${fnLine.text}\`) declares a function unit. Parameters allow callers to pass dynamic input into this scope, isolating execution logic.`
        : `Functions in ${language} wrap reusable logic. In your snippet, instructions run sequentially when called from main application entry points.`,
      suggestedNext: [
        "How do return values work here?",
        "What is variable scope?",
        "How can we test this function?",
      ],
    };
  }

  // 3. Error Handling / Failure / Bugs / Fix
  if (q.includes("error") || q.includes("catch") || q.includes("except") || q.includes("fail") || q.includes("bug") || q.includes("try") || q.includes("fix")) {
    const errLine = nonBlankLines.find((l) => /try|catch|except|throw|raise|finally/.test(l.text));
    if (errLine) {
      return {
        text: `Line ${errLine.lineNum} (\`${errLine.text}\`) is part of an error handling guard. When runtime exceptions occur, the catch/except block intercepts the failure before it crashes your process.`,
        suggestedNext: [
          "What happens if no error occurs?",
          "Should we log the error?",
          "How to return a safe fallback?",
        ],
      };
    } else {
      return {
        text: `Currently, this ${language} snippet doesn't contain an explicit \`try/catch\` or \`try/except\` block. If an operation fails (e.g. network down, null reference), it will throw an unhandled exception.\n\nTo fix it, wrap risky statements inside a try block and catch exceptions cleanly.`,
        suggestedNext: [
          "Show me how to add try/catch here",
          "What is an unhandled rejection?",
          "Why is returning null safer than crashing?",
        ],
      };
    }
  }

  // 4. Async / Await / Promises / Threads
  if (q.includes("async") || q.includes("await") || q.includes("promise") || q.includes("thread") || q.includes("task") || q.includes("future")) {
    const asyncLine = nonBlankLines.find((l) => /async|await|Promise|Thread|Task|Future/.test(l.text));
    return {
      text: asyncLine
        ? `Line ${asyncLine.lineNum} (\`${asyncLine.text}\`) uses asynchronous execution. \`await\` pauses function execution until the underlying task/Promise resolves, allowing other background tasks on the event loop to proceed without freezing.`
        : `Asynchronous operations in ${language} allow non-blocking execution so long-running operations don't freeze the user interface or server event loop.`,
      suggestedNext: [
        "What happens if the Promise rejects?",
        "Difference between sync and async?",
        "How to run tasks in parallel?",
      ],
    };
  }

  // 5. Loops / Iteration
  if (q.includes("loop") || q.includes("for") || q.includes("while") || q.includes("map") || q.includes("iteration")) {
    const loopLine = nonBlankLines.find((l) => /for|while|map|forEach|filter/.test(l.text));
    return {
      text: loopLine
        ? `Line ${loopLine.lineNum} (\`${loopLine.text}\`) executes an iteration loop. It repeats execution for every item in the collection until the loop condition becomes false.`
        : `Iteration loops in ${language} step through array items or ranges, running the inner block once for each element.`,
      suggestedNext: [
        "What is loop complexity?",
        "How to break early from a loop?",
        "What is map vs for loop?",
      ],
    };
  }

  // 6. Imports / Modules / Packages
  if (q.includes("import") || q.includes("require") || q.includes("library") || q.includes("package") || q.includes("module")) {
    const impLine = nonBlankLines.find((l) => /import|require|#include|using/.test(l.text));
    return {
      text: impLine
        ? `Line ${impLine.lineNum} (\`${impLine.text}\`) imports an external dependency module, giving your script access to pre-built utilities.`
        : `Modules in ${language} allow you to structure code across multiple files and reuse external libraries.`,
      suggestedNext: [
        "What is modular architecture?",
        "How do exports work?",
      ],
    };
  }

  // 7. General Context-Aware fallback matching user snippet words
  const keyWords = q.split(/\s+/).filter((w) => w.length > 3);
  const matchingLine = nonBlankLines.find((l) => keyWords.some((kw) => l.text.toLowerCase().includes(kw)));

  if (matchingLine) {
    return {
      text: `Regarding your question about "${keyWords.slice(0, 3).join(" ")}":\n\nIn line ${matchingLine.lineNum} (\`${matchingLine.text}\`), the code evaluates this expression within the ${language} runtime scope. Each line feeds its result into subsequent statements to complete the workflow.`,
      suggestedNext: [
        `Why is line ${matchingLine.lineNum} necessary?`,
        "How can we refactor this code?",
        "What are potential failure cases?",
      ],
    };
  }

  return {
    text: `Great question about this ${language} code snippet!\n\n${
      nonBlankLines.length > 0
        ? `The program contains ${nonBlankLines.length} active lines starting at line ${nonBlankLines[0]?.lineNum} (\`${nonBlankLines[0]?.text}\`). Operations execute sequentially from top to bottom, passing variables into nested blocks.`
        : "Add or paste code into the editor to inspect specific lines and variable values."
    }`,
    suggestedNext: suggestions && suggestions.length > 0 ? suggestions : [
      "Explain line 1",
      "How to add error handling?",
      "What is the execution flow?",
    ],
  };
}
