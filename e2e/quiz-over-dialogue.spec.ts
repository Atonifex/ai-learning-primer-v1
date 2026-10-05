import { expect, test } from "@playwright/test";

test("starting a job opens the quiz without the dialogue cutscene on top", async ({
  page,
}) => {
  const boot = await page.request.post("/api/dev/agent-bootstrap", {
    data: { open: "dialogue" },
  });
  expect(boot.ok(), await boot.text()).toBeTruthy();
  const body = (await boot.json()) as { learnUrl: string };

  await page.goto(body.learnUrl);
  await expect(page.getByText("Talking with Rho")).toBeVisible();
  await page.getByRole("button", { name: "Back to beach" }).click();
  await expect(page.getByText("Talking with Rho")).toHaveCount(0);

  await page.getByRole("button", { name: "Jobs" }).click();
  await page.getByRole("button", { name: "Start job" }).first().click();

  await expect(page.getByTestId("quiz-overlay")).toBeVisible();
  await expect(page.getByText("Rho's slate · island job").or(page.getByText("Crate lid · salvage count"))).toBeVisible();
  await expect(page.getByText("Talking with Rho")).toHaveCount(0);
});
