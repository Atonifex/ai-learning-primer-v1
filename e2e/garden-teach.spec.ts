import { test, expect } from "@playwright/test";

test.setTimeout(90_000);

test("garden teach_done persists before planting", async ({ page }) => {
  const boot = await page.request.post("/api/dev/agent-bootstrap");
  expect(boot.ok(), await boot.text()).toBeTruthy();

  await page.goto((await boot.json() as { learnUrl: string }).learnUrl, {
    waitUntil: "domcontentloaded",
  });
  await expect(page.getByTestId("play-shell")).toHaveAttribute("data-ready", "true", {
    timeout: 60_000,
  });

  const done = await page.request.post("/api/garden", {
    data: { action: "teach_done" },
  });
  expect(done.ok(), await done.text()).toBeTruthy();
  const payload = (await done.json()) as { state: { teachCompleted: boolean } };
  expect(payload.state.teachCompleted).toBe(true);
});
