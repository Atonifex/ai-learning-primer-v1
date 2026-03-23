import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../../lib/auth/session";
import { getProfile } from "../../../../lib/services/profile";
import { startSession, getActiveSession } from "../../../../lib/services/session";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await getProfile(user.userId);
  if (!profile) return NextResponse.json({ error: "No profile found" }, { status: 404 });

  // Return existing active session if one exists
  const existing = await getActiveSession(profile.id);
  if (existing) return NextResponse.json({ sessionId: existing });

  const sessionId = await startSession(profile.id, profile.activeLanguage);
  return NextResponse.json({ sessionId });
}
