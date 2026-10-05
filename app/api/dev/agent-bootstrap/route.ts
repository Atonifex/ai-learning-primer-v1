import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/db/prisma";
import { applyAuthCookie } from "../../../../lib/auth/session";
import { tokenForUser } from "../../../../lib/auth/tokenUser";
import {
  buildAgentLearnUrl,
  isAgentPlaytestEnabled,
  type AgentPlayOpen,
} from "../../../../lib/play/agentPlaytest";
import {
  TEST_CAPTAIN_PIN,
  TEST_CAPTAIN_USERNAME,
} from "../../../../lib/play/testCaptain";
import { getActiveSession, startSession } from "../../../../lib/services/session";
import { getProfile } from "../../../../lib/services/profile";

/**
 * Local-only: log in as the seeded test captain, force first-run complete,
 * open/reuse a session, return a ready /learn URL for AI browser agents.
 */
export async function POST(req: NextRequest) {
  const host = req.headers.get("host");
  if (!isAgentPlaytestEnabled(host)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const openRaw = typeof body?.open === "string" ? body.open : "dialogue";
  const open: AgentPlayOpen =
    openRaw === "board" || openRaw === "none" || openRaw === "dialogue" || openRaw === "clip" || openRaw === "intro"
      ? openRaw
      : "dialogue";

  const user = await prisma.user.findUnique({
    where: { username: TEST_CAPTAIN_USERNAME },
    include: { learnerProfile: { select: { id: true } } },
  });
  if (!user || user.role !== "CHILD" || !user.learnerProfile) {
    return NextResponse.json(
      {
        error:
          "Seeded testcaptain missing. Run `npx prisma db seed` (or `npm run db:seed`).",
      },
      { status: 503 }
    );
  }

  const pinOk = await bcrypt.compare(TEST_CAPTAIN_PIN, user.passwordHash);
  if (!pinOk) {
    return NextResponse.json(
      {
        error:
          "testcaptain PIN does not match seed. Re-run seed or reset the captain PIN to 1234.",
      },
      { status: 503 }
    );
  }

  await prisma.learnerProfile.update({
    where: { id: user.learnerProfile.id },
    data: { firstRunStep: open === "intro" ? "video" : "complete" },
  });

  if (open === "intro") {
    await prisma.memoryItem.deleteMany({ where: { id: `${user.learnerProfile.id}:intro:v3` } });
  }

  const profile = await getProfile(user.id);
  if (!profile) {
    return NextResponse.json({ error: "Profile missing after update" }, { status: 500 });
  }

  let sessionId = await getActiveSession(profile.id);
  if (!sessionId) {
    sessionId = await startSession(profile.id, profile.primarySubjectSlug);
  }

  const token = await tokenForUser({
    id: user.id,
    email: user.email,
    role: "CHILD",
    householdId: user.householdId,
    learnerProfile: user.learnerProfile,
  });

  const learnUrl = buildAgentLearnUrl(sessionId, open);
  const res = NextResponse.json({
    ok: true,
    username: TEST_CAPTAIN_USERNAME,
    pin: TEST_CAPTAIN_PIN,
    displayName: profile.displayName,
    firstRunStep: open === "intro" ? "video" : "complete",
    sessionId,
    subjectSlug: profile.primarySubjectSlug,
    learnUrl,
    boardUrl: buildAgentLearnUrl(sessionId, "board"),
    dialogueUrl: buildAgentLearnUrl(sessionId, "dialogue"),
    nextSteps: [
      "Open learnUrl (cookie is set on this response).",
      "For show_mission_board: in dialogue say 'show the mission board' or 'what jobs do we have?'.",
      "For UI-only Jobs overlay: open boardUrl — no LLM required.",
      "HUD Jobs button also works once first-run is complete.",
    ],
  });
  applyAuthCookie(res, token);
  return res;
}
