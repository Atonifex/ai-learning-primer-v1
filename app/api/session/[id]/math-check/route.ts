import { NextRequest, NextResponse } from "next/server";
import { childSessionResponse } from "../../../../../lib/auth/apiChild";
import {
  loadMathCheck,
  mathCheckError,
  submitMathFiveCheck,
} from "../../../../../lib/services/mathCheckSession";
import type { MathFiveAnswer } from "../../../../../lib/play/mathFiveCheck";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: sessionId } = await params;
  const owned = await childSessionResponse(sessionId);
  if ("error" in owned) return owned.error;

  try {
    return NextResponse.json(await loadMathCheck(owned.profile.id, sessionId));
  } catch { return mathCheckError("Your math check could not load. Please try again.", 503); }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: sessionId } = await params;
  const owned = await childSessionResponse(sessionId);
  if ("error" in owned) return owned.error;

  const body = (await req.json().catch(() => ({}))) as { answers?: MathFiveAnswer[] };
  if (!Array.isArray(body.answers)) return mathCheckError("Missing answers", 400);

  try {
    const result = await submitMathFiveCheck({
      sessionId,
      profileId: owned.profile.id,
      answers: body.answers,
    });
    if (result.status === 400) return mathCheckError(result.error ?? "Could not score that check", 400);
    return NextResponse.json(result.body);
  } catch {
    return mathCheckError("Your answer could not finish saving. Restore your saved check and try again.", 503);
  }
}
