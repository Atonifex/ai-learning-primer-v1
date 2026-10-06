# Beta playtest feedback — 2026-10-05 — Round 1 (Grok Bot)

**Audience:** Cursor / Codex implementing the next slice  
**Testers:** homeschooled 5th-grader persona + parent (mom) persona  
**Setup:** local `npm run dev` @ `http://localhost:3000`, agent bootstrap via `/dev/agent` + `POST /api/dev/agent-bootstrap`  
**Session:** `cmuvsfnix000b9gc6m3ugfeqs` (dialogue/board), `cmuvsgn45000m9gc6zn2egxmq` (clip/overworld)  
**Screenshots:** `test-results/grok-beta/*.png` + `notes.json`  
**Not used:** production Vercel (agent bootstrap is local-only by design)

---

## Cursor / Codex — verify-first instructions (read before coding)

1. **Do not blindly apply every suggestion.** Treat this file as a beta report + hypothesized fixes, not an implementation mandate.
2. **Scan your own project knowledge first:** `CLAUDE.md`, `CONTEXT.md`, `docs/MASTER_VISION_PLAN.md` (§4 locks, §11 order, §15/§18), `docs/AGENT_PLAYTEST.md`, `docs/PLAYTEST_REVIEW.md`, `PROJECT_MEMORY.md`.
3. **Then verify in code** before editing:
   - Confirm whether `placementReady` / `hasSavedMathPlacement` is wired from a real persisted diagnostic, or currently always false.
   - Confirm how Camp Needs filters `locked` vs `available` vs `completed` rows in the UI.
   - Confirm where `arcSummary` / Previously On text is authored (session close vs test harness).
4. **If the report matches the code and product locks,** implement the highest-priority items that clearly unlock learning progression.
5. **If the report conflicts with MASTER locks or intentional gating,** keep the lock, document why in §18, and only improve kid-facing clarity (empty states, copy, CTA).
6. **Do not invent Florida standard codes.** Prefer existing `curriculum_resources/` + DB seed.
7. **After changes:** `npm test`, `npx tsc --noEmit`, relevant `e2e/` specs, and a `/dev/agent` browser pass. Close with what you verified.
8. **Tool-first:** child-facing next-step actions should go through orchestrator tools → SSE → PlayShell, not dialogue-only promises.

---

## Kid voice (5th grader) — what it felt like

I skipped the long intro with `/dev/agent` (good). Then I was talking to Rho and the yellow **Previously on** box said stuff about “checking the correct next overlay” and that the next math job isn’t open yet. That sounds like grown-up testing talk, not island adventure.

I said **show the mission board**. Camp Needs opened. Cool. But the only card was **Wreck count in three forms — DONE** with **Review**. Nothing else to do. I got bored and asked for a laser fort. Rho laughed (funny) but then kept asking me to remember expanded form. When I asked “what am I supposed to do right now?” Rho still wanted me to type a number instead of giving me a new job button. I wanted something to tap/play next, not a quiz in chat.

The island map looks fun. The one-clip panel looked clear. But if Camp Needs is empty of real jobs, I’m gonna click around or quit.

## Parent voice (mom) — what I care about

I like seeing **Progress** with `MA.3.NSO.1.1` evidence and time on the island. That helps me trust it’s school, not just a game.

Problems for me:
- The handoff / “Must reuse” / `map_note` / giant timestamp copy looks internal. I’d rather see plain English: what my kid finished, what’s next, what to ask them at dinner.
- If Chapter 2 is “Divide the Supplies” but the board only shows a finished Chapter-1-style wreck review, I worry my kid is stuck and will disengage.
- “AI packet” badge on the play HUD reads like a developer tool left on — I’d hide that unless I’m in a parent/dev debug mode.

---

## Five-lens review

### 1. Functionality — working
- `/dev/agent` + `agent-bootstrap` skips signup / long intro video path (as designed).
- Dialogue open, speak/type composer present, Rho replies with tools (`show_mission_board` worked).
- Board-only (`?board=1`) and clip-only (`?clip=1`) bootstraps work without LLM for UI checks.
- Overworld loads with chapter question + map pins; wreck shows completed check.
- Progress page shows standards evidence + crew log + subject mastery cards.

### 2. Curriculum / pedagogy — working
- Wreck salvage → number forms is coherent island framing.
- Rho redirects silly off-topic (lasers) back toward fair shares / prior math — good sidekick behavior.
- Learning clip prompt ties fractions to ration sharing (diegetic).
- Progress observation for `MA.3.NSO.1.1` is parent-legible.

### 3. Curriculum / pedagogy — gaps
- **Soft-lock after wreck:** Camp Needs shows only DONE wreck; next catalog jobs (`camp-math` “Paces of tens and hundreds”, dune/creek/treeline) never appear as playable CTAs.
- Rho falls back to free-response recall in chat when no open job exists (`formatMissionsForPrompt` “No open jobs — praise… invite a recap”) — assessment drifts out of overlay into chat.
- Previously On / arc summary language is meta (“overlay”, “job is not open yet”) — breaks immersion and teaches the wrong “what counts as learning.”
- Progress “Must reuse” / internal labels leak authoring contracts into parent UI.

### 4. Student experience — working
- Rho portrait + split dialogue feels like a game cutscene.
- Mic-first composer matches speak-first intent.
- Island map affordances (“Tap a place…”) are kid-readable.
- Clip modal has clear Watch / Not now.

### 5. Student experience — gaps
- No obvious **next doable job** after wreck → boredom / mischief loop.
- Previously On can feel like homework about the software.
- DONE+Review-only board feels like a dead end.
- Chat asks for expanded-form writing without an on-screen scaffold (hard for many 5th graders, worse for younger).

---

## Ranked recommendations (with files + rationale)

### P0 — Unlock a real next job after wreck (or make the gate kid-clear)

**Observed:** Board only shows completed wreck; dialogue says next math job isn’t open; Rho asks for recall instead of opening `camp-math`.

**Hypothesis to verify first:**  
`lib/play/mathPlacement.ts` → `hasSavedMathPlacement(code?)` returns `Boolean(code?.trim())`.  
`lib/play/missions.ts` → `resolveMissionStatus` uses `gates.placementReady ?? hasSavedMathPlacement()` (no code) → if `placementReady` isn’t passed as true from services, **every non-wreck mission stays locked forever**, even after wreck quiz completion. That matches the playtest.

**Suggested direction (only if verified):**
1. Wire `placementReady` from real persisted diagnostic / profile field in `lib/services/missions.ts` (and any API that builds the board).
2. Until the 5-question diagnostic exists, either:
   - treat wreck completion as temporary placement for the proof slice, **or**
   - surface a single explicit “Math starting point” mission/CTA instead of an empty DONE board.
3. Camp Needs UI should list **available + locked (with kid reason) + completed**, not only the DONE card — so kids see the path.

**Likely files:**
- `lib/play/mathPlacement.ts`
- `lib/play/missions.ts` (`resolveMissionStatus`, `decorateMissions`, `formatMissionsForPrompt`)
- `lib/services/missions.ts`
- Camp Needs overlay component(s) under `components/play/` (search `Camp needs` / mission board)
- `lib/ai/contextBuilder.ts` (tool guidance already says placement gates generation — keep consistent)
- Tests: `lib/play/missions.test.ts`, `e2e/` board/progression specs

**Acceptance:** After wreck DONE, kid sees at least one **Start**able next job (or a clear “take the 5-question starting check” CTA). Saying “what should I do?” should open/point to that CTA via tools, not only chat recall.

---

### P0 — Stop meta/QA language in kid-facing Previously On

**Observed:** Previously On: *“The captain practiced checking the correct next overlay…”* and *“next planned math job … is not open yet.”*

**Suggested direction:**
- Author `arcSummary` as in-world captain story (2–3 short sentences), never engineering/test vocabulary (`overlay`, `job`, `session`, `gate`).
- Optionally sanitize/reject summaries that contain banned tokens before UI render.
- Keep dismiss behavior in `PreviouslyOnCard`.

**Likely files:**
- Wherever session `arcSummary` is written (search `arcSummary` — likely session close / orchestrator / summarizer)
- `lib/services/sessionStoryContext.ts` (`getPreviouslyOnRecap`)
- `components/session/PreviouslyOnCard.tsx`
- Prompt templates that instruct summarization (`lib/ai/promptTemplates/` if used)

**Acceptance:** A 5th grader reading Previously On understands the *story*, not the software.

---

### P1 — “What do I do now?” must produce a concrete UI action

**Observed:** Kid asks what to do; Rho asks for expanded form from memory while board has no Start button.

**Suggested direction:**
- When `suggest_next_mission` / no available missions: still call `show_mission_board` and highlight the unlock CTA / locked reasons.
- Prefer `open_mission` / overlay quiz / diagnostic over free-response in chat for mastery evidence.
- If placement missing, Rho’s line should be: “Tap Camp needs → start Math starting point,” not “write expanded form in chat.”

**Likely files:**
- `lib/ai/sessionOrchestrator.ts` (tool handlers)
- `lib/ai/contextBuilder.ts` (TOOLS / suggest_next_mission copy)
- `lib/play/missions.ts` (`formatMissionsForPrompt` nextLine when none available)
- `e2e/` dialogue → board specs

---

### P1 — Camp Needs empty/dead-end UX

**Observed:** Overlay title Chapter 2, single DONE card + Review only.

**Suggested direction:**
- Empty-available state: illustration + one primary button (“Start next camp need” / “Math starting check”).
- Show locked missions greyed with short diegetic lockReason (already on `MissionPublic`).
- Review should reopen the overlay quiz in a kid-friendly way without requiring Rho chat.

**Likely files:** mission board UI in `components/play/*`, `lib/services/missions.ts`, related e2e (`e2e/quiz-over-dialogue.spec.ts` notes prior overlay/dialogue issues)

---

### P1 — Hide “AI packet” from child/parent default HUD

**Observed:** “AI packet” badge visible during play (screenshots 02–09).

**Suggested direction:** Ensure `AiDebugPanel` mounts **only** when `NEXT_PUBLIC_PRIMER_AI_DEBUG=1` (panel comment already says this). If it’s showing in normal local play, find the unconditional mount in `PlayShell` / learn page and gate it.

**Likely files:**
- `components/play/AiDebugPanel.tsx`
- `components/play/PlayShell.tsx` (or parent that mounts it)
- `lib/ai/turnDebugPacket.ts`

---

### P2 — Parent Progress copy should be plain language

**Observed:** “Must reuse · crew_log”, `DECISION · map_note:wreck`, timestamp `Map check 1791224400530`.

**Suggested direction:**
- Keep ledger internals for agents/prompts (`lib/play/chapterHandoff.ts`).
- Parent Progress UI: friendly labels (“Note to carry forward”, “Open mystery”, “Map decision”) and human dates.
- Don’t show raw `mustReuse` contract language to parents.

**Likely files:**
- `app/progress/` (page + components)
- any formatter that renders ledger facts for Progress
- `lib/play/chapterHandoff.ts` (keep agent contract; add a `formatForParent` helper if needed)

---

### P2 — Engagement / mischief handling (keep fun, then one clear next step)

**Observed:** Laser-fort joke handled warmly, but then loops into recall.

**Suggested direction:** One playful beat max, then a single tool-backed next action (open board / open mission / open clip). Avoid multi-question grilling in chat.

**Likely files:** prompt pedagogy in `lib/ai/contextBuilder.ts` / subject lens templates; optionally a small policy test.

---

## What worked well (keep)

- Agent playtest path (`docs/AGENT_PLAYTEST.md`, `/dev/agent`) — excellent for continuous beta loops.
- Diegetic resources HUD + chapter question on overworld.
- Learning clip modal structure (goal + hold-these questions + one clip).
- Rho persona staying First Mate (doesn’t take the quiz).

---

## Suggested Codex brief (pasteable)

> Verify whether post-wreck missions stay locked because `placementReady`/`hasSavedMathPlacement` never becomes true. If yes, wire real placement or a proof-slice unlock so `camp-math` (and/or a placement CTA) becomes Startable; make Camp Needs show available+locked+completed. Rewrite Previously On/`arcSummary` to in-world kid language (no overlay/job/session jargon). Gate AI packet to debug flag only. Soften Progress parent copy. Add/adjust unit + e2e coverage. Follow CLAUDE.md Test and next step. Do not invent Florida standards.

---

## Next beta round (after your fix)

Re-run `scripts/grok-beta-playtest.mjs` (or `/dev/agent` → dialogue):
1. Board shows a Startable next job after wreck.
2. “what should I do?” opens/points to that job.
3. Previously On reads like a story recap.
4. No AI packet badge unless debug env is on.
