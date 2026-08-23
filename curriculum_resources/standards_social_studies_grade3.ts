import type { SubjectSeed } from "../prisma/seeds/types";

export const standardsSocialStudiesGrade3: SubjectSeed = {
  slug: "social_studies_g3",
  domain: "SOCIAL_STUDIES",
  gradeBand: "3",
  framework: "FL_MIXED", // NGSSS (History/Geography/Economics) + 2023 Florida Standards (CG/AA)
  displayName: "Grade 3 Social Studies",
  catalog: {
    version: "v1",
    label: "Florida Grade 3 Social Studies — All Standards",
    framework: "FL_MIXED",
    strands: [
      // ─────────────────────────────────────────────────────────────────────
      // STRAND: American History (NGSSS 2014)
      // ─────────────────────────────────────────────────────────────────────
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
                clarifications: [],
                accessPoints: [
                  "SS.3.A.1.AP.1 — Identify and use primary and secondary sources to obtain information.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/2961",
              },
              {
                code: "SS.3.A.1.2",
                description:
                  "Utilize technology resources to gather information from primary and secondary sources.",
                clarifications: [],
                accessPoints: [
                  "SS.3.A.1.AP.2 — Use technology resources to gather information about a primary or secondary source.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/2962",
              },
              {
                code: "SS.3.A.1.3",
                description: "Define terms related to the social sciences.",
                clarifications: [],
                accessPoints: [
                  "SS.3.A.1.AP.3 — Recognize that the terms history, geography, economics, civics, and government are related to social sciences.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/2963",
              },
            ],
          },
        ],
      },

      // ─────────────────────────────────────────────────────────────────────
      // STRAND: Geography (NGSSS 2014)
      // ─────────────────────────────────────────────────────────────────────
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
                clarifications: [],
                accessPoints: [
                  "SS.3.G.1.AP.1 — Use a thematic map or chart to identify selected geographic information, such as land and body of water on a map or population on a chart.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/2964",
              },
              {
                code: "SS.3.G.1.2",
                description:
                  "Review basic map elements (coordinate grid, cardinal and intermediate directions, title, compass rose, scale, key/legend with symbols).",
                clarifications: [],
                accessPoints: [
                  "SS.3.G.1.AP.2 — Identify elements on a map, such as title, key/legend, cardinal directions, compass rose, and coordinate grid.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/2965",
              },
              {
                code: "SS.3.G.1.3",
                description: "Label the continents and oceans on a world map.",
                clarifications: [],
                accessPoints: [
                  "SS.3.G.1.AP.3 — Identify selected continents and oceans on a world map.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/2966",
              },
              {
                code: "SS.3.G.1.4",
                description:
                  "Name and identify the purpose of maps (physical, political, elevation, population).",
                clarifications: [],
                accessPoints: [
                  "SS.3.G.1.AP.4 — Recognize a physical and a political map.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/2967",
              },
              {
                code: "SS.3.G.1.5",
                description:
                  "Compare maps and globes to develop an understanding of the concept of distortion.",
                clarifications: [],
                accessPoints: [
                  "SS.3.G.1.AP.5 — Identify differences between maps and globes.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/2968",
              },
              {
                code: "SS.3.G.1.6",
                description:
                  "Use maps to identify different types of scale to measure distances between two places.",
                clarifications: [],
                accessPoints: [
                  "SS.3.G.1.AP.6 — Use maps to identify distances between two places.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/2969",
              },
            ],
          },
          {
            code: "SS.3.G.2",
            displayName: "Places and Regions",
            standards: [
              {
                code: "SS.3.G.2.1",
                description:
                  "Label the countries and commonwealths in North America (Canada, United States, Mexico) and in the Caribbean (Puerto Rico, Cuba, Bahamas, Dominican Republic, Haiti, Jamaica).",
                clarifications: [],
                accessPoints: [
                  "SS.3.G.2.AP.1 — Recognize North America as Canada, the United States, and Mexico on a map.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/2970",
              },
              {
                code: "SS.3.G.2.2",
                description: "Identify the five regions of the United States.",
                clarifications: [],
                accessPoints: [
                  "SS.3.G.2.AP.2 — Recognize north, south, east, and west as they relate to the regions of the United States.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/2971",
              },
              {
                code: "SS.3.G.2.3",
                description: "Label the states in each of the five regions of the United States.",
                clarifications: [],
                accessPoints: [
                  "SS.3.G.2.AP.3 — Recognize selected states in each of the five regions of the United States.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/2972",
              },
              {
                code: "SS.3.G.2.4",
                description:
                  "Describe the physical features of the United States, Canada, Mexico, and the Caribbean.",
                clarifications: [],
                accessPoints: [
                  "SS.3.G.2.AP.4 — Recognize major physical features of the United States, Canada, and Mexico.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/2973",
              },
              {
                code: "SS.3.G.2.5",
                description:
                  "Identify natural and man-made landmarks in the United States, Canada, Mexico, and the Caribbean.",
                clarifications: [],
                accessPoints: [
                  "SS.3.G.2.AP.5 — Recognize major natural and man-made landmarks of the United States.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/2974",
              },
              {
                code: "SS.3.G.2.6",
                description:
                  "Investigate how people perceive places and regions differently by conducting interviews, mental mapping and studying news, poems, legends, and songs about a region or area.",
                clarifications: [],
                accessPoints: [
                  "SS.3.G.2.AP.6 — Identify how people view places and regions differently by asking questions about a region.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/2975",
              },
            ],
          },
          {
            code: "SS.3.G.3",
            displayName: "Physical Systems",
            standards: [
              {
                code: "SS.3.G.3.1",
                description:
                  "Describe the climate and vegetation in the United States, Canada, Mexico, and the Caribbean.",
                clarifications: [],
                accessPoints: [
                  "SS.3.G.3.AP.1 — Recognize differences in the climates of the United States, Canada, and Mexico.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/2976",
              },
              {
                code: "SS.3.G.3.2",
                description:
                  "Describe the natural resources in the United States, Canada, Mexico, and the Caribbean.",
                clarifications: [],
                accessPoints: [
                  "SS.3.G.3.AP.2 — Recognize major natural resources in the United States, Canada, and Mexico.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/2977",
              },
            ],
          },
          {
            code: "SS.3.G.4",
            displayName: "Human Systems",
            standards: [
              {
                code: "SS.3.G.4.1",
                description:
                  "Explain how the environment influences settlement patterns in the United States, Canada, Mexico, and the Caribbean.",
                clarifications: [],
                accessPoints: [
                  "SS.3.G.4.AP.1 — Identify major ways environmental influences contribute to settlement patterns in the United States.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/2978",
              },
              {
                code: "SS.3.G.4.2",
                description:
                  "Identify the cultures that have settled the United States, Canada, Mexico, and the Caribbean.",
                clarifications: [],
                accessPoints: [
                  "SS.3.G.4.AP.2 — Recognize different cultures that have settled in the United States.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/2979",
              },
              {
                code: "SS.3.G.4.3",
                description:
                  "Compare the cultural characteristics of diverse populations in one of the five regions of the United States with Canada, Mexico, or the Caribbean.",
                clarifications: [],
                accessPoints: [
                  "SS.3.G.4.AP.3 — Identify a cultural characteristic of a population in the United States and a population in Mexico or Canada.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/2980",
              },
              {
                code: "SS.3.G.4.4",
                description:
                  "Identify contributions from various ethnic groups to the United States.",
                clarifications: [],
                accessPoints: [
                  "SS.3.G.4.AP.4 — Recognize contributions of an ethnic group to the United States.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/2981",
              },
            ],
          },
        ],
      },

      // ─────────────────────────────────────────────────────────────────────
      // STRAND: Economics (NGSSS 2014)
      // ─────────────────────────────────────────────────────────────────────
      {
        code: "E",
        displayName: "Economics",
        groups: [
          {
            code: "SS.3.E.1",
            displayName: "Beginning Economics",
            standards: [
              {
                code: "SS.3.E.1.1",
                description: "Give examples of how scarcity results in trade.",
                clarifications: [],
                accessPoints: [
                  "SS.3.E.1.AP.1 — Recognize that people can trade for products that are not available locally.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/2982",
              },
              {
                code: "SS.3.E.1.2",
                description: "List the characteristics of money.",
                clarifications: [],
                accessPoints: [
                  "SS.3.E.1.AP.2 — Identify some characteristics of money.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/2983",
              },
              {
                code: "SS.3.E.1.3",
                description:
                  "Recognize that buyers and sellers interact to exchange goods and services through the use of trade or money.",
                clarifications: [],
                accessPoints: [
                  "SS.3.E.1.AP.3 — Recognize the roles of buyers and sellers in exchanging goods and services.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/2984",
              },
              {
                code: "SS.3.E.1.4",
                description:
                  "Distinguish between currencies used in the United States, Canada, Mexico, and the Caribbean.",
                clarifications: [],
                accessPoints: [
                  "SS.3.E.1.AP.4 — Recognize forms of money used in the United States and one other North American country.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/2985",
              },
            ],
          },
        ],
      },

      // ─────────────────────────────────────────────────────────────────────
      // STRAND: Civics and Government (2023 Florida State Academic Standards)
      // ─────────────────────────────────────────────────────────────────────
      {
        code: "CG",
        displayName: "Civics and Government",
        groups: [
          {
            code: "SS.3.CG.1",
            displayName: "Foundations of Government, Law and the American Political System",
            standards: [
              {
                code: "SS.3.CG.1.1",
                description:
                  "Explain how the U.S. Constitution establishes the purpose and fulfills the need for government.",
                clarifications: [
                  "Students will explain the purpose of and need for government in terms of protection of rights, organization, security, and services.",
                ],
                accessPoints: [
                  "SS.3.CG.1.AP.1 — Recognize the purpose of government in the community.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/16053",
              },
              {
                code: "SS.3.CG.1.2",
                description:
                  "Describe how the U.S. government gains its power from the people.",
                clarifications: [
                  "Students will recognize what is meant by \"We the People\" and the phrase \"consent of the governed.\"",
                  "Students will identify sources of consent (e.g., voting and elections).",
                  "Students will recognize that the U.S. republic is governed by the \"consent of the governed\" and government power is exercised through representatives of the people.",
                ],
                accessPoints: [
                  "SS.3.CG.1.AP.2 — Identify that government gains its power from the people.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/16054",
              },
            ],
          },
          {
            code: "SS.3.CG.2",
            displayName: "Civic and Political Participation",
            standards: [
              {
                code: "SS.3.CG.2.1",
                description:
                  "Describe how citizens demonstrate civility, cooperation, volunteerism, and other civic virtues.",
                clarifications: [
                  "Students will identify examples including, but not limited to, food drives, book drives, community clean-ups, voting, blood donation drives, volunteer fire departments, and neighborhood watch programs.",
                ],
                accessPoints: [
                  "SS.3.CG.2.AP.1 — Identify actions of citizens that contribute to the community.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/16055",
              },
              {
                code: "SS.3.CG.2.2",
                description: "Describe the importance of voting in elections.",
                clarifications: [
                  "Students will recognize that it is every citizen's responsibility to vote.",
                  "Students will explain the importance of voting in a republic.",
                ],
                accessPoints: [
                  "SS.3.CG.2.AP.2 — Recognize that it is the responsibility of citizens to vote.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/16056",
              },
              {
                code: "SS.3.CG.2.3",
                description:
                  "Explain the history and meaning behind patriotic holidays and observances.",
                clarifications: [
                  "Students will identify patriotic holidays and observances to include, but not limited to, American Founders Month, Celebrate Freedom Week, Constitution Day, Independence Day, Martin Luther King Jr. Day, Medal of Honor Day, Memorial Day, Patriot Day, and Veterans Day.",
                ],
                accessPoints: [
                  "SS.3.CG.2.AP.3 — Recognize the meaning behind patriotic holidays.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/16057",
              },
              {
                code: "SS.3.CG.2.4",
                description:
                  "Recognize symbols, individuals, documents, and events that represent the United States.",
                clarifications: [
                  "Students will recognize Mount Rushmore, Uncle Sam, and the Washington Monument as symbols that represent the United States.",
                  "Students will recognize James Madison, Alexander Hamilton, Booker T. Washington, and Susan B. Anthony as individuals who represent the United States.",
                  "Students will recognize the U.S. Constitution as a document that represents the United States.",
                  "Students will recognize the Constitutional Convention (May 1787–September 1787) and the signing of the U.S. Constitution (September 17, 1787) as events that represent the United States.",
                ],
                accessPoints: [
                  "SS.3.CG.2.AP.4 — Identify events that represent the United States.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/16058",
              },
              {
                code: "SS.3.CG.2.5",
                description:
                  "Recognize symbols, individuals, documents, and events that represent the State of Florida.",
                clarifications: [
                  "Students will recognize the Great Seal of the State of Florida as a symbol that represents the state.",
                  "Students will recognize William Pope Duval, William Dunn Moseley, and Josiah T. Walls as individuals who represent Florida.",
                  "Students will identify the Declaration of Rights in the Florida Constitution as a document that represents Florida.",
                  "Students will recognize that Florida became the 27th state of the United States on March 3, 1845.",
                ],
                accessPoints: [
                  "SS.3.CG.2.AP.5 — Identify events that represent Florida.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/16059",
              },
            ],
          },
          {
            code: "SS.3.CG.3",
            displayName: "Structure and Functions of Government",
            standards: [
              {
                code: "SS.3.CG.3.1",
                description:
                  "Explain how the U.S. and Florida Constitutions establish the structure, function, powers, and limits of government.",
                clarifications: [
                  "Students will recognize that the U.S. Constitution and the Florida Constitution establish the framework for national and state government.",
                  "Students will recognize how government is organized at the national level (e.g., three branches of government).",
                  "Students will provide examples of people who make and enforce rules and laws in the United States (e.g., congress and president) and Florida (e.g., state legislature and governor).",
                ],
                accessPoints: [
                  "SS.3.CG.3.AP.1 — Identify that the U.S. and Florida Constitutions have three branches of government.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/16060",
              },
              {
                code: "SS.3.CG.3.2",
                description:
                  "Recognize that government has local, state, and national levels.",
                clarifications: [
                  "Students will recognize that each level of government has its own unique structure and responsibilities.",
                  "Students will distinguish between the responsibilities of the local, state, and national governments in the United States.",
                ],
                accessPoints: [
                  "SS.3.CG.3.AP.2 — Identify levels of local, state, and federal government to their functions.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/16061",
              },
            ],
          },
        ],
      },

      // ─────────────────────────────────────────────────────────────────────
      // STRAND: African American History (2023 Florida State Academic Standards)
      // ─────────────────────────────────────────────────────────────────────
      {
        code: "AA",
        displayName: "African American History",
        groups: [
          {
            code: "SS.3.AA.1",
            displayName: "Positive Influences and Contributions by African Americans",
            standards: [
              {
                code: "SS.3.AA.1.1",
                description:
                  "Identify African Americans who demonstrated heroism and patriotism (e.g., Booker T. Washington, Jesse Owens, Tuskegee Airmen, Martin Luther King Jr., Rosa Parks, President Barack Obama, 1st Lt. Vernon Baker, Sgt. 1st Class Melvin Morris).",
                clarifications: [],
                accessPoints: [
                  "SS.3.AA.1.AP.1 — Identify an African American who demonstrated heroism or patriotism (e.g., Booker T. Washington, Jesse Owens, Tuskegee Airmen, Martin Luther King Jr., Rosa Parks, President Barack Obama, 1st Lt. Vernon Baker, Sgt. 1st Class Melvin Morris).",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/116279",
              },
            ],
          },
        ],
      },
    ],
  },
};
