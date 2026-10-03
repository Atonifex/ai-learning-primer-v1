<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

- PostgreSQL 16 is part of the environment. On boot, Postgres starts, the local `primer` role and database are created if missing, Prisma migrations are applied, and `npm run dev` listens on port 3000.
- Local database URL: `postgresql://primer:primer@127.0.0.1:5432/primer`. `prisma.config.ts` throws when `DATABASE_URL` is unset, including during `prisma generate` in `npm ci`.
- Checks: `npm run lint` and `npx tsc --noEmit`. There is no automated test script. `npx next build` imports the OpenAI client at module load, so `OPENAI_API_KEY` must be set (a placeholder is enough to compile). Story text and images need a real key. Supabase variables are optional and only used for durable scene images.
- Open the app at `http://localhost:3000` or `http://127.0.0.1:3000`. `allowedDevOrigins` includes `127.0.0.1` so the dev client hydrates on that host.
