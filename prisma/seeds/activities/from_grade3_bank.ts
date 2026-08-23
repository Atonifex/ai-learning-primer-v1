/**
 * Wire in a follow-up after catalog sync.
 *
 * Maps Grade 3 hand-authored bank templates into a LearningActivity-like seed shape.
 * Do not import this from prisma/seed.ts until G3 prisma catalogs match the
 * curriculum_resources authoring files (math/science/SS seeds are still N-slices).
 */

import { grade3ActivityBank } from "../../../curriculum_resources/grade3_activity_bank";
import type { LearningActivitySeed } from "./types";

export function toLearningActivitySeed(
  template: (typeof grade3ActivityBank)[number],
): LearningActivitySeed {
  return {
    slug: template.slug,
    displayName: template.title,
    kind: template.prismaKind,
    description: template.prompt,
    narrativeContext: template.storySkinNotes,
    targetStandardCodes: template.targetStandardCodes,
    estimatedMinutes: template.estimatedMinutes,
    authoring: "HAND_AUTHORED",
  };
}

export const grade3LearningActivitySeeds: LearningActivitySeed[] = grade3ActivityBank.map(toLearningActivitySeed);
