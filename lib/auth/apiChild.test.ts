import { beforeEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ user: vi.fn(), profile: vi.fn(), session: { findUnique: vi.fn() } }));
vi.mock("./session", () => ({ getCurrentUser: mocks.user }));
vi.mock("../services/profile", () => ({ getProfile: mocks.profile }));
vi.mock("../db/prisma", () => ({ prisma: { session: mocks.session } }));
import { childSessionResponse } from "./apiChild";

beforeEach(() => {
  vi.resetAllMocks();
  mocks.user.mockResolvedValue({ role: "CHILD", userId: "user", learnerId: "captain" });
  mocks.profile.mockResolvedValue({ id: "captain" });
  mocks.session.findUnique.mockResolvedValue({ learnerProfileId: "captain", subject: { slug: "math_g3" } });
});

it("requires sign-in before reading any session", async () => {
  mocks.user.mockResolvedValue(null);
  const result = await childSessionResponse("session");
  expect(result.error?.status).toBe(401);
  expect(mocks.session.findUnique).not.toHaveBeenCalled();
});
it("refuses parent credentials on child learning endpoints", async () => {
  mocks.user.mockResolvedValue({ role: "PARENT", userId: "parent" });
  expect((await childSessionResponse("session")).error?.status).toBe(403);
  expect(mocks.session.findUnique).not.toHaveBeenCalled();
});
it("refuses a session owned by another captain", async () => {
  mocks.session.findUnique.mockResolvedValue({ learnerProfileId: "another", subject: { slug: "math_g3" } });
  expect((await childSessionResponse("session")).error?.status).toBe(403);
});
it("returns only the owned session header without loading conversation or chapter data", async () => {
  expect(await childSessionResponse("session")).toMatchObject({ profile: { id: "captain" }, session: { learnerProfileId: "captain", subjectSlug: "math_g3" } });
  expect(mocks.session.findUnique).toHaveBeenCalledWith({ where: { id: "session" }, select: { learnerProfileId: true, subject: { select: { slug: true } } } });
});
