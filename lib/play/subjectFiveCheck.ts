import { SUBJECT_CHECK_LADDERS } from "./subjectChecks";
import type { MathDiagnosticItem } from "./mathDiagnostic";

export type CheckDomain = "ela" | "science" | "social_studies";
export type CheckAnswer = { itemId: string; choiceIndex: number };
type Item = MathDiagnosticItem & { skill: string };

const extras: Record<CheckDomain, [Item, Item, Item]> = {
  ela: [
    { id: "ela-retry", rung: 0, standardCode: "ELA.3.V.1.3", skill: "using clues to understand words", example: "The bag was enormous — bigger than the captain. Enormous means very large.", prompt: "Rho was weary after walking all day. She sat down to rest. What does weary mean?", choices: ["Tired", "Very noisy", "Ready to sprint"], correctIndex: 0 },
    { id: "ela-details", rung: 1, standardCode: "ELA.3.R.2.2", skill: "finding the central idea", example: "A shaded box keeps fruit cool. A lid keeps insects away. Both details support protecting food.", prompt: "The crew raises bags off the sand and ties the lids shut. Both steps keep the food clean. What is the central idea?", choices: ["The sand is white", "The crew protects its food", "Lids are round"], correctIndex: 1 },
    { id: "ela-effect", rung: 2, standardCode: "ELA.3.R.2.1", skill: "connecting causes and effects", example: "A rope snapped, so the flag fell. The snap is the cause; the fall is the effect.", prompt: "Heavy rain filled the path with water, so the captain chose a higher path. What caused the change of path?", choices: ["The captain liked climbing", "The path was too sunny", "Rain filled the lower path with water"], correctIndex: 2 },
  ],
  science: [
    { id: "science-retry", rung: 0, standardCode: "SC.3.P.8.3", skill: "comparing materials", example: "A feather feels soft; a stone feels hard. Hardness is one property we can compare.", prompt: "One shell feels smooth. Another feels rough. Which property is different?", choices: ["Color", "Texture", "Mass"], correctIndex: 1 },
    { id: "science-question", rung: 1, standardCode: "SC.3.N.1.1", skill: "asking questions we can test", example: "We can compare how long equal wet cloths take to dry in two places.", prompt: "The captain wants to learn about shade. Which question can be tested by measuring?", choices: ["Is shade the nicest thing?", "Does shade feel lonely?", "Is the sand cooler in shade than in sunlight?"], correctIndex: 2 },
    { id: "science-leaves", rung: 2, standardCode: "SC.3.L.14.1", skill: "understanding plant parts", example: "Roots anchor a plant and take in water. Each plant part has a job.", prompt: "Which part of a green plant uses sunlight to make food?", choices: ["The leaves", "The soil", "The roots only"], correctIndex: 0 },
  ],
  social_studies: [
    { id: "social-retry", rung: 0, standardCode: "SS.3.G.1.1", skill: "reading a map legend", example: "A star can mean camp when the map legend says so. Symbols depend on the legend.", prompt: "A map legend shows a blue wavy line labeled river. What does that line on the map show?", choices: ["A road", "A fence", "A river"], correctIndex: 2 },
    { id: "social-trade", rung: 1, standardCode: "SS.3.E.1.1", skill: "understanding why people trade", example: "A community may trade extra grain for tools it needs. People cannot make or grow everything in one place.", prompt: "One town grows oranges but needs lumber. Another has lumber but needs fruit. Why might they trade?", choices: ["To get something each town needs", "Because they need exactly the same thing", "Because oranges are a kind of wood"], correctIndex: 0 },
    { id: "social-source", rung: 2, standardCode: "SS.3.A.1.1", skill: "using sources from an event", example: "A diary written during a journey is a primary source. A later article explaining it is a secondary source.", prompt: "Which would be a primary source about the captain's landing?", choices: ["A made-up story about a different island", "A photograph taken during that landing", "A modern textbook about old ships"], correctIndex: 1 },
  ],
};

export function checkDomain(slug: string): CheckDomain | null {
  return /^(ela|science|social_studies)_g[34]$/.test(slug) ? slug.replace(/_g[34]$/, "") as CheckDomain : null;
}

export function subjectCheckItems(domain: CheckDomain): Item[] {
  const base = SUBJECT_CHECK_LADDERS[domain].map((item, index) => {
    const choices = [...item.choices] as [string, string, string];
    // Fixed per-item ordering is stable across reloads and does not reward one position.
    [choices[0], choices[index]] = [choices[index], choices[0]];
    return { ...item, choices, correctIndex: index as 0 | 1 | 2, skill: extras[domain][index].skill };
  });
  return [...base, extras[domain][1], extras[domain][2]];
}

export function scoreSubjectCheck(domain: CheckDomain, answers: CheckAnswer[]) {
  const regular = subjectCheckItems(domain);
  const retry = extras[domain][0];
  const rows: { item: Item; correct: boolean }[] = [];
  let stopped = false;
  for (const answer of answers) {
    if (!answer || typeof answer.itemId !== "string" || !Number.isInteger(answer.choiceIndex) || answer.choiceIndex < 0 || answer.choiceIndex > 2 || stopped || rows.length >= 5) throw new Error("That answer is not part of this check.");
    const path = rows[0]?.correct === false ? [regular[0], retry, regular[1], regular[2], regular[3]] : regular;
    const expected = path[rows.length];
    if (answer.itemId !== expected.id) throw new Error("Please answer the question on screen.");
    rows.push({ item: expected, correct: answer.choiceIndex === expected.correctIndex });
    stopped = rows.length === 2 && rows.every((row) => !row.correct);
  }
  const done = stopped || rows.length === 5;
  const path = rows[0]?.correct === false ? [regular[0], retry, regular[1], regular[2], regular[3]] : regular;
  const missed = rows.find((row, index) => !row.correct && !(index === 0 && rows[1]?.correct));
  const focus = missed?.item ?? regular[2];
  const last = rows.at(-1);
  const item = done ? null : path[rows.length];
  return {
    item: item ? { id: item.id, skill: item.skill, example: item.example, prompt: item.prompt, choices: item.choices } : null,
    done, asked: rows.length, total: 5,
    status: !done ? "in_progress" : stopped ? "needs_support" : missed ? "ready" : "sample_complete",
    focusCode: done ? focus.standardCode : null,
    childLine: !done ? null : stopped ? `Let's build ${focus.skill} together. Use the example, then try with Rho. This does not decide your school grade.` : missed ? `We'll practice ${focus.skill} next.` : "You worked through five different questions. Next, explain one idea to Rho in your own words.",
    feedback: last ? last.correct ? "That works." : `Let's look: ${last.item.choices[last.item.correctIndex]} is the answer. ${last.item.example}` : null,
    evidence: rows.map(({ item: row, correct }) => ({ itemId: row.id, code: row.standardCode, correct })),
  };
}
