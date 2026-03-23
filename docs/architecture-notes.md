# Architecture Notes

## Purpose
These notes capture current architectural thinking for Primer before implementation details are finalized.

The goal is to guide planning and system design while leaving room for refinement.

## Product Shape
Primer is not a generic chatbot app.
It is a structured learning system with conversational interaction, learner modeling, memory, and narrative continuity.

The architecture should reflect that.

## Core Architectural Priorities
1. clean, maintainable TypeScript code
2. clear separation between UI, application logic, and AI orchestration
3. structured learner memory rather than raw transcript dependence
4. ability to evolve into a premium educational platform
5. support for differentiated product experience, not just fast prototyping

## Candidate Tech Direction
Current likely stack:
- Next.js with App Router
- TypeScript
- Tailwind CSS
- component system such as shadcn/ui
- Postgres database
- Prisma or Drizzle ORM
- server-side orchestration for AI calls
- Vercel for deployment

These are starting assumptions, not final requirements.

## High-Level System Areas

### 1. Frontend App
Responsibilities:
- onboarding
- learner profile setup
- session UI
- dashboard/progress UI
- history/resume UI
- premium visual design system

### 2. Application Backend
Responsibilities:
- authentication and session management
- saving learner profile data
- storing structured session outputs
- retrieving memory and learner context
- managing story/session state
- orchestrating AI calls
- selecting next recommended content or session framing

### 3. AI Orchestration Layer
Responsibilities:
- construct prompts using learner profile, memory, and current session context
- separate system instructions from dynamic context
- control what memory is retrieved and injected
- handle post-session extraction of durable memory
- potentially support multiple prompt flows in the future

### 4. Data Layer
Responsibilities:
- persist core entities cleanly
- support learner model updates over time
- support querying of prior sessions, memory, and progress data
- avoid reliance on huge unstructured blobs

## Key Domain Entities
Likely entities include:

### User
Represents the account holder.

### LearnerProfile
Represents the learning identity for the active learner.
Possible fields:
- userId
- activeLanguage
- currentLevel
- goals
- interests
- preferredPacing
- preferredStyle
- createdAt
- updatedAt

### Session
Represents a learning interaction.
Possible fields:
- learnerProfileId
- sessionType
- language
- startedAt
- completedAt
- summary
- storyStateReference
- transcriptReference or stored messages

### MemoryItem
Represents durable, structured memory extracted from prior sessions.
Possible categories:
- preference
- goal
- interest
- weakness
- misconception
- vocabulary gap
- confidence signal
- recurring mistake
- story continuity detail

Possible fields:
- learnerProfileId
- type
- content
- relevance
- confidence
- sourceSessionId
- createdAt
- updatedAt

### SkillProgress
Represents learner progress in a structured area.
Possible fields:
- learnerProfileId
- skillName
- language
- estimatedLevel
- confidence
- lastObservedAt

### StoryState or StoryArc
Represents narrative continuity.
Possible fields:
- learnerProfileId
- arcName
- currentState
- recurringCharacters
- activeThemes
- lastUpdatedAt

### SuggestedNextStep
Represents recommended next learning action.
This may be derived rather than stored initially.

## Important Architectural Principle
Do not treat memory as one giant conversation history.

Instead, use layered memory:
1. short-term session context
2. medium-term recent history
3. durable structured learner memory
4. narrative continuity state

This should help the system feel coherent while staying maintainable and cost-conscious.

## Candidate Request Flow for a Session
1. user opens a session
2. backend loads learner profile
3. backend loads relevant memory items
4. backend loads relevant story continuity state
5. orchestration layer builds the prompt context
6. model generates the next learning interaction
7. user responds
8. backend stores session messages
9. after session or at checkpoints, the system extracts structured memory updates
10. learner model and story state are updated
11. dashboard and next-step recommendation reflect the updated state

## Candidate Memory Strategy
Memory should probably be stored in relational form first.

Possible approach:
- use Postgres as source of truth
- store transcript/messages separately from structured memory items
- introduce vector search only later if needed for retrieval quality

Reasoning:
- V1 should optimize for clarity, debuggability, and explicit learner modeling
- vector search may be useful later, but should not replace structured memory design

## Prompting / Orchestration Notes
The system will likely need more than one prompt type.

Possible flows:
1. live session generation
2. post-session summary
3. memory extraction
4. progress inference
5. next-session recommendation

This suggests keeping prompt templates and orchestration logic modular.

## UI / UX Notes
The interface should not feel like a generic chat app.

Important product direction:
- premium
- warm
- polished
- curiosity-driven
- minimal clutter
- clear continuity from prior sessions

Likely key UI surfaces:
- onboarding/profile
- home/dashboard
- session screen
- session recap or summary
- history/resume flow

## Open Questions
These are intentionally unresolved and should be clarified during planning:
- Should V1 support both Spanish and Chinese immediately, or just one language first? --> Answer: Both
- How should learner progress be represented without building a heavy traditional LMS?
- Should image generation be included in V1 or deferred? --> Answer: It should be in V1
- Should the session UI look primarily like guided dialogue, story cards, or a hybrid? Answer: It should be like a graphic novel where there is a picture generated with each significant scene while there are story cards alongside it with text and dialogue boxes.
- Should memory extraction happen after every session, during checkpoints, or both? --> Answer: Both
- What level of learner control should exist over tone, difficulty, and pacing in V1? --> Answer: the learner should be able to adjust the settings for the AI based on their prompts in the end, but not in v1

## Constraints
- prioritize clean architecture over rushed feature breadth
- avoid overengineering too early
- avoid generic AI app patterns
- prefer structured data and typed systems
- build the smallest vertical slice that proves differentiation

## Recommended Immediate Planning Outputs
The next planning stage should produce:
1. tighter V1 user definition
2. finalized core product loop
3. initial schema draft
4. route/page map
5. service/module boundaries
6. milestone-based implementation plan


35+ files across the full stack, all wired together:                                       
  
  prisma/schema.prisma          → 7 tables: User, LearnerProfile, Session,
                                   Message, MemoryItem, SkillProgress, StoryState
  prisma.config.ts              → Prisma 7 config (reads DATABASE_URL)
  middleware.ts                 → JWT auth guard on all protected routes

  lib/auth/jwt.ts               → Sign/verify JWTs with jose
  lib/auth/session.ts           → Read current user from cookie
  lib/db/prisma.ts              → Prisma client singleton (PrismaPg adapter)
  lib/types/index.ts            → Shared TypeScript types
  lib/ai/contextBuilder.ts      → Builds GPT-4o system prompt from profile + memory
  lib/ai/sessionOrchestrator.ts → Streams GPT-4o response, handles image tool calls
  lib/ai/imageTool.ts           → Calls gpt-image-1-mini via OpenAI images API
  lib/ai/memoryExtractor.ts     → Post-session structured extraction (JSON mode)
  lib/services/{profile,session,memory}.ts → All DB operations

  app/(auth)/login,register     → Auth pages
  app/onboarding                → 3-step profile setup wizard
  app/learn                     → Starts/resumes session, redirects
  app/learn/[sessionId]         → Main session screen (streaming, scene panel, bubbles)      
  app/sessions                  → Session history + resume links
  app/api/auth/{login,register,logout}
  app/api/profile
  app/api/session/start
  app/api/session/[id]
  app/api/session/[id]/message  → SSE streaming endpoint with image tool handling
  app/api/session/[id]/complete → Memory extraction + session completion
  app/api/sessions