import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../lib/auth/session";
import { getProfile, createProfile } from "../../../lib/services/profile";
import type { Language, Level } from "../../../lib/types";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const profile = await getProfile(user.userId);
  return NextResponse.json({ profile });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { activeLanguage, currentLevel, goals, interests } = await req.json();

  if (!activeLanguage || !currentLevel || !goals) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const profile = await createProfile(user.userId, {
    activeLanguage: activeLanguage as Language,
    currentLevel: currentLevel as Level,
    goals,
    interests: Array.isArray(interests) ? interests : [],
  });

  return NextResponse.json({ profile });
}
