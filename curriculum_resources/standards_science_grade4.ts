import type { SubjectSeed } from "../prisma/seeds/types";

// Note: Grade 4 Science uses NGSSS (Next Generation Sunshine State Standards).
// Access points follow the In/Su/Pa (Independent/Supported/Participatory) format
// rather than the AP format used in B.E.S.T. Math and 2023 FL Social Studies.

export const standardsScienceGrade4: SubjectSeed = {
  slug: "science_g4",
  domain: "SCIENCE",
  gradeBand: "4",
  framework: "NGSSS",
  displayName: "Grade 4 Science",
  catalog: {
    version: "v1",
    label: "Florida Grade 4 Science — NGSSS",
    framework: "NGSSS",
    strands: [
      // ─────────────────────────────────────────────────────────────────────
      // STRAND: Nature of Science (N)
      // IDs 1630–1632, 1661–1672  |  10 benchmarks
      // ─────────────────────────────────────────────────────────────────────
      {
        code: "N",
        displayName: "Nature of Science",
        groups: [
          {
            code: "SC.4.N.1",
            displayName: "The Practice of Science",
            standards: [
              {
                code: "SC.4.N.1.1",
                description:
                  "Raise questions about the natural world, use appropriate reference materials that support understanding to obtain information (identifying the source), conduct both individual and team investigations through free exploration and systematic investigations, and generate appropriate explanations based on those explorations.",
                clarifications: [],
                accessPoints: [
                  "SC.4.N.1.In.1 — Ask a question about the natural world and use selected reference material to find information, observe, explore, and identify findings.",
                  "SC.4.N.1.Su.1 — Ask a question about the natural world, explore materials, observe, and share information.",
                  "SC.4.N.1.Pa.1 — Explore, observe, and select an object or picture to solve a simple problem.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1661",
              },
              {
                code: "SC.4.N.1.2",
                description:
                  "Compare the observations made by different groups using multiple tools and seek reasons to explain the differences across groups.",
                clarifications: [],
                accessPoints: [
                  "SC.4.N.1.In.2 — Compare own observations with observations of others.",
                  "SC.4.N.1.Su.2 — Identify information based on observations of self and others.",
                  "SC.4.N.1.Pa.2 — Observe and explore with a partner.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1662",
              },
              {
                code: "SC.4.N.1.3",
                description:
                  "Explain that science does not always follow a rigidly defined method (\"the scientific method\") but that science does involve the use of observations and empirical evidence.",
                clarifications: [],
                accessPoints: [
                  "SC.4.N.1.In.3 — Recognize that science involves asking questions and finding answers through observation.",
                  "SC.4.N.1.Su.3 — Recognize that science involves making observations.",
                  "SC.4.N.1.Pa.1 — Explore, observe, and select an object or picture to solve a simple problem.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1663",
              },
              {
                code: "SC.4.N.1.4",
                description:
                  "Attempt reasonable answers to scientific questions and cite evidence in support.",
                clarifications: [],
                accessPoints: [
                  "SC.4.N.1.In.4 — Answer a question about the natural world and identify evidence that supports the answer.",
                  "SC.4.N.1.Su.4 — Answer a question about the natural world.",
                  "SC.4.N.1.Pa.4 — Respond to a question about the natural world.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1630",
              },
              {
                code: "SC.4.N.1.5",
                description:
                  "Compare the methods and results of investigations done by other classmates.",
                clarifications: [],
                accessPoints: [
                  "SC.4.N.1.In.2 — Compare own observations with observations of others.",
                  "SC.4.N.1.Su.2 — Identify information based on observations of self and others.",
                  "SC.4.N.1.Pa.2 — Observe and explore with a partner.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1631",
              },
              {
                code: "SC.4.N.1.6",
                description:
                  "Keep records that describe observations made, carefully distinguishing actual observations from ideas and inferences about the observations.",
                clarifications: [],
                accessPoints: [
                  "SC.4.N.1.In.6 — Keep records that describe observations and identify simple inferences about those observations.",
                  "SC.4.N.1.Su.6 — Keep records that describe observations.",
                  "SC.4.N.1.Pa.1 — Explore, observe, and select an object or picture to solve a simple problem.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1668",
              },
              {
                code: "SC.4.N.1.7",
                description:
                  "Recognize and explain that scientists base their explanations on evidence.",
                clarifications: [],
                accessPoints: [
                  "SC.4.N.1.In.7 — Recognize that scientific explanations are based on evidence.",
                  "SC.4.N.1.Su.7 — Recognize that scientists use evidence to explain things.",
                  "SC.4.N.1.Pa.7 — Recognize that scientists make observations.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1669",
              },
              {
                code: "SC.4.N.1.8",
                description:
                  "Recognize that science involves creativity, not just in designing experiments, but also in creating explanations that fit evidence.",
                clarifications: [],
                accessPoints: [
                  "SC.4.N.1.In.8 — Recognize that science requires creative thinking to design investigations and explain findings.",
                  "SC.4.N.1.Su.8 — Recognize that science involves thinking of new ideas and ways to find answers.",
                  "SC.4.N.1.Pa.1 — Explore, observe, and select an object or picture to solve a simple problem.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1670",
              },
            ],
          },
          {
            code: "SC.4.N.2",
            displayName: "The Characteristics of Scientific Knowledge",
            standards: [
              {
                code: "SC.4.N.2.1",
                description: "Explain that science focuses solely on the natural world.",
                clarifications: [],
                accessPoints: [
                  "SC.4.N.2.In.1 — Recognize that science is a way to learn about the natural world.",
                  "SC.4.N.2.Su.1 — Recognize that science is about the natural world.",
                  "SC.4.N.2.Pa.1 — Recognize that science is about things in nature.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1671",
              },
            ],
          },
          {
            code: "SC.4.N.3",
            displayName: "The Role of Theories, Laws, Hypotheses, and Models",
            standards: [
              {
                code: "SC.4.N.3.1",
                description:
                  "Explain that models can be three dimensional, two dimensional, an explanation in your mind, or a computer model.",
                clarifications: [],
                accessPoints: [
                  "SC.4.N.3.In.1 — Identify different types of models, such as a replica, a picture, or an animation.",
                  "SC.4.N.3.Su.1 — Recognize different types of models, such as a replica or a picture.",
                  "SC.4.N.3.Pa.1 — Match a model that is a replica to a real object.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1672",
              },
            ],
          },
        ],
      },

      // ─────────────────────────────────────────────────────────────────────
      // STRAND: Physical Science (P)
      // IDs 1682–1695  |  13 benchmarks
      // ─────────────────────────────────────────────────────────────────────
      {
        code: "P",
        displayName: "Physical Science",
        groups: [
          {
            code: "SC.4.P.8",
            displayName: "Properties of Matter",
            standards: [
              {
                code: "SC.4.P.8.1",
                description:
                  "Measure and compare objects and materials based on their physical properties including: mass, shape, volume, color, hardness, texture, odor, magnetic attraction, and conductivity.",
                clarifications: [],
                accessPoints: [
                  "SC.4.P.8.In.1 — Identify physical properties of objects and materials, including mass, shape, volume, color, hardness, and texture.",
                  "SC.4.P.8.Su.1 — Identify physical properties of objects and materials, such as color, shape, and texture.",
                  "SC.4.P.8.Pa.1 — Recognize objects by physical properties, such as color and shape.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1687",
              },
              {
                code: "SC.4.P.8.2",
                description:
                  "Identify properties and common uses of water in each of its states.",
                clarifications: [],
                accessPoints: [
                  "SC.4.P.8.In.2 — Identify properties and uses of water as a solid, liquid, and gas.",
                  "SC.4.P.8.Su.2 — Identify water as a solid (ice), liquid (water), and gas (steam/water vapor).",
                  "SC.4.P.8.Pa.2 — Recognize water as a liquid.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1682",
              },
              {
                code: "SC.4.P.8.3",
                description:
                  "Explore the Law of Conservation of Mass by demonstrating that the mass of a whole object is always the same as the sum of the masses of its parts.",
                clarifications: [],
                accessPoints: [
                  "SC.4.P.8.In.3 — Recognize that the total mass of an object is the same as the sum of the masses of its parts.",
                  "SC.4.P.8.Su.3 — Recognize that breaking an object into parts does not change the total amount of material.",
                  "SC.4.P.8.Pa.3 — Recognize that a whole object can be separated into parts.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1688",
              },
              {
                code: "SC.4.P.8.4",
                description:
                  "Investigate and describe that magnets can attract magnetic materials and attract and repel other magnets.",
                clarifications: [],
                accessPoints: [
                  "SC.4.P.8.In.4 — Recognize that magnets attract some materials and that two magnets can attract or repel each other.",
                  "SC.4.P.8.Su.4 — Recognize that magnets attract some materials.",
                  "SC.4.P.8.Pa.4 — Recognize that a magnet can attract some objects.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1689",
              },
            ],
          },
          {
            code: "SC.4.P.9",
            displayName: "Changes in Matter",
            standards: [
              {
                code: "SC.4.P.9.1",
                description:
                  "Identify some familiar changes in materials that result in other materials with different characteristics, such as decaying animal or plant matter, burning, rusting, and cooking.",
                clarifications: [],
                accessPoints: [
                  "SC.4.P.9.In.1 — Identify familiar changes in materials that result in new materials with different characteristics, such as burning and cooking.",
                  "SC.4.P.9.Su.1 — Recognize familiar changes in materials that result in different materials, such as burning and cooking.",
                  "SC.4.P.9.Pa.1 — Recognize that materials can change.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1690",
              },
            ],
          },
          {
            code: "SC.4.P.10",
            displayName: "Forms of Energy",
            standards: [
              {
                code: "SC.4.P.10.1",
                description:
                  "Observe and describe some basic forms of energy, including light, heat, sound, electrical, and the energy of motion.",
                clarifications: [],
                accessPoints: [
                  "SC.4.P.10.In.1 — Identify forms of energy, such as light, heat, electrical, and energy of motion.",
                  "SC.4.P.10.Su.1 — Recognize uses of different forms of energy, including electricity (computer, freezer); heat (camp fire, stove); and energy of motion (rollercoaster, pinball machine).",
                  "SC.4.P.10.Pa.1 — Recognize a source of heat energy (fire, heater).",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1691",
              },
              {
                code: "SC.4.P.10.2",
                description:
                  "Investigate and describe that energy has the ability to cause motion or create change.",
                clarifications: [],
                accessPoints: [
                  "SC.4.P.10.In.2 — Describe the results of applying electrical energy (turn on lights, make motors run); heat energy (burn wood, change temperature); and energy of motion (go faster, change direction).",
                  "SC.4.P.10.Su.2 — Recognize the results of using electrical energy (turning on television); heat energy (burning wood); and energy of motion (rolling ball).",
                  "SC.4.P.10.Pa.1 — Recognize a source of heat energy (fire, heater).",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1683",
              },
              {
                code: "SC.4.P.10.3",
                description:
                  "Investigate and explain that sound is produced by vibrating objects and that pitch depends on how fast or slow the object vibrates.",
                clarifications: [],
                accessPoints: [
                  "SC.4.P.10.In.3 — Recognize that vibrations cause sound and identify that the speed of vibrations can change the pitch of a sound.",
                  "SC.4.P.10.Su.3 — Recognize that vibrations cause sound.",
                  "SC.4.P.10.Pa.3 — Recognize a source of sound.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1692",
              },
              {
                code: "SC.4.P.10.4",
                description:
                  "Describe how moving water and air are sources of energy and can be used to move things.",
                clarifications: [],
                accessPoints: [
                  "SC.4.P.10.In.4 — Identify that moving water and air can be used as sources of energy.",
                  "SC.4.P.10.Su.4 — Recognize that moving water and air can move objects.",
                  "SC.4.P.10.Pa.4 — Recognize that moving air can move objects.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1684",
              },
            ],
          },
          {
            code: "SC.4.P.11",
            displayName: "Energy Transfer and Transformations",
            standards: [
              {
                code: "SC.4.P.11.1",
                description:
                  "Recognize that heat flows from a hot object to a cold object and that heat flow may cause materials to change temperature.",
                clarifications: [],
                accessPoints: [
                  "SC.4.P.11.In.1 — Recognize that heat moves from warmer objects to cooler objects and that this can change the temperature of objects.",
                  "SC.4.P.11.Su.1 — Recognize that heat can change the temperature of an object.",
                  "SC.4.P.11.Pa.1 — Recognize that objects can feel hot or cold.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1693",
              },
              {
                code: "SC.4.P.11.2",
                description:
                  "Identify common materials that conduct heat well or poorly.",
                clarifications: [],
                accessPoints: [
                  "SC.4.P.11.In.2 — Identify common materials that conduct heat well, such as metals, and common materials that do not conduct heat well, such as wood and plastic.",
                  "SC.4.P.11.Su.2 — Identify common materials that conduct heat well and materials that do not conduct heat well.",
                  "SC.4.P.11.Pa.2 — Recognize that some materials conduct heat well and others do not.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1632",
              },
            ],
          },
          {
            code: "SC.4.P.12",
            displayName: "Motion of Objects",
            standards: [
              {
                code: "SC.4.P.12.1",
                description:
                  "Recognize that an object in motion always changes its position and may change its direction.",
                clarifications: [],
                accessPoints: [
                  "SC.4.P.12.In.1 — Recognize that a moving object changes position and may change direction.",
                  "SC.4.P.12.Su.1 — Recognize that movement causes an object to change position.",
                  "SC.4.P.12.Pa.1 — Recognize that an object can move in different directions, such as left to right, straight line, and zigzag.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1694",
              },
              {
                code: "SC.4.P.12.2",
                description:
                  "Investigate and describe that the speed of an object is determined by the distance it travels in a unit of time and that objects can move at different speeds.",
                clarifications: [],
                accessPoints: [
                  "SC.4.P.12.In.2 — Identify speed as how long it takes to travel a certain distance.",
                  "SC.4.P.12.Su.2 — Identify objects that move at different speeds.",
                  "SC.4.P.12.Pa.2 — Recognize an object as moving fast or slow.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1695",
              },
            ],
          },
        ],
      },

      // ─────────────────────────────────────────────────────────────────────
      // STRAND: Life Science (L)
      // IDs 1664, 1696–1704  |  8 benchmarks
      // ─────────────────────────────────────────────────────────────────────
      {
        code: "L",
        displayName: "Life Science",
        groups: [
          {
            code: "SC.4.L.16",
            displayName: "Heredity and Reproduction",
            standards: [
              {
                code: "SC.4.L.16.1",
                description:
                  "Identify processes of sexual reproduction in flowering plants, including pollination, fertilization (seed production), seed dispersal, and germination.",
                clarifications: [],
                accessPoints: [
                  "SC.4.L.16.In.1 — Identify that insects spread pollen to plants and that pollination is needed for plants to produce seeds.",
                  "SC.4.L.16.Su.1 — Recognize that plants make seeds and that seeds grow into new plants.",
                  "SC.4.L.16.Pa.1 — Recognize that plants grow from seeds.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1696",
              },
              {
                code: "SC.4.L.16.2",
                description:
                  "Explain that although characteristics of plants and animals are inherited, some characteristics can be affected by the environment.",
                clarifications: [],
                accessPoints: [
                  "SC.4.L.16.In.2 — Recognize that some of the differences between parents and offspring are due to the environment.",
                  "SC.4.L.16.Su.2 — Recognize that offspring of plants and animals look like their parents but may also be different.",
                  "SC.4.L.16.Pa.2 — Recognize that a plant or animal looks like its parent.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1697",
              },
              {
                code: "SC.4.L.16.3",
                description:
                  "Recognize that animal groups are composed of males and females that reproduce sexually, resulting in offspring that are similar to, but not exactly like, their parents.",
                clarifications: [],
                accessPoints: [
                  "SC.4.L.16.In.3 — Identify similarities in the major stages in the life cycles of common Florida plants and animals.",
                  "SC.4.L.16.Su.3 — Recognize the major stages in life cycles of common plants and animals.",
                  "SC.4.L.16.Pa.3 — Match offspring of animals with parents.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1664",
              },
              {
                code: "SC.4.L.16.4",
                description:
                  "Compare and contrast the major stages in the life cycles of Florida plants and animals, such as those that undergo incomplete and complete metamorphosis, and flowering and nonflowering seed-bearing plants.",
                clarifications: [],
                accessPoints: [
                  "SC.4.L.16.In.3 — Identify similarities in the major stages in the life cycles of common Florida plants and animals.",
                  "SC.4.L.16.Su.3 — Recognize the major stages in life cycles of common plants and animals.",
                  "SC.4.L.16.Pa.3 — Match offspring of animals with parents.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1698",
              },
            ],
          },
          {
            code: "SC.4.L.17",
            displayName: "Interdependence",
            standards: [
              {
                code: "SC.4.L.17.1",
                description:
                  "Compare the seasonal changes in Florida plants and animals to those in other regions of the country.",
                clarifications: [],
                accessPoints: [
                  "SC.4.L.17.In.1 — Identify seasonal changes in Florida plants and animals.",
                  "SC.4.L.17.Su.1 — Recognize seasonal changes in some Florida plants, such as the presence of flowers and change in leaf color.",
                  "SC.4.L.17.Pa.1 — Recognize a seasonal change in the appearance of a common plant.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1701",
              },
              {
                code: "SC.4.L.17.2",
                description:
                  "Explain that animals, including humans, cannot make their own food and that when animals eat plants or other animals, the energy stored in the food source is passed to them.",
                clarifications: [],
                accessPoints: [
                  "SC.4.L.17.In.2 — Identify that animals get energy from the food they eat.",
                  "SC.4.L.17.Su.2 — Recognize that animals eat food to get energy.",
                  "SC.4.L.17.Pa.2 — Recognize that animals eat food.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1702",
              },
              {
                code: "SC.4.L.17.3",
                description:
                  "Trace the flow of energy from the Sun as it is transferred along the food chain through the producers, primary and secondary consumers, and decomposers.",
                clarifications: [],
                accessPoints: [
                  "SC.4.L.17.In.3 — Identify the roles of producers, consumers, and decomposers in a food chain.",
                  "SC.4.L.17.Su.3 — Recognize that plants use sunlight to make food and that animals eat plants or other animals to get energy.",
                  "SC.4.L.17.Pa.3 — Recognize that the Sun provides energy for plants.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1703",
              },
              {
                code: "SC.4.L.17.4",
                description:
                  "Describe changes in an ecosystem resulting from seasonal variations, climate change, and the introduction of invasive, non-native species.",
                clarifications: [],
                accessPoints: [
                  "SC.4.L.17.In.4 — Identify that changes in an environment can affect the plants and animals that live there.",
                  "SC.4.L.17.Su.4 — Recognize that changes in the environment can affect living things.",
                  "SC.4.L.17.Pa.4 — Recognize that plants and animals live in different environments.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1704",
              },
            ],
          },
        ],
      },

      // ─────────────────────────────────────────────────────────────────────
      // STRAND: Earth and Space Science (E)
      // IDs 1673–1686  |  11 benchmarks
      // ─────────────────────────────────────────────────────────────────────
      {
        code: "E",
        displayName: "Earth and Space Science",
        groups: [
          {
            code: "SC.4.E.5",
            displayName: "Earth in Space and Time",
            standards: [
              {
                code: "SC.4.E.5.1",
                description:
                  "Observe that the patterns of stars in the sky stay the same although they appear to shift across the sky nightly, and different stars can be seen in different seasons.",
                clarifications: [],
                accessPoints: [
                  "SC.4.E.5.In.1 — Identify that there are many stars in the sky with some that create patterns.",
                  "SC.4.E.5.Su.1 — Recognize a pattern of stars in the sky, such as the Big Dipper.",
                  "SC.4.E.5.Pa.1 — Recognize that there are many stars in the sky.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1673",
              },
              {
                code: "SC.4.E.5.2",
                description:
                  "Describe the changes in the observable shape of the moon over the course of about a month.",
                clarifications: [],
                accessPoints: [
                  "SC.4.E.5.In.2 — Label three phases of the moon, including full, half (quarter), and crescent.",
                  "SC.4.E.5.Su.2 — Identify a full moon and a half (quarter) moon.",
                  "SC.4.E.5.Pa.2 — Recognize a full moon as a circle.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1674",
              },
              {
                code: "SC.4.E.5.3",
                description:
                  "Recognize that Earth revolves around the Sun in a year and rotates on its axis in a 24-hour day.",
                clarifications: [],
                accessPoints: [
                  "SC.4.E.5.In.3 — Identify that Earth revolves around the Sun in a year and rotates on its axis in a 24-hour day.",
                  "SC.4.E.5.Su.3 — Recognize that Earth rotates on its axis to create day and night.",
                  "SC.4.E.5.Pa.3 — Recognize day and night.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1675",
              },
              {
                code: "SC.4.E.5.4",
                description:
                  "Relate that the rotation of Earth (day and night) and apparent movements of the Sun, Moon, and stars are connected.",
                clarifications: [],
                accessPoints: [
                  "SC.4.E.5.In.4 — Identify the relationship between the rotation of Earth and the apparent movement of the Sun across the sky.",
                  "SC.4.E.5.Su.4 — Recognize that the apparent movement of the Sun across the sky is related to Earth's rotation.",
                  "SC.4.E.5.Pa.4 — Recognize that the Sun appears to move across the sky.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1676",
              },
              {
                code: "SC.4.E.5.5",
                description:
                  "Investigate and report the effects of space research and exploration on the economy and culture of Florida.",
                clarifications: [],
                accessPoints: [
                  "SC.4.E.5.In.5 — Identify effects of space exploration on Florida's economy and culture.",
                  "SC.4.E.5.Su.5 — Recognize that space research is conducted in Florida.",
                  "SC.4.E.5.Pa.5 — Recognize that people travel to space.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1677",
              },
            ],
          },
          {
            code: "SC.4.E.6",
            displayName: "Earth Structures",
            standards: [
              {
                code: "SC.4.E.6.1",
                description:
                  "Identify the three categories of rocks: igneous, (formed from molten rock); sedimentary (pieces of other rocks and fossilized organisms); and metamorphic (formed from heat/pressure).",
                clarifications: [],
                accessPoints: [
                  "SC.4.E.6.In.1 — Identify the three categories of rocks as igneous, sedimentary, and metamorphic.",
                  "SC.4.E.6.Su.1 — Recognize that there are different types of rocks.",
                  "SC.4.E.6.Pa.1 — Recognize rocks as objects found in nature.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1678",
              },
              {
                code: "SC.4.E.6.2",
                description:
                  "Identify the physical properties of common earth-forming minerals, including hardness, color, luster, cleavage, and special properties.",
                clarifications: [],
                accessPoints: [
                  "SC.4.E.6.In.2 — Identify the physical properties of some common minerals, including hardness, color, and luster.",
                  "SC.4.E.6.Su.2 — Recognize some physical properties of common minerals, such as color and hardness.",
                  "SC.4.E.6.Pa.2 — Recognize that rocks and minerals are found in nature.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1679",
              },
              {
                code: "SC.4.E.6.3",
                description:
                  "Recognize that humans need resources found on Earth and that these are either renewable or nonrenewable.",
                clarifications: [],
                accessPoints: [
                  "SC.4.E.6.In.3 — Identify examples of renewable and nonrenewable resources used by humans.",
                  "SC.4.E.6.Su.3 — Recognize that humans use resources from Earth.",
                  "SC.4.E.6.Pa.3 — Recognize that humans use resources from Earth, such as water and wood.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1680",
              },
              {
                code: "SC.4.E.6.4",
                description:
                  "Describe the basic differences between physical weathering (breaking down of rock by wind, water, ice, temperature change, and plants) and erosion (movement of rock by gravity, wind, water, and ice).",
                clarifications: [],
                accessPoints: [
                  "SC.4.E.6.In.4 — Identify examples of physical weathering and erosion.",
                  "SC.4.E.6.Su.4 — Recognize examples of physical weathering and erosion.",
                  "SC.4.E.6.Pa.4 — Recognize an example of weathering or erosion.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1681",
              },
              {
                code: "SC.4.E.6.5",
                description:
                  "Investigate how technology and tools help to extend the ability of humans to observe very small things and very large things.",
                clarifications: [],
                accessPoints: [
                  "SC.4.E.6.In.5 — Identify technologies that allow humans to observe very small and very large things, such as a microscope and a telescope.",
                  "SC.4.E.6.Su.5 — Recognize tools that help humans observe very small or very large things, such as a microscope and a telescope.",
                  "SC.4.E.6.Pa.5 — Recognize that something has been magnified.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1685",
              },
              {
                code: "SC.4.E.6.6",
                description:
                  "Identify resources available in Florida (water, phosphate, oil, limestone, silicon, wind, and solar energy).",
                clarifications: [],
                accessPoints: [
                  "SC.4.E.6.In.6 — Identify natural resources found in Florida, including solar energy, water, and limestone.",
                  "SC.4.E.6.Su.6 — Recognize natural resources found in Florida, such as solar energy and water.",
                  "SC.4.E.6.Pa.6 — Recognize water as a resource in Florida.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl:
                  "https://www.cpalms.org/PreviewStandard/PrintStandard/1686",
              },
            ],
          },
        ],
      },
    ],
  },
};
