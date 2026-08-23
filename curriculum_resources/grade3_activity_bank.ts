/**
 * Grade 3 activity bank — hand-authored templates for the shared shipwreck saga.
 * Orchestrator wraps these in live story (captain displayName, location, crew state).
 */

import type { ActivityTemplate } from "../prisma/seeds/activities/types";
import { BANK_KIND_TO_PRISMA } from "../prisma/seeds/activities/types";
import { allGrade3StandardCodes } from "./grade3_castaway_curriculum";
import { mathActivities } from "./grade3_activity_bank_math";
import { elaActivities } from "./grade3_activity_bank_ela";
import { scienceActivities } from "./grade3_activity_bank_science";
import { ssActivities } from "./grade3_activity_bank_ss";
import { chapterReflections, checkpointTestActivities } from "./grade3_activity_bank_reflections";

export type { ActivityTemplate } from "../prisma/seeds/activities/types";
export { BANK_KIND_TO_PRISMA };

export const grade3ActivityBank: ActivityTemplate[] = [
  ...mathActivities,
  ...elaActivities,
  ...scienceActivities,
  ...ssActivities,
  ...chapterReflections,
  ...checkpointTestActivities,
];

function unique(codes: string[]): string[] {
  return [...new Set(codes)];
}

/** Codes that appear on at least one bank template. */
export function codesCoveredByActivityBank(): string[] {
  return unique(grade3ActivityBank.flatMap((activity) => activity.targetStandardCodes));
}

/**
 * A code is "only bundled" if every activity that includes it also includes another code,
 * and there is no activity whose only target is that code.
 */
export function codesOnlyBundledInActivityBank(): string[] {
  const all = allGrade3StandardCodes();
  return all.filter((code) => {
    const hits = grade3ActivityBank.filter((activity) => activity.targetStandardCodes.includes(code));
    if (hits.length === 0) return false;
    return hits.every((activity) => activity.targetStandardCodes.length > 1);
  });
}

export function codesMissingFromActivityBank(): string[] {
  const covered = new Set(codesCoveredByActivityBank());
  return allGrade3StandardCodes().filter((code) => !covered.has(code));
}

export function assertBankKindMapsToPrisma(activity: ActivityTemplate): boolean {
  return BANK_KIND_TO_PRISMA[activity.kind] === activity.prismaKind;
}
