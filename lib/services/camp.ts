import { prisma } from "../db/prisma";
import {
  applyCampGrant,
  emptyCamp,
  MATH_CHECK_GRANT,
  parseStoredCamp,
  toCampPublic,
  WRECK_SALVAGE_GRANT,
  type CampGrant,
  type CampPublic,
  type CampState,
} from "../play/camp";
import { hasSavedMathPlacement } from "../play/mathPlacement";
import { TUTORIAL_QUIZ_SLUG } from "../play/tutorialQuizSlug";

function rowToState(row: {
  stage: string;
  rations: number;
  scrap: number;
  timber: number;
  canvas: number;
  appliedGrantIds: string[];
  crew: unknown;
}): CampState {
  return parseStoredCamp({
    stage: row.stage,
    rations: row.rations,
    scrap: row.scrap,
    timber: row.timber,
    canvas: row.canvas,
    appliedGrantIds: row.appliedGrantIds,
    crew: row.crew,
  });
}

async function hasWreckSalvage(learnerProfileId: string): Promise<boolean> {
  const activity = await prisma.learningActivity.findUnique({
    where: { slug: TUTORIAL_QUIZ_SLUG },
    select: { id: true },
  });
  if (!activity) return false;
  const done = await prisma.learningActivityCompletion.findFirst({
    where: {
      learnerProfileId,
      learningActivityId: activity.id,
      completedAt: { not: null },
    },
    select: { id: true },
  });
  return Boolean(done);
}

async function writeCamp(learnerProfileId: string, state: CampState) {
  return prisma.campState.upsert({
    where: { learnerProfileId },
    create: {
      learnerProfileId,
      stage: state.stage,
      rations: state.rations,
      scrap: state.scrap,
      timber: state.timber,
      canvas: state.canvas,
      appliedGrantIds: state.appliedGrantIds,
      crew: state.crew,
    },
    update: {
      stage: state.stage,
      rations: state.rations,
      scrap: state.scrap,
      timber: state.timber,
      canvas: state.canvas,
      appliedGrantIds: state.appliedGrantIds,
      crew: state.crew,
    },
  });
}

export async function applyCampGrantToLearner(
  learnerProfileId: string,
  grant: CampGrant
): Promise<CampPublic> {
  const row = await prisma.campState.findUnique({ where: { learnerProfileId } });
  const next = applyCampGrant(row ? rowToState(row) : emptyCamp(), grant);
  await writeCamp(learnerProfileId, next);
  return toCampPublic(next);
}

/**
 * Create the empty camp if needed. If wreck salvage is already done, apply
 * that grant once so returning captains (and the shared playtest account)
 * get the crate pile without retaking the overlay.
 */
export async function ensureCampForLearner(learnerProfileId: string): Promise<CampPublic> {
  const [row, wreckDone, placement] = await Promise.all([
    prisma.campState.findUnique({ where: { learnerProfileId } }),
    hasWreckSalvage(learnerProfileId),
    prisma.learnerProfile.findUnique({
      where: { id: learnerProfileId },
      select: { mathPlacementCode: true, mathPlacementStatus: true },
    }),
  ]);
  let state = row ? rowToState(row) : emptyCamp();
  if (wreckDone) {
    state = applyCampGrant(state, WRECK_SALVAGE_GRANT);
  }
  if (hasSavedMathPlacement(placement?.mathPlacementCode, placement?.mathPlacementStatus)) {
    state = applyCampGrant(state, MATH_CHECK_GRANT);
  }
  if (!row || state.appliedGrantIds.join(",") !== (row.appliedGrantIds ?? []).join(",")) {
    await writeCamp(learnerProfileId, state);
  }
  return toCampPublic(state);
}
