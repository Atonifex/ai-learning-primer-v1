import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../../../../../lib/auth/session";
import { getProfile } from "../../../../../../../lib/services/profile";
import { submitGeneratedMiniQuiz } from "../../../../../../../lib/services/learningActivities";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; activityId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await getProfile(user.userId);
  if (!profile) return NextResponse.json({ error: "No profile found" }, { status: 404 });

  const { id: sessionId, activityId } = await params;
  const body = (await req.json()) as {
    answers?: Array<{ itemId: string; selectedIndex: number }>;
  };

  if (!Array.isArray(body.answers)) {
    return NextResponse.json({ error: "Missing answers" }, { status: 400 });
  }

  try {
    const result = await submitGeneratedMiniQuiz({
      sessionId,
      learnerProfileId: profile.id,
      activityId,
      answers: body.answers,
    });
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to submit activity" },
      { status: 400 }
    );
  }
}
