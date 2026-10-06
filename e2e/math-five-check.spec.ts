import { expect, test } from "@playwright/test";

test.setTimeout(120_000);

test("First shore opens a five-question math check and saves the next question", async ({ page }) => {
  const boot = await page.request.post("/api/dev/agent-bootstrap", { data: { open: "none" } });
  expect(boot.ok(), await boot.text()).toBeTruthy();
  const body = (await boot.json()) as { learnUrl: string };
  await page.goto(body.learnUrl, { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("play-shell")).toHaveAttribute("data-ready", "true", { timeout: 30000 });

  await page.getByRole("button", { name: "Math check" }).click();
  const check = page.getByTestId("math-five-check");
  await expect(check).toBeVisible();
  await expect(page.getByTestId("math-five-progress")).toHaveText("1 of 5");
  await expect(check.getByText("How do you write 1,000 + 200 + 30 + 5?")).toBeVisible();

  await check.getByTestId("math-check-choice").first().click();
  await expect(page.getByTestId("math-five-progress")).toHaveText("2 of 5", { timeout: 20_000 });
  await expect(check.getByText("3 groups of 5 biscuits is which equation?")).toBeVisible();
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("play-shell")).toHaveAttribute("data-ready", "true", { timeout: 30000 });
  await page.getByRole("button", { name: "Math check", exact: true }).click();
  await expect(page.getByTestId("math-five-progress")).toHaveText("2 of 5");
  await expect(check.getByText("3 groups of 5 biscuits is which equation?")).toBeVisible();
});
