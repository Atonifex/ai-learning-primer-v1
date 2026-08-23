import { NextRequest, NextResponse } from "next/server";
import {
  childProfileResponse,
  forbidIfForeignSession,
  isNextResponse,
} from "../../../../lib/auth/apiChild";
import { enrichSessionDataWithSignedUrls } from "../../../../lib/services/characterPortraits";
import { getSession } from "../../../../lib/services/session";
import { buildSessionStoryUi } from "../../../../lib/services/sessionStoryContext";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const profile = await childProfileResponse();
  if (isNextResponse(profile)) return profile;
  const { id } = await params;
  const session = await getSession(id);
  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
  const foreign = forbidIfForeignSession(session, profile.id);
  if (foreign) return foreign;
  const enriched = await enrichSessionDataWithSignedUrls(session);
  const storyUi = await buildSessionStoryUi(id);
  return NextResponse.json({ session: enriched, storyUi });
}
