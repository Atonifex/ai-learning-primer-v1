import { expect, test } from "@playwright/test";

test.setTimeout(120_000);

test("camp HUD and island map show saved resources, crew slots, and stage", async ({ page }) => {
  const boot = await page.request.post("/api/dev/agent-bootstrap", {
    data: { open: "none" },
  });
  expect(boot.ok(), await boot.text()).toBeTruthy();
  const body = (await boot.json()) as { learnUrl: string };

  const boardRes = await page.request.get("/api/missions");
  expect(boardRes.ok(), await boardRes.text()).toBeTruthy();
  const board = (await boardRes.json()) as {
    wreckQuizDone: boolean;
    camp: {
      stage: string;
      stageLabel: string;
      rations: number;
      scrap: number;
      crewFound: number;
      crewTotal: number;
      crew: Array<{ id: string; name: string; status: string }>;
    };
  };
  expect(board.camp.crewTotal).toBe(5);
  expect(board.camp.crewFound).toBe(0);
  expect(board.camp.crew.map((slot) => slot.id)).toEqual(["mara", "pell", "idi", "vey", "tem"]);
  if (board.wreckQuizDone) {
    expect(board.camp.stage).toBe("crates");
    expect(board.camp.rations).toBeGreaterThanOrEqual(2);
    expect(board.camp.scrap).toBeGreaterThanOrEqual(1);
  } else {
    expect(board.camp.stage).toBe("clearing");
    expect(board.camp.rations).toBe(0);
  }

  await page.goto(body.learnUrl);
  const hud = page.getByTestId("resource-hud");
  await expect(hud).toBeVisible({ timeout: 20_000 });
  await expect(hud.getByTestId("camp-stage")).toContainText(board.camp.stageLabel);
  await expect(hud.getByText(`${board.camp.crewFound} of ${board.camp.crewTotal}`)).toBeVisible();
  await expect(hud.getByTestId("chapter-problem")).toContainText("Food will not last");

  await page.getByRole("button", { name: "Island map", exact: true }).click();
  const atlas = page.getByTestId("world-map");
  await expect(atlas.getByTestId("atlas-camp")).toContainText(board.camp.stageLabel);
  await atlas.getByRole("button", { name: /^Camp/ }).first().click();
  await expect(atlas.getByTestId("camp-place-stage")).toBeVisible();
});
