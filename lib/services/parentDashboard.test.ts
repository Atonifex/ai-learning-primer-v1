import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ captains: vi.fn(), profile: vi.fn(), sessions: vi.fn(), activities: vi.fn(), observations: vi.fn(), subjects: vi.fn() }));
vi.mock("./household", () => ({ listHouseholdCaptains: mocks.captains }));
vi.mock("./profile", () => ({ getProfile: mocks.profile }));
vi.mock("./progress", () => ({ getRecentObservations: mocks.observations, getSubjectStandardsProgress: mocks.subjects }));
vi.mock("../db/prisma", () => ({ prisma: { session: { findMany: mocks.sessions }, learningActivityCompletion: { findMany: mocks.activities } } }));
import { getParentDashboard, recordedSeconds, parseUsagePeriod, usageStart, dailyUsage } from "./parentDashboard";

describe("parent dashboard ownership and reporting", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.captains.mockResolvedValue([{ userId: "owned-child", learnerId: "owned-profile" }]);
    mocks.profile.mockResolvedValue({ id: "owned-profile", enrolledSubjects: [{ slug: "science_g3" }] });
    mocks.sessions.mockResolvedValue([]);
    mocks.activities.mockResolvedValue([]);
    mocks.observations.mockResolvedValue([]);
    mocks.subjects.mockResolvedValue({ subject: { slug: "science_g3" }, strands: [{ groups: [{ standards: [{ code: "existing-catalog-code", evidenceCount: 0 }] }] }] });
  });
  it("rejects another household's student before querying profile, usage or evidence", async () => {
    const result = await getParentDashboard("parent", "foreign-child");
    expect(result.invalidSelection).toBe(true);
    expect(result.report).toBeNull();
    expect(mocks.profile).not.toHaveBeenCalled();
    expect(mocks.sessions).not.toHaveBeenCalled();
    expect(mocks.observations).not.toHaveBeenCalled();
  });
  it("never trusts a mismatched profile returned for a selected child", async () => {
    mocks.profile.mockResolvedValue({ id: "foreign-profile" });
    expect((await getParentDashboard("parent")).report).toBeNull();
    expect(mocks.sessions).not.toHaveBeenCalled();
  });
  it("returns an empty household without querying any learner", async () => {
    mocks.captains.mockResolvedValue([]);
    expect((await getParentDashboard("parent")).invalidSelection).toBe(false);
    expect(mocks.profile).not.toHaveBeenCalled();
  });
  it("scopes all data, keeps unobserved standards and separates overlapping clocks", async () => {
    const startedAt = new Date("2026-10-06T10:00:00Z");
    const completedAt = new Date("2026-10-06T10:10:00Z");
    mocks.sessions.mockResolvedValue([{ startedAt, completedAt, durationSeconds: 600 }, { startedAt, completedAt: null, durationSeconds: 9999 }]);
    mocks.activities.mockResolvedValue([{ startedAt, completedAt, durationSeconds: 180 }]);
    const { report } = await getParentDashboard("parent", "owned-child", "7");
    expect(report?.usage).toMatchObject({ sessionCount: 2, closedSessionCount: 1, openSessionCount: 1, sessionSeconds: 600, activitySeconds: 180, activityCount: 1 });
    expect(report?.subjects[0].standards[0].evidenceCount).toBe(0);
    expect(mocks.sessions).toHaveBeenCalledWith(expect.objectContaining({ where: { learnerProfileId: "owned-profile", startedAt: { gte: expect.any(Date) } } }));
    expect(mocks.activities).toHaveBeenCalledWith(expect.objectContaining({ where: { learnerProfileId: "owned-profile", completedAt: { gte: expect.any(Date) } } }));
    expect(mocks.subjects).toHaveBeenCalledWith("owned-profile", "science_g3");
    expect(mocks.observations).toHaveBeenCalledWith("owned-profile", 8);
  });
  it("uses all-time usage without imposing a date cutoff", async () => {
    await getParentDashboard("parent", undefined, "all");
    expect(mocks.sessions).toHaveBeenCalledWith(expect.objectContaining({ where: { learnerProfileId: "owned-profile" } }));
  });
  it("groups clocks into Eastern dates without adding overlapping measurements", () => {
    const startedAt = new Date("2026-10-06T02:00:00Z"); // Oct 5 Eastern
    const completedAt = new Date("2026-10-06T04:10:00Z"); // Oct 6 Eastern
    expect(dailyUsage([{ startedAt, completedAt, durationSeconds: 600 }], [{ startedAt, completedAt, durationSeconds: 180 }])).toEqual([
      { date: "2026-10-06", sessions: 0, sessionSeconds: 0, activities: 1, activitySeconds: 180 },
      { date: "2026-10-05", sessions: 1, sessionSeconds: 600, activities: 0, activitySeconds: 0 },
    ]);
  });
  it("validates periods and excludes unfinished or negative clocks", () => {
    expect(parseUsagePeriod("invented")).toBe("30");
    expect(parseUsagePeriod("7")).toBe("7");
    expect(usageStart("all")).toBeNull();
    expect(usageStart("7", new Date("2026-10-06T00:00:00Z"))?.toISOString()).toBe("2026-09-29T00:00:00.000Z");
    const startedAt = new Date("2026-10-06T00:00:00Z");
    expect(recordedSeconds({ startedAt, completedAt: null, durationSeconds: 500 })).toBe(0);
    expect(recordedSeconds({ startedAt, completedAt: startedAt, durationSeconds: -10 })).toBe(0);
  });
});
