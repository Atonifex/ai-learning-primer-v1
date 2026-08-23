import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../../../lib/auth/session";
import { getProfile } from "../../../../../lib/services/profile";
import { getSession } from "../../../../../lib/services/session";
import { TUTORIAL_QUIZ_SLUG } from "../../../../../lib/play/tutorialQuizSlug";
import {
  hasCompletedActivitySlug,
  startBankOverlayQuiz,
  submitBankOverlayQuiz,
} from "../../../../../lib/play/overlayQuiz";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const profile = await getProfile(user.userId);
  if (!profile) return NextResponse.json({ error: "No profile found" }, { status: 404 });
  const { id: sessionId } = await params;
  const session = await getSession(sessionId);
  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

  const slug = req.nextUrl.searchParams.get("slug")?.trim() || TUTORIAL_QUIZ_SLUG;
  const completed = await hasCompletedActivitySlug(profile.id, slug);
  return NextResponse.json({ completed, slug });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await getProfile(user.userId);
  if (!profile) return NextResponse.json({ error: "No profile found" }, { status: 404 });

  const { id: sessionId } = await params;
  const session = await getSession(sessionId);
  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

  const body = (await req.json().catch(() => null)) as
    | {
        action?: string;
        slug?: string;
        completionId?: string;
        answers?: Array<{ itemId: string; selectedIndex: number }>;
      }
    | null;

  const action = body?.action === "submit" ? "submit" : "start";
  const slug = body?.slug?.trim() || TUTORIAL_QUIZ_SLUG;

  try {
    if (action === "start") {
      const quiz = await startBankOverlayQuiz({
        learnerProfileId: profile.id,
        sessionId,
        slug,
      });
      return NextResponse.json({ quiz });
    }

    if (!body?.completionId || !Array.isArray(body.answers)) {
      return NextResponse.json({ error: "Missing answers" }, { status: 400 });
    }

    const result = await submitBankOverlayQuiz({
      sessionId,
      learnerProfileId: profile.id,
      completionId: body.completionId,
      slug,
      answers: body.answers,
    });
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Overlay quiz failed" },
      { status: 400 }
    );
  }
}
