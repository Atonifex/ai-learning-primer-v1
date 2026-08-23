# Primer — Master Vision Plan
**Version:** 2026-08-22  
**Status:** ACTIVE SOURCE OF TRUTH — coding agents start here  
**Audience:** Product owner + AI coding agents (Cursor / Claude Code / sub-agents)  
**Primary users:** Grades 3–8 to start (Florida homeschool / ESA first; 3rd–4th as the proof slice)  
**This document supersedes:** `docs/product-vision.md`, `docs/v1-scope.md`, `docs/v1-technical-plan.md`, `docs/roadmap-post-v1.md` where they conflict. Those files remain historical. Keep orchestration, memory, standards evidence. **Do not** keep the graphic-novel session as the *home* UX (SUPERSEDED 2026-08-22 — Stardew-style Pixi overworld is home; dialogue is a cutscene mode).

---

## 0. How to use this document (agents: read this first)

You are reading the **highest-level thinker** for Primer. Your job is not to invent a new product. Your job is to **execute a vertical slice**, then **record what you learned** here.

### Living-document protocol (mandatory)

When you implement, discover, or pivot:

1. **Do not silently fork the vision.** If the story, data model, or MVP scope changes, update **this file** in the matching section.
2. Append a short entry to **§18 Implementation Log** (date, agent/session, what changed, why, files touched). Keep each entry to 3–8 lines.
3. If a decision is locked, move it into **§4 Locked Decisions**. If it is still open, leave it in **§20**.
4. Never delete historical intent. Strike through or mark `SUPERSEDED` and point to the new rule.
5. After a phase ships, check boxes in **§15 Master Checklist**. Uncheck nothing without a log note.

### Recursive agent contract

This document is designed to be **re-read mid-build**. When you discover missing information:

1. Search the **File Reference Map (§16)** before inventing schema or copy.
2. If a referenced file contradicts this plan, **this plan wins**, then log the contradiction.
3. If you need a standard code, activity type, or story beat that is not specified, spawn a **narrow research sub-agent** (see §12) rather than guessing Florida standards. Do not invent codes. Authoring files: `curriculum_resources/standards_*.ts`.
4. Before writing a large feature, re-read **§11 First playable loop** and ask: *does this belong in the 10-standard-per-subject slice?* If no, stub an interface and stop.
5. **§20 D is answered (2026-08-22 evening).** Pixi overworld, dialogue cutscene, and one overlay quiz may be implemented. Follow §11 order: seed catalogs **before** wiring the activity bank.

---

## 1. Plaud session summary — 2026-08-20

**Recording:** `08-20 Working Session: Gamified AI Tutor and MVP Strategy`  
**Plaud file ID:** `c1d28e0a8e1a0b7f5eb746226c29946f`  
**Duration:** ~53 minutes  
**Participants:** Ivan Harjehausen; Quay (Chief AI Officer; parent of Hanzo — pedagogical / prototype partner; collaborator on Ivan's MVP.

### 1.1 What the conversation actually decided

The call is two acts in one recording:

**Act A — Quay (external builder / parent).** Shared belief: kids learn fastest when the environment is joyful and social. Quay wants the **secret sauce of how to teach** (not another downloaded syllabus). He will hire a local teacher to watch Hanzo on a short prototype and feed critique back into the product. He asked for: coherence flowchart, specific lesson-to-standard examples, gameplay mapping, and a ballpark parent/educator report.

**Act B — Quay + Ivan (internal MVP brainstorm).** After Quay left, Ivan dictated the **three-layer data architecture**, the **multi-year island saga**, the **activity bank**, Higgsfield intro video, and the instruction: *write a detailed spec tonight and have Claude Code build*.

### 1.2 Pedagogical backbone (from Ivan, trained on Amplify Science)

Amplify's **coherence flowchart** is the teaching engine. It is **not** a science-only trick. Primer generalizes it:

| Amplify layer | Primer name | What it is |
|---------------|-------------|------------|
| Unit design problem | **Epoch / Unit phenomenon** | The big problem the learner is *inside* |
| Chapter-level anchor phenomenon | **Chapter question** | Observable mystery for this chapter |
| Investigation question | **Investigation question** | Manageable slice of content |
| Evidence sources & reflection opportunities | **Learning Activities** | What the student *actually does* |
| Key concepts | **Key concepts** | Formalized ideas after evidence |
| Application back to phenomenon | **Narrative application** | Use the idea to move the story |
| Student explanation | **Chapter reflection / Guild log** | The learner can now *say* the answer |

**Non-negotiable translation:** students are not inspired by checking standards. Humans are inspired by **stories and problems**. Standards are the hidden map. Activities are the work. Story is the reason to care.

Screenshots referenced in the product conversation (Amplify "Environments and Survival" / grove snails) are the **pattern**, not the content. Yellow-shell snails → "why aren't they surviving?" is the *shape* of a chapter. Primer's equivalent is: *the ship is wrecked; the crew is scattered; food will not last; why is this beach unsafe after dark?*

### 1.3 Meaningful gamification (Ivan + Quay agreement)

Edtech usually fails gamification by awarding **XP for its own sake**. Primer awards **diegetic power**:

- Unlock **new map regions**
- Recover **crew** (collection that matters)
- Upgrade the **camp** (tents → buildings)
- Earn **resources** used to build, trade, or recruit
- Customize **skins / camp decoration** (ownership, not pedagogy)
- Meaningful **in-world rewards** after a real standards-based test

Parents' pain (Quay): video games have **no measurable academic outcome**. Primer's wedge is: the child *wants* to play, and the parent can **see Florida standards moving**.

Grade levels are **organizational fiction**. A third grader who finishes Grade 3 math should flow into Grade 4 math *in the same island*, while still being "in third grade" socially. Stories interleave; mastery is fluid.

### 1.4 Go-to-market signals from the call

- **Near-term:** Florida homeschool / ESA dollars (Quay: Step Up For Students, ~$8k–$12k/year). Get a few recurring families. Prove measurement.
- **Not near-term:** district B2B procurement (Ivan knows that sales cycle; it is slow).
- **Later:** Steam, tablets, even Switch-class polish if Unity partners engage. Quay has 15 years of Unity + LMS simulator work and offered to hack a small prototype **after** specs land.
- **Proof users:** Hanzo + classmates + a hired teacher watching 5–20 minute sessions.

### 1.5 Immediate actions spoken aloud

- Ivan: code an MVP tonight around **standards + session orchestrator + initial story**; write Claude Code specs.
- Ivan: send framework docs / specs to Quay.
- Quay: wireframe a sample level in 1–2 weeks once docs arrive.
- Crew age later locked: young adults. Rho = First Mate.

### 1.6 Quotes that should constrain design

> "To the student, they are not going to be inspired by checking boxes of standards." — Ivan  

> "Parents can't [get] any measurable outcome for kids playing video games, so you are giving them a measurable outcome." — Quay  

> "Gamification goes wrong when it's just XP points for the sake of XP." — Ivan  

> "This can basically build on those original text based games… infinite choose your own adventure if we just structure it right." — Ivan  

> "They should write reflections at the end of each chapter about what they learned." — Quay / Ivan (joint)

---

## 2. What the dated `docs/` still teach (and what they get wrong)

Reviewed in full:

| File | Keep | Supersede |
|------|------|-----------|
| `docs/product-vision.md` | Young Lady's Primer spirit; structured memory; premium feel; ESA path | Adult language-first wedge; "most likely first user is adult Spanish/Chinese" |
| `docs/v1-scope.md` | Session loop, structured memory, session history | Language-only V1; "no homeschool dashboard / no assessments / no gamification" |
| `docs/architecture-notes.md` | Layered memory; UI ≠ chatbot; Next.js + Prisma + orchestration | Language-centric `LearnerProfile`; "image generation optional" (now required) |
| `docs/v1-technical-plan.md` | Graphic-novel session UI; ContextBuilder / SessionOrchestrator / MemoryExtractor; streaming | Spanish+Chinese launch; dynamically generated arc per session with no curriculum freeze |
| `docs/roadmap-post-v1.md` | Standards-backed curriculum; micro-assessments; parent reporting | Framing these as "later" — they are **MVP-critical** now |
| `docs/decisions-scene-images.md` | GPT Image + Supabase portraits | None — still current for still images |
| `docs/implementation-phase-closeout-checklist.md` | SSE chunk types, progress UX, Vitest start | Treat as engineering history, not product north star |
| `docs/testing-maturity-roadmap.md` | Test pyramid, CI gates | Keep as engineering policy |
| `docs/vitest-testing-guide.md` | How to run tests | Keep |

**The honest synthesis:** Primer began as a language companion and already evolved in code toward **Grade 3 Florida core subjects + story world + standards evidence**. Keep orchestration, memory, images, standards. **Throw away the graphic-novel-as-home UI.** The home is a Stardew-like Pixi island; talk/type is a dialogue cutscene; learning activities are full-screen tools (like fishing or crafting in Stardew), not chat worksheets.

Also read (not in `docs/`, more current):

- `Project Scoping and Planning Documents/primer_mvp_spec_v2_5_26_2026.md` — shared shipwreck arc, Rho as sidekick, four-subject lenses, coherence `plannerJson`. **Merge into this file; do not maintain two competing MVPs.**
- `curriculum_resources/primer_mvp_spec_v2_5_26_2026.md` — duplicate; prefer the Planning Documents copy until deleted.

---

## 3. Product thesis (why this can be phenomenal)

Primer is not "Khan Academy with a skin" and not "Roblox with a worksheet." It is a **persistent world in which academic skill is the physics engine**.

A Grade 3–8 learner is the **captain**. Their name from onboarding (`displayName`) *is* the character. **Rho is the First Mate** — loyal sidekick, never the hero. Math, reading, science, and social studies are **lenses on one story**, not four apps.

The child should:

- **See** a living island (illustration now; cinematic Higgsfield at epoch gates; optional 3D later)
- **Hear** crew voices (TTS) and ambient place
- **Speak** (STT) — briefings, empathy, public speaking
- **Type** — plans, logs, reflections, messages to the Guild (typing is a learning outcome, not a chore)
- **Do** — measure, sort, calculate, graph, decide, build

The parent should:

- See **which Florida standards** moved, with evidence (conversation, activity, checkpoint test)
- Read **chapter reflections** the child wrote "for the crew"
- Trust that this is not screen-time theater

If session 4 does not feel like **returning to the same island and camp**, the product has failed — even if the quizzes are correct.

---

## 4. Locked decisions

| Decision | Value |
|----------|-------|
| Working title | Primer |
| MVP audience | Homeschool families; child is the player; parent is the economic buyer |
| Grade proof | Florida Grade 3 + Grade 4 catalogs as the test corpus; UI may still default Grade 3 |
| Subjects in one world | `math_g3`, `ela_g3`, `science_g3`, `social_studies_g3` (and G4 equivalents when seeded) share **one** `StoryWorld` + **one** saga |
| First session | Tutorial is guided (wreck → talk → mini-game) and **is a placement test**. After that, the **student picks** missions/lessons |
| Mission cards | Each pickable job shows **subject, theme, ~minutes, in-game reward** (resources + XP + items/perks/world change) |
| Protagonist | Learner `displayName` = captain |
| Companion | **Rho = humanoid AI First Mate.** Tutorial NPC, sidekick, never the protagonist. ZPD support. **Does not take tests.** |
| Crew age | **Young adults** (not child-peers, not middle-aged officers) |
| Tone / content rating | **No explicit violence or gore.** Mutiny = betrayal and leaving, not a fight scene. Real emotions allowed: jealousy, frustration, insecurity, loyalty. Disease/death may happen in the plot but are **never shown** (reported, implied, off-screen) |
| Grade advancement | **Checkpoint-driven**, not parent-gated. Finishing G3 math checkpoints flows into G4 math in the same camp |
| World renderer | **PixiJS** Stardew-like **top-down 2D overworld** is HOME. Not Three.js. Not graphic-novel-as-home. |
| Visual / feel | **Stardew-like** readable top-down with readable tiles, camp you grow, NPCs you find, tools/, **slightly more modern/animated** than pure SNES pixels — inspired by, **not copied from**, Stardew or Pokémon. Dialogue is a cutscene overlay. Learning work is a **mode / mini-game / full-screen tool**. |
| Dialogue UI | Chat/transcript **left**; character portrait **right**. Mic placed like ChatGPT/Claude (composer + mic). Speak-first for Grade 3; typing is a later skill (see §4.8). |
| Rho presence | **Call anytime** via portrait/radio control + **map follower** when Rho is with you |
| Interaction LLM | **`gpt-5.6-luna`** (or future cheap equivalent) for live turns, hints, ZPD scaffolding |
| Planning LLM | **Medium** reasoning model authors/updates **Units and Chapters** from the **shared static saga** + this student’s placement/evidence |
| Image LLM | **Tonight:** stills pack only (`public/stills/tutorial/`). **Full MVP:** dynamically generate every scene. |
| Voice | OpenAI TTS out; OpenAI STT in; **transcribe and discard audio** (COPPA) |
| Input | Speak **or** type; **encourage speaking** at first. Scaffold lexile to demonstrated level. Large typing is not required in the tutorial. |
| Pedagogy | Amplify coherence in `plannerJson`; **ZPD** hints/tools/examples (not static retry); struggle is OK; Duolingo-like encouragement, deeper thought |
| Measurement | `Standard` → evidence → progress; **school-equivalent tests** at chapter/unit end (after a mini in-game project / boss); chapter **reflections** = active recall + parent report, framed in-world for the child |
| Difficulty | Inferred; **tutorial = placement test**. Units/chapters generated to the student; saga spine is shared. Grade band is a starting guess. |
| Session shape | One or two subjects per sitting; **≥15 minutes** of real depth; interleaving + spaced repetition across days. Units/chapters = bundles of standards. |
| Tonight slice | ~**10 standards per subject** (math, ELA, SS, science), grouped by topic — not the full catalogs |
| Full MVP curriculum | **All Grade 3 and Grade 4** cores from `curriculum_resources/standards_*.ts` (user: “/standards folder”) |
| Framework | **Florida only** for MVP. Comment in code: later NGSS / Common Core. Next markets: AZ, UT, WV homeschool, then private TX/NY |
| IEP | **(a)+(b):** TTS/STT + parent-entered goals/preferences. Not official IEP service. No ADHD/dyslexia/low-vision/AAC modes. Access points: store text, do not play (see §4.13). |
| Timers | Always **recorded** for analytics. **Hidden from the child by default.** Toggle to display. Rarely used as a pressure mechanic. |
| Devices | Target iPad + Chromebook + desktop. **Tonight/MVP engineering: whatever ships a complete G3+G4 loop fastest** (likely desktop-first, responsive) |
| Child accounts | Schema: parent attaches **multiple** learners. Playable loop is per child. True multiplayer later (investment). |
| Connectivity | **Online-only** (LLM for curiosity, creation, writing, speaking, critical thinking) |
| Collaborator | **Quay** (not Quinn). **Ivan owns all IP** for now. |
| Parent surface | Built **after** the student game is playable. **Same content three ways:** filterable dashboard, weekly email, printable **weekly PDF** (hours + standards, like a bank statement). Full MVP, not the first playable loop. |
| Time | **No cap tonight.** Track total time, per session (regardless of how many lessons), and per lesson / chapter / unit so a cap can be added later. |
| Logins | **Two logins, one household** — parent account connected to one or more child accounts (see §4.5) |
| Intro cinematic | Higgsfield (or equivalent) **pre-rendered** crash landing. **Placeholder poster now.** Ivan generates later. Spec + prompt in §4.12. |
| Hidden lore | Island is on another world; larger civilization nearby; space-faring future. **Do not reveal in Tutorial/Building first loop.** |
| World language ES/ZH | Schema fields may stay nullable; **do not keep a live language-tutor product path.** Guild-trade language is post-MVP |
| GTM sequence | **1)** D2C Florida stipend parents **2)** homeschool associations / Step Up **3)** AZ, UT, WV **4)** private schools TX/NY. Districts later. |
| Under-13 | Parent-owned household; two logins; COPPA. Voice = transcribe-and-discard. |
| Grade 3 science catalog | Authoritative full set: `curriculum_resources/standards_science_grade3.ts` (seeded via re-export). |
| Codebase strategy | **Stay in this repo. Prune vestigial language-tutor code.** |

### 4.1 COPPA, in plain language

**COPPA** is the U.S. **Children's Online Privacy Protection Act**. It is a federal law about **kids under 13** and **personal information** collected online (name, email, voice recordings, photos, persistent identifiers, chat logs that can identify a child).

If Primer is used by third graders, you are almost certainly a COPPA "operator." Practical meaning:

- A **parent or guardian** must give **verifiable consent** before you collect the child's personal data — not the child clicking "I agree."
- You should collect **only what you need** to run the learning product.
- **Voice recordings** are personal data. STT in MVP makes this real, not theoretical.
- You need a clear privacy policy, a way for parents to review/delete the child's data, and contracts with vendors (OpenAI, Vercel, Supabase) as **processors**.
- You generally **cannot** market to under-13s with behavioral ads; keep analytics minimal.
- **Florida ESA / homeschool** does not replace COPPA. Selling to parents helps (parent is the customer) but you still need the consent + data-minimization design.

**Product implication we are locking:** **two logins, one household** (§4.5). The parent User owns billing, consent, and the dashboard. Each child has a separate login (username + PIN or simple password) tied to a `LearnerProfile`. Voice and chat belong to the child profile, visible to the parent. Do not ship classmate testing or paid Florida D2C without this shape.

This is **not legal advice**; before taking stipend money, have a lawyer glance at COPPA + Florida student-privacy rules. It is enough of a product constraint to design now.

### 4.2 Keep, fork, or rewrite? (locked recommendation)

**Do not start from scratch. Do not GitHub-fork this product into a second living repo.** Stay here and **delete** language-tutor leftovers as you touch them.

Why this is not a "language app with a costume":

| Already the island product (keep) | Vestigial language (delete when you touch it) |
|-----------------------------------|-----------------------------------------------|
| Auth, onboarding, session stream, leave/complete | Live Pinyin / Spanish-tutor prompt path |
| ContextBuilder + SessionOrchestrator + MemoryExtractor | `language_es.ts` as an active template (archive or delete) |
| Graphic-novel session UI + GPT Image + portraits | `Language` ES/ZH as if they were the product |
| `StoryWorld` / Arc / Chapter / shared bible | Docs that still say "V1 = adult language" |
| Florida standards, evidence, progress, mini-quizzes | "preserve for language dogfooders" as a shipping goal |

Honest constraint: **STT/TTS is not actually in this codebase today.** Grep finds no Web Speech, Whisper, or OpenAI audio calls. That capability lived in your *intent* (and possibly `my-react-openai-app`), not in this repo. Rebuild voice **on this session UI**, don't hunt for a ghost feature.

**Three options you named:**

1. **Greenfield rewrite** — Clean mental model, ~2–4 weeks to re-reach today's session+standards+images loop. You would re-debug streaming, auth, Prisma, image storage. Cost is time you wanted for Chapter 1.
2. **GitHub fork** — Useful if you want a *public* Primer repo vs a private experiment, or a true split product. Two repos for the **same** product doubles PRs and agent confusion. Fork later if you open-source; not tonight.
3. **Stay and prune (chosen)** — Same git history, same Vercel project, delete dead language code on contact. Agents follow: *if a file only exists to teach Spanish/Chinese as the product, remove or quarantine it; if it is orchestration/memory/story/standards, keep.*

Prune list for agents (do incrementally, not a big-bang rewrite):

- Stop injecting language-tutor instructions into G3 sessions (if any remain).
- Keep `Language?` / `targetLanguage` nullable in schema; do not build UI for them.
- Treat dated `docs/v1-*.md` as museum; this file wins.

### 4.3 Three ways to organize the home experience (locked recommendation)

The old `/learn` **graphic-novel page as home** is rejected. It felt like a chatbot with pictures. The home must feel like a **game**. Three high-level organizations:

#### Option A — Stardew overworld hub + full-screen activity tools + dialogue overlay (RECOMMENDED)

**What it is:** Top-down Pixi island. Walk, explore fog, find crew, upgrade camp. When you talk to someone, the overworld pauses into a **cutscene**: transcript left, portrait right, speak or type. When you *do the work* (math practice, log writing, map measuring, quiz, reflection), the screen **changes mode** into a dedicated tool — the same way Stardew swaps from walking to fishing, inventory, or the mines. Completing the tool changes the island (bridge built, radio repaired, garden planted).

**Pros:** Highest engagement for 8–10 year olds; diegetic rewards (camp grows because you learned); activities can be deep (not multiple-choice in a chat bubble); parents can see *what the child built*; maps naturally to standards as map tiles / jobs; matches Pokémon/Stardew literacy kids already have.

**Cons:** More art and state machine work; Chromebooks/iPads need careful input (tap-to-move, not only WASD); risk of “pretty island, thin worksheets in a modal.”

**Diamond Age takeaway:** Nell’s Primer was *personal* (it knew her, adapted, remembered). It was not “a book UI.” Steal **memory + adaptation + a companion who lives in the world**, not the physical book chrome.

**Edtech takeaway:** Duolingo won **habit + tight feedback** but lost **depth** (static MC). Prodigy won **play** but often failed **proof** (parents/teachers couldn’t trust it covered the standard). Khanmigo is a **chatbot tutor** — kids bounce. XP-for-XP without world change is empty. Primer must connect **map tiles ↔ real practice ↔ parent-readable evidence**.

#### Option B — Camp HQ rooms (Animal Crossing house / among-us tasks)

**What it is:** A small set of interior rooms (bridge, galley, garden, radio shack). Click a station → activity. Less walking, more directed.

**Pros:** Cheaper to ship; clearer “what do I do now”; easier on iPad.

**Cons:** Less wonder; less exploration; feels more like an LMS with skins; weaker long-term identity of *your* island.

#### Option C — Primer-as-object (literal Diamond Age book)

**What it is:** The product *is* an illustrated book / raconteur; the island is illustrated inside pages.

**Pros:** Closest to Stephenson; generative pages; you already built a version of this.

**Cons:** **Rejected as home.** Reads as graphic novel / chatbot. Weaker game juice. Keep only as the **dialogue cutscene** and maybe a ship’s-log artifact, not the loop.

**Lock (confirmed 2026-08-22):** **Option A** — Stardew overworld + **full-screen activity tools / modes / mini-games** + dialogue overlay. Graphic-novel-as-home remains SUPERSEDED.

### 4.4 Models, ZPD, placement, scoring order

- **Live interaction:** `gpt-5.6-luna` (write this name in code comments / model router). Cheap, fast, every hint and turn.
- **Unit/chapter authoring or revision:** medium-reasoning model. Runs when tutorial/placement finishes, when evidence says the sequence is wrong, or when a parent/teacher requests a plan update — not every message.
- **ZPD:** If the child is stuck, give hints, tools, worked examples, then fade support. Do not loop the same static narrative. Encouragement can feel Duolingo-like; the *task* must require thought (not only MC).
- **Tutorial = placement.** Even within a labeled grade, ability varies. Estimate lexile, math fluency, speaking, SS/science knowledge. Then generate Units/Chapters. Revise from later interactions.
- **Scoring:** Keep current `standardsMasteryMath` / evidence tiers for the **10-standard slice**. Redesign after that slice produces data. **Do not block** the playable loop. School-equivalent chapter/unit tests must be defensible **before ESA sales** — that is the hard deadline, not tonight.

**E2 / what belongs in Prisma:** See **§4.11**. Short version: **yes, seed all G3 (then G4) standards, the activity bank, and checkpoint templates.** The **saga spine** stays as TypeScript templates (`grade3_castaway_curriculum.ts`) copied onto each learner — `StoryWorld` is per-child today. Medium LLM customizes that child’s units/chapters after placement. Do **not** wait to play: the first loop only *teaches* §4.6.

**E9 vs E5:** Reflections (end of chapter, active recall, in-world purpose for the child, parent-visible) are **not** the same as spaced review (`ReviewItem` / old log questions in later sessions). Keep both.

**E12:** Do **not** change the mastery formula yet. Get visuals, LLM loop, activities, story, and game structure in place first.

### 4.5 Two logins, one household (recommendation)

Yes, this is the right COPPA and UX shape.

| Role | Login | Sees |
|------|-------|------|
| Parent | Email + password (Clerk/existing auth) | Dashboard, weekly email, multiple children, billing, privacy |
| Child | Username (or child email) + PIN / simple password | Game only. Cannot see sibling data or parent billing |

Link: `Household` (or parent `User`) `1—*` `LearnerProfile` `1—1` child `User`. Child session JWT is scoped to one learner id.

**Why not one login:** A third grader sharing the parent’s Gmail, or a parent playing as the child, breaks COPPA intent and sibling privacy. A single “switch profile” after parent login is OK *as well*, but the child still needs a way to open the game on a Chromebook without the parent’s password.

**P7 stipend artifact (full MVP, not first loop):** The **same** hours + standards content is (1) a filterable parent dashboard, (2) a weekly email, (3) a printable weekly PDF, like a bank statement. Do not invent a fourth reporting system.

**Rho:** Humanoid AI First Mate. Helps in a Vygotsky ZPD way. **Does not take tests.** Parent copy may say the child is learning to work with AI.

### 4.6 Tonight’s ~10-standard slice (locked teaching corpus)

**Catalog in DB:** all G3 codes (then G4). **Teach tonight:** these clusters only. Drawn from Tutorial/early Building chapters in `grade3_curriculum_coverage.md`. Swap only if a code is missing from Prisma after seed sync.

| Subject | Topic cluster | Codes |
|---------|---------------|-------|
| Math | Place value, operations, equal groups, even/odd, area cover, data, tools | `MA.3.NSO.1.1` `MA.3.NSO.1.2` `MA.3.NSO.1.3` `MA.3.NSO.2.1` `MA.3.NSO.2.2` `MA.3.NSO.2.3` `MA.3.AR.3.1` `MA.3.GR.2.1` `MA.3.DP.1.1` `MA.3.M.1.1` |
| ELA | Informational wreck texts, writing, speech, fluency | `ELA.3.R.2.1` `ELA.3.R.2.2` `ELA.3.R.2.3` `ELA.3.R.3.2` `ELA.3.C.1.2` `ELA.3.C.1.3` `ELA.3.C.1.4` `ELA.3.C.2.1` `ELA.3.V.1.3` `ELA.3.F.1.4` |
| Science | Observe/record, spoilage/sun heat, properties, plants | `SC.3.N.1.1` `SC.3.N.1.3` `SC.3.N.1.6` `SC.3.N.1.7` `SC.3.E.6.1` `SC.3.P.8.1` `SC.3.P.8.3` `SC.3.L.14.1` `SC.3.L.15.1` `SC.3.L.17.2` |
| Social studies | Inquiry, island maps, scarcity, civic cooperation | `SS.3.A.1.1` `SS.3.A.1.2` `SS.3.A.1.3` `SS.3.G.1.1` `SS.3.G.1.2` `SS.3.G.1.4` `SS.3.G.1.6` `SS.3.E.1.1` `SS.3.E.1.3` `SS.3.CG.2.1` |

**E13 recommendation:** Tutorial science = nature-of-science + food/heat/properties + one life-science beat (plants make food / classify a beach animal). Do not teach stars/exoplanet.

**After tonight:** implement remaining G3 then G4 from the same `curriculum_resources/standards_*.ts` files. Units/chapters stay **per-student** after placement; saga spine stays shared.

### 4.7 Game / UI locks (2026-08-22 evening)

| ID | Lock |
|----|------|
| U1 | Stardew-like, **slightly more animated/modern** than pure pixel art. Not a copy of Stardew or Pokémon. Not graphic-novel watercolor for the map. Portraits may be more illustrated than tiles. |
| U2 | **Placeholder captain sprite now.** Later: unlock appearance with in-game resources / XP / perks. |
| U3 | Rho **call-anytime** (portrait/radio) + **map follower** when appropriate. |
| U4 | Click wreck → **talk first** (teaches movement) → **mini-game immediately after**. Steal Undertale tutorial beats (§4.10). |
| U5 | **Two maps:** (1) walk camera = Stardew **fog**; (2) open map = **unexplored parchment** that grows like Elden Ring — the island is bigger than they thought. |
| U6 | **Resource HUD** from the first playable loop (rations at minimum; scrap can be thin/fake at first). |
| U7 | **XP and levels are OK.** Also advance: camp development; Skyrim-like **in-game perk trees**; **standards mastery**; **real-life skills** (public speaking, NGSS Disciplinary Core Ideas as science themes later, technology skills). XP must never be the *only* juice. |
| U8 | Mic placement like **ChatGPT / Claude** (composer; mic on the input). Speak-first — §4.8. |
| U9 | **Removed as a product question.** Implementation note only: if the OS “reduce motion” setting is on, skip camera shake and fast pans so the walk loop does not make kids sick. No extra UI. |
| U10 | **Default:** Primer amber/stone for parent + chrome; island has its own palette inside Pixi. Revisit when art exists. |
| U11 | **Default:** landscape preferred on iPad; portrait still playable (map stacked). Revisit when a device is in hand. |
| U12 | **Recommendation locked:** **tap-to-move on every device** (finger/cursor sets a destination; captain walks). **WASD also** on desktop. Not “click location, teleport.” See §4.7.1. |
| U13 | **About 5** tutorial sites (beach wreck, dune, treeline, creek, camp). Arbitrary; the Tutorial definition will move. |
| U14 | **Quizzes = overlay cards** for the first playable loop. Strive to feel in-world (crate lid, log page, Rho holding a slate) even if the component is an overlay. Deeper tools (logs, measuring, projects) still go full-screen / mode-change. |
| U15 | **Removed as a vague question.** Lock: when the overworld loads, play a **soft ocean/wind bed** (looping, quiet) + UI ticks. TTS is the talking. Mute control. Silent placeholder until audio files exist — do not block the loop. |

**A3 camera (default):** limited pan inside the current region in the tutorial so the child cannot get lost; free-er camera after camp is founded.

**A5 first playable loop:** crash poster + **2 chapters** (wreck + food) + chapter reflection. This is the slice we actually put in front of a child.

**A6 / who picks:** **Student picks** which activities / missions / lessons to do. Cards show subject, theme, approximate minutes, and rewards (resources, XP, items/perks, world-state). The **saga spine is static for everyone**. Medium LLM authors that student’s Units and Chapters from the spine + placement. Tutorial first minutes are **guided** (U4), not an open mission picker.

**A7:** Hand-author the shared saga + freeze a few Chapter 1 artifacts (1 log, 1 overlay quiz, 1 reflection prompt) from the activity bank. `gpt-5.6-luna` does connective dialogue and ZPD. Medium model authors later units/chapters.

**A8:** Tonight = stills pack. Full MVP = generate every scene.

**A9:** Placeholder poster + Skip. Ivan builds Higgsfield later (§4.12).

**A10 default:** Keep current provider split unless AI Gateway makes `gpt-5.6-luna` + medium routing easier. Live turns **must** use luna.

**P1–P3 defaults (parent copy, build later):** 30-second parent home = name, minutes today/week, one story sentence, 1–3 skills in plain English. Progress words: Growing / solid / ready to show it. **No raw chat log.**

#### 4.7.1 Movement recommendation (U12)

| Approach | Pros | Cons |
|----------|------|------|
| WASD only | Stardew feel on desktop | Chromebooks/iPads; Grade 3 motor + “where is W” |
| Point-and-click teleport | Cheap | Kills Stardew body-in-the-world |
| **Tap-to-move + optional WASD (locked)** | One mental model on tablet; keyboard extra on desktop; sprite actually walks | Need simple pathing; don’t let them walk into the ocean |

**Undertale** teaches movement in a *tiny* first room so you cannot get lost. Do the same: first beach is small; wreck is obvious; Rho talks if you wander.

### 4.8 Speak-first, typing as a skill (U8)

Most third graders **cannot type fluently**. Fourth grade is when typing instruction often starts. If the first loop requires paragraphs, you lose the children who need the product most.

**Locks:**

- **Mic is first-class**, ChatGPT/Claude placement, always visible in dialogue.
- **Encourage speaking.** Rho can say “Tell me — you can talk or type a little.”
- **Answers can be short:** 1–5 spoken words, a number, a tap-choice, or a one-line type.
- **Dictation path:** speak → transcript in the box → child may edit. That *is* the typing on-ramp.
- **Do not require** a written paragraph in the tutorial. Chapter reflection may be spoken and stored as text for parents.
- **Subtle typing practice later:** label a crate, type a 3-digit count, unlock a “Guild slate” mini-game that teaches home-row as a radio skill — not a wall at minute one. Florida `ELA.3.C.1.1` (cursive) is **not** a tutorial gate.
- Overlay quizzes: tap choices + speak the free-response; typing the FR is optional.

Literacy still matters: they will **hear** rich language (TTS + lexile-matched Rho) and **speak** complete thoughts. Reading remains in ship’s-log activities (short pages, not novels).

### 4.9 Progression is four layers (U7)

Do not ship only an XP bar.

1. **XP / level** — fine, visible, not the only reward.
2. **Camp / world** — buildings, fog peeled, parchment map grown, crew found.
3. **In-game perk trees** — Skyrim-shaped (branches you can see). Spend resources/XP. Cosmetic and diegetic (better rations tools, radio range). **First playable loop:** stub one tree node or skip the UI and only grant XP + a map pin.
4. **Standards mastery** — parent-facing; light diegetic (“Rho trusts your measuring”). Keep current formula.
5. **Real-life skills** — public speaking, technology, and later NGSS **Disciplinary Core Ideas** as science *themes* (Florida codes remain the MVP measurement). Store as tags on activities; do not build a second report card in the first loop.

### 4.10 Undertale tutorial beats to steal (U4)

Undertale does not open a manual. A companion **talks**, the first space is **tiny**, and the first “fight” is a **supervised practice** of the real verb.

Steal, without copying characters or combat:

1. **Tiny first room** — beach wreck only; other pins locked until the mini-game completes.
2. **Rho talks immediately** — no silent HUD.
3. **Teach one verb at a time** — walk to the wreck (movement) → talk (dialogue UI + mic) → overlay quiz (activity verb).
4. **Supervised practice** — Rho watches the first quiz like Toriel watches the dummy; flavor lines if you miss, praise if you spare/succeed.
5. **Gentle gate** — if they walk away, Rho **calls** (U3) rather than a hard fail.
6. **In-world save** — camp/fire/log as the “save point,” not a system menu.
7. **Identity first** — captain `displayName` already from onboarding; Rho uses it.
8. **Reactive flavor** — short unique lines for “tried to type a novel,” “only tapped,” “spoke clearly.”

Do **not** steal Undertale’s FIGHT/MERCY moral test or bullet-hell. The “dummy fight” **is** the first overlay quiz / salvage count.

### 4.11 What to put in Prisma (E2) — recommendation

**Why the 80 `seedGap` mattered:** `prisma/seed.ts` used to load **thin** math/science/SS slices (and `OLDstandards_ela_grade3.ts`). About **80 Grade 3 codes** lived only in `curriculum_resources/`. **SUPERSEDED 2026-08-22:** seed imports the full authoring catalogs and `npx prisma db seed` loaded **127** `Standard` rows. Next Step 0: wire `from_grade3_bank.ts` (still unwired on purpose).

| Layer | Put in Prisma? | When |
|-------|----------------|------|
| **All G3 standards** (then G4) | **Yes.** Global catalog. | **Before** wiring the activity bank. First coding session. |
| **Activity bank** (`grade3_activity_bank.ts` → `from_grade3_bank.ts`) | **Yes.** Global templates tagged to codes. | Immediately **after** catalogs sync. First loop may only *play* the §4.6 slice; the rest can sit unused. |
| **Checkpoint / assessment templates** | **Yes.** Global. | After activities, or same seed pass. Not required to *play* chapter 1. |
| **Shared saga spine** (epochs, 6 units / 19 chapters, checkpoints narrative) | **Keep in TypeScript** (`grade3_castaway_curriculum.ts` + `_shared_castaway_world.ts`). Copy onto the child’s `StoryWorld` / `Chapter` at onboarding. | Instantiation = first loop. New `SagaTemplate` SQL tables are optional later (CMS), not required to play. |
| **Per-student Units/Chapters** | Generated/revised by **medium** LLM from the spine + placement. Not a static seed of 10,000 custom rows. | After tutorial/placement. First loop may use the **default** Ch1–Ch2 planners from the TS curriculum. |

**Alternatives considered:** (B) catalogs only, generate activities live — quality swings, no proof. (C) seed catalogs + generate chapters with no bank — same problem. **Chosen (D):** seed **standards + bank + checkpoint templates**; keep saga as **code templates**; customize per child after placement.

**First playable loop vs full MVP**

- **Now (blocking the bank):** replace thin prisma seeds with full `curriculum_resources` G3 files; stop OLD ELA import; `npx prisma db seed`; then import `from_grade3_bank.ts`.
- **Now (enough to play):** instantiate default wreck+food chapters; stills placeholders; luna dialogue; one overlay quiz.
- **After the loop feels like a game:** G4 catalogs, parent dashboard/email/PDF, dynamic scene images, Higgsfield mp4, perk tree UI, cosmetics, two-login household polish, remaining 127-code *gameplay*.

### 4.12 Higgsfield intro + stills pack

**Tonight:** `public/cinematics/README.md` + poster slot. Skip control. **Do not block on video.**

**Aspirations for `crash_landing.mp4` (45–90s, Ivan later):** Guild scout ship in weather; young-adult crew; **Rho** (humanoid AI) calm on the bridge; violent weather **without gore**; crash implied, survivors on a dawn beach; fog; the island already feels larger than the wreck; end on the child-captain waking so Pixi can take over. Wonder + urgency + safety. No exoplanet reveal.

**Video / image generation prompt (Higgsfield, Runway, or similar):**

> Cinematic 16:9, 60–90 seconds, family-friendly, no blood or corpses. A small Guild scout airship fights a storm over a vast green island. On the bridge: a young-adult humanoid AI first mate (Rho) with calm luminous eyes, and a child captain seen from behind or as a silhouette. Lightning, rain, metal groaning. Cut: wreckage on a golden dawn beach, crates in the surf, fog in the trees. The camera lifts — the island is huge, unexplored parchment-map feeling. Soft orchestral + ocean. End card: the child sits up in the sand. Style: modern animated adventure, Stardew-like warmth but smoother motion, not a pixel-art game trailer, not a graphic novel. Photoreal faces avoided; illustrated characters.

**Stills Ivan must generate** — titles, filenames, insertion points: `public/stills/tutorial/README.md`. Agents: if a file is missing, placeholder rectangle + `TODO(stills)` — **do not crash.** Full MVP: generate every scene dynamically; keep this pack as fallback.

### 4.13 IEP and Florida Access Points

**Locked:** I1 = (a)+(b). I2 = **TTS/STT only** (plus lexile already in the product). I3 = parent **settings**: checkboxes + text. I4 = **do not play Access Points now.** I5 = **no** dedicated ADHD / dyslexia / speech / low-vision / AAC modes.

**What Access Points are:** Florida **Access Points** are *alternate* achievement standards (codes like `MA.3.NSO.1.AP.1`) for students with **significant cognitive disabilities**, usually aligned to the Florida Alternate Assessment — a different bar (smaller numbers, more visuals, fewer steps). They are **already listed as strings** on many rows in `curriculum_resources/standards_*_grade3.ts` (`accessPoints: [...]`). They are **not** a second seeded catalog in Prisma today.

**To “do Access Points for real” you would need:** store each AP as a playable `Standard` (or linked alternate), author easier activities, different mastery rules, and IEP-team reporting. That is a **second curriculum**. Given I5, it is **unnecessary for the first product**. **Do:** persist AP text on the standard for later. **Do not:** branch gameplay onto AP codes.

**IEP in this product:** parent notes goals and TTS/STT; we report Florida B.E.S.T./CPALMS evidence. We are **not** the child’s legal IEP service (the district/private team is).

### 4.14 Time tracking (no cap yet)

Record: **lifetime**, **per session** (wall clock, even if they jump lessons), **per lesson / chapter / unit**. No daily cap in the first loop. Hidden timers for the child unless toggled. Parent dashboard later uses these numbers.

---

## 5. Three-layer data architecture (the Plaud "secret sauce")

Everything the orchestrator needs is one of three things. If a proposed table is not one of these, question it.

```
┌─────────────────────────────────────────────────────────────┐
│  LAYER 3 — STORY ELEMENTS                                    │
│  Epoch → Unit → Chapter → Lesson/Session                     │
│  Crew, map, camp, resources, branches, bible                 │
└───────────────────────────┬─────────────────────────────────┘
                            │ "why it matters in the world"
┌───────────────────────────▼─────────────────────────────────┐
│  LAYER 2 — LEARNING ACTIVITIES                               │
│  Amplify "evidence sources & reflection opportunities"       │
│  What the student actually does this hour                    │
└───────────────────────────┬─────────────────────────────────┘
                            │ "which skills this work proves"
┌───────────────────────────▼─────────────────────────────────┐
│  LAYER 1 — STANDARDS                                         │
│  Florida CPALMS / B.E.S.T. codes, descriptions,              │
│  misconceptions, vertical alignment                          │
└─────────────────────────────────────────────────────────────┘
```

The AI does **not** invent standards. It **selects** activities and **narrates** story using standards already in the DB. Activities may be hand-authored (preferred for MVP quality) or generated from templates **validated against injected codes**.

### 5.1 Layer 1 — Standards

**Purpose:** Official learning targets. Parent reporting. Orchestrator constraint. Mastery math.

**Authoritative catalogs on disk** (`curriculum_resources/standards_[subject]_[grade].ts`) — list every file; do not treat a glob as the inventory:

| File | Subject | Grade |
|------|---------|-------|
| `curriculum_resources/standards_ela_grade3.ts` | ELA | 3 |
| `curriculum_resources/standards_ela_grade4.ts` | ELA | 4 |
| `curriculum_resources/standards_ela_grade5.ts` | ELA | 5 |
| `curriculum_resources/standards_math_grade3.ts` | Math | 3 |
| `curriculum_resources/standards_math_grade4.ts` | Math | 4 |
| `curriculum_resources/standards_science_grade3.ts` | Science | 3 |
| `curriculum_resources/standards_science_grade4.ts` | Science | 4 |
| `curriculum_resources/standards_social_studies_grade3.ts` | Social studies | 3 |
| `curriculum_resources/standards_social_studies_grade4.ts` | Social studies | 4 |

Also present: `curriculum_resources/grade4_science_scraped.json` (scrape companion to science G4).

**What Prisma actually loads today** (`prisma/seed.ts`): full Grade 3 catalogs from `curriculum_resources/standards_*_grade3.ts` (math, ELA, science, SS). `prisma/seeds/standards_*_grade3.ts` re-export those files. `OLDstandards_ela_grade3.ts` is unused legacy. Grade 4 and ELA G5 catalogs are **authored, not seeded**.

| Grade | Domain | Canonical authoring file | Seed / runtime |
|-------|--------|--------------------------|----------------|
| 3 | ELA | `curriculum_resources/standards_ela_grade3.ts` | seeded (re-export via `prisma/seeds/standards_ela_grade3.ts`) |
| 3 | Math | `curriculum_resources/standards_math_grade3.ts` | seeded (re-export via `prisma/seeds/standards_math_grade3.ts`) |
| 3 | Science | `curriculum_resources/standards_science_grade3.ts` | seeded (re-export via `prisma/seeds/standards_science_grade3.ts`) |
| 3 | Social studies | `curriculum_resources/standards_social_studies_grade3.ts` | seeded (re-export via `prisma/seeds/standards_social_studies_grade3.ts`) |
| 4 | ELA | `curriculum_resources/standards_ela_grade4.ts` | not seeded |
| 4 | Math | `curriculum_resources/standards_math_grade4.ts` | not seeded |
| 4 | Science | `curriculum_resources/standards_science_grade4.ts` | not seeded |
| 4 | Social studies | `curriculum_resources/standards_social_studies_grade4.ts` | not seeded |
| 5 | ELA | `curriculum_resources/standards_ela_grade5.ts` | not seeded |

Supporting:

- `curriculum_resources/cpalms-standards-researcher-SKILL.md` — how to fetch/verify more standards
- `curriculum_resources/cpalms_supplementary_resources.md`
- Markdown dumps: `grade3_*_standards.md`, `grade3_8_benchmarks_ela_standards_*.md`
- Seed types: `prisma/seeds/types.ts` (`SubjectSeed`)
- DB: `Subject`, `StandardsCatalog`, `Strand`, `StandardGroup`, `Standard` in `prisma/schema.prisma`
- Injection: `lib/services/standardsCatalog.ts`
- Mastery: `lib/services/standardsProgress.ts`, `lib/services/standardsMasteryMath.ts`

**Rules:**

- Codes in prompts must come from the catalog, never model memory.
- **Authoring files in `curriculum_resources/` are the Layer 1 inventory.** G3 seeds re-export them; expanding Grade 4+ into `prisma/seed.ts` is still a data job.
- Grade 4 + ELA Grade 5 files exist on disk; wiring them into `prisma/seed.ts` is how the corpus becomes playable.
- Science G3 authoring file includes N, E, P, L — not just Nature of Science.

**Coherence mapping:** each chapter's `plannerJson.subjectPlans[slug].targetStandardCodes[]` is a **small** subset (2–4 codes per lens per chapter). Do not dump 50 math standards into every turn.

### 5.2 Layer 2 — Learning Activities

**Purpose:** Amplify's "evidence sources and reflection opportunities." This is **what the student actually does**.

The Plaud vision (not just the current Prisma enum): a **bank** of reusable activity templates, each tagged to standard codes. The **session orchestrator** does not invent the skill target. It (1) reads the current chapter + learner gaps from Layer 1, (2) **selects** a bank template, (3) **wraps** it in the live story (names, wreck, Rho, camp), (4) **calls a module** that instantiates that kind of activity in the UI.

```
Standards (what must be learned)
    → Curriculum (when in the saga; which checkpoint proves it)
        → Activity bank (reusable templates: kind + rubric + codes)
            → Orchestrator (story wrapper for THIS captain, THIS beach)
                → Activity module (Reading / Dialogue / Quiz / Plan / …)
                    → StandardsEvidence
```

Current Prisma `ActivityKind` is a **subset**. Extend the enum as modules ship.

#### Activity kinds (vision → modules)

| Kind | What the student does (from product vision) | Module (to build) | Evidence | When |
|------|---------------------------------------------|-------------------|----------|------|
| **Ship's log reading** | Read articles / torn Guild pages / wreck manifests; decide or answer from comprehension | `ReadingModule` | GUIDED | MVP |
| **Island book** | Longer books found on the island (literary + informational) | `ReadingModule` (long) | GUIDED | Building+ |
| **Crew dialogue** | Talk with Rho, engineer, scientist, sergeant, logistics — type and/or speak | `CrewDialogueModule` | CONVERSATIONAL | MVP |
| **Plan / logic writing** | Write ration plans, search grids, camp rules, Guild aid requests | `PlanWritingModule` | GUIDED | MVP |
| **Calculator** | In-world calc for measurement, division, calories | `CalculatorModule` | GUIDED | Thin MVP |
| **Camp spreadsheet** | Super-simple grid (rations, inventory, trade) — not real Excel | `SpreadsheetModule` | GUIDED | Building |
| **Mini-quiz** | MC + free response; LLM grades FR; feedback + retry loop | `MiniQuizModule` (exists) | GUIDED | MVP (exists) |
| **Standards checkpoint test** | School-mirroring test; **big in-game reward** after (resources, map, skins) | `CheckpointTestModule` | CHECKPOINT | After 2–3 chapters |
| **Chapter reflection** | Write what was learned **for the crew** (ostensible) and parents (real) | `ReflectionModule` | GUIDED / CHECKPOINT | **Essential MVP** |
| **Speech / briefing** | Mic: explain to crew, public speaking, later empathy/mutiny | `SpeechModule` | GUIDED | MVP mic on input; graded speeches soon |
| **Creative project** | Decorate camp, design flag/poster, generate images (in-world; later out-of-world) | `CreativeProjectModule` | GUIDED | Phase 2–3 |
| **Map exploration** | Expand fog, choose camp site on Pixi island | `MapExploreModule` | CONVERSATIONAL | With Pixi |
| **Interactive sort / build** | Drag-drop, number builder, arrays | `InteractiveGameModule` | GUIDED | When components exist |
| **Story scene / choice** | Branch that changes camp/crew (not a quiz) | `StorySceneModule` | CONVERSATIONAL | MVP |

**Reflection is not optional.** Diegetic frame: instructions so a missing crewmate or the next watch can follow what you learned.

**Checkpoint tests** sit slightly "outside" the fiction as Guild inspections, then pay **diegetic** rewards so they still feel like the game.

**Grading loop (mini-quiz + free response):** submit → MC scored deterministically / FR via LLM rubric → narrative consequence + retry/scaffold → `StandardsEvidence` → weak items become `ReviewItem`.

#### Orchestrator contract (implement against this)

```
select_activity({
  chapterId, subjectSlug, learnerId,
  targetStandardCodes[],   // from curriculum + gaps
  preferredKind?: ActivityKind
})
  → bank template (HAND_AUTHORED preferred)
  → fillStorySkin(template, worldState, displayName)
  → instantiate Module[template.kind]
  → onComplete: write evidence + optional ReviewItem
```

- **Do not** generate standard codes. **Do** generate surface story (who is speaking, which crate).
- If no bank template fits, `generate_learning_activity` is fallback **only** with codes from the injected catalog.

Implementation today: `LearningActivity*` models, `lib/services/learningActivities.ts` (mini-quiz), tools in `sessionOrchestrator.ts`.

**Authoring rule:** templates tagged `chapterTag: "g3_chN"` **or** `curriculumUnitId` + `subjectSlug` + `targetStandardCodes[]`. Grade 3 bank: `curriculum_resources/grade3_castaway_curriculum.ts` + `grade3_activity_bank*.ts` (177 templates, 127/127 codes). Bank is seeded via `from_grade3_bank.ts` in `prisma/seed.ts`.


### 5.3 Layer 3 — Story elements (multiple layers)

Story is a **tree**, not a chat log.

```
SAGA (multi-year program)
  └── EPOCH (Crash → Tutorial → Building → Guild Contact → Enterprise)
        └── UNIT (coherence "unit design problem" / sub-phenomenon)
              └── CHAPTER (anchor phenomenon + chapter question)
                    └── LESSON / SESSION (investigation cycle + activities)
```

**World bible (shared, all subjects):** crash, Guild mission, scattered parachutes, tropical island bigger than it looks, captain = learner, sidekick always present. Exoplanet + rival continent = **late** reveal.

**Game-state objects (build incrementally):**

- Crew roster (found / missing / rival)
- Map regions (fog, standardized core + personalized edges — Quay/Ivan: some island is shared, some is custom)
- Camp level (site chosen → tents → buildings)
- Resources (food, timber, scrap, morale) — earned from **chapter/mission completion**, spent on build/trade/recruit
- Communication tower progress
- Guild standing
- Rival faction / mutiny flags (post-MVP epochs)

Existing schema already has: `StoryWorld`, `StoryArc`, `Chapter`, `StoryState`, `BranchPoint`, `CharacterPortrait`.  
**Gap:** `StoryArc` currently requires `standardsCatalogId` (one catalog). For a **shared multi-subject arc**, either (a) pin the arc to the world and put catalogs on `subjectPlans`, or (b) keep a primary catalog and treat others as session-level. Prefer (a) when you touch schema — log it in §18.

---

## 6. Saga spine — checkpoints for the whole program

These are **years of play**, not one sprint. MVP implements **Crash + Tutorial** and the **opening of Building**. Everything after is designed so later agents do not paint into a corner.

### Epoch 0 — Crash landing (cinematic)

- Higgsfield (or equivalent) **canonical** video: ship in storm, ejector seats, parachutes, beach.
- PG: crew ejects; no death spectacle.
- Player wakes as captain. First still images from GPT Image pipeline (`docs/decisions-scene-images.md`).
- **Future:** Higgsfield/dynamic video per student — not MVP (cost + latency). Images **are** MVP.

### Epoch 1 — Tutorial Phase (MVP core)

1. **Gather immediate core crew**
   - First Mate (tutorial NPC — likely Rho): how the game works, "we have to rebuild a ship *and* contact civilization")
   - Engineer (specified in Plaud as girl/woman)
   - Scientist (understand the island)
   - Sergeant (protection / order)
   - Logistics / quartermaster / trader-prospector (resources)
2. **Get food** and explore **immediate** surroundings (science + math rations)
3. **Decide camp location** (measurement, maps, argument writing)

Doctor, extra security, and distant crew come **later**.

### Epoch 2 — Building Phase (long; tons of units/chapters)

- Set up initial camp
- Explore island; **expanding in-game map** that stays readable
- Develop camp: people, resources, tents → buildings
- Resource economy: complete missions/chapters → resources → build / trade / recruit
- **Checkpoint:** all *nearby* original crew recovered (island still huge — maybe a continent)
- Confront disease, food shortages, and dangerous animals (science + data + ethics). Sickness and death may occur in the *plot* but are never depicted on screen — a crew log, an empty bunk, Rho's voice catching, not bodies or gore
- Build **radio / communication tower** to reach the other landmass and the Guild

### Epoch 3 — Contact with the Guild

- Request resources; write plans for how they will be used (ELA + SS + math)
- Develop extraction capabilities
- Discover **rival civilization** funded by a competing company (strategy, logistics — not gore)
- **Internal mutiny:** Rho (First Mate) leaves with half the people — **betrayal, not a battle**. Jealousy, frustration, insecurity, hurt loyalty. Reunion is moral reasoning + communication + empathy. Microphone for public speaking + AI feedback. No weapons-as-play, no on-screen harm.
- **End of island survival arc:** build a ship that can **export resources to the Guild mainland** and open the next epoch

### Epoch 4 — Enterprise Phase

- Found a company; manufacturing complexity increases
- Business, sales, finance, management via NPCs
- Geography of the new world **and Earth**; international trade
- Eventually: learner-directed goals; AI generates scenarios inside the world bible they have earned

**Hidden through all of this:** this island is not Earth; the Guild's true nature unfolds slowly; the captain's distant future is space-faring.

### Cross-subject integration (how four subjects stay one game)

Reuse the chapter matrix from the May spec, updated for this spine. Tutorial example:

| Chapter | Story beat | Math | ELA | Science | Social studies |
|---------|------------|------|-----|---------|----------------|
| Crash / beach | Survey wreck | Units, estimation | Read torn Guild orders; first log | Tide, weather, salvage properties | Crew roles, who decides |
| Food | Rations | Equal groups, fractions | Persuade hungry crew | Spoilage, needs of organisms | Fairness |
| Camp site | Choose ground | Area, measurement | Argument for the site | Habitat, water | Governance of the camp |
| Search | Find engineer | Arrays, distance | Trail notes, inference | Animal signs | Search-party rules |

**Shared `StoryState.currentChapterNumber`.** Switching subject changes the **lens**, not the island.

---

## 7. Immersion stack — see, hear, speak, type

The bar: a child should not feel they opened a chatbot. They opened a **place** (Stardew), then **talked to a person** (cutscene), then **did real work** (activity tool).

### 7.1 Three modes (locked)

| Mode | What the child sees | Input |
|------|---------------------|-------|
| **Overworld (HOME)** | Top-down Pixi island. **Tap-to-move** + desktop **WASD**. Stardew **fog** while walking. Resource HUD. Rho follower when appropriate. | Move, tap objects/people, call Rho |
| **Dialogue cutscene** | Overworld paused. **Transcript LEFT, portrait RIGHT.** ChatGPT-style mic. Speak-first. | Speak or short type; lexile-matched |
| **Activity** | **Overlay card** for quizzes (MVP). **Full-screen / mode** for logs, measuring, projects, mini-games. | Tool + luna hints |

**SUPERSEDED:** `/learn` as graphic-novel home (70% story cards). Reuse its streaming, bubbles, and activity cards **inside** dialogue + tools, not as the app shell.

### 7.2 Stack

| Layer | MVP | Next | Later |
|-------|-----|------|-------|
| World / map / camp | **PixiJS** Stardew-like top-down | Particles, weather, more regions | Quay/Unity only if we leave the web client |
| Dialogue | Left chat / right portrait | Portrait lip/idle anim | Full cutscene camera |
| Activity tools | Quiz, journal, reading, calc stub | Spreadsheet, speech rubric, project submit | Boss / Guild inspection |
| Still portraits / scenes | **Stills pack** `public/stills/tutorial/` | Dynamic gen every scene (full MVP) | Style lock |
| Intro video | Placeholder poster + Skip | Higgsfield `crash_landing.mp4` | Epoch cinematics |
| Ambient audio | Soft ocean/wind loop when overworld starts (file may be silent placeholder) | UI ticks, more beds | — |
| Parchment map | Overlay that grows as regions unlock (Elden Ring–like) | More atlas pages | Guild atlas Earth |
| 3D | **Out.** No Three.js | — | — |
| Voice out | OpenAI TTS | Cached lines | ElevenLabs if needed |
| Voice in | OpenAI STT; transcribe and discard | Graded speech | — |
| Models | Live: **`gpt-5.6-luna`**. Plan units/chapters: medium reasoning | Router by task | — |

**PixiJS is now in scope** (D answered). First loop may be colored tiles + 5 pins + stills; art polish later.

---

## 8. Measurement and parent reporting

Without this, Primer is a pretty game. With this, it is an **ESA-eligible learning product**.

**Build order:** student game first; parent dashboard after a child can finish a chapter. Schema for household + two logins should exist before Florida testers.

**Learner-facing:** mastery as qualitative ("Rho trusts your measuring") plus map/camp unlocks. Reflections are **in-world** ("write the missing engineer so she can follow the ration plan") — the pedagogical purpose is active recall; the game purpose is a crew message. Do not dump `ELA.3.R.1.1` on an 8-year-old unless they ask.

**Parent-facing (lock):**

- Dashboard: time spent **by day and week** (and later per lesson/chapter/unit); mastery of standards **across subjects**; succeeding vs struggling standards
- **School-equivalent tests** at **end of chapters and units**
- Child **chapter reflections**
- **Weekly email** + **weekly printable PDF** (same content as the dashboard — hours + standards, bank-statement style). Full MVP.
- Parent settings: IEP goal text + checkboxes + TTS/STT already on
- Rho is a humanoid AI First Mate; does not take tests

**Evidence tiers** (keep for now): `CONVERSATIONAL` < `GUIDED` < `CHECKPOINT`. Checkpoint / unit tests move mastery more, and pay **spectacular** in-world rewards after a **mini in-game project** (boss / Guild inspection) — not a gate on Chapter 1.

**Scoring redesign:** do **not** block the 10-standard slice. Keep `standardsMasteryMath`. Redesign after that slice produces data. Hard deadline: tests must be defensible before ESA sales.

**Quay asked for hourly parent push.** Locked: weekly email + dashboard. Never hourly.

Existing code: `app/progress/*`, `lib/services/progress.ts`, `StandardsEvidence`, `SkillProgress`.

---

## 9. What is already built (do not rebuild)

Agents: inventory before coding.

- Auth, onboarding (`displayName`, goals, interests, auto-enroll G3 cores)
- Session start/stream/complete
- ContextBuilder + SessionOrchestrator + MemoryExtractor + image tool
- Standards catalogs + observation tools + mastery math
- Mini-quiz generation/grading
- StoryWorld / Arc / Chapter / StoryState
- Prompt templates: `lib/ai/promptTemplates/` including `_shared_castaway_world.ts`
- Progress pages and SSE activity/observation cards

**Likely gaps vs this plan:** shared multi-subject `StoryState` vs per-catalog arc; incomplete science G3 seed; Grade 4 not seeded; activity kinds beyond mini-quiz; Pixi overworld + dialogue cutscene; map/resources; TTS/STT; Higgsfield asset slot; chapter reflections as first-class artifacts; parent dashboard; `gpt-5.6-luna` router (orchestrator may still say `gpt-5.4-mini`); household two-login model.

---

## 10. Product development phases

### Phase A — First playable loop (immediately after catalog seed)

**Goal:** A real 8-year-old can play ~15 minutes on a tiny beach, talk to Rho (speak or short type), finish one overlay quiz, and want to continue. **Teaching corpus:** §4.6. **Do not wait for G4 or parent PDF.**

Order: **§11** (seed catalogs → bank → shell). Must include:

1. Poster intro (Higgsfield later)
2. Captain `displayName`; **Rho = humanoid AI First Mate** (call + follower)
3. Wreck → talk (movement tutorial) → mini-game; **tutorial = placement**
4. Overlay quiz + luna ZPD; speak-first
5. Stills pack / placeholders; resource HUD; XP stub OK
6. Time tracking (session + activity)
7. Evidence on `/progress` (even if ugly)
8. Prisma: full G3 standards + activity bank wired
9. Chapter reflection at chapter end (may be spoken)

---

### Phase B — Tutorial complete (core crew + camp decision)

Find remaining core five; choose camp; expanding map v1; 5 hand-authored activities × remaining tutorial chapters for **math**, templates for other lenses.

### Phase C — Building economy + measurement depth

Resources, camp upgrades, checkpoint test + boss reward, parent dashboard, richer speech activities, Expedition Day (multi-lens same scene).

### Phase D — Guild contact + mutiny (content + voice empathy)

Only after Phase C retention is real. Mutiny is high-emotion; needs safety design.

### Phase E — Enterprise + learner-directed generation

Requires a strong bible, resource sim, and content filters.

### Partner track (parallel, not blocking)

Quay/Unity sample level using **this** spec's Chapter 1. Do not split narrative. Specs Quay asked for: lesson examples mapped to Florida codes, gameplay, reporting mock.

---

## 11. First playable loop — implementation order

“Tonight” = the **first playable loop** we put in front of a child. Not the full G3+G4 product.

### Step 0 — Data (do this first; blocks the activity bank)

1. Point `prisma/seed.ts` at full G3 catalogs from `curriculum_resources/standards_*_grade3.ts` (or copy those files into `prisma/seeds/` and stop importing `OLDstandards_ela_grade3.ts`).
2. `npx prisma db seed` — **80 seedGap codes must disappear.**
3. Wire `prisma/seeds/activities/from_grade3_bank.ts` into `seed.ts` so `LearningActivity` rows exist and link to `Standard` ids.
4. Instantiate default **wreck + food** chapters from `grade3_castaway_curriculum.ts` onto the test learner (saga stays TS templates; see §4.11).

**Do not** skip Step 0 and then wonder why quiz evidence has no standard id.

### Step 1 — Three-mode shell (same coding session if Step 0 is done)

- **Home:** Pixi (or a honest Pixi stub: tiles + 5 pins). Tap-to-move + WASD. Fog. Resource HUD. Placeholder captain sprite.
- **Intro:** stills poster + Skip (`public/cinematics/README.md`).
- **U4 flow:** click wreck → dialogue (left chat / right Rho still) → overlay quiz immediately.
- Rho **call** button + follower sprite if the still exists, else a circle.
- Live model **`gpt-5.6-luna`**. Mic in the composer (STT if you can; otherwise speak-encouraging copy + type).
- Time: session start/end + activity start/end.
- Missing images: `TODO(stills)` rectangles, never crash.

### Step 2 — Out of the first loop (full MVP)

G4 catalogs; remaining G3 *gameplay*; parent dashboard + weekly email + weekly PDF; dynamic scene images; Higgsfield mp4; perk trees; cosmetics; household two-login polish; school-equivalent tests after a mini-project; Access Points gameplay (not planned).

**Out forever for this product direction:** Three.js, graphic-novel-as-home, language-tutor as the product, hourly parent spam, XP as the only reward.

---

## 12. Agent operating system (how to fan out without chaos)

### 12.1 Default: sequential vertical slice

Tonight, **one** main agent owns the slice. Sub-agents are for **read-only research** or **isolated files** with a written contract.

```
Main agent (this plan)
  ├─ 0. Re-read §4.11, §11, §16
  ├─ 1. Sync G3 prisma catalogs; wire activity bank
  ├─ 2. Instantiate wreck+food chapters for the test learner
  ├─ 3. Pixi home + dialogue overlay + overlay quiz (U4)
  ├─ 4. luna router + stills placeholders + time tracking
  ├─ 5. Update §18 log + checkboxes
```

### 12.2 When to fan out (after contracts exist)

Safe parallel **after** schema and chapter tag conventions are stable:

| Sub-agent | Allowed work | Forbidden |
|-----------|--------------|-----------|
| Standards seeder | Copy G4 TS → `prisma/seeds`, wire `seed.ts` | Changing mastery math |
| Activity author | Write 5 math activities for `g3_ch1` | New ActivityKind without enum PR |
| Image/cinematic | Prompts, Higgsfield brief, `public/` assets | New image models in orchestrator |
| QA | Vitest for mastery + seed smoke | Rewriting product copy |
| Docs | Sync this log | Inventing new epochs |

**Never** parallelize two agents on `prisma/schema.prisma`, `sessionOrchestrator.ts`, or `learn/[sessionId]/page.tsx`.

### 12.3 Recursive discovery loop (copy into sub-agent prompts)

```
WHILE task incomplete:
  1. Identify the smallest unknown (standard code, file path, UX beat).
  2. Resolve from §16 File Map → then codebase grep → then curriculum_resources.
  3. If still unknown: write a §17 question; implement a stub with a TODO citing this plan.
  4. Implement the smallest testable increment.
  5. Run: tsc + npm test + relevant seed smoke.
  6. Append §18 Implementation Log.
  7. Re-read §11. If you drifted, revert or log a deliberate pivot.
```

### 12.4 Quality gates before calling a slice "done"

- `npx tsc --noEmit`
- `npm test`
- Manual: onboarding → session → quiz → reflection → `/progress` shows evidence
- No hallucinated standard codes in a logged tool call

Policy: `docs/testing-maturity-roadmap.md`, `docs/vitest-testing-guide.md`.

---

## 13. Cross-curriculum activity design (worked example)

**Chapter question:** Why won't the wrecked stores last until we find the crew?

**Investigation question:** How do we share food fairly when we don't know how many days until rescue?

**Evidence sources (activities):**

1. Read the torn quartermaster page (ELA)
2. Count salvage with the First Mate (math mini-quiz + calculator)
3. Science: which foods spoil (sort activity)
4. Write camp ration rules (SS + ELA)
5. **Reflection:** "Tell the missing engineer what we decided and why, so she can follow it when she arrives."

**Key concepts:** equal groups; survival needs; a written plan is how a crew remembers.

**Application:** player chooses: equal shares vs extra for searchers (branch). Wrong math → ZPD hint/tool/example, then hungry crew if they persist (story), not a red X only.

**Explanation the student can make:** because we measured and divided, we know how many days we have if we find two more people.

This is the snails flowchart, transplanted to the beach.

---

## 14. GTM (locked sequence)

1. **Direct-to-consumer Florida** — parents who already receive homeschool / ESA stipends  
2. **Associations & programs** — homeschool groups, Step Up For Students, similar  
3. **Homeschool-friendly states** — Arizona, Utah, West Virginia  
4. **Private schools** — Texas and New York  
5. Districts / Steam / tablets — only after measurement and retention are real  

COPPA still applies at step 1 (two logins, one household). Stipend eligibility is a sales/ops workstream, not a substitute for privacy design. Florida-only standards in the MVP; NGSS/Common Core later.

---

## 15. Master checklist

### P0 — Data + orchestrator truth

- [x] Audit G3 seeds vs `curriculum_resources` — 127 authoring codes; **80 seedGap** (math 28, science 22, SS 30). ELA authoring seed is complete; `seed.ts` may still import OLD ELA.
- [x] Replace G3 prisma math/science/SS slices with full `curriculum_resources` catalogs; point `seed.ts` at authoring catalogs (not OLD) — **done before the activity bank**
- [x] Seed activity bank after catalog sync (`from_grade3_bank.ts`)
- [ ] Seed Grade 4 catalogs into Prisma (`ela/math/science/ss`) — after first playable loop is OK
- [ ] `buildSystemPrompt` always includes shared castaway bible + chapter `plannerJson` + **session subject** standards only
- [x] `record_standard_observation` rejects unknown codes
- [x] Shared story chain: one world, one saga, four lenses (`ensureLearnerStoryChain`)
- [ ] Schema decision logged: `StoryArc.standardsCatalogId` vs shared arc

### P0 — Tutorial vertical slice

- [x] Chapter 1 plannerJson (wreck / First Mate / food) instantiated from `grade3_castaway_curriculum.ts`
- [x] Captain = `displayName`; Rho = humanoid AI First Mate (call + follower); never steals hero role
- [x] Intro poster slot + Skip (`public/cinematics/`); Higgsfield later
- [x] Pixi home: tiny beach, tap-to-move + WASD, fog, resource HUD, placeholder captain
- [x] U4: click wreck → dialogue (left/right) → overlay quiz
- [x] Stills placeholders (`public/stills/tutorial/`) — no crash if files missing
- [x] Speak-first mic in composer; STT when wired; short type fallback
- [x] Mini-quiz overlay + luna ZPD (no static retry-only) — overlay is bank MC; ZPD is luna after submit + scaffold hints
- [x] Time tracking: session + activity
- [x] **Chapter reflection** (spoken OK) persisted
- [x] Memory `STORY_BEAT` on complete

**Step 1 closeout (2026-08-22) — done / leftover / debt**

Done: three-mode shell (intro → Pixi beach → dialogue cutscene → overlay quiz); Rho radio + follower; `gpt-5.6-luna` live turns; whisper STT (audio discarded); stills placeholders; session `startedAt`/`completedAt` + quiz `LearningActivityCompletion` start/end.

Not this slice (still open above / P1+): TTS, parchment map overlay, Higgsfield mp4, real stills art, parent dashboard, mastery redesign, full-screen activity tools.

Technical debt (defer to end of this plan unless a later step naturally clears it):
1. Per-turn `generate_scene_image` is **disabled** (stills pack). Handler remains; re-enable for full-MVP dynamic scenes.
2. Overlay quiz uses MC items only from `g3-ma-wreck-number-forms` (drops the bank free-response item).
3. Rations / XP HUD are client stubs — not persisted; not tied to chapter complete (P2).
4. Ambient ocean bed is silent; mute control not wired (U15 placeholder).
5. Intro Skip is `localStorage`, not per-learner server state.
6. Walk is straight-line + axis slide, not A* pathing.
7. Graphic-novel `ScenePanel` is unused as home (kept for possible still reuse).
8. STT is `whisper-1`, not luna; requires mic permission + `OPENAI_API_KEY`.
9. `PlayShell` is slightly over the 250-line component guideline.

### P1 — Tutorial crew + camp

- [ ] Crew roster model (found flags)
- [ ] Parchment map overlay that grows; walk fog
- [ ] Camp site choice branch
- [ ] XP + camp pin (perk tree UI later)
- [ ] TTS for Rho (OpenAI)
- [ ] Parent account linked to child account(s) (COPPA-ready)
- [ ] Parent dashboard + weekly email + weekly PDF (full MVP, after student loop)

### P2 — Immersion + measurement

- [ ] STT speech activity
- [ ] Checkpoint assessment + diegetic reward
- [ ] Resource counters tied to chapter complete
- [ ] SortingTable / NumberBuilder
- [ ] Canonical stills pack filled by Ivan; then dynamic scenes for full MVP
- [ ] Playwright happy path (see testing roadmap)

### P3 — Building epoch depth

- [ ] Tower quest line
- [ ] Disease/food/animal units mapped to science standards
- [ ] Grade 5+ catalogs when G3–4 loop is proven

### P4 — Guild / mutiny / enterprise (design only until P2 retention)

- [ ] Safety spec for mutiny + speech grading
- [ ] Rival company conflict without graphic violence
- [ ] Company/finance units

### Agent hygiene

- [x] Every shipped slice updates §18
- [ ] No parallel edits to orchestrator/schema
- [ ] Quay packet: 1 worked chapter (this §13) + reporting screenshot

---

## 16. File reference map

### Vision & pedagogy

| File | Use |
|------|-----|
| `docs/MASTER_VISION_PLAN.md` | **This file — source of truth** |
| `Project Scoping and Planning Documents/primer_mvp_spec_v2_5_26_2026.md` | Shared-arc chapter matrix, onboarding, phase engineering — merge don't duplicate |
| Amplify screenshots in chat / Plaud highlight image | Coherence flowchart shape |

### Dated docs (context only)

| File | Use |
|------|-----|
| `docs/product-vision.md` | Primer ethos |
| `docs/v1-scope.md` | Original loop (language) |
| `docs/architecture-notes.md` | Memory layers, stack |
| `docs/v1-technical-plan.md` | Session UI + orchestrator modules |
| `docs/roadmap-post-v1.md` | Standards/reporting originally "later" |
| `docs/decisions-scene-images.md` | Image API + Supabase |
| `docs/implementation-phase-closeout-checklist.md` | SSE/progress already shipped |
| `docs/testing-maturity-roadmap.md` | Test strategy |
| `docs/vitest-testing-guide.md` | How to test |

### Standards (Layer 1)

| File | Use |
|------|-----|
| `curriculum_resources/standards_ela_grade3.ts` | G3 ELA catalog |
| `curriculum_resources/standards_ela_grade4.ts` | G4 ELA catalog |
| `curriculum_resources/standards_ela_grade5.ts` | G5 ELA catalog |
| `curriculum_resources/standards_math_grade3.ts` | G3 Math catalog |
| `curriculum_resources/standards_math_grade4.ts` | G4 Math catalog |
| `curriculum_resources/standards_science_grade3.ts` | G3 Science catalog (full N/E/P/L) |
| `curriculum_resources/standards_science_grade4.ts` | G4 Science catalog |
| `curriculum_resources/standards_social_studies_grade3.ts` | G3 Social studies catalog |
| `curriculum_resources/standards_social_studies_grade4.ts` | G4 Social studies catalog |
| `curriculum_resources/grade4_science_scraped.json` | Science G4 scrape companion |
| `curriculum_resources/grade3_*_standards.md` | Human-readable dumps |
| `curriculum_resources/cpalms-standards-researcher-SKILL.md` | Fetch / verify more |
| `prisma/seeds/standards_ela_grade3.ts` | G3 ELA seed (re-exports authoring catalog) |
| `prisma/seeds/OLDstandards_ela_grade3.ts` | Legacy thin ELA; unused by `seed.ts` |
| `prisma/seeds/standards_math_grade3.ts` | G3 Math seed (re-exports authoring catalog) |
| `prisma/seeds/standards_science_grade3.ts` | G3 Science seed (re-exports authoring catalog) |
| `prisma/seeds/standards_social_studies_grade3.ts` | G3 SS seed (re-exports authoring catalog) |
| `prisma/seeds/types.ts` | `SubjectSeed` |
| `prisma/seed.ts` | Wiring |
| `lib/services/standardsCatalog.ts` | Prompt injection |
| `lib/constants/subjects.ts` | Slugs |

### Activities (Layer 2)

| File | Use |
|------|-----|
| `curriculum_resources/grade3_castaway_curriculum.ts` | G3 unit/chapter/checkpoint map (6 units, 19 chapters, 23 Guild inspections) |
| `curriculum_resources/grade3_activity_bank.ts` | Barrel for 177 hand-authored templates |
| `curriculum_resources/grade3_activity_bank_{math,ela,science,ss,reflections}.ts` | Bank by subject |
| `curriculum_resources/grade3_curriculum_coverage.md` | Code × chapter × activity × checkpoint; regenerate via `grade3_verify_coverage.ts` |
| `prisma/seeds/activities/types.ts` | `ActivityTemplate` / seed shape |
| `prisma/seeds/activities/from_grade3_bank.ts` | Map to LearningActivity — **unwired** until catalog sync |
| `lib/services/learningActivities.ts` | Mini-quiz create/grade |
| `prisma/schema.prisma` → `LearningActivity*` | Persistence |
| `lib/ai/sessionOrchestrator.ts` | Select template → wrap story → call module |
| Future modules | `ReadingModule`, `CrewDialogueModule`, `PlanWritingModule`, `CalculatorModule`, `SpreadsheetModule`, `MiniQuizModule`, `CheckpointTestModule`, `ReflectionModule`, `SpeechModule`, `CreativeProjectModule`, `MapExploreModule` |

### Story (Layer 3)

| File | Use |
|------|-----|
| `lib/ai/promptTemplates/_shared_castaway_world.ts` | Bible |
| `lib/ai/promptTemplates/{math,ela,science,social_studies}_g3.ts` | Lenses |
| `lib/services/storyCurriculum.ts` | Chain ensure |
| `lib/story/focusTags.ts` | Tags |
| `prisma/schema.prisma` → `StoryWorld`, `StoryArc`, `Chapter` | Structure |

### Session UX & AI

| File | Use |
|------|-----|
| `app/learn/[sessionId]/page.tsx` | Playable loop shell (auth + PlayShell) |
| `components/play/PlayShell.tsx` | Three-mode machine: intro / overworld / dialogue + overlay quiz |
| `components/play/beachWorld.ts` | Pixi stub: tiles, 5 pins, tap-to-move, WASD, fog, Rho follower |
| `lib/play/beachMap.ts` | Walkable tutorial beach + pin layout |
| `lib/play/stills.ts` | Tutorial stills paths + placeholder labels |
| `lib/ai/models.ts` | Live model `gpt-5.6-luna` |
| `app/api/stt/route.ts` | OpenAI STT; transcribe and discard |
| `app/api/session/[id]/tutorial-quiz/route.ts` | Overlay salvage quiz start/submit |
| `app/api/session/[id]/reflection/route.ts` | Chapter 1 crew log (spoken or short text) |
| `lib/play/chapterReflection.ts` | Persist reflection + STORY_BEAT |
| `lib/play/zpd.ts` | Hint → example → fade ladder |
| `lib/services/timeTracking.ts` | Session + activity clocks (no daily cap) |
| `lib/curriculum/tonightSlice.ts` | §4.6 code allow-list |
| `lib/ai/contextBuilder.ts` | Prompt assembly |
| `lib/ai/memoryExtractor.ts` | Memory |
| `lib/ai/imageTool.ts` | Scenes (disabled on live turns until dynamic-stills MVP) |
| `app/api/session/[id]/message/route.ts` | SSE |
| `app/progress/**` | Measurement UI |

### Plaud source

| ID | Name |
|----|------|
| `c1d28e0a8e1a0b7f5eb746226c29946f` | 08-20 Working Session: Gamified AI Tutor and MVP Strategy |

---

## 17. Open questions live in §20

Answered 2026-08-22 items are in **§4**. **§20 D (U1–U15) SUPERSEDED** — Pixi three-mode shell shipped 2026-08-22 (see §18). Remaining P1+ work is listed in §15.

**E2 is locked:** copy full G3 catalogs into Prisma now.

---

## 20. Spec-gap questionnaire (remaining only)

How to reply: paste IDs (`U1`, `A3`, `I2`, …) with a short answer. If you agree with the **default**, write `U1 default`. ★ = blocks the next coding step (Pixi / Chapter 1 build spec).

### Design-spec tally (2026-08-22)

| Area | Status |
|------|--------|
| A1 home loop | **LOCKED** — Pixi Stardew overworld is home; dialogue cutscene; activity tools. Graphic-novel-as-home SUPERSEDED. See §4.3 |
| A2 camera | **LOCKED** — top-down (Stardew / Pokémon) |
| A11 devices | **LOCKED** — iPad + Chromebook + desktop eventually; tonight = fastest G3+G4 loop |
| A12 children | **LOCKED** — one child in playable MVP; parent may attach many; multiplayer later |
| A13 connectivity | **LOCKED** — online-only |
| A14–A15 collaborator | **LOCKED** — **Quay** (not Quinn); Ivan owns all IP for now |
| E1 coverage | **LOCKED** — tonight ~10 codes × 4 subjects (§4.6); then all G3+G4 |
| E2 Prisma catalogs | **LOCKED** — seed full G3 (then G4); teach the slice |
| E3 sessions | **LOCKED** — 1–2 subjects per sit; ≥15 min depth; interleave + spaced repetition; units = bundles of standards |
| E4 struggle | **LOCKED** — ZPD hints/tools/examples; `gpt-5.6-luna` live; medium model for unit/chapter plans |
| E5 reflections | **LOCKED** — end of chapters; active recall + parent report; in-world purpose for the child |
| E6 checkpoints | **LOCKED** — later boss after mini in-game project; not a Ch1 gate |
| E7–E8 framework | **LOCKED** — Florida only in MVP; later NGSS/CC; then AZ/UT/WV; then private TX/NY |
| E9 spaced review | **LOCKED** — keep `ReviewItem` in later sessions; distinct from E5 reflections |
| E10 IEP | **INTENT LOCKED** (must satisfy) — **scope still open** (I1–I5) |
| E11 input | **LOCKED** — speak or type; scaffold to demonstrated lexile |
| E12 scoring | **DEFER** — keep current mastery math for the slice; redesign after data; tests must be defensible before ESA sales |
| E13 science beats | **RECOMMENDED in §4.6** — confirm or swap |
| P5–P11 parent | **LOCKED** except P1–P4 (30s home, wording, raw chat, time cap) |
| P6 logins | **LOCKED** — two logins, one household (§4.5) |
| P7 stipend PDF | **EXPLAINED + LOCKED** — Phase B optional PDF; dashboard is the proof |
| P8 Rho = AI | **LOCKED** — yes, explicit; see §4.5 pedagogy note |
| P9 voice | **LOCKED** — transcribe and discard; COPPA |
| P10 siblings | **LOCKED** — parent may attach multiple kids |
| P11 proof | **LOCKED** — pedagogy aligned to standards + provable reporting |
| **D / U1–U15** | **OPEN — answer next. Blocks Pixi.** Defaults below shifted away from graphic-novel art. |

Dropped as no longer necessary: A1/A2 as questions; E2 as a puzzle; P7 as a mystery; Quinn naming.

### A. Remaining engineering

| ID | ★ | Question | Default if you skip |
|----|---|---------|---------------------|
| A3 | ★ | **Who controls the camera in MVP?** Player pan/zoom freely, or Rho-guided “look here” with limited pan? | Limited pan inside the current region; free zoom later |
| A4 | | **Session length target** (cliffhang / save). You said ≥15 min depth. Confirm save-anywhere and max sit? | 15–25 minutes, save-anywhere, soft cliffhanger |
| A5 | ★ | **MVP chapter count** before dogfood: crash + how many playable chapters? | 2 chapters (wreck + food) + chapter reflection |
| A6 | ★ | **Subject switching:** child picks from map, parent sets, or orchestrator chooses the lens? | Orchestrator chooses after placement; parent override in settings; map jobs hint the lens |
| A7 | ★ | **Hand-authored vs LLM in Chapter 1?** | Hand-author: 1 log, 1 quiz, 1 reflection. LLM (`gpt-5.6-luna`): connective dialogue + ZPD hints |
| A8 | ★ | **Live image gen frequency?** | Pack + first-meet portraits; no per-turn image gen |
| A9 | | Higgsfield: who exports `public/cinematics/crash_landing.mp4` this week? | Placeholder poster + skip until file exists |
| A10 | | LLM stack: current split vs Vercel AI Gateway for all? Live model **must** be `gpt-5.6-luna`. | Gateway if it makes luna + medium routing easy; else current split |

### B. Remaining educator / IEP

E1–E9, E11–E13 are locked or recommended in §4 / §4.6. **E10 needs scoping** or we will under- or over-build.

| ID | ★ | Question | Default |
|----|---|---------|---------|
| I1 | ★ | **What does “satisfy IEPs” mean in v1?** (a) UDL accommodations any child can toggle, (b) parent-entered IEP *goals* with progress reports, (c) both, (d) legally act as the child’s official IEP service (usually **no** — schools/districts own that)? | (a)+(b) light: accommodations + parent can attach goal text and see evidence. **Not** (d) |
| I2 | | Which accommodations must ship in the 10-standard slice? Check all that matter: extra time, fewer items, TTS already, STT already, larger text, high contrast, simplified lexile floor, reduced motion, no timed drills, calculator always allowed | TTS/STT + extra time + no timers + reduced motion + lexile floor. Calculator when the standard allows |
| I3 | | How does the parent *tell* Primer about the IEP? Upload PDF (we should **not** parse PDFs in MVP), checkbox list, or free-text goals? | Checkbox accommodations + optional free-text goals. No PDF parser |
| I4 | | Florida **access points** (modified standards for significant cognitive disabilities): in MVP, or later? | Later. Catalog can store the text; gameplay stays on standard codes until a specialist reviews |
| I5 | | Speech/language vs SLD vs ADHD vs low vision — any **must-support** in first testers? | ADHD + dyslexia-like: speak/type, extra time, chunked tasks. Low vision / AAC later |

### C. Remaining parent (build after student game, but lock copy)

| ID | ★ | Question | Default |
|----|---|---------|---------|
| P1 | ★ | **Parent home after first session:** What must they see in <30 seconds? | Child’s name, minutes today/week, one sentence of story, 1–3 skills in plain English, tests/reflections when they exist |
| P2 | ★ | **Word for progress** instead of “0.62 mastery”? | “Growing / solid / ready to show it” — one metaphor, stick to it |
| P3 | ★ | **Can the parent read the chat log?** | No raw log. Recap + reflection + standards + test scores. Observer later gets recap only |
| P4 | | **Time limits / bedtime?** | Parent-set daily cap (off by default) |

### D. Game / UI (answer these now — blocks Pixi)

Defaults **shifted** because graphic-novel-as-home is rejected. Stardew feel implies **readable pixel / painterly 16-bit**, not watercolor comic panels for the map.

| ID | ★ | Question | Default |
|----|---|---------|---------|
| U1 | ★ | **Art direction for Pixi tiles:** Stardew-like pixel, saturated Ghibli-ish painterly, or something else? (Not graphic-novel watercolor as the *map*.) | **Stardew-like pixel / HD-16-bit.** Portraits in dialogue may be slightly more illustrated than the tiles |
| U2 | ★ | **Captain avatar:** customizable in MVP or a silhouette until a wreck portrait? | Named in UI; generic young captain sprite; customization in Building |
| U3 | ★ | **Rho on the map vs in the dialogue panel** — both? | Both: small follower sprite + large portrait on the **right** in talk mode |
| U4 | ★ | **Click a wreck pile:** enter dialogue, or open an activity tool immediately? | Click → short Rho line → then talk **or** tool. Never a silent menu |
| U5 | ★ | **Fog of war:** literal fog, or “unexplored” parchment? | Soft fog + unexplored tiles (Stardew), not a paper map overlay |
| U6 | ★ | **Resources on HUD in Tutorial?** | Food/rations only; full scrap HUD in Building |
| U7 | ★ | **Unlock juice** when you find Rho / finish a chapter? | Short camp animation + TTS + new map pin. **No XP bar.** Island changes are the reward |
| U8 | | Input chrome in dialogue: always-visible mic + keyboard? | Always both; mic next to send |
| U9 | | Motion: respect `prefers-reduced-motion`? | Yes |
| U10 | | UI chrome color: keep Primer amber for parent, island palette inside Pixi? | Yes |
| U11 | | iPad: portrait-only, or landscape required for the map? | Landscape preferred; portrait playable (map stacked) |
| U12 | ★ | **Move:** WASD walk (Stardew), tap-to-move (Chromebook/iPad), or point-and-click only? | **Tap-to-move everywhere** + WASD on desktop. Pure click-adventure is the fallback if walk physics slips |
| U13 | | How many unique named locations on the Tutorial map? | 5: beach wreck, dune, treeline, creek, camp site |
| U14 | | Activity tools: full-screen (recommended), overlay card, or in-world crate lid? | **Full-screen tool** (Stardew fishing). Overlay only for tiny confirms |
| U15 | | Soundscape from minute one? | Soft ocean + UI clicks; TTS talks |

### After you answer D

I will: (1) move remaining ★ answers into §4, (2) write `docs/CHAPTER_1_BUILD_SPEC.md` (screens, Pixi nodes, activities, §4.6 codes, APIs, `gpt-5.6-luna` router), (3) then a new coding chat can implement without re-asking. P1–P4 and I1–I5 can land in parallel; they do not block the student overworld.

---

## 18. Implementation log


Agents append here. Newest first.

### 2026-08-23 — Learning truth in the shell

- Live dialogue / ZPD hints stay on **`gpt-5.6-luna`**. `PLANNING_MODEL` exists for later unit/chapter authoring and is not used on turns. Overlay quiz miss walks hint → worked crate example → faded try (not a static retry loop). Completing the salvage quiz writes `StandardsEvidence` (GUIDED) against the activity’s real §4.6 codes (wreck quiz: `MA.3.NSO.1.1`).
- Time: session wall-clock + per-activity `durationSeconds`; no daily cap; child HUD hidden unless they tap Time. Chapter 1 crew log (`g3-reflect-u1-ch1`) is spoken or short text, persisted on `LearningActivityCompletion.responseText` + `STORY_BEAT`. `/progress` shows recent observations, time, and the crew log. No parent email/PDF; mastery formula unchanged; no per-turn images.
- Files: `lib/play/{tutorialQuiz,chapterReflection,zpd,hiddenTurns}.ts`, `lib/services/{timeTracking,progress,session}.ts`, `lib/ai/{models,contextBuilder}.ts`, `components/play/*`, `app/progress/page.tsx`, `app/api/session/[id]/reflection/route.ts`, `prisma/schema.prisma`, `docs/MASTER_VISION_PLAN.md`.

### 2026-08-22 — Three-mode playable shell (Step 1)

- Home is a Pixi stub beach (tiles, ~5 pins, tap-to-move + WASD, soft fog, rations HUD, placeholder captain + Rho follower). Intro poster/video slot + Skip. U4: walk/click wreck → left-chat / right-Rho cutscene → overlay salvage quiz (`g3-ma-wreck-number-forms` MC). Live model **`gpt-5.6-luna`**. Mic in composer; OpenAI `whisper-1` STT (audio discarded). Missing stills render `TODO(stills)` rectangles.
- Did **not** redesign mastery or build a parent dashboard. Session time = `Session.startedAt/completedAt`; activity time = `LearningActivityCompletion.startedAt/completedAt`.
- Outstanding: chapter reflection, `STORY_BEAT` memory, TTS, parchment overlay, Higgsfield mp4, real stills. Debt listed under §15 Step 1 closeout (image tool off, FR quiz item dropped, HUD stubs, silent ambient, localStorage intro skip, no A* pathing).
- Files: `components/play/*`, `lib/play/*`, `lib/ai/models.ts`, `lib/ai/sessionOrchestrator.ts`, `lib/ai/contextBuilder.ts`, `app/learn/[sessionId]/page.tsx`, `app/api/stt/route.ts`, `app/api/session/[id]/tutorial-quiz/route.ts`, `components/session/InputBar.tsx`, `docs/MASTER_VISION_PLAN.md`. Added `pixi.js` for the locked overworld renderer.

### 2026-08-22 — Activity bank + wreck/food chapters (Step 0 items 3–4)

- Wired `prisma/seeds/activities/from_grade3_bank.ts` into `prisma/seed.ts`: **177** `LearningActivity` rows, **285** standard links (throws on missing codes; no silent §4.6 skips).
- Test learner `test_captain@primer.local` gets curriculum Ch1 wreck + Ch2 food planners via `syncWreckAndFoodChaptersForLearner` / `lib/services/castawayChapters.ts`. New learners use the same Ch1–Ch2 spine in `ensureLearnerStoryChain`.
- `recordStandardObservation` rejects unknown codes (`Unknown standard code: …`) and wrong-subject codes.
- Smoke: `prisma/scripts/prompt1Smoke.ts`. No Pixi/UI; mastery formula unchanged.
- Files: `prisma/seed.ts`, `prisma/seeds/activities/*`, `lib/services/{storyCurriculum,castawayChapters,standardsProgress}.ts`, `docs/MASTER_VISION_PLAN.md`.

### 2026-08-22 — Standards seed gap closed (Step 0 catalogs only)

- Pointed `prisma/seed.ts` at full G3 catalogs in `curriculum_resources/standards_*_grade3.ts` (math, ELA, science, SS; **127 codes**). Stopped importing `OLDstandards_ela_grade3`.
- Replaced thin `prisma/seeds/standards_{math,science,social_studies,ela}_grade3.ts` with re-exports of those authoring catalogs.
- Wired Prisma 7 seed in `prisma.config.ts` (`migrations.seed`). **`npx prisma db seed` succeeded:** `Seeded 127 Grade 3 standards across 4 subjects.` Did **not** wire `from_grade3_bank.ts` yet (next Step 0 item).
- Files: `prisma/seed.ts`, `prisma/seeds/standards_*_grade3.ts`, `prisma.config.ts`, `docs/MASTER_VISION_PLAN.md`.

### 2026-08-22 — Product-owner answers folded in (A/E/C)

- Pixi **Stardew top-down** is home; graphic-novel-as-home SUPERSEDED. Dialogue = left chat / right portrait; speak or type. Activity tools are full-screen (not chat quizzes).
- Collaborator name **Quay**; Ivan owns IP. Live model **`gpt-5.6-luna`**; medium model for unit/chapter plans. Tutorial = placement. ZPD scaffolding. Florida-only MVP; later NGSS/CC then AZ/UT/WV then private TX/NY.
- Tonight teach ~10 codes × 4 subjects (§4.6); seed full G3 catalogs (E2). Chapter reflections. Two logins / one household. Parent dashboard after student game. IEP intent yes; scope in I1–I5.
- Files: `docs/MASTER_VISION_PLAN.md` only.

### 2026-08-20 — G3 curriculum + activity bank landed

- [G3 curriculum + activity bank](a1482b80-b198-40dc-bf50-658341d93298): 127 codes, 6 units / 19 chapters, 177 templates, 23 checkpoints. Coverage script: `npx tsx curriculum_resources/grade3_verify_coverage.ts` (missing lists empty).
- Florida/US SS kept as Guild atlas / wreck-library, not fake camp civics.
- **Next data job:** sync 80 prisma seedGaps before wiring `from_grade3_bank.ts` into `seed.ts`.
- Files: `grade3_castaway_curriculum.ts`, `grade3_activity_bank*.ts`, `grade3_curriculum_coverage.md`, `prisma/seeds/activities/*`.

### 2026-08-20 — Layer 1 inventory + Layer 2 modules + G3 curriculum agent

- Listed every `curriculum_resources/standards_*.ts` file (ELA 3–5, math 3–4, science 3–4, SS 3–4).
- Expanded activity kinds from Plaud (logs, books, crew talk, plans, calc, spreadsheet, quizzes, checkpoint tests, reflections, speech, creative).
- Specified orchestrator: catalog + bank → story wrap → activity module.
- Spawned sub-agent to author G3 curriculum + activity bank from those catalogs.

- Locked **PixiJS** as world renderer (not Three.js). Implementation waits on §20 ★ questions.
- Full G3 science lives in `curriculum_resources/standards_science_grade3.ts`; prisma seed is N-slice to be replaced, not a second truth.
- Added §20 questionnaire (overall / educator / parent / game design).

### 2026-08-20 — Decisions locked from product owner

- Rho = First Mate; crew = young adults; tone: no gore/on-screen death; mutiny = betrayal + emotion; grade flow = checkpoints; STT required in MVP; OpenAI TTS; GTM = FL D2C stipend parents → orgs/Step Up → private schools.
- COPPA explained: parent User, child LearnerProfile; voice is personal data.
- Codebase: stay and prune; do not greenfield or fork. Note: STT/TTS not present in repo yet — rebuild on session UI.
- Files: `docs/MASTER_VISION_PLAN.md` only.

### 2026-08-20 — Master plan authored

- Created `docs/MASTER_VISION_PLAN.md` from Plaud `c1d28e0a8e1a0b7f5eb746226c29946f`, full `docs/` review, current Prisma/story/activity code, and curriculum_resources catalogs.
- Pivot recorded: language-first V1 docs are historical; Grade 3–8 island saga + three-layer data is north star.
- No application code changed in this session.

---

## 19. After the initial write-up — what else you should consider for a phenomenal MVP

These are not extra features. They are **failure modes** that kill otherwise beautiful plans.

1. **Safety and dignity.** Crash, hunger, mutiny, and "rival clans" can scare or stereotype. **Locked tone:** no explicit violence or gore; disease/death off-screen; mutiny is emotional betrayal. Still avoid real-world ethnic coding of the rival company. Grade 3 ≠ Grade 8 lexile, same world.

2. **Session length.** Product lock: **≥15 minutes of real depth** per sit, 1–2 subjects, save-anywhere. Quay’s teacher-watch window was 5–20 minutes — design so a visitor can *see* a complete mini-loop in 8 minutes, while the child’s real session can run longer. No 45-minute mandatory chapters.

3. **Accessibility.** Captions on Higgsfield; alt text on scenes (already in image tool); keyboard map; don't rely on color-only fog.

4. **Cost ceiling.** Live image every turn will bankrupt a homeschool price. Canonical scenes + rare live gen. One cinematic, not a movie per child.

5. **Cheating the measurement.** If the LLM both teaches and secretly "observes" mastery from chat, scores inflate. Keep **CHECKPOINT** tests distinct; use conversational evidence as *weak* signal (already in `EvidenceTier`).

6. **The First Mate tutorial.** The first 8 minutes teach *how to play*. If Rho lectures like a LMS, you lose. Show: tap map, talk, write one sentence, one quiz, one pretty unlock.

7. **Multiplayer later.** Quay's "play with your buddy" is retention gold and a COPPA/moderation nightmare. Design crew as NPCs first; don't schema yourself into live P2P.

8. **Teacher observer mode.** For Hanzo's hired teacher: a simple "what happened this session" without giving the child a surveillance feeling.

9. **IP of Amplify.** Use the **flowchart structure**, never snail passages or Amplify art. Original island texts only.

10. **Your energy.** The Plaud call ends with a real fork (consulting vs education). The MVP that can be dogfooded *this week* is the only one that informs that choice. Protect Phase A from Enterprise-phase daydreaming.

---

*End of master plan. Re-read §0 and §11 before writing code. Update §18 when you do.*
