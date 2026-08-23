import type { SubjectSeed } from "./types";

export const standardsElaGrade3: SubjectSeed = {
  slug: "ela_g3",
  domain: "ELA",
  gradeBand: "3",
  framework: "FL_BEST",
  displayName: "Grade 3 English Language Arts",
  catalog: {
    version: "v2",
    label: "Florida Grade 3 ELA — All Standards",
    framework: "FL_BEST",
    strands: [
      // ─────────────────────────────────────────
      // R — Reading
      // ─────────────────────────────────────────
      {
        code: "R",
        displayName: "Reading",
        groups: [
          {
            code: "ELA.3.R.1",
            displayName: "Reading Prose and Poetry",
            standards: [
              {
                code: "ELA.3.R.1.1",
                description:
                  "Explain how one or more characters develop throughout the plot in a literary text.",
                clarifications: [
                  "When explaining character development, students will include character traits, feelings, motivations, and responses to situations.",
                ],
                accessPoints: [
                  "ELA.3.R.1.AP.1 — Identify how a character develops throughout the plot in a literary text.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/15207",
              },
              {
                code: "ELA.3.R.1.2",
                description:
                  "Explain a theme and how it develops, using details, in a literary text.",
                clarifications: [],
                accessPoints: [
                  "ELA.3.R.1.AP.2 — Identify a theme and how it develops, using details, in a literary text.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/15208",
              },
              {
                code: "ELA.3.R.1.3",
                description: "Explain different characters' perspectives in a literary text.",
                clarifications: [
                  "The term perspective means 'a particular attitude toward or way of regarding something.' The term point of view is used when referring to the person of the narrator. This is to prevent confusion and conflation.",
                ],
                accessPoints: [
                  "ELA.3.R.1.AP.3 — Identify different characters' perspectives in a literary text.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/15209",
              },
              {
                code: "ELA.3.R.1.4",
                description:
                  "Identify types of poems: free verse, rhymed verse, haiku, and limerick.",
                clarifications: [
                  "For examples of these forms, see Appendix B.",
                ],
                accessPoints: [
                  "ELA.3.R.1.AP.4 — Identify poems with rhyme and poems without rhyme.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/15210",
              },
            ],
          },
          {
            code: "ELA.3.R.2",
            displayName: "Reading Informational Text",
            standards: [
              {
                code: "ELA.3.R.2.1",
                description:
                  "Explain how text features contribute to meaning and identify the text structures of chronology, comparison, and cause/effect in texts.",
                clarifications: [],
                accessPoints: [
                  "ELA.3.R.2.AP.1 — Identify the text structures of chronological order, comparison and cause/effect in texts.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/15211",
              },
              {
                code: "ELA.3.R.2.2",
                description:
                  "Identify the central idea and explain how relevant details support that idea in a text.",
                clarifications: [],
                accessPoints: [
                  "ELA.3.R.2.AP.2 — Identify the central idea and select relevant details that support that idea in a text.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/Preview/15212",
              },
              {
                code: "ELA.3.R.2.3",
                description:
                  "Explain what evidence the author uses to support an idea or claim in a text.",
                clarifications: [],
                accessPoints: [
                  "ELA.3.R.2.AP.3 — Identify what evidence is included in an informational text that develops the author's purpose.",
                ],
                verificationStatus: "Partially verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/15213",
              },
              {
                code: "ELA.3.R.2.4",
                description:
                  "Identify an author's claim and explain how an author uses evidence to support the claim.",
                clarifications: [],
                accessPoints: [],
                verificationStatus: "Partially verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/Preview/15214",
              },
            ],
          },
          {
            code: "ELA.3.R.3",
            displayName: "Reading Across Genres",
            standards: [
              {
                code: "ELA.3.R.3.1",
                description:
                  "Identify and explain metaphors, personification, and hyperbole in text(s).",
                clarifications: [
                  "In addition to the types of figurative language listed in this benchmark, students are still working with types from previous grades such as simile, alliteration, and idiom. Other examples can be used in instruction.",
                  "See Elementary Figurative Language.",
                ],
                accessPoints: [
                  "ELA.3.R.3.AP.1 — Identify metaphors, personification and hyperbole in text(s).",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/15215",
              },
              {
                code: "ELA.3.R.3.2",
                description:
                  "Summarize a text to enhance comprehension. Include plot and theme for a literary text. Use the central idea and relevant details for an informational text.",
                clarifications: [
                  "Most grade-level texts are appropriate for this benchmark.",
                ],
                accessPoints: [
                  "ELA.3.R.3.AP.2a — Identify the plot for a literary text using the student's mode of communication.",
                  "ELA.3.R.3.AP.2b — Identify the central idea and relevant details for an informational text using the student's mode of communication.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/15216",
              },
              {
                code: "ELA.3.R.3.3",
                description:
                  "Compare and contrast how two authors present information on the same topic or theme.",
                clarifications: [],
                accessPoints: [
                  "ELA.3.R.3.AP.3 — Compare and contrast important information presented by two authors on the same topic or theme.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/15217",
              },
            ],
          },
        ],
      },

      // ─────────────────────────────────────────
      // C — Communication
      // ─────────────────────────────────────────
      {
        code: "C",
        displayName: "Communication",
        groups: [
          {
            code: "ELA.3.C.1",
            displayName: "Communicating Through Writing",
            standards: [
              {
                code: "ELA.3.C.1.1",
                description: "Write in cursive all upper- and lowercase letters.",
                clarifications: [],
                accessPoints: [
                  "ELA.3.C.1.AP.1 — Write cursive letters with a model.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/15220",
              },
              {
                code: "ELA.3.C.1.2",
                description:
                  "Write personal or fictional narratives using a logical sequence of events, appropriate descriptions, dialogue, a variety of transitional words or phrases, and an ending.",
                clarifications: [
                  "See Writing Types.",
                ],
                accessPoints: [
                  "ELA.3.C.1.AP.2 — Write personal or fictional narratives using a logical sequence of events, appropriate details and an ending.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/15218",
              },
              {
                code: "ELA.3.C.1.3",
                description:
                  "Write opinions about a topic or text, include reasons supported by details from one or more sources, use transitions, and provide a conclusion.",
                clarifications: [
                  "See Writing Types.",
                ],
                accessPoints: [
                  "ELA.3.C.1.AP.3 — Write an opinion about a topic with one supporting reason and a conclusion.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/15219",
              },
              {
                code: "ELA.3.C.1.4",
                description:
                  "Write expository texts about a topic, using one or more sources, providing an introduction, facts and details, some elaboration, transitions, and a conclusion.",
                clarifications: [
                  "See Writing Types and Elaborative Techniques.",
                ],
                accessPoints: [
                  "ELA.3.C.1.AP.4 — Write an expository text about a topic, using a source, providing an introduction, facts and a conclusion.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/15221",
              },
              {
                code: "ELA.3.C.1.5",
                description:
                  "Improve writing as needed by planning, revising, and editing with guidance and support from adults and feedback from peers.",
                clarifications: [
                  "'As needed' refers to the fact that sometimes instruction will focus on a specific skill or part of the process. In those instances, only the applicable activity will be engaged in.",
                ],
                accessPoints: [
                  "ELA.3.C.1.AP.5 — Improve writing as needed by planning, revising and editing with guidance, support and modeling from adults and feedback from peers.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/15222",
              },
            ],
          },
          {
            code: "ELA.3.C.2",
            displayName: "Communicating Orally",
            standards: [
              {
                code: "ELA.3.C.2.1",
                description:
                  "Present information orally, in a logical sequence, using nonverbal cues, appropriate volume, and clear pronunciation.",
                clarifications: [
                  "Nonverbal cues appropriate to this grade level are posture, tone, and expressive delivery. Clear pronunciation should be interpreted to mean an understanding and application of phonics rules and sight words as well as care taken in delivery. A student's speech impediment should not be considered as impeding clear pronunciation. This grade level introduces an expectation that the information be presented in a logical sequence. A student may self-correct an error in sequence.",
                  "For further guidance, see the Elementary Oral Communication Rubric.",
                ],
                accessPoints: [
                  "ELA.3.C.2.AP.1 — Express information in a logical sequence, using nonverbal cues, using the student's mode of communication.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/15223",
              },
            ],
          },
          {
            code: "ELA.3.C.3",
            displayName: "Following Conventions",
            standards: [
              {
                code: "ELA.3.C.3.1",
                description:
                  "Follow the rules of standard English grammar, punctuation, capitalization, and spelling appropriate to grade level.",
                clarifications: [
                  "Skills to be mastered at this grade level include: conjugating regular and irregular verb tenses; forming and using regular and frequently occurring irregular plural nouns; using the past tense of frequently occurring irregular verbs; maintaining consistent verb tense across paragraphs; forming and using the progressive and perfect verb tenses; using simple modifiers; using prepositions and prepositional phrases; forming compound sentences; using quotation marks with dialogue and direct quotations; using commas to indicate direct address.",
                  "Skills to be implemented but not yet mastered: subject-verb agreement with intervening clauses; producing complete sentences and correcting fragments and run-ons; using conjunctions; using principal modals; using appositives, main clauses, and subordinate clauses.",
                  "See Convention Progression by Grade Level.",
                ],
                accessPoints: [
                  "ELA.3.C.3.AP.1 — Follow the rules of standard English grammar, punctuation, capitalization and spelling (use interjections; use apostrophes to form contractions; identify quotation marks with dialogue; identify prepositions and prepositional phrases).",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/15224",
              },
            ],
          },
          {
            code: "ELA.3.C.4",
            displayName: "Researching",
            standards: [
              {
                code: "ELA.3.C.4.1",
                description:
                  "Conduct research to answer a question, organizing information about the topic from multiple sources.",
                clarifications: [
                  "While the benchmark does require that students consult multiple sources, there is no requirement that they use every source they consult. Part of the skill in researching is discernment — being able to tell which information is relevant and which sources are trustworthy enough to include.",
                ],
                accessPoints: [
                  "ELA.3.C.4.AP.1 — Participate in research to answer a question, organizing information about the topic from multiple sources.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/15225",
              },
            ],
          },
          {
            code: "ELA.3.C.5",
            displayName: "Creating and Collaborating",
            standards: [
              {
                code: "ELA.3.C.5.1",
                description:
                  "Use two or more multimedia elements to enhance oral or written tasks.",
                clarifications: [
                  "Multimedia elements may include, but are not limited to, drawings, pictures, artifacts, and audio or digital representation. At this grade level, the elements should relate directly to the presentation. The elements can reinforce or complement the information being shared. There is no expectation that the elements be fully integrated into the presentation.",
                ],
                accessPoints: [
                  "ELA.3.C.5.AP.1 — Identify one or more multimedia elements to enhance oral and written tasks.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/15226",
              },
              {
                code: "ELA.3.C.5.2",
                description:
                  "Use digital writing tools individually or collaboratively to plan, draft, and revise writing.",
                clarifications: [],
                accessPoints: [
                  "ELA.3.C.5.AP.2 — Use digital writing tools individually or collaboratively to draft writing with support from adults.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/15227",
              },
            ],
          },
        ],
      },

      // ─────────────────────────────────────────
      // V — Vocabulary
      // ─────────────────────────────────────────
      {
        code: "V",
        displayName: "Vocabulary",
        groups: [
          {
            code: "ELA.3.V.1",
            displayName: "Finding Meaning",
            standards: [
              {
                code: "ELA.3.V.1.1",
                description:
                  "Use grade-level academic vocabulary appropriately in speaking and writing.",
                clarifications: [
                  "Grade-level academic vocabulary consists of words that are likely to appear across subject areas for the current grade level and beyond, vital to comprehension, critical for academic discussions and writing, and usually require explicit instruction.",
                ],
                accessPoints: [
                  "ELA.3.V.1.AP.1 — Identify and use grade-level academic vocabulary appropriately in communication, using the student's mode of communication.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/15228",
              },
              {
                code: "ELA.3.V.1.2",
                description:
                  "Identify and apply knowledge of common Greek and Latin roots, base words, and affixes to determine the meaning of unfamiliar words in grade-level content.",
                clarifications: [
                  "See Common Greek and Latin Roots 3-5 and Affixes.",
                ],
                accessPoints: [
                  "ELA.3.V.1.AP.2 — Identify and use common Greek and Latin roots, base words, and affixes to determine the meaning of unfamiliar words in grade-level content at the student's ability level.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/15229",
              },
              {
                code: "ELA.3.V.1.3",
                description:
                  "Use context clues, figurative language, word relationships, reference materials, and/or background knowledge to determine the meaning of multiple-meaning and unknown words and phrases, appropriate to grade level.",
                clarifications: [
                  "Instruction for this benchmark should include text read-alouds and think-alouds aimed at building and activating background knowledge. Texts read aloud can be two grade levels higher than student reading level.",
                  "See Context Clues and Word Relationships.",
                  "See ELA.3.R.3.1 and Elementary Figurative Language.",
                ],
                accessPoints: [
                  "ELA.3.V.1.AP.3 — Identify and use picture clues, context clues, word relationships, reference materials and/or background knowledge to determine the meaning of multiple-meaning and unknown words appropriate to grade-level content at the student's ability level.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/15230",
              },
            ],
          },
        ],
      },

      // ─────────────────────────────────────────
      // F — Foundational Skills
      // Note: ELA.3.F.1.1 and ELA.3.F.1.2 (print concepts and
      // phonological awareness) are not present at Grade 3; those
      // benchmarks are mastered by the end of Grade 2 in the
      // FL B.E.S.T. progression. Grade 3 F.1 begins at .3.
      // ─────────────────────────────────────────
      {
        code: "F",
        displayName: "Foundational Skills",
        groups: [
          {
            code: "ELA.3.F.1",
            displayName: "Learning and Applying Foundational Reading Skills",
            standards: [
              {
                code: "ELA.3.F.1.3",
                description:
                  "Use knowledge of grade-level phonics and word-analysis skills to decode words. Decode words with common Greek and Latin roots and affixes (See ELA.3.V.1.2). Decode words with common derivational suffixes and describe how they turn words into different parts of speech (e.g., -ful, -less, -est). Decode multisyllabic words.",
                clarifications: [
                  "See Common Greek and Latin Roots 3-5 and Affixes.",
                  "See Affixes and the Parts of Speech They Form.",
                ],
                accessPoints: [
                  "ELA.3.F.1.AP.3a — Decode words with common Greek and Latin roots and affixes (see ELA.3.V.1.2).",
                  "ELA.3.F.1.AP.3b — Decode words with common derivational suffixes and describe how they turn words into different parts of speech (e.g., -ful, -less, -est).",
                  "ELA.3.F.1.AP.3c — Decode multisyllabic words.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/15002",
              },
              {
                code: "ELA.3.F.1.4",
                description:
                  "Read grade-level texts with accuracy, automaticity, and appropriate prosody or expression.",
                clarifications: [
                  "See Fluency Norms for grade-level norms. Norms are expressed as words correct per minute (WCPM), a measure that combines accuracy with rate.",
                  "Appropriate prosody refers to pausing patterns during oral reading that reflect the punctuation and meaning of a text. See Sample Oral Reading Fluency Rubrics for prosody.",
                  "Grade-level texts, for the purposes of fluency, are those within the grade band on quantitative text complexity measures and appropriate in content and qualitative measures.",
                ],
                accessPoints: [
                  "ELA.3.F.1.AP.4 — Read grade-level texts, at the student's ability level, with accuracy and expression using the student's mode of communication.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/15003",
              },
            ],
          },
        ],
      },
    ],
  },
};
