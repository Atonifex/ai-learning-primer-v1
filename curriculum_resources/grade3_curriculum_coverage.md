# Grade 3 castaway curriculum coverage

Hand-authored map of Florida Grade 3 catalogs onto the shared shipwreck saga (**The Mapmaker's Expedition**). Standard codes are copied from the authoring files in `curriculum_resources/standards_*_grade3.ts`. None were invented.

Recompute: `npx tsx curriculum_resources/grade3_verify_coverage.ts`

## Counts

| Subject | Catalog codes | In a chapter plan | In a checkpoint | In the activity bank | seedGap (missing from prisma slice) |
|---------|---------------|-------------------|-----------------|----------------------|-------------------------------------|
| math_g3 | 34 | 34 | 34 | 34 | 28 |
| ela_g3 | 26 | 26 | 26 | 26 | 0 |
| science_g3 | 32 | 32 | 32 | 32 | 22 |
| social_studies_g3 | 35 | 35 | 35 | 35 | 30 |
| **Total** | **127** | **127** | **127** | **127** | **80** |

- Activity templates: **177**
- Checkpoints: **23**
- Units: **6** · Chapters: **19**
- `codesMissingFromCurriculum()`: empty
- `codesMissingFromActivityBank()`: empty
- Codes only bundled (no dedicated activity): **none**

## seedGap list

Codes in the authoring catalogs that are **not** in today's `prisma/seeds/standards_*_grade3.ts` slices (ELA seed file is complete; `prisma/seed.ts` may still import `OLDstandards_ela_grade3`).

**Math (28):** MA.3.NSO.1.4, MA.3.NSO.2.4, MA.3.FR.1.1, MA.3.FR.1.2, MA.3.FR.1.3, MA.3.FR.2.1, MA.3.FR.2.2, MA.3.AR.1.1, MA.3.AR.1.2, MA.3.AR.2.1, MA.3.AR.2.2, MA.3.AR.2.3, MA.3.AR.3.1, MA.3.AR.3.2, MA.3.AR.3.3, MA.3.M.1.1, MA.3.M.1.2, MA.3.M.2.1, MA.3.M.2.2, MA.3.GR.1.1, MA.3.GR.1.2, MA.3.GR.1.3, MA.3.GR.2.1, MA.3.GR.2.2, MA.3.GR.2.3, MA.3.GR.2.4, MA.3.DP.1.1, MA.3.DP.1.2

**Science (22):** SC.3.E.5.1, SC.3.E.5.2, SC.3.E.5.3, SC.3.E.5.4, SC.3.E.5.5, SC.3.E.6.1, SC.3.P.8.1, SC.3.P.8.2, SC.3.P.8.3, SC.3.P.9.1, SC.3.P.10.1, SC.3.P.10.2, SC.3.P.10.3, SC.3.P.10.4, SC.3.P.11.1, SC.3.P.11.2, SC.3.L.14.1, SC.3.L.14.2, SC.3.L.15.1, SC.3.L.15.2, SC.3.L.17.1, SC.3.L.17.2

**Social studies (30):** SS.3.G.1.3, SS.3.G.1.4, SS.3.G.1.5, SS.3.G.1.6, SS.3.G.2.1, SS.3.G.2.2, SS.3.G.2.3, SS.3.G.2.4, SS.3.G.2.5, SS.3.G.2.6, SS.3.G.3.1, SS.3.G.3.2, SS.3.G.4.1, SS.3.G.4.2, SS.3.G.4.3, SS.3.G.4.4, SS.3.E.1.1, SS.3.E.1.2, SS.3.E.1.3, SS.3.E.1.4, SS.3.CG.1.1, SS.3.CG.1.2, SS.3.CG.2.1, SS.3.CG.2.2, SS.3.CG.2.3, SS.3.CG.2.4, SS.3.CG.2.5, SS.3.CG.3.1, SS.3.CG.3.2, SS.3.AA.1.1

**ELA:** none in `prisma/seeds/standards_ela_grade3.ts` (full set).

## Codes not distorted

Florida / U.S. social studies that name real places, constitutions, holidays, currencies, or historical people are taught as **Guild atlas / wreck-library Earth memory**, not as camp-government fan fiction:

- Continents/oceans, North America, U.S. regions and states (`SS.3.G.1.3`, `SS.3.G.2.1`–`2.5`)
- Climate, resources, settlement, cultures, ethnic contributions (`SS.3.G.3.*`, `SS.3.G.4.1`–`4.4`)
- U.S. Constitution, consent of the governed, voting, holidays, U.S. and Florida symbols, three branches, local/state/national (`SS.3.CG.*` except camp-honest civic virtue practice on `SS.3.CG.2.1`)
- African American heroism list (`SS.3.AA.1.1`)
- Currencies of the U.S., Canada, Mexico, and the Caribbean (`SS.3.E.1.4`)

Camp-honest SS (roles, fairness, maps of the island, scarcity/trade, primary sources, civic virtue as cooperation) stay in Tutorial/Building.

Science never reveals an exoplanet. Star/Sun lessons use the Guild Earth astronomy primer plus tower observations.

## Full table

| Standard code | Description (short) | Unit / chapter | Activity slugs | Checkpoint id | seedGap? |
|---------------|---------------------|----------------|----------------|---------------|----------|
| MA.3.NSO.1.1 | Read and write numbers from 0 to 10,000 using standard form, expanded form an... | u1-ch1 (Chapter 1 — The Wreck) | g3-ma-wreck-number-forms, g3-test-cp-math-nso-placevalue | cp-math-nso-placevalue |  |
| MA.3.NSO.1.2 | Compose and decompose four-digit numbers in multiple ways using thousands, hu... | u1-ch1 (Chapter 1 — The Wreck) | g3-ma-compose-crates, g3-test-cp-math-nso-placevalue | cp-math-nso-placevalue |  |
| MA.3.NSO.1.3 | Plot, order and compare whole numbers up to 10,000. | u2-ch5 (Chapter 5 — Storm Watch); u5-ch16 (Chapter 16 — Constitutions, Holidays, and Heroes) | g3-ma-order-tide-counts, g3-test-cp-math-nso-placevalue | cp-math-nso-placevalue |  |
| MA.3.NSO.1.4 | Round whole numbers from 0 to 1,000 to the nearest 10 or 100. | u5-ch13 (Chapter 13 — Number Sense Inspection) | g3-ma-round-inspector, g3-test-cp-math-nso-placevalue | cp-math-nso-placevalue | yes |
| MA.3.NSO.2.1 | Add and subtract multi-digit whole numbers including using a standard algorit... | u2-ch4 (Chapter 4 — Camp Quartermaster); u6-ch18 (Chapter 18 — Hull Blueprints) | g3-ma-camp-add-subtract, g3-test-cp-math-nso-ops | cp-math-nso-ops |  |
| MA.3.NSO.2.2 | Explore multiplication of two whole numbers with products from 0 to 144, and ... | u1-ch2 (Chapter 2 — Divide the Supplies) | g3-ma-ration-equal-groups, g3-test-cp-math-nso-ops | cp-math-nso-ops |  |
| MA.3.NSO.2.3 | Multiply a one-digit whole number by a multiple of 10, up to 90, or a multipl... | u1-ch3 (Chapter 3 — Search Parties) | g3-ma-search-grid-tens, g3-test-cp-math-nso-ops | cp-math-nso-ops |  |
| MA.3.NSO.2.4 | Multiply two whole numbers from 0 to 12 and divide using related facts with p... | u1-ch3 (Chapter 3 — Search Parties) | g3-ma-tent-fact-fluency, g3-test-cp-math-nso-ops | cp-math-nso-ops | yes |
| MA.3.FR.1.1 | Represent and interpret unit fractions in the form 1/n as the quantity formed... | u4-ch11 (Chapter 11 — Fair Shares) | g3-ma-unit-fraction-loaf, g3-test-cp-math-fractions | cp-math-fractions | yes |
| MA.3.FR.1.2 | Represent and interpret fractions, including fractions greater than one, in t... | u4-ch11 (Chapter 11 — Fair Shares) | g3-ma-m-copies-of-unit, g3-test-cp-math-fractions | cp-math-fractions | yes |
| MA.3.FR.1.3 | Read and write fractions, including fractions greater than one, using standar... | u4-ch11 (Chapter 11 — Fair Shares) | g3-ma-fraction-names, g3-test-cp-math-fractions | cp-math-fractions | yes |
| MA.3.FR.2.1 | Plot, order and compare fractional numbers with the same numerator or the sam... | u4-ch11 (Chapter 11 — Fair Shares) | g3-ma-compare-fraction-shares, g3-test-cp-math-fractions | cp-math-fractions | yes |
| MA.3.FR.2.2 | Identify equivalent fractions and explain why they are equivalent. | u4-ch11 (Chapter 11 — Fair Shares) | g3-ma-equivalent-ration-bars, g3-test-cp-math-fractions | cp-math-fractions | yes |
| MA.3.AR.1.1 | Apply the distributive property to multiply a one-digit number and two-digit ... | u4-ch10 (Chapter 10 — Roles, Rules, and Voice) | g3-ma-distributive-planks, g3-test-cp-math-algebra | cp-math-algebra | yes |
| MA.3.AR.1.2 | Solve one- and two-step real-world problems involving any of four operations ... | u2-ch4 (Chapter 4 — Camp Quartermaster); u6-ch17 (Chapter 17 — Market Day) | g3-ma-two-step-budget, g3-ma-market-two-step, g3-test-cp-math-algebra | cp-math-algebra | yes |
| MA.3.AR.2.1 | Restate a division problem as a missing factor problem using the relationship... | u4-ch12 (Chapter 12 — Songs, Stars, and Muster) | g3-ma-missing-factor-watch, g3-test-cp-math-algebra | cp-math-algebra | yes |
| MA.3.AR.2.2 | Determine and explain whether an equation involving multiplication or divisio... | u4-ch12 (Chapter 12 — Songs, Stars, and Muster) | g3-ma-true-false-equations, g3-test-cp-math-algebra | cp-math-algebra | yes |
| MA.3.AR.2.3 | Determine the unknown whole number in a multiplication or division equation, ... | u4-ch12 (Chapter 12 — Songs, Stars, and Muster) | g3-ma-unknown-any-position, g3-test-cp-math-algebra | cp-math-algebra | yes |
| MA.3.AR.3.1 | Determine and explain whether a whole number from 1 to 1,000 is even or odd. | u1-ch2 (Chapter 2 — Divide the Supplies) | g3-ma-even-odd-flasks, g3-test-cp-math-algebra | cp-math-algebra | yes |
| MA.3.AR.3.2 | Determine whether a whole number from 1 to 144 is a multiple of a given one-d... | u5-ch14 (Chapter 14 — Patterns, Multiples, and the North American Plate) | g3-ma-multiples-crates, g3-test-cp-math-algebra | cp-math-algebra | yes |
| MA.3.AR.3.3 | Identify, create and extend numerical patterns. | u3-ch8 (Chapter 8 — Living Neighbors) | g3-ma-sighting-pattern, g3-test-cp-math-algebra | cp-math-algebra | yes |
| MA.3.M.1.1 | Select and use appropriate tools to measure the length of an object, the volu... | u2-ch6 (Chapter 6 — Springs, Spoilage, and the Garden) | g3-ma-choose-measure-tools, g3-test-cp-math-measurement | cp-math-measurement | yes |
| MA.3.M.1.2 | Solve real-world problems involving any of the four operations with whole-num... | u2-ch6 (Chapter 6 — Springs, Spoilage, and the Garden) | g3-ma-measure-word-problems, g3-test-cp-math-measurement | cp-math-measurement | yes |
| MA.3.M.2.1 | Using analog and digital clocks tell and write time to the nearest minute usi... | u2-ch5 (Chapter 5 — Storm Watch) | g3-ma-watch-clock, g3-test-cp-math-measurement | cp-math-measurement | yes |
| MA.3.M.2.2 | Solve one- and two-step real-world problems involving elapsed time. | u2-ch5 (Chapter 5 — Storm Watch) | g3-ma-elapsed-storm-prep, g3-test-cp-math-measurement | cp-math-measurement | yes |
| MA.3.GR.1.1 | Describe and draw points, lines, line segments, rays, intersecting lines, per... | u3-ch7 (Chapter 7 — Grid, Compass, and the Shape of Trails) | g3-ma-trail-lines, g3-test-cp-math-geometry | cp-math-geometry | yes |
| MA.3.GR.1.2 | Identify and draw quadrilaterals based on their defining attributes. | u3-ch7 (Chapter 7 — Grid, Compass, and the Shape of Trails) | g3-ma-camp-quadrilaterals, g3-test-cp-math-geometry | cp-math-geometry | yes |
| MA.3.GR.1.3 | Draw line(s) of symmetry in a two-dimensional figure and identify line-symmet... | u3-ch7 (Chapter 7 — Grid, Compass, and the Shape of Trails) | g3-ma-flag-symmetry, g3-test-cp-math-geometry | cp-math-geometry | yes |
| MA.3.GR.2.1 | Explore area as an attribute of a two-dimensional figure by covering the figu... | u1-ch3 (Chapter 3 — Search Parties) | g3-ma-search-cover-area, g3-test-cp-math-geometry | cp-math-geometry | yes |
| MA.3.GR.2.2 | Find the area of a rectangle with whole-number side lengths using a visual mo... | u3-ch9 (Chapter 9 — The Signal Tower) | g3-ma-tower-area-formula, g3-test-cp-math-geometry | cp-math-geometry | yes |
| MA.3.GR.2.3 | Solve mathematical and real-world problems involving the perimeter and area o... | u3-ch9 (Chapter 9 — The Signal Tower); u6-ch18 (Chapter 18 — Hull Blueprints) | g3-ma-hut-peri-area, g3-test-cp-math-geometry | cp-math-geometry | yes |
| MA.3.GR.2.4 | Solve mathematical and real-world problems involving the perimeter and area o... | u3-ch9 (Chapter 9 — The Signal Tower) | g3-ma-l-dock-composite, g3-test-cp-math-geometry | cp-math-geometry | yes |
| MA.3.DP.1.1 | Collect and represent numerical and categorical data with whole-number values... | u2-ch4 (Chapter 4 — Camp Quartermaster); u6-ch19 (Chapter 19 — The Captain's Report) | g3-ma-inventory-pictograph, g3-test-cp-math-data | cp-math-data | yes |
| MA.3.DP.1.2 | Interpret data with whole-number values represented with tables, scaled picto... | u2-ch5 (Chapter 5 — Storm Watch); u5-ch15 (Chapter 15 — The Guild Atlas: Lands, Climates, and Peoples) | g3-ma-storm-graph-read, g3-test-cp-math-data | cp-math-data | yes |
| ELA.3.R.1.1 | Explain how one or more characters develop throughout the plot in a literary ... | u1-ch3 (Chapter 3 — Search Parties) | g3-ela-idi-character-arc, g3-test-cp-ela-literary | cp-ela-literary |  |
| ELA.3.R.1.2 | Explain a theme and how it develops, using details, in a literary text. | u3-ch8 (Chapter 8 — Living Neighbors) | g3-ela-cove-theme, g3-ela-island-book-excerpt, g3-test-cp-ela-literary | cp-ela-literary |  |
| ELA.3.R.1.3 | Explain different characters' perspectives in a literary text. | u3-ch8 (Chapter 8 — Living Neighbors) | g3-ela-two-perspectives, g3-test-cp-ela-literary | cp-ela-literary |  |
| ELA.3.R.1.4 | Identify types of poems: free verse, rhymed verse, haiku, and limerick. | u4-ch12 (Chapter 12 — Songs, Stars, and Muster) | g3-ela-poem-types, g3-test-cp-ela-literary | cp-ela-literary |  |
| ELA.3.R.2.1 | Explain how text features contribute to meaning and identify the text structu... | u1-ch2 (Chapter 2 — Divide the Supplies) | g3-ela-ration-rules-features, g3-test-cp-ela-informational | cp-ela-informational |  |
| ELA.3.R.2.2 | Identify the central idea and explain how relevant details support that idea ... | u1-ch1 (Chapter 1 — The Wreck) | g3-ela-wreck-log-central-idea, g3-test-cp-ela-informational | cp-ela-informational |  |
| ELA.3.R.2.3 | Explain what evidence the author uses to support an idea or claim in a text. | u2-ch4 (Chapter 4 — Camp Quartermaster) | g3-ela-merchant-evidence, g3-test-cp-ela-informational | cp-ela-informational |  |
| ELA.3.R.2.4 | Identify an author's claim and explain how an author uses evidence to support... | u2-ch6 (Chapter 6 — Springs, Spoilage, and the Garden); u6-ch19 (Chapter 19 — The Captain's Report) | g3-ela-water-claim, g3-ela-captain-report, g3-test-cp-ela-informational | cp-ela-informational |  |
| ELA.3.R.3.1 | Identify and explain metaphors, personification, and hyperbole in text(s). | u4-ch11 (Chapter 11 — Fair Shares) | g3-ela-figurative-share-song, g3-test-cp-ela-language-craft | cp-ela-language-craft |  |
| ELA.3.R.3.2 | Summarize a text to enhance comprehension. | u1-ch3 (Chapter 3 — Search Parties) | g3-ela-summarize-trail, g3-ela-island-book-excerpt, g3-test-cp-ela-informational | cp-ela-informational |  |
| ELA.3.R.3.3 | Compare and contrast how two authors present information on the same topic or... | u5-ch13 (Chapter 13 — Number Sense Inspection) | g3-ela-two-authors-spring, g3-test-cp-ela-informational | cp-ela-informational |  |
| ELA.3.C.1.1 | Write in cursive all upper- and lowercase letters. | u3-ch9 (Chapter 9 — The Signal Tower) | g3-ela-cursive-blueprint, g3-test-cp-ela-writing | cp-ela-writing |  |
| ELA.3.C.1.2 | Write personal or fictional narratives using a logical sequence of events, ap... | u1-ch1 (Chapter 1 — The Wreck) | g3-ela-first-night-narrative, g3-test-cp-ela-writing | cp-ela-writing |  |
| ELA.3.C.1.3 | Write opinions about a topic or text, include reasons supported by details fr... | u1-ch2 (Chapter 2 — Divide the Supplies); u5-ch16 (Chapter 16 — Constitutions, Holidays, and Heroes); u6-ch17 (Chapter 17 — Market Day) | g3-ela-persuade-hungry-crew, g3-ela-civics-opinion, g3-ela-market-opinion, g3-test-cp-ela-writing | cp-ela-writing |  |
| ELA.3.C.1.4 | Write expository texts about a topic, using one or more sources, providing an... | u2-ch4 (Chapter 4 — Camp Quartermaster); u5-ch14 (Chapter 14 — Patterns, Multiples, and the North American Plate); u6-ch18 (Chapter 18 — Hull Blueprints); u6-ch19 (Chapter 19 — The Captain's Report) | g3-ela-trade-proposal, g3-ela-atlas-expository, g3-ela-hull-revise, g3-reflect-u1-ch1, g3-reflect-u1-ch2, g3-reflect-u1-ch3, g3-reflect-u2-ch4, g3-reflect-u2-ch5, g3-reflect-u2-ch6, g3-reflect-u3-ch7, g3-reflect-u3-ch8, g3-reflect-u3-ch9, g3-reflect-u4-ch10, g3-reflect-u4-ch11, g3-reflect-u4-ch12, g3-reflect-u5-ch13, g3-reflect-u5-ch14, g3-reflect-u5-ch15, g3-reflect-u5-ch16, g3-reflect-u6-ch17, g3-reflect-u6-ch18, g3-reflect-u6-ch19, g3-test-cp-ela-writing | cp-ela-writing |  |
| ELA.3.C.1.5 | Improve writing as needed by planning, revising, and editing with guidance an... | u4-ch10 (Chapter 10 — Roles, Rules, and Voice); u6-ch18 (Chapter 18 — Hull Blueprints) | g3-ela-revise-charter, g3-ela-hull-revise, g3-test-cp-ela-writing | cp-ela-writing |  |
| ELA.3.C.2.1 | Present information orally, in a logical sequence, using nonverbal cues, appr... | u2-ch5 (Chapter 5 — Storm Watch); u6-ch19 (Chapter 19 — The Captain's Report) | g3-ela-storm-briefing-speech, g3-ela-captain-report, g3-test-cp-ela-speaking-research | cp-ela-speaking-research |  |
| ELA.3.C.3.1 | Follow the rules of standard English grammar, punctuation, capitalization, an... | u4-ch10 (Chapter 10 — Roles, Rules, and Voice) | g3-ela-conventions-edit, g3-test-cp-ela-writing | cp-ela-writing |  |
| ELA.3.C.4.1 | Conduct research to answer a question, organizing information about the topic... | u2-ch6 (Chapter 6 — Springs, Spoilage, and the Garden); u5-ch15 (Chapter 15 — The Guild Atlas: Lands, Climates, and Peoples) | g3-ela-spring-research, g3-test-cp-ela-speaking-research | cp-ela-speaking-research |  |
| ELA.3.C.5.1 | Use two or more multimedia elements to enhance oral or written tasks. | u3-ch9 (Chapter 9 — The Signal Tower); u6-ch19 (Chapter 19 — The Captain's Report) | g3-ela-tower-multimedia, g3-ela-captain-report, g3-test-cp-ela-speaking-research | cp-ela-speaking-research |  |
| ELA.3.C.5.2 | Use digital writing tools individually or collaboratively to plan, draft, and... | u4-ch10 (Chapter 10 — Roles, Rules, and Voice) | g3-ela-digital-slate, g3-test-cp-ela-writing | cp-ela-writing |  |
| ELA.3.V.1.1 | Use grade-level academic vocabulary appropriately in speaking and writing. | u4-ch12 (Chapter 12 — Songs, Stars, and Muster) | g3-ela-academic-vocab-remarks, g3-test-cp-ela-language-craft | cp-ela-language-craft |  |
| ELA.3.V.1.2 | Identify and apply knowledge of common Greek and Latin roots, base words, and... | u4-ch11 (Chapter 11 — Fair Shares) | g3-ela-roots-affixes, g3-test-cp-ela-language-craft | cp-ela-language-craft |  |
| ELA.3.V.1.3 | Use context clues, figurative language, word relationships, reference materia... | u2-ch5 (Chapter 5 — Storm Watch) | g3-ela-context-clues-bulletin, g3-test-cp-ela-language-craft | cp-ela-language-craft |  |
| ELA.3.F.1.3 | Use knowledge of grade-level phonics and word-analysis skills to decode words. | u3-ch7 (Chapter 7 — Grid, Compass, and the Shape of Trails) | g3-ela-decode-markers, g3-test-cp-ela-language-craft | cp-ela-language-craft |  |
| ELA.3.F.1.4 | Read grade-level texts with accuracy, automaticity, and appropriate prosody o... | u3-ch7 (Chapter 7 — Grid, Compass, and the Shape of Trails) | g3-ela-fluency-survey-log, g3-test-cp-ela-language-craft | cp-ela-language-craft |  |
| SC.3.N.1.1 | Raise questions about the natural world, investigate them individually and in... | u1-ch1 (Chapter 1 — The Wreck); u6-ch19 (Chapter 19 — The Captain's Report) | g3-sci-wreck-questions, g3-test-cp-sci-nature | cp-sci-nature |  |
| SC.3.N.1.2 | Compare the observations made by different groups using the same tools and se... | u2-ch4 (Chapter 4 — Camp Quartermaster) | g3-sci-compare-group-obs, g3-test-cp-sci-nature | cp-sci-nature |  |
| SC.3.N.1.3 | Keep records as appropriate, such as pictorial, written, or simple charts and... | u1-ch1 (Chapter 1 — The Wreck) | g3-sci-salvage-records, g3-test-cp-sci-nature | cp-sci-nature |  |
| SC.3.N.1.4 | Recognize the importance of communication among scientists. | u2-ch5 (Chapter 5 — Storm Watch); u5-ch13 (Chapter 13 — Number Sense Inspection); u6-ch19 (Chapter 19 — The Captain's Report) | g3-sci-share-weather-log, g3-test-cp-sci-nature | cp-sci-nature |  |
| SC.3.N.1.5 | Recognize that scientists question, discuss, and check each other's evidence ... | u4-ch10 (Chapter 10 — Roles, Rules, and Voice); u5-ch16 (Chapter 16 — Constitutions, Holidays, and Heroes) | g3-sci-check-evidence, g3-test-cp-sci-nature | cp-sci-nature |  |
| SC.3.N.1.6 | Infer based on observation. | u1-ch2 (Chapter 2 — Divide the Supplies) | g3-sci-infer-spoilage, g3-test-cp-sci-nature | cp-sci-nature |  |
| SC.3.N.1.7 | Explain that empirical evidence is information, such as observations or measu... | u1-ch3 (Chapter 3 — Search Parties); u6-ch18 (Chapter 18 — Hull Blueprints) | g3-sci-empirical-search, g3-test-cp-sci-nature | cp-sci-nature |  |
| SC.3.N.3.1 | Recognize that words in science can have different or more specific meanings ... | u4-ch10 (Chapter 10 — Roles, Rules, and Voice) | g3-sci-science-words, g3-test-cp-sci-nature | cp-sci-nature |  |
| SC.3.N.3.2 | Recognize that scientists use models to help understand and explain how thing... | u3-ch7 (Chapter 7 — Grid, Compass, and the Shape of Trails); u5-ch14 (Chapter 14 — Patterns, Multiples, and the North American Plate) | g3-sci-ridge-model, g3-test-cp-sci-nature | cp-sci-nature |  |
| SC.3.N.3.3 | Recognize that all models are approximations of natural phenomena; as such, t... | u3-ch7 (Chapter 7 — Grid, Compass, and the Shape of Trails) | g3-sci-model-limits, g3-test-cp-sci-nature | cp-sci-nature |  |
| SC.3.E.5.1 | Explain that stars can be different; some are smaller, some are larger, and s... | u4-ch12 (Chapter 12 — Songs, Stars, and Muster) | g3-sci-stars-differ, g3-test-cp-sci-earth-space | cp-sci-earth-space | yes |
| SC.3.E.5.2 | Identify the Sun as a star that emits energy; some of it in the form of light. | u4-ch12 (Chapter 12 — Songs, Stars, and Muster) | g3-sci-sun-is-a-star, g3-test-cp-sci-earth-space | cp-sci-earth-space | yes |
| SC.3.E.5.3 | Recognize that the Sun appears large and bright because it is the closest sta... | u4-ch12 (Chapter 12 — Songs, Stars, and Muster) | g3-sci-sun-closest, g3-test-cp-sci-earth-space | cp-sci-earth-space | yes |
| SC.3.E.5.4 | Explore the Law of Gravity by demonstrating that gravity is a force that can ... | u3-ch9 (Chapter 9 — The Signal Tower) | g3-sci-overcome-gravity, g3-test-cp-sci-earth-space | cp-sci-earth-space | yes |
| SC.3.E.5.5 | Investigate that the number of stars that can be seen through telescopes is d... | u4-ch12 (Chapter 12 — Songs, Stars, and Muster) | g3-sci-spyglass-stars, g3-test-cp-sci-earth-space | cp-sci-earth-space | yes |
| SC.3.E.6.1 | Demonstrate that radiant energy from the Sun can heat objects and when the Su... | u1-ch2 (Chapter 2 — Divide the Supplies) | g3-sci-sun-heats-stores, g3-test-cp-sci-earth-space | cp-sci-earth-space | yes |
| SC.3.P.8.1 | Measure and compare temperatures of various samples of solids and liquids. | u1-ch2 (Chapter 2 — Divide the Supplies) | g3-sci-temperature-stores, g3-test-cp-sci-physical | cp-sci-physical | yes |
| SC.3.P.8.2 | Measure and compare the mass and volume of solids and liquids. | u2-ch4 (Chapter 4 — Camp Quartermaster); u6-ch17 (Chapter 17 — Market Day) | g3-sci-mass-volume-trade, g3-test-cp-sci-physical | cp-sci-physical | yes |
| SC.3.P.8.3 | Compare materials and objects according to properties such as size, shape, co... | u1-ch1 (Chapter 1 — The Wreck); u6-ch18 (Chapter 18 — Hull Blueprints) | g3-sci-sort-properties, g3-test-cp-sci-physical | cp-sci-physical | yes |
| SC.3.P.9.1 | Describe the changes water undergoes when it changes state through heating an... | u2-ch6 (Chapter 6 — Springs, Spoilage, and the Garden) | g3-sci-water-states, g3-test-cp-sci-physical | cp-sci-physical | yes |
| SC.3.P.10.1 | Identify some basic forms of energy such as light, heat, sound, electrical, a... | u2-ch5 (Chapter 5 — Storm Watch) | g3-sci-energy-forms-storm, g3-test-cp-sci-physical | cp-sci-physical | yes |
| SC.3.P.10.2 | Recognize that energy has the ability to cause motion or create change. | u2-ch5 (Chapter 5 — Storm Watch) | g3-sci-energy-causes-change, g3-test-cp-sci-physical | cp-sci-physical | yes |
| SC.3.P.10.3 | Demonstrate that light travels in a straight line until it strikes an object ... | u3-ch9 (Chapter 9 — The Signal Tower) | g3-sci-light-straight, g3-test-cp-sci-physical | cp-sci-physical | yes |
| SC.3.P.10.4 | Demonstrate that light can be reflected, refracted, and absorbed. | u3-ch9 (Chapter 9 — The Signal Tower) | g3-sci-reflect-refract-absorb, g3-test-cp-sci-physical | cp-sci-physical | yes |
| SC.3.P.11.1 | Investigate, observe, and explain that things that give off light often also ... | u3-ch9 (Chapter 9 — The Signal Tower) | g3-sci-light-and-heat, g3-test-cp-sci-physical | cp-sci-physical | yes |
| SC.3.P.11.2 | Investigate, observe, and explain that heat is produced when one object rubs ... | u4-ch11 (Chapter 11 — Fair Shares) | g3-sci-friction-heat, g3-test-cp-sci-physical | cp-sci-physical | yes |
| SC.3.L.14.1 | Describe structures in plants and their roles in food production, support, wa... | u2-ch6 (Chapter 6 — Springs, Spoilage, and the Garden) | g3-sci-plant-structures, g3-test-cp-sci-life | cp-sci-life | yes |
| SC.3.L.14.2 | Investigate and describe how plants respond to stimuli (heat, light, gravity)... | u3-ch8 (Chapter 8 — Living Neighbors) | g3-sci-plant-stimuli, g3-test-cp-sci-life | cp-sci-life | yes |
| SC.3.L.15.1 | Classify animals into major groups (mammals, birds, reptiles, amphibians, fis... | u1-ch3 (Chapter 3 — Search Parties) | g3-sci-classify-animals, g3-test-cp-sci-life | cp-sci-life | yes |
| SC.3.L.15.2 | Classify flowering and nonflowering plants into major groups such as those th... | u3-ch8 (Chapter 8 — Living Neighbors) | g3-sci-seed-vs-spore, g3-test-cp-sci-life | cp-sci-life | yes |
| SC.3.L.17.1 | Describe how animals and plants respond to changing seasons. | u3-ch8 (Chapter 8 — Living Neighbors); u5-ch15 (Chapter 15 — The Guild Atlas: Lands, Climates, and Peoples) | g3-sci-seasonal-change, g3-test-cp-sci-life | cp-sci-life | yes |
| SC.3.L.17.2 | Recognize that plants use energy from the Sun, air, and water to make their o... | u2-ch6 (Chapter 6 — Springs, Spoilage, and the Garden) | g3-sci-plants-make-food, g3-test-cp-sci-life | cp-sci-life | yes |
| SS.3.A.1.1 | Analyze primary and secondary sources. | u1-ch1 (Chapter 1 — The Wreck); u6-ch18 (Chapter 18 — Hull Blueprints) | g3-ss-primary-secondary-wreck, g3-test-cp-ss-inquiry | cp-ss-inquiry |  |
| SS.3.A.1.2 | Utilize technology resources to gather information from primary and secondary... | u2-ch4 (Chapter 4 — Camp Quartermaster) | g3-ss-tech-gather-source, g3-test-cp-ss-inquiry | cp-ss-inquiry |  |
| SS.3.A.1.3 | Define terms related to the social sciences. | u1-ch1 (Chapter 1 — The Wreck); u6-ch19 (Chapter 19 — The Captain's Report) | g3-ss-social-science-terms, g3-test-cp-ss-inquiry | cp-ss-inquiry |  |
| SS.3.G.1.1 | Use thematic maps, tables, charts, graphs, and photos to analyze geographic i... | u1-ch3 (Chapter 3 — Search Parties) | g3-ss-thematic-search-map, g3-test-cp-ss-maps | cp-ss-maps |  |
| SS.3.G.1.2 | Review basic map elements (coordinate grid, cardinal and intermediate directi... | u1-ch3 (Chapter 3 — Search Parties) | g3-ss-map-elements, g3-test-cp-ss-maps | cp-ss-maps |  |
| SS.3.G.1.3 | Label the continents and oceans on a world map. | u5-ch13 (Chapter 13 — Number Sense Inspection) | g3-ss-continents-oceans, g3-test-cp-ss-maps | cp-ss-maps | yes |
| SS.3.G.1.4 | Name and identify the purpose of maps (physical, political, elevation, popula... | u2-ch5 (Chapter 5 — Storm Watch); u2-ch6 (Chapter 6 — Springs, Spoilage, and the Garden) | g3-ss-map-types, g3-test-cp-ss-maps | cp-ss-maps | yes |
| SS.3.G.1.5 | Compare maps and globes to develop an understanding of the concept of distort... | u3-ch7 (Chapter 7 — Grid, Compass, and the Shape of Trails) | g3-ss-maps-vs-globes, g3-test-cp-ss-maps | cp-ss-maps | yes |
| SS.3.G.1.6 | Use maps to identify different types of scale to measure distances between tw... | u1-ch3 (Chapter 3 — Search Parties); u3-ch9 (Chapter 9 — The Signal Tower) | g3-ss-map-scale-distance, g3-ss-tower-scale-again, g3-test-cp-ss-maps | cp-ss-maps | yes |
| SS.3.G.2.1 | Label the countries and commonwealths in North America (Canada, United States... | u5-ch14 (Chapter 14 — Patterns, Multiples, and the North American Plate) | g3-ss-north-america-caribbean, g3-test-cp-ss-places | cp-ss-places | yes |
| SS.3.G.2.2 | Identify the five regions of the United States. | u5-ch14 (Chapter 14 — Patterns, Multiples, and the North American Plate) | g3-ss-us-five-regions, g3-test-cp-ss-places | cp-ss-places | yes |
| SS.3.G.2.3 | Label the states in each of the five regions of the United States. | u5-ch14 (Chapter 14 — Patterns, Multiples, and the North American Plate) | g3-ss-states-in-regions, g3-test-cp-ss-places | cp-ss-places | yes |
| SS.3.G.2.4 | Describe the physical features of the United States, Canada, Mexico, and the ... | u5-ch15 (Chapter 15 — The Guild Atlas: Lands, Climates, and Peoples) | g3-ss-physical-features-na, g3-test-cp-ss-places | cp-ss-places | yes |
| SS.3.G.2.5 | Identify natural and man-made landmarks in the United States, Canada, Mexico,... | u5-ch15 (Chapter 15 — The Guild Atlas: Lands, Climates, and Peoples) | g3-ss-landmarks-na, g3-test-cp-ss-places | cp-ss-places | yes |
| SS.3.G.2.6 | Investigate how people perceive places and regions differently by conducting ... | u3-ch8 (Chapter 8 — Living Neighbors); u4-ch12 (Chapter 12 — Songs, Stars, and Muster) | g3-ss-perceive-the-cove, g3-test-cp-ss-places | cp-ss-places | yes |
| SS.3.G.3.1 | Describe the climate and vegetation in the United States, Canada, Mexico, and... | u5-ch15 (Chapter 15 — The Guild Atlas: Lands, Climates, and Peoples) | g3-ss-climate-vegetation, g3-test-cp-ss-physical-human | cp-ss-physical-human | yes |
| SS.3.G.3.2 | Describe the natural resources in the United States, Canada, Mexico, and the ... | u5-ch15 (Chapter 15 — The Guild Atlas: Lands, Climates, and Peoples) | g3-ss-natural-resources, g3-test-cp-ss-physical-human | cp-ss-physical-human | yes |
| SS.3.G.4.1 | Explain how the environment influences settlement patterns in the United Stat... | u5-ch15 (Chapter 15 — The Guild Atlas: Lands, Climates, and Peoples) | g3-ss-environment-settlement, g3-test-cp-ss-physical-human | cp-ss-physical-human | yes |
| SS.3.G.4.2 | Identify the cultures that have settled the United States, Canada, Mexico, an... | u5-ch15 (Chapter 15 — The Guild Atlas: Lands, Climates, and Peoples) | g3-ss-cultures-settled, g3-test-cp-ss-physical-human | cp-ss-physical-human | yes |
| SS.3.G.4.3 | Compare the cultural characteristics of diverse populations in one of the fiv... | u5-ch15 (Chapter 15 — The Guild Atlas: Lands, Climates, and Peoples) | g3-ss-compare-cultures, g3-test-cp-ss-physical-human | cp-ss-physical-human | yes |
| SS.3.G.4.4 | Identify contributions from various ethnic groups to the United States. | u5-ch15 (Chapter 15 — The Guild Atlas: Lands, Climates, and Peoples) | g3-ss-ethnic-contributions, g3-test-cp-ss-physical-human | cp-ss-physical-human | yes |
| SS.3.E.1.1 | Give examples of how scarcity results in trade. | u1-ch2 (Chapter 2 — Divide the Supplies); u4-ch11 (Chapter 11 — Fair Shares) | g3-ss-scarcity-trade, g3-test-cp-ss-economics | cp-ss-economics | yes |
| SS.3.E.1.2 | List the characteristics of money. | u6-ch17 (Chapter 17 — Market Day) | g3-ss-money-characteristics, g3-test-cp-ss-economics | cp-ss-economics | yes |
| SS.3.E.1.3 | Recognize that buyers and sellers interact to exchange goods and services thr... | u2-ch4 (Chapter 4 — Camp Quartermaster); u6-ch17 (Chapter 17 — Market Day) | g3-ss-buyer-seller, g3-test-cp-ss-economics | cp-ss-economics | yes |
| SS.3.E.1.4 | Distinguish between currencies used in the United States, Canada, Mexico, and... | u5-ch16 (Chapter 16 — Constitutions, Holidays, and Heroes) | g3-ss-currencies, g3-test-cp-ss-economics | cp-ss-economics | yes |
| SS.3.CG.1.1 | Explain how the U.S. Constitution establishes the purpose and fulfills the ne... | u5-ch16 (Chapter 16 — Constitutions, Holidays, and Heroes) | g3-ss-constitution-purpose, g3-test-cp-ss-civics-us-fl | cp-ss-civics-us-fl | yes |
| SS.3.CG.1.2 | Describe how the U.S. government gains its power from the people. | u5-ch16 (Chapter 16 — Constitutions, Holidays, and Heroes) | g3-ss-consent-of-governed, g3-test-cp-ss-civics-us-fl | cp-ss-civics-us-fl | yes |
| SS.3.CG.2.1 | Describe how citizens demonstrate civility, cooperation, volunteerism, and ot... | u1-ch2 (Chapter 2 — Divide the Supplies); u4-ch10 (Chapter 10 — Roles, Rules, and Voice); u6-ch19 (Chapter 19 — The Captain's Report) | g3-ss-civic-virtue-camp, g3-test-cp-ss-virtue-aa | cp-ss-virtue-aa | yes |
| SS.3.CG.2.2 | Describe the importance of voting in elections. | u5-ch16 (Chapter 16 — Constitutions, Holidays, and Heroes) | g3-ss-voting-elections, g3-test-cp-ss-civics-us-fl | cp-ss-civics-us-fl | yes |
| SS.3.CG.2.3 | Explain the history and meaning behind patriotic holidays and observances. | u5-ch16 (Chapter 16 — Constitutions, Holidays, and Heroes) | g3-ss-patriotic-holidays, g3-test-cp-ss-civics-us-fl | cp-ss-civics-us-fl | yes |
| SS.3.CG.2.4 | Recognize symbols, individuals, documents, and events that represent the Unit... | u5-ch16 (Chapter 16 — Constitutions, Holidays, and Heroes) | g3-ss-us-symbols, g3-test-cp-ss-civics-us-fl | cp-ss-civics-us-fl | yes |
| SS.3.CG.2.5 | Recognize symbols, individuals, documents, and events that represent the Stat... | u5-ch16 (Chapter 16 — Constitutions, Holidays, and Heroes) | g3-ss-florida-symbols, g3-test-cp-ss-civics-us-fl | cp-ss-civics-us-fl | yes |
| SS.3.CG.3.1 | Explain how the U.S. and Florida Constitutions establish the structure, funct... | u5-ch16 (Chapter 16 — Constitutions, Holidays, and Heroes) | g3-ss-constitutions-structure, g3-test-cp-ss-civics-us-fl | cp-ss-civics-us-fl | yes |
| SS.3.CG.3.2 | Recognize that government has local, state, and national levels. | u5-ch16 (Chapter 16 — Constitutions, Holidays, and Heroes) | g3-ss-three-levels, g3-test-cp-ss-civics-us-fl | cp-ss-civics-us-fl | yes |
| SS.3.AA.1.1 | Identify African Americans who demonstrated heroism and patriotism (e. | u5-ch16 (Chapter 16 — Constitutions, Holidays, and Heroes) | g3-ss-aa-heroism, g3-test-cp-ss-virtue-aa | cp-ss-virtue-aa | yes |
