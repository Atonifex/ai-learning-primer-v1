<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Primer — Agent entry (Cursor / multi-agent)

**Do not treat this file as the product bible.** Full workspace map and rules: **`CLAUDE.md`**. Task router: **`CONTEXT.md`**. Product source of truth: **`docs/MASTER_VISION_PLAN.md`**.

## Always

- Home = Pixi overworld; dialogue = cutscene; not graphic-novel-as-home.
- Live turns = `gpt-5.6-luna` (`lib/ai/models.ts`).
- No invented Florida standard codes.
- Do not implement from `docs/archive-OLD-DO-NOT-USE/`.
- After a slice: update MASTER §15 / §18 for what you actually finished.

## Quick start

| Need | Open |
|------|------|
| Who / locks / folders | `CLAUDE.md` |
| What to load for this task | `CONTEXT.md` |
| Spec + checklist | `docs/MASTER_VISION_PLAN.md` |
| Playable shell | `components/play/PlayShell.tsx` |
| Stills filenames | `public/stills/tutorial/README.md` |
