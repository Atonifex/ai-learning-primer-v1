import { expect, test } from "@playwright/test";

test("one learning clip stays on that video and brings the note back", async ({ page }) => {
  await page.route("**/api/session/**/message", async (route) => {
    if (route.request().method() !== "POST") {
      await route.continue();
      return;
    }
    await route.fulfill({
      status: 200,
      headers: { "Content-Type": "text/event-stream" },
      body: [
        `data: ${JSON.stringify({ type: "text", content: "That helps the camp." })}`,
        "",
        `data: ${JSON.stringify({ type: "done", messageId: "clip-reply" })}`,
        "",
        "",
      ].join("\n"),
    });
  });

  const boot = await page.request.post("/api/dev/agent-bootstrap", {
    data: { open: "clip" },
  });
  expect(boot.ok(), await boot.text()).toBeTruthy();
  const body = (await boot.json()) as { learnUrl: string };
  expect(body.learnUrl).toContain("clip=1");

  await page.goto(body.learnUrl);
  await expect(page.getByRole("heading", { name: "One clip for the mission" })).toBeVisible();
  await expect(page.getByText("Fraction basics")).toBeVisible();
  await expect(page.getByText("What do you want to work on?")).toHaveCount(0);

  await page.getByRole("button", { name: "Watch this clip" }).click();
  const frame = page.locator("iframe");
  await expect(frame).toHaveCount(1);
  await expect(frame).toHaveAttribute("src", /youtube-nocookie\.com\/embed\/jgWqSjgMAtw/);
  await expect(frame).toHaveAttribute("src", /[?&]rel=0/);
  await expect(frame).toHaveAttribute("src", /[?&]fs=0/);

  await page.getByRole("button", { name: "I've seen enough" }).click();
  await expect(page.locator("iframe")).toHaveCount(0);

  const note = "Equal pieces let us share the rations fairly.";
  await page.getByLabel("What helps the mission?").fill(note);
  await page.getByRole("button", { name: "Bring this back" }).click();
  await expect(page.getByText(note)).toBeVisible();
  await expect(page.getByRole("heading", { name: "One clip for the mission" })).toHaveCount(0);
});
