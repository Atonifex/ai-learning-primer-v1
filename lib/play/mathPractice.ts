import { mathFiveItemForCode } from "./mathFiveCheck";
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
    standardCode: "MA.3.NSO.1.3", example: "Compare 2,160 and 2,610. The thousands match. One hundred is less than six hundreds, so 2,160 < 2,610.",
    prompt: "Which supply count is greater: 5,090 or 5,900?", choices: ["They are equal", "5,090", "5,900"], correctIndex: 2,
    rightFeedback: "The thousands match. Nine hundreds is greater than zero hundreds, so 5,900 is greater.", wrongFeedback: "Start at the left. Both have 5 thousands; 5,900 has 9 hundreds while 5,090 has none. 5,900 is greater.",
  },
  {
    standardCode: "MA.3.NSO.2.1", example: "Add by place: 425 + 130 = 425 + 100 + 30 = 555.",
    prompt: "The crew has 247 nails and finds 120 more. How many nails now?", choices: ["357", "367", "267"], correctIndex: 1,
    rightFeedback: "247 + 100 = 347, then 347 + 20 = 367 nails. Adding by place keeps the count clear.", wrongFeedback: "Add 100 to get 347, then add 20 to get 367. The crew has 367 nails.",
  },
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
  const diagnostic = mathFiveItemForCode(item.standardCode);
  if (!diagnostic) return false;
  return item.prompt.trim() !== diagnostic.prompt.trim() && item.example.trim() !== diagnostic.example.trim();
}
