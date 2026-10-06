import { expect, test } from "@playwright/test";
import { PRIMER_INVITATION } from "../lib/productIdentity";

test("public home explains Primer and leads to both account entry paths", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("primer-invitation")).toHaveText(PRIMER_INVITATION);
  await page.getByRole("link", { name: "Create a parent account" }).click();
  await expect(page).toHaveURL(/\/register$/);
  await expect(page.getByRole("heading", { name: "Create a household" })).toBeVisible();
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.getByRole("link", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.getByRole("button", { name: "Captain", exact: true }).click();
  await page.getByRole("button", { name: "1", exact: true }).click();
  await expect(page.getByText("1•••", { exact: true })).toBeVisible();
});

test("a signed-in captain still goes directly from home to learning", async ({ page }) => {
  const boot = await page.request.post("/api/dev/agent-bootstrap", { data: { open: "none" } });
  expect(boot.ok(), await boot.text()).toBeTruthy();
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/learn/);
  await expect(page.getByTestId("play-shell")).toHaveAttribute("data-ready", "true", { timeout: 30_000 });
});
