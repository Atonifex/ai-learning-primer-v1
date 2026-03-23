import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../lib/auth/session";
import { getProfile } from "../../../lib/services/profile";
import { listSessions } from "../../../lib/services/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const profile = await getProfile(user.userId);
  if (!profile) return NextResponse.json({ sessions: [] });
  const sessions = await listSessions(profile.id);
  return NextResponse.json({ sessions });
}
