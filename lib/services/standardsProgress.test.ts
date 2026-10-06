import { beforeEach, expect, it, vi } from "vitest";
const db = vi.hoisted(() => ({
  session: { findUnique: vi.fn() }, subject: { findUnique: vi.fn() },
  standard: { findFirst: vi.fn() },
  standardsEvidence: { findUnique: vi.fn(), create: vi.fn() },
  standardsProgress: { findUnique: vi.fn(), upsert: vi.fn(), update: vi.fn() },
  skillStandardLink: { findMany: vi.fn() }, $transaction: vi.fn(),
}));
vi.mock("../db/prisma", () => ({ prisma: db }));
import { recordStandardObservation } from "./standardsProgress";
const input = { sessionId: "session", standardCode: "MA.3.NSO.1.1", evidenceTier: "GUIDED" as const, correctness: 1, idempotencyKey: "saved-answer" };
const prior = { learnerProfileId: "captain", standardId: "standard", standard: { code: input.standardCode } };
beforeEach(() => {
  vi.resetAllMocks();
  db.session.findUnique.mockResolvedValue({ learnerProfileId: "captain", subjectId: "math" });
  db.standard.findFirst.mockResolvedValue({ id: "standard", code: input.standardCode });
  db.standardsEvidence.findUnique.mockResolvedValue(null);
  db.standardsProgress.findUnique.mockResolvedValue({ mastery: 35 });
  db.standardsProgress.upsert.mockResolvedValue({ mastery: 20, confidence: 0.5, lastDemonstratedAt: null });
  db.skillStandardLink.findMany.mockResolvedValue([]);
  db.$transaction.mockImplementation(async (fn) => fn(db));
});
it("a retried answer does not add evidence or advance mastery again", async () => {
  db.standardsEvidence.findUnique.mockResolvedValue(prior);
  expect(await recordStandardObservation(input)).toEqual({ standardCode: input.standardCode, mastery: 35 });
  expect(db.standardsEvidence.create).not.toHaveBeenCalled();
  expect(db.standardsProgress.update).not.toHaveBeenCalled();
});
it("rejects a key belonging to a different learner", async () => {
  db.standardsEvidence.findUnique.mockResolvedValue({ ...prior, learnerProfileId: "other" });
  await expect(recordStandardObservation(input)).rejects.toThrow("does not match");
  expect(db.$transaction).not.toHaveBeenCalled();
});
it("a concurrent duplicate cannot increment the evidence counter", async () => {
  db.standardsEvidence.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce(prior);
  db.standardsEvidence.create.mockRejectedValue({ code: "P2002" });
  expect((await recordStandardObservation(input)).mastery).toBe(35);
  expect(db.standardsProgress.update).not.toHaveBeenCalled();
});
it("writes a fresh answer with its server-authored key and one evidence increment", async () => {
  await recordStandardObservation(input);
  expect(db.standardsEvidence.create.mock.calls[0][0].data.id).toBe("saved-answer");
  expect(db.standardsProgress.update.mock.calls[0][0].data.evidenceCount).toEqual({ increment: 1 });
});
