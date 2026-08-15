import { useEffect, useState } from "react";
import { CONCEPTS, HISTORY, type HistoryItem } from "./demo-data";

export type UserProfileState = {
  name: string;
  role: string;
  streak: number;
  learningStyle: string;
  currentGoal: string;
};

export type AnalysisResult = {
  id: string;
  project: string;
  language: string;
  code: string;
  complexity: "Low" | "Medium" | "High";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  score: number;
  when: string;
  explanation: string[];
  concepts: Array<{
    id: string;
    name: string;
    category: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    mastery: number;
    summary: string;
    lines: number[];
  }>;
  flow: Array<{
    id: string;
    label: string;
    detail: string;
    lines: number[];
  }>;
  tutorSuggestions: string[];
  quiz: {
    question: string;
    options: Array<{ id: string; text: string }>;
    correct: string;
    feedback: string;
  };
};

export type AppState = {
  profile: UserProfileState;
  history: HistoryItem[];
  analyses: Record<string, AnalysisResult>;
  conceptMastery: Record<string, number>;
  completedChallenges: string[];
  challengeScores: Record<string, number>;
  onboarding: {
    interests: string[];
    experience: string;
    goals: string[];
  };
};

const STORAGE_KEY = "codelens_ai_state_v1";

const DEFAULT_STATE: AppState = {
  profile: {
    name: "Prem Parmar",
    role: "Developer in Progress",
    streak: 7,
    learningStyle: "Project-based learner",
    currentGoal: "Become a stronger full-stack/cloud developer",
  },
  history: HISTORY,
  analyses: {},
  conceptMastery: CONCEPTS.reduce((acc, c) => ({ ...acc, [c.id]: c.mastery }), {}),
  completedChallenges: ["#01", "#02", "#03"],
  challengeScores: { "#01": 95, "#02": 88, "#03": 90 },
  onboarding: {
    interests: ["JavaScript", "React", "AWS"],
    experience: "Intermediate",
    goals: ["Understand existing code", "Build projects"],
  },
};

class Store {
  private state: AppState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): AppState {
    if (typeof window === "undefined") return DEFAULT_STATE;
    try {
      const item = localStorage.getItem(STORAGE_KEY);
      if (!item) return DEFAULT_STATE;
      const parsed = JSON.parse(item);
      return {
        ...DEFAULT_STATE,
        ...parsed,
        profile: { ...DEFAULT_STATE.profile, ...(parsed.profile || {}) },
        conceptMastery: { ...DEFAULT_STATE.conceptMastery, ...(parsed.conceptMastery || {}) },
      };
    } catch {
      return DEFAULT_STATE;
    }
  }

  private saveState() {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error("Failed to save store state", e);
    }
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public getState(): AppState {
    return this.state;
  }

  public addAnalysis(result: AnalysisResult) {
    const historyItem: HistoryItem = {
      id: result.id,
      project: result.project,
      language: result.language,
      concepts: result.concepts.length,
      score: result.score,
      when: result.when,
      difficulty: result.difficulty,
    };

    this.state = {
      ...this.state,
      history: [historyItem, ...this.state.history.filter((h) => h.id !== result.id)],
      analyses: {
        ...this.state.analyses,
        [result.id]: result,
      },
    };

    // Update concept masteries slightly for analyzed concepts
    const updatedMastery = { ...this.state.conceptMastery };
    result.concepts.forEach((c) => {
      const current = updatedMastery[c.id] ?? c.mastery;
      updatedMastery[c.id] = Math.min(100, current + 2);
    });
    this.state.conceptMastery = updatedMastery;

    this.saveState();
  }

  public getAnalysis(id: string): AnalysisResult | undefined {
    return this.state.analyses[id];
  }

  public updateConceptMastery(conceptId: string, delta: number) {
    const current = this.state.conceptMastery[conceptId] ?? 50;
    const next = Math.max(0, Math.min(100, current + delta));
    this.state.conceptMastery = {
      ...this.state.conceptMastery,
      [conceptId]: next,
    };
    this.saveState();
  }

  public completeChallenge(challengeId: string, score: number, conceptsAffected: string[]) {
    const completed = new Set(this.state.completedChallenges);
    completed.add(challengeId);

    const updatedMastery = { ...this.state.conceptMastery };
    conceptsAffected.forEach((cid) => {
      const cur = updatedMastery[cid] ?? 50;
      updatedMastery[cid] = Math.min(100, Math.round(cur * 0.7 + score * 0.3));
    });

    this.state = {
      ...this.state,
      completedChallenges: Array.from(completed),
      challengeScores: {
        ...this.state.challengeScores,
        [challengeId]: score,
      },
      conceptMastery: updatedMastery,
      profile: {
        ...this.state.profile,
        streak: this.state.profile.streak + (completed.has(challengeId) ? 0 : 1),
      },
    };

    this.saveState();
  }

  public setOnboarding(data: AppState["onboarding"]) {
    this.state = {
      ...this.state,
      onboarding: data,
    };
    this.saveState();
  }
}

export const appStore = new Store();

export function useAppStore(): AppState {
  const [state, setState] = useState<AppState>(appStore.getState());

  useEffect(() => {
    return appStore.subscribe(() => {
      setState(appStore.getState());
    });
  }, []);

  return state;
}
