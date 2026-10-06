import { expect, test } from "@playwright/test";
test.setTimeout(120_000);
const parentLogin = { email: "test_parent@primer.local", password: "test-parent-login" };

test("parent dashboard switches students, periods and subject details without impersonation", async ({ page }) => {
  const login = await page.request.post("/api/auth/login", { data: parentLogin });
  expect(login.ok(), await login.text()).toBeTruthy();
  const { captains } = await (await page.request.get("/api/household/captains")).json();
  expect(captains.length).toBeGreaterThan(0);
  await page.goto("/household");
  await page.getByRole("link", { name: "Student usage and progress" }).click();
  await expect(page.getByRole("heading", { name: "Student usage and progress", exact: true })).toBeVisible();
  const period = page.getByRole("navigation", { name: "Usage period" });
  await period.getByRole("link", { name: "Last 7 days" }).click();
  await expect(page).toHaveURL(/period=7/);
  await expect(page.getByText(/Standards progress is cumulative/)).toBeVisible();
  await period.getByRole("link", { name: "All recorded time" }).click();
  await expect(page).toHaveURL(/period=all/);
  await page.getByText("Usage by day", { exact: true }).click();
  await expect(page.getByText(/Dates are Eastern time/)).toBeVisible();
  const subjects = page.getByRole("navigation", { name: "Filter standards by subject" });
  await subjects.getByRole("link").nth(1).click();
  await expect(page).toHaveURL(/subject=/);
  await page.getByText("View standards and evidence estimates", { exact: true }).click();
  await expect(page.getByText(/observation\(s\)/).first()).toBeVisible();
  await expect(page.getByText(/Not observed/).first()).toBeVisible();
  await subjects.getByRole("link", { name: "All subjects", exact: true }).click();
  await page.screenshot({ path: "docs/parent-dashboard-preview.png", fullPage: false });
  if (captains.length > 1) {
    await page.getByRole("navigation", { name: "Choose student" }).getByRole("link").nth(1).click();
    await expect(page).toHaveURL(new RegExp(`captain=${captains[1].userId}`));
  }
  expect((await page.request.get("/api/household/captains")).ok()).toBeTruthy();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Student usage and progress", exact: true })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.getByRole("link", { name: "Back to household and handoff" }).click();
  await expect(page).toHaveURL(/\/household$/);
});

test("foreign student IDs and child accounts cannot open parent reports", async ({ page }) => {
  await page.request.post("/api/auth/login", { data: parentLogin });
  await page.goto("/household/progress?captain=another_households_student");
  // Next streams loading boundaries with HTTP 200 before notFound resolves.
  await expect(page.getByRole("heading", { name: "404", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Student usage and progress", exact: true })).toHaveCount(0);
  const childLogin = await page.request.post("/api/auth/child-login", { data: { username: "testcaptain", pin: "1234" } });
  expect(childLogin.ok(), await childLogin.text()).toBeTruthy();
  await page.goto("/household/progress", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/learn/);
  await expect(page.getByRole("heading", { name: "Student usage and progress", exact: true })).toHaveCount(0);
});
