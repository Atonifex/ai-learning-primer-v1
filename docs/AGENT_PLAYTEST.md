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

`npm run test:e2e` runs `e2e/` against `http://localhost:3000`. It reuses a dev server that is already up. The progress handoff spec logs in through `POST /api/dev/agent-bootstrap` and checks that “Carried into the next chapter” shows either the empty line or a “Must reuse” fact.

Run one worker: fixtures share the seeded captain and reset its first-run state. Parallel tests can replace each other's intro or subject focus.

## What agents should not do

- Do not rely on walking the Pixi beach or completing the crash video to reach Jobs.
- Do not invent Florida standard codes while testing.
- Do not call bootstrap on production hosts (returns 404).
