import { NextResponse } from "next/server";
import { getCurrentUser } from "./session";
import { isNextResponse, requireChildProfile } from "./guards";
import type { LearnerProfileData } from "../types";
import type { SessionData } from "../types";
import { prisma } from "../db/prisma";

export async function childProfileResponse(): Promise<
  LearnerProfileData | NextResponse
> {
  const user = await getCurrentUser();
  return requireChildProfile(user);
}

export function forbidIfForeignSession(
  session: Pick<SessionData, "learnerProfileId">,
  profileId: string
): NextResponse | null {
  if (session.learnerProfileId !== profileId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

/** Check ownership without loading messages or mutating story/chapter links. */
export async function childSessionResponse(sessionId: string) {
  const profile = await childProfileResponse();
  if (isNextResponse(profile)) return { error: profile };
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { learnerProfileId: true, subject: { select: { slug: true } } },
  });
  if (!session) return { error: NextResponse.json({ error: "Session not found" }, { status: 404 }) };
  const foreign = forbidIfForeignSession(session, profile.id);
  if (foreign) return { error: foreign };
  return { profile, session: { learnerProfileId: session.learnerProfileId, subjectSlug: session.subject.slug } };
}

export { isNextResponse };
