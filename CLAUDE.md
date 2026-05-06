# CLAUDE.md

## Product
An interactive story-based learning companion inspired by Neal Stephenson's "The Young Lady's Primer".
Primary initial wedge: language learning for adults and homeschool learners.

## Priorities
1. High-retention product experience
2. Memorable, elegant UI
3. Structured learner memory
4. Story-based pedagogy
5. Clean, maintainable TypeScript code
6. Ability for central AI orchestrator to call internal or external tools (i.e. search the web, generate images/video, create quizzes, create and modify learning plans)

## Do not do
- Do not build a generic chatbot UI
- Do not overuse abstract hooks without need
- Do not create giant components over 250 lines unless justified
- Do not store memory as undifferentiated chat logs
- Do not add libraries without explaining why

## Preferred stack
- Next.js
- TypeScript
- Tailwind
- shadcn/ui
- Postgres
- Prisma
- structured evals and tests

## Deploy to Vercel using "vercel"