import { analyzeCode as engineAnalyzeCode } from "../engine/analyzer";
import { answerTutorQuestion as engineAnswerTutorQuestion } from "../engine/tutor";
import { evaluateChallenge as engineEvaluateChallenge } from "../engine/evaluator";
import type { AnalysisResult } from "./store";

export async function requestCodeAnalysis(
  code: string,
  language: string,
  fileName?: string,
): Promise<AnalysisResult> {
  await new Promise((res) => setTimeout(res, 800));
  return engineAnalyzeCode(code, language, fileName);
}

export async function requestTutorAnswer(
  question: string,
  code: string,
  language: string,
) {
  await new Promise((res) => setTimeout(res, 400));
  return engineAnswerTutorQuestion(question, code, language);
}

export async function requestChallengeEvaluation(
  challengeId: string,
  userCode: string,
) {
  await new Promise((res) => setTimeout(res, 500));
  return engineEvaluateChallenge(challengeId, userCode);
}
