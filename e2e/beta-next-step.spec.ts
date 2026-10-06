import { expect, test } from "@playwright/test";

test.setTimeout(120_000);

test("a finished wreck and missing placement has a tappable next step and locked previews", async ({ page }) => {
  const boot = await page.request.post("/api/dev/agent-bootstrap", { data: { open: "board" } });
  expect(boot.ok(), await boot.text()).toBeTruthy();
  const { learnUrl } = await boot.json();
  const boardResponse = await page.request.get("/api/missions");
  expect(boardResponse.ok()).toBeTruthy();
  const board = await boardResponse.json();
  await page.route("**/api/missions", (route) => route.fulfill({ json: {
    ...board, mathPlacementCode: null, mathPlacementStatus: null, wreckQuizDone: true,
    missions: board.missions.map((m: { id: string }) => ({ ...m,
      status: m.id === "wreck-math" ? "completed" : "locked",
      lockReason: m.id === "wreck-math" ? null : "First, finish your math starting check.",
    })),
  } }));
  await page.goto(learnUrl, { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("play-shell")).toHaveAttribute("data-ready", "true", { timeout: 30000 });
  const dialog = page.getByTestId("content-workspace").getByRole("region", { name: "Camp needs", exact: true });
  await expect(dialog.getByRole("button", { name: "Start math check" })).toBeVisible();
  await expect(dialog.getByText("First, finish your math starting check.").first()).toBeVisible();
  await page.screenshot({ path: "docs/beta-next-step-preview.png" });
  await dialog.getByRole("button", { name: "Start math check" }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByTestId("math-five-check")).toBeVisible();
  await expect(page.getByTestId("math-check-choice")).toHaveCount(3);
});

test("camp needs recovers from a failed load", async ({ page }) => {
  const boot = await page.request.post("/api/dev/agent-bootstrap", { data: { open: "board" } });
  const { learnUrl } = await boot.json();
  let fail = true;
  await page.route("**/api/missions", (route) => fail ? route.fulfill({ status: 503, json: { error: "Temporary failure" } }) : route.continue());
  await page.goto(learnUrl, { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("play-shell")).toHaveAttribute("data-ready", "true", { timeout: 30000 });
  const dialog = page.getByTestId("content-workspace").getByRole("region", { name: "Camp needs", exact: true });
  await expect(dialog.getByRole("alert")).toContainText("could not load");
  fail = false;
  await dialog.getByRole("button", { name: "Try again" }).click();
  await expect(dialog.getByText("Your next step", { exact: true })).toBeVisible();
});

test("math choices and exit fit a short phone viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 600 });
  const boot = await page.request.post("/api/dev/agent-bootstrap", { data: { open: "none" } });
  const { learnUrl } = await boot.json();
  await page.goto(learnUrl, { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("play-shell")).toHaveAttribute("data-ready", "true", { timeout: 30000 });
  await page.getByRole("button", { name: "Math check", exact: true }).click();
  const check = page.getByTestId("math-five-check");
  await expect(check.getByTestId("math-check-choice")).toHaveCount(3);
  await check.getByRole("button", { name: "Close", exact: true }).focus();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Close content panel", exact: true })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(check.getByRole("button", { name: "Close", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(check).toHaveCount(0);
  // The compact phone conversation hides exploration controls; return to its visible History opener.
  await expect(page.getByRole("button", { name: "History", exact: true })).toBeFocused();
  await page.getByRole("button", { name: "Back to beach", exact: true }).click();
  await expect(page.getByRole("button", { name: "Focus", exact: true })).toBeVisible();
});
