export type EvidenceTier = "CONVERSATIONAL" | "GUIDED" | "CHECKPOINT";

export const TIER_WEIGHT: Record<EvidenceTier, number> = {
  CONVERSATIONAL: 0.1,
  GUIDED: 0.4,
  CHECKPOINT: 1.0,
};

export const TIER_CAP: Record<EvidenceTier, number> = {
  CONVERSATIONAL: 70,
  GUIDED: 90,
  CHECKPOINT: 100,
};

export const STEP_SIZE = 18;

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** Computes new Standards mastery after one evidence event (v1 formula). */
export function nextStandardsMastery(params: {
  currentMastery: number;
  evidenceTier: EvidenceTier;
  correctnessNormalized: number;
  stepSize?: number;
}): number {
  const step = params.stepSize ?? STEP_SIZE;
  const tierWeight = TIER_WEIGHT[params.evidenceTier];
  const cap = TIER_CAP[params.evidenceTier];
  const correctness = clamp(params.correctnessNormalized, 0, 1);
  const currentNorm = clamp(params.currentMastery, 0, 100) / 100;
  const delta = tierWeight * (correctness - currentNorm) * step;
  return clamp(params.currentMastery + delta, 0, cap);
}

export function nextConfidenceAfterObservation(
  priorConfidence: number,
  correctnessNormalized: number
): number {
  const c = clamp(correctnessNormalized, 0, 1);
  return clamp((priorConfidence + c) / 2, 0, 1);
}
