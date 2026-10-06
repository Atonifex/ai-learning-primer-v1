import { prisma } from "../db/prisma";
import { listHouseholdCaptains } from "./household";
import { getProfile } from "./profile";
import { getRecentObservations, getSubjectStandardsProgress } from "./progress";
import { secondsBetween } from "./timeMath";

export type UsagePeriod = "7" | "30" | "all";
export function parseUsagePeriod(value: unknown): UsagePeriod {
  return value === "7" || value === "all" ? value : "30";
}
export function usageStart(period: UsagePeriod, now = new Date()): Date | null {
  return period === "all" ? null : new Date(now.getTime() - Number(period) * 86400000);
}

/** Open sessions have no trustworthy elapsed duration; do not turn idle time into usage. */
export function recordedSeconds(row: { startedAt: Date; completedAt: Date | null; durationSeconds: number | null }): number {
  if (!row.completedAt) return 0;
  return Math.max(0, row.durationSeconds ?? secondsBetween(row.startedAt, row.completedAt));
}

type ClockRow = { startedAt: Date; completedAt: Date | null; durationSeconds: number | null };
export function dailyUsage(sessions: ClockRow[], activities: ClockRow[]) {
  const days = new Map<string, { date: string; sessions: number; sessionSeconds: number; activities: number; activitySeconds: number }>();
  const day = (date: Date) => {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
    const part = (type: string) => parts.find((p) => p.type === type)?.value;
    const key = `${part("year")}-${part("month")}-${part("day")}`;
    if (!days.has(key)) days.set(key, { date: key, sessions: 0, sessionSeconds: 0, activities: 0, activitySeconds: 0 });
    return days.get(key)!;
  };
  for (const session of sessions) {
    const row = day(session.startedAt);
    row.sessions++;
    row.sessionSeconds += recordedSeconds(session);
  }
  for (const activity of activities) {
    if (!activity.completedAt) continue;
    const row = day(activity.completedAt);
    row.activities++;
    row.activitySeconds += recordedSeconds(activity);
  }
  return [...days.values()].sort((a, b) => b.date.localeCompare(a.date));
}

export async function getParentDashboard(parentUserId: string, childUserId?: string, period: UsagePeriod = "30") {
  const captains = await listHouseholdCaptains(parentUserId);
  const selected = childUserId ? captains.find((c) => c.userId === childUserId) : captains[0];
  // Resolve ownership before any learner evidence, profile or time query.
  if (!selected) return { captains, report: null, invalidSelection: Boolean(childUserId) };
  const profile = await getProfile(selected.userId);
  if (!profile || profile.id !== selected.learnerId) return { captains, report: null, invalidSelection: true };
  const since = usageStart(period);
  const [sessions, activities, observations, subjects] = await Promise.all([
    prisma.session.findMany({
      where: { learnerProfileId: profile.id, ...(since ? { startedAt: { gte: since } } : {}) },
      select: { startedAt: true, completedAt: true, durationSeconds: true },
      orderBy: { startedAt: "desc" },
    }),
    prisma.learningActivityCompletion.findMany({
      where: { learnerProfileId: profile.id, completedAt: since ? { gte: since } : { not: null } },
      select: { startedAt: true, completedAt: true, durationSeconds: true },
    }),
    getRecentObservations(profile.id, 8),
    Promise.all(profile.enrolledSubjects.map((s) => getSubjectStandardsProgress(profile.id, s.slug))),
  ]);
  const standards = subjects.filter((s) => s !== null).map((s) => ({
    subject: s.subject,
    standards: s.strands.flatMap((strand) => strand.groups.flatMap((group) => group.standards)),
  }));
  return {
    captains,
    invalidSelection: false,
    report: {
      captain: selected,
      period,
      usage: {
        sessionCount: sessions.length,
        closedSessionCount: sessions.filter((s) => s.completedAt).length,
        openSessionCount: sessions.filter((s) => !s.completedAt).length,
        sessionSeconds: sessions.reduce((sum, s) => sum + recordedSeconds(s), 0),
        activityCount: activities.length,
        activitySeconds: activities.reduce((sum, a) => sum + recordedSeconds(a), 0),
        latestSessionStart: sessions[0]?.startedAt ?? null,
        days: dailyUsage(sessions, activities),
      },
      subjects: standards,
      observations,
    },
  };
}
