import { beforeEach, expect, it, vi } from "vitest";
import { subjectCheckItems } from "../play/subjectFiveCheck";

const mocks = vi.hoisted(() => ({
  memoryItem: { findUnique: vi.fn(), upsert: vi.fn() },
  $transaction: vi.fn(), record: vi.fn(),
}));
vi.mock("../db/prisma", () => ({ prisma: mocks }));
vi.mock("./standardsProgress", () => ({ recordStandardObservation: mocks.record }));
import { loadSubjectCheck, saveSubjectCheck, subjectCheckGuidance } from "./subjectCheckSession";

const first = subjectCheckItems("science")[0];
const answers = [{ itemId: first.id, choiceIndex: first.correctIndex }];
const row = { content: JSON.stringify({ answers }), sourceSessionId: "session", createdAt: new Date("2026-10-05T12:00:00Z") };
beforeEach(() => {
  vi.resetAllMocks();
  mocks.$transaction.mockImplementation(async (fn) => fn(mocks));
  mocks.memoryItem.findUnique.mockResolvedValue(null);
  mocks.memoryItem.upsert.mockResolvedValue(row);
  mocks.record.mockResolvedValue({});
});

it("saves one answer and resumes it with the same retry-safe evidence key", async () => {
  const saved = await saveSubjectCheck({ profileId: "captain", sessionId: "session", domain: "science", answers });
  expect(saved.asked).toBe(1);
  expect(saved.saved).toBe(true);
  const firstWrite = mocks.record.mock.calls[0][0];
  expect(firstWrite).toMatchObject({ evidenceTier: "GUIDED", catalogSubjectSlug: "science_g3", correctness: 1 });
  mocks.memoryItem.findUnique.mockResolvedValue(row);
  const loaded = await loadSubjectCheck("captain", "science");
  expect(loaded.answers).toEqual(answers);
  expect(loaded.item?.id).not.toBe(first.id);
  expect(mocks.record.mock.calls[1][0].idempotencyKey).toBe(firstWrite.idempotencyKey);
});

it("does not overwrite an answer changed in another window", async () => {
  mocks.memoryItem.findUnique.mockResolvedValue(row);
  await expect(saveSubjectCheck({ profileId: "captain", sessionId: "session", domain: "science", answers: [{ itemId: first.id, choiceIndex: (first.correctIndex + 1) % 3 }] })).rejects.toThrow("another window");
  expect(mocks.memoryItem.upsert).not.toHaveBeenCalled();
  expect(mocks.record).not.toHaveBeenCalled();
});

it("recovers evidence after an interrupted save without losing the answer", async () => {
  mocks.record.mockRejectedValueOnce(new Error("connection lost"));
  await expect(saveSubjectCheck({ profileId: "captain", sessionId: "session", domain: "science", answers })).rejects.toThrow("connection lost");
  mocks.memoryItem.findUnique.mockResolvedValue(row);
  expect((await loadSubjectCheck("captain", "science")).asked).toBe(1);
  expect(mocks.record.mock.calls[1][0].idempotencyKey).toBe(mocks.record.mock.calls[0][0].idempotencyKey);
});

it("hands saved support needs to Rho without claiming mastery", async () => {
  mocks.memoryItem.findUnique.mockResolvedValue(row);
  const guidance = await subjectCheckGuidance("captain", "science_g3");
  expect(guidance).toContain("not independent mastery");
  expect(guidance).toContain("1 fresh questions answered");
  expect(guidance).toContain("resume the saved check");
  expect(mocks.record).not.toHaveBeenCalled();
});
