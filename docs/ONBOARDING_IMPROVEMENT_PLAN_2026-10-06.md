# Primer onboarding improvement plan

**Status: draft for Ivan to review. Do not implement this plan until he approves a slice.** Changes explicitly requested earlier (shared invitation, subject-purpose explanations, removing repeated naming, captain-name settings and teaching contracts) are separate existing work; this plan does not authorize additional UI, story, curriculum, paid media or deployment changes.

**Subsequent decision, 2026-10-06:** Ivan approved Slice A parent identity/handoff, then requested a parent dashboard with student usage and standards progress. Weekly email is unnecessary and excluded. Slice B teaching and Slice D bottom dialogue belong to separate Codex agents and are outside this task. The draft below records the original review proposal; implemented scope and validation are in PROJECT_MEMORY and MASTER §15/§18.

Read PROJECT_MEMORY.md before continuing and update it concisely after meaningful discoveries. MASTER remains the product source of truth; promote only the approved slice before building.

## Goal and evidence

Give the parent confidence to hand over the device, give the captain a clear purpose and control, and reach a meaningful learning action without a long administrative or entertainment tutorial.

Evidence: all 31 supplied Prodigy onboarding screenshots reviewed in order; Ivan's play report; current Primer home, registration/login, household, intro, purpose/skills, first-run, checks, camp/map, settings and prompt sources. The design-critique skill informed usability, hierarchy, consistency and accessibility review. No real parent/child study was performed. “Effective” below means observed useful interaction patterns and design hypotheses, not proven learning-outcome effects.

Prodigy patterns to adapt: large bounded choices, visible selection, one clear next action, optional setup with an obvious bypass, reminders explaining why a step matters, reversible personalization, self-paced dialogue, stable characters/location and concrete progression. Avoid copying its numerous reward/pet/account systems ahead of learning or making a math answer an unrelated toll for another action. Step 13 also uses numeric entry: the comparison is not “all Prodigy questions are multiple choice.”

## Preserve what already works

| Existing Primer strength | Keep | Improve around it |
|---|---|---|
| Parent-owned household and separate child login/PIN | Role separation, multiple captains, privacy/consent steps and household handoff | Make identity and handoff clear; do not rebuild authentication. |
| Approved guided-learning invitation | Exact agreed copy on public home and student purpose card | Make the next action obvious; do not add a competing mission statement. |
| Intro, Rho, captain agency, captions/audio/pause/Skip | Existing media and meaningful choices | Give the child control over pace; assess whether the intro delays first learning. No new footage required for clarity work. |
| Skills for camp card and four `?` explanations | Existing heading/body and practical subject purposes | Ensure the child can read/operate them, scroll and continue. Optional explanations stay optional. |
| Saved account name and Settings editor | No repeated naming in student onboarding | Close the current parent display-name gap described below. |
| Pixi world, map and recognizable Rho | World/character continuity and ownership | Reveal controls as needed; coordinate the accepted bottom-dialogue direction with its separate reviewed implementation plan. |
| Voice or typing, large choices and optional auto-reading | Accessible input routes and learner control | Teach one relevant control when it is first needed; keep a fallback when voice is unavailable. |
| Worked examples, saved/resumable checks and honest evidence | Placement before assigned/generative work; supported versus independent evidence | Frame the check clearly, improve error/revision paths and use grade-appropriate authored content. |
| Camp needs next action, locked previews and saved camp | Clear progression and persistence | Connect future changes to the learner's actual work; retain already-earned progress. |
| Returning-user recap and state recovery | Resume instead of repeating setup | Trust current chapter/camp/check state over old narrative memory. |

## 1. Parent onboarding

Recommended sequence: **understand Primer → create parent account → set up one captain → confirm readiness → hand over.** Keep this short; these are logical stages, not a requirement for five separate wizard screens.

| Stage | Parent sees/does | Primary action | Completion condition |
|---|---|---|---|
| Public home | Approved invitation and a brief “What happens in the first session?” preview: meet Rho, see useful skills, find a starting point, use learning to help camp | Create a parent account; Sign in remains easy to find | Parent understands the product and account roles. |
| Parent account | Existing email/password and privacy/consent information, with proper labels and recoverable errors | Create account/Continue | Account saved; no lost input on an error. Preserve consent requirements. |
| Captain setup | Captain display name, school/enrolled grade, child login and PIN, grouped by purpose; explain that grade is a starting context rather than proof of readiness | Create captain | One owned child profile saved with a usable name and login. |
| Ready/handoff | “Maya is ready”; a simple first-session outline; how to return with the child's login/PIN; current curriculum coverage in plain language | Open Maya's first session | Child-scoped session opens without asking for the same information again. |
| Returning household | Existing captains and a clear Continue/Open action | Continue as the selected captain | Correct account and saved progress restored; no forced intro replay. |

**Important verified gap:** HouseholdHome currently collects username/PIN/grade but does not send a separate `displayName`, although the API supports it. New profiles can therefore have a null display name and appear as “Captain” after removing the repeated naming step. The approved implementation slice should collect the name once in parent setup, optionally derive a login suggestion, and preserve a safe account-login/default fallback for older nameless profiles. Do not force the child to repair the parent setup. Never overwrite existing chosen names during migration.

Suggested distinction: **“Captain name — what Rho calls you”** and **“Login — what you use to sign in.”** Allow the same word in both; do not make children memorize an extra identity unnecessarily. Parent controls login/PIN; the captain can change their display name later in Settings without changing credentials.

Do not front-load a complete standards catalog, an interest questionnaire, every learning setting or a full parent dashboard. Preserve current coverage notice: G3/G4 catalogs do not imply complete authored experiences, and G5–8 content is not available. Advanced psychology, sociology and radio examples explain potential purposes; they are not proof of standards coverage.

Optional reading/support preferences should have clear defaults and be editable later. Credential reminders belong on the parent setup/return path, not in public marketing, child recaps or analytics. Preserve separate child account scoping and the existing privacy controls.

## 2. Student onboarding

Keep the current **intro → learning purpose → skills for camp → first world action** sequence for the first clarity slice. The public invitation already sets expectations. A second pre-film tutorial would lengthen onboarding; changing the media/order is a separate reviewed experiment.

1. **Intro with control.** Retain meaningful story choices, Rho, captions, audio/pause and Skip. Make it obvious that skipping brings the captain safely into the same learning introduction. Replaying should be optional on subsequent visits. Do not introduce several reward/equipment systems here.
2. **Purpose.** Keep the exact invitation Ivan approved. One main Continue action. The child should understand that curiosity, effort, practice and decisions matter, without a long speech about personal improvement.
3. **Skills for camp.** Keep the heading and original explanatory body. Show Math, English, Science, Social Studies & History with practical `?` explanations and the saved captain name. Existing examples: food/money; persuasion/recruitment; communication/plants; people/groups/history/leadership. No quiz about remembering the introduction and no repeated naming.
4. **One next action.** “Explore the island” brings the captain into the current location with one clear cue. Do not reveal every menu, locked landmark or subsystem at once. The visible instruction should explain why the next action matters, not merely teach controls.
5. **Learn a control by using it.** Point to one nearby meaningful observation/landmark, invite a tap or short walk, then let the captain talk to Rho using a large choice, voice or typing. Keep the successful one-verb-at-a-time guidance. Offer help again on demand rather than requiring a long practice tutorial.

Skills explanations should expand inline, retain keyboard focus and remain readable on a small screen. Use at least 44px touch targets, visible focus, sufficient contrast and sensible text size. When an expanded explanation makes the card longer, the main action remains reachable by scrolling; test this on phone, tablet and Chromebook-sized views. Accessibility claims require actual checks, not a screenshot alone.

**Dialogue continuity:** Ivan has since accepted the bottom-conversation direction, conversation-only opening, latest exchange + History and adaptive small-screen content. See `BOTTOM_DIALOGUE_PLAN_2026-10-06.md` for the separate implementation proposal. Current transcript/portrait remains the runtime baseline until that work ships. Validate one brief onboarding conversation and preserve history, mic/typing, replay, map access and existing orchestrator tools. Do not duplicate that work or replace the dialogue system as part of parent setup.

## 3. Initial actions and first learning

The first session should answer: **What matters here? What can I investigate? What can I do next? How will I know I improved?**

| Beat | Captain action | Rho/UI support | Evidence/result |
|---|---|---|---|
| Orient | Notice one relevant feature, discrepancy or problem | Short scene, image/map or observable evidence, one question | An observation; not a mastery claim. |
| Choose/wonder | Select one of 2–3 meaningful questions, ask their own, or speak | Reuse current tool-driven choice controls; bounded routes and clear return | Current question/subject, with optional interest cue. |
| Find a starting point | Try the selected subject's available check after a short explanation | Preserve examples, saved answers and placement rules | Honest supported starting evidence; no school-grade verdict. |
| Learn | See a model, do supported work, then a fresh independent case | Subject-specific progression, relevant diagram/tool and actionable feedback | Work, help used, misconception/revision and independent evidence distinguished. |
| Apply | Use the idea to choose/create a real plan for camp or exploration | An authored outcome following clear conditions; Rho opens the actual tool | Persistent learner plan/result, not an unrelated reward after quiz completion. |
| Close/resume | See what changed and choose the next useful action | Brief “You learned / you used it / next question” recap | Saved state and a clear return point. |

**Preserve diagnostic access:** do not delete the existing check or disguise it as a mysterious test of the child's identity. Explain: “This helps Rho choose a useful starting point. You don't need to know everything yet.” Avoid replacing one long diagnostic with four mandatory subject checks at entry. Keep the current math-first gate until the approved unit/subject policy replaces it; science-first requires a coordinated routing decision, not merely a new label.

**Latest accepted first deep lesson:** Ivan's subsequent Treeline direction fixes the WHAT — **What plants need to grow** — while allowing flexibility in HOW: observing, predicting, asking, testing and revising. See `TREELINE_GARDEN_LESSON_2026-10-06.md`. Keep the existing math starting check, then one deep science investigation rather than several required thin landmark quizzes. The deterministic garden tool and saved garden foundation exist; modeled/guided/independent teaching and optional-job routing are still unfinished. Slice B should complete this lesson, not start a competing math-first unit. Earlier math/crossing recommendations remain later possibilities. The overall product still spans subjects; one deep sitting does not establish full grade coverage.

Concrete proposed opening after the starting check: **“We need a garden. What do these shoots need to grow?”** Show contrasting plots, name the learning goal, model one comparison, let the student predict and investigate the next cases, give a reason to revise, and ask for a fresh independent application. Use the actual garden tool and persisted beds to show the result. Distinguish a simulation from observing real growth; plants do not instantly mature because the lesson ended. Do not add a mandatory written explanation unless writing is the target skill.

**Story prerequisite:** “Where are we, and how can we let someone know?” and transporting a signal kit are attractive candidates, but off-course geography, communication failure, available equipment and the island's hidden value require review. A signal puzzle must have an authored plausible cause. Do not insert invented observations into the current Fortuna opening or reveal future resources. Rope/chasm and river/bridge/floating activities are later possibilities, not existing tools.

Make the first challenge meaningful without making it physically/mathematically overwhelming. Author its diagram/data, model, varied practice, feedback, revision, independent case and outcome before implementing. Grade adaptation changes the actual demand/support, not just wording. A fresh case and later revisit matter more than maximizing the number of question clicks.

Current tent/job unlocks remain until a reviewed causal application replaces their role. Do not erase saved resources or earned camp progress. Do not punish a misconception by inventing crew injury, hunger or illness. Let mistakes change a test result or prompt a better plan, with a supported way to revise.

## Returning parent and captain

- Captain returns to the latest unfinished question/check/activity and current camp; no repeated naming, intro or completed task submission. An optional intro replay remains available.
- Parent can find the right captain, understand what the first session demonstrated and see the next learning step. Proposed lightweight first-session summary: skill attempted, help used, and one concrete piece of work/result. Avoid showing time or XP as proof of mastery.
- Reuse existing evidence/progress infrastructure with proper role access. A full dashboard, weekly email and PDF remain the separate planned reporting work; do not build a fourth reporting system as an onboarding detour.

## Two design revision rounds

Simulated screenwriter/director/producer-editor lenses, not real family research or external consultations.

**Round 1:** screenwriter — preserve the captain's meaningful role, but too many front-loaded choices obscure the first need; director — keep a stable scene and point to one action; producer/editor — retain working account/intro/check infrastructure rather than rebuilding it. **Revision 1:** short parent handoff, controlled intro, existing learning/skills cards, one first world action and one subject check.

**Round 2:** screenwriter — a simple walkthrough can still end in boring counting and an unrelated camp reward; director — show a plan changing a visible result; producer/editor — separate low-risk clarity work from authored-unit work and prevent missing names/unsupported grade claims. **Revision 2:** preserve the working shell, fix identity/handoff, keep the check explicit, and develop one reviewed investigation with modeled practice, revision and a causal result before broader world or generation work.

Sample future dialogue, conditional on the chosen authored unit: **“We have a place to start, Captain Maya. What should we find out first?”** Offer 2–3 real supported options and “Ask my own.” The selected question opens learning work; it does not trigger a long Rho explanation. This is paper copy, not a new live prompt.

## Proposed implementation slices — approval first

| Slice | Scope | Preserve / defer | Exit criteria |
|---|---|---|---|
| A — Identity and handoff clarity (recommended first) | Parent name/login distinction, explicit handoff, form labels/errors, one next action, coverage explanation, student card usability | Existing auth/consent, multiple captains, intro, skills, check and earned camp; no new story/media | Parent creates/selects captain; child sees correct name, enters without repeated setup; errors recover and return works. |
| B — Complete the Treeline deep learning unit | Coordinate existing garden work: explicit plant goal, model, guided practice, misconception revision, independent application, garden outcome and optional later jobs | Existing math starting check, garden foundation, mastery policy and tool-first architecture; no Grade 3–8 coverage claim | Learner can explain and apply the plant idea; actual tool work produces a persisted, explainable garden result. |
| C — Return and lightweight parent understanding | Clear resume, evidence-backed short recap and next question | Existing progress evidence; full reporting system remains separate | No repeated setup/completed assessment; supported work not presented as independent mastery. |
| D — Coordinate the accepted bottom-dialogue plan | Validate onboarding within the separately planned dock, speaker and learning-content states | History, voice, tools, accessibility and Pixi home | Changed dialogue supports orientation and learning work across desktop and small screens without breaking existing tools. |

No implementation of these slices is authorized by this draft. Ivan should read/revise the plan before selecting a build slice. Any reusable build prompt must name PROJECT_MEMORY.md and require a concise meaningful update.

## Validation and acceptance

After approval, add rule-level unit tests and run npm test / TypeScript; add Playwright flows and run the browser suite; interact with the changed flow in the browser. Do not certify a design from typecheck or static screenshots alone.

Functional cases: new parent/new captain; existing household/multiple captains; old null-name and retired naming-step profiles; failed signup/profile/check save with retry; duplicate login; skip/watch/replay intro; keyboard/voice-unavailable paths; all subject explanations; small viewport scrolling; reload during a check; returning to correct work; no sibling/parent data exposure. Use disposable fixtures and reset only the state required by each case. UI-only tests should stub live tutor responses so unrelated AI actions cannot change the test's scenario; retain separate tool/live integration checks.

Family playtest hypotheses, not success claims: parent can explain the product and handoff; child can state the current goal and next action; help controls are discoverable; setup does not dominate the session; learner can explain a corrected idea and apply it to a new case. Observe actual modeled/guided/independent work and supported errors, not just tutorial completion. Use existing local time/evidence data and direct observation; do not introduce third-party tracking for this plan.

## Decisions for review

Recommended: review the overall sequence and Slice A first; keep current intro order/control; coordinate Slice B with the accepted Treeline science lesson and Slice D with the separate bottom-dialogue plan. Open choices: captain-name/login presentation, exact first observation and scaffolds within Treeline, and how much parent recap to add now. World expansion and alternative first units remain later proposals. This document makes those tradeoffs reviewable without requiring an immediate decision.
