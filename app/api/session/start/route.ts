import { NextRequest, NextResponse } from "next/server";
import {
  childProfileResponse,
  isNextResponse,
} from "../../../../lib/auth/apiChild";
import { getActiveSession } from "../../../../lib/services/session";
import { startOrContinueSubjectSession } from "../../../../lib/services/missions";
import { isPlayableCoreSubject } from "../../../../lib/constants/subjects";

export async function POST(req: NextRequest) {
  const profile = await childProfileResponse();
  if (isNextResponse(profile)) return profile;

  const body = (await req.json().catch(() => null)) as { subjectSlug?: string } | null;
  const requested = body?.subjectSlug?.trim();
  const subjectSlug =
    requested && isPlayableCoreSubject(requested)
      ? requested
      : profile.primarySubjectSlug;

  if (requested && isPlayableCoreSubject(requested)) {
    const started = await startOrContinueSubjectSession(profile.id, subjectSlug);
    return NextResponse.json({ sessionId: started.sessionId, switched: started.switched });
  }

  const existing = await getActiveSession(profile.id);
  if (existing) return NextResponse.json({ sessionId: existing });

  const started = await startOrContinueSubjectSession(profile.id, subjectSlug);
  return NextResponse.json({ sessionId: started.sessionId });
}
