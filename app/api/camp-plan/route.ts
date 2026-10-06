import { NextResponse } from "next/server";
import { childProfileResponse, isNextResponse } from "../../../lib/auth/apiChild";
import {
  CAMP_PLAN_LEARNER_GOAL,
  CAMP_PLAN_STANDARD_CODES,
  LESSON1_RATION_KEEP,
  LESSON1_STOCK,
  LESSON1_UPGRADES,
  campUpgradeKind,
  parseBudgetAnswers,
  remainderAfterPurchase,
} from "../../../lib/play/campPlan";
import {
  campPlanPayload,
  saveCampBudget,
  saveCampPurchase,
  saveCampTeach,
} from "../../../lib/services/campPlan";

function publicUpgrades() {
  return LESSON1_UPGRADES.map((row) => ({
    id: row.id,
    label: row.label,
    blurb: row.blurb,
    cost: row.cost,
    buildable: row.world != null,
  }));
}

export async function GET() {
  const profile = await childProfileResponse();
  if (isNextResponse(profile)) return profile;
  try {
    const payload = await campPlanPayload(profile.id);
    return NextResponse.json({
      ...payload,
      stock: LESSON1_STOCK,
      rationKeep: LESSON1_RATION_KEEP,
      upgrades: publicUpgrades(),
      upgrade: campUpgradeKind(payload.state),
      remainder: payload.state.purchasedUpgradeId
        ? remainderAfterPurchase(payload.state.purchasedUpgradeId)
        : null,
    });
  } catch (error) {
    console.error("[camp-plan GET]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not open the camp plan." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const profile = await childProfileResponse();
  if (isNextResponse(profile)) return profile;
  const body = (await req.json().catch(() => null)) as {
    action?: string;
    answers?: unknown;
    upgradeId?: string;
    sessionId?: string;
  } | null;
  const action = body?.action;

  try {
    if (action === "teach_done") {
      const saved = await saveCampTeach(profile.id);
      return NextResponse.json({
        learnerGoal: CAMP_PLAN_LEARNER_GOAL,
        standardCodes: CAMP_PLAN_STANDARD_CODES,
        state: saved.plan,
        stock: LESSON1_STOCK,
      });
    }
    if (action === "budget") {
      const answers = parseBudgetAnswers(body?.answers);
      if (!answers) return NextResponse.json({ error: "Enter a whole number for each line." }, { status: 400 });
      const saved = await saveCampBudget(profile.id, answers);
      return NextResponse.json({
        learnerGoal: CAMP_PLAN_LEARNER_GOAL,
        standardCodes: CAMP_PLAN_STANDARD_CODES,
        state: saved.plan,
        evaluation: saved.evaluation,
        upgrades: publicUpgrades(),
      });
    }
    if (action === "buy") {
      if (typeof body?.upgradeId !== "string") {
        return NextResponse.json({ error: "Choose one upgrade to build." }, { status: 400 });
      }
      const saved = await saveCampPurchase(
        profile.id,
        body.upgradeId,
        typeof body.sessionId === "string" ? body.sessionId : undefined
      );
      if (!saved.ok) return NextResponse.json({ error: saved.error }, { status: 400 });
      return NextResponse.json({
        learnerGoal: CAMP_PLAN_LEARNER_GOAL,
        standardCodes: CAMP_PLAN_STANDARD_CODES,
        state: saved.plan,
        upgrade: campUpgradeKind(saved.plan),
        remainder: saved.plan.purchasedUpgradeId ? remainderAfterPurchase(saved.plan.purchasedUpgradeId) : null,
        stage: saved.camp.stage,
      });
    }
    return NextResponse.json({ error: "Unknown camp plan action." }, { status: 400 });
  } catch (error) {
    console.error("[camp-plan POST]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not save the camp plan." },
      { status: 500 }
    );
  }
}
