import { expect, test } from "@playwright/test";

test("math check shows an example, then stops below the catalog", async ({ page }) => {
  const boot = await page.request.post("/api/dev/agent-bootstrap", {
    data: { open: "none" },
  });
  expect(boot.ok(), await boot.text()).toBeTruthy();
  const body = (await boot.json()) as { learnUrl: string };
  const sessionId = new URL(body.learnUrl, "http://localhost:3000").pathname.split("/").pop();

  await page.goto(body.learnUrl);
  const focus = await page.request.get(`/api/session/${sessionId}/subject-focus`);
  expect(focus.ok(), await focus.text()).toBeTruthy();

  await expect(page.getByRole("button", { name: "Grade 3 Math" })).toBeVisible({
    timeout: 20_000,
  });
  await page.getByRole("button", { name: "Grade 3 Math" }).click();
  await page.getByRole("button", { name: "Find where I should start" }).click();

  await expect(page.getByText("2,000 + 300 + 40 + 6 is written 2,346.")).toBeVisible();
  await page.getByRole("button", { name: "I'll try one" }).click();
  await expect(page.getByText("How do you write 1,000 + 200 + 30 + 5?")).toBeVisible();
  await expect(page.getByText("2,346")).toHaveCount(0);

  await page.getByRole("button", { name: "12,305" }).click();
  await expect(page.getByText("Not that one.")).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "I'll try one" }).click();
  await page.getByRole("button", { name: "12,305" }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(
    page.getByText("this check will not guess a grade 2 code")
  ).toBeVisible();
});
