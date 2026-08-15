export type TutorResponse = {
  text: string;
  suggestedNext?: string[];
};

export function answerTutorQuestion(
  question: string,
  code: string,
  language: string,
): TutorResponse {
  const q = question.toLowerCase();

  if (q.includes("await") || q.includes("async")) {
    return {
      text: `\`await\` is used in ${language} to pause execution inside an \`async\` function until a Promise settles. The key benefit is that while this function pauses, the main browser thread remains non-blocking and responsive for the user!`,
      suggestedNext: [
        "What happens if res.json() fails?",
        "How do I add a fallback return value?",
        "What is the difference between Promise.all and await?",
      ],
    };
  }

  if (q.includes("error") || q.includes("catch") || q.includes("fail")) {
    return {
      text: `When network or runtime errors occur, JavaScript throws an exception. Wrapping the operation in a \`try { ... } catch (err) { ... }\` block intercepts that failure so you can log the error, reset loading state, or return a safe fallback value.`,
      suggestedNext: [
        "How would I show a toast notification on error?",
        "What is progressive enhancement?",
        "Why is returning null safer than throwing?",
      ],
    };
  }

  if (q.includes("lambda") || q.includes("aws") || q.includes("cloud")) {
    return {
      text: `AWS Lambda executes this function on-demand in a serverless environment. API Gateway routes HTTP requests to Lambda, which executes the code, returns the JSON payload, and spins down automatically without needing dedicated server management.`,
      suggestedNext: [
        "How does API Gateway handle CORS?",
        "What is cold start in serverless?",
        "How do I pass authorization headers?",
      ],
    };
  }

  if (q.includes("json") || q.includes("parse")) {
    return {
      text: `\`res.json()\` reads the HTTP response stream to completion and parses the raw text into a native JavaScript object or array. Because stream reading is asynchronous, \`res.json()\` returns a Promise that must also be awaited.`,
      suggestedNext: [
        "What if the response body isn't JSON?",
        "How does FormData differ from JSON?",
      ],
    };
  }

  // Default response
  return {
    text: `Great question about this ${language} code snippet. In this implementation, lines work together to pass data through cleanly. Notice how each step relies on the previous line's output before updating state or returning results.`,
    suggestedNext: [
      "Why are we using await here?",
      "What happens if the request fails?",
      "How would we test this function?",
    ],
  };
}
