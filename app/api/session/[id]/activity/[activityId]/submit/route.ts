import { NextRequest, NextResponse } from "next/server";
import { childProfileResponse, isNextResponse } from "../../../../../../../lib/auth/apiChild";
import { submitGeneratedMiniQuiz } from "../../../../../../../lib/services/learningActivities";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; activityId: string }> }
) {
  const profile = await childProfileResponse();
  if (isNextResponse(profile)) return profile;

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
