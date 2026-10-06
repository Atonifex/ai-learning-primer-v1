import { NextResponse } from "next/server";
import { childProfileResponse, isNextResponse } from "../../../lib/auth/apiChild";
import {
  clearPlot,
  evaluateGarden,
  getTutorialGardenLayout,
  placeSeedling,
} from "../../../lib/play/gardenPlot";
import {
  gardenPayloadForOpen,
  getGardenForLearner,
  saveGardenForLearner,
} from "../../../lib/services/garden";

export async function GET() {
  const profile = await childProfileResponse();
  if (isNextResponse(profile)) return profile;
  try {
    const payload = await gardenPayloadForOpen(profile.id);
    return NextResponse.json({
      ...payload,
      plots: getTutorialGardenLayout(),
    });
  } catch (e) {
    console.error("[garden GET]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not open the garden." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const profile = await childProfileResponse();
  if (isNextResponse(profile)) return profile;

  const body = (await req.json().catch(() => null)) as {
    action?: string;
    plotId?: string;
    plantings?: { plotId: string; plantedAt?: string }[];
  } | null;

  const action = body?.action;
  let state = await getGardenForLearner(profile.id);

  if (action === "place" && typeof body?.plotId === "string") {
    const result = placeSeedling(state, body.plotId);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    state = result.state;
  } else if (action === "clear" && typeof body?.plotId === "string") {
    const result = clearPlot(state, body.plotId);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    state = result.state;
  } else if (action === "replace" && Array.isArray(body?.plantings)) {
    state = {
      version: 1,
      layoutId: "tutorial-shore-v1",
      plantings: [],
      lesson1Passed: false,
    };
    for (const row of body.plantings) {
      if (typeof row?.plotId !== "string") continue;
      const result = placeSeedling(state, row.plotId, row.plantedAt);
      if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
      state = result.state;
    }
  } else if (action === "submit") {
    // keep current state
  } else {
    return NextResponse.json({ error: "Unknown garden action." }, { status: 400 });
  }

  const saved = await saveGardenForLearner(profile.id, state);
  const evaluation = evaluateGarden(saved);
  return NextResponse.json({
    learnerGoal: "What plants need to grow",
    standardCode: "SC.3.L.17.2",
    state: saved,
    evaluation,
    plots: getTutorialGardenLayout(),
  });
}
