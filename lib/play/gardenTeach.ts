/**
 * Authored Treeline teach/practice beats before the garden apply mini-game.
 * SC.3.L.17.2 — learner goal: What plants need to grow.
 */

import { GARDEN_LEARNER_GOAL, GARDEN_STANDARD_CODE } from "./gardenPlot";

export { GARDEN_LEARNER_GOAL, GARDEN_STANDARD_CODE };

export type TeachBeatKind = "hook" | "model" | "practice" | "revise" | "ready";

export type TeachChoice = {
  id: string;
  label: string;
  correct: boolean;
  feedback: string;
};

export type TeachBeat = {
  id: string;
  kind: TeachBeatKind;
  title: string;
  body: string;
  /** Optional multiple-choice; omit for continue-only beats. */
  choices?: TeachChoice[];
  continueLabel: string;
};

export const GARDEN_TEACH_BEATS: readonly TeachBeat[] = [
  {
    id: "hook",
    kind: "hook",
    title: "We need a garden",
    body:
      "Food will not last. We brought no garden plants on the ship. Wild green shoots grow at the Treeline — but if we dig beds in the wrong place, the plants will die and we waste rations. First we learn what plants need to grow.",
    continueLabel: "What do plants need?",
  },
  {
    id: "model",
    kind: "model",
    title: "Sun, air, and water",
    body:
      "Plants make their own food. They use energy from the Sun, air, and fresh water. They do not eat biscuits or dirt the way we eat meals. A shoot in bright sun with fresh water can make food. A shoot in the dark or in salty ocean spray cannot.",
    continueLabel: "Try a few cases",
  },
  {
    id: "case-dark",
    kind: "practice",
    title: "Dark crate",
    body: "A seedling sits inside a closed dark crate. Fresh water is in a cup beside it. Will it make food well?",
    choices: [
      {
        id: "yes",
        label: "Yes — it has water",
        correct: false,
        feedback: "Water helps, but without Sun energy the plant cannot make its food.",
      },
      {
        id: "no",
        label: "No — it lacks Sun light",
        correct: true,
        feedback: "Right. Plants need energy from the Sun to make food.",
      },
    ],
    continueLabel: "Next case",
  },
  {
    id: "case-salt",
    kind: "practice",
    title: "Ocean spray",
    body: "A shoot grows in full sun on the beach, but waves splash salty ocean water on it. Is this a good spot?",
    choices: [
      {
        id: "good",
        label: "Good — it has lots of sun",
        correct: false,
        feedback: "Sun helps, but plants need fresh water, not salt water.",
      },
      {
        id: "bad",
        label: "Bad — salt water is not fresh water",
        correct: true,
        feedback: "Yes. Ocean spray is salty. Plants need fresh water.",
      },
    ],
    continueLabel: "Next case",
  },
  {
    id: "case-creek",
    kind: "practice",
    title: "Creek in the sun",
    body: "Green shoots stand by a freshwater creek in open sun and open air. What should we expect?",
    choices: [
      {
        id: "food",
        label: "They can make their own food",
        correct: true,
        feedback: "Sun, air, and fresh water — plants can make food here.",
      },
      {
        id: "biscuit",
        label: "We must feed them biscuits",
        correct: false,
        feedback: "Plants make their own food. Biscuits are for the crew, not plant food-making.",
      },
    ],
    continueLabel: "One more",
  },
  {
    id: "revise-dirt",
    kind: "revise",
    title: "Cook Pell's idea",
    body: "Pell says, “Plants eat dirt, so soil alone is enough.” What do you tell Pell?",
    choices: [
      {
        id: "dirt",
        label: "Pell is right — dirt is plant food",
        correct: false,
        feedback: "Soil can hold roots, but plants make food with Sun, air, and water — not by eating dirt.",
      },
      {
        id: "sun",
        label: "Plants need Sun, air, and fresh water to make food",
        correct: true,
        feedback: "Exactly. That is what plants need to grow and make their own food.",
      },
    ],
    continueLabel: "Ready to plant",
  },
  {
    id: "ready",
    kind: "ready",
    title: "Plant the garden",
    body:
      "Goal: What plants need to grow. Next you choose real beds on the shore. Pick sunny spots with fresh water — skip salt spray and deep shade.",
    continueLabel: "Open garden beds",
  },
] as const;

export function gardenTeachBeatCount(): number {
  return GARDEN_TEACH_BEATS.length;
}

export function isCorrectTeachChoice(beatId: string, choiceId: string): boolean {
  const beat = GARDEN_TEACH_BEATS.find((b) => b.id === beatId);
  const choice = beat?.choices?.find((c) => c.id === choiceId);
  return Boolean(choice?.correct);
}
