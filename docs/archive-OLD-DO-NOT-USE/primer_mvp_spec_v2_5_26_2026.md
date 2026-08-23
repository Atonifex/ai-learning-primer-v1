# Primer — MVP Specification & Roadmap - HISTORICAL DO NOT IMPLEMENT THIS!
**Version:** 1.3 — Merged Implementation-Ready Document
**Status:** Pre-implementation — ready for Claude Code agent execution
**Audience:** AI coding agents (Cursor / Claude Code) + product owner
**Scope:** Current fractured state → shippable Grade 3 homeschool MVP

---

## 1. Vision & Competitive Moat

Primer's job is to be the first learning product that makes a kid feel like they're *inside* one continuous story that happens to require math, reading, science, and social studies to advance — not four separate subject apps in a costume.

The competitive gap is real:

| Platform | Strength | Missing |
|----------|----------|---------|
| Khanmigo | Socratic questioning, 2M users, safe | Chatbot UI, no narrative continuity, no persistent memory |
| Synthesis Tutor | K-5 math, warm UX, multisensory | No arc structure, no cross-session memory |
| Prodigy Math | MMORPG hooks, 50M registered users | Math battles are *disconnected* from story; predatory freemium |
| Duolingo | Streak mechanics, habit loops | Gamification is cosmetic, no coherent narrative |
| DreamBox | Genuinely adaptive math engine | No story, dated UX, institutional |

**Primer's moat is the combination nobody has shipped:**
- One story arc across all core subjects — the shipwreck, the crew, the camp, the rebuild
- Story that *is* the curriculum — each subject is a lens on the same plot, not a separate world
- Structured memory that makes session 4 feel like chapter 4 of a book
- A hidden coherence map maintaining instructional rigor beneath an immersive surface
- An interface that looks like a premium graphic novel, not a worksheet in a wizard hat

---

## 2. Non-Negotiable Design Principles

Every implementation decision gets tested against these. If a feature doesn't serve at least one, cut it.

**1. Agency over automation.** Kids drive. Every meaningful choice — even small story branches — beats passive consumption. Gee's Active Control: the learner must feel like an agent.

**2. Intrinsic before extrinsic.** Badges and streaks reinforce; they don't motivate. The primary pull is narrative tension. The kid needs to want to know what happens next on the island — and whether the crew makes it home.

**3. Desirable difficulty, invisibly applied.** Retrieval practice, interleaving, and spaced repetition are the highest-ROI learning strategies (Bjork, Rawson & Dunlosky 2013). Build them into session structure so the learner doesn't know they're being tested while being tested.

**4. The forgetting curve is a narrative asset.** Returning learners reconstruct understanding before receiving new information. "Rho found your old captain's log pages..." is retrieval practice dressed as story continuity.

**5. Wrong answers have story consequences, not dead ends.** The story world is a safe space to be wrong (Gee's Psychosocial Moratorium). Incorrect answers generate interesting narrative branches, not error states.

**6. Every interaction earns its place.** No filler. If an activity doesn't build toward a skill, a memory record, or a narrative beat, it gets cut.

**7. The system infers pace — it never asks for it.** Difficulty calibration comes from what the learner actually does: attempt counts, `MISCONCEPTION` memory items, mastery scores, time-on-task. A one-time self-assessment at onboarding is weaker signal than the first three minutes of a session. No stored pace field. No pace picker.

**8. Multi-disciplinary interleaving curriculum** Math, ELA, science, and social studies share the same `StoryWorld`, `StoryArc`, and chapter progression, teaching multiple subjects and standards can be taught alongside each other - i.e. science adventures can teach measurements and mathematics, while stories can also have English comprehension and writing tests. A session has one *instructional focus* (subject slug) but always advances the *same* story. 

---

## 3. Product Decisions (Locked)

These are not up for debate during implementation:

| Decision | Value |
|----------|-------|
| Primary audience (MVP) | Homeschool families, Grade 3 |
| Subjects enrolled at onboarding | All four core: `math_g3`, `ela_g3`, `science_g3`, `social_studies_g3` (auto-enrolled, not user-selected) |
| First session default | `math_g3` — first instructional lens on the shared arc **"The Mapmaker's Expedition"** (all four subjects use this same story) |
| Story architecture | **One** `StoryWorld` + **one** `StoryArc` + **six** shared `Chapter`s for Grade 3 core; subjects differ by standards catalog + prompt template + activity pool, not by plot |
| World language (ES/ZH) | Deferred to Phase 6 — schema preserved, not removed |
| Subject selection at onboarding | Not exposed to user — all four enroll automatically |
| Onboarding data collected | Name (optional), goals, interests |
| Difficulty / pace | Inferred from session performance — never a stored field or onboarding input |
| Grade band | Hardcoded `"3"` for MVP; schema supports expansion |

**Why auto-enroll all four subjects:** Asking an 8-year-old (or their parent) to pick one subject creates friction and false scarcity. The product enrolls everything in the **same** shipwreck arc and lets the learner start with math as the first lens. Subject switching changes *how* the captain works on today's problem — not *where* they are in the story. Chapter number and narrative memory are shared across subjects.

**Why one arc, not four:** Separate arcs ("mystery town" for ELA, "weather watchers" for science) break continuity and waste the moat. The castaway island is the curriculum container; each subject contributes skills the crew needs to survive.

**Why no pace picker:** A chip the parent clicks during signup is far weaker signal than `SkillProgress` mastery scores and `MemoryItem` misconception patterns after one session. Storing a pace preference introduces a second difficulty signal that can contradict observed performance — and the observed data always wins. Let the system infer it.

---

## 4. The MVP Arc: "The Mapmaker's Expedition" (Grade 3 — All Core Subjects)

> **Architectural rule:** There is exactly **one** story arc for MVP Grade 3. `math_g3`, `ela_g3`, `science_g3`, and `social_studies_g3` are **instructional lenses** on the same six chapters — not separate plots, worlds, or companions.

### Anchor Story (Shared by All Subjects)

**Cast:** The learner is the protagonist — addressed by `displayName` from onboarding (the ship's captain / lead scout). **Rho** is their loyal sidekick: quick with tools, nervous about heights, always ready with a joke when morale dips.

> *You and Rho were Guild scouts. Your crew came to this island to find out what resources might be worth reporting back — timber, metals, fresh water, safe harbors, anything the Cartographers' Guild would care about. Then your ship crashed on the shore. The crew is scattered. Before you can report to the Guild, you have to find everyone, build a camp strong enough to survive the storms and dangerous animals, and rebuild your vessel. Rho stays at your side. Whether you're measuring wreckage, reading a torn manifest, testing if water is safe to drink, or deciding how the camp should govern itself — it's all the same expedition. Get it wrong and someone doesn't make it through the week. Get it right and you're one step closer to sailing home.*

**What the learner does not know yet (do not reveal in MVP):** This island is on another planet. A much larger landmass rises across the water — where the real civilization lives. That discovery belongs to a later story arc. In the distant future of this world bible, the captain who survives this island becomes space-faring.

**MVP story spine (three acts → six chapters):**
1. **Recover the crew** — locate scattered survivors and account for everyone
2. **Survive and build** — establish a small village: shelter, water, food, trade
3. **Rebuild and report** — reconstruct the ship and compile the Guild resource report

This arc works because:
- One plot gives cross-session memory real weight — "last time at the trade post" means the same place whether the last session was math or reading
- Survival + rescue stakes are universally appealing to 8–10 year olds
- The learner *is* the hero — maximum agency (Principle 1); Rho is the persistent sidekick across **all** subjects
- Each subject's Grade 3 standards map onto the **same** survival beats (see per-chapter lenses below)

### Data Model — One Arc, Subject Lenses

| Entity | Cardinality (MVP G3) | Notes |
|--------|----------------------|-------|
| `StoryWorld` | 1 ("Guild Castaway Isles" or similar) | World bible: crash, Guild, hidden exoplanet (unrevealed), Rho, captain = learner |
| `StoryArc` | 1 ("The Mapmaker's Expedition") | Linked to world; **not** per subject |
| `Chapter` | 6 (shared) | Same titles, beats, scene art; `plannerJson` holds **per-subject** standard bundles |
| `StoryState` | 1 per learner (per arc) | `currentChapterNumber` advances once for the story — not four independent chapter tracks |
| `LearningSession` | many | Each session has one `subjectSlug` (instructional lens) but references the shared chapter |
| `LearningActivity` | many | Tagged `chapterTag: "g3_ch3"` + `subjectSlug`; same chapter, different skill targets |
| `StandardsCatalog` | 4 (one per subject) | Math / ELA / Science / SS codes — all sessions in Ch3 still *narratively* at Search Parties |

**`ensureLearnerStoryChain`:** Creates one world + one arc + chapter 1 for new profiles. All four `LearnerSubject` rows point at the same narrative state.

### Chapter Structure — 6 Shared Chapters, ~18 Sessions per Subject Lens

Each chapter has **one story beat** and **four instructional lenses**. Sessions default to a single lens (e.g. math); the beat and location stay fixed.

| # | Chapter Title | Shared Story Beat | Math (`math_g3`) | ELA (`ela_g3`) | Science (`science_g3`) | Social Studies (`social_studies_g3`) |
|---|---------------|-------------------|------------------|----------------|------------------------|--------------------------------------|
| 1 | The Wreck | Ship down; survey the beach; account for crew and cargo | Measure hull debris, units, estimation | Read torn Guild briefing; write first captain's log entry | Classify salvage; observe tide/water at landing site | Read crew manifest; assign roles; decide search priorities |
| 2 | Divide the Supplies | Rations before anyone goes inland | Equal groups, fractions ½ ⅓ ¼ | Read ration rules; persuade a crew member in dialogue | Which stores spoil first; safe storage | Fair division; who decides for the group |
| 3 | Search Parties | Teams scour inland for missing crew | Multiplication, arrays, search grids | Read trail journals / signs left by crew | Habitat clues, animal signs, weather on the trail | Search-party rules; camp governance while away |
| 4 | Camp Quartermaster | Raise the village; trade for materials | Fractions on number line, material budgets | Write trade proposals; comprehend trader notes | Water safety, plant ID, shelter materials | Barter agreements; draft camp charter |
| 5 | Storm Watch | Storm threatens camp; protect everyone | Bar graphs, scaled picture graphs | Read almanac excerpts; write storm bulletin for crew | Weather patterns, forces, prediction from data | Emergency protocols; leadership under pressure |
| 6 | Hull Blueprints | Rebuild ship; compile Guild resource report | Multi-step synthesis, justification | Final Guild report narrative; cite evidence from log | Materials for hull repair; test strength/fit | Resource report to Guild; civic duty to crew & Guild |

**Phasing (content volume):** P0–P1 prioritize **math** activities + prompts (30 hand-authored). ELA / science / SS use the **same chapter tags and story beats** with subject-aware prompts and Tier-3 activities until dedicated activity seeds land (target: 5 activities × 6 chapters × 4 subjects = 120, same `g3_chN` tags).

### Cross-Subject Integration — How It Works in Product

**1. Shared narrative state (non-negotiable)**  
- `StoryState.currentChapterNumber` is global for the arc — finishing Ch2 in math means ELA opens at Ch2, not Ch1.  
- `STORY_BEAT` memory items are **subject-agnostic** ("We found Bosun Mara near the creek").  
- `MISCONCEPTION` / `STRENGTH` items stay subject-tagged for standards and difficulty.

**2. Captain's log as cross-subject artifact**  
- Culminating writes from ELA sessions populate a running **expedition log** the AI references in math/science/SS.  
- Math sessions produce **data tables**; ELA sessions produce **paragraphs**; science produces **observation notes** — all cited in Ch6's Guild report.

**3. Session open bridges subjects**  
- Template: *"[displayName], you're back at [chapter location]. Last time we [last STORY_BEAT]. Rho says the crew still needs help with [today's subject task]..."*  
- If last session was a different subject: *"You sorted the rations yesterday. Today the Guild manifest has a section we couldn't read..."*

**4. Optional "Expedition Day" (Phase 2+, not P0)**  
- One longer session or a suggested sequence: 15 min math → 15 min ELA on the **same scene** (e.g. trade post).  
- UI shows one scene image; activities switch lens mid-session.  
- Strongest integration; implement after single-lens sessions are stable.

**5. Journey map — one path, four skill tracks**  
- `/progress/journey`: single island path with 6 chapter nodes.  
- Each node shows four small progress indicators (math / reading / science / SS) for that chapter's standards — not four separate maps.

**6. Wrong answers stay in-world**  
- A math mistake might mean rations run short → ELA scene where a hungry crew member confronts the captain.  
- An ELA misread might send search parties the wrong way → math scene recalculating grid coordinates.

**7. Prompt template stack**  
```
[Shared world bible block — crash, crew, Guild, Rho, captain name, do NOT reveal exoplanet]
[Subject template — math Socratic / ELA evidence / science phenomenon / SS civic]
[Shared chapter coherence map — anchor Q + investigation Qs for THIS chapter]
[Subject standards block — MA.3.* vs LA.3.* etc.]
[Cross-subject memory — STORY_BEAT + last session subject + captain's log excerpts]
```

**8. Concrete cross-links by chapter (authoring checklist)**

| Chapter | Integration beat |
|---------|------------------|
| 1 | Measurements from math feed the log entry ELA writes; science classifies the same salvage pile |
| 2 | Math ration totals must match ELA dialogue choices ("each person gets ___") |
| 3 | Search grid from math aligns with ELA journal clues and science habitat map |
| 4 | Camp charter (SS) references fraction budgets (math) and water-test results (science) |
| 5 | Storm graph (math) is the data behind ELA bulletin and science "why it floods here" |
| 6 | Guild report pulls **evidence** from all four lenses — the capstone is explicitly multi-subject |

### Subject Prompt Personas (Same World, Different Pedagogy)

| Subject | AI stance (in-world) | Never |
|---------|----------------------|-------|
| `math_g3` | Socratic guide through measurement, quantity, data | Invent a new island or separate plot |
| `ela_g3` | Help the captain read, infer, write for crew & Guild | Start a unrelated mystery in another town |
| `science_g3` | Investigate phenomena on **this** island | Detach to abstract textbook chapter |
| `social_studies_g3` | Facilitate crew decisions, fairness, governance | Replace learner as captain |

### Coherence Map Per Chapter (Populates `plannerJson`)

Every chapter must be authored with this structure in the DB:

```
AnchorQuestion
  → ChapterQuestion[]
      → InvestigationQuestion[]
          → EvidenceExperience[] (dialogue / activity / visual / writing)
      → KeyConceptTags[]
  → CulminatingTask (narrative application)
```

**Chapter 1 example (`Chapter.plannerJson` — shared narrative + per-subject bundles):**
```json
{
  "sharedBeat": "Ship down; survey beach; account for crew and cargo",
  "anchorQuestion": "How do we assess the wreck and know what we have to work with?",
  "chapterQuestion": "What do we need to know before anyone leaves this beach?",
  "investigationQuestions": [
    "What can we measure or observe about the wreck and shoreline?",
    "What does the crew need to survive the first night?",
    "What must we record so the Guild will trust our report later?"
  ],
  "subjectPlans": {
    "math_g3": {
      "investigationQuestions": ["Which unit fits this measurement?", "How close is our estimate?"],
      "targetStandardCodes": ["MA.3.M.1.1", "MA.3.M.1.2"],
      "evidenceExperiences": ["unit_sort_game", "estimation_challenge"],
      "culminatingTask": "Complete wreck measurement table for the captain's log."
    },
    "ela_g3": {
      "targetStandardCodes": ["LA.3.RL.1.3", "LA.3.W.2.5"],
      "evidenceExperiences": ["read_guild_briefing", "journal_prompt_distress_log"],
      "culminatingTask": "Write the first captain's log page — what happened and what we need."
    },
    "science_g3": { "targetStandardCodes": ["..."] },
    "social_studies_g3": { "targetStandardCodes": ["..."] }
  }
}
```

---

## 5. Current State Assessment

Run this baseline test pass before writing any code. Document failures — they define the P0 build list.

| # | Check | Pass Criteria |
|---|-------|---------------|
| 0.1 | Register → onboarding → first session | Lands on `/learn/[id]`, `__start__` fires |
| 0.2 | Standards tools | Model records observations with valid ELA codes for `ela_g3` session |
| 0.3 | Progress | `/progress` shows 4 subjects after seed; mastery updates after tool use |
| 0.4 | Leave / resume | Session completes, `/sessions` lists it, resume works |
| 0.5 | Document failures | Wrong standard codes, language prompt mismatch, empty progress |

**Known failures (do not re-test, just fix):**
- Onboarding still shows `Spanish | Chinese` — no grade or subject
- `contextBuilder.ts` never queries the `Standard` table — model hallucinates codes
- System prompt is written for a language tutor — math learners get Pinyin guidance
- `startSession` hardcodes `ela_g3` regardless of what the user did in onboarding
- Zero `LearnerSubject` rows ever get written

---

## 6. Implementation Phases

---

### Phase 0 — Baseline Test
**Goal:** Document exactly what works before touching code.

- [ ] Fresh DB: migrate + `npm run db:seed`
- [ ] Run checks 0.1–0.5 above
- [ ] Note every tool error, wrong code, prompt mismatch

---

### Phase 1 — Foundation Repair (P0)
**Goal:** Register → Grade 3 Math onboarding → coherent first math session. Every system consistent with `math_g3`.

**Exit criterion:** New user completes onboarding → DB has 4 `LearnerSubject` rows → first session is `math_g3` → AI uses Grade 3 Math persona + real `MA.3.*` standard codes.

#### 1.1 — Prisma Schema Migration

File: `prisma/schema.prisma`

Add to `LearnerProfile`:
```prisma
displayName        String?   // learner name/nickname for prompts + UI
gradeBand          String    @default("3")
primarySubjectSlug String    @default("math_g3")
```

New model:
```prisma
model ReviewItem {
  id             String         @id @default(cuid())
  learnerId      String
  standardCode   String
  conceptSummary String
  nextReviewAt   DateTime
  timesReviewed  Int            @default(0)
  lastScore      Float?
  createdAt      DateTime       @default(now())
  learner        LearnerProfile @relation(fields: [learnerId], references: [id])
}
```

- Make `activeLanguage` optional (`Language?`) — preserved for Phase 6 world language return
- Do NOT drop `Language` enum
- Do NOT add any pace/difficulty enum — difficulty is inferred from session performance, not stored
- Migration includes backfill: set `gradeBand="3"`, `primarySubjectSlug="math_g3"` for existing rows

#### 1.2 — Subject Slug Constants

New file: `lib/constants/subjects.ts`
```typescript
export const GRADE_3_CORE_SUBJECT_SLUGS = [
  "math_g3",
  "ela_g3",
  "science_g3",
  "social_studies_g3",
] as const;

export type Grade3SubjectSlug = typeof GRADE_3_CORE_SUBJECT_SLUGS[number];
export const DEFAULT_PRIMARY_SUBJECT_SLUG = "math_g3";
```

This constant is the single source of truth for onboarding enrollment, session start, and seed alignment. Never hardcode these slugs elsewhere.

#### 1.3 — Profile Service: Transactional Onboarding

Files: `lib/services/profile.ts`, new `lib/services/learnerSubjects.ts`

`createProfile(userId, data)` becomes one Prisma transaction:
1. `learnerProfile.create` with new fields (`activeLanguage: null`)
2. Load all subjects where slug is in `GRADE_3_CORE_SUBJECT_SLUGS`
3. `learnerSubject.createMany` with `status: ACTIVE` (idempotent — skip if exists)
4. Call `ensureLearnerStoryChain(profileId)` — creates **one** shared world/arc/chapter (not per subject)

`getProfile` joins `learnerSubjects` + `subject` for the full enrolled list.

`hasProfile(userId)` — used by route guards.

**Idempotency:** If profile already exists, `createProfile` throws `ProfileAlreadyExists`. The API returns 409. The onboarding page catches this and redirects to `/learn`.

Extend `LearnerProfileData` in `lib/types/index.ts`:
```typescript
interface LearnerProfileData {
  id: string;
  displayName?: string;
  gradeBand: string;
  primarySubjectSlug: string;
  goals: string;
  interests: string[];
  activeLanguage?: string | null;  // null for G3 core, set for world language
  enrolledSubjects: EnrolledSubject[];
}

interface EnrolledSubject {
  slug: string;
  displayName: string;
  domain: string;
  status: "ACTIVE" | "PAUSED";
}
```

#### 1.4 — API Route: Profile

File: `app/api/profile/route.ts`

| Method | Behavior |
|--------|----------|
| GET | Returns `{ profile }` with enrolled subjects; 401 if anonymous |
| POST | Body: `{ displayName?, goals, interests[], primarySubjectSlug? }`. Validates `goals` non-empty. No `activeLanguage`, `currentLevel`, or `pace` in body. Returns 409 if profile exists. |
| PATCH | (Add in Phase 2) Updates `primarySubjectSlug` for subject switching |

#### 1.5 — Onboarding Wizard UI

Files: `app/onboarding/page.tsx` (server wrapper), new `components/onboarding/OnboardingWizard.tsx`

Server component: `getCurrentUser` + `getProfile`; if profile exists → `redirect("/learn")`.

Client wizard — **4 steps** (pace step removed):

| Step | Content | Stored field |
|------|---------|-------------|
| 1 | Welcome — "Set up your Grade 3 learning journey" + optional learner name | `displayName` |
| 2 | Goals — textarea, required, placeholder "What do you want to learn this year?" | `goals` |
| 3 | Interests — chip multi-select. Include: Animals, Space, Sports, Art, Cooking, History, Mysteries, Robots, Ocean, Music | `interests[]` |
| 4 | Confirmation — "Your subjects are ready" — read-only card listing Math, Reading, Science, Social Studies. CTA: "Begin the expedition" (learner is captain; Rho is waiting at the wreck) | (no input) |

- Remove ALL language/level/pace copy
- POST on finish → `/api/profile` → `router.push("/learn")` + `router.refresh()`
- Progress dots, accessible labels, inline error states
- Consistent with existing amber/stone design system

#### 1.6 — Session Start: Use Profile Subject

Files: `lib/services/session.ts`, `app/learn/page.tsx`, `app/api/session/start/route.ts`

Change signature:
```typescript
startSession(profileId: string, subjectSlug: string): Promise<string>
```

- Resolve `subjectId` from `subjectSlug` — fail loudly in dev if not found (seed required)
- `targetLanguage: null` on session (until Phase 6)
- Remove dependency on `getOrCreateDefaultSubject` for new sessions

`app/learn/page.tsx`:
```typescript
const profile = await getProfile(user.userId);
const sessionId = await startSession(profile.id, profile.primarySubjectSlug);
```

#### 1.7 — Story Tags Without Language or Pace

Files: `lib/story/focusTags.ts`, `lib/services/storyCurriculum.ts`

Replace `ArcFocusInput.language` with:
```typescript
interface ArcFocusInput {
  gradeBand: string;
  primarySubjectSlug: string;
  interests: string[];
}
```

Tags become: `subject:math_g3`, `grade:3`, `interest:space` — not `lang:spanish`, not `pace:steady`.
Difficulty calibration belongs in the AI prompt and SkillProgress logic, not in arc tags.

#### 1.8 — Subject-Aware System Prompt

File: `lib/ai/contextBuilder.ts`

Replace language-tutor block with subject-aware composition:

```typescript
async function buildSystemPrompt(session: Session, profile: LearnerProfile) {
  const template  = await getPromptTemplate(profile.primarySubjectSlug)
  const standards = await getStandardsForSubject(profile.primarySubjectSlug)
  const memories  = await getRecentMemories(profile.id, 5)
  const chapter   = await getCurrentChapter(session.id)

  return [
    sharedWorldBibleBlock,              // ← NEW: one castaway arc for all G3 core subjects
    template.basePrompt,                // subject lens only (math / ELA / science / SS)
    formatLearnerBlock(profile),
    formatStandardsBlock(standards),    // valid codes for session's subjectSlug
    formatMemoryBlock(memories),        // STORY_BEAT cross-subject + subject-tagged items
    formatCoherenceMapBlock(chapter, session.subjectSlug),  // shared beat + subjectPlans slice
    template.pedagogyInstructions,
  ].join('\n\n')
}
```

Note: `formatLearnerBlock` does NOT include a pace field. The pedagogy instructions in each template tell the AI to calibrate difficulty based on observed `SkillProgress` and `MemoryItem` misconception patterns.

Create `lib/ai/promptTemplates/` directory:
```
promptTemplates/
  _shared_castaway_world.ts   ← SINGLE world bible: crash, Guild, crew, Rho, captain — imported by all G3 core templates
  math_g3.ts                  ← Socratic math lens on current shared chapter
  ela_g3.ts                   ← Reading/writing lens — same chapter, captain's log
  science_g3.ts                 ← Phenomenon investigation on this island
  social_studies_g3.ts        ← Crew governance & Guild civic lens
  language_es.ts                ← Original language tutor (preserved, inactive)
```

Each G3 core template defines:
- AI persona + voice (warm, curious, never condescending, Grade 3 vocabulary)
- Pedagogical stance (Socratic for math; evidence-gathering for science)
- Difficulty calibration instruction: *"Start at grade level. Observe the learner's responses. If they answer confidently and correctly, increase challenge. If they show uncertainty or misconceptions (see memory block), scaffold more heavily. Never ask the learner how hard they want it to be — infer it."*
- Response format rules (when to use visuals, when to check understanding)
- Wrong-answer handling (narrative consequence, not "Incorrect! Try again.")
- Instructional language: English only for core subjects

#### 1.9 — Standards Injection Service

New file: `lib/services/standardsCatalog.ts`

```typescript
export async function getStandardCodesForSubject(subjectSlug: string): Promise<StandardEntry[]>
// Returns: [{ code: "MA.3.NSO.1.1", description: "Represent multi-digit numbers...", domain: "Number Sense" }]

export function formatStandardsBlock(standards: StandardEntry[]): string
// Output for prompt: "MA.3.NSO.1.1 | Number Sense | Represent multi-digit numbers...\n..."
// Token budget: send codes + short descriptions only; cap at 50 standards
```

Pass `standardCodesBlock` into `buildSystemPrompt` via `sessionOrchestrator.ts`.

**Why this is P0:** Without this, `record_standard_observation` fires with hallucinated codes on every call. Every progress record in the DB is suspect until this lands.

#### 1.10 — Memory Extractor: Subject-Aware

File: `lib/ai/memoryExtractor.ts`

Parameterize by `subjectSlug` + `gradeBand` instead of `Language`. For core subjects:
- `MISCONCEPTION` — math error patterns, science reasoning gaps
- `STRENGTH` — demonstrated mastery moments
- `INTEREST_SIGNAL` — topics that generated engagement
- `STORY_BEAT` — narrative events that should feel continuous next session
- `CONFIDENCE_LEVEL` — self-reported or inferred confidence
- `VOCABULARY_GAP` — still valid for ELA

These memory types are the real difficulty signal. The AI reads them next session and adjusts — no stored pace field needed.

File: `app/api/session/[id]/complete/route.ts` — pass session `subjectSlug` from `getSession`.

#### 1.11 — Guards + Navigation

| Route/File | Change |
|-----------|--------|
| `middleware.ts` | Add `/progress` to PROTECTED routes |
| `app/learn/[sessionId]/page.tsx` | Show subject label in header (from session `subjectSlug`) |
| `app/sessions/page.tsx` | Show subject + chapter title instead of `LANG_LABELS` |

---

### Phase 2 — Content & Memory (P1)
**Goal:** Sessions feel continuous. Activities feel purposeful. Memory persists and gets used.

**Exit criterion:** Complete 3 sessions → session 4 opens with specific reference to prior learning + a 2-question narrative review → activities are drawn from a seeded library, not only AI generation.

#### 2.1 — CurriculumService (Replaces storyCurriculum.ts Placeholder)

New file: `lib/services/curriculum.ts`

```typescript
interface CurriculumService {
  getSharedArc(gradeBand: string): Promise<ArcConfig>           // ONE arc for G3 core
  getChapterConfig(arcId: string, chapterNumber: number): Promise<ChapterConfig>
  getSubjectPlan(chapterId: string, subjectSlug: string): Promise<SubjectChapterPlan>
  getActivitiesForChapter(chapterId: string, subjectSlug: string, filters: ActivityFilter): Promise<LearningActivity[]>
  getNextActivity(learnerId: string, chapterId: string, subjectSlug: string): Promise<LearningActivity>
  buildCoherenceMap(chapterConfig: ChapterConfig, subjectSlug: string): Promise<CoherenceMap>
}

interface CoherenceMap {
  anchorQuestion: string
  chapterQuestion: string
  investigationQuestions: string[]
  targetSkills: string[]
  targetStandardCodes: string[]
  evidenceExperienceSlugs: string[]
  culminatingTask: string
}
```

- **One arc:** `StoryArc` is not duplicated per subject; `getSharedArc("3")` returns the castaway expedition
- Chapter objectives: populate `Chapter.plannerJson.subjectPlans[subjectSlug]` with 2–4 target standard codes per lens
- World bible: single `StoryWorld.bible` from `_shared_castaway_world.ts` + onboarding interests woven in at profile create
- `StoryState` advances per learner per arc — switching `primarySubjectSlug` does not reset chapter

#### 2.2 — Activity Library Seed (Shared Chapters, Subject Tags)

**Chapter tags are subject-agnostic:** `g3_ch1` … `g3_ch6` (same wreck, same camp — all subjects).

**P1 minimum:** 5 hand-authored activities × 6 chapters for **math** (30 total).

**P1 stretch / P2 target:** same structure for `ela_g3`, `science_g3`, `social_studies_g3` (up to 120 total).

Files (pattern):
```
prisma/seeds/activities_g3_ch1_math.ts
prisma/seeds/activities_g3_ch1_ela.ts
...
prisma/seeds/activities_g3_ch6_social_studies.ts
```

Each activity requires:
```typescript
{
  slug: string,            // unique, e.g. "ch1_unit_sort_game"
  title: string,
  chapterTag: string,      // "g3_ch1" — shared across subjects
  subjectSlug: string,     // "math_g3" | "ela_g3" | ...
  activityKind: ActivityKind,
  prompt: string,          // the full instructional prompt
  scaffoldHints: string[], // 3 progressive hints
  answerRubric: string,    // what a good answer looks like
  targetStandardCodes: string[],
  authoringTier: "HAND_AUTHORED"
}
```

Activity kinds required across each subject's chapter set:
- `MINI_QUIZ` — targeted single-skill check
- `JOURNAL_PROMPT` — written explanation for the Guild (captain's log; Rho may help format)
- `INTERACTIVE_GAME` — drag-and-drop, sorting, building (renders a React component)
- `STORY_SCENE` — narrative beat where a decision is needed
- `CHALLENGE` — multi-step problem requiring justification

#### 2.3 — Activity Registry + Assign Tool

New file: `lib/activities/registry.ts`
```typescript
// Maps activityKind → React component + server-side validator
export const ACTIVITY_REGISTRY: Record<ActivityKind, ActivityDefinition>
```

New AI tool in `sessionOrchestrator.ts`:
```typescript
assign_learning_activity: {
  description: "Assign a hand-authored activity from the library",
  parameters: {
    chapterTag: string,     // e.g. "g3_ch1"
    subjectSlug: string,    // e.g. "math_g3"
    activityKind: ActivityKind,
    standardCode: string    // must be in injected standards block
  }
}
```

Orchestrator calls `getNextActivity(learnerId, chapterId)` to select the activity. `generate_learning_activity` becomes a fallback only when no seeded template fits.

#### 2.4 — Memory Injection at Session Open

Files: `lib/services/session.ts`, `lib/ai/contextBuilder.ts`

On session start:
1. Load last 5 `MemoryItem` records for `learnerId`
2. Format as "Previously on Primer..." block injected into system prompt
3. AI opening narration must reference at least one memory item explicitly

Template for the memory block:
```
LEARNER MEMORY (use these to open the session and calibrate difficulty):
- [STORY_BEAT] The captain and Rho measured the eastern shoreline and found it was 340m long.
- [STRENGTH] Learner correctly identified that 1/4 is smaller than 1/2 without a number line.
- [MISCONCEPTION] Learner confused kilometers with meters when estimating long distances.
- [CONFIDENCE_LEVEL] Expressed uncertainty about reading bar graphs.
```

The AI uses STRENGTH and MISCONCEPTION items directly to calibrate session difficulty — no stored pace field needed.

#### 2.5 — Spaced Retrieval Review System

New model: `ReviewItem` (schema in Phase 1.1 above)

New AI tool:
```typescript
schedule_review_item: {
  description: "Schedule a concept for spaced retrieval review",
  parameters: {
    standardCode: string,
    conceptSummary: string,  // 1 sentence, learner-facing
    daysUntilReview: number  // 1, 3, or 7
  }
}
```

At session open, if `ReviewItem.nextReviewAt <= now`:
1. Surface as a 2–3 question "expedition log review" before the main session
2. Frame: *"Before we head out — Rho found your old notes. Can you remember what you figured out about [concept]?"*
3. Update `timesReviewed` and `lastScore` after completion
4. This is Ebbinghaus / Bjork's spaced retrieval embedded invisibly in narrative

#### 2.6 — New AI Tools

Add to `sessionOrchestrator.ts`:

| Tool | Purpose |
|------|---------|
| `schedule_review_item` | Creates `ReviewItem` with spaced repetition timing |
| `record_story_beat` | Saves narrative event to `MemoryItem` with type `STORY_BEAT` |
| `advance_chapter` | Signals chapter culminating task complete → advances `StoryState` |
| `set_companion_mood` | Sets Rho's visual state: THINKING / EXCITED / CONCERNED / CELEBRATING |
| `assign_learning_activity` | Picks from seeded library by standard + kind |

#### 2.7 — Minimal App Shell Nav

Add shared layout component with nav: `Learn | Progress | Sessions`

Today `/sessions` is undiscoverable. The nav is a retention feature, not decoration.

`PATCH /api/profile` for subject switching (updates `primarySubjectSlug` only — no pace field).

---

### Phase 3 — Experience Polish (P2)
**Goal:** A child sits down, plays for 20 minutes, and wants to know what happens next — will the crew survive, and can they get off the island?

**Exit criterion:** A real 8-year-old completes a session and asks "can I play tomorrow?"

#### 3.1 — Companion Character System (Rho — Sidekick)

Add persistent Rho sidekick panel to the learn UI (left or top panel, alongside scene images). The learner is the protagonist in copy and prompts; Rho reacts, advises, and celebrates — never steals the hero role.

- 4–6 illustrated visual states: THINKING, EXCITED, CONCERNED, CELEBRATING, CURIOUS, WAITING
- State driven by `set_companion_mood` AI tool
- In MVP: SVG/CSS illustrated states (no animation required, but design-in the slot)
- Character design direction: vector-illustrated, warm, gender-neutral, scout-aesthetic (tool belt, Guild patch, wreck-survivor practicality — not the captain's insignia)

**Why this matters before the journey map:** Rho's presence gives the learner someone to talk to and care about — without replacing the learner as hero. It's the difference between a chat window and a sidekick on your crew.

#### 3.2 — Session Close: Cliffhanger Mechanic

Replace "Great job! You completed 3 activities!" with:

1. Chapter card: narrative summary of what happened + skills practiced (generated, not templated)
2. Rho signs off on behalf of the crew with an open question or discovery that requires the next session to resolve
3. Memory extraction runs in background (non-blocking)
4. CTA: *"Come back tomorrow — the crew's counting on you"* — curiosity, not streak pressure

**The rule:** The learner's job between sessions is to wonder. Never close with accomplishment. Close with anticipation.

#### 3.3 — Journey Map UI

New route: `/progress/journey`

Visual arc of the story:
- Top-down island map aesthetic — feels like a treasure map, not a progress bar
- Chapter nodes connected by a path (illustrated, warm, saturated)
- Completed chapters show a scene image thumbnail
- Current chapter glows/pulses with progress indicator
- Tapping a chapter node shows story summary of what happened there

No new data required — reads existing `Chapter` and `StoryArc` records. New UI only.

#### 3.4 — Interactive Activity Components

New React components in `components/activities/`:

**SortingTable** — drag-and-drop categorization
- Props: `items[]`, `categories[]`, `onComplete(result)`
- Use cases: fraction ordering, measurement comparison, data sorting
- File: `components/activities/SortingTable.tsx`

**NumberBuilder** — visual place value / fraction canvas
- SVG-based: place value blocks, fraction bars, area model grids
- Props: `mode: "place_value" | "fraction" | "area_model"`, `onComplete(value)`
- File: `components/activities/NumberBuilder.tsx`

Both render inside `GeneratedActivityCard` when `activityKind === "INTERACTIVE_GAME"`.

#### 3.5 — Parent Dashboard (Read-Only)

Route: `/progress/parent`

Surfaces:
- Last session date + duration
- Skills improving / needs work (from `SkillProgress`)
- Current chapter + story beat
- "Message from Rho" — AI-generated weekly summary of what the child worked on

No raw chat logs. No assignment creation. Just evidence the product is working.
This is a conversion and retention driver: parents renew when they can see progress.

#### 3.6 — Scene Image Strategy

Current: AI-generated per session, inconsistent quality.

For "The Mapmaker's Expedition" MVP: pre-generate and store 20–30 canonical scenes. Each chapter gets 3–5 pre-approved scenes that load instantly and maintain visual consistency. AI generation remains as fallback for edge cases.

Store in: `public/scenes/mapmakers_expedition/ch1_001.png` etc.

---

### Phase 4 — User Testing & Cross-Subject Depth

**Goal:** Validate with real 8–10 year olds. Brutal, honest, irreplaceable.

#### 4.1 — Testing Protocol
- 5+ sessions with actual Grade 3 homeschool kids (not parents, not developers)
- **Include at least 2 subjects** per tester (e.g. math Ch1–2, then ELA Ch2–3) to validate shared chapter continuity
- Watch them, don't explain — if they're confused, that's product signal
- Key questions: Do they understand their role as captain? Does switching from math to reading feel like the *same* story? Do they want to come back?
- Record session completion rate, return rate day 2, cross-subject memory reference rate

#### 4.2 — Deepen Non-Math Lenses (Same Arc)
- Seed ELA / science / SS activity libraries (5 per chapter each) — **same `g3_chN` tags**, no new plot
- Author `subjectPlans` in all six chapters' `plannerJson`
- Test captain's log continuity: ELA write → math session cites prior log entry
- **Do not** create separate arcs ("Evidence Files", "Weather Watchers", etc.) — those are retired concepts

#### 4.3 — Cross-Subject Product Features
- Subject switcher (PATCH profile) — changes lens, **not** chapter or world
- `/progress/journey` — one island path, four skill tracks per chapter node
- Optional **Expedition Day** multi-lens session (see §4 integration model)
- Parent dashboard shows cross-subject story beat + per-subject skill evidence

---

### Phase 5 — Arc Extension (Not Replacement)

Extend **the same** castaway arc — do not fork new Grade 3 plots per subject:

| Extension | Description |
|-----------|-------------|
| Chapters 7–12 | After MVP Ch6 sail-away: approach the larger landmass (exoplanet reveal arc begins — post-MVP) |
| Grade 4+ | New `StoryArc` in same `StoryWorld` (space-faring captain timeline) |
| World language | `language_es` / `language_zh` as **Guild trade** scenes on the island (Phase 6) — still same wreck world |

Each extension:
- Reuses `CurriculumService` + shared chapter model
- Adds `subjectPlans` and activities per new chapter
- Shares `ReviewItem` and `STORY_BEAT` memory across subjects

---

### Phase 6 — World Language Return

Dual onboarding path or post-MVP settings:
- `WORLD_LANGUAGE` subject with `targetLanguage` on session
- Reuse `LearnerSubject` + optional `activeLanguage` on profile
- Language-specific memory types: `VOCABULARY_GAP`, `GRAMMAR_PATTERN`, `PRONUNCIATION_NOTE`
- Original language tutor prompt templates reactivated

---

## 7. Technical Architecture — Complete Picture

### 7.1 — Files Touched in Phase 1 (P0)

| Area | Files |
|------|-------|
| Schema | `prisma/schema.prisma`, new migration |
| Profile | `lib/services/profile.ts`, `lib/types/index.ts`, new `lib/services/learnerSubjects.ts`, `lib/constants/subjects.ts` |
| API | `app/api/profile/route.ts` |
| UI | `app/onboarding/page.tsx`, new `components/onboarding/OnboardingWizard.tsx` |
| Session flow | `lib/services/session.ts`, `app/learn/page.tsx`, `lib/services/storyBranches.ts` |
| AI | `lib/ai/contextBuilder.ts`, `lib/ai/sessionOrchestrator.ts`, `lib/ai/memoryExtractor.ts`, new `lib/services/standardsCatalog.ts` |
| Prompt templates | new `lib/ai/promptTemplates/math_g3.ts` (+ 3 others) |
| Story | `lib/story/focusTags.ts`, `lib/services/storyCurriculum.ts` |
| Auth/routing | `middleware.ts` |

### 7.2 — Full Context Builder Shape (Target State)

```typescript
async function buildSystemPrompt(session: Session, profile: LearnerProfile): Promise<string> {
  const template   = await getPromptTemplate(profile.primarySubjectSlug)
  const standards  = await getStandardCodesForSubject(profile.primarySubjectSlug)
  const memories   = await getRecentMemories(profile.id, 5)
  const chapter    = await getCurrentChapter(session.id)
  const reviewsDue = await getDueReviewItems(profile.id)

  return [
    sharedWorldBibleBlock,                          // ONE castaway arc — all G3 core subjects
    template.basePrompt,                          // subject pedagogical stance (lens only)
    formatLearnerBlock(profile),                  // name, grade, goals, interests (no pace)
    formatStandardsBlock(standards),              // valid codes for THIS session's subjectSlug
    formatMemoryBlock(memories),                  // STORY_BEAT (cross-subject) + subject-tagged items
    formatCoherenceMapBlock(chapter, session.subjectSlug),  // shared beat + subjectPlans slice
    reviewsDue.length ? formatReviewBlock(reviewsDue) : "",
    template.pedagogyInstructions,
  ].filter(Boolean).join('\n\n---\n\n')
}
```

### 7.3 — Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Existing users have language-only profiles | Migration backfill: `gradeBand=3`, enroll 4 subjects, `primarySubjectSlug=math_g3`, `activeLanguage` preserved |
| Seed not run → no subjects | `createProfile` throws with clear message; dev docs: `npm run db:seed` required |
| Prompt token bloat from standards list | Send codes + short descriptions only; cap at 50 per call; use chapter `plannerJson` to send only relevant ones |
| Breaking existing language dogfooders | `activeLanguage` nullable — existing rows keep their value |
| AI-generated activities with wrong codes | `assign_learning_activity` uses seeded activities with hardcoded codes; `generate_learning_activity` validates against injected standards block |
| Scene image quality inconsistency | Pre-generate canonical scenes for Ch1–6 of Mapmaker's arc; AI generation as fallback only |
| AI miscalibrating difficulty without pace field | `MISCONCEPTION` and `STRENGTH` memory items + `SkillProgress` mastery scores give richer signal than a stored preference; prompt template instructs explicit inference |

---

## 8. Session Experience: The Moment-by-Moment Loop

### Session Open — Returning Learner
1. Scene image loads: the camp or wreck site, somewhere recognizable from last time; Rho visible at the learner's side
2. Rho speaks to the captain: *"[displayName], you're back! Last time, we figured out [retrieved memory]. The crew's been waiting..."*
3. If reviews are due: *"Before we head out — Rho found your old log pages. Can you remember what you figured out about [concept]?"* → 2–3 quick questions
4. Story resumes exactly where it left off

### Mid-Session
1. A survival situation faces the captain and crew — math is how the learner (protagonist) resolves it; Rho may prompt or hand tools
2. Learner engages: dialogue, interactive activity, or written response
3. AI evaluates, scaffolds based on observed performance (not a stored pace), records standard observation
4. Rho's mood state updates via `set_companion_mood`
5. Scene image updates to reflect story progress
6. Branch moment: learner makes a meaningful choice that affects next scene

### Session Close
1. Chapter card: AI-generated narrative summary + skills practiced (not templated boilerplate)
2. Rho relays a cliffhanger to the captain: *"Captain — I was checking the storm charts and something's wrong. What did we miss?"*
3. Memory extraction runs in background (non-blocking)
4. *"Come back tomorrow — the crew needs you"* — no streak pressure, just narrative curiosity

### The Rule
Close with anticipation, not accomplishment. The learner's job between sessions is to wonder.

---

## 9. Content Authoring Pipeline (3-Tier System)

### Tier 1 — Hand-Authored Core (shared `g3_chN` chapters; per-subject activity pools)
- Authored by a human (or carefully reviewed human-AI co-authored)
- Stored in `prisma/seeds/activities_g3_chN_<subject>.ts`
- **P1:** 30 math activities minimum; ELA/science/SS follow same chapter tags as arc deepens
- AI *assigns* these; it does not *generate* them
- Each has: `slug`, `title`, `prompt`, `scaffoldHints[]`, `answerRubric`, `targetStandardCodes[]`
- These are the activities that define learning quality

### Tier 2 — AI Contextual Variations
- AI generates surface-level variations on Tier 1 activities (different character names, story details)
- Skill target and rubric inherited from Tier 1 template
- Safer than fully generative; scales content without proportional authoring cost

### Tier 3 — AI Mini-Quizzes (Existing, Constrained)
- `generate_learning_activity` retained as fallback
- Standard codes must come from the injected standards block — not model memory
- Used when no seeded template fits the current chapter moment

---

## 10. Design & Open Questions (Resolve Before Phase 3)

1. **Rho's visual design (sidekick, not protagonist)** — Vector-illustrated, gender-neutral, 6 mood states. Guild scout aesthetic — tool belt, practical gear — distinct from the learner-as-captain framing in UI copy. Budget: ~$500–1500 for a coherent illustration set. **Long-term world bible:** this island is on another planet; civilization on the larger landmass across the water; the captain eventually becomes space-faring — none of this is revealed in MVP.

2. **Scene image strategy** — Pre-generate 20–30 canonical scenes for Mapmaker's arc using DALL-E or Midjourney, store as static assets, load instantly. AI generation as fallback. This eliminates quality variance on the first arc.

3. **Audio** — Rho's voice via ElevenLabs? Sound design (ambient map room, ocean, jungle)? Not MVP, but design UI slots for it now. Grade 3 kids respond strongly to audio — this could be a major differentiator in Phase 2.

4. **Offline support** — Not MVP. If target expands to rural homeschool families, this becomes important earlier than expected.

5. **Parent vs. child onboarding** — MVP defaults to student-direct. Architecture must not prevent parent-mode. The parent dashboard in Phase 3 is the bridge.

---

## 11. Success Metrics

### Phase 1 Exit
- [ ] New user completes onboarding in 4 steps without picking a language or pace
- [ ] DB has 4 `LearnerSubject` rows, `gradeBand=3`, `primarySubjectSlug=math_g3`
- [ ] First session is `math_g3`; system prompt mentions Grade 3 math + valid `MA.3.*` codes
- [ ] AI records observations + generates mini-quiz successfully
- [ ] `/progress` reflects evidence for math

### MVP Exit (Before Phase 4 user testing)

| Metric | Target |
|--------|--------|
| Session completion rate | >70% reach the chapter close card |
| Day-2 return rate | >40% of learners open a second session |
| Memory reference accuracy | AI references prior session (including cross-subject STORY_BEAT) in >80% of session opens |
| Standard code accuracy | `record_standard_observation` fires with valid codes in >95% of calls |
| Activity engagement | Learners complete (not skip) >80% of assigned activities |
| Parent articulation | Parents can describe what their child learned from the progress view |

---

## 12. The Reference Test

When deciding whether a feature is done, ask: does it feel more like these, or less?

**More like:**
- A Studio Ghibli film where you understand the world's rules 10 minutes in and can't stop caring what happens
- The first time you played Zelda and realized the whole map was a puzzle to figure out
- The moment a great teacher asks the exact right question and you realize you already knew the answer

**Less like:**
- A quiz dressed up in a story costume
- A chatbot that happens to mention math
- A progress bar with an encouraging emoji

---

## Appendix A: Prioritized Master Checklist for Claude Code

### P0 — Ship coherent Grade 3 homeschool onboarding + first math session

- [ ] Phase 0: Baseline test pass — document failures
- [ ] 1.1 Prisma migration: `displayName`, `gradeBand`, `primarySubjectSlug`, `ReviewItem` model, `activeLanguage` optional — no pace/difficulty enum
- [ ] 1.2 `lib/constants/subjects.ts` with `GRADE_3_CORE_SUBJECT_SLUGS`
- [ ] 1.3 `createProfile` transaction: profile + 4× `LearnerSubject` + story chain + idempotency guard
- [ ] 1.4 `GET/POST /api/profile` new contract + 409 guard — no pace in body
- [ ] 1.5 Onboarding wizard (4 steps, pace step removed) — server redirect if profile exists
- [ ] 1.6 `startSession(profileId, subjectSlug)` — learn page uses `primarySubjectSlug`
- [ ] 1.7 `focusTags` + `storyCurriculum` without language or pace dependency
- [ ] 1.8 `_shared_castaway_world.ts` + four subject lens templates + context builder (shared bible + subject standards)
- [ ] 1.9 `standardsCatalog.ts` + standards injection in orchestrator
- [ ] 1.10 `memoryExtractor` subject-aware (not language-parameterized); MISCONCEPTION + STRENGTH as difficulty signal
- [ ] 1.11 Session header shows subject; `middleware.ts` protects `/progress`

**P0 complete when:** Math session → `MA.3.*` observations → successful quiz → `/progress/math_g3` shows evidence

### P1 — Curriculum depth + activity library

- [ ] 2.1 `CurriculumService` — replaces `storyCurriculum.ts` placeholder; populates `plannerJson`
- [ ] 2.2 Seed 30 hand-authored math activities (`g3_ch1`–`g3_ch6` tags); document ELA/science/SS seed pattern for P3
- [ ] 2.3 `assign_learning_activity` tool + `lib/activities/registry.ts`
- [ ] 2.4 Memory injection at session open — includes difficulty calibration instruction in memory block header
- [ ] 2.5 `ReviewItem` spaced review system + `schedule_review_item` tool
- [ ] 2.6 All new AI tools: `record_story_beat`, `advance_chapter`, `set_companion_mood`
- [ ] 2.7 Minimal app shell nav (Learn / Progress / Sessions)

**P1 complete when:** Session 4 opens with memory reference + spaced review question; AI difficulty feels appropriate without any manual setting

### P2 — Experience polish (makes kids want to return)

- [ ] 3.1 Rho companion character — 4 mood states in learn UI
- [ ] 3.2 Cliffhanger session close mechanic
- [ ] 3.3 Journey Map UI at `/progress/journey`
- [ ] 3.4 `SortingTable` + `NumberBuilder` interactive components
- [ ] 3.5 Parent dashboard at `/progress/parent`
- [ ] 3.6 Pre-generated canonical scene images for Ch1–6

**P2 complete when:** 8-year-old finishes a session and asks to play tomorrow

### P3 — Cross-subject depth + language return

- [ ] ELA / science / SS activity seeds (5×6 each) — shared `g3_chN` tags, same arc
- [ ] All six chapters: full `plannerJson.subjectPlans` for four subjects
- [ ] Subject switcher (PATCH profile + UI) — preserves shared `StoryState`
- [ ] Journey hub — one map, four skill tracks per chapter
- [ ] Optional Expedition Day multi-lens sessions
- [ ] World language optional path (ES/ZH as Guild trade scenes, same world)

---

*Version 1.3 — All four G3 core subjects share one shipwreck arc ("The Mapmaker's Expedition"); subjects are instructional lenses, not separate plots. Cross-subject integration model, shared `StoryState`, `g3_chN` activity tags, and retired per-subject arc concepts (ELA mystery, Weather Watchers, etc.). v1.2: captain/Rho roles, exoplanet bible. v1.1: no LearningPace.*
