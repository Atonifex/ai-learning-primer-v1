import { expect, test } from "@playwright/test";

test.setTimeout(120_000);

test("Rho decision buttons appear from captain_choices and send a decodeable pick", async ({
  page,
}) => {
  let posted: string | null = null;
  let turn = 0;

  await page.route("**/api/session/*/message", async (route) => {
    if (route.request().method() !== "POST") {
      await route.continue();
      return;
    }
    const body = route.request().postDataJSON() as { content?: string };
    posted = typeof body.content === "string" ? body.content : null;
    turn += 1;

    const events: object[] =
      turn === 1
        ? [
            {
              type: "captain_choices",
              prompt: "Where do we look first?",
              options: [
                { id: "A", label: "Check the wreck" },
                { id: "B", label: "Walk inland" },
                { id: "C", label: "Listen for the radio" },
              ],
            },
            { type: "text", content: "Captain, pick one path." },
            { type: "done", messageId: "choice-ask" },
          ]
        : [
            { type: "text", content: "Wreck it is — I'll follow your lead." },
            { type: "done", messageId: "choice-ack" },
          ];

    await route.fulfill({
      status: 200,
      headers: { "Content-Type": "text/event-stream" },
      body: events.map((e) => `data: ${JSON.stringify(e)}\n\n`).join(""),
    });
  });

  const boot = await page.request.post("/api/dev/agent-bootstrap", {
    data: { open: "dialogue" },
  });
  expect(boot.ok(), await boot.text()).toBeTruthy();
  const { learnUrl } = (await boot.json()) as { learnUrl: string };

  await page.goto(learnUrl, { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("play-shell")).toHaveAttribute("data-ready", "true", {
    timeout: 30_000,
  });
  await expect(page.getByText("Talking with Rho")).toBeVisible();

  await page.getByPlaceholder(/Tell Rho/).fill("What should we decide?");
  await page.getByPlaceholder(/Tell Rho/).press("Enter");

  const panel = page.getByTestId("captain-choice-panel");
  await expect(panel).toBeVisible();
  await expect(panel.getByText("Where do we look first?")).toBeVisible();
  await expect(page.getByTestId("captain-choice")).toHaveCount(3);

  await page.getByTestId("captain-choice").filter({ hasText: "Check the wreck" }).click();
  await expect(panel).toHaveCount(0);
  expect(posted).toBe("I choose A — Check the wreck");
  await expect(page.getByText("I choose A — Check the wreck")).toBeVisible();
  await expect(page.getByText("Wreck it is — I'll follow your lead.")).toBeVisible();
});
