import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const OUT = path.join("test-results", "grok-beta");
fs.mkdirSync(OUT, { recursive: true });

async function shot(page, name) {
  await page.screenshot({ path: path.join(OUT, name), fullPage: true });
}

async function bootstrap(request, open) {
  const res = await request.post("http://localhost:3000/api/dev/agent-bootstrap", {
    data: { open },
  });
  const body = await res.json();
  return { status: res.status(), body };
}

function fullUrl(learnUrl) {
  if (!learnUrl) return null;
  return learnUrl.startsWith("http") ? learnUrl : `http://localhost:3000${learnUrl}`;
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await context.newPage();
const notes = [];

await page.goto("http://localhost:3000/dev/agent", { waitUntil: "networkidle" });
await shot(page, "01-dev-agent.png");
notes.push({ step: "dev-agent", url: page.url(), title: await page.title(), text: (await page.locator("main").innerText()).slice(0, 800) });

const dialogue = await bootstrap(context.request, "dialogue");
notes.push({ step: "bootstrap-dialogue", status: dialogue.status, body: dialogue.body });
if (dialogue.body?.learnUrl) {
  await page.goto(fullUrl(dialogue.body.learnUrl), { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(5000);
  await shot(page, "02-dialogue.png");
  notes.push({ step: "dialogue-loaded", url: page.url(), text: (await page.locator("body").innerText()).slice(0, 1500) });

  const input = page.locator("textarea, input[type='text']").first();
  if (await input.count()) {
    await input.click({ timeout: 5000 }).catch(() => {});
    await input.fill("show the mission board");
    await shot(page, "03-typed-mission-board.png");
    await input.press("Enter");
    await page.waitForTimeout(10000);
    await shot(page, "04-after-mission-board.png");
    notes.push({ step: "after-mission-board", url: page.url(), text: (await page.locator("body").innerText()).slice(0, 2500) });

    await input.fill("wait can we build a fort with lasers lol");
    await input.press("Enter");
    await page.waitForTimeout(10000);
    await shot(page, "05-kid-distract.png");
    notes.push({ step: "kid-distract", text: (await page.locator("body").innerText()).slice(0, 2500) });

    await input.fill("ok fine what am I supposed to do right now");
    await input.press("Enter");
    await page.waitForTimeout(10000);
    await shot(page, "06-what-do-i-do.png");
    notes.push({ step: "what-do-i-do", text: (await page.locator("body").innerText()).slice(0, 2500) });
  } else {
    notes.push({ step: "no-chat-input", url: page.url() });
  }
}

const board = await bootstrap(context.request, "board");
notes.push({ step: "bootstrap-board", status: board.status, body: board.body });
if (board.body?.learnUrl) {
  await page.goto(fullUrl(board.body.learnUrl), { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(5000);
  await shot(page, "07-board.png");
  notes.push({ step: "board-loaded", url: page.url(), text: (await page.locator("body").innerText()).slice(0, 2500) });
}

const clip = await bootstrap(context.request, "clip");
notes.push({ step: "bootstrap-clip", status: clip.status, body: clip.body });
if (clip.body?.learnUrl) {
  await page.goto(fullUrl(clip.body.learnUrl), { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(5000);
  await shot(page, "08-clip.png");
  notes.push({ step: "clip-loaded", url: page.url(), text: (await page.locator("body").innerText()).slice(0, 2500) });
}

const none = await bootstrap(context.request, "none");
notes.push({ step: "bootstrap-none", status: none.status, body: none.body });
if (none.body?.learnUrl) {
  await page.goto(fullUrl(none.body.learnUrl), { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(5000);
  await shot(page, "09-overworld.png");
  notes.push({ step: "overworld-loaded", url: page.url(), text: (await page.locator("body").innerText()).slice(0, 1500) });
}

await page.goto("http://localhost:3000/progress", { waitUntil: "domcontentloaded", timeout: 30000 }).catch(() => {});
await page.waitForTimeout(2500);
await shot(page, "10-progress.png");
notes.push({ step: "progress", url: page.url(), text: (await page.locator("body").innerText()).slice(0, 1500) });

fs.writeFileSync(path.join(OUT, "notes.json"), JSON.stringify(notes, null, 2));
await browser.close();
console.log("DONE", OUT);
