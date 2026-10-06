import { prisma } from "../db/prisma";
import {
  CAMP_PLAN_ACTIVITY_SLUG,
  CAMP_PLAN_LEARNER_GOAL,
  CAMP_PLAN_STANDARD_CODES,
  applyPurchaseToCamp,
  emptyCampPlan,
  evaluateBudget,
  lessonStockOnCamp,
  markBudgetPassed,
  markTeachCompleted,
  parseCampPlan,
  purchaseUpgrade,
  type CampBudgetAnswers,
  type CampPlanState,
} from "../play/campPlan";
import { parseStoredCamp, type CampState } from "../play/camp";
import { ensureCampForLearner } from "./camp";
import { recordStandardObservation } from "./standardsProgress";

function readPlan(raw: unknown): CampPlanState {
  return parseCampPlan(raw ?? emptyCampPlan());
}

async function loadCamp(learnerProfileId: string) {
  await ensureCampForLearner(learnerProfileId);
  const row = await prisma.campState.findUniqueOrThrow({
    where: { learnerProfileId },
  });
  return {
    plan: readPlan(row.campPlan),
    camp: parseStoredCamp(row),
  };
}

async function writePlan(learnerProfileId: string, plan: CampPlanState, suppliedCamp?: CampState) {
  const camp = suppliedCamp ?? (await loadCamp(learnerProfileId)).camp;
  const nextCamp = plan.purchasedUpgradeId
    ? applyPurchaseToCamp(camp, plan.purchasedUpgradeId)
    : plan.teachCompleted
      ? lessonStockOnCamp(camp)
      : camp;
  await prisma.campState.update({
    where: { learnerProfileId },
    data: {
      campPlan: plan,
      stage: nextCamp.stage,
      rations: nextCamp.rations,
      scrap: nextCamp.scrap,
      timber: nextCamp.timber,
      canvas: nextCamp.canvas,
      appliedGrantIds: nextCamp.appliedGrantIds,
    },
  });
  return { plan, camp: nextCamp };
}

async function markActivityComplete(learnerProfileId: string, sessionId?: string) {
  const activity = await prisma.learningActivity.findUnique({
    where: { slug: CAMP_PLAN_ACTIVITY_SLUG },
    select: { id: true },
  });
  if (!activity) return;
  const done = await prisma.learningActivityCompletion.findFirst({
    where: { learnerProfileId, learningActivityId: activity.id, completedAt: { not: null } },
    select: { id: true },
  });
  if (done) return;
  await prisma.learningActivityCompletion.create({
    data: {
      learnerProfileId,
      learningActivityId: activity.id,
      sessionId: sessionId ?? null,
      completedAt: new Date(),
      score: 1,
    },
  });
}

async function writeLessonEvidence(learnerProfileId: string, sessionId: string, upgradeId: string) {
  for (const standardCode of CAMP_PLAN_STANDARD_CODES) {
    try {
      await recordStandardObservation({
        sessionId,
        standardCode,
        evidenceTier: "GUIDED",
        sourceType: "ACTIVITY",
        correctness: 1,
        catalogSubjectSlug: "math_g3",
        notes: `camp-plan:${upgradeId}`,
        idempotencyKey: `camp-plan:${learnerProfileId}:${standardCode}`,
      });
    } catch (error) {
      console.error("[camp-plan evidence]", standardCode, error);
    }
  }
}

export async function getCampPlanForLearner(learnerProfileId: string): Promise<CampPlanState> {
  const { plan } = await loadCamp(learnerProfileId);
  return plan;
}

export async function campPlanPayload(learnerProfileId: string) {
  const plan = await getCampPlanForLearner(learnerProfileId);
  return {
    learnerGoal: CAMP_PLAN_LEARNER_GOAL,
    standardCodes: CAMP_PLAN_STANDARD_CODES,
    state: plan,
  };
}

export async function saveCampTeach(learnerProfileId: string) {
  const loaded = await loadCamp(learnerProfileId);
  const plan = markTeachCompleted(loaded.plan);
  return writePlan(learnerProfileId, plan, loaded.camp);
}

export async function saveCampBudget(learnerProfileId: string, answers: CampBudgetAnswers) {
  const evaluation = evaluateBudget(answers);
  const loaded = await loadCamp(learnerProfileId);
  const plan = evaluation.pass ? markBudgetPassed(markTeachCompleted(loaded.plan)) : loaded.plan;
  const saved = evaluation.pass ? await writePlan(learnerProfileId, plan, loaded.camp) : { plan, camp: loaded.camp };
  return { ...saved, evaluation };
}

export async function saveCampPurchase(learnerProfileId: string, upgradeId: string, sessionId?: string) {
  const loaded = await loadCamp(learnerProfileId);
  const bought = purchaseUpgrade(loaded.plan, upgradeId);
  if (!bought.ok) return { ok: false as const, error: bought.error, plan: loaded.plan };
  const saved = await writePlan(learnerProfileId, bought.state, loaded.camp);
  if (bought.state.purchasedUpgradeId) {
    await markActivityComplete(learnerProfileId, sessionId);
    if (sessionId) await writeLessonEvidence(learnerProfileId, sessionId, bought.state.purchasedUpgradeId);
  }
  return { ok: true as const, ...saved };
}
