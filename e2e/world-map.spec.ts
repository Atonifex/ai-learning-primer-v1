import { expect, test, type Page } from "@playwright/test";
import { buildWorldSnapshot } from "../lib/play/worldMap";
import { decorateMissions } from "../lib/play/missions";

// Real development database + lazy route compilation can take longer than static fixtures.
test.setTimeout(120_000);

async function boot(page: Page) {
  const response = await page.request.post("/api/dev/agent-bootstrap", { data: { open: "dialogue" } });
  expect(response.ok(), await response.text()).toBeTruthy();
  return (await response.json()) as { learnUrl: string; sessionId: string };
}
function fixture() {
  return buildWorldSnapshot({ worldId: "map-test", missions: decorateMissions({ wreckQuizDone: true, chapter1ReflectionDone: false, completedSlugs: new Set(), placementReady: true }),
    chapters: [{ id: "ch1", title: "The first shore", orderIndex: 0, status: "ACTIVE", plannerJson: { chapterQuestion: "How can our supplies help the crew?" } }], tasks: [], notes: [], products: [] });
}

test("real map notes persist after reload; API does not expose quiz answers", async ({ page }) => {
  const session = await boot(page);
  await page.goto(session.learnUrl, { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("play-shell")).toHaveAttribute("data-ready", "true", { timeout: 30000 });
  await page.getByRole("button", { name: "Island map", exact: true }).click();
  const atlas = page.getByTestId("world-map");
  await expect(atlas.getByRole("heading", { name: "Wreck", exact: true })).toBeVisible();
  const prior = await atlas.getByLabel("Captain’s note").inputValue();
  const note = `Keep the dry crates together. Map check ${Date.now()}.`;
  await atlas.getByLabel("Captain’s note").fill(note);
  await atlas.getByRole("button", { name: "Save note", exact: true }).click();
  await expect(atlas.getByText("Note saved on your map.")).toBeVisible({ timeout: 30_000 });
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("play-shell")).toHaveAttribute("data-ready", "true", { timeout: 30000 });
  await page.getByRole("button", { name: "Island map", exact: true }).click();
  await expect(page.getByLabel("Captain’s note")).toHaveValue(note);
  const saved = await page.request.get("/api/world");
  const data = await saved.json();
  expect(data.nodes.find((n: { id: string }) => n.id === "wreck").note).toBe(note);
  expect(JSON.stringify(data)).not.toContain("correctOptionIndex");
  if (prior) await page.request.patch("/api/world", { data: { nodeId: "wreck", note: prior } });
});

test("Rho-generated work updates the map without interrupting chat, survives reload, and opens from camp", async ({ page }) => {
  const session = await boot(page);
  const sessionId = session.learnUrl.split("/learn/")[1].split("?")[0];
  let world = fixture();
  const task = { id: "generated-map-test", title: "Pack six supplies", locationId: "camp", sessionId, completed: false };
  await page.route("**/api/world", (route) => route.fulfill({ json: world }));
  await page.route("**/api/session/*/message", async (route) => {
    const content = route.request().postDataJSON().content as string;
    const events: object[] = [];
    if (content === "Create a supply activity at camp.") {
      world = { ...world, revision: "new-work", nodes: world.nodes.map((n) => n.id === "camp" ? { ...n, tasks: [task] } : n) };
      events.push({ type: "activity_generated", activity: { id: task.id, title: task.title, standardCode: "MA.3.NSO.1.2", instructions: "Choose a pack.", items: [] } }, { type: "world_updated", reason: "New work at Camp", nodeId: "camp" });
    }
    events.push({ type: "text", content: "Your supply work is waiting at camp." }, { type: "done", messageId: "map-reply" });
    await route.fulfill({ contentType: "text/event-stream", body: events.map((e) => `data: ${JSON.stringify(e)}\n\n`).join("") });
  });
  await page.route("**/api/world/activity/generated-map-test", (route) => route.fulfill({ json: { sessionId,
    activity: { id: task.id, title: task.title, standardCode: "MA.3.NSO.1.2", instructions: "Choose a pack.", items: [{ id: "q1", question: "Which pack has six?", options: ["6", "8"] }] } } }));
  await page.route("**/api/session/*/activity/generated-map-test/submit", async (route) => {
    world = { ...world, revision: "completed-work", nodes: world.nodes.map((n) => n.id === "camp" ? { ...n, tasks: [{ ...task, completed: true }] } : n) };
    await route.fulfill({ json: { result: { score: 100, total: 1, correct: 1 } } });
  });
  await page.goto(session.learnUrl, { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("play-shell")).toHaveAttribute("data-ready", "true", { timeout: 30000 });
  await page.getByPlaceholder(/Tell Rho/).fill("Create a supply activity at camp.");
  await page.getByPlaceholder(/Tell Rho/).press("Enter");
  await expect(page.getByRole("button", { name: /New work at Camp/ })).toBeVisible();
  await expect(page.getByTestId("quiz-overlay")).toHaveCount(0);
  await expect(page.getByText("Talking with Rho")).toBeVisible();
  await page.getByRole("button", { name: /New work at Camp/ }).click();
  await expect(page.getByTestId("world-map").getByRole("button", { name: /Pack six supplies/ })).toBeVisible();
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("play-shell")).toHaveAttribute("data-ready", "true", { timeout: 30000 });
  await page.getByRole("button", { name: "Island map", exact: true }).click();
  await page.getByRole("navigation", { name: "Map locations" }).getByRole("button", { name: /^⌂Camp|^Camp/ }).click();
  await page.getByRole("button", { name: /Pack six supplies/ }).click();
  await expect(page.getByTestId("quiz-overlay")).toBeVisible();
  await expect(page.getByText("Talking with Rho")).toHaveCount(0);
  await page.getByRole("button", { name: "Back to map", exact: true }).click();
  await expect(page.getByRole("button", { name: /Pack six supplies/ })).toBeEnabled();
  await page.getByRole("button", { name: /Pack six supplies/ }).click();
  await page.getByRole("radio", { name: "6", exact: true }).check();
  await page.getByRole("button", { name: "Show Rho" }).click();
  await page.getByRole("button", { name: "Back to Rho", exact: true }).click();
  await page.getByRole("button", { name: "Island map", exact: true }).click();
  await expect(page.getByRole("button", { name: /Pack six supplies/ })).toBeDisabled();
});

test("a chapter update reveals a new place and Rho focuses it without a page reload", async ({ page }) => {
  const session = await boot(page);
  let world = fixture();
  await page.route("**/api/world", (route) => route.fulfill({ json: world }));
  await page.route("**/api/session/*/message", async (route) => {
    world = buildWorldSnapshot({ worldId: "map-test", missions: decorateMissions({ wreckQuizDone: true, chapter1ReflectionDone: false, completedSlugs: new Set(), placementReady: true }),
      chapters: [{ id: "chapter-three", title: "Leaves and light", orderIndex: 2, status: "ACTIVE", plannerJson: { chapterQuestion: "Where do young plants thrive?", mapStamps: [{ key: "grove", nodeType: "grove", slot: "ridge-west", title: "Sunlit grove", description: "Compare leaves at the edge of the trees." }] } }], tasks: [], notes: [], products: [] });
    const events = [{ type: "world_updated", reason: "A new chapter is on your map", nodeId: "chapter:chapter-three:grove" },
      { type: "world_map_open", nodeId: "chapter:chapter-three:grove" }, { type: "text", content: "Here is our next place to explore." }, { type: "done", messageId: "chapter-map" }];
    await route.fulfill({ contentType: "text/event-stream", body: events.map((e) => `data: ${JSON.stringify(e)}\n\n`).join("") });
  });
  await page.goto(session.learnUrl, { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("play-shell")).toHaveAttribute("data-ready", "true", { timeout: 30000 });
  await page.getByPlaceholder(/Tell Rho/).fill("Show me the place for our new chapter.");
  await page.getByPlaceholder(/Tell Rho/).press("Enter");
  await expect(page.getByTestId("world-map").getByRole("heading", { name: "Sunlit grove" })).toBeVisible();
  await expect(page.getByText("Where do young plants thrive?")).toBeVisible();
  await expect(page.getByRole("button", { name: "Walk here", exact: true }).last()).toBeEnabled();
  await page.getByRole("button", { name: "Close map" }).click();
  await expect(page.getByText("Talking with Rho")).toBeVisible();
});

test("atlas offers keyboard navigation, walking paths, and a clear return to Rho", async ({ page }) => {
  const session = await boot(page);
  // This is a map/keyboard test: a live Rho turn can reopen dialogue or pause walking.
  await page.route("**/api/session/*/message", (route) => route.fulfill({
    contentType: "text/event-stream",
    body: 'data: {"type":"text","content":"Let us look at the island map."}\n\ndata: {"type":"done","messageId":"atlas-keyboard-reply"}\n\n',
  }));
  await page.route("**/api/world", (route) => route.fulfill({ json: fixture() }));
  await page.goto(session.learnUrl, { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("play-shell")).toHaveAttribute("data-ready", "true", { timeout: 30000 });
  await expect(page.locator("canvas")).toBeVisible({ timeout: 30_000 });
  await page.getByRole("button", { name: "Island map", exact: true }).click();
  await page.getByTestId("world-map").press("Escape");
  await expect(page.getByText("Talking with Rho")).toBeVisible();
  await page.getByRole("button", { name: "Back to beach", exact: true }).click();
  await page.getByRole("button", { name: "Island map", exact: true }).click();
  await page.getByRole("navigation", { name: "Map locations" }).getByRole("button", { name: /Dune/ }).click();
  await page.getByRole("button", { name: "Walk here", exact: true }).last().click();
  await expect(page.getByTestId("world-map")).toHaveCount(0);
  await expect(page.getByText("Walking to Dune…")).toBeVisible();
  await expect(page.getByText("Walking to Dune…")).toHaveCount(0, { timeout: 30_000 });
  await expect(page.getByTestId("captain-position")).toHaveAttribute("transform", "translate(4.5 37.5)");
  await expect(page.getByTestId("quiz-overlay")).toHaveCount(0);
  await page.screenshot({ path: "test-results/living-island.png" });
});

test("mobile atlas stays in viewport and keeps map errors recoverable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const session = await boot(page);
  let fail = true;
  await page.route("**/api/world", (route) => fail ? route.fulfill({ status: 503, json: {} }) : route.fulfill({ json: fixture() }));
  await page.goto(session.learnUrl, { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("play-shell")).toHaveAttribute("data-ready", "true", { timeout: 30000 });
  await page.getByRole("button", { name: "Island map", exact: true }).click();
  await expect(page.getByTestId("world-map").getByRole("alert")).toBeVisible();
  fail = false;
  await page.getByRole("button", { name: "Try again", exact: true }).click();
  await expect(page.getByTestId("world-map").getByRole("heading", { name: "Wreck", exact: true })).toBeVisible();
  await page.getByRole("navigation", { name: "Map locations" }).getByRole("button", { name: /Camp/ }).click();
  await expect(page.getByLabel("Captain’s note")).toBeVisible();
  const bounds = await page.getByTestId("world-map").boundingBox();
  expect(bounds!.x).toBeGreaterThanOrEqual(0); expect(bounds!.width).toBeLessThanOrEqual(390);
  await page.screenshot({ path: "test-results/living-atlas-mobile.png" });
});
