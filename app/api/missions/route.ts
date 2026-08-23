import { NextResponse } from "next/server";
import { getCurrentUser } from "../../../lib/auth/session";
import { getProfile } from "../../../lib/services/profile";
import { getMissionBoard } from "../../../lib/services/missions";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const profile = await getProfile(user.userId);
  if (!profile) return NextResponse.json({ error: "No profile found" }, { status: 404 });

  const board = await getMissionBoard(profile.id);
  return NextResponse.json(board);
}
