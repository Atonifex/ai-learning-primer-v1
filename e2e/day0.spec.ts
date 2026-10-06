import { expect, test } from "@playwright/test";

test.setTimeout(120_000);

test("after the movie, a learning card explains purpose then skills before naming the captain", async ({
  page,
}) => {
  const boot = await page.request.post("/api/dev/agent-bootstrap", { data: { open: "intro" } });
  expect(boot.ok(), await boot.text()).toBeTruthy();
  const body = (await boot.json()) as { learnUrl: string };
  await page.goto(body.learnUrl, { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("play-shell")).toHaveAttribute("data-ready", "true", { timeout: 30000 });
  const skip = page.getByRole("button", { name: "Skip — wake on the beach" });
  const card = page.getByTestId("learning-purpose-card");
  await expect(skip.or(card)).toBeVisible({ timeout: 30_000 });
  if (await skip.isVisible()) await skip.click();

  await expect(card).toBeVisible();
  await expect(card.getByText("This is a learning adventure")).toBeVisible();
  await expect(card.getByText(/not a scored test/i)).toBeVisible();
  await expect(card.getByText("MA.3")).toHaveCount(0);
  await card.getByRole("button", { name: "Continue" }).click();
  await expect(card.getByText("These are the skills camp needs")).toBeVisible();
  await card.getByRole("button", { name: "Name the captain" }).click();
  await expect(page.getByRole("heading", { name: /name for the captain/i })).toBeVisible();
});

test("Camp needs shows the wreck plus locked previews and keeps the chapter problem", async ({
  page,
}) => {
  const boot = await page.request.post("/api/dev/agent-bootstrap", { data: { open: "none" } });
  expect(boot.ok(), await boot.text()).toBeTruthy();
  const body = (await boot.json()) as { learnUrl: string };
  await page.goto(body.learnUrl, { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("play-shell")).toHaveAttribute("data-ready", "true", { timeout: 30000 });
  await expect(page.getByTestId("chapter-problem")).toContainText("Food will not last");
  await page.getByRole("button", { name: "Camp needs" }).click();
  await expect(page.getByRole("paragraph").filter({ hasText: /^Camp needs$/ })).toBeVisible();
  await expect(page.getByText("Wreck count in three forms")).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText("Storm words in context")).toBeVisible();
  await expect(page.getByText("What plants use to make food")).toBeVisible();
  await expect(page.getByText("Name the social-science jobs")).toBeVisible();
  await expect(page.getByText("Paces of tens and hundreds")).toBeVisible();
  await expect(page.getByText("Your next step", { exact: true })).toBeVisible();
});
