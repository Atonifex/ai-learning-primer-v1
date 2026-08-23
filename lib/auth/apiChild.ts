import { NextResponse } from "next/server";
import { getCurrentUser } from "./session";
import { isNextResponse, requireChildProfile } from "./guards";
import type { LearnerProfileData } from "../types";
import type { SessionData } from "../types";

export async function childProfileResponse(): Promise<
  LearnerProfileData | NextResponse
> {
  const user = await getCurrentUser();
  return requireChildProfile(user);
}

export function forbidIfForeignSession(
  session: SessionData,
  profileId: string
): NextResponse | null {
  if (session.learnerProfileId !== profileId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

export { isNextResponse };
