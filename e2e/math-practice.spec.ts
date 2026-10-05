import { expect, test } from "@playwright/test";

const DIAGNOSTIC_ANSWERS = [
  "1,235",
  "1,235",
  "3 × 5 = 15",
  "3 × 5 = 15",
  "1 thousand + 2 hundreds + 5 tens",
  "1 thousand + 2 hundreds + 5 tens",
];

test("after the math check, the captain tries the next case and gets feedback", async ({
  page,
}) => {
  const boot = await page.request.post("/api/dev/agent-bootstrap", {
    data: { open: "none" },
  });
  expect(boot.ok(), await boot.text()).toBeTruthy();
  const body = (await boot.json()) as { learnUrl: string };
  await page.goto(body.learnUrl);

  await page.getByRole("button", { name: "Grade 3 Math" }).click();
  await page.getByRole("button", { name: "Find where I should start" }).click();

  for (const answer of DIAGNOSTIC_ANSWERS) {
    await page.getByRole("button", { name: "I'll try one" }).click();
    await page.getByRole("button", { name: answer }).click();
    await page.getByRole("button", { name: "Continue" }).click();
  }

  await expect(page.getByText("This Grade 3 ladder is solid, through MA.3.NSO.1.2.")).toBeVisible();
  await expect(page.getByText("Which is another way to show 1,250?")).toHaveCount(0);
  await page.getByRole("button", { name: "I'll try the next one" }).click();
  await expect(page.getByText("Which is another way to show 3,205?")).toBeVisible();
  await page.getByRole("button", { name: "32 thousands + 5 ones" }).click();
  await expect(page.getByText("The 2 stays in the hundreds place.")).toBeVisible();
});
