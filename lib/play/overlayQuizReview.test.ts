import { beforeEach, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  learningActivity: { findUnique: vi.fn() },
  session: { findUnique: vi.fn() },
  learningActivityCompletion: { findFirst: vi.fn(), findUnique: vi.fn(), create: vi.fn() },
  record: vi.fn(), grant: vi.fn(), stamp: vi.fn(),
}));
vi.mock("../db/prisma", () => ({ prisma: mocks }));
vi.mock("../services/standardsProgress", () => ({ recordStandardObservation: mocks.record }));
vi.mock("../services/camp", () => ({ applyCampGrantToLearner: mocks.grant }));
vi.mock("../services/timeTracking", () => ({ stampActivityClock: mocks.stamp }));
import { startBankOverlayQuiz, submitBankOverlayQuiz } from "./overlayQuiz";

const done = { id: "done", learnerProfileId: "captain", learningActivityId: "wreck", completedAt: new Date(), score: 50 };
beforeEach(() => {
  vi.resetAllMocks();
  mocks.learningActivity.findUnique.mockResolvedValue({ id: "wreck", slug: "wreck-quiz", displayName: "Crates", description: "Count the crates", subject: { slug: "math_g3" }, standardLinks: [{ standard: { code: "MA.3.NSO.1.1" } }], content: { quizItems: [{ itemType: "multiple_choice", prompt: "How many?", choices: ["2", "3"], correctIndex: 1 }] } });
  mocks.session.findUnique.mockResolvedValue({ subject: { slug: "math_g3" } });
  mocks.learningActivityCompletion.findFirst.mockResolvedValue(done);
  mocks.learningActivityCompletion.findUnique.mockResolvedValue(done);
});

it("reopens completed questions with the saved result, without a new attempt or exposed answer key", async () => {
  const quiz = await startBankOverlayQuiz({ learnerProfileId: "captain", sessionId: "session", slug: "wreck-quiz" });
  expect(quiz).toMatchObject({ alreadyCompleted: true, priorScore: 50, completionId: "done" });
  expect(quiz.items[0]).not.toHaveProperty("correctIndex");
  expect(mocks.learningActivityCompletion.create).not.toHaveBeenCalled();
  expect(mocks.record).not.toHaveBeenCalled();
  expect(mocks.grant).not.toHaveBeenCalled();
});

it("refuses a review submission before changing evidence, time or camp resources", async () => {
  await expect(submitBankOverlayQuiz({ learnerProfileId: "captain", sessionId: "session", completionId: "done", slug: "wreck-quiz", answers: [{ itemId: "q1", selectedIndex: 1 }] })).rejects.toThrow("already submitted");
  expect(mocks.stamp).not.toHaveBeenCalled();
  expect(mocks.record).not.toHaveBeenCalled();
  expect(mocks.grant).not.toHaveBeenCalled();
});
