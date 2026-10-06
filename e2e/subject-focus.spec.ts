import { expect, test } from "@playwright/test";

test("retry repeats a failed subject selection and opens its starting check", async ({ page }) => {
  test.setTimeout(120_000);
  const boot = await page.request.post("/api/dev/agent-bootstrap", { data: { open: "none" } });
  expect(boot.ok(), await boot.text()).toBeTruthy();
  const { learnUrl } = await boot.json();
  const selected: string[] = [];
  await page.route("**/api/session/*/subject-focus", async (route) => {
    if (route.request().method() !== "POST") return route.continue();
    selected.push(route.request().postDataJSON().subjectSlug);
    if (selected.length === 1) return route.fulfill({ status: 503, json: { error: "That subject did not open. Please try again." } });
    return route.continue();
  });
  await page.goto(learnUrl, { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("play-shell")).toHaveAttribute("data-ready", "true", { timeout: 30000 });
  await page.getByRole("button", { name: "Focus", exact: true }).click();
  await page.getByRole("button", { name: "Grade 3 Reading & Writing", exact: true }).click();
  await expect(page.getByRole("alert").filter({ hasText: "That subject did not open" })).toBeVisible();
  await page.getByRole("button", { name: "Try again", exact: true }).click();
  await page.getByRole("button", { name: "Find where I should start", exact: true }).click();
  await expect(page.getByTestId("subject-five-check")).toContainText("Grade 3 starter sample");
  expect(selected).toEqual(["ela_g3", "ela_g3"]);
});

test("captain chooses a subject and must confirm a switch", async ({ page }) => {
  const boot = await page.request.post("/api/dev/agent-bootstrap", {
    data: { open: "none" },
  });
  expect(boot.ok(), await boot.text()).toBeTruthy();
  const body = (await boot.json()) as { learnUrl: string };

  await page.goto(body.learnUrl, { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("play-shell")).toHaveAttribute("data-ready", "true", { timeout: 30000 });
  await page.getByRole("button", { name: "Focus" }).click();
  await expect(page.getByRole("heading", { name: "What do you want to work on?" })).toBeVisible();
  const sessionId = new URL(body.learnUrl, "http://localhost:3000").pathname.split("/").pop();
  const focus = await page.request.get(`/api/session/${sessionId}/subject-focus`);
  expect(focus.ok(), await focus.text()).toBeTruthy();
  await expect(page.getByRole("button", { name: "Grade 3 Math" })).toBeVisible({
    timeout: 20_000,
  });
  await expect(page.getByRole("button", { name: "Grade 3 Science" })).toBeVisible();

  await page.getByRole("button", { name: "Grade 3 Math" }).click();
  await expect(page.getByText(/\d+ of \d+ standards seen/)).toBeVisible();
  await expect(page.getByText("MA.3.NSO.1.1")).toHaveCount(1);

  await page.getByRole("button", { name: "Grade 3 Science" }).click();
  await expect(page.getByText("Leave Grade 3 Math for Grade 3 Science?")).toBeVisible({
    timeout: 20_000,
  });
  await page.getByRole("button", { name: "Stay" }).click();
  await expect(page.getByText("MA.3.NSO.1.1")).toHaveCount(1);

  await page.getByRole("button", { name: "Grade 3 Science" }).click();
  await page.getByRole("button", { name: "Yes, switch" }).click();
  await expect(page.getByText("SC.3.N.1.1")).toHaveCount(1, { timeout: 20_000 });
  await expect(page.getByText("MA.3.NSO.1.1")).toHaveCount(0);
});
