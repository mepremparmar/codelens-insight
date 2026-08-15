export type EvaluationResult = {
  success: boolean;
  score: number;
  message: string;
  feedback: string;
  conceptScores: Record<string, number>;
  conceptsAffected: string[];
};

export function evaluateChallenge(
  challengeId: string,
  userCode: string,
): EvaluationResult {
  const code = userCode.trim();

  // Basic syntax & structural checks
  const hasTryCatch = /\btry\s*\{/.test(code) && /\bcatch\b/.test(code);
  const hasReturnNull = /return\s+null/.test(code) || /return\s+undefined/.test(code) || /return\s+\{/.test(code) || /return\s+\[/.test(code) || /return\s+false/.test(code);
  const hasAsync = /\basync\b/.test(code);
  const hasAwait = /\bawait\b/.test(code);

  if (challengeId === "#04" || challengeId === "error-handling") {
    if (hasTryCatch && hasReturnNull) {
      return {
        success: true,
        score: 94,
        message: "Challenge Completed Successfully!",
        feedback:
          "Excellent work! You wrapped the asynchronous call in a try/catch block and returned a safe fallback value when the request fails.",
        conceptScores: {
          "Error Handling": 94,
          "Async/Await": 92,
        },
        conceptsAffected: ["error-handling", "async-await"],
      };
    } else if (hasTryCatch && !hasReturnNull) {
      return {
        success: false,
        score: 75,
        message: "Partial Credit (75%)",
        feedback:
          "You added a try/catch block, but make sure to return a safe fallback value from the catch block so the caller doesn't receive undefined.",
        conceptScores: {
          "Error Handling": 75,
          "Async/Await": 90,
        },
        conceptsAffected: ["error-handling"],
      };
    } else {
      return {
        success: false,
        score: 45,
        message: "Tests Failing",
        feedback:
          "The code still lacks error handling. Try wrapping the awaited fetch operation inside a try { ... } catch (err) { ... } block.",
        conceptScores: {
          "Error Handling": 45,
          "Async/Await": 80,
        },
        conceptsAffected: ["error-handling"],
      };
    }
  }

  // Generic challenge evaluation
  if (hasAsync && hasAwait && (hasTryCatch || hasReturnNull)) {
    return {
      success: true,
      score: 90,
      message: "Challenge Completed!",
      feedback: "Great job! Your solution handles asynchronous execution and potential failure points properly.",
      conceptScores: {
        "Async/Await": 90,
        "Promises": 88,
      },
      conceptsAffected: ["async-await", "promises"],
    };
  }

  return {
    success: false,
    score: 60,
    message: "Submission Evaluated",
    feedback: "Solution submitted. Review the requirements and hints to refine your error handling and return values.",
    conceptScores: {
      "Async/Await": 70,
      "Error Handling": 55,
    },
    conceptsAffected: ["async-await", "error-handling"],
  };
}
