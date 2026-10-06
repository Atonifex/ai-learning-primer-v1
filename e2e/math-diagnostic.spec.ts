import { expect, test } from "@playwright/test";

test("math check shows an example, then stops below the catalog", async ({ page }) => {
  const boot = await page.request.post("/api/dev/agent-bootstrap", {
    data: { open: "none" },
  });
  expect(boot.ok(), await boot.text()).toBeTruthy();
  const body = (await boot.json()) as { learnUrl: string };

  await page.goto(body.learnUrl, { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("play-shell")).toHaveAttribute("data-ready", "true", { timeout: 30000 });
  await page.getByRole("button", { name: "Focus" }).click();
  await expect(page.getByRole("button", { name: "Grade 3 Math" })).toBeVisible({
    timeout: 20_000,
  });
  await page.getByRole("button", { name: "Grade 3 Math" }).click();
  await page.getByRole("button", { name: "Find where I should start" }).click();

  const check = page.getByTestId("math-five-check");
  await expect(check.getByText("2,000 + 300 + 40 + 6 is written 2,346.")).toBeVisible();
  await expect(check.getByText("How do you write 1,000 + 200 + 30 + 5?")).toBeVisible();
  await expect(check.getByRole("button", { name: "2,346" })).toHaveCount(0);

  await check.getByRole("button", { name: "12,305" }).click();
  await expect(check.getByText("Which is 432 in expanded form?")).toBeVisible();
  await check.getByRole("button", { name: "4 + 3 + 2" }).click();

  await expect(check.getByText(/Let's build this together/)).toBeVisible();
  await expect(check.getByText("A tent is up, and one ration is set aside.")).toBeVisible();
  await expect(check.getByText(/MA\.2\./)).toHaveCount(0);
});
