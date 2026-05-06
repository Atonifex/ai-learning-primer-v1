export type SubjectSeed = {
  slug: string;
  domain: "MATH" | "ELA" | "SCIENCE" | "SOCIAL_STUDIES" | "WORLD_LANGUAGE";
  gradeBand: string;
  framework: string;
  displayName: string;
  targetLanguage?: "ES" | "ZH";
  catalog: {
    version: string;
    label: string;
    framework: string;
    strands: StrandSeed[];
  };
};

export type StrandSeed = {
  code: string;
  displayName: string;
  description?: string;
  groups: StandardGroupSeed[];
};

export type StandardGroupSeed = {
  code: string;
  displayName: string;
  purpose?: string;
  bigIdeaSummary?: string;
  standards: StandardSeed[];
};

export type StandardSeed = {
  code: string;
  description: string;
  examples?: unknown;
  clarifications?: unknown;
  purposeAndStrategies?: string;
  commonMisconceptions?: string;
  glossaryTerms?: string[];
  verticalAlignment?: unknown;
  accessPoints?: unknown;
  contentComplexity?: string;
  verificationStatus?: string;
  sourceUrl?: string;
  primerNotes?: unknown;
};

export type SkillSeed = {
  slug: string;
  displayName: string;
  description: string;
  subjectScope: string[];
  links: Array<{ standardCode: string; weight?: number; notes?: string }>;
};
