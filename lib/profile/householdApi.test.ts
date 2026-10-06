import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";
const mocks = vi.hoisted(() => ({ user: vi.fn(), parent: vi.fn(), add: vi.fn(), claim: vi.fn() }));
vi.mock("../auth/session", () => ({ getCurrentUser: mocks.user }));
vi.mock("../auth/guards", () => ({ requireParent: mocks.parent, isNextResponse: (v: unknown) => v instanceof NextResponse }));
vi.mock("../services/household", () => ({ addCaptain: mocks.add, claimFusedCaptain: mocks.claim, listHouseholdCaptains: vi.fn(), UsernameTakenError: class extends Error {} }));
vi.mock("../db/prisma", () => ({ prisma: {} }));
import { POST } from "../../app/api/household/captains/route";
const request = (body: unknown) => new NextRequest("http://localhost/api/household/captains", { method: "POST", body: JSON.stringify(body), headers: { "Content-Type": "application/json" } });
describe("parent identity API", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.parent.mockReturnValue({ userId: "signed-in-parent" });
    mocks.add.mockResolvedValue({ child: { id: "child", username: "maya" }, profile: { id: "profile", displayName: "Maya Nova" } });
    mocks.claim.mockResolvedValue({ childUserId: "child" });
  });
  it("uses the authenticated parent and normalized name", async () => {
    expect((await POST(request({ parentUserId: "another-parent", username: "maya", pin: "1234", displayName: " Maya Nova " }))).status).toBe(200);
    expect(mocks.add).toHaveBeenCalledWith(expect.objectContaining({ parentUserId: "signed-in-parent", displayName: "Maya Nova" }));
  });
  it("rejects malformed names before creating or claiming a profile", async () => {
    for (const displayName of [12, {}, "", "a".repeat(41)]) expect((await POST(request({ displayName, claimFused: true }))).status).toBe(400);
    expect(mocks.add).not.toHaveBeenCalled();
    expect(mocks.claim).not.toHaveBeenCalled();
  });
  it("retains the parent-only guard", async () => {
    mocks.parent.mockReturnValue(NextResponse.json({ error: "Parent only" }, { status: 403 }));
    expect((await POST(request({ displayName: "Maya" }))).status).toBe(403);
    expect(mocks.add).not.toHaveBeenCalled();
  });
});
