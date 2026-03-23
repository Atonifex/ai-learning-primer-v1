import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "../../../../../lib/auth/session";
import { getProfile } from "../../../../../lib/services/profile";
import { getSession, completeSession } from "../../../../../lib/services/session";
import { getRelevantMemory } from "../../../../../lib/services/memory";
import { upsertMemoryItems, upsertSkillProgress, upsertStoryState } from "../../../../../lib/services/memory";
import { extractSessionMemory } from "../../../../../lib/ai/memoryExtractor";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: sessionId } = await params;

  const profile = await getProfile(user.userId);
  if (!profile) return NextResponse.json({ error: "No profile" }, { status: 404 });

  const session = await getSession(sessionId);
  if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });

  if (session.messages.length < 2) {
    // Not enough content to extract — just mark abandoned
    await import("../../../../../lib/services/session").then((s) =>
      s.abandonSession(sessionId)
    );
    return NextResponse.json({ ok: true });
  }

  try {
    const existingMemory = await getRelevantMemory(profile.id);
    const result = await extractSessionMemory(
      session.messages,
      session.language,
      existingMemory
    );

    await Promise.all([
      upsertMemoryItems(profile.id, sessionId, result.memoryItems),
      upsertSkillProgress(profile.id, result.skillUpdates),
      upsertStoryState(profile.id, sessionId, result.storyUpdate),
      completeSession(sessionId, result.sessionSummary),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Memory extraction failed:", err);
    // Still mark session as completed even if extraction fails
    await completeSession(sessionId, "Session completed.");
    return NextResponse.json({ ok: true, warning: "Memory extraction failed" });
  }
}
