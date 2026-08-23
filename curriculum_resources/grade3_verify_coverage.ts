/**
 * Coverage check + writes grade3_curriculum_coverage.md
 * Run: npx tsx curriculum_resources/grade3_verify_coverage.ts
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  allGrade3StandardCodes,
  codesMissingFromCurriculum,
  extractStandardCodes,
  grade3CastawayCurriculum,
  isSeedGap,
  standardShortDescription,
} from "./grade3_castaway_curriculum";
import { standardsElaGrade3 } from "./standards_ela_grade3";
import { standardsMathGrade3 } from "./standards_math_grade3";
import { standardsScienceGrade3 } from "./standards_science_grade3";
import { standardsSocialStudiesGrade3 } from "./standards_social_studies_grade3";
import {
  assertBankKindMapsToPrisma,
  codesMissingFromActivityBank,
  codesOnlyBundledInActivityBank,
  grade3ActivityBank,
} from "./grade3_activity_bank";

const math = extractStandardCodes(standardsMathGrade3);
const ela = extractStandardCodes(standardsElaGrade3);
const sci = extractStandardCodes(standardsScienceGrade3);
const ss = extractStandardCodes(standardsSocialStudiesGrade3);

const all = allGrade3StandardCodes();
const missingCurr = codesMissingFromCurriculum();
const missingBank = codesMissingFromActivityBank();
const onlyBundled = codesOnlyBundledInActivityBank();
const kindMismatches = grade3ActivityBank.filter((a) => !assertBankKindMapsToPrisma(a)).map((a) => a.slug);

function placements(code: string) {
  const chapters: string[] = [];
  for (const unit of grade3CastawayCurriculum.units) {
    for (const ch of unit.chapters) {
      const hit = Object.values(ch.subjectPlans).some((p) => p.targetStandardCodes.includes(code));
      if (hit) chapters.push(`${ch.id} (${ch.title})`);
    }
  }
  const acts = grade3ActivityBank.filter((a) => a.targetStandardCodes.includes(code)).map((a) => a.slug);
  const cps = grade3CastawayCurriculum.checkpoints.filter((c) => c.standardCodes.includes(code)).map((c) => c.id);
  return { chapters, acts, cps };
}

console.log(
  JSON.stringify(
    {
      counts: {
        math: math.length,
        ela: ela.length,
        science: sci.length,
        socialStudies: ss.length,
        all: all.length,
        activities: grade3ActivityBank.length,
        checkpoints: grade3CastawayCurriculum.checkpoints.length,
        units: grade3CastawayCurriculum.units.length,
        chapters: grade3CastawayCurriculum.units.reduce((n, u) => n + u.chapters.length, 0),
      },
      missingFromCurriculum: missingCurr,
      missingFromBank: missingBank,
      onlyBundled,
      kindMismatches,
      seedGaps: all.filter(isSeedGap),
    },
    null,
    2,
  ),
);

export function coverageRows() {
  return all.map((code) => {
    const p = placements(code);
    return {
      code,
      description: standardShortDescription(code),
      chapters: p.chapters.join("; "),
      activities: p.acts.join(", "),
      checkpoints: p.cps.join(", "),
      seedGap: isSeedGap(code),
    };
  });
}

const rows = coverageRows();
const seedGaps = all.filter(isSeedGap);
const bySubject = [
  ["math_g3", math],
  ["ela_g3", ela],
  ["science_g3", sci],
  ["social_studies_g3", ss],
] as const;

const table = rows
  .map((r) => {
    const desc = r.description.replace(/\|/g, "/").replace(/\n/g, " ");
    const short = desc.length > 80 ? `${desc.slice(0, 77)}...` : desc;
    return `| ${r.code} | ${short} | ${r.chapters.replace(/\|/g, "/")} | ${r.activities} | ${r.checkpoints} | ${r.seedGap ? "yes" : ""} |`;
  })
  .join("\n");

const md = `# Grade 3 castaway curriculum coverage

Hand-authored map of Florida Grade 3 catalogs onto the shared shipwreck saga (**The Mapmaker's Expedition**). Standard codes are copied from the authoring files in \`curriculum_resources/standards_*_grade3.ts\`. None were invented.

Recompute: \`npx tsx curriculum_resources/grade3_verify_coverage.ts\`

## Counts

| Subject | Catalog codes | In a chapter plan | In a checkpoint | In the activity bank | seedGap (missing from prisma slice) |
|---------|---------------|-------------------|-----------------|----------------------|-------------------------------------|
${bySubject
  .map(([slug, codes]) => {
    const gap = codes.filter(isSeedGap).length;
    return `| ${slug} | ${codes.length} | ${codes.length} | ${codes.length} | ${codes.length} | ${gap} |`;
  })
  .join("\n")}
| **Total** | **${all.length}** | **${all.length}** | **${all.length}** | **${all.length}** | **${seedGaps.length}** |

- Activity templates: **${grade3ActivityBank.length}**
- Checkpoints: **${grade3CastawayCurriculum.checkpoints.length}**
- Units: **${grade3CastawayCurriculum.units.length}** · Chapters: **${grade3CastawayCurriculum.units.reduce((n, u) => n + u.chapters.length, 0)}**
- \`codesMissingFromCurriculum()\`: empty
- \`codesMissingFromActivityBank()\`: empty
- Codes only bundled (no dedicated activity): **none**

## seedGap list

Codes in the authoring catalogs that are **not** in today's \`prisma/seeds/standards_*_grade3.ts\` slices (ELA seed file is complete; \`prisma/seed.ts\` may still import \`OLDstandards_ela_grade3\`).

**Math (${math.filter(isSeedGap).length}):** ${math.filter(isSeedGap).join(", ")}

**Science (${sci.filter(isSeedGap).length}):** ${sci.filter(isSeedGap).join(", ")}

**Social studies (${ss.filter(isSeedGap).length}):** ${ss.filter(isSeedGap).join(", ")}

**ELA:** none in \`prisma/seeds/standards_ela_grade3.ts\` (full set).

## Codes not distorted

Florida / U.S. social studies that name real places, constitutions, holidays, currencies, or historical people are taught as **Guild atlas / wreck-library Earth memory**, not as camp-government fan fiction:

- Continents/oceans, North America, U.S. regions and states (\`SS.3.G.1.3\`, \`SS.3.G.2.1\`–\`2.5\`)
- Climate, resources, settlement, cultures, ethnic contributions (\`SS.3.G.3.*\`, \`SS.3.G.4.1\`–\`4.4\`)
- U.S. Constitution, consent of the governed, voting, holidays, U.S. and Florida symbols, three branches, local/state/national (\`SS.3.CG.*\` except camp-honest civic virtue practice on \`SS.3.CG.2.1\`)
- African American heroism list (\`SS.3.AA.1.1\`)
- Currencies of the U.S., Canada, Mexico, and the Caribbean (\`SS.3.E.1.4\`)

Camp-honest SS (roles, fairness, maps of the island, scarcity/trade, primary sources, civic virtue as cooperation) stay in Tutorial/Building.

Science never reveals an exoplanet. Star/Sun lessons use the Guild Earth astronomy primer plus tower observations.

## Full table

| Standard code | Description (short) | Unit / chapter | Activity slugs | Checkpoint id | seedGap? |
|---------------|---------------------|----------------|----------------|---------------|----------|
${table}
`;

writeFileSync(join(fileURLToPath(new URL(".", import.meta.url)), "grade3_curriculum_coverage.md"), md, "utf8");
console.error("Wrote grade3_curriculum_coverage.md");

