import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../lib/auth/session";
import {
  ProfileAlreadyExistsError,
  createProfile,
  getProfile,
} from "../../../lib/services/profile";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const profile = await getProfile(user.userId);
  return NextResponse.json({ profile });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const displayName =
    typeof body?.displayName === "string" ? body.displayName : null;
  const goals = typeof body?.goals === "string" ? body.goals.trim() : "";
  const interests = Array.isArray(body?.interests)
    ? body.interests.filter((v: unknown): v is string => typeof v === "string")
    : [];
  const primarySubjectSlug =
    typeof body?.primarySubjectSlug === "string"
      ? body.primarySubjectSlug
      : undefined;

  if (!goals) {
    return NextResponse.json(
      { error: "Goals are required" },
      { status: 400 }
    );
  }

  try {
    const profile = await createProfile(user.userId, {
      displayName,
      goals,
      interests,
      primarySubjectSlug,
    });
    return NextResponse.json({ profile });
  } catch (err) {
    if (err instanceof ProfileAlreadyExistsError) {
      return NextResponse.json(
        { error: "Profile already exists" },
        { status: 409 }
      );
    }
    console.error("createProfile failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create profile" },
      { status: 500 }
    );
  }
}
