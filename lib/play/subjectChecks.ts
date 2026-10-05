import {
  MATH_DIAGNOSTIC_LADDER,
  type MathDiagnosticItem,
} from "./mathDiagnostic";

/** Same placement engine as math. Codes are the seeded Grade 3 tonight slice only. */
export const SUBJECT_CHECK_LADDERS = {
  math: MATH_DIAGNOSTIC_LADDER,
  ela: [
    {
      id: "ela-v-1-3-context",
      rung: 0,
      standardCode: "ELA.3.V.1.3",
      example: "The crate was sealed, so sealed means closed tight.",
      prompt: "The biscuits were stale — hard and dry. What does stale mean here?",
      choices: ["No longer fresh", "Still warm from the fire", "Stacked in a tall pile"],
      correctIndex: 0,
    },
    {
      id: "ela-r-2-2-central",
      rung: 1,
      standardCode: "ELA.3.R.2.2",
      example:
        "The note says the food will spoil. The sun and the open crate are details. The central idea is that the food is at risk.",
      prompt:
        "A log says the crew needs shade. The sun is high, and the tent is torn. What is the central idea?",
      choices: ["The crew needs shelter from the sun", "The tent is a kind of cloth", "Someone wrote a log"],
      correctIndex: 0,
    },
    {
      id: "ela-r-2-1-structure",
      rung: 2,
      standardCode: "ELA.3.R.2.1",
      example: "Because the crate was open, rain got in. That structure is cause and effect.",
      prompt: "Which sentence shows cause and effect?",
      choices: [
        "Because the rain soaked the biscuits, the crew could not eat them.",
        "The biscuits were in a crate on the sand.",
        "First the crew walked, and then they sat.",
      ],
      correctIndex: 0,
    },
  ],
  science: [
    {
      id: "sci-p-8-3-properties",
      rung: 0,
      standardCode: "SC.3.P.8.3",
      example: "A smooth gray stone and a rough gray stone differ in texture.",
      prompt: "Which pair differs in hardness?",
      choices: ["A soft sponge and a hard shell", "Two shells that are both hard", "A blue shell and another blue shell"],
      correctIndex: 0,
    },
    {
      id: "sci-n-1-1-question",
      rung: 1,
      standardCode: "SC.3.N.1.1",
      example: "We watched a crate in the sun and asked: does the sun make it warmer?",
      prompt: "Which question can the crew investigate on the beach?",
      choices: [
        "Does a wet towel dry faster in the sun than in the shade?",
        "Is this the best island in the world?",
        "What color does the towel like most?",
      ],
      correctIndex: 0,
    },
    {
      id: "sci-l-14-1-plants",
      rung: 2,
      standardCode: "SC.3.L.14.1",
      example: "Roots take in water. Leaves make food for the plant.",
      prompt: "Which part carries water up from the roots?",
      choices: ["The stem", "The color of the flower", "The sand under the plant"],
      correctIndex: 0,
    },
  ],
  social_studies: [
    {
      id: "ss-g-1-1-map",
      rung: 0,
      standardCode: "SS.3.G.1.1",
      example: "On the map, blue stands for water. The legend is how we know.",
      prompt: "The legend says a dotted line is the path to the creek. What is the dotted line?",
      choices: ["The path to the creek", "Every mountain on the island", "The whole ocean"],
      correctIndex: 0,
    },
    {
      id: "ss-e-1-1-scarcity",
      rung: 1,
      standardCode: "SS.3.E.1.1",
      example: "We have extra rope and no fruit. Another camp has fruit and needs rope. Scarcity is why they trade.",
      prompt:
        "The crew has plenty of water and no dry wood. A boat has wood and needs water. Why would they trade?",
      choices: [
        "Each side lacks something the other has",
        "They already have the same supplies",
        "Trade is only for gold coins",
      ],
      correctIndex: 0,
    },
    {
      id: "ss-a-1-1-sources",
      rung: 2,
      standardCode: "SS.3.A.1.1",
      example:
        "A letter the engineer wrote that day is a primary source. A book about the wreck written years later is secondary.",
      prompt: "Which is a primary source for this wreck?",
      choices: [
        "The captain's note written the morning of the wreck",
        "A story about shipwrecks written years later",
        "A drawing of a ship from a different tale",
      ],
      correctIndex: 0,
    },
  ],
} as const satisfies Record<string, readonly MathDiagnosticItem[]>;

export type SubjectCheckKey = keyof typeof SUBJECT_CHECK_LADDERS;

export function subjectCheckKey(subjectSlug: string): SubjectCheckKey | null {
  if (subjectSlug.startsWith("math")) return "math";
  if (subjectSlug.startsWith("ela")) return "ela";
  if (subjectSlug.startsWith("science")) return "science";
  if (subjectSlug.startsWith("social_studies")) return "social_studies";
  return null;
}

export function ladderForSubject(subjectSlug: string): readonly MathDiagnosticItem[] | null {
  const key = subjectCheckKey(subjectSlug);
  return key ? SUBJECT_CHECK_LADDERS[key] : null;
}
