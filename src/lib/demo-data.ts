export const SAMPLE_CODE = `// AI Resume Analyzer — client hook
import { useState, useCallback } from "react";

const API = "https://api.codelens.dev/v1";

export function useResumeAnalysis() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = useCallback(async (file) => {
    setLoading(true);
    const body = new FormData();
    body.append("resume", file);

    const res = await fetch(API + "/analyze", {
      method: "POST",
      body,
    });

    const json = await res.json();
    setData(json.result);
    setLoading(false);
    return json.result;
  }, []);

  return { data, loading, analyze };
}`;

export const CHALLENGE_CODE = `async function fetchUser(id) {
  const res = await fetch("/api/users/" + id);
  const json = await res.json();
  return json.data;
}`;

export type Concept = {
  id: string;
  name: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  mastery: number;
  summary: string;
  related: string[];
  lines?: number[];
};

export const CONCEPTS: Concept[] = [
  {
    id: "async-await",
    name: "Async/Await",
    category: "Programming",
    difficulty: "Intermediate",
    mastery: 72,
    summary:
      "Allows asynchronous operations to be written in a readable, sequential style.",
    related: ["Promises", "Event Loop", "Error Handling"],
    lines: [11, 17, 22],
  },
  {
    id: "rest-api",
    name: "REST APIs",
    category: "Web Development",
    difficulty: "Intermediate",
    mastery: 66,
    summary:
      "A convention for exposing resources over HTTP using predictable verbs and URLs.",
    related: ["JSON", "API Gateway", "Authentication"],
    lines: [17, 18, 19],
  },
  {
    id: "promises",
    name: "Promises",
    category: "Programming",
    difficulty: "Intermediate",
    mastery: 58,
    summary:
      "An object representing a value that will exist later — resolved or rejected.",
    related: ["Async/Await", "Error Handling"],
    lines: [17],
  },
  {
    id: "json",
    name: "JSON",
    category: "Programming",
    difficulty: "Beginner",
    mastery: 88,
    summary: "A text format used to serialize structured data between systems.",
    related: ["REST APIs", "Serialization"],
    lines: [22],
  },
  {
    id: "error-handling",
    name: "Error Handling",
    category: "Programming",
    difficulty: "Intermediate",
    mastery: 55,
    summary:
      "Anticipating failures and responding to them without crashing the program.",
    related: ["Promises", "Async/Await"],
    lines: [17, 22],
  },
  {
    id: "react-hooks",
    name: "React Hooks",
    category: "Web Development",
    difficulty: "Intermediate",
    mastery: 84,
    summary: "Functions that let components hold state and run side effects.",
    related: ["State Management", "Rendering"],
    lines: [2, 7, 8, 11],
  },
  {
    id: "state-management",
    name: "State Management",
    category: "Web Development",
    difficulty: "Intermediate",
    mastery: 70,
    summary: "Deciding where data lives and how updates flow through the UI.",
    related: ["React Hooks"],
  },
  {
    id: "aws-lambda",
    name: "AWS Lambda",
    category: "AWS",
    difficulty: "Intermediate",
    mastery: 61,
    summary: "Runs your function on demand without managing any servers.",
    related: ["API Gateway", "Cloud"],
  },
  {
    id: "api-gateway",
    name: "API Gateway",
    category: "AWS",
    difficulty: "Advanced",
    mastery: 47,
    summary: "A managed front door that routes HTTP requests to backend services.",
    related: ["AWS Lambda", "REST APIs", "Authentication"],
  },
  {
    id: "dynamodb",
    name: "DynamoDB",
    category: "Databases",
    difficulty: "Advanced",
    mastery: 38,
    summary: "A key-value store designed for predictable performance at scale.",
    related: ["AWS Lambda", "Data Modeling"],
  },
  {
    id: "authentication",
    name: "Authentication",
    category: "Cloud",
    difficulty: "Advanced",
    mastery: 44,
    summary: "Proving who a caller is before letting them touch your resources.",
    related: ["API Gateway", "REST APIs"],
  },
  {
    id: "vector-embeddings",
    name: "Vector Embeddings",
    category: "AI/ML",
    difficulty: "Advanced",
    mastery: 32,
    summary: "Numeric representations of meaning used for search and similarity.",
    related: ["AI/ML", "Databases"],
  },
];

export const CONCEPT_CATEGORIES = [
  "All",
  "Programming",
  "Web Development",
  "Cloud",
  "AWS",
  "AI/ML",
  "Databases",
];

export type FlowStep = {
  id: string;
  label: string;
  detail: string;
  lines: number[];
};

export const FLOW: FlowStep[] = [
  {
    id: "1",
    label: "User Action",
    detail: "A user drops a resume file into the upload area.",
    lines: [11],
  },
  {
    id: "2",
    label: "analyze()",
    detail: "The async callback starts and flips the loading flag on.",
    lines: [11, 12],
  },
  {
    id: "3",
    label: "API Request",
    detail: "FormData is POSTed to the analyze endpoint through API Gateway.",
    lines: [13, 14, 17, 18, 19],
  },
  {
    id: "4",
    label: "Await Response",
    detail: "Execution pauses here until the Promise settles — the UI stays responsive.",
    lines: [17],
  },
  {
    id: "5",
    label: "Parse JSON",
    detail: "The response body is deserialized into a JavaScript object.",
    lines: [22],
  },
  {
    id: "6",
    label: "Return Data",
    detail: "State updates, loading turns off, and the result is returned to the caller.",
    lines: [23, 24, 25],
  },
];

export const MASTERY = [
  { name: "JavaScript", value: 92 },
  { name: "React", value: 84 },
  { name: "AWS", value: 61 },
  { name: "Python", value: 74 },
  { name: "Async Programming", value: 68 },
  { name: "Error Handling", value: 55 },
];

export const RADAR = [
  { skill: "Frontend", value: 86 },
  { skill: "Backend", value: 68 },
  { skill: "Cloud", value: 61 },
  { skill: "AI", value: 54 },
  { skill: "Programming", value: 81 },
  { skill: "Problem Solving", value: 74 },
];

export const ACTIVITY = Array.from({ length: 30 }, (_, i) => {
  const seed = (n: number) => Math.abs(Math.sin(i * n) * 10);
  return {
    day: `${i + 1}`,
    analyses: Math.round(seed(1.7) % 5),
    challenges: Math.round(seed(2.3) % 4),
    concepts: Math.round(seed(3.1) % 7),
  };
});

export type HistoryItem = {
  id: string;
  project: string;
  language: string;
  concepts: number;
  score: number;
  when: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
};

export const HISTORY: HistoryItem[] = [
  {
    id: "h1",
    project: "AI Resume Analyzer",
    language: "React + TypeScript",
    concepts: 12,
    score: 84,
    when: "2 hours ago",
    difficulty: "Intermediate",
  },
  {
    id: "h2",
    project: "Expense Tracker",
    language: "React + TypeScript",
    concepts: 9,
    score: 78,
    when: "Yesterday",
    difficulty: "Beginner",
  },
  {
    id: "h3",
    project: "Serverless Image Pipeline",
    language: "Python",
    concepts: 14,
    score: 66,
    when: "3 days ago",
    difficulty: "Advanced",
  },
  {
    id: "h4",
    project: "Auth Service",
    language: "TypeScript",
    concepts: 11,
    score: 71,
    when: "5 days ago",
    difficulty: "Advanced",
  },
  {
    id: "h5",
    project: "Portfolio Site",
    language: "HTML/CSS",
    concepts: 6,
    score: 93,
    when: "1 week ago",
    difficulty: "Beginner",
  },
  {
    id: "h6",
    project: "Inventory API",
    language: "Java",
    concepts: 10,
    score: 62,
    when: "2 weeks ago",
    difficulty: "Intermediate",
  },
];

export const LANGUAGES = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "React",
  "HTML/CSS",
];

export const WEAKEST = ["Error Handling", "Promises", "API Authentication"];

export const HINTS = [
  "Think about where an asynchronous operation can fail.",
  "Which JavaScript structure is commonly used to catch errors from awaited Promises?",
  "Wrap the awaited fetch in try/catch and return a safe fallback from the catch block.",
];
