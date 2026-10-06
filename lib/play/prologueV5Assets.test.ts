import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { INTRO_MEDIA_ROOT } from "./introDeal";

const directory = resolve(process.cwd(), "public" + INTRO_MEDIA_ROOT);
const json = (name: string) => JSON.parse(readFileSync(resolve(directory, name), "utf8"));
const normalized = (text: string) => text.toLowerCase().replace(/[^a-z0-9]/g, "");
const seconds = (stamp: string) => stamp.split(":").reduce((sum, part) => sum * 60 + Number(part), 0);

describe("released Maya opening", () => {
  it("ships only reviewed footage within the size and paid-retake limits", () => {
    const manifest = json("shots.json");
    expect(json("exports.json").complete).toBe(true);
    expect(manifest.crewCount).toBe(7);
    for (const shot of manifest.scenes) {
      expect(shot.status, shot.id).toBe("reviewed");
      expect(shot.retries, shot.id).toBeLessThanOrEqual(2);
      expect(shot.speechVerification ?? "", shot.id).not.toMatch(/^pending/);
    }
    const audit = json("media-audit.json");
    expect(audit.tooLarge).toEqual([]);
    for (const file of readdirSync(directory, { recursive: true }).filter(name => String(name).endsWith(".mp4"))) {
      expect(statSync(resolve(directory, String(file))).size, String(file)).toBeLessThan(80_000_000);
    }
  });

  it("keeps every spoken line editable, ordered and readable", () => {
    const manifest = json("shots.json");
    const exports = json("exports.json").summary;
    for (const [name, ids] of Object.entries(manifest.edits) as [string, string[]][]) {
      const text = readFileSync(resolve(directory, name + ".en.vtt"), "utf8").replace(/\r/g, "");
      const cues = text.split(/\n\n+/).filter(block => / --> /.test(block));
      let previousEnd = 0;
      const byShot = new Map<string, string[]>();
      for (const block of cues) {
        const [id, timing, ...lines] = block.trim().split("\n");
        const [start, end] = timing.split(" --> ").map(seconds);
        expect(start, id).toBeGreaterThanOrEqual(previousEnd);
        expect(end, id).toBeGreaterThan(start);
        expect(end, id).toBeLessThanOrEqual(exports.find((item: { name: string }) => item.name === name).duration + 0.001);
        expect(lines.length, id).toBeLessThanOrEqual(2);
        for (const line of lines) expect(line.length, id).toBeLessThanOrEqual(48);
        if (!id.endsWith("-sound")) {
          const shot = id.replace(/-\d+$/, "");
          byShot.set(shot, [...(byShot.get(shot) ?? []), ...lines]);
        }
        previousEnd = end;
      }
      for (const id of ids) {
        const shot = manifest.scenes.find((item: { id: string }) => item.id === id);
        if (shot.line) expect(normalized((byShot.get(id) ?? []).join(" ")), id).toBe(normalized(shot.line));
      }
    }
  });
});
