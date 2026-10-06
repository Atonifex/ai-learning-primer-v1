import { expect, test } from "@playwright/test";

test("after the math check, the captain tries the next case and gets feedback", async ({
  page,
}) => {
  test.setTimeout(120_000);
  const boot = await page.request.post("/api/dev/agent-bootstrap", {
    data: { open: "none" },
  });
  expect(boot.ok(), await boot.text()).toBeTruthy();
  const body = (await boot.json()) as { learnUrl: string };
  await page.goto(body.learnUrl, { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("play-shell")).toHaveAttribute("data-ready", "true", { timeout: 30000 });

  await page.getByRole("button", { name: "Focus" }).click();
  await page.getByRole("button", { name: "Grade 3 Math" }).click();
  await page.getByRole("button", { name: "Find where I should start" }).click();
  const check = page.getByTestId("math-five-check");

  const answers = [
    "1,235",
    "3 × 5 = 15",
    "12 thousands + 5 tens",
    "<",
    "476",
  ];
  for (const answer of answers) {
    await check.getByRole("button", { name: answer, exact: true }).click();
  }

  await expect(check.getByText("We'll start with building four-digit numbers.")).toBeVisible();
  await expect(check.getByText("MA.3.NSO.1.2").first()).toBeVisible();
  await check.getByRole("button", { name: "I'll try the next one" }).click();
  await expect(check.getByText("Which is another way to show 3,205?")).toBeVisible();
  await check.getByRole("button", { name: "32 thousands + 5 ones" }).click();
  await expect(check.getByText("The 2 stays in the hundreds place.")).toBeVisible();
});
