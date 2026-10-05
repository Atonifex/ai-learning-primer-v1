import { expect, test, type Page } from "@playwright/test";

async function openIntro(page: Page) {
  const boot = await page.request.post("/api/dev/agent-bootstrap", { data: { open: "intro" } });
  expect(boot.ok(), await boot.text()).toBeTruthy();
  const body = await boot.json();
  await page.goto(body.learnUrl);
  await expect(page.locator('[data-intro-phase="briefing"] video')).toBeVisible();
}
async function finishClip(page: Page) {
  const clip = page.locator("video");
  await expect.poll(() => clip.evaluate((node: HTMLVideoElement) => node.readyState)).toBeGreaterThanOrEqual(1);
  // Exercise the actual player's completion callback without waiting through every spoken clip.
  await clip.evaluate((node) => node.dispatchEvent(new Event("ended")));
}
for (const share of [10, 15, 20]) test(`intro saves ${share}% and resumes without another deal`, async ({ page }) => {
  await openIntro(page);
  await expect(page.getByRole("button", { name: "Yes", exact: true })).toHaveCount(0);
  await expect(page.locator('track[kind="captions"]')).toHaveAttribute("src", /briefing\.en\.vtt$/);
  await finishClip(page);
  await expect(page.getByText("Your share: 10% of the profit", { exact: true })).toBeVisible();
  await expect(page.locator("video")).toHaveJSProperty("loop", true);
  await expect(page.locator("video")).toHaveJSProperty("muted", true);
  if (share >= 15) {
    await page.getByRole("button", { name: "No", exact: true }).click();
    await expect(page.locator('[data-intro-phase="counter15"]')).toBeVisible();
    await expect(page.getByRole("button", { name: "Yes", exact: true })).toHaveCount(0);
    await finishClip(page);
    await expect(page.getByText("Your share: 15% of the profit", { exact: true })).toBeVisible();
  }
  if (share === 20) {
    await page.getByRole("button", { name: "No", exact: true }).click();
    await expect(page.locator('[data-intro-phase="counter20"]')).toBeVisible();
    await finishClip(page);
    await expect(page.getByText("Your share: 20% of the profit — last offer", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "No", exact: true })).toHaveCount(0);
  }
  await page.getByRole("button", { name: "Yes", exact: true }).click();
  await expect(page.locator('[data-intro-phase="continuation"]')).toBeVisible();
  const saved = await page.request.get("/api/profile/intro");
  expect((await saved.json()).deal.acceptedShare).toBe(share);
  await page.reload();
  await expect(page.locator('[data-intro-phase="continuation"]')).toBeVisible();
  await finishClip(page);
  await expect(page.getByRole("button", { name: "Go to the beach" })).toBeVisible();
  expect((await (await page.request.get("/api/profile/intro")).json()).deal.acceptedShare).toBe(share);
});
test("sound, captions, pause and Skip are available without accepting a deal", async ({ page }) => {
  await openIntro(page);
  await page.getByRole("button", { name: "Sound on", exact: true }).click();
  await expect(page.locator("video")).toHaveJSProperty("muted", false);
  await page.getByRole("button", { name: "Captions off", exact: true }).click();
  await expect(page.getByRole("button", { name: "Captions on", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await expect(page.locator("video")).toHaveJSProperty("paused", true);
  await page.getByRole("button", { name: "Skip — wake on the beach" }).click();
  await expect(page.locator("[data-intro-phase]")).toHaveCount(0);
  expect((await (await page.request.get("/api/profile/intro")).json()).deal.acceptedShare).toBeNull();
});
test("failed acceptance stays at the offer until the choice is saved", async ({ page }) => {
  await openIntro(page); await finishClip(page);
  await expect(page.getByRole("button", { name: "Yes", exact: true })).toBeVisible();
  let failed = false;
  await page.route("**/api/profile/intro", async route => {
    if (!failed && route.request().method() === "POST") { failed = true; await route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ error: "Your choice could not be saved. Please try again." }) }); }
    else await route.continue();
  });
  await page.getByRole("button", { name: "Yes", exact: true }).click();
  await expect(page.locator('[data-intro-phase] [role="alert"]')).toBeVisible();
  await expect(page.locator('[data-intro-phase="offer10"]')).toBeVisible();
  await page.getByRole("button", { name: "Try again", exact: true }).click();
  await expect(page.locator('[data-intro-phase="continuation"]')).toBeVisible();
});
