# Agent playtest (Cursor / Grok / browser agents)

Use this instead of walking the first-run tutorial or fighting Pixi.

**After a session, write up findings with the five-lens template in [`PLAYTEST_REVIEW.md`](./PLAYTEST_REVIEW.md).**

## Prerequisites

1. `npm run dev` on `http://localhost:3000`
2. DB seeded (`npx prisma db seed`) — creates `testcaptain` / PIN `1234`
3. `.env` with `DATABASE_URL` + `OPENAI_API_KEY` (for Rho dialogue / tools)

Bootstrap is **local-only** (`NODE_ENV=development`, or `PRIMER_AGENT_PLAYTEST=1` on localhost).

## Fast path

1. Open [http://localhost:3000/dev/agent](http://localhost:3000/dev/agent)  
   **or** `POST /api/dev/agent-bootstrap` with body `{"open":"dialogue"}`.
2. Follow returned `learnUrl` (auth cookie is set).
3. First-run is forced to `complete`. Jobs HUD is available.
4. To test `show_mission_board`: in dialogue say **show the mission board**.
5. UI-only board check: bootstrap with `{"open":"board"}` — no LLM needed.
6. UI-only learning clip: bootstrap with `{"open":"clip"}` — fixture panel, no YouTube search and no LLM. Live search stays off unless `PRIMER_LEARNING_CLIPS=1` and `YOUTUBE_API_KEY` are set.
7. New cinematic onboarding: **Play new intro** or `{"open":"intro"}` resets only the seeded captain's intro memory and sets its first-run step to `video`. Watch the briefing, answer Yes/No, and check 10/15/20% branches. Other bootstrap modes still skip first-run.

## Manual login (fallback)

- Captain: `testcaptain` / `1234`
- Parent (household): `test_parent@primer.local` / `test-parent-login`

## Playwright

`npm run test:e2e` runs `e2e/` against `http://localhost:3000`. It reuses a dev server that is already up. The progress handoff spec checks human-readable carried-forward notes, evidence interpretation, subject detail and return navigation. Internal “Must reuse” instructions should not appear in parent-facing copy.

Run one worker: fixtures share the seeded captain and reset its first-run state. Parallel tests can replace each other's intro or subject focus.

Each bootstrap also clears the seeded captain's math placement, saved math-check answer sequence and `math-five:` evidence. Existing camp grants, completed shore jobs, chapters and other history remain; a tent does not disappear when the starting check is reset. Subject-check answers survive ordinary bootstraps; pass `{"resetSubjectChecks":true}` only when explicitly starting a fresh subject-check fixture. These controls affect the seeded test captain, never an arbitrary learner ID. This is a long-lived synthetic fixture, not clean evidence of learning gains or an isolated Grade 7 account.

Wait for `play-shell[data-ready="true"]` after navigation before pressing game controls. Exercise the actual changed flow, including completion, reload or recovery where relevant; a static screenshot is not a functional check. The October beta review and failed-approach evidence are in `OVERNIGHT_BETA_REVIEW_2026-10-05.md`. Read `PROJECT_MEMORY.md` before continuing project work and update it concisely after meaningful discoveries.

## What agents should not do

- Do not rely on walking the Pixi beach or completing the crash video to reach Jobs.
- Do not invent Florida standard codes while testing.
- Do not call bootstrap on production hosts (returns 404).
