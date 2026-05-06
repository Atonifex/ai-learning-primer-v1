import type { SubjectSeed } from "./types";

export const standardsSocialStudiesGrade3: SubjectSeed = {
  slug: "social_studies_g3",
  domain: "SOCIAL_STUDIES",
  gradeBand: "3",
  framework: "FL_SOCIAL_STUDIES",
  displayName: "Grade 3 Social Studies",
  catalog: {
    version: "v1",
    label: "Florida Grade 3 Social Studies (SS.3.A.1 + SS.3.G.1)",
    framework: "FL_SOCIAL_STUDIES",
    strands: [
      {
        code: "A",
        displayName: "American History",
        groups: [
          {
            code: "SS.3.A.1",
            displayName: "Historical Inquiry and Analysis",
            standards: [
              {
                code: "SS.3.A.1.1",
                description: "Analyze primary and secondary sources.",
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/2961",
              },
              {
                code: "SS.3.A.1.2",
                description:
                  "Utilize technology resources to gather information from primary and secondary sources.",
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/2962",
              },
              {
                code: "SS.3.A.1.3",
                description: "Define terms related to the social sciences.",
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/2963",
              },
            ],
          },
        ],
      },
      {
        code: "G",
        displayName: "Geography",
        groups: [
          {
            code: "SS.3.G.1",
            displayName: "The World in Spatial Terms",
            standards: [
              {
                code: "SS.3.G.1.1",
                description:
                  "Use thematic maps, tables, charts, graphs, and photos to analyze geographic information.",
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/2964",
              },
              {
                code: "SS.3.G.1.2",
                description:
                  "Review map elements including coordinate grid, cardinal/intermediate directions, title, compass rose, scale, and key/legend.",
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/2965",
              },
            ],
          },
        ],
      },
    ],
  },
};
