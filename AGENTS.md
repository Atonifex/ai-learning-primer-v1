<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Primer — Agent entry (Cursor / multi-agent)

**Do not treat this file as the product bible.** Full workspace map and rules: **`CLAUDE.md`**. Task router: **`CONTEXT.md`**. Product source of truth: **`docs/MASTER_VISION_PLAN.md`**.

## Always

- Home = Pixi overworld; dialogue = cutscene; not graphic-novel-as-home.
- Live turns = `gpt-5.6-luna` (`lib/ai/models.ts`).
- **Tool-first:** New Rho/captain-facing features should usually be orchestrator tools (SSE → UI). If unsure, ask Ivan before coding. Rho live turns = session orchestrator + tools.
- No invented Florida standard codes.
- Do not implement from `docs/archive-OLD-DO-NOT-USE/`.
- After a slice: follow **Test and next step** below, then update MASTER §15 / §18 for what you actually finished.
- Before cinematic images/videos, read `docs/CINEMATIC_STYLE_GUIDE.md`: approved 3D animation, current active references, first-person cockpit, untouched island and scene-appropriate emotions. Exclude ARCHIVED assets. This does not change Pixi game art.

## Test and next step

After any change to behavior, data, prompts, or UI:

1. Add or update a unit test that fails if the new behavior disappears. Prefer a test of the rule itself (a handoff prompt must contain the child's note).
2. Run `npm test` and `npx tsc --noEmit`. Fix failures before saying the slice is done.
3. When the change is visible in the app, add or update a Playwright spec under `e2e/` and run `npm run test:e2e`. Also exercise that flow in the browser. A screenshot of a static render is not enough. If login, a missing key, or no running server blocks a check, say exactly what you could not verify.
4. Close the reply with what you tested, what passed, and what you could not verify. Then offer the next build slice as clickable choices. Offer 2–4 options. Put the recommended learning slice first and mark it recommended. These choices are the next piece of work. The in-game Jobs board is separate. Do not propose world generation unless Ivan asked for the world.

Do not treat a green typecheck alone as validation. Do not invent Florida standard codes while testing. Same text: `CLAUDE.md` and `.cursor/rules/test-and-next-step.mdc`.

## Working memory and future ideas

- Creative improvement requests ("iterate upon this", "reflect and improve", "do an improvement cycle") default to two critique/revision rounds through screenwriter, director and producer/editor lenses; follow `docs/CREATIVE_IMPROVEMENT_CYCLE.md`. Optimize clear, compelling, emotionally engaging scripts. Simulated perspectives must be labeled; critique does not authorize paid generation.
- Read `PROJECT_MEMORY.md` before substantive project work; update it concisely after meaningful discoveries or changed decisions.
- Capture user ideas outside the current development slice in `docs/Future_Development_ideas.md`, following its entry convention. Reuse/update related entries rather than losing ideas or expanding current scope.
- Distinguish user-requested ideas, proposed story mechanisms, verified science, and unverified grade/standards mappings. No invented standard codes.
- Future ideas are a backlog, not implementation authority. Promote a reviewed idea into MASTER before building it; retain current constraints and avoid revealing future discoveries early.

## Quick start

| Need | Open |
|------|------|
| Who / locks / folders | `CLAUDE.md` |
| What to load for this task | `CONTEXT.md` |
| Spec + checklist | `docs/MASTER_VISION_PLAN.md` |
| Playable shell | `components/play/PlayShell.tsx` |
| Stills filenames | `public/stills/tutorial/README.md` |
| Future stories / discoveries | `docs/Future_Development_ideas.md` |
| Browser / agent playtest | `docs/AGENT_PLAYTEST.md` → `/dev/agent` |
