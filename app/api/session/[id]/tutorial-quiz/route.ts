import { NextRequest, NextResponse } from "next/server";
import {
  childProfileResponse,
  forbidIfForeignSession,
  isNextResponse,
} from "../../../../../lib/auth/apiChild";
import { getSession } from "../../../../../lib/services/session";
import {
  hasCompletedTutorialQuiz,
  startTutorialOverlayQuiz,
  submitTutorialOverlayQuiz,
} from "../../../../../lib/play/tutorialQuiz";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const profile = await childProfileResponse();
  if (isNextResponse(profile)) return profile;
  const { id: sessionId } = await params;
  const session = await getSession(sessionId);
  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
  const foreign = forbidIfForeignSession(session, profile.id);
  if (foreign) return foreign;
  const completed = await hasCompletedTutorialQuiz(profile.id);
  return NextResponse.json({ completed });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const profile = await childProfileResponse();
  if (isNextResponse(profile)) return profile;

  const { id: sessionId } = await params;
  const session = await getSession(sessionId);
  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
  const foreign = forbidIfForeignSession(session, profile.id);
  if (foreign) return foreign;

  const body = (await req.json().catch(() => null)) as
    | {
        action?: string;
        completionId?: string;
        answers?: Array<{ itemId: string; selectedIndex: number }>;
      }
    | null;

  const action = body?.action === "submit" ? "submit" : "start";

  try {
    if (action === "start") {
      const quiz = await startTutorialOverlayQuiz({
        learnerProfileId: profile.id,
        sessionId,
      });
      return NextResponse.json({ quiz });
    }

    if (!body?.completionId || !Array.isArray(body.answers)) {
      return NextResponse.json({ error: "Missing answers" }, { status: 400 });
    }

    const result = await submitTutorialOverlayQuiz({
      sessionId,
      learnerProfileId: profile.id,
      completionId: body.completionId,
      answers: body.answers,
    });
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Tutorial quiz failed" },
      { status: 400 }
    );
  }
}
