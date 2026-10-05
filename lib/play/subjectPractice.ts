import type { MathDiagnosticItem, MathPlacement } from "./mathDiagnostic";
import type { MathPracticeItem } from "./mathPractice";
import { SUBJECT_CHECK_LADDERS, type SubjectCheckKey } from "./subjectChecks";

/**
 * One try after an ELA, science, or social studies starting point.
 * A different case of the placed code. Not mastery.
 */
export const SUBJECT_PRACTICE: Record<
  Exclude<SubjectCheckKey, "math">,
  readonly MathPracticeItem[]
> = {
  ela: [
    {
      standardCode: "ELA.3.V.1.3",
      example: "The sail was tattered, so tattered means torn and worn.",
      prompt: "The map was faded — pale and hard to read. What does faded mean here?",
      choices: ["Lost its color and grown pale", "Drawn in bright new ink", "Folded into a square"],
      correctIndex: 0,
      rightFeedback: "Pale and hard to read tells you faded means the color has worn away.",
      wrongFeedback: "Use the words beside it. Pale and hard to read means faded, not new ink.",
    },
    {
      standardCode: "ELA.3.R.2.2",
      example:
        "The log lists rain, a leak, and wet flour. Those are details. The central idea is that the supplies got wet.",
      prompt:
        "A note says the path is blocked. A tree is down, and the rope bridge is cut. What is the central idea?",
      choices: ["The crew cannot use that path", "A tree is made of wood", "Someone wrote a note"],
      correctIndex: 0,
      rightFeedback: "The tree and the cut bridge are details. The central idea is that the path is blocked.",
      wrongFeedback: "A tree and a note are details. Together they say the crew cannot use that path.",
    },
    {
      standardCode: "ELA.3.R.2.1",
      example: "The crew moved the crate, so the biscuits stayed dry. That is cause and effect.",
      prompt: "Which sentence tells why the crew lost their shade?",
      choices: [
        "Because the wind tore the tent, the crew had no shade.",
        "The tent was near the trees and the creek.",
        "The crew ate, and the sun set.",
      ],
      correctIndex: 0,
      rightFeedback: "The wind tore the tent, and that is why they had no shade.",
      wrongFeedback: "Look for because. The wind tore the tent, so the crew had no shade.",
    },
  ],
  science: [
    {
      standardCode: "SC.3.P.8.3",
      example: "A red cup and a blue cup can be the same size and still differ in color.",
      prompt: "Which pair differs in shape?",
      choices: ["A round pebble and a long stick", "Two round pebbles", "A gray pebble and another gray pebble"],
      correctIndex: 0,
      rightFeedback: "Round and long are different shapes.",
      wrongFeedback: "Color is not the question. A round pebble and a long stick differ in shape.",
    },
    {
      standardCode: "SC.3.N.1.1",
      example: "We asked a question we can test: which spot on the beach is warmer at noon?",
      prompt: "Which question can the crew investigate?",
      choices: [
        "Does a shell sink faster in a bucket of water than a cork does?",
        "Which shell is the luckiest?",
        "Should the island be famous?",
      ],
      correctIndex: 0,
      rightFeedback: "Sink or float is something the crew can try and watch.",
      wrongFeedback: "A question they can investigate is one they can test. Luck and fame are not tests.",
    },
    {
      standardCode: "SC.3.L.14.1",
      example: "Leaves catch sunlight and make food. Flowers help the plant make seeds.",
      prompt: "Which part holds the plant in the ground and takes in water?",
      choices: ["The roots", "The song of a bird", "The color of the sky"],
      correctIndex: 0,
      rightFeedback: "Roots hold the plant in the ground and take in water.",
      wrongFeedback: "The roots do that job. A bird and the sky are not parts of the plant.",
    },
  ],
  social_studies: [
    {
      standardCode: "SS.3.G.1.1",
      example: "A star on the map is the camp. The legend says so.",
      prompt: "The legend says a triangle is a hill. What does the triangle show?",
      choices: ["A hill", "Every path on the island", "The water in the creek"],
      correctIndex: 0,
      rightFeedback: "The legend tells you the triangle stands for a hill.",
      wrongFeedback: "Read the legend. The triangle is a hill, not every path or the creek.",
    },
    {
      standardCode: "SS.3.E.1.1",
      example: "We have extra fish and no bowls. Another camp has bowls and needs fish.",
      prompt:
        "The crew has extra canvas and no nails. A boat has nails and needs canvas. Why would they trade?",
      choices: [
        "Each side lacks something the other has",
        "Both sides already have canvas and nails",
        "They can trade only if they use coins",
      ],
      correctIndex: 0,
      rightFeedback: "The crew needs nails, and the boat needs canvas. That shortage is why they trade.",
      wrongFeedback: "They do not have the same supplies. Each side is missing what the other can give.",
    },
    {
      standardCode: "SS.3.A.1.1",
      example: "A photo taken at the camp that day is a primary source. A movie made later is not.",
      prompt: "Which source comes from the day of the wreck?",
      choices: [
        "The engineer's sketch made on the beach that afternoon",
        "A textbook chapter about storms written later",
        "A poster for a play about sailors",
      ],
      correctIndex: 0,
      rightFeedback: "The sketch was made that day by someone who was there. That is a primary source.",
      wrongFeedback:
        "A primary source comes from the time. The sketch was made that afternoon. The textbook and the poster came later.",
    },
  ],
};

export function practiceForLadder(
  placement: MathPlacement,
  ladder: readonly MathDiagnosticItem[]
): MathPracticeItem | null {
  if (placement.status !== "ready" && placement.status !== "above_ladder") return null;
  const onLadder = ladder.some((row) => row.standardCode === placement.standardCode);
  if (!onLadder) return null;
  const catalog = Object.values(SUBJECT_PRACTICE).flat();
  return catalog.find((item) => item.standardCode === placement.standardCode) ?? null;
}

export function practiceIsNewCase(
  item: MathPracticeItem,
  ladder: readonly MathDiagnosticItem[]
): boolean {
  const diagnostic = ladder.find((row) => row.standardCode === item.standardCode);
  if (!diagnostic) return false;
  return (
    item.prompt.trim() !== diagnostic.prompt.trim() &&
    item.example.trim() !== diagnostic.example.trim()
  );
}
