import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ household: vi.fn(), findUser: vi.fn(), updateUser: vi.fn(), createUser: vi.fn(), fused: vi.fn(), updateProfile: vi.fn(), createProfile: vi.fn() }));
vi.mock("../db/prisma", () => ({ prisma: {
  household: { findUnique: mocks.household },
  user: { findUnique: mocks.findUser, update: mocks.updateUser, create: mocks.createUser },
  learnerProfile: { findUnique: mocks.fused, update: mocks.updateProfile },
} }));
vi.mock("./profile", () => ({ createProfile: mocks.createProfile }));
vi.mock("bcryptjs", () => ({ default: { hash: vi.fn().mockResolvedValue("hashed-pin") } }));
import { addCaptain, claimFusedCaptain } from "./household";
describe("parent captain identity", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.household.mockResolvedValue({ id: "household" });
    mocks.createUser.mockResolvedValue({ id: "child", username: "maya" });
    mocks.createProfile.mockResolvedValue({ id: "profile" });
  });
  const input = { parentUserId: "parent", username: " MAYA ", pin: "1234", gradeBand: "3" };
  it("saves a trimmed name separately from normalized login", async () => {
    await addCaptain({ ...input, displayName: "  Maya Nova  " });
    expect(mocks.createProfile).toHaveBeenCalledWith("child", expect.objectContaining({ displayName: "Maya Nova" }));
    expect(mocks.createUser).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ username: "maya" }) }));
  });
  it("gives older callers a login-based name", async () => {
    await addCaptain(input);
    expect(mocks.createProfile).toHaveBeenCalledWith("child", expect.objectContaining({ displayName: "maya" }));
  });
  it("rejects invalid names before creating a child", async () => {
    for (const displayName of ["  ", "a".repeat(41), "bad\nname"]) await expect(addCaptain({ ...input, displayName })).rejects.toThrow("Captain name");
    expect(mocks.createUser).not.toHaveBeenCalled();
  });
  it("keeps chosen names and learning state when separating a fused account", async () => {
    mocks.fused.mockResolvedValue({ id: "fused", displayName: "Chosen Name" });
    await claimFusedCaptain({ ...input, displayName: "Replacement" });
    expect(mocks.updateProfile).toHaveBeenCalledWith({ where: { id: "fused" }, data: { userId: "child", householdId: "household", displayName: "Chosen Name" } });
  });
  it("names an old nameless fused account", async () => {
    mocks.fused.mockResolvedValue({ id: "fused", displayName: null });
    await claimFusedCaptain({ ...input, displayName: " Maya Nova " });
    expect(mocks.updateProfile).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ displayName: "Maya Nova" }) }));
  });
});
