import { expect, test } from "@playwright/test";

test("science check climbs to a starting point on seeded codes", async ({ page }) => {
  test.setTimeout(120_000);
  const boot = await page.request.post("/api/dev/agent-bootstrap", {
    data: { open: "none" },
  });
  expect(boot.ok(), await boot.text()).toBeTruthy();
  const body = (await boot.json()) as { learnUrl: string };
  await page.goto(body.learnUrl);

  await page.getByRole("button", { name: "Grade 3 Science" }).click();
  await page.getByRole("button", { name: "Find where I should start" }).click();

  const answers = [
    "A soft sponge and a hard shell",
    "A soft sponge and a hard shell",
    "Does a wet towel dry faster in the sun than in the shade?",
    "Does a wet towel dry faster in the sun than in the shade?",
    "The stem",
    "The stem",
  ];
  for (const answer of answers) {
    await page.getByRole("button", { name: "I'll try one" }).click();
    await page.getByRole("button", { name: answer }).click();
    await page.getByRole("button", { name: "Continue" }).click();
  }

  await expect(
    page.getByText("This Grade 3 ladder is solid, through SC.3.L.14.1.")
  ).toBeVisible();
  await expect(page.getByText("Leaves catch sunlight and make food.")).toBeVisible();
  await page.getByRole("button", { name: "I'll try the next one" }).click();
  await page.getByRole("button", { name: "The color of the sky" }).click();
  await expect(page.getByText("The roots do that job.")).toBeVisible();
  await expect(page.getByLabel("What should the camp keep?")).toHaveCount(0);
});

test("two misses on the easiest ELA item do not invent an earlier code", async ({ page }) => {
  const boot = await page.request.post("/api/dev/agent-bootstrap", {
    data: { open: "none" },
  });
  expect(boot.ok(), await boot.text()).toBeTruthy();
  const body = (await boot.json()) as { learnUrl: string };
  await page.goto(body.learnUrl);

  await page.getByRole("button", { name: "Grade 3 Reading & Writing" }).click();
  await page.getByRole("button", { name: "Find where I should start" }).click();

  for (let i = 0; i < 2; i += 1) {
    await page.getByRole("button", { name: "I'll try one" }).click();
    await page.getByRole("button", { name: "Still warm from the fire" }).click();
    await page.getByRole("button", { name: "Continue" }).click();
  }

  await expect(page.getByText("will not guess a grade 2 code")).toBeVisible();
  await expect(page.getByText(/ELA\.2\./)).toHaveCount(0);
  await expect(page.getByRole("button", { name: "I'll try the next one" })).toHaveCount(0);
});
