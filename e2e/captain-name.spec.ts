import { expect, test } from "@playwright/test";

test.setTimeout(120_000);

test("captain name edits recover from failure, persist and appear back on the island", async ({ page }) => {
  const boot = await page.request.post("/api/dev/agent-bootstrap", { data: { open: "none" } });
  expect(boot.ok(), await boot.text()).toBeTruthy();
  const { learnUrl, displayName } = await boot.json();
  const nextName = displayName === "Captain Nova" ? "Captain Orion" : "Captain Nova";
  try {
    await page.goto(learnUrl, { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("play-shell")).toHaveAttribute("data-ready", "true", { timeout: 30_000 });
    await page.getByRole("link", { name: "Settings", exact: true }).click();
    const input = page.getByLabel("Your captain name");
    await input.fill(nextName);
    let fail = true;
    await page.route("**/api/profile", (route) => {
      if (route.request().method() === "PATCH" && fail) {
        fail = false;
        return route.fulfill({ status: 503, json: { error: "Could not save. Try again." } });
      }
      return route.continue();
    });
    await page.getByRole("button", { name: "Save captain name" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "Could not save" })).toContainText("Try again");
    await expect(input).toHaveValue(nextName);
    await page.getByRole("button", { name: "Save captain name" }).click();
    await expect(page.getByRole("status")).toHaveText("Captain name saved.");
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.getByLabel("Your captain name")).toHaveValue(nextName);
    await page.goto(learnUrl, { waitUntil: "domcontentloaded" });
    await expect(page.getByTestId("play-shell")).toHaveAttribute("data-ready", "true", { timeout: 30_000 });
    await expect(page.getByText(`Captain ${nextName}`, { exact: true })).toBeVisible();
  } finally {
    await page.request.patch("/api/profile", { data: { displayName: displayName || "Test Captain" } });
  }
});

test("legacy naming-step accounts continue with the account name", async ({ page }) => {
  const boot = await page.request.post("/api/dev/agent-bootstrap", { data: { open: "none" } });
  expect(boot.ok(), await boot.text()).toBeTruthy();
  const { learnUrl, displayName } = await boot.json();
  expect((await page.request.patch("/api/profile", { data: { firstRunStep: "name" } })).ok()).toBeTruthy();
  await page.goto(learnUrl, { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("play-shell")).toHaveAttribute("data-ready", "true", { timeout: 30_000 });
  // This long-lived fixture can be beyond Chapter 1; reconciliation may finish the tutorial.
  await expect(page.getByText(/tap the sand — walk to the wreck pile/).or(
    page.getByText(`Captain ${displayName || "Captain"}`, { exact: true })
  )).toBeVisible();
  await expect(page.getByRole("heading", { name: /name for the captain/i })).toHaveCount(0);
});
