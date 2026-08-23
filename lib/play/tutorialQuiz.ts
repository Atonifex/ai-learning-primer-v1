import type { OverlayQuizPublic } from "./overlayQuiz";
import {
  hasCompletedActivitySlug,
  startBankOverlayQuiz,
  submitBankOverlayQuiz,
} from "./overlayQuiz";
import { TUTORIAL_QUIZ_SLUG } from "./tutorialQuizSlug";

/** Frozen Chapter 1 overlay quiz from the activity bank (A7). */
export { TUTORIAL_QUIZ_SLUG };

export type TutorialQuizPublic = OverlayQuizPublic;

export async function hasCompletedTutorialQuiz(
  learnerProfileId: string
): Promise<boolean> {
  return hasCompletedActivitySlug(learnerProfileId, TUTORIAL_QUIZ_SLUG);
}

export async function startTutorialOverlayQuiz(params: {
  learnerProfileId: string;
  sessionId: string;
}): Promise<TutorialQuizPublic> {
  return startBankOverlayQuiz({ ...params, slug: TUTORIAL_QUIZ_SLUG });
}

export async function submitTutorialOverlayQuiz(params: {
  sessionId: string;
  learnerProfileId: string;
  completionId: string;
  answers: Array<{ itemId: string; selectedIndex: number }>;
}) {
  return submitBankOverlayQuiz({ ...params, slug: TUTORIAL_QUIZ_SLUG });
}
