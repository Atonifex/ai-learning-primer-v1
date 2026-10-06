import { expect, test } from "@playwright/test";

test("progress shows what is carried into the next chapter", async ({ page }) => {
  const boot = await page.request.post("/api/dev/agent-bootstrap", {
    data: { open: "none" },
  });
  expect(boot.ok(), await boot.text()).toBeTruthy();

  await page.goto("/progress", { waitUntil: "domcontentloaded" });

  const section = page.locator("section").filter({
    has: page.getByRole("heading", { name: "Carried into the next chapter" }),
  });
  await expect(section).toBeVisible();

  const empty = section.getByText(
    "Story notes and map decisions will appear here as the adventure grows."
  );
  const carried = section.getByText("Note to carry forward");
  await expect(empty.or(carried.first())).toBeVisible();
  await expect(section.getByText(/Must reuse|crew_log|DECISION ·|map_note:/)).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Back to the island" })).toBeVisible();
  await expect(page.getByText(/not measures of attention/)).toBeVisible();
  await page.getByRole("link", { name: /Grade 3 Mathematics/ }).click();
  await expect(page.getByText(/not grades or a diagnosis/)).toBeVisible();
  await expect(page.getByText("Not observed", { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/nextReviewAt|seeded and waiting|evidence-driven mastery scores/)).toHaveCount(0);
});
