/**
 * THE single source of truth for the "Mapmaker's Expedition" world bible and
 * chapter spine. Imported by every G3 core subject template AND by
 * `storyCurriculum.ts` when it seeds the six shared chapters for a new
 * learner.
 *
 * Architectural rule (see primer_mvp_spec_v2): there is exactly ONE arc for
 * MVP Grade 3. Subjects are instructional lenses on the same six chapters —
 * not separate plots. Keep this file lens-agnostic.
 */

export const MAPMAKERS_WORLD_TITLE = "Guild Castaway Isles";
export const MAPMAKERS_ARC_TITLE = "The Mapmaker's Expedition";

/**
 * The world bible block injected verbatim into every G3 core session's system
 * prompt. Keep it tight — token budget matters. Things the AI must NEVER
 * reveal in MVP are listed in the "hidden truths" block so the model can
 * foreshadow without spoiling.
 */
export const MAPMAKERS_WORLD_BIBLE = `WORLD BIBLE — "The Mapmaker's Expedition" (stay strictly consistent across all sessions and all subjects)

Setting: Fortuna is a wild, unmapped island on planet Maya, with beaches, flat river plains, hills, forest and inland mountains; no settlements at arrival. The learner and Rho are scouts working for the Merchant Corporation (Merchant Corp). Sergeant Wilhelm, a friendly but stern military man with a mustache, assigned the survey because resources are getting harder to find. They left Maya's mainland base by runway in the same teal/cream/brass fixed-wing twin-prop scout ship to look for possible lumber, oil and rocks containing gold or silver, for the company to collect and sell on other planets. Their job was to explore and report, then build a base and collect resources only if valuable deposits and a safe site were found. Lightning struck the right engine, causing a localized engine fire, loss of power and descent. All seven occupants (captain, Rho and five crew) escaped safely in fictional parachute seats before the empty ship crashed in the shallow bay. At dawn the crew is scattered, no camp has been built, and the repairable ship is wreckage by the beach. The Cartographers' Guild still expects an honest resource report, including water, timber and safe harbors needed by the crew. Do not treat possible deposits as proven finds.

Opening deal: The captain was offered a base, a crew to lead, and ten percent of mission profit, with fifteen and twenty percent counteroffers. Profit means money left after costs in the child-facing story. Reuse the learner's saved STORY_CONTINUITY acceptedShare if present; never assume which offer they accepted or change it. This is a story agreement, not an implemented payout system. The learning-game purpose is explicit: science, math, English and social studies; ask questions, try ideas and learn from mistakes. Practice differs from real checks of learning; never promise faster learning or gates that do not exist.

Protagonist: THE LEARNER is the captain / lead scout. Address them by displayName if available (otherwise "Captain"). The learner drives every meaningful decision. Do NOT take the captain's role from them; do not narrate them as a third-person character making choices.

Sidekick: RHO, the FIRST MATE. Young adult. Loyal, quick with tools, a little nervous about heights, jokes when morale is low. Rho is always at the captain's side across ALL subjects. Rho offers tools, asks clarifying questions, expresses worry or excitement — but Rho NEVER replaces the captain as the hero. If you need a "tutorial voice," it is Rho speaking as first mate, not as a narrator outside the world.

The crew: Young adults. A handful of named survivors (Bosun Mara, Cook Pell, Scout Idi, Carpenter Vey, Signaler Tem). They are scattered in Chapter 1 and gradually recovered through Chapter 3. They have distinct voices but stay supporting cast. Tone: real emotion (fear, frustration, jealousy later) — never gore, never on-screen violence or death.

The Guild: The Cartographers' Guild back home expects a report. Their standards are exacting — measurements must be precise, accounts must be honest. Trust with the Guild is earned over the arc, and the final report is the capstone.

The three-act spine (six chapters, shared across all subjects):
  Act I  — Recover the crew (Ch1 The Wreck, Ch2 Divide the Supplies, Ch3 Search Parties)
  Act II — Survive and build (Ch4 Camp Quartermaster, Ch5 Storm Watch)
  Act III — Rebuild and report (Ch6 Hull Blueprints)

The story rule: Every subject session advances THE SAME story. If the learner switches from math to ELA, the chapter, the camp state, and the crew status are unchanged — only the lens (the kind of work the captain is doing right now) changes.

Wrong-answer rule: Mistakes have NARRATIVE consequence, not a "Try again!" buzzer. A bad ration count means a hungry crew member later; a misread manifest sends scouts the wrong way. Mistakes never become dead ends — they become richer story.

Known premise: Trade between planets is explained in the opening; do not contradict it or pretend space travel is a hidden reveal. The current task remains finding the crew, building camp and repairing the ship. Hidden discoveries (MUST NOT reveal early): the larger landmass and its civilization, rare materials, lithium/battery and later fusion discoveries. Do not invent aliens, settlements on the arrival island or an already-built empire.`;

export interface SubjectChapterPlan {
  targetStandardCodes?: string[];
  investigationQuestions?: string[];
  evidenceExperiences?: string[];
  culminatingTask?: string;
}

export interface ChapterTemplate {
  title: string;
  sharedBeat: string;
  anchorQuestion: string;
  chapterQuestion: string;
  investigationQuestions: string[];
  pathAheadWhisper?: string;
  subjectPlans: Record<string, SubjectChapterPlan>;
}

export const MAPMAKERS_CHAPTERS: ChapterTemplate[] = [
  {
    title: "Chapter 1 — The Wreck",
    sharedBeat:
      "Ship down on the shore. Survey the beach. Account for the crew and the cargo before nightfall.",
    anchorQuestion:
      "How do we assess the wreck and know what we have to work with?",
    chapterQuestion: "What do we need to know before anyone leaves this beach?",
    investigationQuestions: [
      "What can we measure or observe about the wreck and the shoreline?",
      "What does the crew need to survive the first night?",
      "What must we record so the Guild will trust our report later?",
    ],
    pathAheadWhisper:
      "Rho says the tide is coming in fast — whatever isn't measured by sundown might be gone by morning.",
    subjectPlans: {
      math_g3: {
        targetStandardCodes: ["MA.3.NSO.1.1", "MA.3.NSO.1.2"],
        investigationQuestions: [
          "Which unit fits this measurement of the wreck?",
          "How close is our estimate of the salvage pile?",
        ],
        culminatingTask:
          "Complete the wreck-measurement table for the captain's log.",
      },
      ela_g3: {
        targetStandardCodes: ["ELA.3.R.2.2", "ELA.3.C.1.2"],
        culminatingTask:
          "Write the first captain's log page — what happened and what the crew needs.",
      },
      science_g3: {
        culminatingTask:
          "Classify the salvage pile by what spoils, what burns, and what holds water.",
      },
      social_studies_g3: {
        culminatingTask:
          "Read the crew manifest and assign first-night roles fairly.",
      },
    },
  },
  {
    title: "Chapter 2 — Divide the Supplies",
    sharedBeat:
      "Before anyone goes inland: ration the food, the water, and the tools. The crew is watching.",
    anchorQuestion: "How do we divide what we have so everyone makes it through?",
    chapterQuestion:
      "What counts as a fair share when there isn't enough for full rations?",
    investigationQuestions: [
      "How do we split the rations into equal groups?",
      "Which rules does the crew need to hear before we start handing out food?",
      "Which supplies will spoil first and how do we store the rest?",
    ],
    pathAheadWhisper:
      "Cook Pell whispers that someone short-counted the water barrels — Rho thinks the captain should check the math.",
    subjectPlans: {
      math_g3: {
        targetStandardCodes: ["MA.3.NSO.2.2"],
        culminatingTask:
          "Plan a three-day ration split for the surviving crew.",
      },
      ela_g3: {
        targetStandardCodes: ["ELA.3.R.2.1", "ELA.3.C.1.3"],
        culminatingTask:
          "Persuade a hungry crew member in dialogue — give one clear reason from the ration rules.",
      },
      science_g3: {
        culminatingTask:
          "Decide which stores need cold shade and which can stay in the sun.",
      },
      social_studies_g3: {
        culminatingTask:
          "Draft the first camp rule: who decides what is fair when supplies are short.",
      },
    },
  },
  {
    title: "Chapter 3 — Search Parties",
    sharedBeat:
      "Teams head inland to find the missing crew. Maps are rough; the captain assigns the grid.",
    anchorQuestion: "How do we cover this island without losing anyone else?",
    chapterQuestion:
      "How do we know we've actually searched every place that matters?",
    investigationQuestions: [
      "How do we split this map into search grids that don't overlap or leave gaps?",
      "What signs from a trail journal mean the crew was there recently?",
      "What habitat clues say it's safe — or risky — to go further?",
    ],
    pathAheadWhisper:
      "A torn journal page blew across camp this morning. Half a sentence, three words missing — Rho saved it for the captain.",
    subjectPlans: {
      math_g3: {
        targetStandardCodes: ["MA.3.NSO.2.2", "MA.3.NSO.2.3"],
        culminatingTask:
          "Build the search-grid array so every square gets one party.",
      },
      ela_g3: {
        targetStandardCodes: ["ELA.3.R.1.1", "ELA.3.R.3.2"],
        culminatingTask:
          "Read the recovered trail journals and summarize where the missing scout went.",
      },
      science_g3: {
        culminatingTask:
          "Match animal signs to habitat type and warn the search parties.",
      },
      social_studies_g3: {
        culminatingTask:
          "Decide camp rules for what happens if a search party doesn't return by sundown.",
      },
    },
  },
  {
    title: "Chapter 4 — Camp Quartermaster",
    sharedBeat:
      "Raise the village. Trade with anyone you find. Stretch the materials.",
    anchorQuestion: "How do we turn a beach camp into a place that can last?",
    chapterQuestion:
      "Which trades and which builds are worth doing first — and which can wait?",
    investigationQuestions: [
      "How do we budget the materials we have against the materials we still need?",
      "How do we write a trade proposal a stranger would actually agree to?",
      "Which water sources are safe and which need to be tested?",
    ],
    pathAheadWhisper:
      "A trader at the river edge offered Rho twice the rope for half the timber — the captain should look at the deal before sundown.",
    subjectPlans: {
      math_g3: {
        targetStandardCodes: ["MA.3.NSO.2.3"],
        culminatingTask:
          "Write the camp materials budget for the next ten days.",
      },
      ela_g3: {
        targetStandardCodes: ["ELA.3.C.1.4", "ELA.3.R.2.3"],
        culminatingTask:
          "Write a trade proposal the traveling merchant would actually sign.",
      },
      science_g3: {
        culminatingTask:
          "Test each water source and tell the camp which one to drink from.",
      },
      social_studies_g3: {
        culminatingTask:
          "Draft the camp charter — who can trade with outsiders, and under what rules.",
      },
    },
  },
  {
    title: "Chapter 5 — Storm Watch",
    sharedBeat:
      "A storm is coming. Read the signs, protect the camp, decide who shelters where.",
    anchorQuestion:
      "How do we know a storm is coming early enough to do something about it?",
    chapterQuestion:
      "Which signs do we trust, and what do we do the moment we trust them?",
    investigationQuestions: [
      "What does the wind, the tide, and the sky tell us about the next 24 hours?",
      "How do we explain the threat to the crew in a way that does not start a panic?",
      "Who shelters where, and who is in charge of which corner of the camp?",
    ],
    pathAheadWhisper:
      "Signaler Tem says the gulls flew inland before noon — Rho doesn't like what that means.",
    subjectPlans: {
      math_g3: {
        targetStandardCodes: ["MA.3.NSO.1.3"],
        culminatingTask:
          "Read the storm bar graph and predict which day will be the worst.",
      },
      ela_g3: {
        targetStandardCodes: ["ELA.3.C.1.4"],
        culminatingTask:
          "Write the storm bulletin the crew will read at the morning muster.",
      },
      science_g3: {
        culminatingTask:
          "Explain why this stretch of coast floods first, using the camp's own observations.",
      },
      social_studies_g3: {
        culminatingTask:
          "Write the emergency protocol — chain of command from captain down.",
      },
    },
  },
  {
    title: "Chapter 6 — Hull Blueprints",
    sharedBeat:
      "Rebuild the ship from what the island gave you. File the Guild resource report.",
    anchorQuestion:
      "Can we honestly tell the Guild what this island is worth — and sail off it?",
    chapterQuestion:
      "What evidence from the whole expedition does the report need to be trusted?",
    investigationQuestions: [
      "Which measurements, observations, and writings from earlier chapters belong in this report?",
      "How do we justify the resource recommendations we are making to the Guild?",
      "Which materials are strong enough to hold the new hull together?",
    ],
    pathAheadWhisper:
      "The Guild's seal is heavy in the captain's pocket. Rho says: once we file this, there's no taking it back.",
    subjectPlans: {
      math_g3: {
        targetStandardCodes: ["MA.3.NSO.2.1"],
        culminatingTask:
          "Compute the final materials totals for the Guild resource report.",
      },
      ela_g3: {
        targetStandardCodes: ["ELA.3.C.1.4", "ELA.3.R.2.4"],
        culminatingTask:
          "Write the final Guild report and cite at least three pieces of evidence from earlier chapters.",
      },
      science_g3: {
        culminatingTask:
          "Recommend which island materials the Guild should send a second ship to collect.",
      },
      social_studies_g3: {
        culminatingTask:
          "Submit the Guild civic report — what the crew owes the Guild, and what the Guild now owes the crew.",
      },
    },
  },
];
