import { NextRequest, NextResponse } from "next/server";
import {
  childProfileResponse,
  forbidIfForeignSession,
  isNextResponse,
} from "../../../../../lib/auth/apiChild";
import {
  decideSubjectSwitch,
  flattenFocusStandards,
  focusProgressSummary,
  isChoiceForGrade,
  subjectChoicesForGrade,
} from "../../../../../lib/play/subjectFocus";
import { getSubjectStandardsProgress } from "../../../../../lib/services/progress";
import { getSession, setSessionSubject } from "../../../../../lib/services/session";

async function loadOwnedSession(id: string) {
  const profile = await childProfileResponse();
  if (isNextResponse(profile)) return { error: profile };
  const session = await getSession(id);
  if (!session) {
    return {
      error: NextResponse.json({ error: "Session not found" }, { status: 404 }),
    };
  }
  const foreign = forbidIfForeignSession(session, profile.id);
  if (foreign) return { error: foreign };
  return { profile, session };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const owned = await loadOwnedSession(id);
  if ("error" in owned && owned.error) return owned.error;
  if (!("profile" in owned)) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }
  return NextResponse.json({
    choices: subjectChoicesForGrade(owned.profile.gradeBand),
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const owned = await loadOwnedSession(id);
  if ("error" in owned && owned.error) return owned.error;
  if (!("profile" in owned)) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const requested = typeof body?.subjectSlug === "string" ? body.subjectSlug : "";
  if (!isChoiceForGrade(requested, owned.profile.gradeBand)) {
    return NextResponse.json(
      { error: "That subject is not in this captain's catalog." },
      { status: 400 }
    );
  }

  const sittingSubject =
    typeof body?.sittingSubject === "string" && body.sittingSubject.trim()
      ? body.sittingSubject
      : null;
  const decision = decideSubjectSwitch({
    sittingSubject,
    requested,
    confirmed: body?.confirmed === true,
  });
  if (decision.action === "confirm") {
    return NextResponse.json({
      needsConfirm: true,
      prompt: decision.prompt,
      from: decision.from,
      to: decision.to,
    });
  }

  await setSessionSubject(id, decision.slug);
  const progress = await getSubjectStandardsProgress(owned.profile.id, decision.slug);
  const standards = flattenFocusStandards(
    (progress?.strands ?? []).map((strand) => ({
      name: strand.name,
      groups: strand.groups,
    }))
  );
  return NextResponse.json({
    needsConfirm: false,
    subjectSlug: decision.slug,
    summary: focusProgressSummary(standards),
    standards,
  });
}
