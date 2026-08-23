import type { SubjectSeed } from "../prisma/seeds/types";

export const standardsElaGrade4: SubjectSeed = {
  slug: "ela_g4",
  domain: "ELA",
  gradeBand: "4",
  framework: "FL_BEST",
  displayName: "Grade 4 English Language Arts",
  catalog: {
    version: "v2",
    label: "Florida Grade 4 ELA — All Standards",
    framework: "FL_BEST",
    strands: [
      // ─────────────────────────────────────────────────────────────────────
      // R — READING
      // ─────────────────────────────────────────────────────────────────────
      {
        code: "R",
        displayName: "Reading",
        groups: [
          // ── R.1: Reading Prose and Poetry ─────────────────────────────────
          {
            code: "ELA.4.R.1",
            displayName: "Reading Prose and Poetry",
            standards: [
              {
                code: "ELA.4.R.1.1",
                description:
                  "Explain how setting, events, conflict, and character development contribute to the plot in a literary text.",
                clarifications: [],
                accessPoints: [
                  "ELA.4.R.1.AP.1 — Show how setting, events, conflict and character development relate to the plot.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/14957",
              },
              {
                code: "ELA.4.R.1.2",
                description:
                  "Explain a stated or implied theme and how it develops, using details, in a literary text.",
                clarifications: [
                  "Clarification 1: Explanation should include how characters respond to situations and how the speaker reflects upon a topic.",
                ],
                accessPoints: [
                  "ELA.4.R.1.AP.2 — Identify a stated theme and how it develops.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/14958",
              },
              {
                code: "ELA.4.R.1.3",
                description:
                  "Identify the narrator's point of view and explain the difference between a narrator's point of view and character perspective in a literary text.",
                clarifications: [
                  "Clarification 1: Perspective refers to a character's attitude toward events or other characters. Point of view refers to the grammatical person of the narrator (first, second, or third person).",
                ],
                accessPoints: [
                  "ELA.4.R.1.AP.3 — Identify the narrator's point of view and character perspective.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/14959",
              },
              {
                code: "ELA.4.R.1.4",
                description:
                  "Explain how rhyme and structure create meaning in a poem.",
                clarifications: [],
                accessPoints: [
                  "ELA.4.R.1.AP.4 — Identify repeated words, rhyme or phrases that create meaning in a poem.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/14960",
              },
            ],
          },

          // ── R.2: Reading Informational Text ──────────────────────────────
          {
            code: "ELA.4.R.2",
            displayName: "Reading Informational Text",
            standards: [
              {
                code: "ELA.4.R.2.1",
                description:
                  "Explain how text features contribute to the meaning and identify the text structures of problem/solution, sequence, and description in texts.",
                clarifications: [],
                accessPoints: [
                  "ELA.4.R.2.AP.1 — Identify text structures of problem/solution, sequence, and description.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/14961",
              },
              {
                code: "ELA.4.R.2.2",
                description:
                  "Explain how relevant details support the central idea, implied or explicit.",
                clarifications: [],
                accessPoints: [
                  "ELA.4.R.2.AP.2 — Identify relevant details that support an explicit central idea.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/14962",
              },
              {
                code: "ELA.4.R.2.3",
                description:
                  "Explain an author's perspective toward a topic in an informational text.",
                clarifications: [
                  "Clarification 1: Perspective is defined as \"a particular attitude toward or way of regarding something.\"",
                ],
                accessPoints: [
                  "ELA.4.R.2.AP.3 — Explain an author's perspective toward a topic.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/14963",
              },
              {
                code: "ELA.4.R.2.4",
                description:
                  "Explain an author's claim and the reasons and evidence used to support the claim.",
                clarifications: [],
                accessPoints: [
                  "ELA.4.R.2.AP.4 — Identify an author's claim by selecting evidence and a reason.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/14964",
              },
            ],
          },

          // ── R.3: Reading Across Genres ────────────────────────────────────
          {
            code: "ELA.4.R.3",
            displayName: "Reading Across Genres",
            standards: [
              {
                code: "ELA.4.R.3.1",
                description:
                  "Explain how figurative language contributes to meaning in text(s).",
                clarifications: [
                  "Clarification 1: Figurative language at this grade level includes metaphor, simile, alliteration, personification, hyperbole, and idiom.",
                  "Clarification 2: See Elementary Figurative Language (Appendix D) — https://cpalmsmediaprod.blob.core.windows.net/uploads/docs/standards/best/la/appendixd.pdf",
                ],
                accessPoints: [
                  "ELA.4.R.3.AP.1 — Identify examples of when figurative language is used to contribute to meaning.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/14965",
              },
              {
                code: "ELA.4.R.3.2",
                description:
                  "Summarize a text to enhance comprehension. a. Include plot and theme for a literary text. b. Include the central idea and relevant details for an informational text.",
                clarifications: [
                  "Clarification 1: Most grade-level texts are appropriate for summarization tasks.",
                ],
                accessPoints: [
                  "ELA.4.R.3.AP.2a — Identify plot and theme to summarize a literary text.",
                  "ELA.4.R.3.AP.2b — Identify central idea and relevant details to summarize an informational text.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/14966",
              },
              {
                code: "ELA.4.R.3.3",
                description:
                  "Compare and contrast accounts of the same event using primary and/or secondary sources.",
                clarifications: [
                  "Clarification 1: Introduce the terms primary sources and secondary sources at this grade level.",
                ],
                accessPoints: [
                  "ELA.4.R.3.AP.3 — Compare a primary and secondary source on the same event.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/14967",
              },
            ],
          },
        ],
      },

      // ─────────────────────────────────────────────────────────────────────
      // C — COMMUNICATION
      // ─────────────────────────────────────────────────────────────────────
      {
        code: "C",
        displayName: "Communication",
        groups: [
          // ── C.1: Communicating Through Writing ───────────────────────────
          {
            code: "ELA.4.C.1",
            displayName: "Communicating Through Writing",
            standards: [
              {
                code: "ELA.4.C.1.1",
                description: "Demonstrate legible cursive writing skills.",
                clarifications: [
                  "Clarification 1: Students will produce cursive writing that can be consistently read by others.",
                ],
                accessPoints: [
                  "ELA.4.C.1.AP.1 — Write cursive letters.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/14968",
              },
              {
                code: "ELA.4.C.1.2",
                description:
                  "Write personal or fictional narratives using a logical sequence of events and demonstrating an effective use of techniques such as descriptions and transitional words and phrases.",
                clarifications: [
                  "Clarification 1: Dialogue was introduced in Grade 3; students continue practicing its use in narratives.",
                  "Clarification 2: See Writing Types (Appendix A) — https://cpalmsmediaprod.blob.core.windows.net/uploads/docs/standards/best/la/appendixa.pdf",
                ],
                accessPoints: [
                  "ELA.4.C.1.AP.2 — Write personal or fictional narratives using logical sequence, appropriate details, transitional words, and an ending.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/14969",
              },
              {
                code: "ELA.4.C.1.3",
                description:
                  "Write to make a claim supporting a perspective with logical reasons, using evidence from multiple sources, elaboration, and an organizational structure with transitions.",
                clarifications: [
                  "Clarification 1: See Writing Types (Appendix A) — https://cpalmsmediaprod.blob.core.windows.net/uploads/docs/standards/best/la/appendixa.pdf and Elaborative Techniques (Appendix C) — https://cpalmsmediaprod.blob.core.windows.net/uploads/docs/standards/best/la/appendixc.pdf",
                ],
                accessPoints: [
                  "ELA.4.C.1.AP.3 — Write a claim about a topic using evidence from a source with transitions.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/14970",
              },
              {
                code: "ELA.4.C.1.4",
                description:
                  "Write expository texts about a topic, using multiple sources, elaboration, and an organizational structure with transitions.",
                clarifications: [
                  "Clarification 1: See Writing Types (Appendix A) — https://cpalmsmediaprod.blob.core.windows.net/uploads/docs/standards/best/la/appendixa.pdf and Elaborative Techniques (Appendix C) — https://cpalmsmediaprod.blob.core.windows.net/uploads/docs/standards/best/la/appendixc.pdf",
                ],
                accessPoints: [
                  "ELA.4.C.1.AP.4 — Write an expository text about a topic, using a source, providing an introduction, facts and a conclusion with transitions.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/14971",
              },
              {
                code: "ELA.4.C.1.5",
                description:
                  "Improve writing by planning, revising, and editing, with guidance and support from adults and feedback from peers.",
                clarifications: [],
                accessPoints: [
                  "ELA.4.C.1.AP.5 — Improve writing as needed by planning, revising and editing with guidance, support and modeling.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/14972",
              },
            ],
          },

          // ── C.2: Communicating Orally ─────────────────────────────────────
          {
            code: "ELA.4.C.2",
            displayName: "Communicating Orally",
            standards: [
              {
                code: "ELA.4.C.2.1",
                description:
                  "Present information orally, in a logical sequence, using nonverbal cues, appropriate volume, and clear pronunciation.",
                clarifications: [
                  "Clarification 1: Nonverbal cues include posture, tone, expressive delivery, focus on the audience, and facial expression.",
                  "Clarification 2: See Elementary Oral Communication Rubric for assessment guidance.",
                ],
                accessPoints: [
                  "ELA.4.C.2.AP.1 — Express information in a logical sequence using nonverbal cues.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/14973",
              },
            ],
          },

          // ── C.3: Following Conventions ────────────────────────────────────
          {
            code: "ELA.4.C.3",
            displayName: "Following Conventions",
            standards: [
              {
                code: "ELA.4.C.3.1",
                description:
                  "Follow the rules of standard English grammar, punctuation, capitalization, and spelling appropriate to grade level.",
                clarifications: [
                  "Clarification 1: Grade 4 mastery expectations include subject-verb agreement with intervening clauses, complete sentences (fragments and run-ons), and conjunctions. Grade 4 implementation (practicing but not yet mastered) expectations include principal modals, appositives, main/subordinate clauses, shifts in tense and number, conjunctions joining words and phrases, verbals (gerunds, infinitives, participial phrases), and pronouns (case, number, and person).",
                  "Clarification 2: See Convention Progression by Grade Level for the full K–12 scope-and-sequence of grammar mastery expectations.",
                ],
                accessPoints: [
                  "ELA.4.C.3.AP.1 — Follow rules of standard English grammar, punctuation, capitalization and spelling.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/14974",
              },
            ],
          },

          // ── C.4: Researching ──────────────────────────────────────────────
          {
            code: "ELA.4.C.4",
            displayName: "Researching",
            standards: [
              {
                code: "ELA.4.C.4.1",
                description:
                  "Conduct research to answer a question, organizing information about the topic and using multiple valid sources.",
                clarifications: [
                  "Clarification 1: Discernment is part of the skill; students are not required to use every source consulted.",
                ],
                accessPoints: [
                  "ELA.4.C.4.AP.1 — Participate in research, organizing information using provided valid sources.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/14975",
              },
            ],
          },

          // ── C.5: Creating and Collaborating ──────────────────────────────
          {
            code: "ELA.4.C.5",
            displayName: "Creating and Collaborating",
            standards: [
              {
                code: "ELA.4.C.5.1",
                description:
                  "Arrange multimedia elements to create emphasis in oral or written tasks.",
                clarifications: [
                  "Clarification 1: Tasks must include more than one multimedia element, smoothly integrated, used to emphasize a specific point.",
                ],
                accessPoints: [
                  "ELA.4.C.5.AP.1 — Use one or more multimedia elements to create emphasis.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/14976",
              },
              {
                code: "ELA.4.C.5.2",
                description:
                  "Use digital writing tools individually or collaboratively to plan, draft, and revise writing.",
                clarifications: [],
                accessPoints: [
                  "ELA.4.C.5.AP.2 — Use digital writing tools individually or collaboratively to draft and revise writing with support.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/14977",
              },
            ],
          },
        ],
      },

      // ─────────────────────────────────────────────────────────────────────
      // V — VOCABULARY
      // ─────────────────────────────────────────────────────────────────────
      {
        code: "V",
        displayName: "Vocabulary",
        groups: [
          {
            code: "ELA.4.V.1",
            displayName: "Finding Meaning",
            standards: [
              {
                code: "ELA.4.V.1.1",
                description:
                  "Use grade-level academic vocabulary appropriately in speaking and writing.",
                clarifications: [
                  "Clarification 1: Academic vocabulary refers to words likely to appear across subject areas, vital to comprehension, and requiring explicit instruction.",
                ],
                accessPoints: [
                  "ELA.4.V.1.AP.1 — Identify and use grade-level academic vocabulary appropriately.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/14978",
              },
              {
                code: "ELA.4.V.1.2",
                description:
                  "Apply knowledge of common Greek and Latin roots, base words, and affixes to determine the meaning of unfamiliar words in grade-level content.",
                clarifications: [
                  "Clarification 1: See Common Greek and Latin Roots 3–5 and Affixes documents for grade-level morpheme expectations.",
                ],
                accessPoints: [
                  "ELA.4.V.1.AP.2 — Identify and use common Greek and Latin roots, base words, and affixes.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/14979",
              },
              {
                code: "ELA.4.V.1.3",
                description:
                  "Use context clues, figurative language, word relationships, reference materials, and/or background knowledge to determine the meaning of multiple-meaning and unknown words and phrases, appropriate to grade level.",
                clarifications: [
                  "Clarification 1: Includes text read-alouds and think-alouds; texts read aloud to students may be up to two grade levels above the student's grade level.",
                  "Clarification 2: See Context Clues and Word Relationships for strategy definitions.",
                  "Clarification 3: See ELA.4.R.3.1 and Elementary Figurative Language (Appendix D) — https://cpalmsmediaprod.blob.core.windows.net/uploads/docs/standards/best/la/appendixd.pdf",
                ],
                accessPoints: [
                  "ELA.4.V.1.AP.3 — Identify and use picture clues, context clues, word relationships, reference materials and/or background knowledge.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/14980",
              },
            ],
          },
        ],
      },

      // ─────────────────────────────────────────────────────────────────────
      // F — FOUNDATIONAL SKILLS
      // ─────────────────────────────────────────────────────────────────────
      {
        code: "F",
        displayName: "Foundational Skills",
        groups: [
          {
            code: "ELA.4.F.1",
            displayName: "Learning and Applying Foundational Reading Skills",
            standards: [
              {
                code: "ELA.4.F.1.3",
                description:
                  "Use knowledge of grade-level phonics and word-analysis skills to decode words. Apply knowledge of all letter-sound correspondences, syllabication patterns, and morphology to read and write unfamiliar single-syllable and multisyllabic words in and out of context.",
                clarifications: [
                  "Clarification 1: Phonics instruction at this grade level should move toward syllabication and morpheme-level analysis (e.g., \"en-ter-tain\" or \"enter-tain\") rather than letter-by-letter decoding (e.g., \"e-n-t-e-r-t-a-i-n\").",
                ],
                accessPoints: [
                  "ELA.4.F.1.AP.3a — Apply knowledge of letter-sound correspondences, syllabication patterns, and morphology to decode words.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/14955",
              },
              {
                code: "ELA.4.F.1.4",
                description:
                  "Read grade-level texts with accuracy, automaticity, and appropriate prosody or expression.",
                clarifications: [
                  "Clarification 1: See Fluency Norms (Appendix E) — https://cpalmsmediaprod.blob.core.windows.net/uploads/docs/standards/best/la/appendixe.pdf. Grade 4 Hasbrouck-Tindal norms (50th percentile): 94 WCPM fall / 112 WCPM winter / 123 WCPM spring.",
                  "Clarification 2: Prosody refers to pausing patterns, phrasing, and expressive interpretation during oral reading. See Sample Oral Reading Fluency Rubrics (Appendix E).",
                  "Clarification 3: Grade-level texts are defined as texts within the Grade 4 quantitative band (740L–1010L Lexile; Flesch-Kincaid 4.51–7.73).",
                ],
                accessPoints: [
                  "ELA.4.F.1.AP.4 — Read grade-level texts with accuracy and expression.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/14956",
              },
            ],
          },
        ],
      },
    ],
  },
};
