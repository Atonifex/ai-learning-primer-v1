import { NextResponse } from "next/server";
import { childProfileResponse, isNextResponse } from "../../../lib/auth/apiChild";
import { listSessions } from "../../../lib/services/session";

export async function GET() {
  const profile = await childProfileResponse();
  if (isNextResponse(profile)) return profile;
  const sessions = await listSessions(profile.id);
  return NextResponse.json({ sessions });
}
