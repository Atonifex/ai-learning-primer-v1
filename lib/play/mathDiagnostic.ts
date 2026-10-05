/**
 * Math placement engine (§4.4). Show an example, then score a different item.
 * Does not write mastery. Codes are the seeded Grade 3 ladder only.
 */

export const MATH_DIAGNOSTIC_FLOOR = "below_seeded_catalog" as const;

export type MathDiagnosticItem = {
  id: string;
  /** Rung 0 is the easiest seeded step. Higher is harder. */
  rung: number;
  standardCode: string;
  /** Shown first. Not the scored question. */
  example: string;
  prompt: string;
  choices: [string, string, string];
  correctIndex: 0 | 1 | 2;
};

export type MathPlacement =
  | { status: "in_progress" }
  | { status: "ready"; standardCode: string; rung: number }
  | { status: "below_catalog" }
  | { status: "above_ladder"; standardCode: string; rung: number };

export type MathDiagnosticState = {
  rung: number;
  correctStreak: number;
  missStreak: number;
  asked: number;
  placement: MathPlacement;
};

/** Shortest honest ladder inside the seeded Grade 3 math catalog. */
export const MATH_DIAGNOSTIC_LADDER: readonly MathDiagnosticItem[] = [
  {
    id: "nso-1-1-expanded",
    rung: 0,
    standardCode: "MA.3.NSO.1.1",
    example: "2,000 + 300 + 40 + 6 is written 2,346.",
    prompt: "How do you write 1,000 + 200 + 30 + 5?",
    choices: ["1,235", "12,305", "1,200,305"],
    correctIndex: 0,
  },
  {
    id: "nso-2-2-groups",
    rung: 1,
    standardCode: "MA.3.NSO.2.2",
    example: "6 groups of 4 biscuits is 6 × 4 = 24.",
    prompt: "3 groups of 5 biscuits is which equation?",
    choices: ["3 × 5 = 15", "3 + 5 = 8", "3 × 5 = 35"],
    correctIndex: 0,
  },
  {
    id: "nso-1-2-compose",
    rung: 2,
    standardCode: "MA.3.NSO.1.2",
    example: "2,340 is 2 thousands + 3 hundreds + 4 tens.",
    prompt: "Which is another way to show 1,250?",
    choices: [
      "1 thousand + 2 hundreds + 5 tens",
      "12 thousands + 5 tens",
      "1 thousand + 25 hundreds",
    ],
    correctIndex: 0,
  },
] as const;

const MAX_ITEMS = 8;

export function freshMathDiagnostic(): MathDiagnosticState {
  return {
    rung: 0,
    correctStreak: 0,
    missStreak: 0,
    asked: 0,
    placement: { status: "in_progress" },
  };
}

export function itemForRung(
  rung: number,
  ladder: readonly MathDiagnosticItem[] = MATH_DIAGNOSTIC_LADDER
): MathDiagnosticItem | null {
  return ladder.find((item) => item.rung === rung) ?? null;
}

export function exampleIsNotTheScoredPrompt(item: MathDiagnosticItem): boolean {
  return item.example.trim() !== item.prompt.trim();
}

/**
 * Two correct answers at a rung step up. Two misses step down.
 * The bottom miss stops at "below this catalog" instead of inventing a lower code.
 */
export function applyMathDiagnosticAnswer(
  state: MathDiagnosticState,
  correct: boolean,
  ladder: readonly MathDiagnosticItem[] = MATH_DIAGNOSTIC_LADDER
): MathDiagnosticState {
  if (state.placement.status !== "in_progress") return state;
  const top = ladder.reduce((max, item) => Math.max(max, item.rung), 0);
  const asked = state.asked + 1;
  const correctStreak = correct ? state.correctStreak + 1 : 0;
  const missStreak = correct ? 0 : state.missStreak + 1;

  if (missStreak >= 2 && state.rung <= 0) {
    return {
      rung: 0,
      correctStreak: 0,
      missStreak,
      asked,
      placement: { status: "below_catalog" },
    };
  }
  if (correctStreak >= 2 && state.rung >= top) {
    const ceiling = itemForRung(top, ladder);
    return {
      rung: top,
      correctStreak,
      missStreak: 0,
      asked,
      placement: {
        status: "above_ladder",
        standardCode: ceiling?.standardCode ?? "",
        rung: top,
      },
    };
  }
  if (asked >= MAX_ITEMS) {
    const here = itemForRung(state.rung, ladder);
    return {
      rung: state.rung,
      correctStreak,
      missStreak,
      asked,
      placement: here
        ? { status: "ready", standardCode: here.standardCode, rung: state.rung }
        : { status: "below_catalog" },
    };
  }
  if (correctStreak >= 2) {
    return {
      rung: state.rung + 1,
      correctStreak: 0,
      missStreak: 0,
      asked,
      placement: { status: "in_progress" },
    };
  }
  if (missStreak >= 2) {
    return {
      rung: Math.max(0, state.rung - 1),
      correctStreak: 0,
      missStreak: 0,
      asked,
      placement: { status: "in_progress" },
    };
  }
  return {
    rung: state.rung,
    correctStreak,
    missStreak,
    asked,
    placement: { status: "in_progress" },
  };
}

export function mathPlacementCopy(placement: MathPlacement): string | null {
  if (placement.status === "below_catalog") {
    return "This Grade 3 check was still steep. Earlier standards are not loaded, so this check will not guess a grade 2 code.";
  }
  if (placement.status === "ready") {
    return `Start with ${placement.standardCode}.`;
  }
  if (placement.status === "above_ladder") {
    return `This Grade 3 ladder is solid, through ${placement.standardCode}.`;
  }
  return null;
}
