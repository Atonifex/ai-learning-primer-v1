import { MATH_DIAGNOSTIC_LADDER } from "./mathDiagnostic";
import type { MathPlacement } from "./mathDiagnostic";

/**
 * One try after math placement. Not a new mode.
 * The prompt is a different case from the diagnostic item on the same code.
 * Does not write mastery.
 */
export type MathPracticeItem = {
  standardCode: string;
  example: string;
  prompt: string;
  choices: [string, string, string];
  correctIndex: 0 | 1 | 2;
  rightFeedback: string;
  wrongFeedback: string;
};

export const MATH_PRACTICE: readonly MathPracticeItem[] = [
  {
    standardCode: "MA.3.NSO.1.1",
    example: "4,000 + 20 + 1 is written 4,021. The hundreds place stays 0.",
    prompt: "How do you write 3,000 + 50 + 2?",
    choices: ["3,052", "3,502", "35,002"],
    correctIndex: 0,
    rightFeedback: "3 thousands, no hundreds, 5 tens, and 2 ones is 3,052.",
    wrongFeedback:
      "The 5 is tens, not hundreds. 3,000 + 50 + 2 keeps a 0 in the hundreds place: 3,052.",
  },
  {
    standardCode: "MA.3.NSO.2.2",
    example: "2 equal groups of 4 biscuits — ●●●●  ●●●● — is 2 × 4 = 8.",
    prompt: "4 equal groups of 3 biscuits is which equation?",
    choices: ["4 × 3 = 12", "4 + 3 = 7", "4 × 3 = 43"],
    correctIndex: 0,
    rightFeedback: "4 groups of 3 is 12 biscuits. The groups are equal, so this is 4 × 3.",
    wrongFeedback:
      "Count the groups, then the biscuits in one group. 4 equal groups of 3 is 4 × 3 = 12.",
  },
  {
    standardCode: "MA.3.NSO.1.2",
    example: "1,406 is 1 thousand + 4 hundreds + 0 tens + 6 ones.",
    prompt: "Which is another way to show 3,205?",
    choices: [
      "3 thousands + 2 hundreds + 5 ones",
      "32 thousands + 5 ones",
      "3 thousands + 20 hundreds + 5 ones",
    ],
    correctIndex: 0,
    rightFeedback: "3,205 is 3 thousands, 2 hundreds, and 5 ones. The tens place is 0.",
    wrongFeedback:
      "The 2 stays in the hundreds place. 3,205 is 3 thousands + 2 hundreds + 5 ones.",
  },
] as const;

export function practiceForPlacement(placement: MathPlacement): MathPracticeItem | null {
  if (placement.status !== "ready" && placement.status !== "above_ladder") return null;
  return MATH_PRACTICE.find((item) => item.standardCode === placement.standardCode) ?? null;
}

export function practiceFeedback(item: MathPracticeItem, correct: boolean): string {
  return correct ? item.rightFeedback : item.wrongFeedback;
}

export function practiceIsANewCase(item: MathPracticeItem): boolean {
  const diagnostic = MATH_DIAGNOSTIC_LADDER.find(
    (row) => row.standardCode === item.standardCode
  );
  if (!diagnostic) return false;
  return item.prompt.trim() !== diagnostic.prompt.trim() && item.example.trim() !== diagnostic.example.trim();
}
