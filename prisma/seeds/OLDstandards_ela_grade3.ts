import type { SubjectSeed } from "./types";

export const standardsElaGrade3: SubjectSeed = {
  slug: "ela_g3",
  domain: "ELA",
  gradeBand: "3",
  framework: "FL_BEST",
  displayName: "Grade 3 English Language Arts",
  catalog: {
    version: "v1",
    label: "Florida Grade 3 ELA (R.1 + R.2)",
    framework: "FL_BEST",
    strands: [
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
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/15207",
              },
              {
                code: "ELA.3.R.1.2",
                description:
                  "Explain a theme and how it develops, using details, in a literary text.",
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/15208",
              },
              {
                code: "ELA.3.R.1.3",
                description: "Explain different characters' perspectives in a literary text.",
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/15209",
              },
              {
                code: "ELA.3.R.1.4",
                description: "Identify types of poems: free verse, rhymed verse, haiku, and limerick.",
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
                  "Explain how text features contribute to meaning and identify chronology, comparison, and cause/effect structures.",
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/15211",
              },
              {
                code: "ELA.3.R.2.2",
                description:
                  "Identify the central idea and explain how relevant details support that idea in a text.",
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/Preview/15212",
              },
              {
                code: "ELA.3.R.2.3",
                description: "Explain what evidence the author uses to support an idea or claim in a text.",
                verificationStatus: "Partially verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/15213",
              },
              {
                code: "ELA.3.R.2.4",
                description:
                  "Identify an author's claim and explain how an author uses evidence to support the claim.",
                verificationStatus: "Partially verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/Preview/15214",
              },
            ],
          },
        ],
      },
    ],
  },
};
