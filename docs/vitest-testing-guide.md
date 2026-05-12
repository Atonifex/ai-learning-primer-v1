# Vitest Guide for Primer (and Beyond)

This document explains what Vitest is, why it was added, and how to use it in this codebase and other apps.

## What Vitest Is

Vitest is a fast TypeScript/JavaScript test runner and assertion framework.

At a high level, it gives you:

- A way to write tests (`describe`, `it`, `expect`)
- A CLI to execute tests (`vitest`, `vitest run`)
- Helpful output when something breaks
- Watch mode to rerun tests while coding

Think of it as: "automated checks for code behavior."

## Why It Exists in This Repo

We now have non-trivial scoring logic in `lib/services/standardsMasteryMath.ts`.
That logic is easy to break accidentally during refactors, so tests lock in expected behavior.

Current setup:

- `vitest.config.ts` configures test discovery and runtime
- `package.json` has `"test": "vitest run"`
- `lib/services/standardsMasteryMath.test.ts` validates core mastery/confidence rules

## Current Config (What It Means)

`vitest.config.ts`:

- `environment: "node"`: tests run in Node, not browser/DOM
- `include: ["lib/**/*.test.ts"]`: only files under `lib` matching `*.test.ts` run

This is a good first setup for service logic and utilities.

## What the Existing Test File Is Doing

`lib/services/standardsMasteryMath.test.ts` currently verifies:

- `clamp` bounds values correctly
- `nextStandardsMastery` moves in the expected direction for strong evidence
- tier caps are respected (for example, conversational cap)
- `nextConfidenceAfterObservation` blends old + new signal correctly

This is a "unit test" file: small, deterministic checks with no database/network dependency.

## Do You Need Vitest?

Not required to run the app, but highly recommended if:

- You have scoring logic, recommendation logic, scheduling logic, parser logic, etc.
- You refactor often
- Multiple people/agents edit code

For this app specifically, tests protect learning-quality behavior (mastery updates, confidence updates, progress math).

## Typical Test Layers (Common in Next.js + TS Apps)

Use multiple layers, each with a different job:

1. Unit tests (Vitest)
- Fastest
- Validate pure functions and small modules
- Example: mastery math, prompt formatters, reducers

2. Integration tests (Vitest, with mocks or test DB)
- Validate interaction between modules
- Example: service function writes evidence + updates progress

3. End-to-end UI tests (Playwright or Cypress)
- Validate real user flows in browser
- Example: learner sends message -> SSE shows updates -> progress page reflects change

Rule of thumb:
- Most tests should be unit tests
- Fewer integration tests
- Small set of critical E2E paths

## How You Would Use Vitest in This App

### 1) Unit test pure services (best first target)

Great candidates:

- `lib/services/standardsMasteryMath.ts`
- utility transforms in `lib/services/progress.ts`
- prompt-building helper behavior in `lib/ai/contextBuilder.ts` (if split into pure helpers)

### 2) Integration test evidence/progress behavior

For example:

- call the standards observation service
- assert `StandardsEvidence` row creation
- assert `StandardsProgress` and `SkillProgress` update rules

You can do this with:

- mocked Prisma for speed, or
- an isolated test DB for stronger confidence

### 3) Keep E2E for key learner journeys

Use Playwright/Cypress for:

- session streaming UX
- activity card creation/display
- progress pages reflecting new evidence

Vitest alone does not replace browser E2E.

## Vitest vs Other Tools

### Vitest vs Jest

Similar API and usage style.

Vitest advantages:

- Faster startup in Vite/ESM-heavy setups
- Great TypeScript ergonomics
- Modern default experience

Jest advantages:

- Larger legacy ecosystem
- More historical examples across older repos

If starting fresh in modern TS projects, Vitest is a very common default.

### Vitest vs Mocha + Chai

Mocha/Chai is more "bring-your-own-parts."
Vitest is a more integrated all-in-one experience for modern TS apps.

### Vitest vs Playwright/Cypress

Not competitors; they solve different problems:

- Vitest: code-level behavior
- Playwright/Cypress: browser-level user behavior

Most mature teams use both.

## Commands You Will Actually Use

- Run all tests once:
  - `npm test`
- Run tests directly with Vitest:
  - `npx vitest run`
- Watch mode during development:
  - `npx vitest`
- Run one file:
  - `npx vitest run lib/services/standardsMasteryMath.test.ts`

## Suggested Next Tests for Primer

High value, low effort:

1. Mastery math edge cases
- correctness out of bounds (<0, >1) clamps correctly
- poor correctness can decrease mastery appropriately

2. Standards progress service behavior
- idempotency and evidence count behavior
- next review scheduling behavior

3. Prompt/context behavior
- context builder always includes required policy blocks
- language-specific instructions appear for chosen profile language

4. API stream contract checks
- serialize/forward known chunk types in route handlers
- reject/ignore malformed events safely

## How AI Helps With Testing

AI is very effective at:

- identifying edge cases you forgot
- generating table-driven tests quickly
- proposing mock strategies for dependencies
- converting bug reports into regression tests

Best workflow:

1. Ask AI to list risky behaviors and invariants
2. Ask for test skeletons only
3. Review and keep only meaningful cases
4. Run tests and iterate on failures

Use AI as a test design accelerator, not a blind test generator.

## Common Testing Mistakes to Avoid

- Over-mocking everything (tests pass but reality fails)
- Only testing happy paths
- Writing brittle assertions tied to implementation details
- Ignoring failed tests "temporarily"
- Not running tests in CI

## Practical Adoption Plan (If You Are New)

Week 1:

- Keep current Vitest setup
- Add 3-5 more unit tests around mastery/progress logic

Week 2:

- Add 1-2 integration tests around standards evidence writes

Week 3:

- Add one E2E flow for "session -> evidence -> progress page"

Outcome:

- You keep velocity while systematically reducing regression risk.

## Bottom Line

Vitest is not just a one-off CLI command. It is part of your quality system:

- test files define expected behavior
- Vitest runs those expectations quickly
- CI can enforce them before merges/deploys

For Primer, this is especially valuable because your core product quality depends on learning logic behaving consistently over time.
