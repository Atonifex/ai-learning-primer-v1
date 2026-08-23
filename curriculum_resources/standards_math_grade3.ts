import type { SubjectSeed } from "../prisma/seeds/types";

export const standardsMathGrade3: SubjectSeed = {
  slug: "math_g3",
  domain: "MATH",
  gradeBand: "3",
  framework: "FL_BEST",
  displayName: "Grade 3 Mathematics",
  catalog: {
    version: "v1",
    label: "Florida Grade 3 Mathematics — B.E.S.T. Standards",
    framework: "FL_BEST",
    strands: [
      // ─────────────────────────────────────────────────────────────────────
      // STRAND: Number Sense and Operations (NSO)
      // ─────────────────────────────────────────────────────────────────────
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
                clarifications: [],
                accessPoints: [
                  "MA.3.NSO.1.AP.1 — Read and generate numbers from 0 to 1,000 using standard form and expanded form.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15307",
              },
              {
                code: "MA.3.NSO.1.2",
                description:
                  "Compose and decompose four-digit numbers in multiple ways using thousands, hundreds, tens and ones. Demonstrate each composition or decomposition using objects, drawings and expressions or equations.",
                clarifications: [],
                accessPoints: [
                  "MA.3.NSO.1.AP.2 — Compose and decompose three-digit numbers using hundreds, tens and ones. Demonstrate with objects, drawings, expressions, or equations.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15308",
              },
              {
                code: "MA.3.NSO.1.3",
                description:
                  "Plot, order and compare whole numbers up to 10,000.",
                clarifications: [
                  "When comparing, instruction includes using an appropriately scaled number line and using place values of the thousands, hundreds, tens, and ones digits.",
                  "Number lines scaled by 50s, 100s, or 1,000s must be provided and can represent any range of numbers.",
                  "The expectation is to use symbols (<, >, or =).",
                ],
                accessPoints: [
                  "MA.3.NSO.1.AP.3 — Plot, order and compare whole numbers up to 1,000.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15309",
              },
              {
                code: "MA.3.NSO.1.4",
                description:
                  "Round whole numbers from 0 to 1,000 to the nearest 10 or 100.",
                clarifications: [],
                accessPoints: [
                  "MA.3.NSO.1.AP.4 — Round whole numbers from 0 to 1,000 to the nearest 100 with visual support.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15310",
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
                clarifications: [],
                accessPoints: [
                  "MA.3.NSO.2.AP.1 — Apply a strategy to add and subtract two two-digit whole numbers.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15311",
              },
              {
                code: "MA.3.NSO.2.2",
                description:
                  "Explore multiplication of two whole numbers with products from 0 to 144, and related division facts.",
                clarifications: [
                  "Instruction includes equal groups, arrays, area models and equations.",
                  "One problem can be represented in multiple ways; understanding how representations relate to each other is expected.",
                  "Factors and divisors are limited to up to 12.",
                ],
                accessPoints: [
                  "MA.3.NSO.2.AP.2 — Explore multiplication of two whole numbers with products from 0 to 25, and related division facts, using manipulatives, drawings, or visual representations.",
                ],
                verificationStatus: "Partially verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15312",
              },
              {
                code: "MA.3.NSO.2.3",
                description:
                  "Multiply a one-digit whole number by a multiple of 10, up to 90, or a multiple of 100, up to 900, with procedural reliability.",
                clarifications: [],
                accessPoints: [
                  "MA.3.NSO.2.AP.3 — Multiply a one-digit whole number by a multiple of 10, up to 50, with visual support.",
                ],
                verificationStatus: "Partially verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15313",
              },
              {
                code: "MA.3.NSO.2.4",
                description:
                  "Multiply two whole numbers from 0 to 12 and divide using related facts with procedural reliability.",
                clarifications: [
                  "Instruction focuses on helping a student choose a method they can use reliably.",
                ],
                accessPoints: [
                  "MA.3.NSO.2.AP.4 — Explore the relationship between multiplication and division in order to multiply and divide. Multiplication may not exceed two single-digit whole numbers and their related division facts.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15314",
              },
            ],
          },
        ],
      },

      // ─────────────────────────────────────────────────────────────────────
      // STRAND: Fractions (FR)
      // ─────────────────────────────────────────────────────────────────────
      {
        code: "FR",
        displayName: "Fractions",
        groups: [
          {
            code: "MA.3.FR.1",
            displayName: "Fractions as Numbers",
            standards: [
              {
                code: "MA.3.FR.1.1",
                description:
                  "Represent and interpret unit fractions in the form 1/n as the quantity formed by one part when a whole is partitioned into n equal parts.",
                clarifications: [
                  "This benchmark emphasizes conceptual understanding through the use of manipulatives or visual models.",
                  "Instruction focuses on representing a unit fraction as part of a whole, part of a set, a point on a number line, a visual model or in fractional notation.",
                  "Denominators are limited to 2, 3, 4, 5, 6, 8, 10 and 12.",
                ],
                accessPoints: [
                  "MA.3.FR.1.AP.1 — Explore unit fractions in the form 1/n as the quantity formed by one part when a whole is partitioned into n equal parts. Denominators are limited to 2, 3 and 4.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15315",
              },
              {
                code: "MA.3.FR.1.2",
                description:
                  "Represent and interpret fractions, including fractions greater than one, in the form m/n as the result of adding the unit fraction 1/n to itself m times.",
                clarifications: [
                  "Instruction emphasizes conceptual understanding through the use of manipulatives or visual models, including circle graphs, to represent fractions.",
                  "Denominators are limited to 2, 3, 4, 5, 6, 8, 10 and 12.",
                ],
                accessPoints: [
                  "MA.3.FR.1.AP.2 — Explore fractions, less than or equal to a whole, in the form m/n as the result of adding the unit fraction 1/n to itself m times. Denominators are limited to 2, 3 and 4.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15316",
              },
              {
                code: "MA.3.FR.1.3",
                description:
                  "Read and write fractions, including fractions greater than one, using standard form, numeral-word form and word form.",
                clarifications: [
                  "Instruction focuses on making connections to reading and writing numbers to develop the understanding that fractions are numbers and to support algebraic thinking in later grades.",
                  "Denominators are limited to 2, 3, 4, 5, 6, 8, 10 and 12.",
                ],
                accessPoints: [
                  "MA.3.FR.1.AP.3 — Read and generate fractions, less than or equal to a whole, using standard form.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15317",
              },
            ],
          },
          {
            code: "MA.3.FR.2",
            displayName: "Operations with Fractions",
            standards: [
              {
                code: "MA.3.FR.2.1",
                description:
                  "Plot, order and compare fractional numbers with the same numerator or the same denominator.",
                clarifications: [
                  "Instruction includes making connections between using a ruler and plotting and ordering fractions on a number line.",
                  "When comparing fractions, instruction includes an appropriately scaled number line and using reasoning about their size.",
                  "Fractions include fractions greater than one, including mixed numbers, with denominators limited to 2, 3, 4, 5, 6, 8, 10 and 12.",
                ],
                accessPoints: [
                  "MA.3.FR.2.AP.1 — Compare fractional numbers with the same denominator. Denominators are limited to 2, 3 and 4.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15318",
              },
              {
                code: "MA.3.FR.2.2",
                description:
                  "Identify equivalent fractions and explain why they are equivalent.",
                clarifications: [
                  "Instruction includes identifying equivalent fractions and explaining why they are equivalent using manipulatives, drawings, and number lines.",
                  "Within this benchmark, the expectation is not to generate equivalent fractions.",
                  "Fractions are limited to fractions less than or equal to one with denominators of 2, 3, 4, 5, 6, 8, 10 and 12. Number lines must be given and scaled appropriately.",
                ],
                accessPoints: [
                  "MA.3.FR.2.AP.2 — Using a visual model, recognize fractions less than a whole that are equivalent to fractions with denominators of 2, 3 or 4.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15319",
              },
            ],
          },
        ],
      },

      // ─────────────────────────────────────────────────────────────────────
      // STRAND: Algebraic Reasoning (AR)
      // ─────────────────────────────────────────────────────────────────────
      {
        code: "AR",
        displayName: "Algebraic Reasoning",
        groups: [
          {
            code: "MA.3.AR.1",
            displayName: "Multiplication and Division",
            standards: [
              {
                code: "MA.3.AR.1.1",
                description:
                  "Apply the distributive property to multiply a one-digit number and two-digit number. Apply properties of multiplication to find a product of one-digit whole numbers.",
                clarifications: [
                  "Within this benchmark, the expectation is to apply the associative and commutative properties of multiplication, the distributive property and name the properties.",
                  "Within the benchmark, the expectation is to utilize parentheses.",
                  "Multiplication for products of three or more numbers is limited to factors within 12.",
                ],
                accessPoints: [
                  "MA.3.AR.1.AP.1 — Apply the commutative property of multiplication to find a product of one-digit whole numbers.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15320",
              },
              {
                code: "MA.3.AR.1.2",
                description:
                  "Solve one- and two-step real-world problems involving any of four operations with whole numbers.",
                clarifications: [
                  "Instruction includes understanding the context of the problem, as well as the quantities within the problem.",
                  "Multiplication is limited to factors within 12 and related division facts.",
                ],
                accessPoints: [
                  "MA.3.AR.1.AP.2a — Solve one- and two-step addition and subtraction real-world problems within 100.",
                  "MA.3.AR.1.AP.2b — Solve one-step multiplication and division real-world problems. Multiplication may not exceed two single-digit whole numbers and their related division facts.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15321",
              },
            ],
          },
          {
            code: "MA.3.AR.2",
            displayName: "Equality",
            standards: [
              {
                code: "MA.3.AR.2.1",
                description:
                  "Restate a division problem as a missing factor problem using the relationship between multiplication and division.",
                clarifications: [
                  "Multiplication is limited to factors within 12 and related division facts.",
                  "Within this benchmark, the symbolic representation of the missing factor uses any symbol or a letter.",
                ],
                accessPoints: [
                  "MA.3.AR.2.AP.1 — Explore division as multiplication with a missing factor using the relationship between multiplication and division.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15322",
              },
              {
                code: "MA.3.AR.2.2",
                description:
                  "Determine and explain whether an equation involving multiplication or division is true or false.",
                clarifications: [
                  "Instruction extends the understanding of the meaning of the equal sign to multiplication and division.",
                  "Problem types are limited to an equation with three or four terms. The product or quotient can be on either side of the equal sign.",
                  "Multiplication is limited to factors within 12 and related division facts.",
                ],
                accessPoints: [
                  "MA.3.AR.2.AP.2 — Determine if multiplication or division equations with no more than three terms are true or false. Multiplication may not exceed two single-digit whole numbers and their related division facts.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15323",
              },
              {
                code: "MA.3.AR.2.3",
                description:
                  "Determine the unknown whole number in a multiplication or division equation, relating three whole numbers, with the unknown in any position.",
                clarifications: [
                  "Instruction extends the development of algebraic thinking skills where the symbolic representation of the unknown uses any symbol or a letter.",
                  "Problems include the unknown on either side of the equal sign.",
                  "Multiplication is limited to factors within 12 and related division facts.",
                ],
                accessPoints: [
                  "MA.3.AR.2.AP.3 — Determine the unknown whole number in a multiplication or division equation, relating three whole numbers, with the product or quotient unknown (e.g., 2 × 5 = __, 10 ÷ 5 = __). Multiplication may not exceed two single-digit whole numbers and their related division facts.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15324",
              },
            ],
          },
          {
            code: "MA.3.AR.3",
            displayName: "Patterns",
            standards: [
              {
                code: "MA.3.AR.3.1",
                description:
                  "Determine and explain whether a whole number from 1 to 1,000 is even or odd.",
                clarifications: [
                  "Instruction includes determining and explaining using place value and recognizing patterns.",
                ],
                accessPoints: [
                  "MA.3.AR.3.AP.1 — Determine whether a whole number from 1 to 100 is even or odd.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15325",
              },
              {
                code: "MA.3.AR.3.2",
                description:
                  "Determine whether a whole number from 1 to 144 is a multiple of a given one-digit number.",
                clarifications: [
                  "Instruction includes determining if a number is a multiple of a given number by using multiplication or division.",
                ],
                accessPoints: [
                  "MA.3.AR.3.AP.2 — Explore that a whole number is a multiple of each of its factors. Factors not to exceed single-digit whole numbers.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15326",
              },
              {
                code: "MA.3.AR.3.3",
                description:
                  "Identify, create and extend numerical patterns.",
                clarifications: [
                  "The expectation is to use ordinal numbers (1st, 2nd, 3rd, …) to describe the position of a number within a sequence.",
                  "Problem types include patterns involving addition, subtraction, multiplication or division of whole numbers.",
                ],
                accessPoints: [
                  "MA.3.AR.3.AP.3 — Extend a numerical pattern when given a one-step addition rule (e.g., when given the pattern 5, 10, 15, use the rule add 5 to extend the pattern).",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15327",
              },
            ],
          },
        ],
      },

      // ─────────────────────────────────────────────────────────────────────
      // STRAND: Measurement (M)
      // ─────────────────────────────────────────────────────────────────────
      {
        code: "M",
        displayName: "Measurement",
        groups: [
          {
            code: "MA.3.M.1",
            displayName: "Measure Lengths, Volumes, Masses, and Temperatures",
            standards: [
              {
                code: "MA.3.M.1.1",
                description:
                  "Select and use appropriate tools to measure the length of an object, the volume of liquid within a beaker and temperature.",
                clarifications: [
                  "Instruction focuses on identifying measurement on a linear scale, making the connection to the number line.",
                  "When measuring length, limited to the nearest centimeter and half or quarter inch.",
                  "When measuring temperature, limited to the nearest degree.",
                  "When measuring the volume of liquid, limited to nearest milliliter and half or quarter cup.",
                ],
                accessPoints: [
                  "MA.3.M.1.AP.1a — Select and use appropriate tools to measure the length (i.e., inches, feet, yards) of an object.",
                  "MA.3.M.1.AP.1b — Explore selecting and using appropriate tools to measure liquid volume (i.e., gallons, quarts, pints, cups) and temperature in degrees Fahrenheit.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15328",
              },
              {
                code: "MA.3.M.1.2",
                description:
                  "Solve real-world problems involving any of the four operations with whole-number lengths, masses, weights, temperatures or liquid volumes.",
                clarifications: [
                  "Within this benchmark, responses include appropriate units.",
                  "Problem types are not expected to include measurement conversions.",
                  "Instruction includes the comparison of attributes measured in the same units.",
                  "Units are limited to yards, feet, inches; meters, centimeters; pounds, ounces; kilograms, grams; degrees Fahrenheit, degrees Celsius; gallons, quarts, pints, cups; and liters, milliliters.",
                ],
                accessPoints: [
                  "MA.3.M.1.AP.2a — Solve one- and two-step addition and subtraction real-world problems within 100 with whole number lengths, temperatures or liquid volumes.",
                  "MA.3.M.1.AP.2b — Solve one-step multiplication and division real-world problems with whole number lengths, temperatures or liquid volumes. Multiplication may not exceed two single-digit whole numbers and their related division facts.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15329",
              },
            ],
          },
          {
            code: "MA.3.M.2",
            displayName: "Tell and Write Time",
            standards: [
              {
                code: "MA.3.M.2.1",
                description:
                  "Using analog and digital clocks tell and write time to the nearest minute using a.m. and p.m. appropriately.",
                clarifications: [
                  "Within this benchmark, the expectation is not to understand military time.",
                ],
                accessPoints: [
                  "MA.3.M.2.AP.1 — Using analog and digital clocks, express the time to the nearest five minutes using a.m. and p.m. appropriately.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15330",
              },
              {
                code: "MA.3.M.2.2",
                description:
                  "Solve one- and two-step real-world problems involving elapsed time.",
                clarifications: [
                  "Within this benchmark, the expectation is not to include crossing between a.m. and p.m.",
                ],
                accessPoints: [
                  "MA.3.M.2.AP.2 — Solve for end time in one-step real-world problems when given start time and elapsed time in whole hours or minutes within the hour.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15331",
              },
            ],
          },
        ],
      },

      // ─────────────────────────────────────────────────────────────────────
      // STRAND: Geometric Reasoning (GR)
      // ─────────────────────────────────────────────────────────────────────
      {
        code: "GR",
        displayName: "Geometric Reasoning",
        groups: [
          {
            code: "MA.3.GR.1",
            displayName: "Geometric Figures",
            standards: [
              {
                code: "MA.3.GR.1.1",
                description:
                  "Describe and draw points, lines, line segments, rays, intersecting lines, perpendicular lines and parallel lines. Identify these in two-dimensional figures.",
                clarifications: [
                  "Instruction includes mathematical and real-world context for identifying points, lines, line segments, rays, intersecting lines, perpendicular lines and parallel lines.",
                  "When working with perpendicular lines, right angles can be called square angles or square corners.",
                ],
                accessPoints: [
                  "MA.3.GR.1.AP.1 — Identify points, lines, line segments, perpendicular lines and parallel lines. Identify these in two-dimensional figures.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15332",
              },
              {
                code: "MA.3.GR.1.2",
                description:
                  "Identify and draw quadrilaterals based on their defining attributes. Quadrilaterals include parallelograms, rhombi, rectangles, squares and trapezoids.",
                clarifications: [
                  "Instruction includes a variety of quadrilaterals and a variety of non-examples that lack one or more defining attributes when identifying quadrilaterals.",
                  "Quadrilaterals will be filled, outlined or both when identifying.",
                  "Drawing representations must be reasonably accurate.",
                ],
                accessPoints: [
                  "MA.3.GR.1.AP.2 — Identify quadrilaterals based on their defining attributes. Quadrilaterals include parallelograms, rhombi, rectangles, squares and trapezoids.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15333",
              },
              {
                code: "MA.3.GR.1.3",
                description:
                  "Draw line(s) of symmetry in a two-dimensional figure and identify line-symmetric two-dimensional figures.",
                clarifications: [
                  "Instruction develops the understanding that there could be no line of symmetry, exactly one line of symmetry or more than one line of symmetry.",
                  "Instruction includes folding paper along a line of symmetry so that both halves match exactly to confirm line-symmetric figures.",
                ],
                accessPoints: [
                  "MA.3.GR.1.AP.3 — Identify line-symmetric two-dimensional figures.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15334",
              },
            ],
          },
          {
            code: "MA.3.GR.2",
            displayName: "Perimeter and Area",
            standards: [
              {
                code: "MA.3.GR.2.1",
                description:
                  "Explore area as an attribute of a two-dimensional figure by covering the figure with unit squares without gaps or overlaps. Find areas of rectangles by counting unit squares.",
                clarifications: [
                  "Instruction emphasizes the conceptual understanding that area is an attribute that can be measured for a two-dimensional figure. The measurement unit for area is the area of a unit square, which is a square with side length of 1 unit.",
                  "Two-dimensional figures cannot exceed 12 units by 12 units and responses include the appropriate units in word form (e.g., square centimeter or sq. cm.).",
                ],
                accessPoints: [
                  "MA.3.GR.2.AP.1 — Explore area as an attribute of a two-dimensional figure that can be measured by covering the figure with unit squares without gaps or overlaps.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15335",
              },
              {
                code: "MA.3.GR.2.2",
                description:
                  "Find the area of a rectangle with whole-number side lengths using a visual model and a multiplication formula.",
                clarifications: [
                  "Instruction includes covering the figure with unit squares, a rectangular array or applying a formula.",
                  "Two-dimensional figures cannot exceed 12 units by 12 units and responses include the appropriate units in word form.",
                ],
                accessPoints: [
                  "MA.3.GR.2.AP.2 — Find the area of a rectangle with whole-number side lengths by counting unit squares. Explore that the area is the same as what would be found by multiplying the side lengths.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15336",
              },
              {
                code: "MA.3.GR.2.3",
                description:
                  "Solve mathematical and real-world problems involving the perimeter and area of rectangles with whole-number side lengths using a visual model and a formula.",
                clarifications: [
                  "Within this benchmark, the expectation is not to find unknown side lengths.",
                  "Two-dimensional figures cannot exceed 12 units by 12 units and responses include the appropriate units in word form.",
                ],
                accessPoints: [
                  "MA.3.GR.2.AP.3 — Solve mathematical and real-world problems involving the perimeter and area of rectangles with whole-number side lengths using a visual model.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15337",
              },
              {
                code: "MA.3.GR.2.4",
                description:
                  "Solve mathematical and real-world problems involving the perimeter and area of composite figures composed of non-overlapping rectangles with whole-number side lengths.",
                clarifications: [
                  "Composite figures must be composed of non-overlapping rectangles.",
                  "Each rectangle within the composite figure cannot exceed 12 units by 12 units and responses include the appropriate units in word form.",
                ],
                accessPoints: [
                  "MA.3.GR.2.AP.4 — Explore the perimeter and area of composite figures composed of two non-overlapping rectangles with whole-number side lengths.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15338",
              },
            ],
          },
        ],
      },

      // ─────────────────────────────────────────────────────────────────────
      // STRAND: Data Analysis and Probability (DP)
      // ─────────────────────────────────────────────────────────────────────
      {
        code: "DP",
        displayName: "Data Analysis and Probability",
        groups: [
          {
            code: "MA.3.DP.1",
            displayName: "Represent and Interpret Data",
            standards: [
              {
                code: "MA.3.DP.1.1",
                description:
                  "Collect and represent numerical and categorical data with whole-number values using tables, scaled pictographs, scaled bar graphs or line plots. Use appropriate titles, labels and units.",
                clarifications: [
                  "Within this benchmark, the expectation is to complete a representation or construct a representation from a data set.",
                  "Instruction includes the connection between multiplication and the number of data points represented by a bar in a scaled bar graph or a scaled column in a pictograph.",
                  "Data displays are represented both horizontally and vertically.",
                ],
                accessPoints: [
                  "MA.3.DP.1.AP.1a — Sort and represent categorical data (up to four categories) with whole-number values using tables, pictographs or bar graphs. Select appropriate title, labels and units.",
                  "MA.3.DP.1.AP.1b — Explore representing numerical data with whole-number values using line plots.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15339",
              },
              {
                code: "MA.3.DP.1.2",
                description:
                  "Interpret data with whole-number values represented with tables, scaled pictographs, circle graphs, scaled bar graphs or line plots by solving one- and two-step problems.",
                clarifications: [
                  "Problems include the use of data in informal comparisons between two data sets in the same units.",
                  "Data displays can be represented both horizontally and vertically.",
                  "Circle graphs are limited to showing the total values in each category.",
                ],
                accessPoints: [
                  "MA.3.DP.1.AP.2a — Interpret data with whole-number values represented with tables, pictographs or bar graphs to solve one-step 'how many more' and 'how many less' problems.",
                  "MA.3.DP.1.AP.2b — Interpret data with whole-number values represented with scaled pictographs or scaled bar graphs.",
                  "MA.3.DP.1.AP.2c — Explore interpreting data with whole-number values represented with line plots.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/15340",
              },
            ],
          },
        ],
      },
    ],
  },
};
