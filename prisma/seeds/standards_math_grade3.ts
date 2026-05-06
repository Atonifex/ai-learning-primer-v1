import type { SubjectSeed } from "./types";

export const standardsMathGrade3: SubjectSeed = {
  slug: "math_g3",
  domain: "MATH",
  gradeBand: "3",
  framework: "FL_BEST",
  displayName: "Grade 3 Mathematics",
  catalog: {
    version: "v1",
    label: "Florida Grade 3 Math (NSO.1 + NSO.2)",
    framework: "FL_BEST",
    strands: [
      {
        code: "NSO",
        displayName: "Number Sense and Operations",
        groups: [
          {
            code: "MA.3.NSO.1",
            displayName: "Place Value and Number Forms",
            standards: [
              {
                code: "MA.3.NSO.1.1",
                description:
                  "Read and write numbers from 0 to 10,000 using standard form, expanded form and word form.",
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/15307",
              },
              {
                code: "MA.3.NSO.1.2",
                description:
                  "Compose and decompose four-digit numbers in multiple ways using thousands, hundreds, tens and ones.",
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/15308",
              },
              {
                code: "MA.3.NSO.1.3",
                description: "Plot, order and compare whole numbers up to 10,000.",
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/15309",
              },
            ],
          },
          {
            code: "MA.3.NSO.2",
            displayName: "Addition, Subtraction, Multiplication, and Division",
            standards: [
              {
                code: "MA.3.NSO.2.1",
                description:
                  "Add and subtract multi-digit whole numbers including using a standard algorithm with procedural fluency.",
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/15311",
              },
              {
                code: "MA.3.NSO.2.2",
                description:
                  "Explore multiplication of two whole numbers with products from 0 to 144, and related division facts.",
                verificationStatus: "Partially verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/Preview/15312",
              },
              {
                code: "MA.3.NSO.2.3",
                description:
                  "Multiply a one-digit whole number by a multiple of 10, up to 90, or a multiple of 100, up to 900, with procedural reliability.",
                verificationStatus: "Partially verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/Preview/15313",
              },
            ],
          },
        ],
      },
    ],
  },
};
