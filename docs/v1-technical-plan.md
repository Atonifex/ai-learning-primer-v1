# ⚠️ OPEN QUESTIONS — Resolve Before / During Implementation

1. **gpt-image-1-mini model name** — User specified `gpt-image-1-mini` but OpenAI's known
   image models are `gpt-image-1`, `dall-e-3`, `dall-e-2`. Verify this exact model name exists
   in your OpenAI account before running. If not, use `gpt-image-1` or `dall-e-3`.
   Current code uses `gpt-image-1-mini` as specified — update `lib/ai/imageTool.ts` if needed.

2. **gpt-image-1 response format** — `gpt-image-1` may return `b64_json` by default instead
   of a URL. If image URLs are not returned, update `imageTool.ts` to handle base64 and
   either store as data URL (not recommended for prod) or upload to blob storage.

3. **Image URL expiration** — OpenAI image URLs expire (typically 1 hour for dall-e-3).
   Stored `imageUrl` values in old sessions will break. Post-V1: proxy images through
   Next.js or upload to S3/R2 on generation.

4. **Database** — Requires a running PostgreSQL instance. Options for local dev: Docker,
   Postgres.app (Mac), or a free cloud instance (Neon, Supabase, Railway).
   Run `npx prisma migrate dev --name init` after setting DATABASE_URL.

5. **JWT_SECRET** — Must be set to a strong random string in production.
   Generate with: `openssl rand -base64 32`

---

# Primer V1 — Technical Implementation Plan

## Decisions Locked In

| Question | Answer |
|---|---|
| Languages | Spanish + Chinese, both from launch |
| Session UI | Graphic novel: scene image + story cards + dialogue boxes + user text bubbles |
| User input | Free-form text; bubble text is sent as-is to the AI |
| Main LLM | Claude (claude-sonnet-4-6) with tool calling |
| Image generation | OpenAI gpt-image-1-mini, called as a Claude tool, one image per scene |
| Memory extraction | LLM call on leave-button click or beforeunload |
| Story arc | Dynamically generated per session |
| V1 scope | Onboarding → session loop → session history/resume. No dashboard. |
| Payment gate | None |
| Learner tone/difficulty control | Deferred to post-V1 |

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Next.js App Router                   │
│                                                         │
│  /onboarding     /learn      /learn/[id]    /sessions   │
└────────────────────────┬────────────────────────────────┘
                         │ Server Actions / Route Handlers
┌────────────────────────▼────────────────────────────────┐
│                   Application Backend                    │
│                                                         │
│  auth layer   │  profile service  │  session service    │
│               │  memory service   │  story service      │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                  AI Orchestration Layer                  │
│                                                         │
│  ContextBuilder  │  SessionOrchestrator  │  MemoryExtractor  │
│                  │  ImageTool (tool def) │                   │
└──────┬───────────────────────┬───────────────────────────┘
       │                       │
  Anthropic API           OpenAI API
  (Claude sonnet)         (gpt-image-1-mini)
       │                       │
┌──────▼───────────────────────▼───────────────────────────┐
│                      Postgres (Prisma)                    │
│  User  LearnerProfile  Session  Message                  │
│  MemoryItem  SkillProgress  StoryState                   │
└───────────────────────────────────────────────────────────┘
```

**Key separation principle:** UI never calls Anthropic or OpenAI directly. All AI calls go through server-side orchestration modules. The AI orchestration layer is the only thing that knows about prompt construction.

---

## 2. Database Schema

```prisma
// schema.prisma

model User {
  id             String          @id @default(cuid())
  email          String          @unique
  passwordHash   String
  createdAt      DateTime        @default(now())
  learnerProfile LearnerProfile?
}

model LearnerProfile {
  id              String          @id @default(cuid())
  userId          String          @unique
  user            User            @relation(fields: [userId], references: [id])
  activeLanguage  Language
  currentLevel    Level
  goals           String          // free text from onboarding
  interests       String[]        // e.g. ["travel", "food", "history"]
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  sessions        Session[]
  memoryItems     MemoryItem[]
  skillProgress   SkillProgress[]
  storyStates     StoryState[]
}

enum Language {
  ES  // Spanish
  ZH  // Chinese
}

enum Level {
  BEGINNER
  INTERMEDIATE
  ADVANCED
}

model Session {
  id                String          @id @default(cuid())
  learnerProfileId  String
  learnerProfile    LearnerProfile  @relation(fields: [learnerProfileId], references: [id])
  language          Language
  status            SessionStatus   @default(ACTIVE)
  arcName           String?         // generated at session start
  arcSummary        String?         // populated after session
  startedAt         DateTime        @default(now())
  completedAt       DateTime?
  messages          Message[]
  storyState        StoryState?
  sourceMemoryItems MemoryItem[]    @relation("SourceSession")
}

enum SessionStatus {
  ACTIVE
  COMPLETED
  ABANDONED
}

model Message {
  id          String      @id @default(cuid())
  sessionId   String
  session     Session     @relation(fields: [sessionId], references: [id])
  role        MessageRole
  content     String      // text content of the message
  imageUrl    String?     // set when AI called generate_scene_image tool
  imagePrompt String?     // the prompt used to generate the image
  orderIndex  Int
  createdAt   DateTime    @default(now())
}

enum MessageRole {
  USER
  ASSISTANT
}

model MemoryItem {
  id               String         @id @default(cuid())
  learnerProfileId String
  learnerProfile   LearnerProfile @relation(fields: [learnerProfileId], references: [id])
  type             MemoryType
  content          String
  confidence       Float          @default(1.0)  // 0.0–1.0
  sourceSessionId  String?
  sourceSession    Session?       @relation("SourceSession", fields: [sourceSessionId], references: [id])
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt
}

enum MemoryType {
  VOCABULARY_GAP
  RECURRING_MISTAKE
  MISCONCEPTION
  CONFIDENCE_SIGNAL
  INTEREST
  GOAL
  PREFERENCE
  STORY_CONTINUITY
}

model SkillProgress {
  id               String         @id @default(cuid())
  learnerProfileId String
  learnerProfile   LearnerProfile @relation(fields: [learnerProfileId], references: [id])
  skillName        String         // e.g. "subjunctive mood", "tones", "measure words"
  language         Language
  estimatedLevel   Float          // 0.0–1.0
  confidence       Float          @default(0.5)
  lastObservedAt   DateTime       @default(now())

  @@unique([learnerProfileId, skillName, language])
}

model StoryState {
  id                  String         @id @default(cuid())
  learnerProfileId    String
  learnerProfile      LearnerProfile @relation(fields: [learnerProfileId], references: [id])
  sessionId           String         @unique
  session             Session        @relation(fields: [sessionId], references: [id])
  arcName             String
  currentState        String         // narrative summary of where the story is
  recurringCharacters Json           // { name: string, description: string }[]
  activeThemes        String[]
  lastUpdatedAt       DateTime       @updatedAt
}
```

---

## 3. Route / Page Map

```
App Routes (Next.js App Router)
│
├── / ─────────────────── redirect → /learn (if authed) or /onboarding (if new)
├── /onboarding ────────── profile setup wizard (language, level, goals, interests)
├── /learn ─────────────── start new session (creates session, redirects to /learn/[id])
├── /learn/[sessionId] ─── THE main session screen
├── /sessions ──────────── session history list + resume links
│
API Route Handlers
│
├── POST /api/auth/[...] ─── Auth.js endpoints
├── GET  /api/profile ──────── load learner profile
├── PUT  /api/profile ──────── update learner profile
│
├── POST /api/session/start ─── create session, generate arc, return sessionId
├── GET  /api/session/[id] ──── load session + messages + story state
├── POST /api/session/[id]/message ─ send user message, stream AI response
├── POST /api/session/[id]/complete ─ trigger memory extraction, mark completed
│
├── GET  /api/sessions ──────── list sessions for current user
```

---

## 4. Backend Responsibilities

### Auth Layer
- Auth.js (formerly NextAuth) with credentials provider (email + password)
- Session cookie; middleware protects all `/learn`, `/sessions`, `/api/*` routes
- Onboarding redirect: if user has no `LearnerProfile`, always redirect to `/onboarding`

### Profile Service (`lib/services/profile.ts`)
- `getProfile(userId)` — load LearnerProfile with recent MemoryItems and SkillProgress
- `createProfile(userId, data)` — onboarding form submission
- `updateProfile(profileId, data)` — future use

### Session Service (`lib/services/session.ts`)
- `startSession(profileId, language)` — creates Session row, calls SessionOrchestrator to generate arc
- `getSession(sessionId)` — loads session with all messages and StoryState
- `listSessions(profileId)` — returns sessions sorted by startedAt desc
- `addMessage(sessionId, role, content, imageUrl?)` — persists a message with correct orderIndex
- `completeSession(sessionId)` — sets status=COMPLETED, completedAt, triggers memory extraction

### Memory Service (`lib/services/memory.ts`)
- `getRelevantMemory(profileId, limit?)` — loads top N MemoryItems by recency/confidence
- `upsertMemoryItems(profileId, items[])` — write extracted items, dedup/merge by type+content similarity
- `upsertSkillProgress(profileId, skills[])` — merge skill level estimates
- `getSkillProgress(profileId, language)` — load current skill map

---

## 5. Session UI Design

### Layout (`/learn/[sessionId]`)

```
┌──────────────────────────────────────────────────────────┐
│  [Primer logo]         [Leave Session ×]                 │
├──────────────────────────────────────────────────────────┤
│                                                          │
│   ┌────────────────────────────────────────────────┐    │
│   │                                                │    │
│   │         SCENE IMAGE (AI-generated)             │    │
│   │         ~400px tall, full width panel          │    │
│   │                                                │    │
│   └────────────────────────────────────────────────┘    │
│                                                          │
│   ┌────────────────────────────────────────────────┐    │
│   │  Story cards + dialogue scroll area            │    │
│   │                                                │    │
│   │  [ASSISTANT]  Narrative text / story card...   │    │
│   │                                                │    │
│   │                   [USER]  User response bubble │    │
│   │                                                │    │
│   │  [ASSISTANT]  Explanation / next scene card... │    │
│   │                                                │    │
│   └────────────────────────────────────────────────┘    │
│                                                          │
│   ┌────────────────────────────────────────────────┐    │
│   │  Type your response...              [Send →]   │    │
│   └────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
```

### Scene Image Behavior
- When AI calls `generate_scene_image`, the image appears in the top panel
- Image persists until the next `generate_scene_image` call replaces it
- Loading state: subtle animated placeholder in the panel while generating
- Image does NOT appear inline in the message scroll area — only in the fixed top panel

### Message Rendering
- **User messages:** right-aligned chat bubble, minimal styling
- **Assistant messages:** left-aligned story card — slightly styled panel (not a plain bubble), supports markdown. Rendered with a warm, book-like aesthetic.
- Scroll to bottom on new message

### Leave Session
- "×" button in top right
- Triggers: confirm dialog → POST `/api/session/[id]/complete` → redirect to `/sessions`
- `beforeunload` event also fires the complete endpoint (best-effort, uses `navigator.sendBeacon`)

---

## 6. AI Orchestration Modules

### Module: ContextBuilder (`lib/ai/contextBuilder.ts`)

Assembles the full prompt context for a session turn. Returns a structured object, not raw strings.

```typescript
interface SessionContext {
  systemPrompt: string      // static instructions + learner profile
  memoryBlock: string       // formatted relevant MemoryItems
  storyBlock: string        // current StoryState summary
  messages: {role, content}[] // session messages (trimmed to fit context)
}
```

**System prompt includes:**
- Role definition: "You are Primer, a personal language learning companion..."
- Learner profile: language, level, goals, interests
- Pedagogical instructions: teach through story and dialogue, correct naturally, adjust difficulty
- Language-specific instructions (Spanish vs Chinese rendering, pinyin handling, etc.)
- Image tool usage instructions: "Call generate_scene_image when a new scene begins or the setting changes significantly. Do not call it for every message."
- Formatting guidance: use narrative prose and dialogue, not bullet points

### Module: SessionOrchestrator (`lib/ai/sessionOrchestrator.ts`)

Handles the live session message loop.

```typescript
// Arc generation (called once at session start)
async function generateSessionArc(context: SessionContext): Promise<{ arcName: string, openingScene: string }>

// Message response (called per user message)
async function generateResponse(
  context: SessionContext,
  userMessage: string
): AsyncGenerator<StreamChunk>  // streams back to client

type StreamChunk =
  | { type: "text"; content: string }
  | { type: "image_start" }           // image generation in progress
  | { type: "image_done"; url: string }
  | { type: "done" }
```

**Tool definition (passed to Claude):**
```typescript
const generateSceneImageTool = {
  name: "generate_scene_image",
  description: "Generate an image for the current scene. Call this when a new scene begins, the setting changes, or a visually significant moment occurs. Do not call for every message.",
  input_schema: {
    type: "object",
    properties: {
      prompt: {
        type: "string",
        description: "A detailed visual description of the scene for image generation. Style: graphic novel, painterly, warm colors."
      },
      alt_text: {
        type: "string",
        description: "Brief accessible description of the image."
      }
    },
    required: ["prompt", "alt_text"]
  }
}
```

**Tool execution:**
When Claude returns a `generate_scene_image` tool use block:
1. Stream `{ type: "image_start" }` to client (show loading state in panel)
2. Call OpenAI `gpt-image-1-mini` with the prompt
3. Store returned image URL on the Message row
4. Stream `{ type: "image_done", url }` to client
5. Continue streaming Claude's text response

### Module: ImageTool (`lib/ai/imageTool.ts`)

```typescript
async function generateSceneImage(prompt: string): Promise<string>
// calls OpenAI images.generate, returns URL
// model: "gpt-image-1-mini"
// size: "1792x1024" (landscape, graphic novel aspect ratio)
// style: injected into prompt: "graphic novel illustration, painterly, warm light"
```

### Module: MemoryExtractor (`lib/ai/memoryExtractor.ts`)

Called once after session ends. Makes a single LLM call (not streamed) that reads the full session transcript and returns structured memory updates.

**Input:** full session messages + existing MemoryItems (for dedup context)

**Output schema (enforced via JSON mode or structured output):**
```typescript
interface ExtractionResult {
  memoryItems: {
    type: MemoryType
    content: string
    confidence: number  // 0.0–1.0
  }[]
  skillUpdates: {
    skillName: string
    language: Language
    estimatedLevel: number  // 0.0–1.0
    confidence: number
  }[]
  storyUpdate: {
    arcName: string
    currentState: string             // narrative summary of where story ended
    recurringCharacters: { name: string; description: string }[]
    activeThemes: string[]
  }
  sessionSummary: string             // 2–3 sentence summary stored on Session row
}
```

**Extraction prompt:** instructs Claude to act as a learning analyst reviewing the session, identifying vocabulary gaps, recurring mistakes, interests revealed, confidence signals, and narrative state. Structured output enforced.

---

## 7. Memory System Design

### Four Layers

| Layer | What | Where | When loaded |
|---|---|---|---|
| Short-term | Current session messages | `Message` table | Every turn (trimmed to ~20 messages if long) |
| Medium-term | Arc summary from last 3 sessions | `Session.arcSummary` | Session start |
| Durable | Extracted MemoryItems | `MemoryItem` table | Session start (top 20 by recency/confidence) |
| Narrative | StoryState | `StoryState` table | Session start |

### Context Window Strategy
- Load top 20 MemoryItems (most recent + highest confidence)
- Load last 3 session summaries
- Load full current session messages up to the last ~20 exchanges; older messages are summarized
- If context grows very large, drop oldest session messages first (they're already summarized)
- Never drop MemoryItems or StoryState from context

### Memory Extraction Timing
- **Primary:** POST to `/api/session/[id]/complete` when user clicks "Leave Session"
- **Fallback:** `navigator.sendBeacon('/api/session/[id]/complete', ...)` on `beforeunload`
- If extraction fails silently (beacon case), session is marked `ABANDONED` not `COMPLETED`; extraction can be retried
- No mid-session checkpoints in V1 (deferred)

### Deduplication Strategy
- On upsert, check for existing MemoryItems of same `type` + similar `content` (string match for V1; vector similarity deferred)
- If near-duplicate found, update `confidence` and `updatedAt` rather than inserting duplicate
- Items with confidence < 0.2 after multiple contradictions can be soft-deleted

---

## 8. What to Defer (Post-V1)

| Feature | Why deferred |
|---|---|
| Dashboard / progress view | Session loop must be proven first |
| Mid-session memory checkpoints | After-session extraction is sufficient to start |
| Learner control over tone/difficulty | V1 lets AI decide; deferred per product decision |
| Voice input / audio | UI complexity; defer until session loop is solid |
| Video generation | Scope; image is enough for V1 |
| Web search tool | Not needed for language learning core loop |
| Vector search for memory retrieval | Relational is sufficient for V1 scale |
| Multiple learner profiles per account | Single profile per user for V1 |
| Child mode / parent dashboard | Post-V1 expansion track |
| Spaced repetition system | Noted as nice-to-have; defer |
| External resource suggestions | Defer |
| Payment / subscription | No gate in V1 |
| Formal assessments / certificates | Post-V1 |

---

## 9. Implementation Milestones

### Milestone 1 — Foundation (2–3 days)
- [ ] Scaffold Next.js App Router project (TypeScript, Tailwind, shadcn/ui)
- [ ] Configure Prisma + local Postgres; run initial migration
- [ ] Auth.js with credentials provider (email + password)
- [ ] Middleware: protect `/learn`, `/sessions`, `/api/profile`, `/api/session/*`
- [ ] Onboarding redirect: if no LearnerProfile → `/onboarding`
- [ ] Basic layout shell (header, nav)

**Done when:** can register, log in, and be redirected to onboarding.

---

### Milestone 2 — Onboarding (1–2 days)
- [ ] `/onboarding` multi-step form: language → level → goals → interests
- [ ] `POST /api/profile` creates LearnerProfile, redirects to `/learn`
- [ ] Guard: skip onboarding if profile already exists

**Done when:** new user can complete onboarding and reach `/learn`.

---

### Milestone 3 — Session Start + Basic AI Loop (3–4 days)
- [ ] `POST /api/session/start` — creates Session, calls `generateSessionArc`, saves arc name
- [ ] `/learn/[sessionId]` page renders session shell (image panel, scroll area, input)
- [ ] `ContextBuilder` — assembles system prompt from LearnerProfile + MemoryItems + StoryState
- [ ] `SessionOrchestrator.generateResponse` — calls Claude, streams text back
- [ ] Streaming response renders in UI (assistant message cards)
- [ ] User message submits, bubbles appear, triggers AI call

**Done when:** can have a full back-and-forth learning conversation (no images yet).

---

### Milestone 4 — Image Generation Tool (2 days)
- [ ] `ImageTool` — calls `gpt-image-1-mini`, returns URL
- [ ] Tool definition passed to Claude; tool use blocks handled in stream processor
- [ ] Stream processor: on tool use → call ImageTool → stream `image_start` / `image_done`
- [ ] Scene panel: shows loading state on `image_start`, renders image on `image_done`
- [ ] Image URL stored on Message row

**Done when:** AI generates images at scene transitions and they appear in the top panel.

---

### Milestone 5 — Memory Extraction (2 days)
- [ ] `MemoryExtractor` module — structured LLM call, returns `ExtractionResult`
- [ ] `POST /api/session/[id]/complete` — runs extractor, persists MemoryItems + SkillProgress + StoryState, marks session COMPLETED
- [ ] Leave Session button → confirm dialog → POST complete → redirect to `/sessions`
- [ ] `beforeunload` → `navigator.sendBeacon` to complete endpoint
- [ ] Verify extracted memory is injected into ContextBuilder on next session

**Done when:** leaving a session persists structured memory; next session feels informed by the prior one.

---

### Milestone 6 — Session History + Resume (1–2 days)
- [ ] `/sessions` page — lists sessions with arc name, language, date, status
- [ ] Resume link loads `/learn/[sessionId]` with existing messages + StoryState pre-loaded
- [ ] ContextBuilder uses prior session summaries (last 3) in medium-term memory block
- [ ] `/learn` (no ID) always starts a fresh session

**Done when:** can resume a prior session and Primer continues the story with full context.

---

### Milestone 7 — Polish + Dogfooding (ongoing)
- [ ] Premium visual design: warm palette, graphic novel typography, polished cards
- [ ] Loading skeletons, error boundaries, empty states
- [ ] Mobile layout (single-column: image top, scroll area, input)
- [ ] Spanish language: verify Spanish rendering, accent character input, corrections
- [ ] Chinese language: verify Pinyin rendering, character display, tone guidance
- [ ] Verify memory accumulates meaningfully across 5+ sessions (founder dogfooding)
- [ ] Prompt tuning: story quality, natural corrections, image trigger frequency

**Done when:** founder uses it daily and it feels like a real product.

---

## 10. File / Module Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── onboarding/page.tsx
│   ├── learn/
│   │   ├── page.tsx                  # starts new session, redirects
│   │   └── [sessionId]/page.tsx      # main session screen
│   ├── sessions/page.tsx             # history list
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── profile/route.ts
│       ├── session/
│       │   ├── start/route.ts
│       │   └── [id]/
│       │       ├── route.ts           # GET session
│       │       ├── message/route.ts   # POST message (streaming)
│       │       └── complete/route.ts  # POST complete + extract
│       └── sessions/route.ts          # GET list
│
├── lib/
│   ├── ai/
│   │   ├── contextBuilder.ts
│   │   ├── sessionOrchestrator.ts
│   │   ├── imageTool.ts
│   │   └── memoryExtractor.ts
│   ├── services/
│   │   ├── profile.ts
│   │   ├── session.ts
│   │   └── memory.ts
│   ├── db/
│   │   └── prisma.ts                 # singleton Prisma client
│   └── types/
│       └── index.ts                  # shared TypeScript types
│
├── components/
│   ├── session/
│   │   ├── ScenePanel.tsx            # top image panel
│   │   ├── MessageList.tsx           # scrollable message area
│   │   ├── MessageCard.tsx           # assistant story card
│   │   ├── UserBubble.tsx            # user message bubble
│   │   └── InputBar.tsx              # text input + send button
│   ├── onboarding/
│   │   └── OnboardingForm.tsx
│   └── ui/                           # shadcn/ui components
│
└── prisma/
    └── schema.prisma
```

---

## 11. Environment Variables Needed

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=

ANTHROPIC_API_KEY=      # Claude (main LLM)
OPENAI_API_KEY=         # gpt-image-1-mini (images only)
```
