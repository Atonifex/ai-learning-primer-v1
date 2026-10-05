import { expect, test } from "@playwright/test";

test("crew-log toast and AI debug panel stay gated off by default", async ({
  page,
}) => {
  const boot = await page.request.post("/api/dev/agent-bootstrap", {
    data: { open: "dialogue" },
  });
  expect(boot.ok(), await boot.text()).toBeTruthy();
  const body = (await boot.json()) as { learnUrl: string };

  await page.goto(body.learnUrl);
  await expect(page.getByText("Talking with Rho")).toBeVisible();
  await expect(page.getByTestId("ai-debug-panel")).toHaveCount(0);
  await expect(page.getByTestId("crew-log-saved-toast")).toHaveCount(0);

  const toggle = page.getByTestId("ai-debug-toggle");
  if ((await toggle.count()) > 0) {
    await toggle.click();
    await expect(page.getByTestId("ai-debug-panel")).toContainText("What Rho received");
    await expect(page.getByText("Talking with Rho")).toBeVisible();
  }
});
