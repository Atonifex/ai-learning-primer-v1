import { expect, test, type Page } from "@playwright/test";

async function prototype(page: Page) {
  await page.goto("/dev/dialogue", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("play-shell")).toHaveAttribute("data-ready", "true", { timeout: 30_000 });
  await expect(page.getByTestId("dialogue-dock")).toBeVisible();
}

for (const size of [{ width: 1440, height: 900 }, { width: 1366, height: 768 }, { width: 1024, height: 768 }]) {
  test(`bottom conversation occupies 45% at ${size.width}×${size.height}`, async ({ page }) => {
    await page.setViewportSize(size); await prototype(page);
    const dock = await page.getByTestId("dialogue-dock").boundingBox();
    expect(dock!.height / size.height).toBeGreaterThan(0.42);
    expect(dock!.height / size.height).toBeLessThan(0.48);
    expect(dock!.width).toBe(size.width);
    const picture = await page.getByTestId("speaker-presence").boundingBox();
    expect(picture!.x + picture!.width).toBe(size.width);
    expect(picture!.y + picture!.height).toBe(size.height);
    await expect(page.getByTestId("dialogue-messages")).toContainText("Can we grow food");
    await expect(page.getByTestId("dialogue-messages")).not.toContainText("Earlier exchange");
    await page.getByRole("button", { name: "Show choices", exact: true }).click();
    await page.getByRole("button", { name: "Long reply", exact: true }).click();
    await expect(page.getByRole("button", { name: "Send", exact: true })).toBeVisible();
    await expect(page.getByTestId("captain-choice")).toHaveCount(3);
    const input = page.getByPlaceholder(/Tell Rho/);
    await input.fill("A garden idea worth keeping");
    await page.getByRole("button", { name: "History", exact: true }).click();
    await expect(page.getByTestId("dialogue-history")).toContainText("Earlier exchange 1:");
    await expect(page.getByTestId("dialogue-history")).not.toContainText("[SUBJECT");
    await page.getByRole("button", { name: "Close content panel", exact: true }).click();
    await expect(input).toHaveValue("A garden idea worth keeping");
    const bounds = await input.boundingBox();
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(size.height);
  });
}

test("History retains activity answers and respects a reader during streaming", async ({ page }) => {
  await prototype(page);
  await page.getByRole("button", { name: "Open activity", exact: true }).click();
  await page.getByLabel("Garden plan", { exact: true }).fill("Sunny patch near fresh water");
  await page.getByRole("button", { name: "History", exact: true }).click();
  const history = page.getByTestId("dialogue-history");
  await history.evaluate((element) => { element.scrollTop = 0; element.dispatchEvent(new Event("scroll")); });
  await page.getByRole("button", { name: "Append streaming reply", exact: true }).click();
  await expect.poll(() => history.evaluate((el) => el.scrollTop)).toBe(0);
  await page.getByRole("button", { name: "Close content panel", exact: true }).click();
  await expect(page.getByLabel("Garden plan", { exact: true })).toHaveValue("Sunny patch near fresh water");
  await page.getByRole("button", { name: "Maximize panel", exact: true }).click();
  expect((await page.getByTestId("content-workspace").filter({ visible: true }).boundingBox())!.width).toBeGreaterThan(1200);
  await page.getByRole("button", { name: "Return to Rho", exact: true }).click();
  await expect(page.getByTestId("dialogue-dock")).toBeVisible();
});

test("replacement speaker changes identity and recovers from missing art without inheriting Rho voice", async ({ page }) => {
  await page.route("**/rho_portrait_neutral.webp", (route) => route.abort());
  await prototype(page);
  await expect(page.getByRole("img", { name: "Rho, First Mate (placeholder)", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Change speaker", exact: true }).click();
  await expect(page.getByTestId("speaker-nameplate")).toContainText("Engineer");
  await expect(page.getByRole("img", { name: "Engineer, Speaker fixture", exact: true })).toBeVisible();
  await expect(page.getByPlaceholder(/Tell Engineer/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Hear Rho", exact: true })).toHaveCount(0);
  await expect(page.getByRole("switch", { name: "Automatic reading by Rho" })).toHaveCount(0);
});

for (const size of [{ width: 390, height: 844 }, { width: 768, height: 1024 }, { width: 640, height: 400 }]) {
  test(`adaptive conversation/content and keyboard focus at ${size.width}×${size.height}`, async ({ page }) => {
    await page.setViewportSize(size); await prototype(page);
    await expect(page.getByTestId("play-shell")).toHaveAttribute("data-narrow", "true");
    await page.getByPlaceholder(/Tell Rho/).fill("Keep my draft");
    await page.getByRole("button", { name: "History", exact: true }).click();
    const sheet = page.getByRole("dialog", { name: "Conversation history", exact: true });
    await expect(sheet).toHaveAttribute("aria-modal", "true");
    const bounds = await sheet.boundingBox();
    expect(bounds!.x).toBe(0); expect(bounds!.width).toBe(size.width); expect(bounds!.height).toBe(size.height);
    await page.keyboard.press("Tab");
    await expect.poll(() => sheet.evaluate((el) => el.contains(document.activeElement))).toBe(true);
    await page.keyboard.press("Escape");
    await expect(sheet).toHaveCount(0);
    await expect(page.getByPlaceholder(/Tell Rho/)).toHaveValue("Keep my draft");
    await page.getByRole("button", { name: "Back to beach", exact: true }).click();
    await expect(page.getByTestId("dialogue-dock")).toBeHidden();
    await page.getByRole("button", { name: "Call Rho", exact: true }).click();
    await expect(page.getByPlaceholder(/Tell Rho/)).toHaveValue("Keep my draft");
  });
}

test("real shell keeps the captain visible and the draft through map/content transitions", async ({ page }) => {
  test.setTimeout(120_000);
  const boot = await page.request.post("/api/dev/agent-bootstrap", { data: { open: "dialogue" } });
  expect(boot.ok(), await boot.text()).toBeTruthy();
  const { learnUrl } = await boot.json() as { learnUrl: string };
  await page.goto(learnUrl, { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("play-shell")).toHaveAttribute("data-ready", "true", { timeout: 30_000 });
  const world = page.locator("[data-captain-visible]");
  await expect(world).toHaveAttribute("data-captain-visible", "true");
  const position = await world.getAttribute("data-captain-position");
  const draft = page.getByPlaceholder(/Tell Rho/);
  await draft.fill("Could we investigate the garden?");
  await page.getByRole("button", { name: "Island map", exact: true }).click();
  await expect(page.getByTestId("world-map")).toBeVisible();
  await expect(page.getByTestId("dialogue-dock")).toBeVisible();
  await expect(world).toHaveAttribute("data-captain-visible", "true");
  await page.getByRole("button", { name: "History", exact: true }).click();
  await page.getByRole("button", { name: "Close content panel", exact: true }).click();
  await expect(page.getByTestId("world-map")).toBeVisible();
  await page.getByRole("button", { name: "Close map", exact: false }).click();
  await expect(draft).toHaveValue("Could we investigate the garden?");
  await expect(world).toHaveAttribute("data-captain-position", position!);
  await page.screenshot({ path: "docs/dialogue-dock-preview.png" });
});
