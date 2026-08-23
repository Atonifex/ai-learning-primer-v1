import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../../lib/auth/session";
import { getProfile } from "../../../../lib/services/profile";
import { startMissionForLearner } from "../../../../lib/services/missions";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const profile = await getProfile(user.userId);
  if (!profile) return NextResponse.json({ error: "No profile found" }, { status: 404 });

  const body = (await req.json().catch(() => null)) as { missionId?: string } | null;
  const missionId = body?.missionId?.trim();
  if (!missionId) {
    return NextResponse.json({ error: "Missing missionId" }, { status: 400 });
  }

  try {
    const started = await startMissionForLearner({
      learnerProfileId: profile.id,
      missionId,
    });
    return NextResponse.json({
      sessionId: started.sessionId,
      switched: started.switched,
      mission: started.mission,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not start mission" },
      { status: 400 }
    );
  }
}
