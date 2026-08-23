/**
 * Time is always recorded for analytics. There is no daily cap in the first loop.
 * Child HUD stays timer-free unless the learner toggles display.
 */
import { prisma } from "../db/prisma";
import { secondsBetween } from "./timeMath";

export { formatHiddenMinutes, secondsBetween } from "./timeMath";

export async function stampSessionClock(
  sessionId: string,
  status: "COMPLETED" | "ABANDONED",
  summary?: string
): Promise<void> {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { startedAt: true, completedAt: true, durationSeconds: true, status: true },
  });
  if (!session) return;

  const end = session.completedAt ?? new Date();
  const durationSeconds =
    session.durationSeconds ?? secondsBetween(session.startedAt, end);

  await prisma.session.update({
    where: { id: sessionId },
    data: {
      status,
      completedAt: end,
      durationSeconds,
      ...(summary !== undefined ? { arcSummary: summary } : {}),
    },
  });
}

export async function stampActivityClock(params: {
  completionId: string;
  extra?: {
    score?: number;
    perStandardCorrectness?: Record<string, number>;
    evidenceWritten?: boolean;
    responseText?: string;
    sessionId?: string;
  };
}): Promise<{ durationSeconds: number }> {
  const completion = await prisma.learningActivityCompletion.findUnique({
    where: { id: params.completionId },
    select: { startedAt: true, completedAt: true, durationSeconds: true },
  });
  if (!completion) throw new Error("Activity attempt not found");

  const end = completion.completedAt ?? new Date();
  const durationSeconds =
    completion.durationSeconds ?? secondsBetween(completion.startedAt, end);

  await prisma.learningActivityCompletion.update({
    where: { id: params.completionId },
    data: {
      completedAt: end,
      durationSeconds,
      ...(params.extra?.score !== undefined ? { score: params.extra.score } : {}),
      ...(params.extra?.perStandardCorrectness
        ? { perStandardCorrectness: params.extra.perStandardCorrectness }
        : {}),
      ...(params.extra?.evidenceWritten !== undefined
        ? { evidenceWritten: params.extra.evidenceWritten }
        : {}),
      ...(params.extra?.responseText !== undefined
        ? { responseText: params.extra.responseText }
        : {}),
      ...(params.extra?.sessionId ? { sessionId: params.extra.sessionId } : {}),
    },
  });

  return { durationSeconds };
}

export async function getLearnerTimeSummary(profileId: string): Promise<{
  lifetimeSeconds: number;
  lastSessionSeconds: number | null;
  activitySeconds: number;
  sessionCount: number;
}> {
  const [sessions, activities] = await Promise.all([
    prisma.session.findMany({
      where: { learnerProfileId: profileId },
      select: { startedAt: true, completedAt: true, durationSeconds: true },
      orderBy: { startedAt: "desc" },
    }),
    prisma.learningActivityCompletion.findMany({
      where: { learnerProfileId: profileId, completedAt: { not: null } },
      select: { startedAt: true, completedAt: true, durationSeconds: true },
    }),
  ]);

  const sessionSeconds = sessions.map((s) =>
    s.durationSeconds ??
    (s.completedAt ? secondsBetween(s.startedAt, s.completedAt) : 0)
  );
  const lifetimeSeconds = sessionSeconds.reduce((sum, n) => sum + n, 0);
  const lastSessionSeconds = sessionSeconds[0] ?? null;
  const activitySeconds = activities.reduce((sum, a) => {
    const dur =
      a.durationSeconds ??
      (a.completedAt ? secondsBetween(a.startedAt, a.completedAt) : 0);
    return sum + dur;
  }, 0);

  return {
    lifetimeSeconds,
    lastSessionSeconds,
    activitySeconds,
    sessionCount: sessions.length,
  };
}
