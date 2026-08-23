import type { SubjectSeed } from "../prisma/seeds/types";

export const standardsMathGrade4: SubjectSeed = {
  slug: "math_g4",
  domain: "MATH",
  gradeBand: "4",
  framework: "FL_BEST",
  displayName: "Grade 4 Mathematics",
  catalog: {
    version: "v1",
    label: "Florida Grade 4 Mathematics — B.E.S.T. Standards",
    framework: "FL_BEST",
    strands: [
      // ─────────────────────────────────────────────────────────────────────
      // STRAND: Number Sense and Operations (NSO)
      // IDs 15341–15352  |  12 benchmarks
      // ─────────────────────────────────────────────────────────────────────
      {
        code: "NSO",
        displayName: "Number Sense and Operations",
        groups: [
          {
            code: "MA.4.NSO.1",
            displayName: "Place Value and Number Representations",
            standards: [
              {
                code: "MA.4.NSO.1.1",
                description:
                  "Express how the value of a digit in a multi-digit whole number changes if the digit moves one place to the left or right.",
                clarifications: [],
                accessPoints: [
                  "MA.4.NSO.1.AP.1 — Explore how the value of a digit in a multi-digit whole number changes if the digit moves one place to the left.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15341",
              },
              {
                code: "MA.4.NSO.1.2",
                description:
                  "Read and write multi-digit whole numbers from 0 to 1,000,000 using standard form, expanded form and word form.",
                clarifications: [],
                accessPoints: [
                  "MA.4.NSO.1.AP.2 — Read and generate numbers from 0 to 10,000 using standard form and expanded form.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15342",
              },
              {
                code: "MA.4.NSO.1.3",
                description:
                  "Plot, order and compare multi-digit whole numbers up to 1,000,000.",
                clarifications: [
                  "When comparing numbers, instruction includes using an appropriately scaled number line and using place values of the hundred thousands, ten thousands, thousands, hundreds, tens and ones digits.",
                  "Scaled number lines must be provided and can be a representation of any range of numbers.",
                  "Within this benchmark, the expectation is to use symbols (<, > or =).",
                ],
                accessPoints: [
                  "MA.4.NSO.1.AP.3 — Plot, order and compare multi-digit whole numbers up to 10,000.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15343",
              },
              {
                code: "MA.4.NSO.1.4",
                description:
                  "Round whole numbers from 0 to 10,000 to the nearest 10, 100 or 1,000.",
                clarifications: [],
                accessPoints: [
                  "MA.4.NSO.1.AP.4 — Round whole numbers from 100 to 10,000 to the nearest 1,000 with visual support.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15344",
              },
              {
                code: "MA.4.NSO.1.5",
                description: "Plot, order and compare decimals up to the hundredths.",
                clarifications: [
                  "When comparing numbers, instruction includes using an appropriately scaled number line and using place values of the ones, tenths and hundredths digits.",
                  "Within the benchmark, the expectation is to explain the reasoning for the comparison and use symbols (<, > or =).",
                  "Scaled number lines must be provided and can be a representation of any range of numbers.",
                ],
                accessPoints: [
                  "MA.4.NSO.1.AP.5 — Using visual models, compare decimals less than one up to the hundredths.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15345",
              },
            ],
          },
          {
            code: "MA.4.NSO.2",
            displayName: "Operations with Multi-Digit Numbers and Decimals",
            standards: [
              {
                code: "MA.4.NSO.2.1",
                description:
                  "Recall multiplication facts with factors up to 12 and related division facts with automaticity.",
                clarifications: [],
                accessPoints: [
                  "MA.4.NSO.2.AP.1 — Recall multiplication facts of one-digit whole numbers multiplied by 1, 2, 5 and 10.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15346",
              },
              {
                code: "MA.4.NSO.2.2",
                description:
                  "Multiply two whole numbers, up to three digits by up to two digits, with procedural reliability.",
                clarifications: [
                  "Instruction focuses on helping a student choose a method they can use reliably.",
                  "Instruction includes the use of models or equations based on place value and the distributive property.",
                ],
                accessPoints: [
                  "MA.4.NSO.2.AP.2 — Explore multiplication of two whole numbers, up to two digits by one digit.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15347",
              },
              {
                code: "MA.4.NSO.2.3",
                description:
                  "Multiply two whole numbers, each up to two digits, including using a standard algorithm with procedural fluency.",
                clarifications: [],
                accessPoints: [
                  "MA.4.NSO.2.AP.3 — Apply a strategy to multiply two whole numbers up to two digits by one digit.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15348",
              },
              {
                code: "MA.4.NSO.2.4",
                description:
                  "Divide a whole number up to four digits by a one-digit whole number with procedural reliability. Represent remainders as fractional parts of the divisor.",
                clarifications: [
                  "Instruction focuses on helping a student choose a method they can use reliably.",
                  "Instruction includes the use of models based on place value, properties of operations or the relationship between multiplication and division.",
                ],
                accessPoints: [
                  "MA.4.NSO.2.AP.4 — Explore division of two whole numbers up to two digits by one digit with and without remainders. Represent remainders as whole numbers.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15349",
              },
              {
                code: "MA.4.NSO.2.5",
                description:
                  "Explore the multiplication and division of multi-digit whole numbers using estimation, rounding and place value.",
                clarifications: [
                  "Instruction focuses on previous understanding of multiplication with multiples of 10 and 100, and seeing division as a missing factor problem.",
                  "Estimating quotients builds the foundation for division using a standard algorithm.",
                  "When estimating the division of whole numbers, dividends are limited to up to four digits and divisors are limited to up to two digits.",
                ],
                accessPoints: [
                  "MA.4.NSO.2.AP.5 — Explore the estimation of products and quotients of two whole numbers up to two digits by one digit.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15350",
              },
              {
                code: "MA.4.NSO.2.6",
                description:
                  "Identify the number that is one-tenth more, one-tenth less, one-hundredth more and one-hundredth less than a given number.",
                clarifications: [],
                accessPoints: [
                  "MA.4.NSO.2.AP.6 — Identify the number that is one-tenth more and one-tenth less than a given number (i.e., 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9).",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15351",
              },
              {
                code: "MA.4.NSO.2.7",
                description:
                  "Explore the addition and subtraction of multi-digit numbers with decimals to the hundredths.",
                clarifications: [
                  "Instruction includes the connection to money and the use of manipulatives and models based on place value.",
                ],
                accessPoints: [
                  "MA.4.NSO.2.AP.7 — Explore the addition and subtraction of decimals less than one to the tenths (e.g., 0.3 + 0.5) and hundredths (e.g., 0.25 - 0.12).",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15352",
              },
            ],
          },
        ],
      },

      // ─────────────────────────────────────────────────────────────────────
      // STRAND: Fractions (FR)
      // IDs 15353–15360  |  8 benchmarks
      // ─────────────────────────────────────────────────────────────────────
      {
        code: "FR",
        displayName: "Fractions",
        groups: [
          {
            code: "MA.4.FR.1",
            displayName: "Fractions and Decimal Fractions",
            standards: [
              {
                code: "MA.4.FR.1.1",
                description:
                  "Model and express a fraction, including mixed numbers and fractions greater than one, with the denominator 10 as an equivalent fraction with the denominator 100.",
                clarifications: [
                  "Instruction emphasizes conceptual understanding through the use of manipulatives, visual models, number lines or equations.",
                ],
                accessPoints: [
                  "MA.4.FR.1.AP.1 — Using a visual model, recognize fractions less than one, with the denominator 10 as an equivalent fraction with the denominator 100.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15353",
              },
              {
                code: "MA.4.FR.1.2",
                description:
                  "Use decimal notation to represent fractions with denominators of 10 or 100, including mixed numbers and fractions greater than 1, and use fractional notation with denominators of 10 or 100 to represent decimals.",
                clarifications: [
                  "Instruction emphasizes conceptual understanding through the use of manipulatives, visual models, number lines or equations.",
                  "Instruction includes the understanding that a decimal and fraction that are equivalent represent the same point on the number line and that fractions with denominators of 10 or powers of 10 may be called decimal fractions.",
                ],
                accessPoints: [
                  "MA.4.FR.1.AP.2 — Use decimal notation to represent fractions less than one with denominators of 10 or 100 and use fractional notation with denominators of 10 or 100 to represent decimals less than one.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15354",
              },
              {
                code: "MA.4.FR.1.3",
                description:
                  "Identify and generate equivalent fractions, including fractions greater than one. Describe how the numerator and denominator are affected when the equivalent fraction is created.",
                clarifications: [
                  "Instruction includes the use of manipulatives, visual models, number lines or equations.",
                  "Instruction includes recognizing how the numerator and denominator are affected when equivalent fractions are generated.",
                ],
                accessPoints: [
                  "MA.4.FR.1.AP.3 — Using a visual model, generate fractions less than a whole that are equivalent to fractions with denominators 2, 3, 4, 6, 8 or 10. Explore how the numerator and denominator are affected when the equivalent fraction is created.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15355",
              },
              {
                code: "MA.4.FR.1.4",
                description:
                  "Plot, order and compare fractions, including mixed numbers and fractions greater than one, with different numerators and different denominators.",
                clarifications: [
                  "When comparing fractions, instruction includes using an appropriately scaled number line and using reasoning about their size.",
                  "Instruction includes using benchmark quantities, such as 0, 1/4, 1/2, 3/4 and 1, to compare fractions.",
                  "Denominators are limited to 2, 3, 4, 5, 6, 8, 10, 12, 16 and 100.",
                  "Within this benchmark, the expectation is to use symbols (<, > or =).",
                ],
                accessPoints: [
                  "MA.4.FR.1.AP.4a — Explore mixed numbers and fractions greater than one.",
                  "MA.4.FR.1.AP.4b — Using visual models, compare fractions less than one with different numerators and different denominators. Denominators limited to 2, 3, 4, 6, 8 or 10.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15356",
              },
            ],
          },
          {
            code: "MA.4.FR.2",
            displayName: "Operations with Fractions",
            standards: [
              {
                code: "MA.4.FR.2.1",
                description:
                  "Decompose a fraction, including mixed numbers and fractions greater than one, into a sum of fractions with the same denominator in multiple ways. Demonstrate each decomposition with objects, drawings and equations.",
                clarifications: [
                  "Denominators are limited to 2, 3, 4, 5, 6, 8, 10, 12, 16 and 100.",
                ],
                accessPoints: [
                  "MA.4.FR.2.AP.1 — Decompose a fraction less than one into a sum of unit fractions with the same denominator. Denominators limited to 2, 3, 4, 6, 8 or 10. Demonstrate each decomposition with objects, drawings or equations.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15357",
              },
              {
                code: "MA.4.FR.2.2",
                description:
                  "Add and subtract fractions with like denominators, including mixed numbers and fractions greater than one, with procedural reliability.",
                clarifications: [
                  "Instruction includes the use of word form, manipulatives, drawings, the properties of operations or number lines.",
                  "Within this benchmark, the expectation is not to simplify or use lowest terms.",
                  "Denominators are limited to 2, 3, 4, 5, 6, 8, 10, 12, 16 and 100.",
                ],
                accessPoints: [
                  "MA.4.FR.2.AP.2 — Explore adding and subtracting fractions less than one with like denominators. Denominators limited to 2, 3, 4, 6, 8 or 10.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15358",
              },
              {
                code: "MA.4.FR.2.3",
                description:
                  "Explore the addition of a fraction with denominator of 10 to a fraction with denominator of 100 using equivalent fractions.",
                clarifications: [
                  "Instruction includes the use of visual models.",
                  "Within this benchmark, the expectation is not to simplify or use lowest terms.",
                ],
                accessPoints: [
                  "MA.4.FR.2.AP.3 — Explore the addition of a fraction with denominator of 10 to a fraction with denominator of 100 using visual models to find equivalent fractions.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15359",
              },
              {
                code: "MA.4.FR.2.4",
                description:
                  "Extend previous understanding of multiplication to explore the multiplication of a fraction by a whole number or a whole number by a fraction.",
                clarifications: [
                  "Instruction includes the use of visual models or number lines and the connection to the commutative property of multiplication.",
                  "Within this benchmark, the expectation is not to simplify or use lowest terms.",
                  "Fractions multiplied by a whole number are limited to less than 1. All denominators are limited to 2, 3, 4, 5, 6, 8, 10, 12, 16, 100.",
                ],
                accessPoints: [
                  "MA.4.FR.2.AP.4 — Explore the multiplication of a unit fraction by a whole number (e.g., 3 × 1/2, 2 × 1/4, 5 × 1/3). Denominators limited to 2, 3, 4, 6, 8 or 10.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15360",
              },
            ],
          },
        ],
      },

      // ─────────────────────────────────────────────────────────────────────
      // STRAND: Algebraic Reasoning (AR)
      // IDs 15361–15367  |  7 benchmarks
      // ─────────────────────────────────────────────────────────────────────
      {
        code: "AR",
        displayName: "Algebraic Reasoning",
        groups: [
          {
            code: "MA.4.AR.1",
            displayName: "Solve Real-World Problems",
            standards: [
              {
                code: "MA.4.AR.1.1",
                description:
                  "Solve real-world problems involving multiplication and division of whole numbers including problems in which remainders must be interpreted within the context.",
                clarifications: [
                  "Problems involving multiplication include multiplicative comparisons.",
                  "Depending on the context, the solution of a division problem with a remainder may be the whole number part of the quotient, the whole number part of the quotient with the remainder, the whole number part of the quotient plus 1, or the remainder.",
                  "Multiplication is limited to products of up to 3 digits by 2 digits. Division is limited to up to 4 digits divided by 1 digit.",
                ],
                accessPoints: [
                  "MA.4.AR.1.AP.1 — Solve one-step real-world problems involving multiplication and division of whole numbers. Multiplication may not exceed two-digit by one-digit and division must be related to one-digit by one-digit multiplication facts.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15361",
              },
              {
                code: "MA.4.AR.1.2",
                description:
                  "Solve real-world problems involving addition and subtraction of fractions with like denominators, including mixed numbers and fractions greater than one.",
                clarifications: [
                  "Problems include creating real-world situations based on an equation or representing a real-world problem with a visual model or equation.",
                  "Fractions within problems must reference the same whole.",
                  "Within this benchmark, the expectation is not to simplify or use lowest terms.",
                  "Denominators limited to 2, 3, 4, 5, 6, 8, 10, 12, 16 and 100.",
                ],
                accessPoints: [
                  "MA.4.AR.1.AP.2 — Solve one-step real-world problems involving addition and subtraction of fractions less than one with like denominators. Denominators limited to 2, 3, 4, 6, 8 or 10.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15362",
              },
              {
                code: "MA.4.AR.1.3",
                description:
                  "Solve real-world problems involving multiplication of a fraction by a whole number or a whole number by a fraction.",
                clarifications: [
                  "Problems include creating real-world situations based on an equation or representing a real-world problem with a visual model or equation.",
                  "Fractions within problems must reference the same whole.",
                  "Within this benchmark, the expectation is not to simplify or use lowest terms.",
                  "Fractions limited to fractions less than one with denominators of 2, 3, 4, 5, 6, 8, 10, 12, 16 and 100.",
                ],
                accessPoints: [
                  "MA.4.AR.1.AP.3 — Solve one-step real-world problems involving multiplication of a unit fraction by a whole number (e.g., 3 × 1/2, 2 × 1/4, 5 × 1/3). Denominators limited to 2, 3, 4, 6, 8 or 10.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15363",
              },
            ],
          },
          {
            code: "MA.4.AR.2",
            displayName: "Equality",
            standards: [
              {
                code: "MA.4.AR.2.1",
                description:
                  "Determine and explain whether an equation involving any of the four operations with whole numbers is true or false.",
                clarifications: [
                  "Multiplication is limited to whole number factors within 12 and related division facts.",
                ],
                accessPoints: [
                  "MA.4.AR.2.AP.1 — Determine whether an equation (with no more than three terms) involving any of the four operations with whole numbers is true or false. Sums may not exceed 100 and their related subtraction facts. Multiplication may not exceed two-digit by one-digit and division must be related to one-digit by one-digit multiplication facts.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15364",
              },
              {
                code: "MA.4.AR.2.2",
                description:
                  "Given a mathematical or real-world context, write an equation involving multiplication or division to determine the unknown whole number with the unknown in any position.",
                clarifications: [
                  "Instruction extends the development of algebraic thinking skills where the symbolic representation of the unknown uses a letter.",
                  "Problems include the unknown on either side of the equal sign.",
                  "Multiplication is limited to factors within 12 and related division facts.",
                ],
                accessPoints: [
                  "MA.4.AR.2.AP.2 — Given a real-world context, identify or generate an equation involving multiplication or division to determine the unknown product or quotient. Multiplication may not exceed two-digit by one-digit and division must be related to one-digit by one-digit multiplication facts.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15365",
              },
            ],
          },
          {
            code: "MA.4.AR.3",
            displayName: "Patterns",
            standards: [
              {
                code: "MA.4.AR.3.1",
                description:
                  "Determine factor pairs for a whole number from 0 to 144. Determine whether a whole number from 0 to 144 is prime, composite or neither.",
                clarifications: [
                  "Instruction includes the connection to the relationship between multiplication and division and patterns with divisibility rules.",
                  "The numbers 0 and 1 are neither prime nor composite.",
                ],
                accessPoints: [
                  "MA.4.AR.3.AP.1 — Explore factor pairs for a whole number. Factors may not exceed single-digit whole numbers.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15366",
              },
              {
                code: "MA.4.AR.3.2",
                description:
                  "Generate, describe and extend a numerical pattern that follows a given rule.",
                clarifications: [
                  "Instruction includes patterns within a mathematical or real-world context.",
                ],
                accessPoints: [
                  "MA.4.AR.3.AP.2 — Generate a numerical pattern when given a starting term and a one-step addition rule (e.g., starting at the number 5 use the rule add 5 and generate the pattern).",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15367",
              },
            ],
          },
        ],
      },

      // ─────────────────────────────────────────────────────────────────────
      // STRAND: Measurement (M)
      // IDs 15368–15371  |  4 benchmarks
      // ─────────────────────────────────────────────────────────────────────
      {
        code: "M",
        displayName: "Measurement",
        groups: [
          {
            code: "MA.4.M.1",
            displayName: "Measure Attributes and Convert Units",
            standards: [
              {
                code: "MA.4.M.1.1",
                description:
                  "Select and use appropriate tools to measure attributes of objects.",
                clarifications: [
                  "Attributes include length, volume, weight, mass and temperature.",
                  "Instruction includes digital measurements and scales that are not linear in appearance.",
                  "When recording measurements, use fractions and decimals where appropriate.",
                ],
                accessPoints: [
                  "MA.4.M.1.AP.1a — Select and use appropriate tools to measure length (i.e., inches, feet, yards), liquid volume (i.e., gallons, quarts, pints, cups) and temperature (i.e., degrees Fahrenheit).",
                  "MA.4.M.1.AP.1b — Explore selecting and using appropriate tools to measure weight (i.e., ounces, pounds).",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15368",
              },
              {
                code: "MA.4.M.1.2",
                description:
                  "Convert within a single system of measurement using the units: yards, feet, inches; kilometers, meters, centimeters, millimeters; pounds, ounces; kilograms, grams; gallons, quarts, pints, cups; liter, milliliter; and hours, minutes, seconds.",
                clarifications: [
                  "Instruction includes the understanding of how to convert from smaller to larger units or from larger to smaller units.",
                  "Within the benchmark, the expectation is not to convert from grams to kilograms, meters to kilometers or milliliters to liters.",
                  "Problems involving fractions are limited to denominators of 2, 3, 4, 5, 6, 8, 10, 12, 16 and 100.",
                ],
                accessPoints: [
                  "MA.4.M.1.AP.2a — Explore relative sizes of measurement units within one system of units including yards, feet, inches; pounds, ounces; gallons, quarts, pints, cups; and hours, minutes.",
                  "MA.4.M.1.AP.2b — Using a conversion sheet, convert from a larger to a smaller unit within a single system of measurement using the units: yards, feet, inches; pounds, ounces; gallons, quarts, pints, cups; and hours, minutes. Only whole number measurements may be used.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15369",
              },
            ],
          },
          {
            code: "MA.4.M.2",
            displayName: "Solve Problems Involving Measurement",
            standards: [
              {
                code: "MA.4.M.2.1",
                description:
                  "Solve two-step real-world problems involving distances and intervals of time using any combination of the four operations.",
                clarifications: [
                  "Problems involving fractions will include addition and subtraction with like denominators and multiplication of a fraction by a whole number or a whole number by a fraction.",
                  "Problems involving fractions are limited to denominators of 2, 3, 4, 5, 6, 8, 10, 12, 16 and 100.",
                  "Within the benchmark, the expectation is not to use decimals.",
                ],
                accessPoints: [
                  "MA.4.M.2.AP.1a — Solve one- and two-step real-world problems involving distances (i.e., inches, feet, yards, miles) in whole numbers using any combination of the four operations.",
                  "MA.4.M.2.AP.1b — Solve one-step real-world problems involving intervals of time in whole numbers using any of the four operations.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15370",
              },
              {
                code: "MA.4.M.2.2",
                description:
                  "Solve one- and two-step addition and subtraction real-world problems involving money using decimal notation.",
                clarifications: [],
                accessPoints: [
                  "MA.4.M.2.AP.2 — Solve one- and two-step addition and subtraction real-world problems involving money using decimal notation up to one dollar.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15371",
              },
            ],
          },
        ],
      },

      // ─────────────────────────────────────────────────────────────────────
      // STRAND: Geometric Reasoning (GR)
      // IDs 15372–15376  |  5 benchmarks
      // ─────────────────────────────────────────────────────────────────────
      {
        code: "GR",
        displayName: "Geometric Reasoning",
        groups: [
          {
            code: "MA.4.GR.1",
            displayName: "Angles and Two-Dimensional Figures",
            standards: [
              {
                code: "MA.4.GR.1.1",
                description:
                  "Informally explore angles as an attribute of two-dimensional figures. Identify and classify angles as acute, right, obtuse, straight or reflex.",
                clarifications: [
                  "Instruction includes classifying angles using benchmark angles of 90 degrees and 180 degrees in two-dimensional figures.",
                  "When identifying angles, the expectation includes two-dimensional figures and real-world pictures.",
                ],
                accessPoints: [
                  "MA.4.GR.1.AP.1 — Informally explore angles as an attribute of two-dimensional figures. Limit angles to acute, obtuse and right.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15372",
              },
              {
                code: "MA.4.GR.1.2",
                description:
                  "Estimate angle measures. Using a protractor, measure angles in whole-number degrees and draw angles of specified measure in whole-number degrees. Demonstrate that angle measure is additive.",
                clarifications: [
                  "Instruction includes measuring given angles and drawing angles using protractors.",
                  "Instruction includes estimating angle measures using benchmark angles (30, 45, 60, 90 and 180 degrees).",
                  "Instruction focuses on the understanding that angles can be decomposed into non-overlapping angles whose measures sum to the measure of the original angle.",
                ],
                accessPoints: [
                  "MA.4.GR.1.AP.2 — Using a tool with a square angle, identify angles as acute, right or obtuse and construct angles that are acute, right or obtuse.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15373",
              },
              {
                code: "MA.4.GR.1.3",
                description:
                  "Solve real-world and mathematical problems involving unknown whole-number angle measures. Write an equation to represent the unknown.",
                clarifications: [
                  "Instruction includes the connection to angle measure as being additive.",
                ],
                accessPoints: [
                  "MA.4.GR.1.AP.3 — Recognize that angle measure is additive by exploring when an angle is decomposed into two non-overlapping parts the angle measure of the whole is the sum of the angle measures of the parts.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15374",
              },
            ],
          },
          {
            code: "MA.4.GR.2",
            displayName: "Perimeter and Area",
            standards: [
              {
                code: "MA.4.GR.2.1",
                description:
                  "Solve perimeter and area mathematical and real-world problems, including problems with unknown sides, for rectangles with whole-number side lengths.",
                clarifications: [
                  "Instruction extends the development of algebraic thinking where the symbolic representation of the unknown uses a letter.",
                  "Problems involving multiplication are limited to products of up to 3 digits by 2 digits. Problems involving division are limited to up to 4 digits divided by 1 digit.",
                  "Responses include the appropriate units in word form.",
                ],
                accessPoints: [
                  "MA.4.GR.2.AP.1 — Solve perimeter and area mathematical and real-world problems for rectangles with given whole-number side lengths.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15375",
              },
              {
                code: "MA.4.GR.2.2",
                description:
                  "Solve problems involving rectangles with the same perimeter and different areas or with the same area and different perimeters.",
                clarifications: [
                  "Instruction focuses on the conceptual understanding of the relationship between perimeter and area.",
                  "Within this benchmark, rectangles are limited to having whole-number side lengths.",
                  "Problems involving multiplication are limited to products of up to 3 digits by 2 digits. Problems involving division are limited to up to 4 digits divided by 1 digit.",
                  "Responses include the appropriate units in word form.",
                ],
                accessPoints: [
                  "MA.4.GR.2.AP.2 — Explore the relationship between perimeter and area using rectangles with the same perimeter and different areas or with the same area and different perimeters.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15376",
              },
            ],
          },
        ],
      },

      // ─────────────────────────────────────────────────────────────────────
      // STRAND: Data Analysis and Probability (DP)
      // IDs 15377–15379  |  3 benchmarks
      // ─────────────────────────────────────────────────────────────────────
      {
        code: "DP",
        displayName: "Data Analysis and Probability",
        groups: [
          {
            code: "MA.4.DP.1",
            displayName: "Represent and Interpret Data",
            standards: [
              {
                code: "MA.4.DP.1.1",
                description:
                  "Collect and represent numerical data, including fractional values, using tables, stem-and-leaf plots or line plots.",
                clarifications: [
                  "Denominators are limited to 2, 3, 4, 5, 6, 8, 10, 12, 16 and 100.",
                ],
                accessPoints: [
                  "MA.4.DP.1.AP.1 — Sort and represent numerical data, including fractional values using tables or line plots (when given a scaled number line). Data set to include only whole numbers and halves.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15377",
              },
              {
                code: "MA.4.DP.1.2",
                description:
                  "Determine the mode, median or range to interpret numerical data including fractional values, represented with tables, stem-and-leaf plots or line plots.",
                clarifications: [
                  "Instruction includes interpreting data within a real-world context.",
                  "Instruction includes recognizing that data sets can have one mode, no mode or more than one mode.",
                  "Within this benchmark, data sets are limited to an odd number when calculating the median.",
                  "Denominators are limited to 2, 3, 4, 5, 6, 8, 10, 12, 16 and 100.",
                ],
                accessPoints: [
                  "MA.4.DP.1.AP.2 — Determine the mode or range to interpret numerical data including fractional values, represented with tables or line plots. Data set to include only whole numbers and halves. Limit the greatest and least number in a data set to a whole number.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15378",
              },
              {
                code: "MA.4.DP.1.3",
                description:
                  "Solve real-world problems involving numerical data.",
                clarifications: [
                  "Instruction includes using any of the four operations to solve problems.",
                  "Data involving fractions with like denominators are limited to 2, 3, 4, 5, 6, 8, 10, 12, 16 and 100.",
                  "Data involving decimals are limited to hundredths.",
                ],
                accessPoints: [
                  "MA.4.DP.1.AP.3 — Solve one-step real-world problems involving numerical data represented with tables or line plots. Data set to include only whole numbers and halves.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15379",
              },
            ],
          },
        ],
      },
    ],
  },
};
