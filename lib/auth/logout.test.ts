import { describe, expect, it } from "vitest";
import { POST } from "../../app/api/auth/logout/route";
import { COOKIE_NAME } from "./session";
describe("account switch logout", () => {
  it("expires the device cookie without deleting the learner or its work", async () => {
    const response = await POST();
    expect(response.status).toBe(200);
    expect(response.cookies.get(COOKIE_NAME)?.value).toBe("");
    expect(response.headers.get("set-cookie")).toContain("Max-Age=0");
    expect(await response.json()).toEqual({ ok: true });
  });
});
