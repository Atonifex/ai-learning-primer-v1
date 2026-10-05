import { beforeEach, describe, expect, it, vi } from "vitest";

const db = vi.hoisted(() => ({
  storyWorld: { findUniqueOrThrow: vi.fn() }, session: { findMany: vi.fn(), findFirst: vi.fn() },
  worldLedgerEntry: { findMany: vi.fn(), upsert: vi.fn() }, learningActivity: { findMany: vi.fn(), findUnique: vi.fn() },
}));
vi.mock("../db/prisma", () => ({ prisma: db }));
vi.mock("./missions", () => ({ getMissionBoard: vi.fn(async () => ({ missions: [] })) }));
import { getWorldSnapshot, getWorldActivity, saveMapNote } from "./worldMap";

beforeEach(() => {
  vi.clearAllMocks();
  db.storyWorld.findUniqueOrThrow.mockResolvedValue({ id: "world", storyArcs: [{ chapters: [] }] });
  db.session.findMany.mockResolvedValue([{ id: "own-session" }]);
  db.worldLedgerEntry.findMany.mockResolvedValue([]); db.learningActivity.findMany.mockResolvedValue([]);
});
describe("map storage boundaries", () => {
  it("scopes generated content to this learner's sessions and excludes answer keys from the snapshot", async () => {
    db.learningActivity.findMany.mockResolvedValue([{ id: "a", displayName: "Our work", generatedFromSessionId: "own-session", content: { mapLocationId: "wreck", items: [{ correctOptionIndex: 1 }] }, completions: [] }]);
    const world = await getWorldSnapshot("captain");
    expect(db.session.findMany).toHaveBeenCalledWith({ where: { learnerProfileId: "captain" }, select: { id: true } });
    expect(db.learningActivity.findMany.mock.calls[0][0].where.generatedFromSessionId).toEqual({ in: ["own-session"] });
    expect(JSON.stringify(world)).not.toContain("correctOptionIndex");
  });
  it("refuses questions belonging to another captain", async () => {
    db.learningActivity.findUnique.mockResolvedValue({ id: "a", authoring: "AI_GENERATED", generatedFromSessionId: "foreign" });
    db.session.findFirst.mockResolvedValue(null);
    expect(await getWorldActivity("captain", "a")).toBeNull();
    expect(db.session.findFirst.mock.calls[0][0].where).toEqual({ id: "foreign", learnerProfileId: "captain" });
  });
  it("returns only public question fields for owned activities", async () => {
    db.session.findFirst.mockResolvedValue({ id: "own-session" });
    db.learningActivity.findUnique.mockResolvedValue({ id: "a", displayName: "Our work", authoring: "AI_GENERATED", generatedFromSessionId: "own-session", content: { standardCode: "MA.3.NSO.1.2", instructions: "Choose.", items: [{ id: "q1", question: "Which?", options: ["a", "b"], correctOptionIndex: 1, explanation: "secret" }] } });
    const payload = await getWorldActivity("captain", "a");
    expect(payload?.activity.items).toEqual([{ id: "q1", question: "Which?", options: ["a", "b"] }]);
    expect(JSON.stringify(payload)).not.toContain("secret");
  });
  it("makes repeated note saves idempotent and refuses unknown/locked locations", async () => {
    await saveMapNote("captain", { nodeId: "wreck", note: "Count the crates." });
    await saveMapNote("captain", { nodeId: "wreck", note: "Count the crates again." });
    expect(db.worldLedgerEntry.upsert.mock.calls[0][0].where).toEqual(db.worldLedgerEntry.upsert.mock.calls[1][0].where);
    expect(db.worldLedgerEntry.upsert.mock.calls[0][0].create.learnerProfileId).toBe("captain");
    await expect(saveMapNote("captain", { nodeId: "camp", note: "Open it." })).rejects.toThrow("available");
    await expect(saveMapNote("captain", { nodeId: "made-up", note: "Open it." })).rejects.toThrow("available");
    expect(db.worldLedgerEntry.upsert).toHaveBeenCalledTimes(2);
  });
});
