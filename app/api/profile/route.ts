import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../lib/auth/session";
import {
  isNextResponse,
  requireChildProfile,
} from "../../../lib/auth/guards";
import { updateProfile } from "../../../lib/services/profile";
import { isLearnerGradeBand } from "../../../lib/constants/grades";
import {
  isFirstRunStep,
  type FirstRunEvent,
} from "../../../lib/play/firstRun";

const FIRST_RUN_EVENTS = new Set<FirstRunEvent>([
  "video_done",
  "name_saved",
  "walked_to_wreck",
  "spoke_to_rho",
  "work_done",
]);

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "CHILD") {
    return NextResponse.json({ profile: null });
  }
  const profile = await requireChildProfile(user);
  if (isNextResponse(profile)) return profile;
  return NextResponse.json({ profile });
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  const profileOrErr = await requireChildProfile(user);
  if (isNextResponse(profileOrErr)) return profileOrErr;

  const body = await req.json().catch(() => null);
  const readingLevelRaw =
    typeof body?.readingLevel === "string"
      ? body.readingLevel
      : typeof body?.readingLevel === "number"
        ? String(body.readingLevel)
        : undefined;
  if (readingLevelRaw != null && !isLearnerGradeBand(readingLevelRaw)) {
    return NextResponse.json(
      { error: "readingLevel must be a grade from 3 to 8" },
      { status: 400 }
    );
  }

  const displayName =
    typeof body?.displayName === "string" ? body.displayName : undefined;
  const firstRunEventRaw = body?.firstRunEvent;
  const firstRunEvent =
    typeof firstRunEventRaw === "string" &&
    FIRST_RUN_EVENTS.has(firstRunEventRaw as FirstRunEvent)
      ? (firstRunEventRaw as FirstRunEvent)
      : undefined;
  const firstRunStep =
    typeof body?.firstRunStep === "string" && isFirstRunStep(body.firstRunStep)
      ? body.firstRunStep
      : undefined;

  if (
    readingLevelRaw == null &&
    displayName === undefined &&
    firstRunEvent == null &&
    firstRunStep == null
  ) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  try {
    const profile = await updateProfile(user!.userId, {
      readingLevel: readingLevelRaw,
      displayName,
      firstRunEvent,
      firstRunStep,
    });
    return NextResponse.json({ profile });
  } catch (err) {
    console.error("updateProfile failed:", err);
    const message = err instanceof Error ? err.message : "Failed to update profile";
    const status = message === "Profile not found" ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
