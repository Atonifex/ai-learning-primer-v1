import { NextRequest, NextResponse } from "next/server";
import {
  childProfileResponse,
  forbidIfForeignSession,
  isNextResponse,
} from "../../../../../lib/auth/apiChild";
import { getSession } from "../../../../../lib/services/session";
import {
  hasCompletedChapterReflection,
  startChapterReflection,
  submitChapterReflection,
} from "../../../../../lib/play/chapterReflection";

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
  const completed = await hasCompletedChapterReflection(profile.id);
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
    | { action?: string; completionId?: string; text?: string }
    | null;

  const action = body?.action === "submit" ? "submit" : "start";

  try {
    if (action === "start") {
      const reflection = await startChapterReflection({
        learnerProfileId: profile.id,
        sessionId,
      });
      return NextResponse.json({ reflection });
    }

    if (!body?.completionId || typeof body.text !== "string") {
      return NextResponse.json({ error: "Missing crew log" }, { status: 400 });
    }

    const result = await submitChapterReflection({
      sessionId,
      learnerProfileId: profile.id,
      completionId: body.completionId,
      text: body.text,
    });
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Crew log failed" },
      { status: 400 }
    );
  }
}
