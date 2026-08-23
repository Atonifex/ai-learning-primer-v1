import { NextResponse } from "next/server";
import type { JWTPayload } from "./jwt";
import { getProfile } from "../services/profile";
import type { LearnerProfileData } from "../types";

export function parentForbidden(): NextResponse {
  return NextResponse.json(
    { error: "Sign in as a captain to play." },
    { status: 403 }
  );
}

export function childForbidden(): NextResponse {
  return NextResponse.json(
    { error: "This is a parent household action." },
    { status: 403 }
  );
}

export function requireParent(user: JWTPayload | null): JWTPayload | NextResponse {
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "PARENT") return childForbidden();
  return user;
}

export async function requireChildProfile(
  user: JWTPayload | null
): Promise<LearnerProfileData | NextResponse> {
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "CHILD") return parentForbidden();
  const profile = await getProfile(user.userId);
  if (!profile) {
    return NextResponse.json({ error: "No captain profile found" }, { status: 404 });
  }
  if (user.learnerId && user.learnerId !== profile.id) {
    return parentForbidden();
  }
  return profile;
}

export function isNextResponse(value: unknown): value is NextResponse {
  return value instanceof NextResponse;
}
