import { expect, test } from "@playwright/test";

test.setTimeout(120_000);
test("science uses five fresh questions, saves each answer and resumes after reload", async ({ page }) => {
  const boot = await page.request.post("/api/dev/agent-bootstrap", { data: { open: "none", resetSubjectChecks: true } });
  expect(boot.ok(), await boot.text()).toBeTruthy();
  const { learnUrl } = await boot.json();
  await page.goto(learnUrl, { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("play-shell")).toHaveAttribute("data-ready", "true", { timeout: 30000 });
  async function openCheck() {
    await page.getByRole("button", { name: "Focus", exact: true }).click();
    await page.getByRole("button", { name: "Grade 3 Science", exact: true }).click();
    await page.getByRole("button", { name: "Find where I should start" }).click();
  }
  await openCheck();
  const check = page.getByTestId("subject-five-check");
  await check.getByRole("button", { name: "A soft sponge and a hard shell", exact: true }).click();
  await expect(check.getByText("Question 2 of 5 · Saved")).toBeVisible();
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("play-shell")).toHaveAttribute("data-ready", "true", { timeout: 30000 }); await openCheck();
  await expect(check.getByText("Question 2 of 5 · Saved")).toBeVisible();
  for (const answer of ["Does a wet towel dry faster in the sun than in the shade?", "The stem", "Is the sand cooler in shade than in sunlight?", "The leaves"]) {
    await check.getByRole("button", { name: answer, exact: true }).click();
  }
  await expect(check.getByText("Starting check complete · Saved")).toBeVisible();
  let reviewBeat = "";
  await page.route("**/api/session/*/message", async (route) => {
    reviewBeat = route.request().postDataJSON().content;
    const events = [{ type: "text", content: "Let's talk through the plant idea you just tried." }, { type: "done", messageId: "subject-review-test" }];
    await route.fulfill({ contentType: "text/event-stream", body: events.map((event) => `data: ${JSON.stringify(event)}\n\n`).join("") });
  });
  await check.getByRole("button", { name: "Talk it through with Rho" }).click();
  await expect(page.getByText("Let's talk through the plant idea you just tried.")).toBeVisible();
  expect(reviewBeat).toBe("__subject_check_review__");
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("play-shell")).toHaveAttribute("data-ready", "true", { timeout: 30000 }); await openCheck();
  await expect(check.getByText("Starting check complete · Saved")).toBeVisible();
});

test("two distinct reading misses offer support without a lower-grade claim", async ({ page }) => {
  const boot = await page.request.post("/api/dev/agent-bootstrap", { data: { open: "none", resetSubjectChecks: true } });
  expect(boot.ok(), await boot.text()).toBeTruthy();
  const { learnUrl } = await boot.json();
  await page.goto(learnUrl, { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("play-shell")).toHaveAttribute("data-ready", "true", { timeout: 30000 });
  await page.getByRole("button", { name: "Focus", exact: true }).click();
  await page.getByRole("button", { name: "Grade 3 Reading & Writing", exact: true }).click();
  await page.getByRole("button", { name: "Find where I should start" }).click();
  const check = page.getByTestId("subject-five-check");
  await check.getByRole("button", { name: "Still warm from the fire", exact: true }).click();
  await check.getByRole("button", { name: "Very noisy", exact: true }).click();
  await expect(check.getByText(/Let's build using clues/)).toBeVisible();
  await expect(check.getByText(/ELA\.2\./)).toHaveCount(0);
});
