import { expect, test } from "@playwright/test";

test("progress shows what is carried into the next chapter", async ({ page }) => {
  const boot = await page.request.post("/api/dev/agent-bootstrap", {
    data: { open: "none" },
  });
  expect(boot.ok(), await boot.text()).toBeTruthy();

  await page.goto("/progress");

  const section = page.locator("section").filter({
    has: page.getByRole("heading", { name: "Carried into the next chapter" }),
  });
  await expect(section).toBeVisible();

  const empty = section.getByText(
    "Nothing is carried forward until the chapter crew log is saved."
  );
  const carried = section.getByText("Must reuse");
  await expect(empty.or(carried.first())).toBeVisible();
});
