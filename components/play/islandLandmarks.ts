import { Container, Graphics, Text } from "pixi.js";
import { tileCenter } from "../../lib/play/beachMap";
import type { WorldNode } from "../../lib/play/worldMap";

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
    g.poly([-35, 15, -5, -30, 31, 15]).fill(node.status === "completed" ? 0xbf7149 : 0xc7b58a);
    g.poly([-5, -30, 8, 15, 31, 15]).fill(0xf3deb1);
    g.poly([-17, 15, -4, -10, 7, 15]).fill(0x514b38);
    g.moveTo(-38, 16).lineTo(-5, -32).lineTo(34, 16).stroke({ color: 0x826544, width: 3 });
    g.ellipse(37, 26, 12, 7).fill(0x8d8c76);
    g.poly([30, 27, 35, 10, 40, 20, 43, 13, 45, 27]).fill(node.status === "completed" ? 0xe7a957 : 0x737b63);
  } else if (node.kind === "creek") {
    g.roundRect(-31, -9, 57, 24, 5).fill(0xbb9963);
    for (let i = 0; i < 6; i++) g.moveTo(-26 + i * 9, -8).lineTo(-26 + i * 9, 14).stroke({ color: 0x7d7251, width: 2 });
    g.moveTo(-29, -10).lineTo(26, -10).stroke({ color: 0xe4ce9c, width: 4 });
  } else if (node.kind === "dune") {
    g.ellipse(-3, 8, 39, 17).fill(0xd8bd85);
    g.moveTo(-32, 7).quadraticCurveTo(0, -28, 35, 8).stroke({ color: 0xffe7ae, width: 4 });
    g.moveTo(3, 7).lineTo(3, -35).stroke({ color: 0x8e7850, width: 4 });
    g.poly([4, -35, 31, -30, 23, -16, 4, -19]).fill(0xd98861);
  } else if (node.kind === "treeline" || node.kind === "grove") {
    [-18, 6, 25].forEach((x, i) => {
      g.rect(x - 3, -12, 6, 27).fill(0x79613c);
      g.circle(x, -20 - i * 5, 23).fill(i % 2 ? 0x366847 : 0x4f8557);
      g.circle(x - 6, -29 - i * 5, 13).fill(0x8cb571);
    });
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
