import { expect, test } from "@playwright/test";

test.setTimeout(120_000);

test("after the movie, a learning card explains purpose then skills before naming the captain", async ({
  page,
}) => {
  const boot = await page.request.post("/api/dev/agent-bootstrap", { data: { open: "intro" } });
  expect(boot.ok(), await boot.text()).toBeTruthy();
  const body = (await boot.json()) as { learnUrl: string };
  await page.goto(body.learnUrl);
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

test("Camp needs is wreck salvage, not four subjects, and the HUD keeps the chapter problem", async ({
  page,
}) => {
  const boot = await page.request.post("/api/dev/agent-bootstrap", { data: { open: "none" } });
  expect(boot.ok(), await boot.text()).toBeTruthy();
  const body = (await boot.json()) as { learnUrl: string };
  await page.goto(body.learnUrl);
  await expect(page.getByTestId("chapter-problem")).toContainText("Food will not last");
  await page.getByRole("button", { name: "Camp needs" }).click();
  await expect(page.getByRole("paragraph").filter({ hasText: /^Camp needs$/ })).toBeVisible();
  await expect(page.getByText("Wreck count in three forms")).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText("Storm words in context")).toHaveCount(0);
  await expect(page.getByText("What plants use to make food")).toHaveCount(0);
  await expect(page.getByText("Name the social-science jobs")).toHaveCount(0);
  await expect(page.getByText("Paces of tens and hundreds")).toHaveCount(0);
});
