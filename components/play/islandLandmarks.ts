import { Container, Graphics, Text } from "pixi.js";
import { tileCenter } from "../../lib/play/beachMap";
import type { CampStage } from "../../lib/play/camp";
import type { WorldNode } from "../../lib/play/worldMap";

function drawCamp(g: Graphics, stage: CampStage) {
  g.ellipse(2, 18, 36, 12).fill({ color: 0x173f3c, alpha: 0.17 });
  g.ellipse(0, 16, 28, 10).fill(0xd7c08a);
  if (stage === "clearing") {
    g.circle(-12, 14, 4).fill(0x8d7a55);
    g.circle(6, 12, 3).fill(0x9a8660);
    g.circle(16, 16, 4).fill(0x7d6b4a);
    return;
  }
  g.roundRect(-28, 6, 16, 14, 2).fill(0xb69259).stroke({ color: 0x745839, width: 2 });
  g.roundRect(-10, 8, 14, 12, 2).fill(0xc4a06a).stroke({ color: 0x745839, width: 2 });
  g.roundRect(6, 7, 12, 13, 2).fill(0xa98452).stroke({ color: 0x745839, width: 2 });
  if (stage === "crates") return;
  g.poly([-35, 15, -5, -30, 31, 15]).fill(0xbf7149);
  g.poly([-5, -30, 8, 15, 31, 15]).fill(0xf3deb1);
  g.poly([-17, 15, -4, -10, 7, 15]).fill(0x514b38);
  g.moveTo(-38, 16).lineTo(-5, -32).lineTo(34, 16).stroke({ color: 0x826544, width: 3 });
  if (stage === "tent") {
    g.ellipse(37, 26, 12, 7).fill(0x8d8c76);
    return;
  }
  g.ellipse(37, 26, 12, 7).fill(0x5c4030);
  g.poly([30, 27, 35, 10, 40, 20, 43, 13, 45, 27]).fill(0xe7a957);
}

export function createLandmark(node: WorldNode, onSelect: () => void) {
  const group = new Container(), g = new Graphics();
  const p = tileCenter(node.col, node.row); group.position.set(p.x, p.y); group.addChild(g);
  g.ellipse(4, 10, 38, 14).fill({ color: 0x173f3c, alpha: .17 });
  if (node.kind === "wreck") {
    g.poly([-40, -6, -28, -24, 22, -15, 42, 14, 10, 27, -26, 18]).fill(0x77533c).stroke({ color: 0x4b4234, width: 3 });
    for (let i = 0; i < 5; i++) g.moveTo(-25 + i * 12, -16).lineTo(-13 + i * 11, 18).stroke({ color: 0xbe9362, width: 3 });
    g.moveTo(-9, 3).lineTo(0, -52).stroke({ color: 0x684e39, width: 5 });
    g.poly([0, -51, 28, -37, 0, -24]).fill(0xf3e6bd);
    g.roundRect(-44, 10, 18, 17, 3).fill(0xb69259).stroke({ color: 0x745839, width: 2 });
  } else if (node.kind === "camp" || node.kind === "shelter") {
    drawCamp(g, node.kind === "camp" ? (node.campStage ?? "clearing") : "tent");
  } else if (node.kind === "treeline" || node.kind === "grove") {
    [-18, 6, 25].forEach((x, i) => {
      g.rect(x - 3, -12, 6, 27).fill(0x79613c);
      g.circle(x, -20 - i * 5, 23).fill(i % 2 ? 0x366847 : 0x4f8557);
      g.circle(x - 6, -29 - i * 5, 13).fill(0x8cb571);
    });
    if (node.gardenVisual && node.gardenVisual !== "none") {
      const healthy = node.gardenVisual === "healthy";
      const bed = healthy ? 0x6b8f3a : 0x8a7a45;
      const sprout = healthy ? 0x9fd36a : 0xc4b07a;
      [-22, -4, 14].forEach((x, i) => {
        g.roundRect(x, 18, 14, 8, 2).fill(bed).stroke({ color: 0x5a4a32, width: 1 });
        g.moveTo(x + 7, 18).lineTo(x + 7, 10 - i).stroke({ color: 0x6a5538, width: 2 });
        g.circle(x + 7, 8 - i, 4).fill(sprout);
      });
    }
  } else {
    g.poly([-24, 17, -3, -24, 23, 17]).fill(0x859789);
    g.poly([-3, -24, 23, 17, 5, 10]).fill(0xaabc9d);
    g.moveTo(0, -16).lineTo(0, -50).stroke({ color: 0x6b6245, width: 3 });
    g.poly([1, -50, 24, -44, 1, -36]).fill(0xe7835f);
  }
  const badge = new Text({ text: node.status === "locked" ? "·" : node.status === "completed" ? "✓" : node.tasks.some((t) => !t.completed) ? "✧" : "", style: { fontFamily: "Arial", fontSize: 17, fill: 0xfff5d5 } });
  badge.position.set(28, -43);
  if (badge.text) { g.circle(35, -34, 12).fill(node.status === "locked" ? 0x62756c : 0x285d57); group.addChild(badge); }
  const label = new Text({ text: node.title.length > 28 ? node.title.slice(0, 26) + "…" : node.title, style: { fontFamily: "Georgia", fontSize: 14, fill: 0xfff4d6 } });
  label.anchor.set(.5, 0); label.y = 34;
  g.roundRect(-label.width / 2 - 10, 30, label.width + 20, 24, 9).fill({ color: 0x1c4947, alpha: .92 });
  group.addChild(label); group.eventMode = "static"; group.cursor = "pointer";
  group.on("pointertap", (e) => { e.stopPropagation(); onSelect(); });
  return group;
}
