import { expect, test } from "@playwright/test";
import { PRIMER_INVITATION } from "../lib/productIdentity";
import { CAMP_SKILLS } from "../lib/play/day0";

test.setTimeout(120_000);

test("after the movie, subjects explain their purpose and use the account captain name", async ({
  page,
}) => {
  const boot = await page.request.post("/api/dev/agent-bootstrap", { data: { open: "intro" } });
  expect(boot.ok(), await boot.text()).toBeTruthy();
  const body = (await boot.json()) as { learnUrl: string; displayName: string };
  await page.goto(body.learnUrl, { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("play-shell")).toHaveAttribute("data-ready", "true", { timeout: 30000 });
  const skip = page.getByRole("button", { name: "Skip — wake on the beach" });
  const card = page.getByTestId("learning-purpose-card");
  await expect(skip.or(card)).toBeVisible({ timeout: 30_000 });
  if (await skip.isVisible()) await skip.click();

  await expect(card).toBeVisible();
  await expect(card.getByRole("heading", { name: "Become your best self" })).toBeVisible();
  await expect(card.getByText(PRIMER_INVITATION, { exact: true })).toBeVisible();
  await expect(card.getByText("MA.3")).toHaveCount(0);
  await card.getByRole("button", { name: "Continue" }).click();
  await expect(card.getByText("These are the skills camp needs")).toBeVisible();
  await expect(card.getByText(/not a scored test/i)).toBeVisible();
  await expect(card.getByText(`Captain ${body.displayName || "Captain"}`, { exact: true })).toBeVisible();
  for (const skill of CAMP_SKILLS) {
    const help = card.getByRole("button", { name: `How does ${skill.subject} help me and our crew?` });
    await help.focus();
    await page.keyboard.press("Enter");
    await expect(help).toHaveAttribute("aria-expanded", "true");
    await expect(card.getByText(skill.explanation, { exact: true })).toBeVisible();
    await help.click();
    await expect(help).toHaveAttribute("aria-expanded", "false");
  }
  await card.getByRole("button", { name: "How does Math help me and our crew?" }).click();
  await page.screenshot({ path: "docs/skills-onboarding-preview.png" });
  const savedPurpose = page.waitForResponse((response) => response.url().endsWith("/api/profile") &&
    response.request().method() === "PATCH" && response.request().postDataJSON()?.firstRunEvent === "purpose_done");
  await card.getByRole("button", { name: "Explore the island" }).click();
  expect((await savedPurpose).ok()).toBeTruthy();
  await expect(card).toHaveCount(0);
  await expect(page.getByText(/tap the sand — walk to the wreck pile/)).toBeVisible();
  await expect(page.getByRole("heading", { name: /name for the captain/i })).toHaveCount(0);
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("play-shell")).toHaveAttribute("data-ready", "true", { timeout: 30_000 });
  await expect(card).toHaveCount(0);
  await expect(page.getByRole("heading", { name: /name for the captain/i })).toHaveCount(0);
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
