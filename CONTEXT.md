# Primer — Task Router

## What this is

Operating router for the Primer codebase. **CLAUDE.md** (always loaded) has identity, locks, and the folder map. This file tells you **what to open next** for a concrete task.

**Product source of truth:** `docs/MASTER_VISION_PLAN.md`  
**Do not implement from:** `docs/archive-OLD-DO-NOT-USE/`

---

## Task routing

| Your task | Go here | You'll also need |
|-----------|---------|------------------|
| **Large / ambiguous feature** | `docs/MASTER_VISION_PLAN.md` §0 + §11 | §4 locks; append §18 when done |
| **Play shell / U4 flow / Pixi beach** | `components/play/PlayShell.tsx` | `beachWorld.ts`, `lib/play/beachMap.ts`, MASTER §4.7 / §4.10 / §7 |
| **Dialogue cutscene / mic / speak-first** | `components/play/DialogueCutscene.tsx` | `components/session/InputBar.tsx`, `MicButton.tsx`, MASTER §4.8 |
| **Overlay tutorial quiz** | `lib/play/tutorialQuiz.ts` | `lib/play/overlayQuiz.ts`, `app/api/session/[id]/overlay-quiz/route.ts`, bank slugs in `lib/play/missions.ts` |
| **Mission board / other pins** | `lib/play/missions.ts` | `components/play/MissionBoard.tsx`, `app/saga/page.tsx`, `lib/services/missions.ts`, MASTER §4.6 / A6 |
| **Generate tutorial stills / art pack** | `public/stills/tutorial/README.md` | `lib/play/stills.ts`, MASTER §4.12; style: Stardew-like, not a clone; exact filenames |
| **Intro cinematic / Skip** | `components/play/IntroCinematic.tsx` | `public/cinematics/README.md` |
| **Change live model / router** | `lib/ai/models.ts` | `lib/ai/sessionOrchestrator.ts` — live turns stay `gpt-5.6-luna` |
| **Prompt / Rho voice / subject lens** | `lib/ai/promptTemplates/` | `lib/ai/contextBuilder.ts`, shared bible `_shared_castaway_world.ts` |
| **Session streaming / tools** | `lib/ai/sessionOrchestrator.ts` | `app/api/session/[id]/message/route.ts`, `lib/play/hiddenTurns.ts` |
| **STT / Whisper** | `app/api/stt/route.ts` | Needs `OPENAI_API_KEY` in `.env`; discard audio (COPPA) |
| **TTS / Rho voice** | `app/api/tts/route.ts` | `components/play/useRhoTts.ts` + DialogueCutscene; OpenAI `gpt-4o-mini-tts`; audio not stored |
| **Seed DB / standards gap / activity bank** | `prisma/seed.ts` | `curriculum_resources/standards_*_grade3.ts` + `*_grade4.ts`, `from_grade3_bank.ts`, MASTER §4.11 |
| **Author a Florida standard or activity** | `curriculum_resources/` | Never invent codes; use CPALMS skill if verifying |
| **Saga / wreck+food chapters** | `curriculum_resources/grade3_castaway_curriculum.ts` | `lib/services/castawayChapters.ts`, `storyCurriculum.ts` |
| **Mastery / evidence / progress UI** | `lib/services/standardsProgress.ts` | `standardsMasteryMath.ts` — **do not redesign**; `app/progress/` |
| **Auth / register / login** | `app/(auth)/` | `lib/auth/`, `app/api/auth/`, `/household` |
| **Onboarding / first-run tutorial** | `lib/play/firstRun.ts` | `components/onboarding/CaptainAwakening.tsx`, `PlayShell`, `app/household/` |
| **Reading level / learner settings** | `app/settings/page.tsx` | `components/settings/ReadingLevelForm.tsx`, `PATCH /api/profile` |
| **Tests** | `npm test` | `docs/vitest-testing-guide.md`; play helpers under `lib/play/*.test.ts` |
| **Deploy** | Vercel CLI `vercel` | Env: `OPENAI_API_KEY`, DB URL, JWT secret |

---

## Current build phase (read before coding)

**Done:** Step 0 data (G3 **and G4** catalogs + G3 activity bank + wreck/food chapters). Step 1 three-mode shell. Mission Loop v1. Rho TTS. Onboarding grade → G3 or G4 subject enrollment.

**Open next (typical):** disguised first-30-min placement (MASTER §4.4); parchment map; Higgsfield mp4; then remaining tutorial / parent surfaces per MASTER §15.

**Explicitly out of first loop:** parent dashboard, mastery redesign, G5+ catalogs, Three.js, graphic-novel-as-home, language-tutor as the product.

Debt list lives under MASTER §15 “Step 1 closeout” — clear at end of plan unless a later step naturally removes it.

---

## About Primer (one paragraph)

A Grade 3–8 learner is the **captain** on a persistent island. Rho (First Mate) scaffolds in a ZPD way. Standards are the hidden map; story is why the child cares; activities are the work; parents see Florida evidence. First market: Florida ESA / homeschool. Collaborator context: Quay (pedagogy / prototype partner); Ivan owns IP for now.

---

## Workspace summary

| Area | Purpose | Key entry |
|------|---------|-----------|
| `components/play/` | Three-mode game shell | `PlayShell.tsx` |
| `lib/ai/` | Orchestrator, prompts, models | `sessionOrchestrator.ts` |
| `lib/play/` | Map, stills, hidden turns, tutorial quiz | `beachMap.ts`, `stills.ts` |
| `curriculum_resources/` | Standards + bank + saga authoring | `standards_*_grade3.ts` |
| `prisma/` | Schema + seed | `seed.ts` |
| `docs/` | Vision + testing policy | `MASTER_VISION_PLAN.md` |
| `public/stills/` | Static art pack | `tutorial/README.md` |

---

## Cross-area flow

```
curriculum_resources/ (standards + bank + saga)
        ↓ seeded by
prisma/seed.ts
        ↓ instantiated per learner
lib/services/storyCurriculum.ts + castawayChapters.ts
        ↓ played in
components/play/ (Pixi + dialogue + overlay quiz)
        ↓ taught by
lib/ai/sessionOrchestrator.ts (gpt-5.6-luna)
        ↓ measured in
standardsEvidence → app/progress/
```

---

## Stills pack checklist (when generating art)

1. Read `public/stills/tutorial/README.md` for **exact filenames**.
2. Style: Stardew-like readable top-down, slightly more modern than pure SNES; **not** a copy of Stardew or Pokémon; portraits may be more illustrated than map sprites.
3. Priority: Rho portraits (3) + cinematic poster + captain/Rho overworld sprites, then wreck/pins.
4. Save `.webp` (or `.png`) under `public/stills/tutorial/`. App must never crash if a file is missing (`SafeStill` / optional Pixi textures).
5. Do not wire per-turn image gen back on until MASTER says full-MVP dynamic scenes.
