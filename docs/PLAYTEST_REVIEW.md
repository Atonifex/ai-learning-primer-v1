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
| P0 | … | … |
| P1 | … | … |
| P2 | … | … |
```

**Priority rubric**

- **P0** — Blocks learning, trust, or progression; child sees broken or dev-only text; data/evidence wrong
- **P1** — High friction or confusion; fix soon for proof slice
- **P2** — Polish, engagement, or parent-facing; after core loop stable

## Latest snapshot (2026-10-05 — crew log → camp-math)

See project chat / MASTER §18. Verified: natural *show the mission board*; one chat message with crew-log sentence + camp request → `save_crew_log` path, toast, camp overlay; API `camp-math` → `available`.
