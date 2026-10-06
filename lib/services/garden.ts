import { prisma } from "../db/prisma";
import {
  emptyGardenState,
  evaluateGarden,
  markLesson1Passed,
  parseGardenState,
  type GardenState,
} from "../play/gardenPlot";
import { applyCampGrantToLearner, ensureCampForLearner } from "./camp";
import type { CampGrant } from "../play/camp";

export const GARDEN_LESSON1_GRANT: CampGrant = {
  id: "garden-lesson1",
  rations: 1,
  timber: 1,
  minStage: "tent",
};

function readGarden(raw: unknown): GardenState {
  return parseGardenState(raw ?? emptyGardenState());
}

export async function getGardenForLearner(learnerProfileId: string): Promise<GardenState> {
  await ensureCampForLearner(learnerProfileId);
  const row = await prisma.campState.findUnique({
    where: { learnerProfileId },
    select: { garden: true },
  });
  return readGarden(row?.garden);
}

export async function saveGardenForLearner(
  learnerProfileId: string,
  state: GardenState
): Promise<GardenState> {
  await ensureCampForLearner(learnerProfileId);
  let next = state;
  const evaluation = evaluateGarden(next);
  if (evaluation.lesson1Pass) {
    next = markLesson1Passed(next);
  }
  await prisma.campState.update({
    where: { learnerProfileId },
    data: { garden: next },
  });
  if (next.lesson1Passed && evaluation.lesson1Pass) {
    await applyCampGrantToLearner(learnerProfileId, GARDEN_LESSON1_GRANT);
  }
  return next;
}

export async function gardenPayloadForOpen(learnerProfileId: string) {
  const state = await getGardenForLearner(learnerProfileId);
  const evaluation = evaluateGarden(state);
  return {
    learnerGoal: "What plants need to grow" as const,
    standardCode: "SC.3.L.17.2" as const,
    state,
    evaluation,
  };
}
