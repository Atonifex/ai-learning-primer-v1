import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../lib/auth/session";
import {
  ProfileAlreadyExistsError,
  createProfile,
  getProfile,
  updateProfile,
} from "../../../lib/services/profile";
import { isLearnerGradeBand } from "../../../lib/constants/grades";

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
  const gradeBandRaw =
    typeof body?.gradeBand === "string"
      ? body.gradeBand
      : typeof body?.gradeBand === "number"
        ? String(body.gradeBand)
        : null;
  if (gradeBandRaw != null && !isLearnerGradeBand(gradeBandRaw)) {
    return NextResponse.json(
      { error: "gradeBand must be a grade from 3 to 8" },
      { status: 400 }
    );
  }
  const readingLevelRaw =
    typeof body?.readingLevel === "string"
      ? body.readingLevel
      : typeof body?.readingLevel === "number"
        ? String(body.readingLevel)
        : null;
  if (readingLevelRaw != null && !isLearnerGradeBand(readingLevelRaw)) {
    return NextResponse.json(
      { error: "readingLevel must be a grade from 3 to 8" },
      { status: 400 }
    );
  }
  // Goals/interests are optional — onboarding is name + grade + dive-in.
  const goals =
    typeof body?.goals === "string" && body.goals.trim()
      ? body.goals.trim()
      : undefined;
  const interests = Array.isArray(body?.interests)
    ? body.interests.filter((v: unknown): v is string => typeof v === "string")
    : undefined;
  const primarySubjectSlug =
    typeof body?.primarySubjectSlug === "string"
      ? body.primarySubjectSlug
      : undefined;

  try {
    const profile = await createProfile(user.userId, {
      displayName,
      gradeBand: gradeBandRaw,
      readingLevel: readingLevelRaw,
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

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const readingLevelRaw =
    typeof body?.readingLevel === "string"
      ? body.readingLevel
      : typeof body?.readingLevel === "number"
        ? String(body.readingLevel)
        : null;

  if (readingLevelRaw == null) {
    return NextResponse.json(
      { error: "readingLevel is required" },
      { status: 400 }
    );
  }
  if (!isLearnerGradeBand(readingLevelRaw)) {
    return NextResponse.json(
      { error: "readingLevel must be a grade from 3 to 8" },
      { status: 400 }
    );
  }

  try {
    const profile = await updateProfile(user.userId, {
      readingLevel: readingLevelRaw,
    });
    return NextResponse.json({ profile });
  } catch (err) {
    console.error("updateProfile failed:", err);
    const message = err instanceof Error ? err.message : "Failed to update profile";
    const status = message === "Profile not found" ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
