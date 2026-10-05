# Primer — Workspace Map

## Identity

You are helping **Ivan Harjehausen** build **Primer** — an interactive story-based learning companion inspired by Neal Stephenson's *The Young Lady's Primer*.

Primary users: Grades 3–8 (Florida homeschool / ESA first; Grade 3–4 as the proof slice). The child is the player (**captain** = `displayName`); the parent is the economic buyer. Math, ELA, science, and social studies are **lenses on one shared island saga**, not four apps.

**Companion:** Rho = humanoid AI First Mate (sidekick, never the hero; does not take tests).

**Source of truth:** `docs/MASTER_VISION_PLAN.md`. It wins over archived or dated docs. Append discoveries to its §18 Implementation Log. Do not invent product direction.

---

## Rules (Always Apply)

- Read `docs/MASTER_VISION_PLAN.md` (§0, §4 locks, §11 order) before large features.
- Never invent Florida standard codes — use `curriculum_resources/standards_*.ts` or research CPALMS.
- Do not implement from `docs/archive-OLD-DO-NOT-USE/` or other superseded specs.
- Home is **PixiJS** Stardew-like top-down — not Three.js, not graphic-novel-as-home.
- Dialogue = cutscene (chat left, portrait right). Learning work = overlay quiz (MVP) or full-screen tool later.
- Live child-facing turns use **`gpt-5.6-luna`** (`lib/ai/models.ts`). Do not silently swap to a larger chat model on the walk/talk loop.
- Do not redesign mastery math (`standardsMasteryMath`) unless asked.
- Do not build the parent dashboard until the student loop is playable.
- No live language-tutor product path (Spanish/Chinese tutor is post-MVP at most).
- Stay in this repo and prune vestigial code on contact — do not greenfield or fork.
- Ask clarifying questions before assuming product direction. When unsure, say so.
- **Tool-first for live features:** New child-facing features the captain can invoke through Rho (boards, overlays, quizzes, world actions, UI modes) should almost always become **callable tools** on the session orchestrator (`lib/ai/sessionOrchestrator.ts` + tool defs + SSE → PlayShell). Rho's live turns *are* that orchestrator (luna + tools); do not ship dialogue-only descriptions of UIs that exist on screen. If it is unclear whether something should be a tool, **ask Ivan explicitly** before implementing.
- Concise over comprehensive. Prefer pointed changes over drive-by refactors.
- For creative iteration/reflection/improvement requests, follow `docs/CREATIVE_IMPROVEMENT_CYCLE.md`: three labeled professional lenses, critique → revision 1 → critique → revision 2. Prioritize compelling, clear, emotionally engaging scripts; do not imply simulated reviewers are real consultations or automatically spend video credits.
- Read `PROJECT_MEMORY.md` before substantive work and update meaningful discoveries concisely. Capture out-of-slice user ideas in `docs/FUTURE_STORY_IDEAS.md` using its convention; distinguish requests, proposals, verified science, and unverified grade mapping. Backlog entries do not authorize current implementation; promote reviewed ideas into MASTER before building.
- Do not create giant components over ~250 lines unless justified.
- Do not add libraries without explaining why.
- COPPA: voice is personal data — STT transcribes and **discards** audio (`app/api/stt/route.ts`).
- Deploy to Vercel with `vercel` when asked.

### Next.js version note

This Next.js has breaking changes vs older training data. Before writing App Router / config code, check `node_modules/next/dist/docs/` and heed deprecation notices. (Same rule lives in `AGENTS.md` for Cursor.)

---

## Quick Navigation

| Task | Go Here |
|------|---------|
| **Any non-trivial feature** | `CONTEXT.md` (task router) → then `docs/MASTER_VISION_PLAN.md` |
| Product locks / checklist / impl log | `docs/MASTER_VISION_PLAN.md` (§4, §15, §18) |
| First playable loop order | `docs/MASTER_VISION_PLAN.md` §11 |
| Three-mode shell (intro / Pixi / dialogue / quiz) | `components/play/PlayShell.tsx` |
| Pixi beach map + movement | `components/play/beachWorld.ts` + `lib/play/beachMap.ts` |
| Tutorial stills paths / placeholders | `lib/play/stills.ts` + `public/stills/tutorial/README.md` |
| Intro cinematic slot | `public/cinematics/README.md` + `components/play/IntroCinematic.tsx` |
| Live model name | `lib/ai/models.ts` |
| Session SSE / luna turns | `lib/ai/sessionOrchestrator.ts` + `app/api/session/[id]/message/route.ts` |
| Prompt bible + subject lenses | `lib/ai/promptTemplates/` |
| STT (Whisper; discard audio) | `app/api/stt/route.ts` |
| TTS (Rho; OpenAI; discard audio) | `app/api/tts/route.ts` + `components/play/useRhoTts.ts` |
| Overlay salvage quiz | `lib/play/tutorialQuiz.ts` + `app/api/session/[id]/tutorial-quiz/route.ts` |
| Seed standards + activity bank | `prisma/seed.ts` + `curriculum_resources/` |
| Florida G3 catalogs (authoring) | `curriculum_resources/standards_*_grade3.ts` |
| Activity bank templates | `curriculum_resources/grade3_activity_bank*.ts` |
| Saga / chapter spine | `curriculum_resources/grade3_castaway_curriculum.ts` |
| Story chain for a learner | `lib/services/storyCurriculum.ts` |
| Progress / mastery (do not redesign yet) | `lib/services/standardsMasteryMath.ts` + `app/progress/` |
| Auth / profile / onboarding | `lib/auth/` + `app/onboarding/` + `components/onboarding/` |
| Scene image tool (off on live turns for stills pack) | `lib/ai/imageTool.ts` + `docs/decisions-scene-images.md` if present |
| Tests | `npm test` (Vitest); `npm run test:e2e` (Playwright, `e2e/`); `docs/vitest-testing-guide.md` |
| Browser / agent playtest | `docs/AGENT_PLAYTEST.md` + `/dev/agent` |
| Historical specs (read-only) | `docs/archive-OLD-DO-NOT-USE/` |

---

## Locked product shape (do not reverse)

- **Home UX:** PixiJS Stardew-like top-down 2D overworld.
- **Dialogue:** cutscene overlay — chat left, portrait right; speak-first mic in composer.
- **Learning work:** overlay quiz for MVP; deeper tools go full-screen later.
- **Companion:** Rho = First Mate.
- **Curriculum:** Florida only for MVP.
- **Tonight teach:** ~10 standards × 4 subjects (§4.6). Catalog in DB is full G3.

---

## Priorities

1. High-retention product experience (diegetic rewards: map, crew, camp — not XP-for-its-own-sake)
2. Memorable UI that feels like a game
3. Structured learner memory + standards evidence parents can trust
4. Story-based pedagogy (Amplify-style coherence; standards are the hidden map)
5. Clean, maintainable TypeScript
6. Central AI orchestrator that can call tools (images, quizzes, plans, etc.)

---

## Folder Structure

```
ai-learning-primer-v1/
├── CLAUDE.md                 ← You are here (always loaded by Claude Code)
├── CONTEXT.md                ← Task router — start here for “what do I load?”
├── AGENTS.md                 ← Cursor / multi-agent entry (points here + Next.js note)
│
├── docs/
│   ├── MASTER_VISION_PLAN.md ← Product source of truth
│   ├── testing-maturity-roadmap.md
│   ├── vitest-testing-guide.md
│   └── archive-OLD-DO-NOT-USE/  ← Do not implement from these
│
├── app/                      ← Next.js App Router
│   ├── learn/                ← Playable loop entry → PlayShell
│   ├── onboarding/
│   ├── progress/             ← Parent-facing later; evidence UI now
│   ├── sessions/
│   ├── (auth)/               ← Login / register
│   └── api/                  ← Auth, session SSE, STT, tutorial-quiz, profile
│
├── components/
│   ├── play/                 ← Three-mode shell (intro, Pixi, dialogue, quiz)
│   ├── session/              ← Chat bubbles, InputBar+mic, activity cards
│   ├── onboarding/
│   └── ui/                   ← shadcn-style primitives
│
├── lib/
│   ├── ai/                   ← Orchestrator, prompts, models, image/STT helpers
│   ├── play/                 ← Beach map, stills catalog, hidden turns, tutorial quiz
│   ├── services/             ← Session, story, standards, activities, progress
│   ├── auth/                 ← JWT cookie session
│   ├── db/                   ← Prisma client
│   └── types/
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts               ← G3 catalogs + activity bank + test captain
│   └── seeds/
│
├── curriculum_resources/     ← Authoring catalogs + activity bank + saga spine
│   ├── standards_*_grade*.ts
│   ├── grade3_activity_bank*.ts
│   ├── grade3_castaway_curriculum.ts
│   └── cpalms-standards-researcher-SKILL.md
│
├── public/
│   ├── stills/tutorial/      ← Drop stills here (exact filenames in README)
│   └── cinematics/           ← crash_landing.mp4 later; poster until then
│
└── Project Scoping and Planning Documents/  ← Older MVP specs; prefer MASTER_VISION_PLAN
```

---

## Token Management

Do not load the whole repo into context.

| Working on… | Load | Skip |
|-------------|------|------|
| Play shell / Pixi / dialogue / quiz | `CONTEXT.md` route + `components/play/*` + `lib/play/*` + MASTER §4.7 / §7 / §11 | Full curriculum dumps |
| Live LLM / prompts / tools | `lib/ai/*` + relevant prompt template + MASTER §4.4 | Pixi files |
| Standards / seed / activity bank | `curriculum_resources/` + `prisma/seed.ts` + MASTER §4.6 / §4.11 | UI chrome |
| Mastery / progress | `lib/services/standards*` + `app/progress/` — **do not redesign formula** | Play shell |
| Stills / intro art | `public/stills/tutorial/README.md` + `lib/play/stills.ts` + MASTER §4.12 | Orchestrator internals |
| Auth / onboarding | `lib/auth/` + `app/onboarding/` | Curriculum |

`CONTEXT.md` tells you exactly what to open next. Trust it.

---

## Preferred stack

Next.js · TypeScript · Tailwind · shadcn/ui · Postgres · Prisma · PixiJS · Vitest · Playwright · OpenAI (luna live turns, Whisper STT, optional Images for stills pack)

---

## Agent hygiene

1. Prefer the smallest testable increment that matches §11.
2. After a slice: follow **Test and next step** below, then update MASTER §15 checkboxes you actually finished + §18 log.
3. Never parallel-edit `prisma/schema.prisma` and `sessionOrchestrator.ts` with another agent without a written contract.
4. Record technical debt in §15 / §18 rather than silently expanding scope.
5. Use working memory documents or a planning file with checklists if a scope is going to be very big.

## Test and next step

After any change to behavior, data, prompts, or UI:

1. Add or update a unit test that fails if the new behavior disappears. Prefer a test of the rule itself (a handoff prompt must contain the child's note).
2. Run `npm test` and `npx tsc --noEmit`. Fix failures before saying the slice is done.
3. When the change is visible in the app, add or update a Playwright spec under `e2e/` and run `npm run test:e2e`. Also exercise that flow in the browser. A screenshot of a static render is not enough. If login, a missing key, or no running server blocks a check, say exactly what you could not verify.
4. Close the reply with what you tested, what passed, and what you could not verify. Then offer the next build slice as clickable choices. Offer 2–4 options. Put the recommended learning slice first and mark it recommended. These choices are the next piece of work. The in-game Jobs board is separate. Do not propose world generation unless Ivan asked for the world.

Do not treat a green typecheck alone as validation. Do not invent Florida standard codes while testing. Cursor copy: `.cursor/rules/test-and-next-step.mdc`.
