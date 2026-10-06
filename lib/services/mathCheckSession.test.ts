import { beforeEach, expect, it, vi } from "vitest";
const db = vi.hoisted(() => ({
  memoryItem: { findUnique: vi.fn(), upsert: vi.fn() },
  learnerProfile: { findUnique: vi.fn(), update: vi.fn() },
  standardsEvidence: { findFirst: vi.fn() }, $transaction: vi.fn(), record: vi.fn(), grant: vi.fn(),
}));
vi.mock("../db/prisma", () => ({ prisma: db }));
vi.mock("./standardsProgress", () => ({ recordStandardObservation: db.record }));
vi.mock("./camp", () => ({ applyCampGrantToLearner: db.grant }));
import { loadMathCheck, submitMathFiveCheck } from "./mathCheckSession";
const first = [{ itemId: "forms-a", choiceIndex: 0 }];
const snapshot = (answers = first) => ({ content: JSON.stringify({ answers }), sourceSessionId: "session" });
beforeEach(() => {
  vi.resetAllMocks();
  db.$transaction.mockImplementation(async (fn) => fn(db));
  db.memoryItem.findUnique.mockResolvedValue(null);
  db.learnerProfile.findUnique.mockResolvedValue(null);
  db.standardsEvidence.findFirst.mockResolvedValue(null);
});
it("restores the next math question after a break without claiming finished placement", async () => {
  const answer = await submitMathFiveCheck({ profileId: "captain", sessionId: "session", answers: first });
  expect(answer.body?.saved).toBe(true);
  db.memoryItem.findUnique.mockResolvedValue(snapshot());
  const restored = await loadMathCheck("captain", "session");
  expect(restored?.item?.id).toBe("groups");
  expect(restored?.answers).toEqual(first);
  expect(db.learnerProfile.update).not.toHaveBeenCalled();
  expect(db.record).not.toHaveBeenCalled();
});
it("rejects rewriting a previously saved answer", async () => {
  db.memoryItem.findUnique.mockResolvedValue(snapshot());
  await expect(submitMathFiveCheck({ profileId: "captain", sessionId: "session", answers: [{ itemId: "forms-a", choiceIndex: 1 }] })).rejects.toThrow("another window");
  expect(db.memoryItem.upsert).not.toHaveBeenCalled();
});
it("reconciles a finished two-question support path on reload with stable evidence keys", async () => {
  db.memoryItem.findUnique.mockResolvedValue(snapshot([{ itemId: "forms-a", choiceIndex: 1 }, { itemId: "forms-b", choiceIndex: 0 }]));
  const restored = await loadMathCheck("captain", "session");
  expect(restored?.placement.status).toBe("below_catalog");
  expect(restored?.questionNumber).toBe(2);
  expect(db.record).toHaveBeenCalledTimes(2);
  expect(db.record.mock.calls[0][0].idempotencyKey).toBe("captain:math-five:v1:forms-a");
  expect(db.learnerProfile.update.mock.calls[0][0].data.mathPlacementCode).toBeNull();
});
