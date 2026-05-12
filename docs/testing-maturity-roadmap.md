# Primer Testing Maturity Roadmap

This roadmap turns testing from "ad hoc checks" into a repeatable quality system for Primer.

It is intentionally staged so you can get value quickly without slowing product momentum.

## Current Baseline (as of now)

- Vitest installed and configured (`vitest.config.ts`)
- Test command wired (`npm test`)
- First unit tests added for mastery math (`lib/services/standardsMasteryMath.test.ts`)
- Core standards/progress features are now substantial enough to justify deeper test coverage

## North Star

Before new features ship, you can answer:

- Does the learning logic still behave correctly?
- Does standards evidence flow through to progress UX?
- Does the learner-facing experience still feel responsive and not "stuck"?

## Phase 1 (Week 1): Lock Core Learning Math

Goal: Protect the highest-risk pure logic.

Target files:

- `lib/services/standardsMasteryMath.ts`
- `lib/services/standardsProgress.ts` (pure helpers if split)

Tests to add:

- correctness normalization edge cases (`<0`, `>1`)
- monotonic direction checks (strong evidence increases; weak evidence can decrease)
- tier cap enforcement across all tiers (CONVERSATIONAL/GUIDED/CHECKPOINT)
- confidence behavior across repeated updates

Success criteria:

- Critical math paths covered with deterministic unit tests
- Refactors to mastery math become safe

## Phase 2 (Week 2): Service-Level Integration Safety

Goal: Verify evidence writes update progress consistently.

Target behavior:

- creating a standards observation writes `StandardsEvidence`
- corresponding `StandardsProgress` row updates as expected
- skill aggregation reflects linked standards and correct evidence totals

Implementation options:

1. Mock Prisma client for fast isolated tests
2. Use an isolated test database for stronger confidence

Recommendation:

- Start with Prisma mocks this week
- Add 1-2 DB-backed integration tests later for confidence in schema/query drift

Success criteria:

- A broken write/update path is caught by tests before manual QA

## Phase 3 (Week 3): Stream and API Contract Tests

Goal: Prevent silent regressions in session streaming behavior.

Target files:

- `app/api/session/[id]/message/route.ts`
- `lib/ai/sessionOrchestrator.ts`

Tests to add:

- route forwards all expected chunk types (`text`, `assistant_thinking`, `standard_observation`, `activity_generated`, `image_start`, `image_done`, `done`)
- malformed/unknown chunks are handled safely
- abort/early termination path does not crash stream handler

Success criteria:

- The standards/activity UX cannot silently break due to dropped SSE chunk types

## Phase 4 (Week 4): UI and E2E Confidence

Goal: Cover learner-visible critical flows.

Tooling:

- Playwright (recommended) or Cypress

Critical E2E flows:

1. Learner enters session and receives opening stream
2. During streaming, non-blocking status text appears before first token
3. Standards observation appears in-session and later on progress pages
4. Generated activity card appears and is interactable
5. Progress overview and subject page reflect updated evidence

Success criteria:

- "happy path" learner experience remains stable across merges

## Ongoing Policy (after Week 4)

For each new feature PR:

- add/update at least one unit or integration test
- if user-facing flow changes, verify one E2E path
- bugs must ship with a regression test

## Test Pyramid for Primer

- 70% unit tests (fast logic checks)
- 20% integration tests (service/data contracts)
- 10% E2E tests (critical user journeys)

This balances speed and confidence for a small but growing product.

## CI Recommendation

Run in CI on pull requests:

1. `npm run lint`
2. `npx tsc --noEmit`
3. `npm test`
4. E2E suite on main branch and pre-release builds (or nightly at minimum)

## AI-Assisted Testing Workflow

Use AI best for:

- deriving edge cases from invariants
- drafting table-driven tests quickly
- generating mock fixtures and fake data
- turning bug reports into regression tests

Human review focus:

- does each test validate behavior, not implementation details?
- is the test likely to fail for the right reasons?
- does this test materially reduce risk?

## Coverage Targets (Pragmatic, Not Dogmatic)

Suggested initial targets:

- 80%+ on `lib/services/standardsMasteryMath.ts`
- 70%+ on standards/progress service modules
- 100% coverage is not required; risk reduction is the objective

## Quarterly Review Questions

- Which production bugs escaped tests, and why?
- Which tests are flaky or expensive and need redesign?
- Are we over-indexed on unit tests while missing UX regressions?
- Does test setup still match current architecture (streaming, tools, standards)?

## Definition of "Testing Done" for a Feature

A feature is "testing done" when:

- core logic has unit coverage
- key service interaction has at least one integration test
- critical user path is manually QA'd or covered by E2E
- CI passes all quality gates

That is the point where shipping confidence is high enough to move quickly without avoidable regressions.
