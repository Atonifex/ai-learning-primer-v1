/** Reusable instructional contracts; these guide live turns, not a persisted stage engine. */
export const LEARNING_PROGRESSIONS = {
  inquiry: {
    name: "Observe and investigate",
    stages: "Notice/Observe → Question/Wonder → Predict → Investigate → Explain/Revise → Apply",
    activities: "Investigate means learner work: inspect supplied evidence, compare observations, classify examples, measure, or run an available authored test. Ask what the evidence supports before revising the prediction.",
  },
  modelPractice: {
    name: "Model and practice",
    stages: "Understand the problem → Estimate/Represent → Worked model → Guided practice → Independent practice → Explain/Revise → Apply",
    activities: "Use a diagram, number line, array, table or equation appropriate to the skill. Model one related example aloud, not the learner's assessment answer. Then fade help across new cases. After an error, explain the misconception, let the learner revise, and check a fresh case; do not stop at right/wrong feedback.",
  },
  evidenceCommunication: {
    name: "Interpret and communicate",
    stages: "Encounter a text/source/problem → Question → Interpret with evidence → Compare perspectives or model a response → Compose/Decide → Feedback/Revise → Apply",
    activities: "Learning work includes reading/listening to supplied sources, finding text evidence, comparing accounts, analyzing a worked response, drafting for an audience, or justifying a civic decision. ELA writing tasks need model → supported draft → independent draft and revision. Historical/social claims need sources; a fairness choice is not automatically evidence of a factual standard.",
  },
} as const;

export type LearningProgressionId = keyof typeof LEARNING_PROGRESSIONS;

export function progressionForSubject(subjectSlug: string): LearningProgressionId {
  if (/^math_g[34]$/.test(subjectSlug)) return "modelPractice";
  if (/^science_g[34]$/.test(subjectSlug)) return "inquiry";
  if (/^(ela|social_studies)_g[34]$/.test(subjectSlug)) return "evidenceCommunication";
  throw new Error(`No learning progression registered for ${subjectSlug}`);
}

export function learningProgressionInstructions(subjectSlug: string): string {
  const progression = LEARNING_PROGRESSIONS[progressionForSubject(subjectSlug)];
  return `LEARNING PROGRESSION — ${progression.name}
${progression.stages}
${progression.activities}

Use this as a flexible sequence across turns, not a checklist recited to the captain or seven questions at once. Follow the learner's question within today's subject and chapter; teach missing prerequisites explicitly instead of asking them to discover everything unaided. Skip support already demonstrated, not independent evidence.
These instructions supersede conflicting simplified loops or punitive wrong-answer guidance above. Feedback is specific, with a chance to revise. Do not invent injury, hunger, illness, lost resources or morale penalties for mistakes. Simulated test outcomes follow supplied rules; persistent world changes require an existing successful tool result, never narration alone.
Use only evidence, texts, diagrams, activity tools and standards actually supplied or available. Do not pretend a measurement or experiment happened. Offer an available learning action; when material is missing, explain what is needed.
Keep supported work distinct from an independent check. A guided revision does not prove mastery; use a new application and later retrieval where available, under the existing evidence policy. Never force a written camp note unless writing is the selected learning target. Never claim the whole curriculum is covered by one investigation.`;
}
