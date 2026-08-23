import { COLS, ROWS, tileKind, TUTORIAL_PINS, SPAWN_COL, SPAWN_ROW } from "../lib/play/beachMap";

const pinSet = new Map(TUTORIAL_PINS.map((p) => [`${p.col}:${p.row}`, p.id[0].toUpperCase()]));

let out = "";
for (let r = 0; r < ROWS; r++) {
  let line = "";
  for (let c = 0; c < COLS; c++) {
    if (c === SPAWN_COL && r === SPAWN_ROW) {
      line += "@";
      continue;
    }
    const pinChar = pinSet.get(`${c}:${r}`);
    if (pinChar) {
      line += pinChar;
      continue;
    }
    const k = tileKind(c, r);
    line += k === "water" ? "~" : k === "foam" ? "," : k === "rock" ? "#" : ".";
  }
  out += line + "\n";
}
console.log(out);
