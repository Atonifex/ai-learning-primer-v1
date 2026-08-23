import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../../lib/auth/session";
import {
  isNextResponse,
  requireParent,
} from "../../../../lib/auth/guards";
import {
  UsernameTakenError,
  addCaptain,
  claimFusedCaptain,
  listHouseholdCaptains,
} from "../../../../lib/services/household";
import { prisma } from "../../../../lib/db/prisma";

export async function GET() {
  const user = await getCurrentUser();
  const parent = requireParent(user);
  if (isNextResponse(parent)) return parent;

  try {
    const fused = await prisma.learnerProfile.findUnique({
      where: { userId: parent.userId },
      select: { id: true, displayName: true },
    });
    const captains = await listHouseholdCaptains(parent.userId);
    return NextResponse.json({
      captains,
      fusedProfile: fused
        ? { id: fused.id, displayName: fused.displayName }
        : null,
    });
  } catch (err) {
    console.error("[household/captains GET]", err);
    return NextResponse.json(
      { error: "Could not load household" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  const parent = requireParent(user);
  if (isNextResponse(parent)) return parent;

  const body = await req.json().catch(() => null);
  const claimFused = body?.claimFused === true;
  const username = body?.username;
  const pin = body?.pin;
  const gradeBand = body?.gradeBand;
  const displayName = typeof body?.displayName === "string" ? body.displayName : null;

  try {
    if (claimFused) {
      const claimed = await claimFusedCaptain({
        parentUserId: parent.userId,
        username,
        pin,
      });
      return NextResponse.json({ ok: true, claimed });
    }
    const { profile, child } = await addCaptain({
      parentUserId: parent.userId,
      username,
      pin,
      gradeBand,
      displayName,
    });
    return NextResponse.json({
      ok: true,
      captain: {
        userId: child.id,
        learnerId: profile.id,
        username: child.username,
        displayName: profile.displayName,
      },
    });
  } catch (err) {
    if (err instanceof UsernameTakenError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    const message = err instanceof Error ? err.message : "Could not add captain";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
