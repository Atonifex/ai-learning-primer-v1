import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";

const mocks = vi.hoisted(() => ({ getCurrentUser: vi.fn(), requireChildProfile: vi.fn(), updateProfile: vi.fn() }));
vi.mock("../auth/session", () => ({ getCurrentUser: mocks.getCurrentUser }));
vi.mock("../auth/guards", () => ({
  requireChildProfile: mocks.requireChildProfile,
  isNextResponse: (value: unknown) => value instanceof NextResponse,
}));
vi.mock("../services/profile", () => ({ updateProfile: mocks.updateProfile }));
import { PATCH } from "../../app/api/profile/route";

const request = (body: unknown) => new NextRequest("http://localhost/api/profile", {
  method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
});

describe("captain name profile API", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.getCurrentUser.mockResolvedValue({ userId: "owner", role: "CHILD" });
    mocks.requireChildProfile.mockResolvedValue({ id: "owned-profile" });
    mocks.updateProfile.mockResolvedValue({ displayName: "Captain Nova" });
  });
  it("saves a normalized name for the signed-in child, ignoring a supplied owner", async () => {
    const response = await PATCH(request({ displayName: "  Captain Nova  ", userId: "someone-else" }));
    expect(response.status).toBe(200);
    expect(mocks.updateProfile).toHaveBeenCalledWith("owner", expect.objectContaining({ displayName: "Captain Nova" }));
  });
  it("rejects invalid names before writing", async () => {
    for (const displayName of ["   ", "a".repeat(41), 12, null]) {
      expect((await PATCH(request({ displayName }))).status).toBe(400);
    }
    expect(mocks.updateProfile).not.toHaveBeenCalled();
  });
  it("retains the existing child-profile access guard", async () => {
    mocks.requireChildProfile.mockResolvedValue(NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
    expect((await PATCH(request({ displayName: "Nova" }))).status).toBe(401);
    expect(mocks.updateProfile).not.toHaveBeenCalled();
  });
});
