# Overnight beta review — October 5–6, 2026

**Final status: local beta repair and verification cycle complete.** All five simulated perspectives are recorded below and synthesized with Grok's report. Final code passed **170 unit tests / 43 files, TypeScript, all 28 Playwright tests (7.4m), and targeted lint**, with actual browser interaction checks. The implementation queue B01–B14 is closed at its stated scope; grade-specific curriculum, independent transfer/retention and real participant research remain open product work. This is not a claim that the entire Grades 3–8 product or its learning efficacy is complete.

## Objective and evidence rules

Ivan authorized autonomous testing, synthesis and implementation loops through simulated parent, seventh-grader, third-grader, instructional-designer and teacher perspectives. These are agent simulations, not observations of real children or proof of educational efficacy. Keep Pixi home, tool-first Rho, existing mastery math, verified Florida codes and privacy gates. Preserve concurrent V05 cinematic changes. No deployment or media spending is part of this review.

Working memory: read `PROJECT_MEMORY.md` before continuing and update it concisely after meaningful discoveries. This file is the implementation and verification queue for the overnight heartbeat (`primer-overnight-beta-improvement`). Disable the heartbeat when the actionable queue and checks are complete.

## Baseline and provenance

- Read Grok's `BETA_FEEDBACK_2026-10-05.md`, project rules, MASTER locks and playtest methodology.
- Actual local browser: `/dev/agent` → overworld → `/learn/cmuvywm57001af8c6r4st6ix1`; seeded synthetic testcaptain. This shared fixture has earlier completed work and test-authored notes; it is not a clean first-time child account.
- Many pre-existing app/diagnostic and cinematic edits are present. Preserve them; no blanket cleanup/reset.
- Local browser initially timed out navigating, then loaded. No production testing claimed.

## Sequential perspective records

### 1. Parent — initial browser pass

**Actions:** entered overworld; clicked Progress; inspected evidence and carried-forward section.

**What happened:** current camp shows Tent, 3 rations, 0/5 crew; math check still offered. Progress shows lifetime/sitting time, standards, a guided 100% observation and ledger entries.

**Went well:** real standard description and source of evidence exist; camp and story question give schoolwork a purpose.

**Did not make sense:** `Must reuse`, `crew_log`, `DECISION`, `map_note:wreck`, raw timestamp and whole internal handoff instructions render directly. `12 mastery` has no scale or explanation. Progress has no obvious return-to-island link. Test-authored learner notes include engineering text; preserve learner-authored text rather than silently rewriting it.

### 2. Seventh grader — initial browser pass

**Actions:** returned to island; opened Camp needs; called Rho.

**What happened:** Chapter 2 board shows only a DONE Grade 3 wreck job and Review. Rho recap describes recalling number forms and a pending chat question rather than a clear next action.

**Went well:** island and named chapter create continuity; map and Rho controls are discoverable.

**Did not make sense:** no startable next job; three entry labels (Focus, Camp needs/Jobs, Math check) split direction. Code confirms grades 5–8 enroll in Grade 4 catalogs and all existing checks use Grade 3 material. This is a prototype coverage gap, not evidence of seventh-grade personalization. Grade 7 account-specific path still to exercise.

### 3. Third grader — actual browser interaction, simulated perspective

**Actions:** opened the Dune reading job, selected the weather-front and erosion answers, pressed Show Rho, read the result, returned through Rho to the beach and opened Focus.

**What happened:** two correct answers produced 2/2 and a usable return path. The feedback heading incorrectly said “Rho checks the lids” for a reading task. Focus initially loaded slowly; later inspection was interrupted by a browser-control stall.

**Went well:** tangible island situations, tap answers, a named companion, and a visible result avoid requiring a third grader to type a whole tutoring conversation.

**Did not make sense:** the reading result reused crate language; standards-heavy Focus competes with the next learning step; small choices and tall panels need a short-screen check. Examples can make correct answers look like independent mastery unless support is explicit. A child who misses early needs an example and another action, not an announcement that an earlier curriculum is absent.

**Implemented response:** task-appropriate feedback headings, larger answer targets, scrolling panels, progressive disclosure of standards, reassuring support copy and an explicit next step. The post-wreck button now says Back to Rho: the old “Leave a note” label promised an action that had already been removed.

### 4. Instructional designer — code audit and completed browser walkthrough

- Saved math placement is real; Grok's always-false wiring hypothesis is superseded.
- All six math items have the correct answer at index 0. The retry example repeats the exact answer to the retry question.
- Other subject checks repeat the same item to advance and keep state only in the component; no persisted evidence or resumption.
- Below-catalog copy says earlier grades are not loaded. This is accurate engineering information but gives a struggling child no useful action.

**Actions:** the first attempt to inspect Focus stalled. After recovery, returned through Progress → island → Focus → Grade 3 Social Studies → starting check. Answered the map-legend item correctly, deliberately missed the first trade question, answered the primary-source item, then answered fresh trade/source questions. Completed all five, observed Saved after each answer, and clicked Talk it through with Rho.

**Observed result:** the missed trade item showed the correct relationship plus a rope/fruit example. The next trade item used oranges/lumber rather than repeating the same question. Completion recommended “understanding why people trade,” matching the deliberate miss. The sample label and supported-practice framing remained visible. Live Rho response verification follows in the iteration log.

**Went well:** examples precede a fresh attempt, fixed questions can be inspected, standards evidence already has supported/conversational/checkpoint tiers, and saved math placement is authoritative.

**Did not make sense:** selecting the first option repeatedly could pass every math item; a duplicate question measured short-term recall rather than transfer; subject results disappeared on reload. These are assessment-validity and continuity defects, not cosmetic issues.

**Implemented response:** varied fixed answer positions, distinct retry examples/questions, five fresh subject items, persisted per-answer subject progress, guided evidence with idempotent keys, and a saved-result handoff to Rho. Unit tests cover interrupted saves and duplicate submissions. No independent mastery or school-grade-placement claim is added.

### 5. Teacher — completed browser Progress/detail review

**Actions:** an initial fresh-tab attempt timed out. After recovery, inspected Progress, followed Grade 3 Mathematics, read the growing-edges/recent/review/unobserved sections, reloaded after revisions and returned to Progress. This is an actual browser walkthrough through a simulated teacher lens, not a real teacher research session.

**New findings and retest:** the detail page still showed bare “mastery” numbers and percentages, truncated descriptions, and technical empty states. Revised and manually verified full descriptions, /100 estimates, explicit “not grades” explanation, and “Not observed” for no evidence. Activity duration exceeded sitting duration in this long-lived synthetic fixture; source confirms separate elapsed-time counters, so the parent copy now explains overlap/breaks and does not imply measured attention.

**Went well:** evidence includes a real code, standard description, tier and date; the chapter ledger can connect student work to a continuing story.

**Did not make sense:** a number called mastery lacks a clear scale; a single supported answer should not be read as proficiency. Opaque internal IDs and handoff instructions bury the useful information. There is no classroom roster, teacher assignment workflow, delayed retention measure or authentic work-product portfolio.

**Implemented response:** plain evidence/ledger labels, human dates, /100 estimates, explicit explanation of supported work, a concrete “show me how” conversation prompt and return navigation. Teacher workflows and independent transfer/retention remain product gaps.

## Synthesized implementation queue

| ID | Priority | Acceptance criterion | Status |
|---|---|---|---|
| B01 | P0 | Camp needs always offers a clear next action: short check when missing; open job when ready; focus/exploration after all jobs. Locked previews explain the path without bypassing gates. | Implemented; focused browser pass |
| B02 | P0 | Asking what to do next produces a tool-backed board/check action, not chat recall. | Implemented; live Rho request opened board and working check CTA |
| B03 | P0 | Child recap rejects technical/test summaries; extraction writes brief in-world facts without invented progress. | Implemented; unit pass |
| B04 | P1 | Parent progress uses friendly labels, human dates, clear guided-evidence explanation and return navigation. | Implemented; manual parent/teacher review |
| B05 | P0 | Math answer positions vary; examples differ from scored questions; feedback supports the learner without overstating mastery. | Implemented; unit pass |
| B06 | P1 | Math modal fits short/mobile screens, announces progress/errors, supports retry and clear pause behavior. | Implemented; phone keyboard/reload browser pass |
| B07 | P0 | Grade/content coverage is honest; no claim of Grade 7 curriculum from Grade 3/4 checks. | Implemented disclosure; curriculum gap remains |
| B08 | P0 | Other-subject checks use fresh items and persist honest evidence/results; grade-specific content stays validated. | Grade 3 sample implemented; browser and service tests pass |
| B09 | P1 | Focus gives a short child-readable skill overview; detailed standards remain accessible but secondary. | Implemented; manual walkthrough |
| B10 | P1 | Board/subject network errors recover; no endless empty loading or accidental multiple actions. | Implemented; board retry, subject-selection retry and save-integrity tests pass |
| B11 | P1 | Debug HUD stays off by default and never appears in production even if a local debug flag is copied. | Implemented; production-mode unit test pass |
| B12 | P2 | Two simulated screenwriter/director/producer-editor critique/revision rounds on revised learning/next-step copy. | Completed below |
| B13 | P0 | Unit tests, TypeScript, full Playwright and actual changed-flow browser interactions pass; any external blocker is explicit. | Passed: 170 units, TypeScript, 28/28 Playwright, targeted lint and actual changed-flow interactions |
| B14 | P1 | Completed jobs reopen for review without submitting again, awarding resources or incrementing evidence. | Implemented; actual cross-subject browser review and return passed; two service regressions pass |

## Product limits to retain visibly

Full grades 5–8 curriculum, independent transfer tests, durable learning products used by camp, richer manipulatives, actual child/parent/teacher research, delayed retention and full consent/release review exceed the current proof slice. Do not label these complete or manufacture standards. Capture concrete follow-on work after core loops are repaired.

## Comprehensive follow-on backlog

These are synthesis findings, not assertions that every item can be certified by a single agent playtest. Items requiring curriculum authoring or research must be promoted into MASTER with validated sources before implementation.

| Priority | Fix or addition | Why / acceptance evidence |
|---|---|---|
| P0 | Grade-specific checks and authored entry jobs for every offered grade | Grade 4 catalogs exist, but current shore tasks and checks are Grade 3 samples. Grades 5–8 currently remap to Grade 4. Add reviewed content using authoritative standards; test actual Grade 3, 4 and 7 profiles; never infer a lower school grade from this sample. |
| Done | Persist unfinished math checks, just as subject checks now persist | Implemented versioned answer sequence, resumable API/UI, retry-safe completion and legacy placement compatibility. Browser reload resumes question 2; service tests cover partial, conflict and interrupted completion. |
| Partial | Verify live “what next?” and completed-check handoffs with a fresh isolated fixture | Actual live model → board → math CTA and saved social-studies focus → Rho response passed on shared testcaptain. Independent grade-specific fixtures remain needed; one successful live response does not establish every response. |
| P0 | Separate supported practice from independent transfer and later retention | Add a new, unscaffolded problem only after instruction, record the evidence tier honestly, revisit after a delay. Do not alter the locked mastery formula to hide the distinction. |
| Partial | All modal keyboard/focus behavior and assistive-technology pass | Core check/board/focus/quiz dialogs now contain keyboard focus; math Escape and opener restoration passed at 390×600. Complete app-wide assistive-technology testing remains. |
| P1 | Save learner-created products that affect the story | A justified plan, annotated map or calculation should be visibly reused by camp/crew later. Preserve the removed mandatory sentence gate; choose an authentic product and show its consequence. |
| P1 | Broader challenge and meaningful choice for confident older learners | Offer explain/compare/design investigations tied to verified standards rather than repeating easy checks or claiming the prototype is Grade 7 curriculum. |
| P1 | Visual and oral scaffolds for younger or struggling learners | Place-value manipulatives, read-aloud checks, one-step instructions and graduated hints need usable non-typing paths; distinguish access support from answer hints in evidence. |
| P1 | Teacher/parent summary of what was learned and what to ask next | Show an evidence-backed skill summary, support used, a sample of work and a recommended next experience. Do not summarize unrelated test notes as child learning. |
| P1 | Reliable slow/offline and reconnect states across the whole session | Board/focus/check recovery is addressed here; extend timeout/retry/resume tests to mission start, chat streaming and activity submission. |
| P1 | Clean fixtures and independent sessions for persona testing | Current shared testcaptain carries old chapters/notes and is reset by browser tests. Add isolated, disposable seeded profiles without weakening local-only/auth gates. |
| P1 | Real parent, Grade 3, Grade 7 and teacher usability sessions | Observe comprehension, navigation without coaching, motivation and perceived challenge. Agent personas are useful defect-finding, not a substitute. |
| P1 | Release/privacy gate before child-facing deployment | Follow existing P0 consent/vendor constraints, keep media features gated and debug disabled; deployment was not performed in this task. |
| P2 | Parent printable evidence summary and teacher workflow design | Design first around concrete review/assignment needs; avoid turning child screens into a gradebook. |
| P2 | Feedback variety and restrained world humor | Warm, specific response to effort/strategy; occasional dry Rho beat, never shame or an invented camp reward. |

## Two creative critique/revision rounds — simulated lenses

### Round 1: make the action and purpose clear

- **Screenwriter:** a completed wreck card has no forward desire. Revision: “Your next step” explains one achievable camp action; locked jobs remain visible as future possibilities. Rho's next-mission tool opens the board instead of asking for a recap.
- **Director:** a child must infer which layer is active when dialogue covers a board or long modal. Revision: close competing dialogue/focus/map layers on the board event; use a prominent primary CTA, larger targets and bounded scrolling.
- **Producer/editor:** internal handoff contracts and repeated math terminology interrupt pacing. Revision: plain parent labels, omit contaminated recaps and use task-specific result text. Remove unearned reward promises.

### Round 2: make success and struggle honest

- **Screenwriter:** “earlier grades not loaded” ends a struggling learner's scene with failure. Revision: “Let's build this together,” show an example, and offer a supported next action. Preserve competence and agency; do not assign a lower grade.
- **Director:** a reload that repeats the same check destroys continuity. Revision: saved subject answers resume the next fresh item, display Saved, and recover after interrupted writes. Long standards lists move behind a disclosure.
- **Producer/editor:** five example-assisted correct choices cannot justify mastery. Revision: name the Grade 3 sample, state what evidence means in Progress, vary answer positions, keep new attempts distinct from examples, and carry the actual support focus into Rho's context. No paid assets or cinematic edits.

**Usable final learning-copy beats:** “Your next step” → “Use the examples” → “That works” / “Let's look…” → “Your next learning step” → “Talk it through with Rho.” Parent interpretation: “A correct answer is useful evidence, not proof of independent mastery.” These are implemented interface/prompt revisions, not a tested screenplay performance.

## Iteration log

Baseline recorded; implementation and retest results will be appended here.

- First implementation gate: 151 unit tests and TypeScript passed; three focused next-action/retry/short-screen Playwright tests passed after restarting the verified local dev server.
- Second revision: 160 unit tests passed, including eight persistence/evidence service regressions. TypeScript caught a missing type-only test import, corrected. Full 27-test browser run in progress; do not report it as passed yet.
- Environment limitation: repeated CUA CDP focus/DOM/navigation timeouts affect old and newly opened IAB tabs. Local development logs also show database authentication timeouts and long cache compactions. Keep these distinct from assertion failures and document the final recovery result.
- Third revision gate: 164 unit tests and TypeScript passed. Six focused browser tests passed in 3.0m: board → check, load failure → retry, 390×600 keyboard focus/escape/restoration, math reload resumption, science five-question resumption and completion, reading support path.
- Actual instructional-designer retest completed five social-studies questions with one deliberate trade miss; later fresh trade question succeeded, recommendation still correctly invited trade practice. Live Rho handoff used the saved trade focus, explained rope-for-food exchange and asked for a short explanation rather than restarting the wreck.
- Actual live request “I don't know what to do next. Please open the next thing I can try.” opened Camp needs, closed the dialogue, and exposed Start math check. Clicked through into the real math check. Two deliberate math misses led to the supportive starting point, a new place-value example and a fresh 3,052 practice problem; correct response displayed the thousands/hundreds/tens/ones explanation. One CUA wait expired just before completion appeared; subsequent actual UI inspection and practice succeeded. No claim of measured fast response time.
- The added subject-review beat is hidden control text, never presented as something the child said. It requests the saved subject focus explicitly even when prior dialogue exists; previously a generic Call Rho could merely reopen old dialogue.
- Fourth regression loop: full suite passed 23/27. One genuine dead end: completed-job Review returned before opening its overlay. Now it opens read-only questions and the saved aggregate result; the API still refuses resubmission, so no extra evidence/time/resource award. Actual browser verified Social Studies → completed wreck Math session → review → Back to Rho. Individual previous choices were not saved by the old job system, so the review does not invent them.
- The same run found an invisible area of the explicitly enabled development debug wrapper intercepting the mobile Island map button. Made the wrapper ignore pointer events while its actual controls remain interactive; the production debug prohibition remains. Two other failures were a stale crates-only camp assertion (a durable tent legitimately survives a diagnostic fixture reset) and a 60-second total intro test budget exhausted at reload. Corrected the stage assertion and allowed 120 seconds for the same multi-step intro assertions. This is not a production speed certification.
- Final implementation gate before full browser rerun: 166 unit tests across 42 files passed; TypeScript passed; targeted lint passed. Mission prompts no longer advertise stub rewards, and an empty/locked board cannot claim all jobs are complete. Full 27-test rerun is pending.
- Next full run passed 26/27, including every previously failing flow. Reading subject selection timed out and showed its recoverable error. Investigation found that Try again reloaded choices instead of retrying the failed selection; corrected it to repeat that selection (including its confirmation state). A pending/failed switch cannot start a stale subject check. Added an explicit failed-selection → retry → starting-check browser regression.
- Focus and math/subject-check APIs previously loaded full conversation/chapter data through `getSession` just to verify ownership. They now use one minimal session-header query after the existing child-profile guard. Four added tests prove unauthenticated, parent and foreign-learner requests remain rejected and owned requests avoid unrelated data loading. This reduces unnecessary work; no production latency claim.
- Both math and other-subject check screens now directly disclose the Grade 3 sample using shared copy. Final code: 170 unit tests across 43 files, TypeScript and targeted lint pass. Actual reading selection reached its starting-check button after the API change. A fresh full 28-test run is in progress with code frozen. Local cold-route compilation still caused long waits during manual review; no production performance or reliability certification.
- **Final frozen-code run: all 28 Playwright tests passed in 7.4 minutes**, including the new failed-selection/retry test, all three intro deal branches, math resumption/support/practice, science completion/reload, reading support, completed-job review, progress interpretation and all map regressions. Unit gate: 170/170 across 43 files. TypeScript and targeted lint passed. Final browser inspection confirmed the math modal's Grade 3 disclosure. No production deploy/build, real-child study, screen-reader audit, isolated Grade 7 account test, independent retention test or new curriculum authoring was performed. The heartbeat is disabled at completion; the follow-on backlog is retained for a new learning slice.
