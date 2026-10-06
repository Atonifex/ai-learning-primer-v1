const fs = require('fs');
const files = ['QuizOverlay','ReflectionOverlay','MissionBoard','MathFiveCheck','SubjectFocusPanel','GardenPlotPanel','GardenTeachPanel','LearningClipPanel'];
for (const name of files) {
  const path = `components/play/${name}.tsx`;
  let source = fs.readFileSync(path, 'utf8');
  if (source.includes('import ActivitySurface')) continue;
  const tags = [...source.matchAll(/<div\b[^>]*>|<\/div>/g)];
  const root = tags.findIndex(match => match[0].includes('inset-0'));
  if (root < 0) throw Error(`Missing root ${name}`);
  let depth = 0, end;
  for (let i = root; i < tags.length; i++) {
    depth += tags[i][0].endsWith('/>') ? 0 : tags[i][0].startsWith('</') ? -1 : 1;
    if (depth === 0) { end = tags[i]; break; }
  }
  if (!end) throw Error(`Missing end ${name}`);
  source = source.slice(0, end.index) + '</ActivitySurface>' + source.slice(end.index + end[0].length);
  const start = tags[root].index;
  source = source.slice(0,start) + '<ActivitySurface' + source.slice(start + 4);
  source = source.replace('"use client";', '"use client";\n\nimport ActivitySurface from "./ActivitySurface";');
  fs.writeFileSync(path,source);
}
let atlas = fs.readFileSync('components/play/WorldMapPanel.tsx','utf8');
atlas = atlas.replace('useEffect, useRef, useState','useState').replace(/  const dialog = useRef<HTMLDialogElement>\(null\);\r?\n/,'').replace(/  useEffect\(\(\) => \{ const el = dialog.current;[^\n]+\n/,'');
atlas = atlas.replace(/<dialog ref=\{dialog\} onCancel=\{[^\n]+?\} className=/,'<section className=').replace('</dialog>','</section>');
fs.writeFileSync('components/play/WorldMapPanel.tsx',atlas);

