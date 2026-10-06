import { expect, test } from "@playwright/test";

test.setTimeout(120_000);
test("parent setup recovers, saves the name once and opens the correct captain", async ({ page }) => {
  const login = await page.request.post("/api/auth/login", { data: { email: "test_parent@primer.local", password: "test-parent-login" } });
  expect(login.ok()).toBeTruthy();
  const list = await page.request.get("/api/household/captains");
  const { captains } = await list.json();
  const existing = captains.find((c: { username: string }) => c.username === "handoff_fixture");
  await page.goto("/household", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "What happens in the first session?" })).toBeVisible();
  if (!existing) {
    await page.getByLabel("Captain name", { exact: true }).fill("Maya Handoff");
    await page.getByLabel("Captain login", { exact: true }).fill("handoff_fixture");
    await page.getByLabel("4-digit PIN", { exact: true }).fill("1234");
    let fail = true;
    await page.route("**/api/household/captains", (route) => {
      if (route.request().method() === "POST" && fail) {
        fail = false;
        return route.fulfill({ status: 409, json: { error: "That captain login is already taken" } });
      }
      return route.continue();
    });
    await page.getByRole("button", { name: "Add captain", exact: true }).click();
    await expect(page.getByRole("alert").filter({ hasText: "already taken" })).toBeVisible();
    await expect(page.getByLabel("Captain name", { exact: true })).toHaveValue("Maya Handoff");
    await expect(page.getByLabel("4-digit PIN", { exact: true })).toHaveValue("1234");
    await page.getByRole("button", { name: "Add captain", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Maya Handoff is ready" })).toBeVisible();
    await page.unroute("**/api/household/captains");
  }
  await page.reload({ waitUntil: "domcontentloaded" });
  const saved = (await (await page.request.get("/api/household/captains")).json()).captains.find((c: { username: string }) => c.username === "handoff_fixture");
  expect(saved.displayName).toBe("Maya Handoff");
  const captain = page.getByRole("listitem").filter({ hasText: "Login handoff_fixture" });
  await captain.getByRole("button").click();
  await expect(page.getByRole("heading", { name: "Maya Handoff is ready" })).toBeVisible();
  await expect(page.getByText(/Opening switches this device/)).toBeVisible();
  // Avoid running live Rho or cinematic production while checking the authenticated handoff.
  await page.route("**/learn**", (route) => route.request().isNavigationRequest()
    ? route.fulfill({ contentType: "text/html", body: "<h1>Student session opened</h1>" }) : route.continue());
  await page.getByRole("button", { name: "Open Maya Handoff’s learning" }).click();
  await expect(page).toHaveURL(/\/learn/);
  const profile = await page.request.get("/api/profile");
  expect(profile.ok()).toBeTruthy();
  const data = await profile.json();
  expect(data.profile.displayName).toBe("Maya Handoff");
  expect((await page.request.get("/api/household/captains")).status()).toBe(403);
});

test("old names and fused names remain clear on a small screen", async ({ page }) => {
  await page.request.post("/api/auth/login", { data: { email: "test_parent@primer.local", password: "test-parent-login" } });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route("**/api/household/captains", (route) => route.fulfill({ json: {
    captains: [{ userId: "old", learnerId: "old-profile", username: "old_captain", displayName: null, gradeBand: "3", firstRunStep: "complete" }],
    fusedProfile: { id: "fused", displayName: "Chosen Captain" },
  } }));
  await page.goto("/household");
  await expect(page.getByLabel("Captain name", { exact: true })).toHaveValue("Chosen Captain");
  await expect(page.getByLabel("Captain name", { exact: true })).toHaveAttribute("readonly", "");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByRole("heading", { name: "old_captain is ready" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Open old_captain’s learning" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
});
