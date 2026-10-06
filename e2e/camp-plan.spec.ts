import { expect, test } from "@playwright/test";

test.setTimeout(120_000);

const BUDGET_KEY = {
  rationsToKeep: 24,
  freeRations: 24,
  extraDays: 6,
  cookFireTimber: 18,
  timberLeftAfterFire: 22,
  stormCanvasNeeded: 20,
  stormCanvasShort: 4,
  affordableIds: ["cook-fire", "rain-cover", "ration-stores"],
};

test("camp plan budgets, then builds the cook fire", async ({ page }) => {
  const boot = await page.request.post("/api/dev/agent-bootstrap");
  expect(boot.ok(), await boot.text()).toBeTruthy();
  const body = (await boot.json()) as { learnUrl: string };

  await page.goto(body.learnUrl, { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("play-shell")).toHaveAttribute("data-ready", "true", {
    timeout: 60_000,
  });

  const opened = await page.request.get("/api/camp-plan");
  expect(opened.ok(), await opened.text()).toBeTruthy();
  const plan = (await opened.json()) as { learnerGoal: string; standardCodes: string[] };
  expect(plan.learnerGoal).toBe("Plan what camp can afford");
  expect(plan.standardCodes).toEqual(["MA.3.NSO.2.1", "MA.3.NSO.2.4", "MA.3.AR.1.2"]);

  const taught = await page.request.post("/api/camp-plan", { data: { action: "teach_done" } });
  expect(taught.ok(), await taught.text()).toBeTruthy();

  const early = await page.request.post("/api/camp-plan", { data: { action: "buy", upgradeId: "storm-shelter" } });
  expect(early.ok()).toBeFalsy();

  const budget = await page.request.post("/api/camp-plan", {
    data: { action: "budget", answers: BUDGET_KEY },
  });
  expect(budget.ok(), await budget.text()).toBeTruthy();
  const checked = (await budget.json()) as { evaluation: { pass: boolean }; state: { budgetPassed: boolean } };
  expect(checked.evaluation.pass).toBe(true);
  expect(checked.state.budgetPassed).toBe(true);

  const bought = await page.request.post("/api/camp-plan", { data: { action: "buy", upgradeId: "cook-fire" } });
  expect(bought.ok(), await bought.text()).toBeTruthy();
  const built = (await bought.json()) as {
    upgrade: string;
    stage: string;
    remainder: { timber: number; scrap: number };
  };
  expect(built.upgrade).toBe("cook-fire");
  expect(built.stage).toBe("fire");
  expect(built.remainder.timber).toBe(22);
  expect(built.remainder.scrap).toBe(24);

  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("play-shell")).toHaveAttribute("data-ready", "true", { timeout: 60_000 });
  await expect(page.getByTestId("camp-stage")).toContainText("Fire");
  await expect(page.getByLabel("22 timber")).toBeVisible();
});

test("camp resource plan is on the jobs board", async ({ page }) => {
  const boot = await page.request.post("/api/dev/agent-bootstrap");
  expect(boot.ok(), await boot.text()).toBeTruthy();
  const body = (await boot.json()) as { learnUrl: string };
  await page.goto(body.learnUrl, { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("play-shell")).toHaveAttribute("data-ready", "true", { timeout: 60_000 });

  const jobs = page.getByRole("button", { name: /^(Jobs|Camp needs)$/ });
  await jobs.click();
  const board = page.getByRole("dialog", { name: "Camp needs" });
  const camp = board.getByRole("article").filter({ hasText: "Camp resource plan" });
  await expect(camp).toBeVisible();
  await expect(camp).toContainText("Budget, rations, and build materials");
  await expect(board.getByText("Dune")).toHaveCount(0);
  await expect(board.getByText("Creek")).toHaveCount(0);

  const start = camp.getByRole("button", { name: /Start job|Review/ });
  if (await start.count()) {
    await start.click();
    await expect(page.getByTestId("camp-teach-panel").or(page.getByTestId("camp-budget-panel"))).toBeVisible();
  }
});
