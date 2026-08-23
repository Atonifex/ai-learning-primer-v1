import type { SubjectSeed } from "../prisma/seeds/types";

export const standardsScienceGrade3: SubjectSeed = {
  slug: "science_g3",
  domain: "SCIENCE",
  gradeBand: "3",
  framework: "FL_NGSSS",
  displayName: "Grade 3 Science",
  catalog: {
    version: "v1",
    label: "Florida Grade 3 Science — All Standards",
    framework: "FL_NGSSS",
    strands: [
      // ─────────────────────────────────────────
      // N — Nature of Science
      // ─────────────────────────────────────────
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
                  "Raise questions about the natural world, investigate them individually and in teams through free exploration and systematic investigations, and generate appropriate explanations based on those explorations.",
                clarifications: [],
                accessPoints: [
                  "SC.3.N.1.In.1 — Ask questions, explore, observe, and identify outcomes.",
                  "SC.3.N.1.Su.1 — Ask literal questions, explore, observe, and share information.",
                  "SC.3.N.1.Pa.1 — Explore, observe, and recognize common objects in the natural world.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/1626",
              },
              {
                code: "SC.3.N.1.2",
                description:
                  "Compare the observations made by different groups using the same tools and seek reasons to explain the differences across groups.",
                clarifications: [],
                accessPoints: [
                  "SC.3.N.1.In.2 — Work with a group to make observations and identify results.",
                  "SC.3.N.1.Su.2 — Work with a partner to make observations.",
                  "SC.3.N.1.Pa.2 — Assist with investigations with a partner.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/1627",
              },
              {
                code: "SC.3.N.1.3",
                description:
                  "Keep records as appropriate, such as pictorial, written, or simple charts and graphs, of investigations conducted.",
                clarifications: [],
                accessPoints: [
                  "SC.3.N.1.In.3 — Record observations to describe findings using written or visual formats, such as picture stories.",
                  "SC.3.N.1.Su.3 — Record observations to describe findings using dictated words and phrases and pictures.",
                  "SC.3.N.1.Pa.1 — Explore, observe, and recognize common objects in the natural world.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/1628",
              },
              {
                code: "SC.3.N.1.4",
                description: "Recognize the importance of communication among scientists.",
                clarifications: [],
                accessPoints: [
                  "SC.3.N.1.In.4 — Recognize that scientists share their knowledge and results with each other.",
                  "SC.3.N.1.Su.4 — Recognize that people work in different kinds of jobs related to science.",
                  "SC.3.N.1.Pa.3 — Recognize that people share information.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/1629",
              },
              {
                code: "SC.3.N.1.5",
                description:
                  "Recognize that scientists question, discuss, and check each other's evidence and explanations.",
                clarifications: [],
                accessPoints: [
                  "SC.3.N.1.In.4 — Recognize that scientists share their knowledge and results with each other.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/1633",
              },
              {
                code: "SC.3.N.1.6",
                description: "Infer based on observation.",
                clarifications: [],
                accessPoints: [
                  "SC.3.N.1.In.1 — Ask questions, explore, observe, and identify outcomes.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/1634",
              },
              {
                code: "SC.3.N.1.7",
                description:
                  "Explain that empirical evidence is information, such as observations or measurements, that is used to help validate explanations of natural phenomena.",
                clarifications: [],
                accessPoints: [
                  "SC.3.N.1.In.1 — Ask questions, explore, observe, and identify outcomes.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/1635",
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
                  "Recognize that words in science can have different or more specific meanings than their use in everyday language; for example, energy, cell, heat/cold, and evidence.",
                clarifications: [],
                accessPoints: [
                  "SC.3.N.3.In.1 — Recognize meanings of words used in science, such as energy, temperature, and gravity.",
                  "SC.3.N.3.Su.1 — Recognize meanings of words used in science, such as telescope, environment, and solid.",
                  "SC.3.N.3.Pa.1 — Recognize common objects related to science by name, such as ice, animal, and plant.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/1636",
              },
              {
                code: "SC.3.N.3.2",
                description: "Recognize that scientists use models to help understand and explain how things work.",
                clarifications: [],
                accessPoints: [
                  "SC.3.N.3.In.2 — Use models to identify how things work.",
                  "SC.3.N.3.Su.2 — Recognize that models represent real things.",
                  "SC.3.N.3.Pa.2 — Recognize a model of a real object.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/1637",
              },
              {
                code: "SC.3.N.3.3",
                description:
                  "Recognize that all models are approximations of natural phenomena; as such, they do not perfectly account for all observations.",
                clarifications: [],
                accessPoints: [
                  "SC.3.N.3.In.3 — Identify that models are representations of things found in the real world.",
                  "SC.3.N.3.Su.2 — Recognize that models represent real things.",
                  "SC.3.N.3.Pa.2 — Recognize a model of a real object.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/1638",
              },
            ],
          },
        ],
      },
      // ─────────────────────────────────────────
      // E — Earth & Space Science
      // ─────────────────────────────────────────
      {
        code: "E",
        displayName: "Earth & Space Science",
        groups: [
          {
            code: "SC.3.E.5",
            displayName: "Earth in Space and Time",
            standards: [
              {
                code: "SC.3.E.5.1",
                description:
                  "Explain that stars can be different; some are smaller, some are larger, and some appear brighter than others; all except the Sun are so far away that they look like points of light.",
                clarifications: [],
                accessPoints: [
                  "SC.3.E.5.In.1 — Recognize that stars in the sky look different from each other.",
                  "SC.3.E.5.Su.1 — Recognize that all stars except the Sun appear very small.",
                  "SC.3.E.5.Pa.1 — Recognize stars in the sky.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/1639",
              },
              {
                code: "SC.3.E.5.2",
                description: "Identify the Sun as a star that emits energy; some of it in the form of light.",
                clarifications: [],
                accessPoints: [
                  "SC.3.E.5.In.2 — Recognize that the Sun is a star that gives off its own light.",
                  "SC.3.E.5.Su.2 — Recognize that the Sun gives off light.",
                  "SC.3.E.5.Pa.2 — Recognize that the Sun is bright.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/1640",
              },
              {
                code: "SC.3.E.5.3",
                description:
                  "Recognize that the Sun appears large and bright because it is the closest star to Earth.",
                clarifications: [],
                accessPoints: [
                  "SC.3.E.5.In.3 — Recognize that the Sun is the closest star to Earth.",
                  "SC.3.E.5.Su.3 — Recognize that the Sun is a star.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/1641",
              },
              {
                code: "SC.3.E.5.4",
                description:
                  "Explore the Law of Gravity by demonstrating that gravity is a force that can be overcome.",
                clarifications: [],
                accessPoints: [
                  "SC.3.E.5.In.4 — Observe and describe ways to keep an object from falling due to gravity.",
                  "SC.3.E.5.Su.4 — Observe and recognize ways to stop a falling object, such as catching a ball.",
                  "SC.3.E.5.Pa.3 — Recognize that an object can be stopped from falling.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/1642",
              },
              {
                code: "SC.3.E.5.5",
                description:
                  "Investigate that the number of stars that can be seen through telescopes is dramatically greater than those seen by the unaided eye.",
                clarifications: [],
                accessPoints: [
                  "SC.3.E.5.In.5 — Recognize that stars appear larger and closer when seen through a telescope.",
                  "SC.3.E.5.Su.5 — Recognize a telescope as a tool to view stars in space.",
                  "SC.3.E.5.Pa.4 — Match a familiar object enlarged by magnification.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/1643",
              },
            ],
          },
          {
            code: "SC.3.E.6",
            displayName: "Earth Structures",
            standards: [
              {
                code: "SC.3.E.6.1",
                description:
                  "Demonstrate that radiant energy from the Sun can heat objects and when the Sun is not present, heat may be lost.",
                clarifications: [],
                accessPoints: [
                  "SC.3.E.6.In.1 — Identify that energy from the Sun heats objects.",
                  "SC.3.E.6.Su.1 — Recognize that many things will get hot when left in the Sun.",
                  "SC.3.E.6.Pa.1 — Distinguish between hot and cold objects.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/1644",
              },
            ],
          },
        ],
      },
      // ─────────────────────────────────────────
      // P — Physical Science
      // ─────────────────────────────────────────
      {
        code: "P",
        displayName: "Physical Science",
        groups: [
          {
            code: "SC.3.P.8",
            displayName: "Properties of Matter",
            standards: [
              {
                code: "SC.3.P.8.1",
                description: "Measure and compare temperatures of various samples of solids and liquids.",
                clarifications: [],
                accessPoints: [
                  "SC.3.P.8.In.1 — Observe and identify the colder/hotter temperature measured on a thermometer.",
                  "SC.3.P.8.Su.1 — Recognize that a thermometer measures temperature (cold and hot).",
                  "SC.3.P.8.Pa.1 — Recognize the temperature of items, such as food, as cool or warm.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/1645",
              },
              {
                code: "SC.3.P.8.2",
                description: "Measure and compare the mass and volume of solids and liquids.",
                clarifications: [],
                accessPoints: [
                  "SC.3.P.8.In.2 — Measure the weight of solids or liquids.",
                  "SC.3.P.8.Su.2 — Sort solid objects by weight (heavy and light).",
                  "SC.3.P.8.Pa.2 — Recognize the larger of two objects.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/1646",
              },
              {
                code: "SC.3.P.8.3",
                description:
                  "Compare materials and objects according to properties such as size, shape, color, texture, and hardness.",
                clarifications: [],
                accessPoints: [
                  "SC.3.P.8.In.3 — Group objects by two observable properties, such as size and shape or color and texture.",
                  "SC.3.P.8.Su.3 — Sort objects by an observable property, such as size, shape, color, and texture.",
                  "SC.3.P.8.Pa.3 — Match objects by an observable property, such as size, shape, and color.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/1647",
              },
            ],
          },
          {
            code: "SC.3.P.9",
            displayName: "Changes in Matter",
            standards: [
              {
                code: "SC.3.P.9.1",
                description:
                  "Describe the changes water undergoes when it changes state through heating and cooling by using familiar scientific terms such as melting, freezing, boiling, evaporation, and condensation.",
                clarifications: [
                  "Target understanding for K–5 focuses on observable changes (solid ↔ liquid ↔ gas). The molecular/bond-rearrangement layer is addressed in middle school.",
                ],
                accessPoints: [],
                verificationStatus: "Fully verified",
                // PrintStandard/1652 returns a CPALMS error page; Preview URL is the working source
                sourceUrl: "https://www.cpalms.org/PreviewStandard/Preview/1652",
              },
            ],
          },
          {
            code: "SC.3.P.10",
            displayName: "Forms of Energy",
            standards: [
              {
                code: "SC.3.P.10.1",
                description:
                  "Identify some basic forms of energy such as light, heat, sound, electrical, and mechanical.",
                clarifications: [],
                accessPoints: [
                  "SC.3.P.10.In.1 — Recognize forms of energy, such as light, heat, electrical, and energy of motion.",
                  "SC.3.P.10.Su.1 — Recognize objects that use electricity (television) and the energy of motion (bowling ball).",
                  "SC.3.P.10.Pa.1 — Recognize the change in the motion of an object.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/1653",
              },
              {
                code: "SC.3.P.10.2",
                description: "Recognize that energy has the ability to cause motion or create change.",
                clarifications: [],
                accessPoints: [
                  "SC.3.P.10.In.2 — Recognize examples of the use of energy, such as electrical (radio, freezer) and energy of motion.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/1648",
              },
              {
                code: "SC.3.P.10.3",
                description:
                  "Demonstrate that light travels in a straight line until it strikes an object or travels from one medium to another.",
                clarifications: [],
                accessPoints: [
                  "SC.3.P.10.In.3 — Identify that light may come from different sources, such as the Sun or electric lamp.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/1654",
              },
              {
                code: "SC.3.P.10.4",
                description: "Demonstrate that light can be reflected, refracted, and absorbed.",
                clarifications: [],
                accessPoints: [
                  "SC.3.P.10.In.3 — Identify that light may come from different sources, such as the Sun or electric lamp.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/1649",
              },
            ],
          },
          {
            code: "SC.3.P.11",
            displayName: "Energy Transfer and Transformations",
            standards: [
              {
                code: "SC.3.P.11.1",
                description:
                  "Investigate, observe, and explain that things that give off light often also give off heat.",
                clarifications: [],
                accessPoints: [
                  "SC.3.P.11.In.1 — Identify that objects that give off light often give off heat.",
                  "SC.3.P.11.Su.1 — Recognize objects that give off both heat and light, such as a light bulb.",
                  "SC.3.P.11.Pa.1 — Recognize sources of light.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/1655",
              },
              {
                code: "SC.3.P.11.2",
                description:
                  "Investigate, observe, and explain that heat is produced when one object rubs against another, such as rubbing one's hands together.",
                clarifications: [],
                accessPoints: [
                  "SC.3.P.11.In.2 — Observe and identify that heat is produced when objects are rubbed together.",
                  "SC.3.P.11.Su.2 — Observe and recognize that rubbing objects together causes heat.",
                  "SC.3.P.11.Pa.2 — Recognize sources of heat.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/1656",
              },
            ],
          },
        ],
      },
      // ─────────────────────────────────────────
      // L — Life Science
      // ─────────────────────────────────────────
      {
        code: "L",
        displayName: "Life Science",
        groups: [
          {
            code: "SC.3.L.14",
            displayName: "Organization and Development of Living Organisms",
            standards: [
              {
                code: "SC.3.L.14.1",
                description:
                  "Describe structures in plants and their roles in food production, support, water and nutrient transport, and reproduction.",
                clarifications: [],
                accessPoints: [
                  "SC.3.L.14.In.1 — Identify the major parts of a plant, including seed, root, stem, leaf, and flower, and their functions.",
                  "SC.3.L.14.Su.1 — Identify the major parts of a plant, such as the root, stem, leaf, and flower.",
                  "SC.3.L.14.Pa.1 — Recognize the leaf and flower of a plant.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/1657",
              },
              {
                code: "SC.3.L.14.2",
                description:
                  "Investigate and describe how plants respond to stimuli (heat, light, gravity), such as the way plant stems grow toward light and their roots grow downward in response to gravity.",
                clarifications: [],
                accessPoints: [
                  "SC.3.L.14.In.2 — Identify behaviors of plants that show they are growing.",
                  "SC.3.L.14.Su.2 — Recognize that plants grow toward light and roots grow down in the soil.",
                  "SC.3.L.14.Pa.2 — Recognize that plants grow.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/1658",
              },
            ],
          },
          {
            code: "SC.3.L.15",
            displayName: "Diversity and Evolution of Living Organisms",
            standards: [
              {
                code: "SC.3.L.15.1",
                description:
                  "Classify animals into major groups (mammals, birds, reptiles, amphibians, fish, arthropods, vertebrates and invertebrates, those having live births and those which lay eggs) according to their physical characteristics and behaviors.",
                clarifications: [],
                accessPoints: [
                  "SC.3.L.15.In.1 — Classify animals by a similar physical characteristic, such as fur, feathers, and number of legs.",
                  "SC.3.L.15.Su.1 — Sort common animals by observable characteristics.",
                  "SC.3.L.15.Pa.1 — Match animals that are the same.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/1659",
              },
              {
                code: "SC.3.L.15.2",
                description:
                  "Classify flowering and nonflowering plants into major groups such as those that produce seeds, or those like ferns and mosses that produce spores, according to their physical characteristics.",
                clarifications: [],
                accessPoints: [
                  "SC.3.L.15.In.2 — Classify parts of plants into groups based on physical characteristics.",
                  "SC.3.L.15.Su.2 — Sort common plants by observable characteristics.",
                  "SC.3.L.15.Pa.2 — Match plants that are the same.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/1660",
              },
            ],
          },
          {
            code: "SC.3.L.17",
            displayName: "Interdependence",
            standards: [
              {
                code: "SC.3.L.17.1",
                description: "Describe how animals and plants respond to changing seasons.",
                clarifications: [],
                accessPoints: [
                  "SC.3.L.17.In.1 — Identify changes in the appearance of animals and plants throughout the year.",
                  "SC.3.L.17.Su.1 — Recognize that the appearance of some plants in the environment changes throughout the year.",
                  "SC.3.L.17.Pa.1 — Recognize clothing worn by humans in different weather (seasons).",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/1650",
              },
              {
                code: "SC.3.L.17.2",
                description:
                  "Recognize that plants use energy from the Sun, air, and water to make their own food.",
                clarifications: [],
                accessPoints: [
                  "SC.3.L.17.In.2 — Recognize that most plants make their own food.",
                  "SC.3.L.17.Su.2 — Recognize that plants need light to grow.",
                  "SC.3.L.17.Pa.2 — Recognize that plants need water.",
                ],
                verificationStatus: "Fully verified",
                sourceUrl: "https://www.cpalms.org/PreviewStandard/PrintStandard/1651",
              },
            ],
          },
        ],
      },
    ],
  },
};
