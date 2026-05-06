import type { SubjectSeed } from "./types";

export const standardsScienceGrade3: SubjectSeed = {
  slug: "science_g3",
  domain: "SCIENCE",
  gradeBand: "3",
  framework: "FL_SCIENCE",
  displayName: "Grade 3 Science",
  catalog: {
    version: "v1",
    label: "Florida Grade 3 Science (SC.3.N.1 + SC.3.N.3)",
    framework: "FL_SCIENCE",
    strands: [
      {
        code: "N",
        displayName: "Nature of Science",
        groups: [
          {
            code: "SC.3.N.1",
            displayName: "The Practice of Science",
            standards: [
              {
                code: "SC.3.N.1.1",
                description:
                  "Raise questions about the natural world, investigate, and generate explanations based on explorations.",
                contentComplexity: "Level 3",
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/Preview/1626",
              },
              {
                code: "SC.3.N.1.2",
                description:
                  "Compare observations made by different groups using the same tools and seek reasons for differences.",
                contentComplexity: "Level 3",
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/Preview/1627",
              },
              {
                code: "SC.3.N.1.3",
                description: "Keep records as evidence of science investigations.",
                verificationStatus: "Partially verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/1628",
              },
              {
                code: "SC.3.N.1.4",
                description: "Recognize the importance of communication among scientists.",
                verificationStatus: "Partially verified",
              },
              {
                code: "SC.3.N.1.5",
                description:
                  "Recognize that scientists question, discuss, and check each other's evidence and explanations.",
                verificationStatus: "Partially verified",
              },
              {
                code: "SC.3.N.1.6",
                description: "Infer based on observation.",
                verificationStatus: "Needs CPALMS verification",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/Preview/1635",
              },
              {
                code: "SC.3.N.1.7",
                description:
                  "Explain that empirical evidence is observations or measurements used to validate explanations.",
                contentComplexity: "Level 3",
                verificationStatus: "Fully verified",
              },
            ],
          },
          {
            code: "SC.3.N.3",
            displayName: "The Role of Theories, Laws, Hypotheses, and Models",
            standards: [
              {
                code: "SC.3.N.3.1",
                description:
                  "Recognize that words in science can have different or more specific meanings than everyday language.",
                contentComplexity: "Level 2",
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/1636",
              },
              {
                code: "SC.3.N.3.2",
                description: "Recognize that scientists use models to help understand and explain how things work.",
                contentComplexity: "Level 1",
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/Preview/1637",
              },
              {
                code: "SC.3.N.3.3",
                description:
                  "Recognize that all models are approximations of natural phenomena and do not perfectly account for all observations.",
                contentComplexity: "Level 2",
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/Preview/1638",
              },
            ],
          },
        ],
      },
    ],
  },
};
