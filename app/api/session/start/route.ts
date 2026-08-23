import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../../lib/auth/session";
import { getProfile } from "../../../../lib/services/profile";
import { getActiveSession } from "../../../../lib/services/session";
import { startOrContinueSubjectSession } from "../../../../lib/services/missions";
import { isGrade3CoreSubject } from "../../../../lib/constants/subjects";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await getProfile(user.userId);
  if (!profile) return NextResponse.json({ error: "No profile found" }, { status: 404 });

  const body = (await req.json().catch(() => null)) as { subjectSlug?: string } | null;
  const requested = body?.subjectSlug?.trim();
  const subjectSlug =
    requested && isGrade3CoreSubject(requested) ? requested : profile.primarySubjectSlug;

  if (requested && isGrade3CoreSubject(requested)) {
    const started = await startOrContinueSubjectSession(profile.id, subjectSlug);
    return NextResponse.json({ sessionId: started.sessionId, switched: started.switched });
  }

  const existing = await getActiveSession(profile.id);
  if (existing) return NextResponse.json({ sessionId: existing });

  const started = await startOrContinueSubjectSession(profile.id, subjectSlug);
  return NextResponse.json({ sessionId: started.sessionId });
}
