/**
 * Maps Grade 3 hand-authored bank templates into LearningActivity seed rows.
 * Import from prisma/seed.ts after G3 catalogs are seeded.
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
    subjectSlug: template.subjectSlug,
    description: template.prompt,
    narrativeContext: template.storySkinNotes,
    targetStandardCodes: template.targetStandardCodes,
    estimatedMinutes: template.estimatedMinutes,
    authoring: "HAND_AUTHORED",
    content: {
      bankKind: template.kind,
      chapterId: template.chapterId,
      unitId: template.unitId,
      scaffoldHints: template.scaffoldHints,
      answerRubric: template.answerRubric,
      quizItems: template.quizItems,
      readingText: template.readingText,
    },
  };
}

export const grade3LearningActivitySeeds: LearningActivitySeed[] =
  grade3ActivityBank.map(toLearningActivitySeed);
