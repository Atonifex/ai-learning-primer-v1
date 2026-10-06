import { expect, test } from "@playwright/test";

test.setTimeout(120_000);

test("garden API opens with learner goal and accepts a healthy planting", async ({ page }) => {
  const boot = await page.request.post("/api/dev/agent-bootstrap");
  expect(boot.ok(), await boot.text()).toBeTruthy();
  const body = (await boot.json()) as { learnUrl: string };

  await page.goto(body.learnUrl, { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("play-shell")).toHaveAttribute("data-ready", "true", {
    timeout: 60_000,
  });

  const get = await page.request.get("/api/garden");
  expect(get.ok(), await get.text()).toBeTruthy();
  const open = (await get.json()) as { learnerGoal: string; standardCode: string; plots: unknown[] };
  expect(open.learnerGoal).toBe("What plants need to grow");
  expect(open.standardCode).toBe("SC.3.L.17.2");
  expect(open.plots.length).toBe(6);

  const post = await page.request.post("/api/garden", {
    data: {
      action: "replace",
      plantings: [{ plotId: "creek-sun" }, { plotId: "tent-morning" }],
    },
  });
  expect(post.ok(), await post.text()).toBeTruthy();
  const saved = (await post.json()) as {
    evaluation: { lesson1Pass: boolean };
    state: { lesson1Passed: boolean };
  };
  expect(saved.evaluation.lesson1Pass).toBe(true);
  expect(saved.state.lesson1Passed).toBe(true);
});
