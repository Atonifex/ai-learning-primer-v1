import { SubjectSeed } from "../src/types/curriculum";

/**
 * Florida B.E.S.T. Grade 5 ELA Standards — SubjectSeed
 *
 * All 26 Grade 5 ELA benchmarks organized into four strands:
 *   R  — Reading           (R.1, R.2, R.3)
 *   C  — Communication     (C.1, C.2, C.3, C.4, C.5)
 *   V  — Vocabulary        (V.1)
 *   F  — Foundational Skills (F.1)
 *
 * CPALMS ID mapping used to populate sourceUrl fields:
 *   F.1.3 → 15004  |  F.1.4 → 15005
 *   R.1.1 → 15006  |  R.1.2 → 15007  |  R.1.3 → 15008  |  R.1.4 → 15009
 *   R.2.1 → 15010  |  R.2.2 → 15011  |  R.2.3 → 15012  |  R.2.4 → 15013
 *   R.3.1 → 15014  |  R.3.2 → 15015  |  R.3.3 → 15016
 *   C.1.1 → 15017  |  C.1.2 → 15018  |  C.1.3 → 15019  |  C.1.4 → 15020  |  C.1.5 → 15021
 *   C.2.1 → 15022  |  C.3.1 → 15023  |  C.4.1 → 15024
 *   C.5.1 → 15025  |  C.5.2 → 15026
 *   V.1.1 → 15027  |  V.1.2 → 15028  |  V.1.3 → 15029
 *
 * All descriptions are pulled verbatim from CPALMS PrintStandard pages.
 * All benchmarks are fully verified. See grade5_ela_standards.md for the
 * full human-readable reference including clarifications, primer notes, and
 * supplementary resource references (Appendices A–E).
 *
 * Generated: May 2026
 */
export const standardsELAGrade5: SubjectSeed = {
  slug: "ela_g5",
  domain: "ELA",
  gradeBand: "5",
  framework: "FL_BEST",
  displayName: "Grade 5 ELA",
  catalog: {
    version: "v1",
    label: "Florida Grade 5 ELA — All Standards",
    framework: "FL_BEST",
    strands: [
      // ─────────────────────────────────────────────────────────────────────
      // STRAND R — Reading
      // ─────────────────────────────────────────────────────────────────────
      {
        code: "R",
        displayName: "Reading",
        groups: [
          // ── R.1 — Reading Prose and Poetry ──────────────────────────────
          {
            code: "ELA.5.R.1",
            displayName: "Reading Prose and Poetry",
            standards: [
              {
                code: "ELA.5.R.1.1",
                description:
                  "Analyze how setting, events, conflict, and characterization contribute to the plot in a literary text.",
                clarifications: [],
                accessPoints: [
                  "ELA.5.R.1.AP.1 — Explain how setting, events, conflict and characterization contribute to the plot in a literary text.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15006",
              },
              {
                code: "ELA.5.R.1.2",
                description:
                  "Explain the development of stated or implied theme(s) throughout a literary text.",
                clarifications: [
                  "Where the development of multiple themes is being explained, the themes may come from the same or multiple literary texts.",
                ],
                accessPoints: [
                  "ELA.5.R.1.AP.2 — Show the development of a stated or implied theme in a literary text.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15007",
              },
              {
                code: "ELA.5.R.1.3",
                description:
                  "Describe how an author develops a character's perspective in a literary text.",
                clarifications: [
                  'The term perspective means "a particular attitude toward or way of regarding something."',
                ],
                accessPoints: [
                  "ELA.5.R.1.AP.3 — Identify a character's perspective at different points in a literary text.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15008",
              },
              {
                code: "ELA.5.R.1.4",
                description:
                  "Explain how figurative language and other poetic elements work together in a poem.",
                clarifications: [
                  "Figurative language for the purposes of this benchmark refers to metaphor, simile, alliteration, personification, hyperbole, imagery, and idiom. Other examples can be used in instruction.",
                  "Poetic elements to be used for the purposes of this benchmark are form, rhyme, meter, line breaks, and imagery.",
                ],
                accessPoints: [
                  "ELA.5.R.1.AP.4 — Explain how figurative language and imagery work together in a poem.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15009",
              },
            ],
          },

          // ── R.2 — Reading Informational Text ────────────────────────────
          {
            code: "ELA.5.R.2",
            displayName: "Reading Informational Text",
            standards: [
              {
                code: "ELA.5.R.2.1",
                description:
                  "Explain how text structures and/or features contribute to the overall meaning of texts.",
                clarifications: [
                  "For more information, see Text Structures and Text Features.",
                ],
                accessPoints: [
                  "ELA.5.R.2.AP.1 — Show how text structures and/or features contribute to the overall meaning of texts.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15010",
              },
              {
                code: "ELA.5.R.2.2",
                description:
                  "Explain how relevant details support the central idea(s), implied or explicit.",
                clarifications: [],
                accessPoints: [
                  "ELA.5.R.2.AP.2 — Identify relevant details that support a central idea, implied or explicit.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15011",
              },
              {
                code: "ELA.5.R.2.3",
                description:
                  "Analyze an author's purpose and/or perspective in an informational text.",
                clarifications: [
                  'The term perspective means "a particular attitude toward or way of regarding something."',
                ],
                accessPoints: [
                  "ELA.5.R.2.AP.3 — Identify an author's purpose and perspective in an informational text.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15012",
              },
              {
                code: "ELA.5.R.2.4",
                description:
                  "Track the development of an argument, identifying the specific claim(s), evidence, and reasoning.",
                clarifications: [
                  "A claim is a statement that asserts something is true. A claim can either be fact or opinion. Claims can be used alone or with other claims to form a larger argument.",
                ],
                accessPoints: [
                  "ELA.5.R.2.AP.4 — Sequence the development of an argument.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15013",
              },
            ],
          },

          // ── R.3 — Reading Across Genres ──────────────────────────────────
          {
            code: "ELA.5.R.3",
            displayName: "Reading Across Genres",
            standards: [
              {
                code: "ELA.5.R.3.1",
                description:
                  "Analyze how figurative language contributes to meaning in text(s).",
                clarifications: [],
                accessPoints: [
                  "ELA.5.R.3.AP.1 — Identify examples of when figurative language is used to contribute to meaning in text(s).",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15014",
              },
              {
                code: "ELA.5.R.3.2",
                description:
                  "Summarize a text to enhance comprehension. Include plot and theme for a literary text. Include the central idea and relevant details for an informational text.",
                clarifications: [
                  "Most grade-level texts are appropriate for this benchmark.",
                ],
                accessPoints: [
                  "ELA.5.R.3.AP.2a — Identify the plot and theme for a literary text.",
                  "ELA.5.R.3.AP.2b — Identify the central idea and relevant details for an informational text.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15015",
              },
              {
                code: "ELA.5.R.3.3",
                description:
                  "Compare and contrast primary and secondary sources related to the same topic.",
                clarifications: [],
                accessPoints: [
                  "ELA.5.R.3.AP.3 — Compare and contrast important details from primary and secondary sources on the same topic.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15016",
              },
            ],
          },
        ],
      },

      // ─────────────────────────────────────────────────────────────────────
      // STRAND C — Communication
      // ─────────────────────────────────────────────────────────────────────
      {
        code: "C",
        displayName: "Communication",
        groups: [
          // ── C.1 — Communicating Through Writing ─────────────────────────
          {
            code: "ELA.5.C.1",
            displayName: "Communicating Through Writing",
            standards: [
              {
                code: "ELA.5.C.1.1",
                description: "Demonstrate fluent and legible cursive writing skills.",
                clarifications: [
                  "Students will use cursive writing to produce legible works within the same timeframe as they would use for writing in print.",
                ],
                accessPoints: [
                  "ELA.5.C.1.AP.1 — Write cursive letters with adequate spacing.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15017",
              },
              {
                code: "ELA.5.C.1.2",
                description:
                  "Write personal or fictional narratives using a logical sequence of events and demonstrating an effective use of techniques such as dialogue, description, and transitional words and phrases.",
                clarifications: ["See Writing Types."],
                accessPoints: [
                  "ELA.5.C.1.AP.2 — Write personal or fictional narratives using a logical sequence of events, relevant details, transitional words, dialogue and an ending.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15018",
              },
              {
                code: "ELA.5.C.1.3",
                description:
                  "Write to make a claim supporting a perspective with logical reasons, relevant evidence from sources, elaboration, and an organizational structure with varied transitions.",
                clarifications: ["See Writing Types and Elaborative Techniques."],
                accessPoints: [
                  "ELA.5.C.1.AP.3 — Make a claim about a topic using evidence from sources and an organizational structure with transitions.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15019",
              },
              {
                code: "ELA.5.C.1.4",
                description:
                  "Write expository texts about a topic using multiple sources and including an organizational structure, relevant elaboration, and varied transitions.",
                clarifications: ["See Writing Types and Elaborative Techniques."],
                accessPoints: [
                  "ELA.5.C.1.AP.4 — Write an expository text about a topic, using multiple sources and an organizational structure with transitions.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15020",
              },
              {
                code: "ELA.5.C.1.5",
                description:
                  "Improve writing by planning, revising, and editing, with guidance and support from adults and feedback from peers.",
                clarifications: [],
                accessPoints: [
                  "ELA.5.C.1.AP.5 — Improve writing as needed by planning, revising and editing, with guidance, support and modeling from adults and feedback from peers.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15021",
              },
            ],
          },

          // ── C.2 — Communicating Orally ───────────────────────────────────
          {
            code: "ELA.5.C.2",
            displayName: "Communicating Orally",
            standards: [
              {
                code: "ELA.5.C.2.1",
                description:
                  "Present information orally, in a logical sequence, using nonverbal cues, appropriate volume, clear pronunciation, and appropriate pacing.",
                clarifications: [
                  "Nonverbal cues appropriate to this grade level are posture, tone, expressive delivery, focus on the audience, and facial expression. Clear pronunciation should be interpreted to mean an understanding and application of phonics rules and sight words as well as care taken in delivery. A student's speech impediment should not be considered as impeding clear pronunciation. This is the initial grade level that introduces appropriate pacing. Appropriate pacing is adhering to the pauses dictated by punctuation and speaking at a rate that best facilitates comprehension by the audience. Too fast a pace will lose listeners and too slow can become monotonous.",
                  "For further guidance, see the Elementary Oral Communication Rubric.",
                ],
                accessPoints: [
                  "ELA.5.C.2.AP.1 — Express information in a logical sequence, using nonverbal cues and awareness of pacing, using the student's mode of communication.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15022",
              },
            ],
          },

          // ── C.3 — Following Conventions ──────────────────────────────────
          {
            code: "ELA.5.C.3",
            displayName: "Following Conventions",
            standards: [
              {
                code: "ELA.5.C.3.1",
                description:
                  "Follow the rules of standard English grammar, punctuation, capitalization, and spelling appropriate to grade level.",
                clarifications: [
                  "Skills to be mastered at this grade level include: Use principal modals to indicate the mood of a verb; Use appositives, main clauses, and subordinate clauses; Recognize and correct inappropriate shifts in tense and number; Use conjunctions correctly to join words and phrases in a sentence. Skills to be implemented but not yet mastered include: Use verbals including gerunds, infinitives, and participial phrases; Use comparative and superlative forms of adjectives; Use pronouns correctly with regard to case, number, and person, correcting for vague pronoun reference; Vary sentence structure.",
                  "See Convention Progression by Grade Level for more information.",
                ],
                accessPoints: [
                  "ELA.5.C.3.AP.1 — Follow the rules of standard English grammar, punctuation, capitalization and spelling; produce complete sentences, recognizing and correcting inappropriate fragments and run-ons; identify main and subordinate clauses.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15023",
              },
            ],
          },

          // ── C.4 — Researching ─────────────────────────────────────────────
          {
            code: "ELA.5.C.4",
            displayName: "Researching",
            standards: [
              {
                code: "ELA.5.C.4.1",
                description:
                  "Conduct research to answer a question, organizing information about the topic and using multiple reliable and valid sources.",
                clarifications: [
                  "While the benchmark does require that students consult multiple sources, there is no requirement that they use every source they consult. Part of the skill in researching is discernment — being able to tell which information is relevant and which sources are trustworthy enough to include.",
                ],
                accessPoints: [
                  "ELA.5.C.4.AP.1 — Participate in research to answer a question, organizing information about the topic, using provided reliable and valid sources.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15024",
              },
            ],
          },

          // ── C.5 — Creating and Collaborating ─────────────────────────────
          {
            code: "ELA.5.C.5",
            displayName: "Creating and Collaborating",
            standards: [
              {
                code: "ELA.5.C.5.1",
                description:
                  "Arrange multimedia elements to create emphasis in oral or written tasks.",
                clarifications: [
                  "Multimedia elements may include, but are not limited to, drawings, pictures, artifacts, and audio or digital representation. At this grade level, students are using more than one element. The elements may be of the same type. The elements should relate directly to the task and emphasize or clarify a point made within the task — perhaps by showing examples to clarify a claim or data to emphasize a point. The elements should be smoothly integrated.",
                ],
                accessPoints: [
                  "ELA.5.C.5.AP.1 — Use one or more multimedia elements to create emphasis in oral or written tasks.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15025",
              },
              {
                code: "ELA.5.C.5.2",
                description:
                  "Use digital writing tools individually or collaboratively to plan, draft, and revise writing.",
                clarifications: [],
                accessPoints: [
                  "ELA.5.C.5.AP.2 — Use digital writing tools individually or collaboratively to plan, draft and revise writing with support from adults.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15026",
              },
            ],
          },
        ],
      },

      // ─────────────────────────────────────────────────────────────────────
      // STRAND V — Vocabulary
      // ─────────────────────────────────────────────────────────────────────
      {
        code: "V",
        displayName: "Vocabulary",
        groups: [
          // ── V.1 — Finding Meaning ────────────────────────────────────────
          {
            code: "ELA.5.V.1",
            displayName: "Finding Meaning",
            standards: [
              {
                code: "ELA.5.V.1.1",
                description:
                  "Use grade-level academic vocabulary appropriately in speaking and writing.",
                clarifications: [
                  "Grade-level academic vocabulary consists of words that are likely to appear across subject areas for the current grade level and beyond, vital to comprehension, critical for academic discussions and writing, and usually require explicit instruction.",
                ],
                accessPoints: [
                  "ELA.5.V.1.AP.1 — Identify and use grade-level academic vocabulary appropriately in communication.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15027",
              },
              {
                code: "ELA.5.V.1.2",
                description:
                  "Apply knowledge of Greek and Latin roots and affixes, recognizing the connection between affixes and parts of speech, to determine the meaning of unfamiliar words in grade-level content.",
                clarifications: ["See Common Greek and Latin Roots 3–5."],
                accessPoints: [
                  "ELA.5.V.1.AP.2 — Apply knowledge of Greek and Latin roots, base words, and affixes to determine the meaning of unfamiliar words in grade-level content.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15028",
              },
              {
                code: "ELA.5.V.1.3",
                description:
                  "Use context clues, figurative language, word relationships, reference materials, and/or background knowledge to determine the meaning of multiple-meaning and unknown words and phrases, appropriate to grade level.",
                clarifications: [
                  "Instruction for this benchmark should include text read-alouds and think-alouds aimed at building and activating background knowledge. Review of words learned in this way is critical to building background knowledge and related vocabulary. Texts read aloud can be two grade levels higher than student reading level.",
                  "See Context Clues and Word Relationships.",
                  "See ELA.5.R.3.1 and Elementary Figurative Language.",
                ],
                accessPoints: [
                  "ELA.5.V.1.AP.3 — Identify and use picture clues, context clues, figurative language, word relationships, reference materials and/or background knowledge to determine the meaning of multiple-meaning and unknown words.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15029",
              },
            ],
          },
        ],
      },

      // ─────────────────────────────────────────────────────────────────────
      // STRAND F — Foundational Skills
      // Note: ELA.5.F.1.1 and ELA.5.F.1.2 do not exist at Grade 5 —
      // those benchmarks cover print concepts and phonological awareness,
      // which are mastered by end of Grade 2 in the B.E.S.T. framework.
      // Grade 5 F strand contains only F.1.3 and F.1.4.
      // ─────────────────────────────────────────────────────────────────────
      {
        code: "F",
        displayName: "Foundational Skills",
        groups: [
          // ── F.1 — Learning and Applying Foundational Reading Skills ──────
          {
            code: "ELA.5.F.1",
            displayName: "Learning and Applying Foundational Reading Skills",
            standards: [
              {
                code: "ELA.5.F.1.3",
                description:
                  "Use knowledge of grade-appropriate phonics and word-analysis skills to decode words. Apply knowledge of all letter-sound correspondences, syllabication patterns, and morphology to read and write unfamiliar single-syllable and multisyllabic words in and out of context.",
                clarifications: [],
                accessPoints: [
                  "ELA.5.F.1.AP.3a — Apply knowledge of letter-sound correspondences, syllabication patterns and morphology to read and form familiar single-syllable and multisyllabic words in context.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15004",
              },
              {
                code: "ELA.5.F.1.4",
                description:
                  "Read grade-level texts with accuracy, automaticity, and appropriate prosody or expression.",
                clarifications: [
                  "See Fluency Norms for grade-level norms. Norms are expressed as words correct per minute (WCPM), a measure that combines accuracy with rate.",
                  "Appropriate prosody refers to pausing patterns during oral reading that reflect the punctuation and meaning of a text. See Sample Oral Reading Fluency Rubrics for prosody.",
                  "Grade-level texts, for the purposes of fluency, are those within the grade band on quantitative text complexity measures and appropriate in content and qualitative measures.",
                ],
                accessPoints: [
                  "ELA.5.F.1.AP.4 — Read grade-level texts, at the student's ability level, with accuracy and expression using the student's mode of communication.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15005",
              },
            ],
          },
        ],
      },
    ],
  },
};
