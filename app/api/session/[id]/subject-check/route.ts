import { NextRequest, NextResponse } from "next/server";
import { childSessionResponse } from "../../../../../lib/auth/apiChild";
import { checkDomain } from "../../../../../lib/play/subjectFiveCheck";
import { loadSubjectCheck, saveSubjectCheck } from "../../../../../lib/services/subjectCheckSession";

async function owned(id: string) {
  const result = await childSessionResponse(id);
  if (result.error) return { error: result.error };
  const { profile, session } = result;
  const domain = checkDomain(session.subjectSlug);
  if (!domain) return { error: NextResponse.json({ error: "Choose reading, science or social studies first." }, { status: 400 }) };
  return { profile, domain };
}
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await owned(id);
  if ("error" in result) return result.error;
  try { return NextResponse.json(await loadSubjectCheck(result.profile.id, result.domain)); }
  catch { return NextResponse.json({ error: "Could not load the saved check. Please try again." }, { status: 503 }); }
}
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await owned(id);
  if ("error" in result) return result.error;
  const body = await req.json().catch(() => null);
  if (!Array.isArray(body?.answers) || body.answers.length > 5) return NextResponse.json({ error: "Choose an answer on the check." }, { status: 400 });
  try { return NextResponse.json(await saveSubjectCheck({ profileId: result.profile.id, sessionId: id, domain: result.domain, answers: body.answers })); }
  catch { return NextResponse.json({ error: "Could not save this answer. Close and reopen the check to restore your saved place." }, { status: 409 }); }
}
