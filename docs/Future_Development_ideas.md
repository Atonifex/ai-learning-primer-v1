# Primer — future story ideas and discoveries

Living backlog (renamed from FUTURE_STORY_IDEAS.md on 2026-10-06). Created 2026-10-05. Product source of truth remains `MASTER_VISION_PLAN.md`. These ideas are outside current development and do not authorize implementation, generation, new curriculum claims, or reveals in the opening.

## Capture convention

Read `PROJECT_MEMORY.md` before project work and update it concisely after meaningful discoveries. When Ivan proposes an idea outside the active slice, add or revise an entry here: date, user-requested idea, status, story/learning purpose, prerequisites, proposed treatment, real-world facts versus fiction, sources where needed, unresolved choices, and what would justify promoting it into MASTER. Do not invent Florida standard codes or mark a guessed grade as verified. Keep accepted creative ideas distinct from proposed mechanisms; merge duplicates and retain significant changed decisions with dated context. Avoid unrelated client data, secrets, or private learner records.

**P0 below outranks every story idea.** Child data-security constraints apply to all future development. Read them before adding an embed, analytics vendor, ad network, or outside media player.

## P0 — Child data security (high priority, all future work)

- **Date / origin:** 2026-10-05, Ivan. He asked that data-security for kids be recorded where deferred work lives, and marked high priority.
- **Status:** Locked in MASTER §4.1. The one-clip tool can play a privacy-enhanced YouTube embed only when `PRIMER_LEARNING_CLIPS=1` and `YOUTUBE_API_KEY` are set. That flag is not parent consent. Do not enable it on a child-facing deploy until the items below are done.
- **Rule for every future slice:** Any new third-party embed, analytics pixel, ad network, or media vendor is a COPPA decision before a child can reach it. A feature flag, a nocookie player, or “it is just a video” is not consent.
- **Source list during development (2026-10-05):** Ivan asked that the channel list not be a small closed door. Search may return channels outside `CLIP_CHANNELS`. Our rubric in `docs/LEARNING_CLIP_EVALUATION.md` decides fit. Known sources are preferred, not required. This does not relax the consent rule above.
- **Learning clips, still required before a real child uses them:**
  - Verifiable parent consent, and a privacy policy that names Google. A lawyer review is already required before stipend money (MASTER §4.1). This vendor is part of that review.
  - Do not send the child’s name, account id, or voice to YouTube. The embed can still let Google see the viewer (IP and player identifiers). Say that plainly. Do not describe the nocookie player as private.
  - Do not cover the YouTube player to hide the title link. Do not strip ads. End screens can still appear in the last seconds; the channel allowlist and closing our player are the controls we have.
  - Watching is not mastery. Do not record a standard only because a clip finished.
  - Do not search with ChatGPT, Gemini, or Exa, and do not let a model invent a video URL. YouTube Data API plus the allowlist is the index.
- **Deferred quality check:** Gemini may later watch one public finalist we already selected and cache yes/no. That is a reviewer, not a search engine, and it is not a reason to turn clips on for children early.
- **Promotion:** Consent UX and the privacy-policy line are the remaining work. Until they exist, keep the flag off for any deploy a child uses.

## F03 — Session subject focus, not a pin sampler

- **Date / origin:** 2026-10-05, Ivan. Hold on treating the five short beach jobs as the learning model.
- **Status:** locked in MASTER §4.16 on 2026-10-05. Not implemented. Ivan added: the subject choice and that subject's standards progress share one view; a mid-session switch is deliberate; depth and curiosity are the aim.
- **Core idea:** A sitting starts with the captain choosing one subject. The island keeps one chapter problem (food will not last, the beach is unsafe) and uses that subject as the lens for a deep dive: one idea, several quick at-bats with feedback, then one product the camp actually uses. Other subjects are other sittings. The world facilitates the dive. It does not deal the next subject.
- **Why the current jobs fail this:** `TUTORIAL_MISSIONS` is five 7–8 minute activities on four subjects, unlocked by walking pins. That lets the map decide the curriculum and ends each idea at the first quiz.
- **Proposed session:** choose lens → restate the chapter problem in that lens → one modeled example → 4–6 at-bats on the same idea with immediate feedback → one transfer item → one spoken or written product saved to the ledger → the camp acts on that product. A math ration plan is the product of a math sitting, not a new pin.
- **What stays:** shared saga, standards as the hidden map, Amplify coherence (phenomenon → investigation → evidence → explanation), Rho does not take the test, diegetic reward after the product.
- **Unresolved:** whether the tutorial wreck walk remains a one-time movement lesson before the first subject choice; whether a parent can preset the day's subject; how many at-bats count as a sitting; how thin-subject nudges from Rho work without overriding the captain.
- **Overnight beta review, 2026-10-05/06:** Ivan requested an inspiring, age-appropriate personalized experience evaluated through parent, Grade 7, Grade 3, instructional-designer and teacher perspectives. Subject choice and saved Grade 3 starter samples now have implementation/test evidence; the full deep-dive/product loop above remains unbuilt. Prioritized follow-ons and observed curriculum limits: `OVERNIGHT_BETA_REVIEW_2026-10-05.md`. Specific transfer/retention tasks and story consequences are proposals, not validated grade mappings. Do not restore the rejected mandatory camp-sentence gate.
- **Prodigy reflection, 2026-10-06 — accepted direction:** Primer is a guided learning experience to help learners become their best selves. Learning, questions and understanding the world drive curiosity. Ivan finds counting crates a weak entry and proposes crash investigation / rebuilding communication with the mainland within the society-building journey. Prove an authored stock experience adapted to grade and subject before expanding generation. MASTER §3/4.16 carries this direction; the exact first unit is unresolved.
- **Proposed inquiry treatment:** notice a puzzling event → choose/ask a question → predict → examine evidence → explain/revise → apply → fresh and later checks. Suggested bubbles, voice and personal questions open bounded investigations connected to expressed interests. Candidate “We can hear a distant signal; why can't they hear our reply?” has no accepted technical cause, equipment or new runtime scene yet. V05 already reveals lightning/fire/power loss, so a crash question should investigate mechanism/evidence rather than pretend the cause is hidden. Full ordered screenshot review and two editorial revisions: `PRODIGY_ONBOARDING_REVIEW_2026-10-06.md`.
- **Promotion trigger:** Ivan accepts the session shape. Then update MASTER §1.2 / §4 and replace the pin sampler as the session driver before building more one-off jobs.

## F05 — Easy questions and continuity during guided scene dialogue

- **Date / origin:** 2026-10-06, Ivan's Prodigy onboarding reflection. He likes short bottom dialogue, self-paced Next and characters/world remaining visible above, conditional on retaining exploration. He also requests question bubbles and personalized inquiry branches.
- **Status:** user-requested design direction; exact layout/interaction is proposed, not implemented. Current dialogue remains transcript-left/portrait-right and Pixi remains home.
- **Purpose:** keep the learner oriented in the same situation while making meaningful questions easy to ask. Next controls reading pace; it is not evidence of academic reasoning.
- **Proposed treatment:** a compact bottom scene band for guided story beats, two or three relevant question bubbles plus own-question/voice, and readable dedicated space for deeper investigations. Save branch context and let the learner return or deliberately change subject. Avoid permanently labeling interests from one selection.
- **Prerequisites / promotion:** author the anchor unit, choose the treatment for guided dialogue versus open tutoring, review small-screen/read-aloud/keyboard behavior, then promote the selected UI slice into MASTER before coding. Use orchestrator tools/SSE for Rho-invoked investigations. No new world generation or paid assets from this entry.

## F06 — Off-course landing on an unexpected island

- **Date / origin:** 2026-10-06, Ivan. Storm deviation on the way to resource-filled Fortuna causes a landing on a different island, secretly even more valuable; inability to request help drives rebuilding and reconnection.
- **Status:** user-proposed canon revision, not adopted into the screenplay/runtime. Maya and destination Fortuna stay; the landing island is unnamed. No change to current footage, paid jobs or V05 production authority from this discussion.
- **Purpose:** immediately investigate the difference between expected and observed location; let later evidence reveal opportunities for society-building rather than announcing hidden wealth.
- **Proposed opening unit:** “Where are we, and how can we let someone know?” Safe dawn, one map/coast discrepancy, a concrete communication investigation, learner questions and consequential choices. Keep missing crew and safe escape continuity.
- **Facts versus fiction:** being off course can explain a wrong search area; it does not automatically prevent radio contact. Damaged hardware, range or power are candidate authored constraints, not an accepted cause. Greater island value and geography are fictional proposals, not verified resources.
- **Prerequisites / promotion:** choose the new geography and communication cause, review grade/subject evidence tasks, then coordinate screenplay, references/captions, world bible, maps and chapters. Distinguish Fortuna destination shots from the landing island. No early lithium/fusion/hidden-facility reveal. Detail: `UNEXPECTED_ISLAND_AND_LEARNER_AGENCY_2026-10-06.md`.

## F09 — Per-standard learnerGoal + deep place lessons with world rewards

- **Date / origin:** 2026-10-06, Ivan. Too much WHAT-autonomy in early shore activities (e.g. Treeline “plants or path?”). Wants clear objectives, ~15+ min depth, one required tutorial dive, autonomy in HOW, and world-building rewards that upgrade camp. Asked for student-facing paraphrases on standards going forward.
- **Status:** Treeline teach beats + garden apply foundation shipping. Catalog-wide `learnerGoal` field is **not** done (GrokBot batch prompt for Ivan). Tutorial map now wreck + treeline + camp only (dune/creek removed).
- **Treeline plan:** `docs/TREELINE_GARDEN_LESSON_2026-10-06.md`. Standard `SC.3.L.17.2`; goal **What plants need to grow**. Teach panel → deterministic garden beds; tool `open_garden_plot`; map beds visual; camp `garden` JSON.
- **Promotion:** evidence write on garden pass; add `learnerGoal` to StandardSeed for all catalogs; Camp resource module (F12); update MASTER when Camp codes are locked.

## F10 — Scratch-paper / handwritten work surface (reusable)

- **Date / origin:** 2026-10-06, Ivan. Wants a reusable component where the learner can write on scratch paper for manual math (and later other subjects).
- **Status:** future UI component; not in current Treeline teach or garden panels.
- **Proposed treatment:** full-screen or overlay “scratch pad” (stylus/finger/mouse strokes and/or typed scratch), save optional snapshot with the activity attempt, never auto-grade handwriting as mastery. Pair with Camp resource module so +/−/×/÷ stay manual.
- **Prerequisites / promotion:** pick capture format (canvas strokes vs photo of paper), COPPA storage rules, accessibility (keyboard alternative), then promote into MASTER before building.

## F11 — Camp trade board (economics practice)

- **Date / origin:** 2026-10-06, Ivan. Trade board deferred from the first Camp math module.
- **Status:** future idea only. Not required for tutorial Camp resource plan.
- **Proposed treatment:** later sitting where leftover scrap/timber/canvas/rations can be traded under scarcity rules; practice +/− change and fair exchange. Do not invent standards; map to Florida economics/math codes when authored.
- **Promotion:** after Camp A/B/C resource module exists and a reviewed SS/math code pair is chosen.

## F12 — Camp resource module (budget + rations + materials + upgrades)

- **Date / origin:** 2026-10-06, Ivan. Comprehensive Camp math: budgeting, rationing, materials lists, and an upgrade ladder; manual ops only; grade-scaled via catalog codes. Retire search-grid “paces × parties” as the Camp driver (not intuitive).
- **Status:** accepted direction; not implemented. Mission title/theme updated to “Camp resource plan”; still points at old bank slug until replaced.
- **Proposed Grade 3 code candidates (verify in `standards_math_grade3.ts` before lock):** `MA.3.NSO.2.1` (+/−), `MA.3.NSO.2.2` / `MA.3.NSO.2.4` (×÷ facts), `MA.3.AR.1.2` (one-/two-step real-world), optionally `MA.3.NSO.2.3` (× tens) only if a real materials pack size needs it — not a grid walk.
- **World reward:** choosing an upgrade spends authored costs; camp stage/resources update from the learner’s correct plan.
- **Promotion:** author cost tables + teach/practice/apply for lesson 1, lock codes, replace `g3-ma-search-grid-tens` as Camp mission slug.

## F07 — Visible learning goals, flexible routes and consequential mastery


- **Date / origin:** 2026-10-06, Ivan. Make all relevant standards explicit; allow approaches/order chosen by the learner; continuous improvement and shaping the surrounding world; Ender's Game mastery as inspiration.
- **Status:** user-proposed design direction. Complete goals/routes and broad world consequences are not implemented. Prior guided-learning product identity remains; “game” in sample copy does not revoke it.
- **Proposed treatment:** full grade/subject catalog accessible with plain-language abilities and expandable official wording/codes; curiosity choices and alternative demonstrations; explained prerequisites and opportunities to show readiness. Goals can be visible without revealing story discoveries. This would revise the hidden-standards presentation principle if adopted.
- **Purpose:** ownership of learning, meaningful challenge, knowing what success requires, and causal consequences tied to evidence-backed learner work. Effort/engagement is not independent mastery; preserve existing evidence tiers/formula and the removed sentence gate.
- **Ender-inspired interpretation:** original responsive challenges, experimentation, questioning assumptions, cooperation and growing responsibility. Exact literary aspects Ivan means remain open; no copied plot or covert psychological inference.
- **Prerequisites / promotion:** actual authored Grade 3/4 paths, dependable assessment and accessible alternatives. Grade 5–8 catalogs remain missing. Decide question-first versus current subject-first entry, prerequisite policy, supported routes and bounded state consequences before implementation. Detail and refined intended-product copy: `UNEXPECTED_ISLAND_AND_LEARNER_AGENCY_2026-10-06.md`.

## F08 — Map-based crossing investigations and a focused subject proof

- **Date / origin:** 2026-10-06, Ivan: rope/chasm diagrams, ford/bridge/floating river routes, travel time, weight/support and how to know a plan works. Wants more modeling/practice and reusable learning progressions; starting subject unresolved.
- **Status:** exploration challenges requested, unimplemented. Exact invitation and inquiry progression accepted; three tutor contracts implemented, but no crossing activity or state engine. Math-first niche is a recommendation, not a scope lock.
- **Proposed treatment:** one Grade 3 math design investigation with a labeled map, known length/load data, modeled reasoning, guided and independent practice, revision and an authored outcome that uses the actual plan. Science context may motivate the question without claiming science mastery.
- **Facts / assumptions:** adding weights alone does not establish structural or floating safety. Use explicit simplified conditions and supplied capacity; verify any later physical model. Exact time/force/buoyancy/grade mapping remains unresolved; existing Grade 3 measurement/operations codes are candidates, not invented standards.
- **Promotion / next:** reviewed unit data/diagram, misconception/support path, independent transfer/retrieval and causal-result tool before building or expanding generation. `LEARNING_PROGRESSIONS_AND_FIRST_SUBJECT_2026-10-06.md` includes the two experience models and current-source comparison.

## F04 — Sergeant Wilhelm becomes a source of conflict

- **Date / origin:**2026-10-05, Ivan. Replace female officer with friendly but stern military man; he will later be someone the captain has conflict with.
- **Status:** future conflict role is user-requested; specific cause, timing, resolution and curriculum mapping remain proposals. Current screenplay V05 uses the corrected name **Sergeant Wilhelm**, a friendly but stern military man with a mustache, representing Merchant Corp. Planet Maya/island Fortuna are confirmed; military appearance does not establish an invented government/war or additional rank structure.
- **Story purpose:** meaningful leadership decisions after trust and company employment are established. Introduce credible authority who can be friendly, occasionally dryly funny and demanding; do not announce him as a villain at first meeting.
- **Possible later treatments, not canon:** deadline/resource targets versus crew needs; disagreement about reporting uncertain finds; negotiating fair terms or protecting a safe plan. Resolve with evidence, explanations and decisions rather than weapons/violence. No guaranteed plot chosen here.
- **Prerequisites / promotion:** choose a reviewed later chapter conflict and learning/evidence task, check fit with shared saga, then promote to MASTER before implementation/generation. No opening spoilers or extra introductory monologue.

## F01 — Lithium and later material discoveries

- **Date / origin:** 2026-10-05, Ivan.
- **Status:** requested future resource/discovery idea; not in current build or prologue reveal.
- **Core idea:** survey oil and gold/silver ores initially; later discover rare or previously unknown materials. Lithium connects island resources to electric batteries, transport, trade, and energy choices.
- **Learning possibilities (proposed):** distinguish an element from an ore/mineral, test a claim using evidence, compare a material's properties with a use, investigate resource value and extraction tradeoffs. Do not assume every island resource is confirmed merely because it appears in the mission catalog.
- **Unresolved:** discovery sequence, specimens/evidence, prerequisite skills, actual curriculum mapping, and what fictional unknown material properties are justified by the investigation.
- **Promotion trigger:** a reviewed later chapter with a clear investigation and independent skill checks; link its accepted plan into MASTER before implementation.

## F02 — Fusion-fuel island: deuterium and tritium

- **Date / origin:** 2026-10-05, Ivan.
- **Status:** user-requested future idea: deuterium and tritium are abundant/available on the island; explanation may be fictional. Proposed mechanisms below are not yet accepted canon. Keep both resources undiscovered until the later arc.
- **Story purpose:** chemistry and fusion knowledge unlocks understanding of a strategically important resource, leading to energy/electricity, advanced trade, and eventual space travel/empire responsibilities.
- **Grade/readiness:** Ivan suggests roughly Grade 6. Treat that as a tentative starting point, not a verified Florida Grade 6 standard. Gate by demonstrated understanding of particles/atoms, elements, simple energy transformations, data, and explanations. Introduce qualitative ideas before detailed nuclear physics; formal curriculum mapping is later work.

### Proposed fictional explanation

The island has plentiful water usable as a deuterium source, lithium-rich mineral deposits, and a concealed **still-operating automated fuel facility** from an earlier civilization. The facility concentrates deuterium and continually breeds/replenishes tritium using lithium. This makes both fuels available locally; it does not require a naturally abundant ancient tritium ore deposit. Site discovery, facility origin, and operation are proposals for Ivan's later review, not established facts in the present saga.

This creates a useful mystery: **“Why is fresh fusion fuel still here after all these years?”** Students use inventory dates, decay evidence, and facility logs to distinguish a replenished supply from a forgotten stockpile. Existing early lithium discovery can become a prerequisite rather than a disconnected resource gimmick.

### Real-world science to preserve

- Deuterium and tritium are hydrogen isotopes: same element, different neutron counts. Deuterium is stable and obtainable from water; tritium is radioactive, relatively short-lived (about a 12-year half-life), and rare naturally. Do not teach that both are common mineral ores or that tritium remains unchanged indefinitely.
- In deuterium–tritium fusion, nuclei join and produce helium, a neutron, and released energy. Nuclear fusion changes nuclei; ordinary chemical reactions rearrange electrons/bonds. Learning chemistry provides foundations, but fusion is nuclear physics.
- Lithium can be used to produce tritium in proposed fusion fuel cycles. An engineered replenishing supply is more scientifically coherent than an unexplained geological stockpile.
- Electricity needs an energy-conversion system, e.g. heat driving a turbine/generator. Fusion does not simply equal electricity. Real-world commercial fusion and fusion-powered interplanetary transport remain development goals; the game's mature generators and ship engines are fictional future technology.

Sources for these distinctions: DOE, [Deuterium–Tritium Fusion Fuel](https://www.energy.gov/science/doe-explainsdeuterium-tritium-fusion-fuel); [Fusion Reactions](https://www.energy.gov/science/doe-explainsfusion-reactions); NRC, [Fusion FAQs](https://www.nrc.gov/materials/fusion/faq). Reverify details and age-appropriate curriculum before lesson authoring.

### Proposed investigation sequence

1. **Unknown supply:** discover sealed fuel records and unexplained energy equipment. Ask what evidence would identify the resource; do not name it before the investigation.
2. **Atoms/isotopes:** build simple visual particle models; explain how two atoms can be the same element with different masses.
3. **Material link:** connect previously investigated lithium to logs describing tritium replenishment; distinguish facts from an initial guess.
4. **Fusion versus chemistry:** use a safe fictional/visual simulation to compare a chemical change with nuclei joining. No hands-on fuel handling or real reactor construction directions.
5. **Power the camp:** trace fuel → released energy → conversion equipment → electricity using diagrams and energy-demand data. Compare plans and explain their limits.
6. **Leadership choice:** present an evidence-based proposal for camp energy, trade, and future ship use; consider the crew's needs and resource responsibilities.
7. **Independent checkpoint:** explain isotope/fusion distinctions and an unfamiliar energy-conversion example without AI hints. Unlock the relevant story responsibility only after agreed criteria are demonstrated; no grade-only automatic unlock.

### Open decisions / promotion trigger

Confirm fictional abundance mechanism, discovery epoch, relationship to Merchant Corporation/Guild, actual standards/readiness mapping, activity tools, assessment rubric, and accessibility. Promote only when a later unit has reviewed evidence, learning goals, and story consequences. Preserve future-only status now; do not add fusion lore to initial cinematic prompts or current live turns.
