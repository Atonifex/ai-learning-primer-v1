import type { SubjectSeed } from "../prisma/seeds/types";

export const standardsSocialStudiesGrade4: SubjectSeed = {
  slug: "social_studies_g4",
  domain: "SOCIAL_STUDIES",
  gradeBand: "4",
  framework: "FL_MIXED", // NGSSS (History/Geography/Economics) + 2023 Florida Standards (CG/AA)
  displayName: "Grade 4 Social Studies",
  catalog: {
    version: "v1",
    label: "Florida Grade 4 Social Studies — All Standards",
    framework: "FL_MIXED",
    strands: [
      // ─────────────────────────────────────────────────────────────────────
      // STRAND: American History — Florida Focus (NGSSS)
      // IDs 2994–3021  |  28 benchmarks across 9 standard groups
      // ─────────────────────────────────────────────────────────────────────
      {
        code: "A",
        displayName: "American History — Florida Focus",
        groups: [
          {
            code: "SS.4.A.1",
            displayName: "Historical Inquiry and Analysis",
            standards: [
              {
                code: "SS.4.A.1.1",
                description:
                  "Analyze primary and secondary resources to identify significant individuals and events throughout Florida history.",
                clarifications: [],
                accessPoints: [
                  "SS.4.A.1.AP.1 — Identify and use primary and secondary resources to obtain information related to Florida history.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/2994",
              },
              {
                code: "SS.4.A.1.2",
                description:
                  "Synthesize information related to Florida history through print and electronic media.",
                clarifications: [],
                accessPoints: [
                  "SS.4.A.1.AP.2 — Use print and electronic media to collect information about Florida history.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/2995",
              },
            ],
          },
          {
            code: "SS.4.A.2",
            displayName: "Native Americans in Florida",
            standards: [
              {
                code: "SS.4.A.2.1",
                description: "Compare Native American tribes in Florida.",
                clarifications: [],
                accessPoints: [
                  "SS.4.A.2.AP.1 — Identify important cultural aspects of Native American tribes of Florida.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/2996",
              },
            ],
          },
          {
            code: "SS.4.A.3",
            displayName: "European Contact and Colonial Florida",
            standards: [
              {
                code: "SS.4.A.3.1",
                description:
                  "Identify explorers who came to Florida and the motivations for their expeditions.",
                clarifications: [],
                accessPoints: [
                  "SS.4.A.3.AP.1 — Recognize a European explorer who came to Florida.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/2997",
              },
              {
                code: "SS.4.A.3.2",
                description:
                  "Describe causes and effects of European colonization on the Native American tribes of Florida.",
                clarifications: [],
                accessPoints: [
                  "SS.4.A.3.AP.2 — Identify effects of European colonization on Native American tribes in Florida.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/2998",
              },
              {
                code: "SS.4.A.3.3",
                description:
                  "Identify the significance of St. Augustine as the oldest permanent European settlement in the United States.",
                clarifications: [],
                accessPoints: [
                  "SS.4.A.3.AP.3 — Recognize St. Augustine as the beginning of Spanish colonial settlement in the United States.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/2999",
              },
              {
                code: "SS.4.A.3.4",
                description:
                  "Explain the purpose of and daily life on missions (San Luis de Talimali in present-day Tallahassee).",
                clarifications: [],
                accessPoints: [
                  "SS.4.A.3.AP.4 — Identify a purpose of missions in Florida.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/3000",
              },
              {
                code: "SS.4.A.3.5",
                description:
                  "Identify the significance of Fort Mose as the first free African community in the United States.",
                clarifications: [],
                accessPoints: [
                  "SS.4.A.3.AP.5 — Identify Fort Mose as the first free African community in the United States.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/3001",
              },
              {
                code: "SS.4.A.3.6",
                description: "Identify the effects of Spanish rule in Florida.",
                clarifications: [],
                accessPoints: [
                  "SS.4.A.3.AP.6 — Recognize effects of Spanish rule in early Florida.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/3002",
              },
              {
                code: "SS.4.A.3.7",
                description:
                  "Identify nations (Spain, France, England) that controlled Florida before it became a United States territory.",
                clarifications: [],
                accessPoints: [
                  "SS.4.A.3.AP.7 — Identify a different nation that controlled Florida.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/3003",
              },
              {
                code: "SS.4.A.3.8",
                description:
                  "Explain how the Seminole tribe formed and the purpose for their migration.",
                clarifications: [],
                accessPoints: [
                  "SS.4.A.3.AP.8 — Identify one reason why the Seminole tribe was formed and where they lived.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/3004",
              },
              {
                code: "SS.4.A.3.9",
                description:
                  "Explain how Florida (Adams-Onis Treaty) became a U.S. territory.",
                clarifications: [],
                accessPoints: [
                  "SS.4.A.3.AP.9 — Recognize that Spain gave Florida back to the United States.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/3005",
              },
              {
                code: "SS.4.A.3.10",
                description:
                  "Identify the causes and effects of the Seminole Wars.",
                clarifications: [],
                accessPoints: [
                  "SS.4.A.3.AP.10 — Recognize that the United States fought wars against the Seminole tribe.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/3006",
              },
            ],
          },
          {
            code: "SS.4.A.4",
            displayName: "Territorial Florida",
            standards: [
              {
                code: "SS.4.A.4.1",
                description:
                  "Explain the effects of technological advances on Florida.",
                clarifications: [],
                accessPoints: [
                  "SS.4.A.4.AP.1 — Identify technological advances that helped Florida to grow.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/3007",
              },
              {
                code: "SS.4.A.4.2",
                description: "Describe pioneer life in Florida.",
                clarifications: [],
                accessPoints: [
                  "SS.4.A.4.AP.2 — Identify characteristics of pioneer life in Florida.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/3008",
              },
            ],
          },
          {
            code: "SS.4.A.5",
            displayName: "Civil War and Reconstruction",
            standards: [
              {
                code: "SS.4.A.5.1",
                description:
                  "Describe Florida's involvement (secession, blockades of ports, the battles of Ft. Pickens, Olustee, Ft. Brooke, Natural Bridge, food supply) in the Civil War.",
                clarifications: [],
                accessPoints: [
                  "SS.4.A.5.AP.1 — Recognize that Florida was considered a slave state (South) and battles were fought in Florida during the Civil War.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/3009",
              },
              {
                code: "SS.4.A.5.2",
                description:
                  "Summarize challenges Floridians faced during Reconstruction.",
                clarifications: [],
                accessPoints: [
                  "SS.4.A.5.AP.2 — Recognize the effects of Reconstruction in Florida.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/3010",
              },
            ],
          },
          {
            code: "SS.4.A.6",
            displayName: "Late 19th and Early 20th Century Florida",
            standards: [
              {
                code: "SS.4.A.6.1",
                description:
                  "Describe the economic development of Florida's major industries.",
                clarifications: [],
                accessPoints: [
                  "SS.4.A.6.AP.1 — Recognize Florida's major industries.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/3011",
              },
              {
                code: "SS.4.A.6.2",
                description:
                  "Summarize contributions immigrant groups made to Florida.",
                clarifications: [],
                accessPoints: [
                  "SS.4.A.6.AP.2 — Identify contributions of immigrants to Florida.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/3012",
              },
              {
                code: "SS.4.A.6.3",
                description:
                  "Describe the contributions of significant individuals to Florida.",
                clarifications: [],
                accessPoints: [
                  "SS.4.A.6.AP.3 — Identify the contributions of significant individuals to Florida.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/3013",
              },
              {
                code: "SS.4.A.6.4",
                description:
                  "Describe effects of the Spanish American War on Florida.",
                clarifications: [],
                accessPoints: [
                  "SS.4.A.6.AP.4 — Recognize ways that Florida changed during the Spanish American War.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/3014",
              },
            ],
          },
          {
            code: "SS.4.A.7",
            displayName: "Florida in the 1920s–1940s",
            standards: [
              {
                code: "SS.4.A.7.1",
                description:
                  "Describe the causes and effects of the 1920's Florida land boom and bust.",
                clarifications: [],
                accessPoints: [
                  "SS.4.A.7.AP.1 — Identify a basic cause and effect of the 1920s Florida land boom and bust.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/3015",
              },
              {
                code: "SS.4.A.7.2",
                description:
                  "Summarize challenges Floridians faced during the Great Depression.",
                clarifications: [],
                accessPoints: [
                  "SS.4.A.7.AP.2 — Identify a challenge Floridians faced during the Great Depression.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/3016",
              },
            ],
          },
          {
            code: "SS.4.A.8",
            displayName: "Modern Florida",
            standards: [
              {
                code: "SS.4.A.8.1",
                description:
                  "Identify Florida's role in the Civil Rights Movement.",
                clarifications: [],
                accessPoints: [
                  "SS.4.A.8.AP.1 — Recognize that Florida played a role in the Civil Rights Movement.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/3017",
              },
              {
                code: "SS.4.A.8.2",
                description:
                  "Describe how and why immigration impacts Florida today.",
                clarifications: [],
                accessPoints: [
                  "SS.4.A.8.AP.2 — Identify how immigration impacts Florida today.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/3018",
              },
              {
                code: "SS.4.A.8.3",
                description:
                  "Describe the effect of the United States' space program on Florida's economy and growth.",
                clarifications: [],
                accessPoints: [
                  "SS.4.A.8.AP.3 — Recognize an impact the space program has on Florida's growth.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/3019",
              },
              {
                code: "SS.4.A.8.4",
                description:
                  "Explain how tourism affects Florida's economy and growth.",
                clarifications: [],
                accessPoints: [
                  "SS.4.A.8.AP.4 — Recognize that tourism brings people and money to Florida.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/3020",
              },
            ],
          },
          {
            code: "SS.4.A.9",
            displayName: "Chronological Thinking",
            standards: [
              {
                code: "SS.4.A.9.1",
                description:
                  "Utilize timelines to sequence key events in Florida history.",
                clarifications: [],
                accessPoints: [
                  "SS.4.A.9.AP.1 — Complete a timeline to sequence major events in Florida history.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/3021",
              },
            ],
          },
        ],
      },

      // ─────────────────────────────────────────────────────────────────────
      // STRAND: Geography (NGSSS)
      // IDs 3022–3025  |  4 benchmarks
      // ─────────────────────────────────────────────────────────────────────
      {
        code: "G",
        displayName: "Geography",
        groups: [
          {
            code: "SS.4.G.1",
            displayName: "Florida Physical and Cultural Geography",
            standards: [
              {
                code: "SS.4.G.1.1",
                description: "Identify physical features of Florida.",
                clarifications: [],
                accessPoints: [
                  "SS.4.G.1.AP.1 — Recognize selected physical features of Florida.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/3022",
              },
              {
                code: "SS.4.G.1.2",
                description: "Locate and label cultural features on a Florida map.",
                clarifications: [],
                accessPoints: [
                  "SS.4.G.1.AP.2 — Identify cultural features on a Florida map.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/3023",
              },
              {
                code: "SS.4.G.1.3",
                description: "Explain how weather impacts Florida.",
                clarifications: [],
                accessPoints: [
                  "SS.4.G.1.AP.3 — Recognize an effect of weather in Florida.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/3024",
              },
              {
                code: "SS.4.G.1.4",
                description:
                  "Interpret political and physical maps using map elements (title, compass rose, cardinal directions, intermediate directions, symbols, legend, scale, longitude, latitude).",
                clarifications: [],
                accessPoints: [
                  "SS.4.G.1.AP.4 — Identify information provided on maps using the title, compass rose, cardinal and intermediate directions, symbols, and key/legend.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/3025",
              },
            ],
          },
        ],
      },

      // ─────────────────────────────────────────────────────────────────────
      // STRAND: Economics (NGSSS)
      // IDs 3026–3027  |  2 benchmarks
      // ─────────────────────────────────────────────────────────────────────
      {
        code: "E",
        displayName: "Economics",
        groups: [
          {
            code: "SS.4.E.1",
            displayName: "Florida's Economy",
            standards: [
              {
                code: "SS.4.E.1.1",
                description:
                  "Identify entrepreneurs from various social and ethnic backgrounds who have influenced Florida and local economy.",
                clarifications: [],
                accessPoints: [
                  "SS.4.E.1.AP.1 — Recognize a contribution of an entrepreneur who influenced Florida.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/3026",
              },
              {
                code: "SS.4.E.1.2",
                description:
                  "Explain Florida's role in the national and international economy and conditions that attract businesses to the state.",
                clarifications: [],
                accessPoints: [
                  "SS.4.E.1.AP.2 — Identify important economic contributions of Florida.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/3027",
              },
            ],
          },
        ],
      },

      // ─────────────────────────────────────────────────────────────────────
      // STRAND: Civics and Government — 2023 Florida Standards
      // IDs 16062–16067  |  6 benchmarks
      // Replaces archived NGSSS SS.4.C strand (IDs 3028–3033)
      // ─────────────────────────────────────────────────────────────────────
      {
        code: "CG",
        displayName: "Civics and Government",
        groups: [
          {
            code: "SS.4.CG.1",
            displayName: "Florida's Constitution",
            standards: [
              {
                code: "SS.4.CG.1.1",
                description:
                  "Explain why the Florida government has a written Constitution.",
                clarifications: [
                  "Students will recognize that every state has a state constitution.",
                  "Students will explain the relationship between a written constitution, the government established, and the citizens.",
                ],
                accessPoints: [
                  "SS.4.CG.1.AP.1 — Recognize that Florida's constitution protects the rights of Florida's citizens and identifies the parts and functions of state government.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/16062",
              },
            ],
          },
          {
            code: "SS.4.CG.2",
            displayName: "Civic Participation and Representative Government",
            standards: [
              {
                code: "SS.4.CG.2.1",
                description:
                  "Identify and describe how citizens work with local and state governments to solve problems.",
                clarifications: [
                  "Students will explain how public issues, such as taxation, roads, zoning, and schools, impact citizens' daily lives.",
                  "Students will describe how citizens can help solve community and state problems (e.g., attending government meetings, communicating with their elected representatives).",
                ],
                accessPoints: [
                  "SS.4.CG.2.AP.1 — Recognize how citizens work with government to solve community problems.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/16063",
              },
              {
                code: "SS.4.CG.2.2",
                description:
                  "Explain the importance of voting, public service, and volunteerism to the state and nation.",
                clarifications: [
                  "Students will explain how voting, public service, and volunteerism contribute to the preservation of the republic.",
                  "Students will discuss different types of public service and volunteerism.",
                ],
                accessPoints: [
                  "SS.4.CG.2.AP.2 — Identify different types of public service and volunteerism.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/16064",
              },
              {
                code: "SS.4.CG.2.3",
                description:
                  "Identify individuals who represent the citizens of Florida at the state level.",
                clarifications: [
                  "Students will identify their local state senator and state representative.",
                  "Students will identify appropriate methods for communicating with elected officials.",
                  "Students will recognize that Florida has a representative government.",
                ],
                accessPoints: [
                  "SS.4.CG.2.AP.3 — Recognize that Florida has a representative government.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/16065",
              },
            ],
          },
          {
            code: "SS.4.CG.3",
            displayName: "Structure of Government",
            standards: [
              {
                code: "SS.4.CG.3.1",
                description:
                  "Explain the structure and functions of the legislative, executive, and judicial branches of government in Florida.",
                clarifications: [
                  "Students will compare the powers of Florida's three branches of government.",
                  "Students will explain how the Declaration of Rights in the Florida Constitution protects the rights of citizens.",
                ],
                accessPoints: [
                  "SS.4.CG.3.AP.1 — Recognize Florida's three branches of government, including legislative (makes laws), judicial (interprets laws), and executive (enforces laws).",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/16066",
              },
              {
                code: "SS.4.CG.3.2",
                description:
                  "Compare the structure, functions, and processes of local and state government.",
                clarifications: [
                  "Students will identify how government is organized at the local and state level including, but not limited to, legislative branch (e.g., legislature, city/county commission), executive branch (e.g., governor, mayor) and judicial branch (e.g., county and circuit courts).",
                ],
                accessPoints: [
                  "SS.4.CG.3.AP.2 — Identify the structures of local and state governments.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/16067",
              },
            ],
          },
        ],
      },

      // ─────────────────────────────────────────────────────────────────────
      // STRAND: African American History — 2023 Florida Standards
      // ID 116280  |  1 benchmark
      // ─────────────────────────────────────────────────────────────────────
      {
        code: "AA",
        displayName: "African American History",
        groups: [
          {
            code: "SS.4.AA.1",
            displayName: "African American Community Leaders in Florida",
            standards: [
              {
                code: "SS.4.AA.1.1",
                description:
                  'Identify African American community leaders who made positive contributions in the state of Florida (e.g., Zora Neale Hurston, Florida Highwaymen, Mary McLeod Bethune, Evan B. Forde, Bessie Coleman, Gen. Daniel "Chappie" James, Bob Hayes, Sylvia Fowles).',
                clarifications: [],
                accessPoints: [
                  'SS.4.AA.1.AP.1 — Identify an African American community leader who made positive contributions in the state of Florida (e.g., Zora Neale Hurston, Florida Highwaymen, Mary McLeod Bethune, Evan B. Forde, Bessie Coleman, Gen. Daniel "Chappie" James, Bob Hayes, Sylvia Fowles).',
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/116280",
              },
            ],
          },
        ],
      },
    ],
  },
};
