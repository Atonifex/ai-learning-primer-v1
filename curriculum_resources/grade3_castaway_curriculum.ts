/**
 * Grade 3 Castaway curriculum — Amplify-shaped map for the shared shipwreck saga.
 * Standard codes are copied from the authoring catalogs. Never invent codes.
 *
 * Subjects are lenses on one story. Later-grade-3 Florida/US-specific social studies
 * live in Guild-archive / Earth-memory chapters (found books), not camp analogs.
 */

import type { SubjectSeed } from "../prisma/seeds/types";
import { standardsElaGrade3 } from "./standards_ela_grade3";
import { standardsMathGrade3 } from "./standards_math_grade3";
import { standardsScienceGrade3 } from "./standards_science_grade3";
import { standardsSocialStudiesGrade3 } from "./standards_social_studies_grade3";

export type SagaPhase = "tutorial" | "building" | "guild" | "enterprise";
export type SubjectSlug = "math_g3" | "ela_g3" | "science_g3" | "social_studies_g3";

export type SubjectPlan = {
  targetStandardCodes: string[];
  investigationQuestions?: string[];
  evidenceExperiences?: string[];
  keyConcepts?: string[];
  culminatingTask: string;
};

export type CurriculumChapter = {
  id: string;
  title: string;
  sagaPhase: SagaPhase;
  sharedBeat: string;
  anchorQuestion: string;
  chapterQuestion: string;
  investigationQuestions: string[];
  subjectPlans: Record<SubjectSlug, SubjectPlan>;
};

export type CheckpointItemBlueprint = {
  itemType: "multiple_choice" | "short_answer" | "constructed_response";
  stem: string;
  standardCodes: string[];
  notes?: string;
};

export type CurriculumCheckpoint = {
  id: string;
  title: string;
  subjectSlug: SubjectSlug;
  chapterId?: string;
  unitId?: string;
  format: "MIXED" | "MULTIPLE_CHOICE" | "SHORT_ANSWER";
  standardCodes: string[];
  itemBlueprints: CheckpointItemBlueprint[];
  inGameReward: string;
};

export type CurriculumUnit = {
  id: string;
  title: string;
  phenomenon: string;
  sagaPhase: SagaPhase;
  chapters: CurriculumChapter[];
};

export type Grade3CastawayCurriculum = {
  worldTitle: "Guild Castaway Isles";
  arcTitle: "The Mapmaker's Expedition";
  units: CurriculumUnit[];
  checkpoints: CurriculumCheckpoint[];
};

/** Codes present today in prisma/seeds/standards_*_grade3.ts (not the OLD ELA file). */
export const PRISMA_SEEDED_GRADE3_CODES: ReadonlySet<string> = new Set([
  // Math N-slice (missing NSO.1.4, NSO.2.4, and all later strands)
  "MA.3.NSO.1.1",
  "MA.3.NSO.1.2",
  "MA.3.NSO.1.3",
  "MA.3.NSO.2.1",
  "MA.3.NSO.2.2",
  "MA.3.NSO.2.3",
  // ELA prisma/seeds/standards_ela_grade3.ts is the full authoring set
  "ELA.3.R.1.1",
  "ELA.3.R.1.2",
  "ELA.3.R.1.3",
  "ELA.3.R.1.4",
  "ELA.3.R.2.1",
  "ELA.3.R.2.2",
  "ELA.3.R.2.3",
  "ELA.3.R.2.4",
  "ELA.3.R.3.1",
  "ELA.3.R.3.2",
  "ELA.3.R.3.3",
  "ELA.3.C.1.1",
  "ELA.3.C.1.2",
  "ELA.3.C.1.3",
  "ELA.3.C.1.4",
  "ELA.3.C.1.5",
  "ELA.3.C.2.1",
  "ELA.3.C.3.1",
  "ELA.3.C.4.1",
  "ELA.3.C.5.1",
  "ELA.3.C.5.2",
  "ELA.3.V.1.1",
  "ELA.3.V.1.2",
  "ELA.3.V.1.3",
  "ELA.3.F.1.3",
  "ELA.3.F.1.4",
  // Science N-slice only
  "SC.3.N.1.1",
  "SC.3.N.1.2",
  "SC.3.N.1.3",
  "SC.3.N.1.4",
  "SC.3.N.1.5",
  "SC.3.N.1.6",
  "SC.3.N.1.7",
  "SC.3.N.3.1",
  "SC.3.N.3.2",
  "SC.3.N.3.3",
  // Social studies first five only
  "SS.3.A.1.1",
  "SS.3.A.1.2",
  "SS.3.A.1.3",
  "SS.3.G.1.1",
  "SS.3.G.1.2",
]);

export function isSeedGap(code: string): boolean {
  return !PRISMA_SEEDED_GRADE3_CODES.has(code);
}

export function extractStandardCodes(seed: SubjectSeed): string[] {
  return seed.catalog.strands.flatMap((strand) =>
    strand.groups.flatMap((group) => group.standards.map((standard) => standard.code)),
  );
}

export function standardShortDescription(code: string): string {
  for (const seed of [standardsMathGrade3, standardsElaGrade3, standardsScienceGrade3, standardsSocialStudiesGrade3]) {
    for (const strand of seed.catalog.strands) {
      for (const group of strand.groups) {
        for (const standard of group.standards) {
          if (standard.code === code) {
            const period = standard.description.indexOf(".");
            const clip = period > 40 && period < 120 ? period + 1 : 90;
            return standard.description.slice(0, clip).trim();
          }
        }
      }
    }
  }
  return "";
}

export function allGrade3StandardCodes(): string[] {
  return [
    ...extractStandardCodes(standardsMathGrade3),
    ...extractStandardCodes(standardsElaGrade3),
    ...extractStandardCodes(standardsScienceGrade3),
    ...extractStandardCodes(standardsSocialStudiesGrade3),
  ];
}

function uniqueCodes(codes: string[]): string[] {
  return [...new Set(codes)];
}

export const grade3CastawayCurriculum: Grade3CastawayCurriculum = {
  worldTitle: "Guild Castaway Isles",
  arcTitle: "The Mapmaker's Expedition",
  units: [
    {
      id: "u1-crash",
      title: "Unit 1 — Crash and First Night",
      sagaPhase: "tutorial",
      phenomenon:
        "The survey ship is wreckage on the sand. Night is coming. The crew is scattered, the cargo is mixed, and nothing is counted.",
      chapters: [
        {
          id: "u1-ch1",
          title: "Chapter 1 — The Wreck",
          sagaPhase: "tutorial",
          sharedBeat:
            "Ship down on the shore. Survey the beach. Account for the crew and the cargo before nightfall.",
          anchorQuestion: "How do we assess the wreck and know what we have to work with?",
          chapterQuestion: "What do we need to know before anyone leaves this beach?",
          investigationQuestions: [
            "What can we measure or observe about the wreck and the shoreline?",
            "What does the crew need to survive the first night?",
            "What must we record so the Guild will trust our report later?",
          ],
          subjectPlans: {
            math_g3: {
              targetStandardCodes: ["MA.3.NSO.1.1", "MA.3.NSO.1.2"],
              investigationQuestions: [
                "How do we write the crate counts so another scout can read them?",
                "Can the same four-digit salvage total be shown as thousands, hundreds, tens, and ones in more than one way?",
              ],
              keyConcepts: [
                "A number can be written in standard, expanded, and word form.",
                "Four-digit numbers can be composed and decomposed by place value.",
              ],
              culminatingTask: "Complete the wreck-count table in standard, expanded, and word form.",
            },
            ela_g3: {
              targetStandardCodes: ["ELA.3.R.2.2", "ELA.3.C.1.2"],
              investigationQuestions: [
                "What is the central idea of the torn sailing log?",
                "How do we tell the first night as a sequence the crew will believe?",
              ],
              keyConcepts: [
                "A central idea is supported by relevant details.",
                "A narrative needs sequence, description, and an ending.",
              ],
              culminatingTask: "Write the first captain's log page — what happened and what the crew needs.",
            },
            science_g3: {
              targetStandardCodes: ["SC.3.N.1.1", "SC.3.N.1.3", "SC.3.P.8.3"],
              investigationQuestions: [
                "Which salvage piles look alike, and which properties set them apart?",
                "What question should we raise before we taste, burn, or stack anything?",
              ],
              keyConcepts: [
                "Scientists ask questions and keep records.",
                "Objects can be compared by size, shape, color, texture, and hardness.",
              ],
              culminatingTask: "Sort the salvage pile by observable properties and record the first-night questions.",
            },
            social_studies_g3: {
              targetStandardCodes: ["SS.3.A.1.1", "SS.3.A.1.3"],
              investigationQuestions: [
                "Which pages are a primary source from the wreck, and which are Rho retelling?",
                "Which social-science words name the work we are doing: history, geography, economics, civics?",
              ],
              keyConcepts: [
                "Primary sources were made at the time; secondary sources retell later.",
                "History, geography, economics, civics, and government are social sciences.",
              ],
              culminatingTask: "Label the wreck papers as primary or secondary and name the social-science job of the first night.",
            },
          },
        },
        {
          id: "u1-ch2",
          title: "Chapter 2 — Divide the Supplies",
          sagaPhase: "tutorial",
          sharedBeat:
            "Before anyone goes inland: ration the food, the water, and the tools. The crew is watching.",
          anchorQuestion: "How do we divide what we have so everyone makes it through?",
          chapterQuestion: "What counts as a fair share when there isn't enough for full rations?",
          investigationQuestions: [
            "How do we split the rations into equal groups?",
            "Which rules does the crew need to hear before we start handing out food?",
            "Which supplies will spoil first, and how do we store the rest?",
          ],
          subjectPlans: {
            math_g3: {
              targetStandardCodes: ["MA.3.NSO.2.2", "MA.3.AR.3.1"],
              investigationQuestions: [
                "How can equal groups show a multiplication or a related division?",
                "If we pair water flasks, how do we know a leftover means an odd count?",
              ],
              keyConcepts: [
                "Multiplication is equal groups; division is the related fact.",
                "Even numbers make pairs; odd numbers leave one leftover.",
              ],
              culminatingTask: "Plan a three-day ration split and mark even/odd leftover flasks.",
            },
            ela_g3: {
              targetStandardCodes: ["ELA.3.R.2.1", "ELA.3.C.1.3"],
              investigationQuestions: [
                "How do headings, lists, and cause/effect in the ration rules help meaning?",
                "What reason, backed by the rules, will persuade a hungry crewmate?",
              ],
              keyConcepts: [
                "Text features and structures (chronology, comparison, cause/effect) carry meaning.",
                "An opinion needs reasons, details from a source, transitions, and a conclusion.",
              ],
              culminatingTask: "Persuade a hungry crew member using one clear reason from the ration rules.",
            },
            science_g3: {
              targetStandardCodes: ["SC.3.P.8.1", "SC.3.E.6.1", "SC.3.N.1.6"],
              investigationQuestions: [
                "Which stores feel hotter after an hour in the sun?",
                "What can we infer about spoilage from temperature, not from guessing?",
              ],
              keyConcepts: [
                "The Sun's radiant energy heats objects; without the Sun, heat may be lost.",
                "Temperature can be measured and compared.",
                "An inference is based on observation.",
              ],
              culminatingTask: "Decide which stores need cold shade and which can stay in the sun, citing temperatures.",
            },
            social_studies_g3: {
              targetStandardCodes: ["SS.3.E.1.1", "SS.3.CG.2.1"],
              investigationQuestions: [
                "What is scarce, and what trade might that force?",
                "What does civility look like when someone wants more than a share?",
              ],
              keyConcepts: [
                "Scarcity can lead to trade.",
                "Citizens (and crew) show civility, cooperation, and volunteerism.",
              ],
              culminatingTask: "Draft the first camp rule: who decides what is fair when supplies are short.",
            },
          },
        },
        {
          id: "u1-ch3",
          title: "Chapter 3 — Search Parties",
          sagaPhase: "tutorial",
          sharedBeat:
            "Teams head inland to find the missing crew. Maps are rough; the captain assigns the grid.",
          anchorQuestion: "How do we cover this island without losing anyone else?",
          chapterQuestion: "How do we know we've actually searched every place that matters?",
          investigationQuestions: [
            "How do we split this map into search grids that don't overlap or leave gaps?",
            "What signs from a trail journal mean the crew was there recently?",
            "What habitat clues say it's safe — or risky — to go further?",
          ],
          subjectPlans: {
            math_g3: {
              targetStandardCodes: ["MA.3.NSO.2.3", "MA.3.NSO.2.4", "MA.3.GR.2.1"],
              investigationQuestions: [
                "If each grid square is 10 paces on a side, how many paces is 6 squares?",
                "How does covering a rectangle with unit squares show area?",
              ],
              keyConcepts: [
                "Multiply a one-digit number by tens or hundreds.",
                "Facts through 12 × 12 have related division facts.",
                "Area is covering a figure with unit squares, no gaps or overlaps.",
              ],
              culminatingTask: "Build the search-grid array so every square gets one party, and count its area in square units.",
            },
            ela_g3: {
              targetStandardCodes: ["ELA.3.R.1.1", "ELA.3.R.3.2"],
              investigationQuestions: [
                "How does Scout Idi change across the recovered journal pages?",
                "What plot and theme belong in a short summary for the search teams?",
              ],
              keyConcepts: [
                "Characters develop through traits, feelings, motivations, and responses.",
                "A literary summary includes plot and theme.",
              ],
              culminatingTask: "Read the recovered trail journals and summarize where the missing scout went.",
            },
            science_g3: {
              targetStandardCodes: ["SC.3.L.15.1", "SC.3.N.1.7"],
              investigationQuestions: [
                "Which animal signs belong to mammals, birds, reptiles, or arthropods?",
                "What observations count as empirical evidence, not just a hunch?",
              ],
              keyConcepts: [
                "Animals can be classified by physical characteristics and behaviors.",
                "Empirical evidence is observation or measurement used to support an explanation.",
              ],
              culminatingTask: "Match animal signs to groups and warn the search parties with evidence, not guesses.",
            },
            social_studies_g3: {
              targetStandardCodes: ["SS.3.G.1.1", "SS.3.G.1.2", "SS.3.G.1.6"],
              investigationQuestions: [
                "Which map elements does this sketch still need?",
                "How do we use scale to tell distance between two search marks?",
              ],
              keyConcepts: [
                "Thematic maps, tables, and photos carry geographic information.",
                "Map elements include title, compass rose, scale, and key.",
                "Scale measures distance between places.",
              ],
              culminatingTask: "Finish the search map's legend, compass, and a scale distance between two marks.",
            },
          },
        },
      ],
    },
    {
      id: "u2-camp",
      title: "Unit 2 — Raise a Living Camp",
      sagaPhase: "building",
      phenomenon:
        "A pile of salvage is not a home. Weather, water, hunger, and messy records will decide if the crew lasts a week.",
      chapters: [
        {
          id: "u2-ch4",
          title: "Chapter 4 — Camp Quartermaster",
          sagaPhase: "building",
          sharedBeat: "Raise the village. Trade with anyone you find. Stretch the materials.",
          anchorQuestion: "How do we turn a beach camp into a place that can last?",
          chapterQuestion: "Which trades and which builds are worth doing first — and which can wait?",
          investigationQuestions: [
            "How do we budget the materials we have against the materials we still need?",
            "How do we write a trade proposal a stranger would actually agree to?",
            "Which stores can we weigh and which only look big?",
          ],
          subjectPlans: {
            math_g3: {
              targetStandardCodes: ["MA.3.NSO.2.1", "MA.3.AR.1.2", "MA.3.DP.1.1"],
              investigationQuestions: [
                "Can we add and subtract the timber totals with a reliable method?",
                "Which two-step story matches the camp budget?",
              ],
              keyConcepts: [
                "Multi-digit addition and subtraction can use a standard algorithm.",
                "Real-world problems may take two steps and any of the four operations.",
                "Data can be shown in tables and scaled graphs with titles and labels.",
              ],
              culminatingTask: "Write the ten-day materials budget and a labeled inventory table or pictograph.",
            },
            ela_g3: {
              targetStandardCodes: ["ELA.3.C.1.4", "ELA.3.R.2.3"],
              investigationQuestions: [
                "What evidence does the merchant's notice actually give?",
                "How do we introduce a trade topic, give facts, and conclude?",
              ],
              keyConcepts: [
                "Expository writing uses sources, facts, transitions, and a conclusion.",
                "Authors support ideas with evidence.",
              ],
              culminatingTask: "Write a trade proposal the traveling merchant would actually sign.",
            },
            science_g3: {
              targetStandardCodes: ["SC.3.P.8.2", "SC.3.N.1.2"],
              investigationQuestions: [
                "Does a bigger crate always have more mass?",
                "Why might two teams get different readings with the same balance?",
              ],
              keyConcepts: [
                "Mass and volume of solids and liquids can be measured and compared.",
                "Different groups may observe differently with the same tools; we seek reasons.",
              ],
              culminatingTask: "Compare mass and volume of two trade lots and explain any team disagreements.",
            },
            social_studies_g3: {
              targetStandardCodes: ["SS.3.A.1.2", "SS.3.E.1.3"],
              investigationQuestions: [
                "How can Signaler Tem's recovered reader help us gather a source?",
                "Who is the buyer and who is the seller in this trade?",
              ],
              keyConcepts: [
                "Technology can gather primary and secondary sources.",
                "Buyers and sellers exchange goods and services with trade or money.",
              ],
              culminatingTask: "Use the recovered reader to pull one source, then name buyer, seller, and what is exchanged.",
            },
          },
        },
        {
          id: "u2-ch5",
          title: "Chapter 5 — Storm Watch",
          sagaPhase: "building",
          sharedBeat: "A storm is coming. Read the signs, protect the camp, decide who shelters where.",
          anchorQuestion: "How do we know a storm is coming early enough to do something about it?",
          chapterQuestion: "Which signs do we trust, and what do we do the moment we trust them?",
          investigationQuestions: [
            "What do the wind counts, the tide marks, and the sky tell us about the next 24 hours?",
            "How do we explain the threat without starting a panic?",
            "Who is on watch at which minute?",
          ],
          subjectPlans: {
            math_g3: {
              targetStandardCodes: ["MA.3.NSO.1.3", "MA.3.M.2.1", "MA.3.M.2.2", "MA.3.DP.1.2"],
              investigationQuestions: [
                "Which day's wind count is greatest on the line plot?",
                "If watch starts at 2:15 p.m. and lasts 40 minutes, when does it end?",
              ],
              keyConcepts: [
                "Whole numbers to 10,000 can be plotted, ordered, and compared with <, >, =.",
                "Time is told to the minute with a.m. and p.m.",
                "Elapsed-time problems can be one or two steps (without crossing a.m./p.m.).",
                "Graphs and tables can be read to solve one- and two-step problems.",
              ],
              culminatingTask: "Read the storm graphs, set the watch clock, and compute elapsed time for two watches.",
            },
            ela_g3: {
              targetStandardCodes: ["ELA.3.C.2.1", "ELA.3.V.1.3"],
              investigationQuestions: [
                "What does 'front' mean in this weather notice — weather or the front of a tent?",
                "How do we present the bulletin in a logical spoken sequence?",
              ],
              keyConcepts: [
                "Context clues and background knowledge unlock multiple-meaning words.",
                "Oral presentation needs sequence, volume, pronunciation, and nonverbal cues.",
              ],
              culminatingTask: "Speak the storm bulletin at morning muster, using context to unpack tricky words.",
            },
            science_g3: {
              targetStandardCodes: ["SC.3.P.10.1", "SC.3.P.10.2", "SC.3.N.1.4"],
              investigationQuestions: [
                "Which forms of energy are in the wind, the lightning-far flash, and the radio crackle?",
                "Why must Signaler Tem share the weather log with the whole crew?",
              ],
              keyConcepts: [
                "Energy appears as light, heat, sound, electrical, and mechanical forms.",
                "Energy can cause motion or create change.",
                "Scientists (and scouts) must communicate results.",
              ],
              culminatingTask: "Name the energy forms in the storm signs and post a shared weather log.",
            },
            social_studies_g3: {
              targetStandardCodes: ["SS.3.G.1.4"],
              investigationQuestions: [
                "Which map type shows height of land, and which shows camp 'territories'?",
                "When do we need a population map from the Guild atlas instead of our beach sketch?",
              ],
              keyConcepts: [
                "Physical, political, elevation, and population maps have different purposes.",
              ],
              culminatingTask:
                "Match four map types to a purpose: island physical, island elevation, Guild-atlas political, Guild-atlas population.",
            },
          },
        },
        {
          id: "u2-ch6",
          title: "Chapter 6 — Springs, Spoilage, and the Garden",
          sagaPhase: "building",
          sharedBeat: "Find drinking water. Watch what the heat does to stores. Plant what can feed the camp.",
          anchorQuestion: "Which water is safe, and what living things can we grow without wrecking the spring?",
          chapterQuestion: "How do heat, water, and plant parts decide whether the camp eats next week?",
          investigationQuestions: [
            "What happens to water when it is heated or cooled?",
            "Which plant parts do which jobs?",
            "Which measuring tool fits length, liquid, or temperature?",
          ],
          subjectPlans: {
            math_g3: {
              targetStandardCodes: ["MA.3.M.1.1", "MA.3.M.1.2"],
              investigationQuestions: [
                "Ruler, beaker, or thermometer — which tool for this job?",
                "If the spring pool drops 3 centimeters, what does that mean for the day's water plan?",
              ],
              keyConcepts: [
                "Choose tools to measure length, liquid volume, and temperature.",
                "Measurement word problems use whole numbers and named units (no conversions required).",
              ],
              culminatingTask: "Measure the spring and the cook-pot, then solve two real measurement problems for Pell.",
            },
            ela_g3: {
              targetStandardCodes: ["ELA.3.R.2.4", "ELA.3.C.4.1"],
              investigationQuestions: [
                "What claim does the water-safety leaflet make, and what evidence supports it?",
                "What question will we research using more than one source?",
              ],
              keyConcepts: [
                "Authors make claims and support them with evidence.",
                "Research answers a question using organized information from multiple sources.",
              ],
              culminatingTask: "Research 'Is this spring safe?' using the leaflet, Pell's notes, and one more source.",
            },
            science_g3: {
              targetStandardCodes: ["SC.3.P.9.1", "SC.3.L.14.1", "SC.3.L.17.2"],
              investigationQuestions: [
                "Where do we see melting, evaporation, or condensation around camp?",
                "How do roots, stems, leaves, and flowers help a plant live?",
                "What do plants need from the Sun, air, and water?",
              ],
              keyConcepts: [
                "Water changes state: melting, freezing, boiling, evaporation, condensation.",
                "Plant structures have roles in food, support, transport, and reproduction.",
                "Plants use energy from the Sun, air, and water to make their own food.",
              ],
              culminatingTask: "Explain the spring's water-cycle signs and plant a garden bed with labeled plant parts.",
            },
            social_studies_g3: {
              targetStandardCodes: ["SS.3.G.1.4"],
              investigationQuestions: [
                "Should the garden map be physical (plants and water) or something else?",
              ],
              keyConcepts: ["Map purpose depends on the question you are asking."],
              culminatingTask: "Choose a map type for the garden and say why that type fits the question.",
            },
          },
        },
      ],
    },
    {
      id: "u3-map",
      title: "Unit 3 — Chart the Unknown",
      sagaPhase: "building",
      phenomenon:
        "The island is larger than the beach. Without true maps, models, and a signal, search parties and builders work blind.",
      chapters: [
        {
          id: "u3-ch7",
          title: "Chapter 7 — Grid, Compass, and the Shape of Trails",
          sagaPhase: "building",
          sharedBeat: "Walk the ridges. Draw the true lines of the land. Compare the paper map to the wreck's globe.",
          anchorQuestion: "How do we draw a map that does not lie about shape and distance?",
          chapterQuestion: "Which lines, shapes, and models help — and where do they fail?",
          investigationQuestions: [
            "Where are parallel trails, perpendicular cuts, and rays of sight from a lookout?",
            "How is a paper map different from a globe?",
            "Can we read the trail markers with accuracy and expression?",
          ],
          subjectPlans: {
            math_g3: {
              targetStandardCodes: ["MA.3.GR.1.1", "MA.3.GR.1.2", "MA.3.GR.1.3"],
              investigationQuestions: [
                "Is this ridge line a ray, a segment, or a pair of parallel lines?",
                "Which camp plots are rectangles, rhombi, or trapezoids?",
                "Does the new flag have a line of symmetry?",
              ],
              keyConcepts: [
                "Points, lines, segments, rays, intersecting, perpendicular, and parallel lines.",
                "Quadrilaterals are named by defining attributes.",
                "Some figures have line symmetry; some have none.",
              ],
              culminatingTask: "Draw the trail map with named lines and classify each camp plot; mark flag symmetry.",
            },
            ela_g3: {
              targetStandardCodes: ["ELA.3.F.1.3", "ELA.3.F.1.4"],
              investigationQuestions: [
                "How do roots and suffixes help us decode 'unmapped' or 'careful'?",
                "Can we read the marker text with accuracy and expression?",
              ],
              keyConcepts: [
                "Phonics and word analysis decode multisyllabic words and affixes.",
                "Fluency is accuracy, automaticity, and prosody.",
              ],
              culminatingTask: "Decode the trail markers, then read one page of the survey log aloud with expression.",
            },
            science_g3: {
              targetStandardCodes: ["SC.3.N.3.2", "SC.3.N.3.3"],
              investigationQuestions: [
                "How is this clay island a model of the real ridges?",
                "What does the clay fail to show?",
              ],
              keyConcepts: [
                "Scientists use models to understand how things work.",
                "All models are approximations; they do not perfectly match every observation.",
              ],
              culminatingTask: "Build a ridge model and list two ways it helps and two ways it is not the real island.",
            },
            social_studies_g3: {
              targetStandardCodes: ["SS.3.G.1.5"],
              investigationQuestions: [
                "Why does Greenland look huge on the flat atlas but not on the globe?",
              ],
              keyConcepts: [
                "Maps distort; globes keep Earth's round shape.",
              ],
              culminatingTask:
                "Compare the wreck globe to the paper Guild atlas and explain one distortion in your own words.",
            },
          },
        },
        {
          id: "u3-ch8",
          title: "Chapter 8 — Living Neighbors",
          sagaPhase: "building",
          sharedBeat: "The island is not empty. Plants lean. Animals leave signs. The crew argues about what the cove 'is.'",
          anchorQuestion: "How do living things on this island respond to light, seasons, and one another?",
          chapterQuestion: "What belongs in a habitat map — and why do two crew members describe the same cove differently?",
          investigationQuestions: [
            "Do stems grow toward light? Do roots grow down?",
            "Which plants make seeds, and which make spores?",
            "How do animals and plants change with the season we are in?",
          ],
          subjectPlans: {
            math_g3: {
              targetStandardCodes: ["MA.3.AR.3.3"],
              investigationQuestions: [
                "If bird counts go 4, 8, 12, … what is the 6th count?",
              ],
              keyConcepts: ["Numerical patterns can be identified, created, and extended."],
              culminatingTask: "Create and extend a sighting pattern for Idi's habitat log.",
            },
            ela_g3: {
              targetStandardCodes: ["ELA.3.R.1.2", "ELA.3.R.1.3"],
              investigationQuestions: [
                "What theme grows in Mara's cove story?",
                "How is Pell's perspective on the cove different from Idi's?",
              ],
              keyConcepts: [
                "Theme develops through details.",
                "Perspective is a character's attitude toward something.",
              ],
              culminatingTask: "Explain the theme of the cove tale and contrast two crew perspectives.",
            },
            science_g3: {
              targetStandardCodes: ["SC.3.L.14.2", "SC.3.L.15.2", "SC.3.L.17.1"],
              investigationQuestions: [
                "How do these seedlings respond to light and gravity?",
                "Is this plant flowering with seeds, or a fern/moss with spores?",
                "What seasonal change do we see in leaves or animal behavior?",
              ],
              keyConcepts: [
                "Plants respond to heat, light, and gravity.",
                "Flowering plants (seeds) differ from ferns and mosses (spores).",
                "Animals and plants respond to changing seasons.",
              ],
              culminatingTask: "Classify island plants and record one plant and one animal seasonal response.",
            },
            social_studies_g3: {
              targetStandardCodes: ["SS.3.G.2.6"],
              investigationQuestions: [
                "Why does the same cove feel like 'home' to Pell and 'a trap' to Mara?",
              ],
              keyConcepts: [
                "People perceive places and regions differently (interviews, mental maps, songs).",
              ],
              culminatingTask: "Interview two crew members and draw two mental maps of the same cove.",
            },
          },
        },
        {
          id: "u3-ch9",
          title: "Chapter 9 — The Signal Tower",
          sagaPhase: "building",
          sharedBeat: "Raise a tower for Signaler Tem. Measure the footprint. Watch light, heat, and falling tools.",
          anchorQuestion: "Where should the tower stand so a signal can be seen — and so the structure does not fail?",
          chapterQuestion: "How do area, light, heat, and gravity constrain a real build?",
          investigationQuestions: [
            "What is the area and perimeter of the tower deck?",
            "What happens to light when it hits water, metal, or dark cloth?",
            "How can we keep a dropped tool from falling all the way?",
          ],
          subjectPlans: {
            math_g3: {
              targetStandardCodes: ["MA.3.GR.2.2", "MA.3.GR.2.3", "MA.3.GR.2.4"],
              investigationQuestions: [
                "How do we find area with a formula, not only by counting?",
                "What is the perimeter of the rectangle deck?",
                "The L-shaped landing is two rectangles — how do we find its area?",
              ],
              keyConcepts: [
                "Area of a rectangle is length × width (sides ≤ 12).",
                "Perimeter and area problems use visual models and formulas.",
                "Composite figures made of non-overlapping rectangles can be added.",
              ],
              culminatingTask: "Compute deck area, railing perimeter, and the L-shaped landing area in square units.",
            },
            ela_g3: {
              targetStandardCodes: ["ELA.3.C.1.1", "ELA.3.C.5.1"],
              investigationQuestions: [
                "Can we label the blueprint in cursive so Tem can read it in rain?",
                "Which two multimedia pieces will help the crew understand the plan?",
              ],
              keyConcepts: [
                "Grade 3 writers produce all upper- and lowercase cursive letters.",
                "Two or more multimedia elements can enhance a task.",
              ],
              culminatingTask: "Label the tower blueprint in cursive and add a drawing plus a simple audio briefing.",
            },
            science_g3: {
              targetStandardCodes: ["SC.3.P.10.3", "SC.3.P.10.4", "SC.3.P.11.1", "SC.3.E.5.4"],
              investigationQuestions: [
                "Does the signal lamp's beam stay straight until it hits the mirror?",
                "What is reflected, refracted, or absorbed?",
                "Does the lamp also give off heat?",
                "How do we stop a falling pulley from hitting the deck?",
              ],
              keyConcepts: [
                "Light travels in a straight line until it hits an object or changes medium.",
                "Light can be reflected, refracted, or absorbed.",
                "Things that give off light often also give off heat.",
                "Gravity pulls objects down; that force can be overcome (catch, hold, brace).",
              ],
              culminatingTask: "Test the signal lamp (path of light + heat) and design a catch for falling tools.",
            },
            social_studies_g3: {
              targetStandardCodes: ["SS.3.G.1.6"],
              investigationQuestions: [
                "Using the map scale, how far is the tower from camp in the same units as the key?",
              ],
              keyConcepts: ["Scale measures distance between two places."],
              culminatingTask: "Measure tower-to-camp distance on the scaled island map.",
            },
          },
        },
      ],
    },
    {
      id: "u4-charter",
      title: "Unit 4 — The Camp Charter",
      sagaPhase: "guild",
      phenomenon:
        "The crew is arguing about work, food, and who speaks for the camp. Without fair rules and honest shares, the camp will split — a mutiny of leaving, not of fighting.",
      chapters: [
        {
          id: "u4-ch10",
          title: "Chapter 10 — Roles, Rules, and Voice",
          sagaPhase: "guild",
          sharedBeat: "Write a charter. Revise it. Argue with evidence, not shouting.",
          anchorQuestion: "Who may make rules here, and how do we change a rule without splitting the crew?",
          chapterQuestion: "What makes a camp rule fair, clear, and fixable?",
          investigationQuestions: [
            "Which sentences in the draft are fragments or tense shifts?",
            "How do we revise after Rho and Mara give feedback?",
            "When two scouts disagree, how do they check each other's evidence?",
          ],
          subjectPlans: {
            math_g3: {
              targetStandardCodes: ["MA.3.AR.1.1"],
              investigationQuestions: [
                "How can we use the distributive property to count planks for a 6-by-14 meeting-hall wall in parts?",
              ],
              keyConcepts: [
                "The distributive, commutative, and associative properties help multiply.",
              ],
              culminatingTask: "Show 6 × 14 as 6 × (10 + 4) and name the property used.",
            },
            ela_g3: {
              targetStandardCodes: ["ELA.3.C.1.5", "ELA.3.C.3.1", "ELA.3.C.5.2"],
              investigationQuestions: [
                "What should we plan, revise, and edit after peer feedback?",
                "Where did verb tense or commas for direct address fail?",
              ],
              keyConcepts: [
                "Writers plan, revise, and edit with adult guidance and peer feedback.",
                "Grade 3 conventions include verb tense, dialogue marks, and commas for address.",
                "Digital tools can be used to plan, draft, and revise.",
              ],
              culminatingTask: "Revise the camp charter on a digital slate: plan, draft, edit conventions.",
            },
            science_g3: {
              targetStandardCodes: ["SC.3.N.1.5", "SC.3.N.3.1"],
              investigationQuestions: [
                "How is 'evidence' in science different from 'evidence' in a camp argument?",
                "Why should Tem and Idi check each other's weather claims?",
              ],
              keyConcepts: [
                "Scientists question, discuss, and check each other's evidence.",
                "Science words can have more specific meanings than everyday talk.",
              ],
              culminatingTask: "Hold a crew evidence check: define 'energy' and 'evidence' the science way, then test one claim.",
            },
            social_studies_g3: {
              targetStandardCodes: ["SS.3.CG.2.1"],
              investigationQuestions: [
                "Which charter duties are volunteerism, cooperation, or civility?",
              ],
              keyConcepts: ["Civic virtues include civility, cooperation, and volunteerism."],
              culminatingTask: "Add a civic-virtue clause to the charter with a camp example of each virtue.",
            },
          },
        },
        {
          id: "u4-ch11",
          title: "Chapter 11 — Fair Shares",
          sagaPhase: "guild",
          sharedBeat: "Split bread, rope, and watch time into equal parts. Name the parts as numbers.",
          anchorQuestion: "How do we name a fair share when the whole is one loaf, one rope, or one watch?",
          chapterQuestion: "When are two different-looking shares actually the same amount?",
          investigationQuestions: [
            "What is one equal part of a rope cut into 8?",
            "How is 3/4 three copies of 1/4?",
            "Why might 2/4 and 1/2 be the same share?",
          ],
          subjectPlans: {
            math_g3: {
              targetStandardCodes: [
                "MA.3.FR.1.1",
                "MA.3.FR.1.2",
                "MA.3.FR.1.3",
                "MA.3.FR.2.1",
                "MA.3.FR.2.2",
              ],
              investigationQuestions: [
                "How do we show unit fractions on a loaf and on a number line?",
                "Which fraction names are word form, numeral-word form, and standard form?",
                "How do we compare fractions with the same numerator or same denominator?",
              ],
              keyConcepts: [
                "A unit fraction 1/n is one of n equal parts.",
                "m/n is m copies of 1/n (including fractions greater than one).",
                "Fractions can be read and written in standard, numeral-word, and word form.",
                "Fractions with the same numerator or same denominator can be ordered and compared.",
                "Equivalent fractions name the same amount (identify, do not yet generate as a skill).",
              ],
              culminatingTask: "Split loaves and rope, name the fractions three ways, compare shares, and mark equivalents.",
            },
            ela_g3: {
              targetStandardCodes: ["ELA.3.R.3.1", "ELA.3.V.1.2"],
              investigationQuestions: [
                "Where is the metaphor, personification, or hyperbole in Pell's complaint?",
                "How does the root 'fract' or prefix 'un-' help with unfamiliar words?",
              ],
              keyConcepts: [
                "Metaphors, personification, and hyperbole are figurative language.",
                "Greek and Latin roots and affixes unlock word meaning.",
              ],
              culminatingTask: "Mark figurative language in the share-song and use roots to define two hard words.",
            },
            science_g3: {
              targetStandardCodes: ["SC.3.P.11.2"],
              investigationQuestions: [
                "What happens when we rub dry rope fibers together on a cold morning?",
              ],
              keyConcepts: ["Heat is produced when one object rubs against another."],
              culminatingTask: "Observe friction heat while preparing rope shares and explain it in the log.",
            },
            social_studies_g3: {
              targetStandardCodes: ["SS.3.E.1.1"],
              investigationQuestions: [
                "If bread is scarce, what might a crew trade instead of taking extra shares?",
              ],
              keyConcepts: ["Scarcity can result in trade."],
              culminatingTask: "Propose one fair trade when a share is missing, without taking someone else's loaf.",
            },
          },
        },
        {
          id: "u4-ch12",
          title: "Chapter 12 — Songs, Stars, and Muster",
          sagaPhase: "guild",
          sharedBeat: "Night on the tower. Poems. Unknowns in the watch equations. The sky is full of lights.",
          anchorQuestion: "What do poems, numbers, and the night sky each help the crew understand?",
          chapterQuestion: "How do we name what we see — a verse form, a missing factor, a star that is not the Sun?",
          investigationQuestions: [
            "Is this verse free verse, rhymed, haiku, or limerick?",
            "How do we rewrite a division as a missing-factor problem?",
            "Why does the Sun look huge when other stars are pinpricks?",
          ],
          subjectPlans: {
            math_g3: {
              targetStandardCodes: ["MA.3.AR.2.1", "MA.3.AR.2.2", "MA.3.AR.2.3"],
              investigationQuestions: [
                "Is 3 × 8 = 24 the same relationship as 24 ÷ 8 = 3?",
                "Is 4 × 6 = 28 true or false — and why?",
                "What number makes 7 × n = 56 true?",
              ],
              keyConcepts: [
                "Division can be restated as a missing-factor problem.",
                "Multiplication and division equations can be true or false.",
                "The unknown can be in any position.",
              ],
              culminatingTask: "Solve the muster-math board: missing factors, true/false, and unknowns in any place.",
            },
            ela_g3: {
              targetStandardCodes: ["ELA.3.R.1.4", "ELA.3.V.1.1"],
              investigationQuestions: [
                "Which poem is a haiku, which is a limerick, which is free verse?",
                "Which academic words belong in the captain's night remarks?",
              ],
              keyConcepts: [
                "Grade 3 poem types: free verse, rhymed verse, haiku, limerick.",
                "Academic vocabulary is used in speaking and writing.",
              ],
              culminatingTask: "Identify four poem types in the crew anthology and use academic words in a short remarks card.",
            },
            science_g3: {
              targetStandardCodes: ["SC.3.E.5.1", "SC.3.E.5.2", "SC.3.E.5.3", "SC.3.E.5.5"],
              investigationQuestions: [
                "Do all stars look the same from the tower?",
                "Is the Sun a star that gives off energy as light?",
                "Why does the Sun appear larger and brighter?",
                "What changes when we look through Tem's spyglass?",
              ],
              keyConcepts: [
                "Stars differ in size and brightness; except the Sun they look like points of light because they are far.",
                "The Sun is a star that emits energy, including light.",
                "The Sun appears large and bright because it is the closest star to Earth.",
                "A telescope shows far more stars than the unaided eye.",
              ],
              culminatingTask:
                "Use the Guild astronomy primer (Earth knowledge) plus tower observations: classify stars, explain the Sun, and log spyglass vs. eye counts. Do not invent a second sun or a 'secret planet.'",
            },
            social_studies_g3: {
              targetStandardCodes: ["SS.3.G.2.6"],
              investigationQuestions: [
                "How does the night-watch song make the ridge feel different from Idi's map talk?",
              ],
              keyConcepts: ["Songs and legends shape how people perceive a place."],
              culminatingTask: "Compare a song verse and a map note about the same ridge.",
            },
          },
        },
      ],
    },
    {
      id: "u5-guild",
      title: "Unit 5 — Guild Inspection and Earth Memory",
      sagaPhase: "guild",
      phenomenon:
        "The Cartographers' Guild will not stamp a pretty story. They want numbers, honest models, and the Earth knowledge sealed in the wreck library — continents, constitutions, and people who showed courage.",
      chapters: [
        {
          id: "u5-ch13",
          title: "Chapter 13 — Number Sense Inspection",
          sagaPhase: "guild",
          sharedBeat: "A Guild inspector's list arrives by leftover radio burst. Round. Compare. Open the atlas to the world.",
          anchorQuestion: "Will our counts survive a Guild inspector who hates sloppy zeros?",
          chapterQuestion: "How close is close enough — and where, on Earth, are we even talking about?",
          investigationQuestions: [
            "What is 847 to the nearest ten and nearest hundred?",
            "How do two authors describe the same spring?",
            "Can we label continents and oceans on the Guild world map?",
          ],
          subjectPlans: {
            math_g3: {
              targetStandardCodes: ["MA.3.NSO.1.4"],
              investigationQuestions: [
                "When should the inspector accept a rounded count instead of an exact one?",
              ],
              keyConcepts: ["Whole numbers 0–1,000 round to the nearest 10 or 100."],
              culminatingTask: "Round the inventory for the inspector's 'nearest ten / nearest hundred' columns.",
            },
            ela_g3: {
              targetStandardCodes: ["ELA.3.R.3.3"],
              investigationQuestions: [
                "How do Pell's water notes and the Guild leaflet present the same spring differently?",
              ],
              keyConcepts: [
                "Two authors can present the same topic with different information and emphasis.",
              ],
              culminatingTask: "Compare and contrast two texts about the camp spring.",
            },
            science_g3: {
              targetStandardCodes: ["SC.3.N.1.4"],
              investigationQuestions: [
                "Why must the inspector read our charts, not only hear a speech?",
              ],
              keyConcepts: ["Communication among scientists (and inspectors) matters."],
              culminatingTask: "Prepare a one-page communication log the inspector can check against the charts.",
            },
            social_studies_g3: {
              targetStandardCodes: ["SS.3.G.1.3"],
              investigationQuestions: [
                "Where are the seven continents and five oceans on the Guild world map?",
              ],
              keyConcepts: ["Continents and oceans can be labeled on a world map."],
              culminatingTask:
                "From the wreck's Guild atlas (Earth memory), label continents and oceans. This is Earth geography, not a claim about the island's horizon.",
            },
          },
        },
        {
          id: "u5-ch14",
          title: "Chapter 14 — Patterns, Multiples, and the North American Plate",
          sagaPhase: "guild",
          sharedBeat: "Watch-duty patterns. Multiples for crate stacking. Open the atlas to North America.",
          anchorQuestion: "What repeats — in numbers, and in how Earth names its lands?",
          chapterQuestion: "Which numbers are multiples, and which countries sit on the North American map?",
          investigationQuestions: [
            "Is 36 a multiple of 4?",
            "Where are Canada, the United States, Mexico, and the listed Caribbean places?",
            "What are the five regions of the United States, and which states belong in a given region?",
          ],
          subjectPlans: {
            math_g3: {
              targetStandardCodes: ["MA.3.AR.3.2"],
              investigationQuestions: [
                "How do we test whether a number from 1 to 144 is a multiple of a one-digit number?",
              ],
              keyConcepts: ["A number is a multiple of a one-digit number if multiplication or division shows it."],
              culminatingTask: "Mark crate numbers that are multiples of 3, 4, or 6 for stacking rules.",
            },
            ela_g3: {
              targetStandardCodes: ["ELA.3.C.1.4"],
              investigationQuestions: [
                "How do we write an expository page that introduces atlas facts without copying the whole book?",
              ],
              keyConcepts: ["Expository text needs introduction, facts, elaboration, transitions, and conclusion."],
              culminatingTask: "Write a one-page atlas brief: 'What the Guild needs us to know about North America.'",
            },
            science_g3: {
              targetStandardCodes: ["SC.3.N.3.2"],
              investigationQuestions: [
                "How is the atlas map a model of Earth?",
              ],
              keyConcepts: ["Models help explain how things work — including a spherical Earth on a flat page."],
              culminatingTask: "Explain one way the atlas model helps and one way it is not the real Earth.",
            },
            social_studies_g3: {
              targetStandardCodes: ["SS.3.G.2.1", "SS.3.G.2.2", "SS.3.G.2.3"],
              investigationQuestions: [
                "Can we label Canada, the United States, Mexico, and the listed Caribbean countries/commonwealths?",
                "What are the five U.S. regions, and which states sit in each?",
              ],
              keyConcepts: [
                "North America includes Canada, the United States, and Mexico; listed Caribbean places can be labeled.",
                "The United States is described in five regions.",
                "States can be labeled within those regions.",
              ],
              culminatingTask:
                "Complete the Guild atlas plates for North America, U.S. regions, and states. Found-book Earth geography — not island fan-fiction.",
            },
          },
        },
        {
          id: "u5-ch15",
          title: "Chapter 15 — The Guild Atlas: Lands, Climates, and Peoples",
          sagaPhase: "guild",
          sharedBeat:
            "Study the wreck library: physical features, landmarks, climate, resources, settlement, and cultures of the United States, Canada, Mexico, and the Caribbean.",
          anchorQuestion: "What does the Earth-side atlas claim about land, weather, and people?",
          chapterQuestion: "How do environment and culture shape where people live — according to these Earth sources?",
          investigationQuestions: [
            "What physical features and landmarks appear in the United States, Canada, Mexico, and the Caribbean?",
            "How do climate, vegetation, and natural resources differ across those places?",
            "How does environment influence settlement, and which cultures and contributions are named?",
          ],
          subjectPlans: {
            math_g3: {
              targetStandardCodes: ["MA.3.DP.1.2"],
              investigationQuestions: [
                "What does the atlas population bar graph tell us in a two-step comparison?",
              ],
              keyConcepts: ["Interpret scaled graphs and tables with one- and two-step problems."],
              culminatingTask: "Solve two graph problems from the atlas climate/population plates.",
            },
            ela_g3: {
              targetStandardCodes: ["ELA.3.C.4.1"],
              investigationQuestions: [
                "What research question can we answer with two atlas chapters and one poem about a region?",
              ],
              keyConcepts: ["Research organizes information from multiple sources."],
              culminatingTask: "Answer one atlas research question with notes from two sources.",
            },
            science_g3: {
              targetStandardCodes: ["SC.3.L.17.1"],
              investigationQuestions: [
                "How do the atlas climate plates connect to how plants and animals respond to seasons?",
              ],
              keyConcepts: ["Seasonal change is a life-science idea; climate plates are geographic context."],
              culminatingTask: "Link one atlas climate note to one seasonal plant or animal response.",
            },
            social_studies_g3: {
              targetStandardCodes: [
                "SS.3.G.2.4",
                "SS.3.G.2.5",
                "SS.3.G.3.1",
                "SS.3.G.3.2",
                "SS.3.G.4.1",
                "SS.3.G.4.2",
                "SS.3.G.4.3",
                "SS.3.G.4.4",
              ],
              investigationQuestions: [
                "What physical features and landmarks should we be able to name?",
                "How do climate, vegetation, and resources differ?",
                "How does environment influence settlement patterns?",
                "Which cultures settled these places, how do cultural characteristics compare, and what contributions from ethnic groups are named?",
              ],
              keyConcepts: [
                "Physical features and landmarks of the U.S., Canada, Mexico, and the Caribbean.",
                "Climate, vegetation, and natural resources of those places.",
                "Environment influences settlement; diverse cultures have settled these lands.",
                "Cultural characteristics can be compared; ethnic groups have contributed to the United States.",
              ],
              culminatingTask:
                "Complete the Guild atlas 'Lands and Peoples' booklet from Earth sources. Do not rename Florida as a camp cove.",
            },
          },
        },
        {
          id: "u5-ch16",
          title: "Chapter 16 — Constitutions, Holidays, and Heroes",
          sagaPhase: "guild",
          sharedBeat:
            "The sealed civics folio: U.S. and Florida constitutions, voting, holidays, symbols, currencies, and African American heroism and patriotism.",
          anchorQuestion: "Why do people on Earth write constitutions — and whom do they remember?",
          chapterQuestion: "What do these Earth documents and stories say about power, voting, and courage?",
          investigationQuestions: [
            "How does the U.S. Constitution establish a need for government?",
            "What is 'consent of the governed'?",
            "Which symbols, holidays, and Florida facts are we expected to recognize?",
            "Which African Americans are named for heroism and patriotism?",
          ],
          subjectPlans: {
            math_g3: {
              targetStandardCodes: ["MA.3.NSO.1.3"],
              investigationQuestions: [
                "Can we order historical years on a number line as whole numbers (as dates, not as a history lecture)?",
              ],
              keyConcepts: ["Whole numbers (including four-digit years) can be ordered and compared."],
              culminatingTask: "Place 1787 and 1845 on a labeled number line and compare them with < or >.",
            },
            ela_g3: {
              targetStandardCodes: ["ELA.3.C.1.3"],
              investigationQuestions: [
                "What opinion can we support with details from the civics folio?",
              ],
              keyConcepts: ["Opinion writing needs reasons, source details, transitions, and a conclusion."],
              culminatingTask: "Write an opinion: why voting is a responsibility, citing the folio — not a camp show-of-hands substitute for the standard.",
            },
            science_g3: {
              targetStandardCodes: ["SC.3.N.1.5"],
              investigationQuestions: [
                "How is checking a civic claim like checking a science explanation?",
              ],
              keyConcepts: ["Evidence should be questioned and checked."],
              culminatingTask: "Pair one civic fact with the source page that supports it; note what would count as a check.",
            },
            social_studies_g3: {
              targetStandardCodes: [
                "SS.3.CG.1.1",
                "SS.3.CG.1.2",
                "SS.3.CG.2.2",
                "SS.3.CG.2.3",
                "SS.3.CG.2.4",
                "SS.3.CG.2.5",
                "SS.3.CG.3.1",
                "SS.3.CG.3.2",
                "SS.3.AA.1.1",
                "SS.3.E.1.4",
              ],
              investigationQuestions: [
                "What purposes of government does the U.S. Constitution establish?",
                "How does government gain power from the people?",
                "Why is voting important in a republic?",
                "Which patriotic holidays, U.S. symbols/individuals/documents/events, and Florida symbols/individuals/documents/events must we recognize?",
                "How are U.S. and Florida governments structured in three branches and in local, state, and national levels?",
                "Which African Americans are identified for heroism and patriotism?",
                "Which currencies are used in the U.S., Canada, Mexico, and the Caribbean?",
              ],
              keyConcepts: [
                "The U.S. Constitution establishes purpose and need for government.",
                "Government power comes from the people ('We the People,' consent of the governed).",
                "Voting is a civic responsibility in a republic.",
                "Patriotic holidays and U.S./Florida symbols, people, documents, and events can be recognized.",
                "U.S. and Florida constitutions structure government; government has local, state, and national levels.",
                "Named African Americans demonstrated heroism and patriotism.",
                "Currencies differ across the U.S., Canada, Mexico, and the Caribbean.",
              ],
              culminatingTask:
                "Complete the sealed civics folio as Earth memory. Camp 'votes' may practice civility, but they do not replace the U.S. Constitution or Florida statehood facts.",
            },
          },
        },
      ],
    },
    {
      id: "u6-enterprise",
      title: "Unit 6 — Enterprise and the Guild Report",
      sagaPhase: "enterprise",
      phenomenon:
        "The camp can trade, rebuild a hull, and file a report. The Guild will stamp only what is measured, sourced, and honest.",
      chapters: [
        {
          id: "u6-ch17",
          title: "Chapter 17 — Market Day",
          sagaPhase: "enterprise",
          sharedBeat: "A trader returns. Money has characteristics. Goods move. The captain keeps the books.",
          anchorQuestion: "How do we exchange what we have for what we lack without cheating the crew?",
          chapterQuestion: "What makes money money — and what makes a trade fair?",
          investigationQuestions: [
            "What characteristics does money have?",
            "Who is buying and who is selling?",
            "Which two-step problems hide in the price board?",
          ],
          subjectPlans: {
            math_g3: {
              targetStandardCodes: ["MA.3.AR.1.2"],
              investigationQuestions: [
                "If rope is 4 coins each and we need 9, then spend 10 more on nails, what is the total?",
              ],
              keyConcepts: ["One- and two-step problems may use any of the four operations (factors within 12)."],
              culminatingTask: "Solve the market-board two-step problems with units named.",
            },
            ela_g3: {
              targetStandardCodes: ["ELA.3.C.1.3"],
              investigationQuestions: [
                "Should we accept the trader's second offer? Why, with details from the ledger?",
              ],
              keyConcepts: ["Opinion writing uses reasons from sources."],
              culminatingTask: "Write an opinion on the trader's offer with ledger details and a conclusion.",
            },
            science_g3: {
              targetStandardCodes: ["SC.3.P.8.2"],
              investigationQuestions: [
                "Does the 'bigger' sack of grain have more mass?",
              ],
              keyConcepts: ["Mass and volume must be measured, not judged by looks."],
              culminatingTask: "Measure mass and volume of two trade sacks before sealing the deal.",
            },
            social_studies_g3: {
              targetStandardCodes: ["SS.3.E.1.2", "SS.3.E.1.3"],
              investigationQuestions: [
                "What characteristics of money do Guild coins show?",
                "How do buyer and seller interact in this exchange?",
              ],
              keyConcepts: [
                "Money has characteristics (portable, divisible, accepted as payment, etc.).",
                "Buyers and sellers exchange goods and services through trade or money.",
              ],
              culminatingTask: "List characteristics of money and diagram the day's buyer–seller exchange.",
            },
          },
        },
        {
          id: "u6-ch18",
          title: "Chapter 18 — Hull Blueprints",
          sagaPhase: "enterprise",
          sharedBeat: "Rebuild from island timber. File honest measurements. No gore — a cracked hull, not a battle.",
          anchorQuestion: "Can we rebuild enough hull to leave — and prove the materials math?",
          chapterQuestion: "Which measurements from the whole expedition belong on the blueprint?",
          investigationQuestions: [
            "What are the final timber totals?",
            "How do we write the build as an expository plan?",
            "Which material properties still matter?",
          ],
          subjectPlans: {
            math_g3: {
              targetStandardCodes: ["MA.3.NSO.2.1", "MA.3.GR.2.3"],
              investigationQuestions: [
                "What is the multi-digit timber total?",
                "What is the perimeter and area of the patch rectangle?",
              ],
              keyConcepts: [
                "Multi-digit addition/subtraction with a standard algorithm.",
                "Perimeter and area of rectangles with whole-number sides.",
              ],
              culminatingTask: "Compute final materials totals and the patch rectangle's perimeter and area.",
            },
            ela_g3: {
              targetStandardCodes: ["ELA.3.C.1.4", "ELA.3.C.1.5"],
              investigationQuestions: [
                "Does the hull plan have an introduction, facts, and a conclusion?",
                "What did peer feedback change?",
              ],
              keyConcepts: ["Expository writing can be improved by planning, revising, and editing."],
              culminatingTask: "Draft and revise the hull plan with one round of crew feedback.",
            },
            science_g3: {
              targetStandardCodes: ["SC.3.P.8.3", "SC.3.N.1.7"],
              investigationQuestions: [
                "Which boards are harder, which are more flexible, which hold water?",
                "What measurements validate the 'this wood is strong enough' claim?",
              ],
              keyConcepts: [
                "Materials are compared by properties.",
                "Empirical evidence validates explanations.",
              ],
              culminatingTask: "Recommend hull woods with property evidence, not hope.",
            },
            social_studies_g3: {
              targetStandardCodes: ["SS.3.A.1.1"],
              investigationQuestions: [
                "Which blueprint notes are primary (Vey's measurements) and which are secondary (Rho's summary)?",
              ],
              keyConcepts: ["Primary vs. secondary sources still matter at the end of an expedition."],
              culminatingTask: "Tag each hull-folder page as primary or secondary before it is copied for the Guild.",
            },
          },
        },
        {
          id: "u6-ch19",
          title: "Chapter 19 — The Captain's Report",
          sagaPhase: "enterprise",
          sharedBeat: "File the Guild resource report. Cite evidence. Speak the summary. The seal is heavy.",
          anchorQuestion: "Can we honestly tell the Guild what this island is worth?",
          chapterQuestion: "What evidence from the whole expedition does the report need to be trusted?",
          investigationQuestions: [
            "Which measurements, observations, and writings belong in the report?",
            "How do we justify recommendations?",
            "What does the crew still owe the Guild — and what does the Guild now owe the crew?",
          ],
          subjectPlans: {
            math_g3: {
              targetStandardCodes: ["MA.3.DP.1.1"],
              investigationQuestions: [
                "Which table or scaled graph should carry the final resource counts?",
              ],
              keyConcepts: ["Final data need titles, labels, and appropriate units."],
              culminatingTask: "Build the Guild-report data display from the expedition totals.",
            },
            ela_g3: {
              targetStandardCodes: ["ELA.3.C.1.4", "ELA.3.R.2.4", "ELA.3.C.2.1", "ELA.3.C.5.1"],
              investigationQuestions: [
                "What claims are we making, and what evidence supports each?",
                "How do we present the report orally and with multimedia?",
              ],
              keyConcepts: [
                "Expository reports cite evidence for claims.",
                "Oral presentation plus multimedia can carry the same ideas.",
              ],
              culminatingTask:
                "Write the Guild report citing at least three pieces of evidence; present it orally with two multimedia elements.",
            },
            science_g3: {
              targetStandardCodes: ["SC.3.N.1.4", "SC.3.N.1.1"],
              investigationQuestions: [
                "What new questions remain for a second ship?",
                "How will we communicate findings so another team can repeat them?",
              ],
              keyConcepts: [
                "Investigations raise new questions.",
                "Results must be communicated.",
              ],
              culminatingTask: "List remaining questions and a communication plan for the second ship.",
            },
            social_studies_g3: {
              targetStandardCodes: ["SS.3.A.1.3", "SS.3.CG.2.1"],
              investigationQuestions: [
                "Which social-science lens is each appendix: history, geography, economics, civics?",
                "How did the crew show civic virtue across the expedition?",
              ],
              keyConcepts: [
                "Social-science terms organize a full report.",
                "Civic virtue is still required at the end.",
              ],
              culminatingTask:
                "Submit the civic cover sheet: terms, plus examples of civility and volunteerism from the year — not a fake constitution.",
            },
          },
        },
      ],
    },
  ],
  checkpoints: [
    {
      id: "cp-math-nso-placevalue",
      title: "Guild inspection: Number Sense (place value)",
      subjectSlug: "math_g3",
      unitId: "u5-guild",
      chapterId: "u5-ch13",
      format: "MIXED",
      standardCodes: ["MA.3.NSO.1.1", "MA.3.NSO.1.2", "MA.3.NSO.1.3", "MA.3.NSO.1.4"],
      inGameReward: "Inspector's brass stamp + unlocked inland ridge on the map",
      itemBlueprints: [
        { itemType: "short_answer", stem: "Write 4,706 in expanded form and word form.", standardCodes: ["MA.3.NSO.1.1"] },
        { itemType: "short_answer", stem: "Show 3,250 as 32 hundreds + 5 tens and as 3 thousands + 2 hundreds + 5 tens.", standardCodes: ["MA.3.NSO.1.2"] },
        { itemType: "multiple_choice", stem: "Which is greatest: 2,199; 2,910; 2,091?", standardCodes: ["MA.3.NSO.1.3"] },
        { itemType: "short_answer", stem: "Round 847 to the nearest ten and nearest hundred.", standardCodes: ["MA.3.NSO.1.4"] },
        { itemType: "constructed_response", stem: "Plot 1,050 and 1,500 on a number line scaled by 50s and write < or >.", standardCodes: ["MA.3.NSO.1.3"] },
      ],
    },
    {
      id: "cp-math-nso-ops",
      title: "Guild inspection: Number Sense (operations)",
      subjectSlug: "math_g3",
      unitId: "u2-camp",
      chapterId: "u2-ch4",
      format: "MIXED",
      standardCodes: ["MA.3.NSO.2.1", "MA.3.NSO.2.2", "MA.3.NSO.2.3", "MA.3.NSO.2.4"],
      inGameReward: "Quartermaster lockbox + 20 units of rope",
      itemBlueprints: [
        { itemType: "short_answer", stem: "Add 1,486 + 2,359. Subtract 4,020 − 1,675.", standardCodes: ["MA.3.NSO.2.1"] },
        { itemType: "multiple_choice", stem: "Which array matches 6 × 4? Draw or choose equal groups.", standardCodes: ["MA.3.NSO.2.2"] },
        { itemType: "short_answer", stem: "Find 7 × 40 and 3 × 600.", standardCodes: ["MA.3.NSO.2.3"] },
        { itemType: "short_answer", stem: "Find 8 × 9 and the related division fact.", standardCodes: ["MA.3.NSO.2.4"] },
      ],
    },
    {
      id: "cp-math-fractions",
      title: "Guild inspection: Fractions",
      subjectSlug: "math_g3",
      unitId: "u4-charter",
      chapterId: "u4-ch11",
      format: "MIXED",
      standardCodes: ["MA.3.FR.1.1", "MA.3.FR.1.2", "MA.3.FR.1.3", "MA.3.FR.2.1", "MA.3.FR.2.2"],
      inGameReward: "Fair-share bakery shelf (camp decoration) + extra loaf token",
      itemBlueprints: [
        { itemType: "short_answer", stem: "Shade 1/6 of a loaf diagram and explain what 1/6 means.", standardCodes: ["MA.3.FR.1.1"] },
        { itemType: "short_answer", stem: "Show 3/4 as 1/4 + 1/4 + 1/4, including a fraction greater than one (5/4).", standardCodes: ["MA.3.FR.1.2"] },
        { itemType: "short_answer", stem: "Write 3/8 in word form and numeral-word form.", standardCodes: ["MA.3.FR.1.3"] },
        { itemType: "multiple_choice", stem: "Order 1/8, 5/8, 3/8 on a number line.", standardCodes: ["MA.3.FR.2.1"] },
        { itemType: "constructed_response", stem: "Explain why 2/4 and 1/2 are equivalent using a given model (do not generate a new pair unaided).", standardCodes: ["MA.3.FR.2.2"] },
      ],
    },
    {
      id: "cp-math-algebra",
      title: "Guild inspection: Algebraic Reasoning",
      subjectSlug: "math_g3",
      unitId: "u4-charter",
      chapterId: "u4-ch12",
      format: "MIXED",
      standardCodes: ["MA.3.AR.1.1", "MA.3.AR.1.2", "MA.3.AR.2.1", "MA.3.AR.2.2", "MA.3.AR.2.3", "MA.3.AR.3.1", "MA.3.AR.3.2", "MA.3.AR.3.3"],
      inGameReward: "Meeting-hall bell (unlocks charter votes that are not U.S. elections)",
      itemBlueprints: [
        { itemType: "short_answer", stem: "Compute 7 × 16 using 7 × (10 + 6). Name the property.", standardCodes: ["MA.3.AR.1.1"] },
        { itemType: "constructed_response", stem: "Two-step: 5 tents of 8 people, then 6 more arrive. How many?", standardCodes: ["MA.3.AR.1.2"] },
        { itemType: "short_answer", stem: "Rewrite 24 ÷ 6 = 4 as a missing-factor equation.", standardCodes: ["MA.3.AR.2.1"] },
        { itemType: "multiple_choice", stem: "Is 6 × 7 = 43 true or false?", standardCodes: ["MA.3.AR.2.2"] },
        { itemType: "short_answer", stem: "Find n: n × 9 = 72.", standardCodes: ["MA.3.AR.2.3"] },
        { itemType: "short_answer", stem: "Is 1,000 even or odd? Explain using place value.", standardCodes: ["MA.3.AR.3.1"] },
        { itemType: "short_answer", stem: "Is 48 a multiple of 6? Show why.", standardCodes: ["MA.3.AR.3.2"] },
        { itemType: "short_answer", stem: "Extend 5, 10, 15, 20 using the rule. Name the 8th term.", standardCodes: ["MA.3.AR.3.3"] },
      ],
    },
    {
      id: "cp-math-measurement",
      title: "Guild inspection: Measurement and Time",
      subjectSlug: "math_g3",
      unitId: "u2-camp",
      chapterId: "u2-ch6",
      format: "MIXED",
      standardCodes: ["MA.3.M.1.1", "MA.3.M.1.2", "MA.3.M.2.1", "MA.3.M.2.2"],
      inGameReward: "Cook Pell's calibrated kettle + watch-bell skins",
      itemBlueprints: [
        { itemType: "multiple_choice", stem: "Choose the tool: length of a plank, water in a pot, or air temperature.", standardCodes: ["MA.3.M.1.1"] },
        { itemType: "constructed_response", stem: "The pot holds 12 cups. The crew drinks 3 cups, then 4 cups. How many cups remain? Include the unit.", standardCodes: ["MA.3.M.1.2"] },
        { itemType: "short_answer", stem: "Write the analog clock time to the nearest minute with a.m. or p.m.", standardCodes: ["MA.3.M.2.1"] },
        { itemType: "short_answer", stem: "Watch starts at 3:10 p.m. and lasts 45 minutes. When does it end?", standardCodes: ["MA.3.M.2.2"] },
      ],
    },
    {
      id: "cp-math-geometry",
      title: "Guild inspection: Geometric Reasoning",
      subjectSlug: "math_g3",
      unitId: "u3-map",
      chapterId: "u3-ch9",
      format: "MIXED",
      standardCodes: ["MA.3.GR.1.1", "MA.3.GR.1.2", "MA.3.GR.1.3", "MA.3.GR.2.1", "MA.3.GR.2.2", "MA.3.GR.2.3", "MA.3.GR.2.4"],
      inGameReward: "Signal-tower deck unlocked + flag customization",
      itemBlueprints: [
        { itemType: "short_answer", stem: "Name a pair of perpendicular lines and a ray on the trail diagram.", standardCodes: ["MA.3.GR.1.1"] },
        { itemType: "multiple_choice", stem: "Which figure is a rhombus but not a square?", standardCodes: ["MA.3.GR.1.2"] },
        { itemType: "short_answer", stem: "Draw the line(s) of symmetry on the given flag (or state none).", standardCodes: ["MA.3.GR.1.3"] },
        { itemType: "short_answer", stem: "Count square units to find the area of a 5-by-6 rectangle.", standardCodes: ["MA.3.GR.2.1"] },
        { itemType: "short_answer", stem: "Use the formula to find the area of a 9-by-8 rectangle. Include square units.", standardCodes: ["MA.3.GR.2.2"] },
        { itemType: "short_answer", stem: "Find perimeter and area of a 10-by-4 deck.", standardCodes: ["MA.3.GR.2.3"] },
        { itemType: "constructed_response", stem: "Find the area of an L-shape made of a 6-by-4 and a 3-by-4 rectangle.", standardCodes: ["MA.3.GR.2.4"] },
      ],
    },
    {
      id: "cp-math-data",
      title: "Guild inspection: Data",
      subjectSlug: "math_g3",
      unitId: "u6-enterprise",
      chapterId: "u6-ch19",
      format: "MIXED",
      standardCodes: ["MA.3.DP.1.1", "MA.3.DP.1.2"],
      inGameReward: "Guild-report ribbon on the camp flag",
      itemBlueprints: [
        { itemType: "constructed_response", stem: "Complete a scaled pictograph of four salvage categories with title and key.", standardCodes: ["MA.3.DP.1.1"] },
        { itemType: "short_answer", stem: "Using the storm bar graph, how many more gusts on Day 3 than Day 1? Then total of Day 2 and Day 4.", standardCodes: ["MA.3.DP.1.2"] },
      ],
    },
    {
      id: "cp-ela-literary",
      title: "Guild inspection: Literary reading",
      subjectSlug: "ela_g3",
      unitId: "u4-charter",
      chapterId: "u4-ch12",
      format: "MIXED",
      standardCodes: ["ELA.3.R.1.1", "ELA.3.R.1.2", "ELA.3.R.1.3", "ELA.3.R.1.4"],
      inGameReward: "Crew anthology shelf in the meeting hall",
      itemBlueprints: [
        { itemType: "constructed_response", stem: "Explain how Idi develops across the journal excerpt (traits, feelings, motivations).", standardCodes: ["ELA.3.R.1.1"] },
        { itemType: "constructed_response", stem: "State a theme of the cove tale and two details that develop it.", standardCodes: ["ELA.3.R.1.2"] },
        { itemType: "constructed_response", stem: "Contrast Pell's and Mara's perspectives on the same cove.", standardCodes: ["ELA.3.R.1.3"] },
        { itemType: "multiple_choice", stem: "Identify the poem as free verse, rhymed verse, haiku, or limerick.", standardCodes: ["ELA.3.R.1.4"] },
      ],
    },
    {
      id: "cp-ela-informational",
      title: "Guild inspection: Informational reading",
      subjectSlug: "ela_g3",
      unitId: "u5-guild",
      chapterId: "u5-ch13",
      format: "MIXED",
      standardCodes: ["ELA.3.R.2.1", "ELA.3.R.2.2", "ELA.3.R.2.3", "ELA.3.R.2.4", "ELA.3.R.3.2", "ELA.3.R.3.3"],
      inGameReward: "Unlocked wreck-library reading lamp",
      itemBlueprints: [
        { itemType: "multiple_choice", stem: "Name the text structure: chronology, comparison, or cause/effect, and one text feature that helps.", standardCodes: ["ELA.3.R.2.1"] },
        { itemType: "constructed_response", stem: "State the central idea of the ration leaflet and two supporting details.", standardCodes: ["ELA.3.R.2.2"] },
        { itemType: "constructed_response", stem: "What evidence does the author use to support one idea in the merchant notice?", standardCodes: ["ELA.3.R.2.3"] },
        { itemType: "constructed_response", stem: "Identify the author's claim in the water-safety page and the evidence for it.", standardCodes: ["ELA.3.R.2.4"] },
        { itemType: "constructed_response", stem: "Summarize the informational spring page (central idea + relevant details).", standardCodes: ["ELA.3.R.3.2"] },
        { itemType: "constructed_response", stem: "Compare how two authors present the same spring.", standardCodes: ["ELA.3.R.3.3"] },
      ],
    },
    {
      id: "cp-ela-language-craft",
      title: "Guild inspection: Language and foundational reading",
      subjectSlug: "ela_g3",
      unitId: "u4-charter",
      chapterId: "u4-ch11",
      format: "MIXED",
      standardCodes: ["ELA.3.R.3.1", "ELA.3.V.1.1", "ELA.3.V.1.2", "ELA.3.V.1.3", "ELA.3.F.1.3", "ELA.3.F.1.4"],
      inGameReward: "Word-hoard satchel (in-world glossary unlock)",
      itemBlueprints: [
        { itemType: "short_answer", stem: "Identify a metaphor, personification, or hyperbole in the share-song line.", standardCodes: ["ELA.3.R.3.1"] },
        { itemType: "short_answer", stem: "Use two academic words from the word bank in a captain sentence.", standardCodes: ["ELA.3.V.1.1"] },
        { itemType: "short_answer", stem: "Use a root or affix to define 'rebuild' or 'careful.'", standardCodes: ["ELA.3.V.1.2"] },
        { itemType: "short_answer", stem: "Use context to define a multiple-meaning word in the storm bulletin.", standardCodes: ["ELA.3.V.1.3"] },
        { itemType: "short_answer", stem: "Decode a multisyllabic affixed word and name the suffix's job.", standardCodes: ["ELA.3.F.1.3"] },
        { itemType: "constructed_response", stem: "Read a grade-level log paragraph aloud (fluency checklist: accuracy and expression).", standardCodes: ["ELA.3.F.1.4"] },
      ],
    },
    {
      id: "cp-ela-writing",
      title: "Guild inspection: Writing and conventions",
      subjectSlug: "ela_g3",
      unitId: "u6-enterprise",
      chapterId: "u6-ch18",
      format: "MIXED",
      standardCodes: ["ELA.3.C.1.1", "ELA.3.C.1.2", "ELA.3.C.1.3", "ELA.3.C.1.4", "ELA.3.C.1.5", "ELA.3.C.3.1", "ELA.3.C.5.2"],
      inGameReward: "Captain's sealed journal (skin) + digital slate unlocked",
      itemBlueprints: [
        { itemType: "constructed_response", stem: "Write a line of the muster list in cursive (all letters modeled on screen).", standardCodes: ["ELA.3.C.1.1"] },
        { itemType: "constructed_response", stem: "Write a short narrative of the first night with sequence, description, and ending.", standardCodes: ["ELA.3.C.1.2"] },
        { itemType: "constructed_response", stem: "Write an opinion on a trade with reasons and a conclusion.", standardCodes: ["ELA.3.C.1.3"] },
        { itemType: "constructed_response", stem: "Write an expository paragraph about the spring using one source.", standardCodes: ["ELA.3.C.1.4"] },
        { itemType: "constructed_response", stem: "Revise a provided draft after a peer note (show before/after).", standardCodes: ["ELA.3.C.1.5"] },
        { itemType: "short_answer", stem: "Edit three convention errors (tense, dialogue marks, or commas for address).", standardCodes: ["ELA.3.C.3.1"] },
        { itemType: "constructed_response", stem: "Use the digital slate to plan, draft, and revise a four-sentence log.", standardCodes: ["ELA.3.C.5.2"] },
      ],
    },
    {
      id: "cp-ela-speaking-research",
      title: "Guild inspection: Speaking, research, multimedia",
      subjectSlug: "ela_g3",
      unitId: "u6-enterprise",
      chapterId: "u6-ch19",
      format: "MIXED",
      standardCodes: ["ELA.3.C.2.1", "ELA.3.C.4.1", "ELA.3.C.5.1"],
      inGameReward: "Muster podium + two illustration slots on the report",
      itemBlueprints: [
        { itemType: "constructed_response", stem: "Present a 45-second briefing in logical sequence with clear volume.", standardCodes: ["ELA.3.C.2.1"] },
        { itemType: "constructed_response", stem: "Answer a research question using notes from two sources.", standardCodes: ["ELA.3.C.4.1"] },
        { itemType: "constructed_response", stem: "Add two multimedia elements (drawing + audio or artifact photo) to the briefing.", standardCodes: ["ELA.3.C.5.1"] },
      ],
    },
    {
      id: "cp-sci-nature",
      title: "Guild inspection: Nature of Science",
      subjectSlug: "science_g3",
      unitId: "u4-charter",
      chapterId: "u4-ch10",
      format: "MIXED",
      standardCodes: ["SC.3.N.1.1", "SC.3.N.1.2", "SC.3.N.1.3", "SC.3.N.1.4", "SC.3.N.1.5", "SC.3.N.1.6", "SC.3.N.1.7", "SC.3.N.3.1", "SC.3.N.3.2", "SC.3.N.3.3"],
      inGameReward: "Science locker + shared observation board",
      itemBlueprints: [
        { itemType: "constructed_response", stem: "Raise a testable question about spoilage and outline a team investigation.", standardCodes: ["SC.3.N.1.1"] },
        { itemType: "constructed_response", stem: "Two groups measured the same pot. Their numbers differ. Give a reason.", standardCodes: ["SC.3.N.1.2"] },
        { itemType: "constructed_response", stem: "Keep a simple chart of three observations.", standardCodes: ["SC.3.N.1.3"] },
        { itemType: "short_answer", stem: "Why should Tem share the weather log?", standardCodes: ["SC.3.N.1.4"] },
        { itemType: "short_answer", stem: "How should Idi check Tem's explanation?", standardCodes: ["SC.3.N.1.5"] },
        { itemType: "short_answer", stem: "Infer why shade-stored fruit lasted longer, based on observations given.", standardCodes: ["SC.3.N.1.6"] },
        { itemType: "short_answer", stem: "Define empirical evidence using camp measurements.", standardCodes: ["SC.3.N.1.7"] },
        { itemType: "short_answer", stem: "Give the science meaning of 'energy' or 'evidence' vs everyday talk.", standardCodes: ["SC.3.N.3.1"] },
        { itemType: "short_answer", stem: "How does a clay ridge model help?", standardCodes: ["SC.3.N.3.2"] },
        { itemType: "short_answer", stem: "Name one way the clay model is not the real ridge.", standardCodes: ["SC.3.N.3.3"] },
      ],
    },
    {
      id: "cp-sci-earth-space",
      title: "Guild inspection: Earth and Space",
      subjectSlug: "science_g3",
      unitId: "u4-charter",
      chapterId: "u4-ch12",
      format: "MIXED",
      standardCodes: ["SC.3.E.5.1", "SC.3.E.5.2", "SC.3.E.5.3", "SC.3.E.5.4", "SC.3.E.5.5", "SC.3.E.6.1"],
      inGameReward: "Spyglass mount on the signal tower",
      itemBlueprints: [
        { itemType: "short_answer", stem: "Explain why most stars look like points of light.", standardCodes: ["SC.3.E.5.1"] },
        { itemType: "multiple_choice", stem: "The Sun is a star that emits energy, including light. True or choose the best restatement.", standardCodes: ["SC.3.E.5.2"] },
        { itemType: "short_answer", stem: "Why does the Sun appear large and bright compared with other stars?", standardCodes: ["SC.3.E.5.3"] },
        { itemType: "constructed_response", stem: "Describe a way to keep a falling object from hitting the deck (overcome gravity).", standardCodes: ["SC.3.E.5.4"] },
        { itemType: "short_answer", stem: "What happens to the number of stars you can see through a telescope vs. the eye?", standardCodes: ["SC.3.E.5.5"] },
        { itemType: "constructed_response", stem: "Explain why a dark cloth on a rock gets hotter in sun than in shade, using radiant energy.", standardCodes: ["SC.3.E.6.1"] },
      ],
    },
    {
      id: "cp-sci-physical",
      title: "Guild inspection: Physical Science",
      subjectSlug: "science_g3",
      unitId: "u3-map",
      chapterId: "u3-ch9",
      format: "MIXED",
      standardCodes: ["SC.3.P.8.1", "SC.3.P.8.2", "SC.3.P.8.3", "SC.3.P.9.1", "SC.3.P.10.1", "SC.3.P.10.2", "SC.3.P.10.3", "SC.3.P.10.4", "SC.3.P.11.1", "SC.3.P.11.2"],
      inGameReward: "Workshop bench + signal-lamp mirror",
      itemBlueprints: [
        { itemType: "short_answer", stem: "Compare temperatures of sun water vs shade water.", standardCodes: ["SC.3.P.8.1"] },
        { itemType: "short_answer", stem: "Compare mass and volume of two sacks.", standardCodes: ["SC.3.P.8.2"] },
        { itemType: "short_answer", stem: "Sort three objects by texture and hardness.", standardCodes: ["SC.3.P.8.3"] },
        { itemType: "short_answer", stem: "Name melting, freezing, evaporation, or condensation in a camp example.", standardCodes: ["SC.3.P.9.1"] },
        { itemType: "multiple_choice", stem: "Identify light, heat, sound, electrical, or mechanical energy in a storm scene.", standardCodes: ["SC.3.P.10.1"] },
        { itemType: "short_answer", stem: "Give an example of energy causing motion or change.", standardCodes: ["SC.3.P.10.2"] },
        { itemType: "short_answer", stem: "Describe the path of a lamp beam until it hits a mirror.", standardCodes: ["SC.3.P.10.3"] },
        { itemType: "short_answer", stem: "Is the beam reflected, refracted, or absorbed in each station?", standardCodes: ["SC.3.P.10.4"] },
        { itemType: "short_answer", stem: "Why does the lamp also warm your hand?", standardCodes: ["SC.3.P.11.1"] },
        { itemType: "short_answer", stem: "What happens when you rub dry rope fibers together?", standardCodes: ["SC.3.P.11.2"] },
      ],
    },
    {
      id: "cp-sci-life",
      title: "Guild inspection: Life Science",
      subjectSlug: "science_g3",
      unitId: "u3-map",
      chapterId: "u3-ch8",
      format: "MIXED",
      standardCodes: ["SC.3.L.14.1", "SC.3.L.14.2", "SC.3.L.15.1", "SC.3.L.15.2", "SC.3.L.17.1", "SC.3.L.17.2"],
      inGameReward: "Garden beds unlocked + habitat map pins",
      itemBlueprints: [
        { itemType: "short_answer", stem: "Match root, stem, leaf, flower to a role (food, support, transport, reproduction).", standardCodes: ["SC.3.L.14.1"] },
        { itemType: "short_answer", stem: "How do stems and roots respond to light and gravity?", standardCodes: ["SC.3.L.14.2"] },
        { itemType: "multiple_choice", stem: "Classify an island animal into a major group using traits.", standardCodes: ["SC.3.L.15.1"] },
        { itemType: "multiple_choice", stem: "Is the plant seed-producing or spore-producing?", standardCodes: ["SC.3.L.15.2"] },
        { itemType: "short_answer", stem: "Give one seasonal response of a plant and one of an animal.", standardCodes: ["SC.3.L.17.1"] },
        { itemType: "short_answer", stem: "What do plants use from the Sun, air, and water?", standardCodes: ["SC.3.L.17.2"] },
      ],
    },
    {
      id: "cp-ss-inquiry",
      title: "Guild inspection: Historical inquiry",
      subjectSlug: "social_studies_g3",
      unitId: "u1-crash",
      chapterId: "u1-ch1",
      format: "MIXED",
      standardCodes: ["SS.3.A.1.1", "SS.3.A.1.2", "SS.3.A.1.3"],
      inGameReward: "Wreck-archive crate (primary-source folder)",
      itemBlueprints: [
        { itemType: "multiple_choice", stem: "Is the stained sailing log primary or secondary? Rho's later retelling?", standardCodes: ["SS.3.A.1.1"] },
        { itemType: "constructed_response", stem: "Use Tem's reader to gather one fact from a source and name the tool.", standardCodes: ["SS.3.A.1.2"] },
        { itemType: "short_answer", stem: "Define history, geography, economics, civics, or government in a camp sentence.", standardCodes: ["SS.3.A.1.3"] },
      ],
    },
    {
      id: "cp-ss-maps",
      title: "Guild inspection: Maps and spatial thinking",
      subjectSlug: "social_studies_g3",
      unitId: "u3-map",
      chapterId: "u3-ch7",
      format: "MIXED",
      standardCodes: ["SS.3.G.1.1", "SS.3.G.1.2", "SS.3.G.1.3", "SS.3.G.1.4", "SS.3.G.1.5", "SS.3.G.1.6"],
      inGameReward: "Full island fog lift on the surveyed grid + atlas stand",
      itemBlueprints: [
        { itemType: "constructed_response", stem: "Read a thematic map or chart and state two geographic facts.", standardCodes: ["SS.3.G.1.1"] },
        { itemType: "short_answer", stem: "Label title, compass rose, scale, and key on a blank map frame.", standardCodes: ["SS.3.G.1.2"] },
        { itemType: "constructed_response", stem: "Label continents and oceans on the Guild world map.", standardCodes: ["SS.3.G.1.3"] },
        { itemType: "short_answer", stem: "Match physical, political, elevation, and population maps to a purpose.", standardCodes: ["SS.3.G.1.4"] },
        { itemType: "constructed_response", stem: "Explain one distortion difference between the globe and the paper map.", standardCodes: ["SS.3.G.1.5"] },
        { itemType: "short_answer", stem: "Use scale to find the distance between camp and the tower.", standardCodes: ["SS.3.G.1.6"] },
      ],
    },
    {
      id: "cp-ss-places",
      title: "Guild inspection: Places and regions (Earth atlas)",
      subjectSlug: "social_studies_g3",
      unitId: "u5-guild",
      chapterId: "u5-ch14",
      format: "MIXED",
      standardCodes: ["SS.3.G.2.1", "SS.3.G.2.2", "SS.3.G.2.3", "SS.3.G.2.4", "SS.3.G.2.5", "SS.3.G.2.6"],
      inGameReward: "Atlas plates unlocked in the wreck library",
      itemBlueprints: [
        { itemType: "constructed_response", stem: "Label Canada, the United States, Mexico, and listed Caribbean places.", standardCodes: ["SS.3.G.2.1"] },
        { itemType: "short_answer", stem: "Name the five regions of the United States.", standardCodes: ["SS.3.G.2.2"] },
        { itemType: "constructed_response", stem: "Place given states into the correct U.S. region.", standardCodes: ["SS.3.G.2.3"] },
        { itemType: "short_answer", stem: "Describe one physical feature each for the U.S., Canada, Mexico, or the Caribbean.", standardCodes: ["SS.3.G.2.4"] },
        { itemType: "short_answer", stem: "Identify one natural and one man-made landmark from the atlas list.", standardCodes: ["SS.3.G.2.5"] },
        { itemType: "constructed_response", stem: "Compare two crew (or atlas) perceptions of the same place.", standardCodes: ["SS.3.G.2.6"] },
      ],
    },
    {
      id: "cp-ss-physical-human",
      title: "Guild inspection: Climate, resources, and human systems (Earth atlas)",
      subjectSlug: "social_studies_g3",
      unitId: "u5-guild",
      chapterId: "u5-ch15",
      format: "MIXED",
      standardCodes: ["SS.3.G.3.1", "SS.3.G.3.2", "SS.3.G.4.1", "SS.3.G.4.2", "SS.3.G.4.3", "SS.3.G.4.4"],
      inGameReward: "Peoples folio + climate overlay for the atlas",
      itemBlueprints: [
        { itemType: "constructed_response", stem: "Describe climate and vegetation differences among the U.S., Canada, Mexico, and the Caribbean using atlas notes.", standardCodes: ["SS.3.G.3.1"] },
        { itemType: "short_answer", stem: "Name major natural resources from those same places.", standardCodes: ["SS.3.G.3.2"] },
        { itemType: "constructed_response", stem: "Explain how environment influences settlement in one of those places (atlas, not island rename).", standardCodes: ["SS.3.G.4.1"] },
        { itemType: "short_answer", stem: "Identify cultures that have settled the U.S., Canada, Mexico, or the Caribbean.", standardCodes: ["SS.3.G.4.2"] },
        { itemType: "constructed_response", stem: "Compare a cultural characteristic of one U.S. region with Canada, Mexico, or the Caribbean.", standardCodes: ["SS.3.G.4.3"] },
        { itemType: "short_answer", stem: "Identify a contribution from an ethnic group to the United States.", standardCodes: ["SS.3.G.4.4"] },
      ],
    },
    {
      id: "cp-ss-economics",
      title: "Guild inspection: Beginning economics",
      subjectSlug: "social_studies_g3",
      unitId: "u6-enterprise",
      chapterId: "u6-ch17",
      format: "MIXED",
      standardCodes: ["SS.3.E.1.1", "SS.3.E.1.2", "SS.3.E.1.3", "SS.3.E.1.4"],
      inGameReward: "Market stall + coin pouch (cosmetic)",
      itemBlueprints: [
        { itemType: "constructed_response", stem: "Give an example of scarcity leading to trade (camp or Earth folio).", standardCodes: ["SS.3.E.1.1"] },
        { itemType: "short_answer", stem: "List characteristics of money.", standardCodes: ["SS.3.E.1.2"] },
        { itemType: "short_answer", stem: "Identify buyer, seller, and what is exchanged.", standardCodes: ["SS.3.E.1.3"] },
        { itemType: "short_answer", stem: "Distinguish currencies of the U.S., Canada, Mexico, and the Caribbean from the folio.", standardCodes: ["SS.3.E.1.4"] },
      ],
    },
    {
      id: "cp-ss-civics-us-fl",
      title: "Guild inspection: U.S. and Florida civics (Earth folio)",
      subjectSlug: "social_studies_g3",
      unitId: "u5-guild",
      chapterId: "u5-ch16",
      format: "MIXED",
      standardCodes: ["SS.3.CG.1.1", "SS.3.CG.1.2", "SS.3.CG.2.2", "SS.3.CG.2.3", "SS.3.CG.2.4", "SS.3.CG.2.5", "SS.3.CG.3.1", "SS.3.CG.3.2"],
      inGameReward: "Sealed civics folio displayed in the library (not a fake island constitution)",
      itemBlueprints: [
        { itemType: "constructed_response", stem: "Explain how the U.S. Constitution establishes purpose and need for government.", standardCodes: ["SS.3.CG.1.1"] },
        { itemType: "short_answer", stem: "What is meant by 'We the People' / consent of the governed?", standardCodes: ["SS.3.CG.1.2"] },
        { itemType: "short_answer", stem: "Why is voting important in a republic?", standardCodes: ["SS.3.CG.2.2"] },
        { itemType: "short_answer", stem: "Explain the meaning of one patriotic holiday from the list.", standardCodes: ["SS.3.CG.2.3"] },
        { itemType: "short_answer", stem: "Recognize a U.S. symbol, individual, document, or event from the clarification list.", standardCodes: ["SS.3.CG.2.4"] },
        { itemType: "short_answer", stem: "Recognize a Florida symbol, individual, document, or event (including statehood 1845).", standardCodes: ["SS.3.CG.2.5"] },
        { itemType: "constructed_response", stem: "Explain how the U.S. and Florida Constitutions structure government (three branches).", standardCodes: ["SS.3.CG.3.1"] },
        { itemType: "short_answer", stem: "Distinguish local, state, and national government responsibilities.", standardCodes: ["SS.3.CG.3.2"] },
      ],
    },
    {
      id: "cp-ss-virtue-aa",
      title: "Guild inspection: Civic virtue and African American history",
      subjectSlug: "social_studies_g3",
      unitId: "u5-guild",
      chapterId: "u5-ch16",
      format: "MIXED",
      standardCodes: ["SS.3.CG.2.1", "SS.3.AA.1.1"],
      inGameReward: "Honor-roll banner in the meeting hall (Earth heroes + camp volunteer log)",
      itemBlueprints: [
        { itemType: "constructed_response", stem: "Describe how citizens show civility, cooperation, or volunteerism (folio examples plus one honest camp parallel).", standardCodes: ["SS.3.CG.2.1"] },
        { itemType: "short_answer", stem: "Identify an African American who demonstrated heroism or patriotism from the named list and state what they did.", standardCodes: ["SS.3.AA.1.1"] },
      ],
    },
  ],
};

function codesInChapterPlans(): string[] {
  return uniqueCodes(
    grade3CastawayCurriculum.units.flatMap((unit) =>
      unit.chapters.flatMap((chapter) =>
        (Object.values(chapter.subjectPlans) as SubjectPlan[]).flatMap((plan) => plan.targetStandardCodes),
      ),
    ),
  );
}

function codesInCheckpoints(): string[] {
  return uniqueCodes(grade3CastawayCurriculum.checkpoints.flatMap((cp) => cp.standardCodes));
}

export function codesMissingFromCurriculum(): string[] {
  const all = allGrade3StandardCodes();
  const chapters = new Set(codesInChapterPlans());
  const checks = new Set(codesInCheckpoints());
  return all.filter((code) => !chapters.has(code) || !checks.has(code));
}

export function seedGapCodes(): string[] {
  return allGrade3StandardCodes().filter(isSeedGap);
}
