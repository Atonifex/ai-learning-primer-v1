# Learning progressions and a focused first subject

2026-10-06. Read PROJECT_MEMORY.md before continuing; update it after meaningful discoveries. Accepted copy and inquiry progression are separated from recommendations about launch scope and unimplemented missions.

## Decisions and current implementation

Later user steering: preserve the skills-card heading and original plain-language body. Four subject summaries now expand via accessible `?` controls: food/money math, Merchant Corp persuasion/recruitment English, phone/radio/plant science, and history/psychology/sociology/leadership social studies. These are realistic motivating purposes, not claims of complete curriculum or live activities. Rival crew language follows existing nonviolent story tone. Captain name comes from the account; purpose goes directly to movement, legacy naming profiles normalize forward, and the Day 0 checklist no longer asks for a name. Settings has authenticated name editing and an island link; login/PIN remain unchanged.

Ivan approved the exact product invitation now shared by the public homepage and post-cinematic onboarding through `lib/productIdentity.ts`. Signed-in parents still enter Household; signed-in captains still enter Learn. The second onboarding card preserves the starting-point check explanation. No copy revision was substituted for his approved paragraph.

Ivan approves Notice/Observe → Question/Wonder → Predict → Investigate → Revise → Apply and requests two or three reusable progressions with concrete learning activities, more modeling and more practice. Three contracts now enter live Grade 3/4 subject prompts through `getPromptTemplate`: inquiry, model/practice, and evidence/communication. Explain accompanies revision so evidence and reasons are explicit. These are tutor instructions, not a persisted stage machine, automatic activity UI or proof that a complete unit exists. Existing diagnostic/practice UI remains unchanged.

## Three reusable progressions

| Progression | Sequence | Learner work |
|---|---|---|
| Observe and investigate | Notice/Observe → Question/Wonder → Predict → Investigate → Explain/Revise → Apply | Examine evidence, classify, measure, compare observations or run an available authored test. Best default for science; also useful for patterns in other subjects. |
| Model and practice | Understand problem → Estimate/Represent → Worked model → Guided practice → Independent practice → Explain/Revise → Apply | Use diagrams, arrays, number lines, tables or equations; see one related example; work supported and then independently; address a misconception and try a fresh case. Default for math. |
| Interpret and communicate | Encounter text/source/problem → Question → Interpret with evidence → Compare perspectives or model a response → Compose/Decide → Feedback/Revise → Apply | Read/listen, locate evidence, compare accounts, study a response, draft for an audience, or justify a decision. Default for ELA/social studies, with subject-specific evidence expectations. |

These are families, not three rigid scripts for every skill. Foundational reading, spelling, fluency and calculation can require direct teaching and repeated practice within them. No need to force prediction onto every English task. Social studies includes geography, history, economics and civics: fictional fairness choices alone do not teach or demonstrate all of these. Sources must actually exist, and values/reasoning should be distinguished from factual claims. Oral alternatives must preserve the target skill; speech alone cannot establish writing conventions.

Across all three: one useful action per turn; explicitly teach missing prerequisites; feedback with an opportunity to revise; a new independent application; later retrieval where available. Guided revision is supported evidence, not independent mastery. No punishment through invented crew hunger/illness/injury, and no fictional world changes without a successful existing tool. A simulation must use authored conditions, not change the laws to validate a guess. Learners do not have to write a camp note after every activity.

Evidence informing the modeling/practice recommendation: [IES elementary math intervention guide](https://ies.ed.gov/ncee/wwc/practiceguide/26), especially systematic instruction, representations and word problems; [IES earlier elementary/middle guide](https://ies.ed.gov/ncee/wwc/PracticeGuide/2/Published), including modeled thinking, guided practice, corrective feedback and cumulative review. These sources do not validate this prototype or require identical pacing for every learner.

## Recommended first niche — proposal, not a curriculum lock

**Grade 3 mathematics through practical island design investigations**, initially one short authored unit covering two or three targets. Begin with known length/load data and whole-number operations; evaluate before broad Grade 4 adaptation. Science provides questions/context; the math target determines the diagram, models, practice and independent check. Do not start by covering four subjects across Grades 3–8 or implementing rope dynamics/buoyancy simulation.

This choice follows the existing math starting-point engine, persistent evidence infrastructure and the user's desire for more practice/modeling. It is not a verified claim that math is universally students' weakest subject. Science-first remains a credible alternative given Ivan's experience authoring phenomenon units: choose it if a strong science unit can be reviewed and tested sooner. The meaningful choice is which subject gets the first complete authored proof, not which subject Primer can ever teach.

Actual local catalog candidates:
- `MA.3.M.1.1`: choose/use measurement tools; length within the catalog's nearest-centimeter/half-or-quarter-inch limits. Measuring a rope/object is a candidate; reading arbitrary map distances alone does not demonstrate tool use.
- `MA.3.M.1.2`: whole-number real-world operations involving measurements, with appropriate units and no measurement conversions. Same-unit known weights/lengths can support a crossing-planning problem.
- `MA.3.AR.1.2`: one-/two-step real-world operations; verify the specific item bounds in the catalog when authoring.

These codes/descriptions are taken from `curriculum_resources/standards_math_grade3.ts`; mission mappings are proposals, not certified assessments. Elapsed time, fractions, scaling, force, load capacity and buoyancy must not be bundled into a single supposedly Grade 3 mastery claim. Real structural support cannot be established merely by adding passenger weights; a simplified model needs a supplied limit and clear assumptions.

## Literal maps and exploration missions — requested ideas, unimplemented

Ivan proposes pictured ropes/chasm crossings, river fording versus bridge/floating routes, travel time, weight/support and evidence about whether a plan will work. Capture these as original authored design problems connected to maps. Current map shows geography/landmarks/routes, but no rope editor, bridge design, load model or crossing simulator exists.

Suggested first challenge: **“How can we move the signal kit across the creek?”**

1. Show a small diagram with two possible routes, known lengths, supplies and a clearly defined transport constraint. The communication purpose depends on the separately reviewed opening premise; this mission does not settle radio mechanics.
2. Let the learner ask a useful question and choose a plan to investigate. Narrow the current sitting to the selected math target.
3. Model the relevant reasoning on a different, simpler example, using the same representation.
4. Give several purposeful cases: supported case, less-supported case, misconception correction/retry when needed, and independent case. Case count adapts to evidence; no arbitrary drill quota or mastery claim after three clicks.
5. Have the learner explain/revise and apply to the map's original plan. A future authored tool should use their plan to update a visible result, persist it, and show what changed.
6. Check transfer with different quantities or a new route; revisit later. The map/result should still be understandable without remembering a long Rho monologue.

Keep physical claims faithful to the supplied fictional model. First version can compare lengths and loads without simulating a dangerous crossing, certified rope strength, fluid dynamics or engineering design. Later extensions need reviewed science and grade mappings.

## Two experience models and where Primer stands

| Model | What a sitting feels like | Main risk |
|---|---|---|
| Explore first, attach learning afterward | Walk around, select a crossing, then receive a curriculum question needed to proceed. | The task becomes a toll; world production crowds out learning and difficult standards get forced into unrelated scenes. |
| Learn first, receive world rewards | Select a skill, watch a model, practice, pass a check, then unlock a bridge or camp upgrade. | Clear practice, but the island may become a decorative reward and effort can be mistaken for understanding. |
| Recommended: solve a world problem through learning | Choose a meaningful problem; learn/model/practice the needed concept; use the reasoning to choose or create a plan whose result follows authored conditions. | Requires careful unit authoring and genuinely causal tools; attractive story copy alone does not deliver it. |

Learning targets and prerequisites are designed first by the author. The learner meets a concrete problem first. Practice is an explicit part of solving it; world consequences reflect the applied work, not unrelated question completion. A learner may choose another valid approach within authored constraints.

Current code is closest to **learn/check → reward/unlock**, inside an exploration shell: placement enables jobs; completing a math starting check can pitch a tent regardless of placement status; saved practice ends at feedback without an applied camp artifact; existing map/camp persistence provides continuity. Subject lens prompts already express inquiry, but there is no complete visible question→investigation→revision→causal-product unit. The new teaching contracts improve guidance without changing those fixed UI mechanics. `MathPractice.tsx` still needs an authored revision/retry and application slice.

## Two design critique/revision rounds

Simulated lenses, not external educators or agents.

Round 1: screenwriter — crossing has a meaningful purpose, but a large physics problem buries the child's immediate goal; director — a simple labeled map beats a lengthy explanation; producer/editor — four subjects and many grades are too broad for the first unit. Revision: one Grade 3 math sitting around moving a needed kit, with a concrete diagram and two or three targets.

Round 2: screenwriter — a quiz that unlocks an unrelated bridge still repeats the reward problem; director — show the learner's revised plan altering the visible result; producer/editor — separate worked practice from independent evidence and state simplified model limits. Revision: use the learner's actual plan in an authored result, preserve a focused practice sequence, then check a new case and revisit later. This revised mission remains a design proposal.

## Next implementation

Author and review the diagram/data, prerequisite rule, modeled example, practice variants, misconception paths, independent case and outcome rules. Then implement through existing orchestrator tools and a full-screen activity; persist the actual plan and result. Track guided versus independent evidence using existing mastery policy. Do not grow the overworld or expand generation to compensate for missing lesson quality.
