import { expect, test } from "@playwright/test";

test("starting a job opens the quiz without the dialogue cutscene on top", async ({
  page,
}) => {
  test.setTimeout(120_000);
  const boot = await page.request.post("/api/dev/agent-bootstrap", {
    data: { open: "dialogue" },
  });
  expect(boot.ok(), await boot.text()).toBeTruthy();
  const body = (await boot.json()) as { learnUrl: string; sessionId: string };
  // Exercise a real subject/session handoff instead of depending on the previous test's lens.
  const focus = await page.request.post(`/api/session/${body.sessionId}/subject-focus`, {
    data: { subjectSlug: "math_g3", confirmed: true },
  });
  expect(focus.ok()).toBeTruthy();

  await page.goto(body.learnUrl, { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("play-shell")).toHaveAttribute("data-ready", "true", { timeout: 30000 });
  await expect(page.getByText("Talking with Rho")).toBeVisible();
  await page.getByRole("button", { name: "Back to beach" }).click();
  await expect(page.getByText("Talking with Rho")).toHaveCount(0);

  await page.getByRole("button", { name: "Camp needs" }).click();
  await expect(page.getByText("Wreck count in three forms")).toBeVisible();
  await expect(page.getByText("Storm words in context")).toBeVisible();
  const startJob = page.locator("article").filter({ hasText: "Wreck count in three forms" }).getByRole("button", { name: /Review|Start job/ });
  const reviewing = await startJob.first().innerText() === "Review";
  const starting = page.waitForResponse((response) => response.url().endsWith("/api/missions/start") && response.request().method() === "POST");
  await startJob.first().click();
  const started = await (await starting).json();
  if (started.sessionId !== body.sessionId) {
    await expect(page).toHaveURL(new RegExp(`/learn/${started.sessionId}\\?mission=`), { timeout: 60_000 });
  }

  await expect(page.getByTestId("quiz-overlay")).toBeVisible({ timeout: 60_000 });
  await expect(page.getByText("Rho's slate · island job").or(page.getByText("Crate lid · salvage count"))).toBeVisible();
  await expect(page.getByText("Talking with Rho")).toHaveCount(0);
  if (reviewing) {
    await expect(page.getByText("Completed job review", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Show Rho", exact: true })).toHaveCount(0);
    await expect(page.getByRole("radio").first()).toBeDisabled();
    await page.getByRole("button", { name: "Back to Rho", exact: true }).click();
    await expect(page.getByTestId("quiz-overlay")).toHaveCount(0);
    await expect(page.getByText("Talking with Rho")).toBeVisible();
  }
});
