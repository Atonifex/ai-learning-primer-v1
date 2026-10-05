# Playtest review methodology

Repeat this after meaningful slices (or before parent demos). Combines **agent bootstrap**, **live Luna turns**, and **five-lens review** with ranked next steps.

## Prerequisites

1. `npm run dev` on `http://localhost:3000`
2. DB seeded (`npx prisma db seed`) — `testcaptain` / PIN `1234`
3. `.env` with `DATABASE_URL` + `OPENAI_API_KEY`
4. Optional dev visibility:
   - `PRIMER_AI_DEBUG=1` — server logs tool calls **and** results
   - `NEXT_PUBLIC_PRIMER_AI_DEBUG=1` — in-game AI debug strip (dev only)

## Run (agent or human)

| Step | Action | Pass criteria |
|------|--------|----------------|
| 1 | `POST /api/dev/agent-bootstrap` with `{"open":"dialogue"}` or open `/dev/agent` | Cookie set, `firstRunStep=complete`, `/learn/...?dialogue=1` loads |
| 2 | **Functional smoke** | Say *show the mission board* → Jobs overlay opens (`show_mission_board`) |
| 3 | **Slice under test** | Walk the scenario (e.g. wreck quiz → crew log in chat → camp-math). Note tool toasts, overlays, stuck loops |
| 4 | **Evidence** | `/api/missions` gates (`wreckQuizDone`, `chapter1ReflectionDone`, job statuses); `/progress` handoff if crew log saved |
| 5 | **Automated gate** | `npm test`, `npx tsc --noEmit`, relevant `e2e/` spec |

Record: session id, captain name, what was typed, what UI appeared, whether debug strip showed tool ok/fail.

## Five-lens review (fill every time)

### 1. Functionality (engineering)

What works end-to-end? Tools, SSE side effects, DB gates, overlays, session subject switch?

### 2. Teacher / learning experience developer / curriculum designer — working

Standards alignment, in-world framing, scaffolding, progression gates, evidence path?

### 3. Teacher / curriculum designer — not working

Confusing gates, leaked dev copy, assessment gaps (e.g. free-response not in overlay), pacing?

### 4. Student (grades 2–8) — working

Agency, clarity, speak/type, rewards that feel diegetic, boredom breaks?

### 5. Student — not working

Stuck loops, too much reading, dialogue blocking work, unclear “what do I do now?”

## Output template (copy per session)

```markdown
## Playtest — YYYY-MM-DD — [slice name]

**Setup:** testcaptain / agent bootstrap / PRIMER_AI_DEBUG=[on|off]
**Scenario:** …
**Evidence:** session id, API mission board snapshot, screenshots

### 1. Functionality — working
- …

### 2. Curriculum / pedagogy — working
- …

### 3. Curriculum / pedagogy — gaps
- …

### 4. Student experience — working
- …

### 5. Student experience — gaps
- …

### Ranked recommendations

| Priority | Fix or build | Why |
|----------|--------------|-----|
| P0 | Quiz/crew-log overlays close dialogue cutscene | Kids must tap answers without Rho chat on top (`overlayWorkMode`, `e2e/quiz-over-dialogue.spec.ts`) |
| P0 | … | … |
| P1 | … | … |
| P2 | … | … |
```

**Priority rubric**

- **P0** — Blocks learning, trust, or progression; child sees broken or dev-only text; data/evidence wrong
- **P1** — High friction or confusion; fix soon for proof slice
- **P2** — Polish, engagement, or parent-facing; after core loop stable

## Latest snapshot (2026-10-05 — crew log → camp-math)

## Playtest — 2026-10-05 — V03 branching intro

**Setup:** local seeded testcaptain, `/dev/agent` → Play new intro. No learner content sent to media providers; synthetic production only.
**Scenario/evidence:** real-time browser briefing →10% offer →No →15% →No →20% final Yes-only →Yes/common continuation. Sound enabled through UI. Screenshot: `public/cinematics/prologue-v3/onboarding-choices-review.png`. Five automated intro scenarios also cover accepted-share persistence/reload, playback controls/Skip and failed-save retry.

1. **Functionality:** spoken offers hide bubbles; loop waits silently; final20% has only Yes. State/save guard prevents double clicks; source captions are editable.
2. **Curriculum — working:** corridor honestly calls this a learning game and names all four subjects; question/try/learn message connects learning to captain leadership.
3. **Curriculum — gaps:** formal test/writing/speaking progression disclosure remains separate design text. No child reading/comprehension study or functioning profit payout system claimed.
4. **Student — working:** personal base/crew benefit, clear percentage choices, first-person handshake/launch, sound/captions/pause/Skip.
5. **Student — gaps:** final forced Yes is deliberately limited agency; Skip available. Actual crash/objective sequence still needs production, currently a beach still/text bridge. Model acting/voice/lip-sync needs human playback approval; corridor includes officer escort and last alert softens.

**Checks:**94 unit tests + TypeScript pass. Whole browser suite14/15 sequentially; unrelated Jobs→quiz overlay test fails. All five intro scenarios pass. Earlier parallel fixture collisions corrected with one worker. Next priorities: investigate Jobs→quiz failure; human review of V03 before paid revisions; then script/generate same-ship crash and post-crash learning/leadership objective.

See project chat / MASTER §18. Verified: natural *show the mission board*; one chat message with crew-log sentence + camp request → `save_crew_log` path, toast, camp overlay; API `camp-math` → `available`.
