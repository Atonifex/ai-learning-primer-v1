import type { SkillSeed } from "./types";

export const skillsGrade3: SkillSeed[] = [
  {
    slug: "place_value_reasoning",
    displayName: "Place Value Reasoning",
    description: "Uses place value structure to represent, compare, and regroup numbers.",
    subjectScope: ["math_g3"],
    links: [
      { standardCode: "MA.3.NSO.1.1" },
      { standardCode: "MA.3.NSO.1.2" },
      { standardCode: "MA.3.NSO.1.3" },
    ],
  },
  {
    slug: "multi_digit_operations_fluency",
    displayName: "Multi-digit Operations Fluency",
    description: "Applies multi-digit operation strategies with procedural reliability.",
    subjectScope: ["math_g3"],
    links: [{ standardCode: "MA.3.NSO.2.1" }, { standardCode: "MA.3.NSO.2.2" }, { standardCode: "MA.3.NSO.2.3" }],
  },
  {
    slug: "character_analysis",
    displayName: "Character Analysis",
    description: "Explains character development and perspective using textual evidence.",
    subjectScope: ["ela_g3"],
    links: [{ standardCode: "ELA.3.R.1.1" }, { standardCode: "ELA.3.R.1.3" }],
  },
  {
    slug: "theme_and_text_meaning",
    displayName: "Theme and Text Meaning",
    description: "Determines themes/central ideas and supports them with relevant details.",
    subjectScope: ["ela_g3"],
    links: [{ standardCode: "ELA.3.R.1.2" }, { standardCode: "ELA.3.R.2.2" }],
  },
  {
    slug: "claim_evidence_reasoning",
    displayName: "Claim-Evidence Reasoning",
    description: "Evaluates claims and evidence across literary, informational, and inquiry contexts.",
    subjectScope: ["ela_g3", "science_g3", "social_studies_g3"],
    links: [
      { standardCode: "ELA.3.R.2.3", weight: 1.2 },
      { standardCode: "ELA.3.R.2.4", weight: 1.2 },
      { standardCode: "SC.3.N.1.7", weight: 1.0 },
      { standardCode: "SS.3.A.1.1", weight: 1.0 },
    ],
  },
  {
    slug: "scientific_inquiry",
    displayName: "Scientific Inquiry",
    description: "Poses investigable questions, records observations, and explains findings.",
    subjectScope: ["science_g3"],
    links: [{ standardCode: "SC.3.N.1.1" }, { standardCode: "SC.3.N.1.2" }, { standardCode: "SC.3.N.1.3" }],
  },
  {
    slug: "models_and_limitations",
    displayName: "Models and Their Limitations",
    description: "Uses models to explain phenomena and recognizes model limitations.",
    subjectScope: ["science_g3"],
    links: [{ standardCode: "SC.3.N.3.2" }, { standardCode: "SC.3.N.3.3" }],
  },
  {
    slug: "source_analysis",
    displayName: "Source Analysis",
    description: "Distinguishes and interprets primary and secondary sources.",
    subjectScope: ["social_studies_g3"],
    links: [{ standardCode: "SS.3.A.1.1" }, { standardCode: "SS.3.A.1.2" }],
  },
  {
    slug: "map_and_spatial_literacy",
    displayName: "Map and Spatial Literacy",
    description: "Reads maps/charts and uses map elements for geographic reasoning.",
    subjectScope: ["social_studies_g3"],
    links: [{ standardCode: "SS.3.G.1.1" }, { standardCode: "SS.3.G.1.2" }],
  },
];
