# CLAUDE.md

## Product
**Primer** — an interactive story-based learning companion inspired by Neal Stephenson's "The Young Lady's Primer."

Primary users: Grades 3–8 (Florida homeschool / ESA first; Grade 3–4 as the proof slice). The child is the player (captain); the parent is the economic buyer. Math, ELA, science, and social studies are **lenses on one shared island saga**, not four apps.

**Source of truth:** `docs/MASTER_VISION_PLAN.md`. Read it before large features. It wins over any archived or dated doc. Append discoveries to its §18 Implementation Log. Do not invent product direction.

Historical / superseded docs live in `docs/archive-OLD-DO-NOT-USE/` — do not implement from them.

## Locked product shape (do not reverse)
- **Home UX:** PixiJS Stardew-like top-down 2D overworld. Not Three.js. Not graphic-novel-as-home.
- **Dialogue:** cutscene overlay (chat left, portrait right) — reuse `/learn` streaming/UI pieces here; do not polish graphic-novel as the app shell.
- **Learning work:** full-screen activity tools / mini-games (not chat worksheets).
- **Companion:** Rho = First Mate (sidekick, never the hero; does not take tests).
- **Curriculum:** Florida standards only for MVP. Authoring in `curriculum_resources/standards_*.ts`. Do not invent standard codes.
- **No live language-tutor product path** (Spanish/Chinese tutor is post-MVP Guild trade at most). Schema `Language` / `targetLanguage` may stay nullable; do not build UI or prompt paths for them.
- Stay in this repo and prune vestigial code on contact — do not greenfield or fork.

## Priorities
1. High-retention product experience (diegetic rewards: map, crew, camp — not XP-for-its-own-sake)
2. Memorable, elegant UI that feels like a game
3. Structured learner memory + standards evidence parents can trust
4. Story-based pedagogy (Amplify-style coherence; standards are the hidden map)
5. Clean, maintainable TypeScript
6. Central AI orchestrator that can call internal/external tools (images, quizzes, plans, etc.)

## Do not do
- Do not build a generic chatbot UI or treat chat as the home loop
- Do not implement from `docs/archive-OLD-DO-NOT-USE/` or other superseded specs
- Do not overuse abstract hooks without need
- Do not create giant components over 250 lines unless justified
- Do not store memory as undifferentiated chat logs
- Do not add libraries without explaining why
- Do not invent Florida standard codes — research or use catalogs

## Preferred stack
- Next.js
- TypeScript
- Tailwind
- shadcn/ui
- Postgres
- Prisma
- PixiJS (overworld)
- structured evals and tests

## Deploy to Vercel using "vercel"
