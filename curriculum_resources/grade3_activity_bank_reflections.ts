import type { ActivityTemplate } from "../prisma/seeds/activities/types";
import { grade3CastawayCurriculum } from "./grade3_castaway_curriculum";

function a(partial: Omit<ActivityTemplate, "authoring">): ActivityTemplate {
  return { authoring: "HAND_AUTHORED", ...partial };
}

const reflectSkin =
  "Bind displayName as Captain. The child writes for the crew (ostensible) and the parent can read it later. Rho may prompt, never ghostwrite.";

export const chapterReflections: ActivityTemplate[] = grade3CastawayCurriculum.units.flatMap((unit) =>
  unit.chapters.map((chapter) =>
    a({
      slug: `g3-reflect-${chapter.id}`,
      title: `Crew log: ${chapter.title}`,
      kind: "CHAPTER_REFLECTION",
      prismaKind: "JOURNAL_PROMPT",
      subjectSlug: "ela_g3",
      targetStandardCodes: ["ELA.3.C.1.4"],
      chapterId: chapter.id,
      unitId: unit.id,
      prompt: `Captain, write a chapter reflection the crew can hear at muster. Answer the chapter question in your own words: "${chapter.chapterQuestion}" Include one thing you measured or observed, one decision you made, and one question still open. This does not replace the dedicated writing activities for ELA.3.C.1.4.`,
      scaffoldHints: [
        "Start with the chapter question.",
        "Point to a real camp detail (a number, a map mark, a source).",
        "End with what we should do next.",
      ],
      answerRubric:
        "Addresses the chapter question; includes evidence from the chapter's work; complete thoughts. Completion-oriented for MVP, not a numeric ELA score.",
      storySkinNotes: reflectSkin + ` Shared beat: ${chapter.sharedBeat}`,
      estimatedMinutes: 10,
    }),
  ),
);

export const checkpointTestActivities: ActivityTemplate[] = grade3CastawayCurriculum.checkpoints.map((cp) =>
  a({
    slug: `g3-test-${cp.id}`,
    title: cp.title,
    kind: "CHECKPOINT_TEST",
    prismaKind: "CHALLENGE",
    subjectSlug: cp.subjectSlug,
    targetStandardCodes: cp.standardCodes,
    chapterId: cp.chapterId,
    unitId: cp.unitId,
    prompt: `Guild inspection. This test mirrors a school checkpoint — not a trivia skin. Work each item. Show thinking on constructed-response items. In-game reward if you finish with honest work: ${cp.inGameReward}`,
    scaffoldHints: [
      "Read the whole item before answering.",
      "For multiple choice, eliminate wild options first.",
      "A missed item becomes a story consequence later, not a dead end.",
    ],
    answerRubric: `Measures: ${cp.standardCodes.join(", ")}. Score per item against the curriculum checkpoint blueprints in grade3_castaway_curriculum.ts (${cp.id}).`,
    storySkinNotes:
      "Present as a Guild inspector (clipboard, exacting, never cruel). Bind captain name. No gore. Afterward, grant the listed in-game reward.",
    estimatedMinutes: Math.min(25, 8 + cp.itemBlueprints.length * 2),
    quizItems: cp.itemBlueprints.map((item) =>
      item.itemType === "multiple_choice"
        ? {
            itemType: "multiple_choice" as const,
            prompt: `[${item.standardCodes.join(", ")}] ${item.stem}`,
            choices: ["See inspector packet (full choices instantiated by the module)", "—", "—", "—"],
            correctIndex: 0,
          }
        : {
            itemType: "free_response" as const,
            prompt: `[${item.standardCodes.join(", ")}] ${item.stem}`,
            sampleAnswer: item.notes ?? "Score from checkpoint blueprint.",
          },
    ),
  }),
);
