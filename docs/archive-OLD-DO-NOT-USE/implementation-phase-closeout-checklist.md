# Implementation Phase Closeout Checklist

This document closes out the requested implementation phase:

- SSE forwarding for non-text chunk types
- non-blocking "not stuck" streaming UX
- progress UX expansion
- initial testing foundation with Vitest
- final validation and next-step planning

## 1) Status: Completed in This Phase

### Streaming and Orchestration

- `app/api/session/[id]/message/route.ts`
  - now forwards `assistant_thinking`, `standard_observation`, and `activity_generated` in SSE output
- `lib/ai/sessionOrchestrator.ts`
  - now emits `assistant_thinking` before tool execution and before continuation generation
- `lib/types/index.ts`
  - stream chunk typing expanded for `assistant_thinking`

### Learner Session UX ("not stuck" improvements)

- `app/learn/[sessionId]/page.tsx`
  - handles `assistant_thinking` chunks
  - shows non-blocking status text while streaming before first text token
  - handles `standard_observation` with brief in-session feedback cards
  - includes quick link to `/progress`

### Progress Experience

- `app/progress/page.tsx`
  - improved top-level progress entry and skill navigation
- `app/progress/[subjectSlug]/page.tsx`
  - adds insight cards for:
    - growing edges
    - recently practiced
    - recommended soon (review window)
    - not observed yet
- `app/progress/skills/page.tsx` (new)
  - full skills list view with mastery, confidence, and evidence counts
- `lib/services/progress.ts`
  - extended subject standards data (including observation/review fields needed for insights)

### Prompt/Tool Guidance

- `lib/ai/contextBuilder.ts`
  - strengthened system prompt instructions around:
    - when to call `record_standard_observation`
    - when to call `generate_learning_activity`

### Testing Foundation

- `lib/services/standardsMasteryMath.ts` (new)
  - extracted pure mastery/confidence math helpers
- `lib/services/standardsMasteryMath.test.ts` (new)
  - initial unit tests for clamp, mastery movement/caps, confidence blending
- `vitest.config.ts` (new)
  - basic Vitest config for `lib/**/*.test.ts`
- `package.json`
  - adds `"test": "vitest run"` and Vitest dependency

## 2) Final Validation Run (Now Completed)

Commands executed:

1. `npm install`
2. `npx tsc --noEmit`
3. `npm test`

Result:

- Typecheck: passed
- Tests: passed (`1` file, `4` tests)

## 3) Manual UX Validation Checklist (What You Should Check)

Use this list as a manual QA pass for current behavior.

### Session Streaming UX

- start a fresh session and verify a visible streaming status appears quickly (before first text token)
- during tool-heavy responses, verify status text changes to tool/continuation style states
- verify no frozen-feeling gap where nothing appears for several seconds

### Standards Observation UX

- trigger a turn where model records standards evidence
- confirm in-session observation feedback appears (standard code + mastery signal)
- confirm feedback disappears after timeout and does not stack infinitely

### Activity Generation UX

- trigger generation of a learning activity
- verify `GeneratedActivityCard` appears reliably and only once per activity id
- verify interaction paths on the card still function (if applicable)

### Progress Data Flow UX

- after session evidence is recorded, visit `/progress`
- verify subject mastery/progress counts changed as expected
- verify `/progress/[subjectSlug]` insight cards populate meaningfully
- verify `/progress/skills` reflects updated evidence/maturity

### Resilience/Edge UX

- interrupt/cancel a stream and verify no broken message artifacts remain
- verify image flow still works with streaming states
- verify leaving session still saves and redirects correctly

## 4) Functional/System Checks (Current Implementation)

These are logic-level checks beyond pure visual UX.

- SSE contract check: all expected chunk types arrive at client handlers
- tool-call path check: orchestrator emits tool phase markers before continuation
- evidence consistency check: standards evidence and aggregated skill evidence counts remain coherent
- review scheduling sanity check: next review fields and "recommended soon" behavior align
- idempotency sanity check: duplicate events do not create duplicate visible cards/rows

## 5) Unresolved Design Questions to Decide Soon

### Observation Feedback Design

- should standard observation feedback be a toast, inline timeline item, or both?
- should mastery be shown as raw number, percentile, or qualitative label?

### Streaming Status Semantics

- what are the canonical phases users should see (`thinking`, `using tools`, `drafting`)?
- should there be a max wait threshold that escalates messaging ("still working...")?

### Progress Semantics

- what is your canonical definition of "mastery" for learner-facing text?
- should "confidence" be shown directly or kept internal?
- should "recommended soon" use 72h fixed window or personalized spacing policy?

### Activity Integration

- should activities be optional side quests or required gates in certain arcs?
- should activity completion feedback immediately alter visible progress chips?

## 6) Suggested Courses of Action (Prioritized)

### Track A: Stabilize and Verify (Immediate)

1. run a structured manual QA pass using this doc
2. capture defects by category (streaming, progress, activity, visual polish)
3. fix any broken contract issues before broadening features

### Track B: Expand Test Coverage (Near-Term)

1. add edge-case unit tests for mastery math
2. add integration tests for evidence -> standards progress -> skill progress pipeline
3. add route/orchestrator contract tests for chunk forwarding

### Track C: Product Clarity and UX Tuning (Parallel)

1. define learner-facing mastery language and visual scale
2. standardize streaming status copy and escalation behavior
3. decide where progress feedback belongs in-session vs dedicated progress pages

### Track D: Broader Roadmap Execution (After Stability)

1. continue remaining multi-subject seed/catalog work as needed
2. harden end-to-end loops (session -> evidence -> progress -> next session planning)
3. layer reporting/insight features once confidence in core loop is high

## 7) Self-Reflection Questions to Guide Development

Use these in planning reviews and spec-writing.

### Product/Experience

- what should the learner feel every 10-20 seconds in-session?
- where does "magic" come from: narrative quality, visible progress, or both?
- what friction points most threaten retention in first three sessions?

### Learning Model

- what does "mastery" mean pedagogically for your current subject set?
- what evidence quality threshold should change long-term progression?
- how do you want narrative turns and explicit practice to balance over time?

### Architecture/Quality

- which failures are unacceptable in production (silent dropped events, stale progress, etc.)?
- what quality gates must pass before each deploy?
- which invariants should always be tested when AI behavior evolves?

### Scope/Execution

- what can you defer without hurting learner outcomes?
- what should be standardized now to avoid expensive migration later?
- what would make this system "spec complete" for your next milestone?

## 8) Definition of Done for This Phase

This phase is considered complete when:

- streaming gap for non-text chunk types is fixed
- non-blocking streaming feedback exists and is observable
- progress surfaces reflect newly recorded evidence
- baseline tests are configured and passing
- manual QA checklist is executed at least once with findings captured

Status now: engineering implementation and baseline validation are complete; manual UX pass and follow-up polish decisions are the next active step.
