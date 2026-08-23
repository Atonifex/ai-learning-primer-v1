/** Product grade range for MVP (Florida ESA / homeschool Grades 3–8). */
export const LEARNER_GRADE_BANDS = ["3", "4", "5", "6", "7", "8"] as const;

export type LearnerGradeBand = (typeof LEARNER_GRADE_BANDS)[number];

export const DEFAULT_GRADE_BAND: LearnerGradeBand = "3";

export function isLearnerGradeBand(value: string): value is LearnerGradeBand {
  return (LEARNER_GRADE_BANDS as readonly string[]).includes(value);
}

export function parseLearnerGradeBand(
  value: unknown,
  fallback: LearnerGradeBand = DEFAULT_GRADE_BAND
): LearnerGradeBand {
  if (typeof value === "string" && isLearnerGradeBand(value)) return value;
  if (typeof value === "number") {
    const asString = String(value);
    if (isLearnerGradeBand(asString)) return asString;
  }
  return fallback;
}
