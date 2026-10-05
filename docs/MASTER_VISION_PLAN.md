# Primer — Master Vision Plan
**Version:** 2026-08-23  
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
| First session | Tutorial wreck walk stays guided (talk → movement → one placement mini-game). Learning sittings follow **§4.16** |
| Mission cards | **SUPERSEDED as the session driver by §4.16 (2026-10-05).** The five pin jobs remain in code until the subject-focus view replaces them |
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
| Session shape | **§4.16 (locked 2026-10-05).** One subject per sitting, chosen by the captain, with that subject's standards progress in the same view. One chapter problem. Practice means the child predicts or tries, then gets feedback — that is how learning happens, not a separate feature. Then a product the camp uses. A subject switch mid-session is deliberate. SUPERSEDES "one or two subjects" and pin-hopping as the learning driver |
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
| Under-13 | Parent-owned household; two logins; COPPA. Voice = transcribe-and-discard. Third-party video stays off until verifiable parent consent. A nocookie embed is not that consent. |
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

**High priority (2026-10-05) — third-party media.** Any new embed, analytics vendor, ad network, or outside player is a COPPA decision before a child can use it. Learning clips use a privacy-enhanced YouTube iframe and stay **off** unless `PRIMER_LEARNING_CLIPS=1`. That flag is not parent consent. The embed can still let Google see the viewer. Do not send the child’s name or voice to YouTube. Do not enable clips on a child-facing deploy until a parent gives verifiable consent and the privacy policy names Google. Deferred detail lives at the top of `docs/FUTURE_STORY_IDEAS.md` (P0) and outranks story backlog items.

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

**2026-10-05 learning transparency update (Ivan):** Explicitly communicate that Primer is a learning platform: standards, AI dialogue/questions, reflection, and learning how to learn serve the learning goal. Real tests plus writing/speaking demonstrations determine progression in the intended product. Keep practice support distinct from independent assessment. Do not promise “far faster” until Primer has evidence. Detailed copy, rubrics, gate criteria, and UI are proposals in `docs/LEARNING_PURPOSE_AND_PROGRESSION.md`; no mastery formula or runtime behavior changed in this authoring slice.

- **Live interaction:** `gpt-5.6-luna` (write this name in code comments / model router). Cheap, fast, every hint and turn.
- **Unit/chapter authoring or revision:** medium-reasoning model. Runs when tutorial/placement finishes, when evidence says the sequence is wrong, or when a parent/teacher requests a plan update — not every message.
- **ZPD:** If the child is stuck, give hints, tools, worked examples, then fade support. Do not loop the same static narrative. Encouragement can feel Duolingo-like; the *task* must require thought (not only MC).
- **Show, then do (locked 2026-10-05).** A new idea is shown first as a visual example the child can copy. Then the child does the next one. A drawing tool comes later. It is not part of this slice.
- **Diagnostic before assigned work (locked 2026-10-05).** Do not hand the captain a grade-level pile of jobs and hope. Each subject gets its own short placement. **Math is first.** The same stop-rules then repeat for ELA, science, and social studies. The result picks the starting work. Assigned work that ignores it will feel basic. Tell the child the check is to find a starting point. It is not a scored test and it does not write mastery. Start from the onboarding grade, then step up or down. Skills split by subject. Parent benchmark copy is still later. Grade 2 math codes are not in the repo yet — do not invent them. Below the seeded ladder, the result is “below this catalog,” not a made-up code. Stop rules live in `lib/play/mathDiagnostic.ts`.

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

**Current production, 2026-10-05:** V03 captain benefit/10–15–20% bargaining, physical Rho handshake, learning walk and same-ship launch/flight/weather approach are generated and integrated into onboarding. Five matched references, 19 video sources and measured111.02/119.02/127.02s review cuts are preserved in `public/cinematics/prologue-v3/README.md`; script/prompts in `docs/PROLOGUE_BRANCHING_SCRIPT_V03.md` and `shots.json`. Choices appear over a silent matching-endpoint loop after audio; accepted share/progress saves. Recorded profit definition is money left after costs. Paid jobs1,504 credits; checked balance6,096. Earlier30s target is superseded. Actual crash/objective footage remains separate/unbuilt; current app uses beach still/text bridge. Historical direction below is superseded where noted; tutorials deferred.

**Locked 2026-10-05 after candidate review:** Ivan chose A's 3D animation for all future videos. Visual authority: `docs/CINEMATIC_STYLE_GUIDE.md`; active references: `public/cinematics/references/3d-v1/REVIEW.md`. Briefing captain gives thumbs-up; officer positive and professionally serious. Bridge is first-person with only hands/navy cuffs at wheel, no captain's back. Arrival island uninhabited, no buildings/lights/roads/ruins, varied beaches/flat river plains/hills/mountains. Rho conveys readable stress/concern in danger rather than always smiling. Three corrected static images + accepted trade-port A are saved. No further Kling jobs; earlier eight-option round remains history.

**Latest 2026-10-05 direction:** Ivan rejected the realistic Rho pilot as creepy with a head too small for the body. Use animated cinematics with friendly faces and balanced proportions; this supersedes realism in the earlier update and prompts. Archived rejected reference under `public/cinematics/references/ARCHIVED`; never use it as a generation input. Eight static options (A 3D / B painted 2D characters) for briefing, resource exposition, Rho ship introduction and storm bridge are in `public/cinematics/references/animated-v1/REVIEW.md`. User feedback precedes reusable character sheets and further Kling videos. Built-in image tool used; zero additional Kling credits. Story, school-appropriate action, editable captions, deferred tutorials and Pixi home requirements remain.

**2026-10-05 cinematic update (Ivan, revised):** Use Kling via `https://kling.ai/mcp` for the intro. Realistic cinematic visuals, simple language for Grades 3–8, exciting but school-appropriate action, no blood or on-screen harm. This supersedes the illustrated/non-photoreal preference in the historical prompt below for cinematics; Pixi home remains locked. Intro now comprises **30s mission prologue + 30s crash**, approximately **60s total**; earlier 20–30s total targets are superseded. Codex MCP registration and OAuth succeeded; models, balance, pricing, and generation remain unverified in this session. **Tutorial videos deferred by Ivan**; existing tutorial text remains.

**Mission premise (Ivan):** The expedition works for the **Merchant Corporation** to investigate island natural resources that can be collected, shipped, and sold on different planets to make the company money. Interplanetary commerce is explained upfront and now synchronized in the live shared prompt, superseding the older blanket space/planet prohibition. Later discoveries remain unrevealed. Proposed relationship: the Cartographers' Guild briefs the survey crew on behalf of the corporation; exact organizational structure is not yet locked. Live Rho should reuse the saved accepted mission share, not invent a default.

**Resources/trade clarification (Ivan, 2026-10-05):** Initial targets are oil and metal ores including gold/silver; rare/unknown materials are later discoveries. Prologue contains a proposed 5s trade explanation connecting trade to homes, food delivery, and fictional interplanetary transport. Lithium/batteries and later deuterium/tritium/fusion ideas belong in `docs/FUTURE_STORY_IDEAS.md`; no initial reveal/current implementation. Grade ~6 for fusion is tentative, not verified standards mapping. Future-idea capture is now in AGENTS/CLAUDE/CONTEXT.

**Credit planning (public rules verified 2026-10-05):** `docs/KLING_CREDIT_BUDGET.md` records paid Personal MCP credits only, current public monthly plans, and a proposed **3,000–5,000 credit** production allowance for the 90s opening with a few takes/reference setup. Pro monthly is the staged starting recommendation; Premier monthly gives more retry room. No account balance, charge approval, generation or subscription purchase yet.

**Draft for review:** `docs/KLING_VIDEO_PRODUCTION_BRIEF.md` contains the direct-address/exposition prologue, crash/parachute/beach script, and per-shot prompts. Parked tutorial scripts are outside current production. Editable subtitle draft for every spoken line and meaningful sound cue: `public/cinematics/intro.en.vtt`; align to final audio before release. Preserve separate clean picture, voice/music/effects stems, text layers, and edit project. Current intro autoplays muted and has fixed overlay copy; external captions, sound controls, and final copy need a later implementation slice. No generated assets or player changes yet.

**Post-crash objective (Ivan, 2026-10-05):** Captain learns leadership, gathers crew, builds camp, rebuilds ship, rises in the world, and leads a space empire. Brief includes a proposed separate **30s** objective clip; cinematic sequence would total approximately **90s**. Duration and peaceful trade/council montage are proposals, and empire arc remains future scope. Editable local caption draft: `public/cinematics/leadership_objective.en.vtt`. Explicit learning-purpose communication belongs around the opening and during play; control tutorial videos stay deferred.

**Tonight:** `public/cinematics/README.md` + poster slot. Skip control. **Do not block on video.**

**Historical aspirations for `crash_landing.mp4` (duration/style/space concealment superseded above):** Guild scout ship in weather; young-adult crew; **Rho** (humanoid AI) calm on the bridge; violent weather **without gore**; crash implied, survivors on a dawn beach; fog; the island already feels larger than the wreck; end on the child-captain waking so Pixi can take over. Wonder + urgency + safety.

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

### 4.15 World growth architecture (locked 2026-08-23)

**Problem:** The island should keep growing and feel shaped by the child — without the LLM inventing tiles, standards, or infinite plot every turn.

**Lock: hybrid (Minecraft terrain + LLM nodes), not LLM-as-god.**

| Layer | Generator | When |
|-------|-----------|------|
| **Terrain** | Deterministic rules + seed (`lib/play/beachMap.ts`: ridge, tutorial south band, north landmass, `TILE_OVERRIDES`) | Once per world; fog peels as the captain explores |
| **Node types** | Authored catalog (`creek`, `ridge_pass`, `ruin`, `grove`, `camp_upgrade`, …) with allowed biomes + activity kinds | Design-time recipes (like village structure types) |
| **Chapter pack** | **Chapter Compiler** — medium model (`PLANNING_MODEL`) | End of chapter / start of unit — **not** every message |
| **Live talk** | `gpt-5.6-luna` wraps nodes; ZPD hints | Every turn |
| **World ledger** | Code: durable facts from choices + artifacts | After missions, branches, reflections |

**Chapter Compiler inputs:** shared saga beat; previous `handoffSummary`; standards gaps; activity bank slugs; open map slots (north of ridge); complexity stage (MC → speak → make → project).

**Chapter Compiler outputs (JSON, validated):** `plannerJson` patch; 1–3 **map stamps** `{ nodeType, region/col-row, unlockAfter, missionSlug }`; ordered bank activities; one **create** beat when stage allows; `pathAheadWhisper`.

**Rho on the walk loop** sees missions + ledger + standards — does **not** paint tiles. Future tools (not live yet): `stamp_node`, `unlock_region`, `advance_chapter` — only after a compiler pack exists.

**Student-shaped continuity:** ledger facts (decisions, ration plans, named places, artifacts). Next chapter **must reuse** at least one artifact or decision. Branches = 2–3 meaningful forks per chapter (`BranchPoint`), not infinite LLM plot.

**Infinite Minecraft continents are the wrong metaphor.** Reveal flavor north of the ridge forever if needed; **units still march the Guild saga.** If the child asks for a volcano before the saga allows it: Rho gates gently + offer a pre-typed node when the compiler opens the ridge — never spawn a one-off biome on the live loop.

**Build order (after Mission Loop v1 is stable):** (1) world ledger schema, (2) region graph + node-type catalog + stamps on north slots, (3) Chapter Compiler job, (4) Rho world tools wired to packs only, (5) complexity ladder (MC → create modules), (6) disguised placement diagnostic (§4.4).

**2026-10-05 map expansion authorized by Ivan:** implement the living map in `docs/LIVING_WORLD_MAP.md`: one snapshot from saved chapters/missions/generated work/notes, Pixi and parchment views, validated catalog map stamps from `plannerJson`, deterministic fallback chapter markers, and Rho map/note tools. Only active/completed chapter packs reveal northern terrain; arbitrary live terrain generation stays excluded. Keep subject-focus learning as the session driver. A medium-model Chapter Compiler remains future work; projection of existing saved chapters is not a claim that one exists.

### 4.16 Session focus (locked 2026-10-05)

The five beach jobs are a subject sampler. They stay in the code until this view replaces them. They are no longer the model for how a child learns.

A learning sitting has one shape:

1. **The captain chooses the subject** for this sitting: math, ELA, science, or social studies. Rho may name a thin cluster. The captain decides.
2. **The same view shows progress** toward the standards in that subject, from the seeded catalog for the captain's grade. Standards stay the hidden map in the story. This view is where the captain can see the cluster, what is already observed, and what is still ahead. It is not a second app.
3. **The island keeps one chapter problem** (the food will not last; the beach is unsafe after dark). Today's subject is the lens on that problem. The map does not deal the next subject.
4. **The dive is one idea, after placement.** Teaching a new idea starts with a visual example the child can see, then the child does the next one (§4.4). Practice is predicting or trying, then getting feedback. It is not its own mode or button. Then they say or write a product the camp uses. That product is the ledger artifact. Do not assign that dive until the subject’s diagnostic has a starting point.
5. **Switching subject is allowed and deliberate.** The captain can leave the dive from this same view. Rho names what is unfinished and asks for a clear yes before the lens changes. Curiosity can open another subject. The default is to finish the idea in front of them.
6. **Other subjects connect across sittings**, through the ledger. A math ration plan is evidence a later reading or science sitting can reuse. Connection is not four pins in one afternoon.

The one-time wreck walk (§4.7 U4) still teaches movement and can place the captain. After that, learning starts at this view.

Reward follows the product: the camp acts on the plan, the log, or the explanation. XP is not the reason to switch subjects.

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

**What Prisma actually loads today** (`prisma/seed.ts`): full Grade 3 **and Grade 4** catalogs from `curriculum_resources/standards_*_grade{3,4}.ts` (math, ELA, science, SS). `prisma/seeds/standards_*_grade{3,4}.ts` re-export those files. `OLDstandards_ela_grade3.ts` is unused legacy. ELA G5 is **authored, not seeded**. Captains onboarded as grade 3 enroll G3 subjects; grade 4–8 enroll G4 until later catalogs exist.

| Grade | Domain | Canonical authoring file | Seed / runtime |
|-------|--------|--------------------------|----------------|
| 3 | ELA | `curriculum_resources/standards_ela_grade3.ts` | seeded (re-export via `prisma/seeds/standards_ela_grade3.ts`) |
| 3 | Math | `curriculum_resources/standards_math_grade3.ts` | seeded (re-export via `prisma/seeds/standards_math_grade3.ts`) |
| 3 | Science | `curriculum_resources/standards_science_grade3.ts` | seeded (re-export via `prisma/seeds/standards_science_grade3.ts`) |
| 3 | Social studies | `curriculum_resources/standards_social_studies_grade3.ts` | seeded (re-export via `prisma/seeds/standards_social_studies_grade3.ts`) |
| 4 | ELA | `curriculum_resources/standards_ela_grade4.ts` | **seeded** |
| 4 | Math | `curriculum_resources/standards_math_grade4.ts` | **seeded** |
| 4 | Science | `curriculum_resources/standards_science_grade4.ts` | **seeded** |
| 4 | Social studies | `curriculum_resources/standards_social_studies_grade4.ts` | **seeded** |
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

**2026-10-05 transparency requirement:** Explain learning standards in plain language and let learners inspect skills/evidence. A story purpose and an explicit educational purpose coexist. Clearly distinguish practice with AI help from real tests and independent writing/speaking checks. Intended progression depends on relevant demonstrated skills, not chat volume or time; detailed rubric/gate design remains open and current mastery math is unchanged. Prototype copy must distinguish implemented missions from planned tests/unlocks/empire progression. Communication proposal and sources: `docs/LEARNING_PURPOSE_AND_PROGRESSION.md`.

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

## 9. Current app state (2026-08-23)

**Phase A (first playable loop) is shipped.** A child can: parent/child login → first-run cinematic + coach → Pixi beach → wreck talk → overlay quiz → four other pin missions → Ch1 crew log → Ch2 activates in saga. Evidence and time land on `/progress`.

### Status matrix

| Area | Status | What exists today |
|------|--------|-------------------|
| G3 standards in Prisma | **DONE** | 127 codes; `record_standard_observation` rejects unknown codes |
| G3 activity bank in Prisma | **DONE** | 177 activities; `from_grade3_bank.ts` wired |
| G4 standards in Prisma | **DONE** | Seeded; enrollment when onboarding grade ≥ 4; sessions remap G3 job slugs → G4 lens |
| Saga spine | **PARTIAL** | Static TS templates → `StoryWorld` / 6 chapters per learner; Ch1–2 from `grade3_castaway_curriculum`; **not** LLM-customized per child |
| Three-mode shell | **DONE** | Intro → Pixi home → dialogue (left/right) → overlay quiz/reflection |
| Mission Loop v1 | **SUPERSEDED as the session model** | Five pin jobs still run. They are not how a sitting chooses work |
| Subject focus §4.16 | **PARTIAL** | After first-run, the captain picks one subject and sees that subject's standards. A different subject asks for a deliberate yes. A try follows a starting point. The written sentence after the try was removed |
| First-run tutorial | **DONE** | Video/poster → name → move → talk → work; per-learner `firstRunStep` |
| Household auth | **DONE** | Parent email + child username/PIN; `/household`; child JWT scoped to one captain |
| Rho live loop | **PARTIAL** | `gpt-5.6-luna`; ZPD; mission context in prompt; tools: observe, generate_activity, suggest/show board/open mission |
| Rho TTS | **DONE** | OpenAI TTS; discard audio; Voice on/off; mic barge-in |
| STT | **DONE** | Whisper; transcribe + discard |
| Stills pack | **DONE** | 15 files in `public/stills/tutorial/` |
| North landmass | **PARTIAL** | Procedural map + ridge; **not reachable**; no stamps/nodes north of ridge |
| Parchment map overlay | **NOT BUILT** | Fog only on walk camera |
| Disguised placement | **NOT BUILT** | §4.4 Kumon-in-story diagnostic + parent benchmark report |
| Chapter Compiler | **NOT BUILT** | `PLANNING_MODEL` constant only; no job |
| World ledger | **PARTIAL** | Ch1 crew log writes `WorldLedgerEntry` rows + `Chapter.handoffSummary`; next Rho turn must reuse them. No decisions, no Ch2 ration-plan artifact |
| Full-screen activity tools | **NOT BUILT** | Overlay MC quizzes only; FR items dropped in overlay path |
| Parent dashboard / email / PDF | **NOT BUILT** | `/progress` only; `/settings` for reading level |
| Per-turn scene images | **OFF** | Stills pack; re-enable in full MVP |
| Skill tutorial videos | **NOT BUILT** | Intro cinematic only |
| XP / rations persistence | **NOT BUILT** | HUD stubs from mission complete |
| G4 activity bank + G4 saga | **NOT BUILT** | G4 standards + prompt lenses only |

### Key files (do not rebuild)

- **Play shell:** `components/play/PlayShell.tsx`, `OverworldCanvas.tsx`, `beachWorld.ts`, `MissionBoard.tsx`, `FirstRunCoach.tsx`
- **Map:** `lib/play/beachMap.ts` (tutorial south + ridge + north landmass)
- **Missions:** `lib/play/missions.ts`, `lib/services/missions.ts`, `app/api/missions/**`, `app/saga/page.tsx`
- **Learning:** `lib/play/overlayQuiz.ts`, `chapterReflection.ts`, `zpd.ts`, `hiddenTurns.ts`
- **AI:** `lib/ai/sessionOrchestrator.ts`, `contextBuilder.ts`, `models.ts` (`LIVE_INTERACTION_MODEL`, `PLANNING_MODEL`)
- **Data:** `prisma/seed.ts`, `lib/services/storyCurriculum.ts`, `castawayChapters.ts`
- **Auth:** `lib/auth/*`, `lib/services/household.ts`, `lib/play/firstRun.ts`

### Known debt (§15 Step 1 closeout)

Overlay MC-only; straight-line walk; ambient ocean silent; XP/rations not persisted; `PlayShell` >250 lines; graphic-novel `ScenePanel` unused; missions still use G3 bank slugs when captain is on G4 grade band.

---

## 9.1 What still needs to be done (priority order)

**P0 — Make the current loop trustworthy (tomorrow)**

1. **Math diagnostic (§4.4)** — show a visual example, then a fresh item. Step up after two right, down after two misses. Math first. The same engine later for the other subjects. Do not assign a math dive until this starting point exists. Grade 2 codes are not seeded; do not invent them.
2. **Subject-focus sitting (§4.16)** — captain chooses one subject and sees that subject's standards. A switch needs a deliberate yes. The chooser is built. The dive waits on the diagnostic.
3. **Written camp sentence removed** — Ivan rejected the sentence box after the try. It no longer saves, adds a ration, or appears on a job.
4. **Evidence across subjects** — `/progress` and the in-session standards view agree after a dive.

**P1 — World feels alive (next coding slices)**

5. **World ledger** — Ch1 crew-log handoff is written. The next artifact is the product of a §4.16 dive, not another pin. Map stamps stay after a learning product exists.
6. **Parchment map overlay** — shares `beachMap` mask; grows as fog peels (U5).
7. **Persist rewards** — XP/rations tied to `LearningActivityCompletion` / chapter complete.
8. **Full-screen tools** — ship’s log, plan writing, measure (one module at a time); keep overlay for quick MC.

**P2 — Compiler + expansion**

9. **Chapter Compiler** (medium model) — validate against bank + standards; stamp nodes north of ridge.
10. **Rho world tools** — `advance_chapter`, `stamp_node` (compiler output only).
11. **G4 activity bank + saga planners** — mirror G3 pattern.
12. **Parent dashboard + weekly email + PDF** — same data, three surfaces.

**Explicitly later:** perk trees, dynamic per-turn images, Higgsfield mp4 (poster OK), multiplayer, Access Points gameplay, skill tutorial video system.

---

## 10. Product development phases

### Phase A — First playable loop — **SHIPPED 2026-08-23**

**Goal met:** Child can play ~15+ minutes on the beach, all tutorial missions, Ch1 reflection, multi-subject evidence. See §9.

---

### Phase A′ — Mission Loop v1 — **SHIPPED 2026-08-23**

Jobs board, `/saga`, five pin overlays, subject sessions, Rho mission tools, Ch1→Ch2 chapter activation. See §18 log.

---

### Phase B — Tutorial complete (core crew + camp decision) — **IN PROGRESS**

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

### Step 2 — After Mission Loop v1 (current focus)

See **§9.1** for the full priority list. Next coding chats should pick **one** slice:

- Ch2 food missions playable end-to-end
- World ledger + handoff into `Chapter.handoffSummary`
- Parchment map overlay (same mask as `beachMap.ts`)
- Disguised placement (design first, then implement)
- Chapter Compiler spike (read-only: emit JSON pack for Ch3, do not stamp map yet)

**Out until Phase B/C:** parent PDF, perk trees, infinite north content, LLM terrain, Access Points gameplay.

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

- [x] Generate V03 matched references and branching prologue; integrate video/10–15–20% choices, silent loop, saved deal/progress and playback controls into onboarding (2026-10-05). 19 jobs cost1,504 credits; balance6,096. Library: `public/cinematics/prologue-v3/README.md`. Measured cuts111.02/119.02/127.02s. Human performance review and actual crash/objective footage remain open; beach still/text bridges current ending.

- [x] Author expanded branching prologue, captain percentage-share incentives, silent loop/interface contract, Rho handshake/learning walk, flight continuity and final Kling shot prompts after one critique round (2026-10-05); `docs/PROLOGUE_BRANCHING_SCRIPT_V03.md`. Generated/integrated as V03; human performance review remains open.

- [x] Review first prologue through two critique/revision rounds; preserve V1 as reusable library, record pronunciation/transcription failure and lock project creative-improvement habit (2026-10-05). Proposed replacement: `docs/PROLOGUE_SCRIPT_REVISION_02.md`; no replacement footage or paid generation yet.

### P0 — Data + orchestrator truth

- [x] Audit G3 seeds vs `curriculum_resources` — 127 authoring codes; **80 seedGap** (math 28, science 22, SS 30). ELA authoring seed is complete; `seed.ts` may still import OLD ELA.
- [x] Replace G3 prisma math/science/SS slices with full `curriculum_resources` catalogs; point `seed.ts` at authoring catalogs (not OLD) — **done before the activity bank**
- [x] Seed activity bank after catalog sync (`from_grade3_bank.ts`)
- [x] Seed Grade 4 catalogs into Prisma (`ela/math/science/ss`) — G4 subjects enroll when onboarding grade is 4+
- [ ] `buildSystemPrompt` always includes shared castaway bible + chapter `plannerJson` + **session subject** standards only
- [x] `record_standard_observation` rejects unknown codes
- [x] Shared story chain: one world, one saga, four lenses (`ensureLearnerStoryChain`)
- [ ] Schema decision logged: `StoryArc.standardsCatalogId` vs shared arc

### P0 — Tutorial vertical slice

- [x] Chapter 1 plannerJson (wreck / First Mate / food) instantiated from `grade3_castaway_curriculum.ts`
- [x] Captain = `displayName`; Rho = humanoid AI First Mate (call + follower); never steals hero role
- [x] Intro poster slot + Skip (`public/cinematics/`); Higgsfield later
- [x] Draft Kling 30s mission prologue + 30s crash and editable subtitle source for review; realistic cinematic direction recorded (2026-10-05)
- [x] Draft post-crash leadership objective clip/captions and honest learning-purpose communication proposal (2026-10-05)
- [x] Specify oil/gold/silver resource mission + short trade explanation; research MCP billing and save future lithium/fusion discoveries (2026-10-05)
- [ ] Generate/review intro footage, confirm account costs, export `crash_landing.mp4`, and verify website playback
- [x] Generate candidate realistic Rho/beach reference and complete one authorized 5s Kling pilot (2026-10-05); actual charge40 credits, visual direction rejected; see animated candidates below
- [x] Archive rejected realistic Rho reference and generate eight animated scene candidates with prompts/comparison (2026-10-05); user selection and dedicated character references pending
- [x] Lock selected3D style, author reusable cinematic style guide/project routing, and correct briefing/arrival/storm references to feedback (2026-10-05); dedicated character sheets and more video remain open
- [x] Generate/assemble first six-shot3D prologue (~30s), with native speech, separate picture/audio, editable VTT/SRT and captioned review export (2026-10-05);360 credits, balance7,600, user playback review pending
- [ ] Wire editable external captions and sound controls; sync live story prompt to Merchant Corporation/interplanetary premise before release
- [ ] Review/implement transparent practice/checkpoint copy, defensible writing/speaking rubrics, and evidence-based story gates; keep existing mastery formula until separately authorized
- [ ] Deferred: tutorial video production/playback (Ivan, 2026-10-05); keep existing text tutorial
- [x] Pixi home: tiny beach, tap-to-move + WASD, fog, resource HUD, placeholder captain
- [x] U4: click wreck → dialogue (left/right) → overlay quiz
- [x] Stills placeholders (`public/stills/tutorial/`) — no crash if files missing
- [x] Speak-first mic in composer; STT when wired; short type fallback
- [x] Mini-quiz overlay + luna ZPD (no static retry-only) — overlay is bank MC; ZPD is luna after submit + scaffold hints
- [x] Time tracking: session + activity
- [x] **Chapter reflection** (spoken OK) persisted
- [x] Memory `STORY_BEAT` on complete
- [x] Mission Loop v1: HUD Jobs board + `/saga`; dune/treeline/creek/camp → seeded §4.6 overlays; session subject switch; Rho `suggest_next_mission` / `show_mission_board` / `open_mission`; Ch1 reflection activates Ch2 food chapter
- [x] Ch1 world ledger + handoff: crew log is a must-reuse artifact on `Chapter.handoffSummary` and in the next Rho prompt (`WorldLedgerEntry`)
- [x] **§4.16 subject view:** captain chooses one subject, sees that subject's standards, and must confirm before switching. Opens after first-run
- [x] **Math placement engine and screen:** example, then a fresh item, from the math subject view. Two misses on the easiest item say the check will not guess a grade 2 code (`MathCheck.tsx`)
- [x] **Starting-point check** for math, ELA, science, and social studies: example, then a different item, two right to step up, two misses at the bottom refuse an earlier code. After a starting point, each subject shows one new case of that idea and feedback.
- [ ] **§4.16 dive, product half:** the written sentence after the try was removed. A product the camp uses is not built.

**Step 1 closeout (2026-08-22) — done / leftover / debt**

Done: three-mode shell (intro → Pixi beach → dialogue cutscene → overlay quiz); Rho radio + follower; `gpt-5.6-luna` live turns; whisper STT (audio discarded); stills placeholders; session `startedAt`/`completedAt` + quiz `LearningActivityCompletion` start/end.

Not this slice (still open above / P1+): parchment map overlay, Higgsfield mp4, real stills art, parent dashboard, mastery redesign, full-screen activity tools.

Technical debt (defer to end of this plan unless a later step naturally clears it):
1. Per-turn `generate_scene_image` is **disabled** (stills pack). Handler remains; re-enable for full-MVP dynamic scenes.
2. Overlay quiz uses MC items only from bank slugs (drops free-response items). Mission Loop v1 covers wreck + four other pins; still not full-screen tools.
3. Rations / XP HUD are client stubs — not persisted; not tied to chapter complete (P2).
4. Ambient ocean bed is silent; mute control not wired for ambient (U15 placeholder). Rho TTS has its own Voice on/off.
5. Intro Skip is per-learner (`firstRunStep` / `introSeenAt`), not `localStorage`.
6. Walk is straight-line + axis slide, not A* pathing.
7. Graphic-novel `ScenePanel` is unused as home (kept for possible still reuse).
8. STT is `whisper-1`, not luna; requires mic permission + `OPENAI_API_KEY`.
9. `PlayShell` is slightly over the 250-line component guideline.

### P1 — Tutorial crew + camp

- [ ] Crew roster model (found flags)
- [ ] Parchment map overlay that grows; walk fog
- [ ] Camp site choice branch
- [ ] XP + camp pin (perk tree UI later)
- [x] TTS for Rho (OpenAI)
- [x] Parent account linked to child account(s) (COPPA-ready)
- [ ] **HIGH PRIORITY — child data security:** verifiable parent consent and a privacy policy that names Google before any child-facing YouTube clip. Nocookie embed and `PRIMER_LEARNING_CLIPS` are not consent. See `docs/FUTURE_STORY_IDEAS.md` P0 and §4.1.
- [ ] Parent dashboard + weekly email + weekly PDF (full MVP, after student loop)

### P2 — Immersion + measurement

- [ ] STT speech activity
- [ ] Checkpoint assessment + diegetic reward
- [ ] Resource counters tied to chapter complete
- [ ] SortingTable / NumberBuilder
- [x] Canonical stills pack filled by Ivan; then dynamic scenes for full MVP
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
| `prisma/seeds/activities/from_grade3_bank.ts` | Map to LearningActivity — **wired** in `seed.ts` (177 rows) |
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
| `app/api/session/[id]/tutorial-quiz/route.ts` | Overlay salvage quiz start/submit (wreck alias) |
| `app/api/session/[id]/overlay-quiz/route.ts` | Bank overlay quiz by slug (any §4.6 mission) |
| `app/api/missions/route.ts` | Mission board for HUD + Rho prompt |
| `app/saga/page.tsx` | Unit/chapter + job progress (not parent dashboard) |
| `lib/play/missions.ts` | Static pin → bank slug catalog |
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

## 17. Open questions (2026-08-23)

**Closed for coding:** A1–A2, A11–A15, E1–E9, E11–E13, P5–P11, U1–U15 defaults — see **§4** and **§4.7**. Pixi three-mode shell + Mission Loop v1 shipped.

**Still open (do not block tomorrow’s QA):**

| ID | Topic | Default / next step |
|----|-------|---------------------|
| A3 | Camera pan limits north of ridge | Limited pan in region; free zoom later |
| A4 | Save-anywhere + max sit | 15–25 min depth; save-anywhere |
| A6 | Subject switching | Mission picks lens; parent override in settings |
| I1–I5 | IEP scope | Accommodations toggles + optional goal text; Access Points later (§4.13) |
| P1–P4 | Parent dashboard copy | Lock when building dashboard; `/progress` is interim |
| **World growth** | Compiler + ledger | **§4.15** hybrid lock |

**E2 is locked:** full G3 + G4 catalogs in Prisma; G4 activity bank + saga still TODO.

---

## 20. Spec-gap questionnaire — **CLOSED 2026-08-23**

The 2026-08-20 questionnaire is **superseded**. Do not re-ask U1–U15 or A1 home-loop questions in coding chats.

| Area | Where locked |
|------|----------------|
| Home UX | §4.3 Option A — Pixi overworld + dialogue cutscene + activity tools |
| Game/UI defaults | §4.7–§4.8 (U1–U15 answered in prose) |
| Models / placement / ZPD | §4.4 |
| Progression / rewards | §4.9 |
| Prisma seed strategy | §4.11 |
| World growth | §4.15 |
| Current build state + roadmap | §9, §9.1, §11 Step 2 |
| Remaining IEP / parent copy | §17 table above |

If a new ★ question appears, add the answer to **§4** or **§17** — do not revive the full questionnaire body here.

---

## 18. Implementation log

### 2026-10-05 — V03 media and interactive onboarding

- Ivan confirmed same shuttle/scout ship and authorized pictures/videos/stitching plus onboarding code. Five matched ChatGPT images and 19 Kling v3.0 sources completed; preserved V1 and exact production manifest. Recorded explanation defines profit as money left after costs, then offers ten/fifteen/twenty percent.
- App now plays briefing, counteroffers and common continuation; overlays choices on silent matching-endpoint loop; final20% offers Yes only. Accepted share/progress persists in STORY_CONTINUITY with authenticated learner route, no schema migration or payout engine. Captions/sound/pause/Skip/retry included. Live premise synchronized to planet trade and saved share; later discoveries hidden.
- Editable branch/review VTT/SRT, native source mixes, separate picture/audio and captioned/selectable-caption review outputs retained. Measured paths111.02/119.02/127.02s plus choice pauses. Cost1,504; verified balance6,096. No aesthetic retries; provided API key untouched.
- 94 unit tests and TypeScript pass; all five intro E2E scenarios pass. Sequential broader browser suite14/15: separate Jobs→quiz overlay test fails. Parallel shared-captain fixture collisions corrected with one Playwright worker. Live browser reaches initial offer correctly. Full playback/performance review remains; actual crash/objective videos not yet generated, current app uses beach still/text bridge.

### 2026-10-05 — Branching prologue screenplay/prompt package

- Incorporated Ivan's captain reward,10/15/20 negotiation with app choices over a silent loop, physical officer/Rho handshake, left-side corridor learning conversation, same-ship takeoff/exterior flight and concerned storm handoff. Wrote draft, one requested three-lens critique and final package `docs/PROLOGUE_BRANCHING_SCRIPT_V03.md` with exact lines, prompts, branch graph and estimated local/global timing.
- Initial coin-share suggestion superseded by Ivan accepting spoken ten/fifteen/twenty percent; other Grade3-target dialogue still avoids profits/extract. Estimated shortest111s, one No119s, two No127s plus choice waits; not measured performances. Same-ship/off-island port and mission-share-after-costs assumptions await user clarification; new matched reference views/voices still needed.
- Updated brief/style/project memory without replacing existing footage. Documentation-only: no new assets, paid generation, account balance query, runtime changes or runtime tests. App branch contract is a specification, not implemented behavior.

### 2026-10-05 — Written camp sentence removed

- Ivan rejected the sentence the captain wrote after the try. The box, the ledger save, the extra ration, the job quote, and the camp-notebook quote are gone. The try and its feedback stay.

### 2026-10-05 — The camp uses the saved line

- Each saved camp line sets aside 1 ration on the HUD and is quoted on the next open job. Rho’s mission prompt includes that line. It does not add a pin or change the map.
- Not in this slice: map stamps.

### 2026-10-05 — Camp line after the try

- After feedback, the captain writes one line for that idea. It is stored as a must-reuse ledger artifact on the current chapter and added to Rho’s next prompt. A blank line is refused. Saving it does not record a standard observation.
- Not in this slice: the camp changing rations, the map, or a job because of the line.

### 2026-10-05 — Try after the ELA, science, and social studies check

- When one of those checks finishes on a seeded code, the same subject view shows one new case of that idea: an example, then the captain’s try, then feedback. It stays hidden before a starting point, including two misses at the bottom.
- Not in this slice: saving that try as a camp product.

### 2026-10-05 — Starting-point check for ELA, science, and social studies

- The math placement engine now runs the same way on a three-rung Grade 3 ladder for ELA, science, and social studies. Every code is from the seeded tonight slice. Two misses on the easiest item still refuse to invent an earlier grade’s code.
- Not in this slice: a follow-up try after those checks, or a camp product.

### 2026-10-05 — Math try after the starting point

- When the math check finishes on a seeded code, the same subject view shows one new case of that idea: an example, then the captain’s try, then feedback that names the quantity. It does not appear before a starting point, and a miss at the bottom still does not invent a grade 2 code.
- Not in this slice: saving that try as a camp product on the ledger. Other subjects still wait on their own checks.

### 2026-10-05 — Learning-clip sources opened for development

- Ivan did not want the clip search limited to a short channel list while the product is still in development. Search is one safe, embeddable YouTube query. Known educational channels are a plus. An unknown channel can be offered when the duration, embed, blocklist, and topical ranker pass. Rubric: `docs/LEARNING_CLIP_EVALUATION.md`.
- Child-facing consent is unchanged. Clips stay off unless `PRIMER_LEARNING_CLIPS=1` and `YOUTUBE_API_KEY` are set.

### 2026-10-05 — One learning clip, still off for children

- Rho can call `offer_learning_clip`. The server searches the YouTube Data API inside an allowlist (safe search, embeddable, duration, blocklist, then a text ranker). A none result does not open a player. The captain gets one nocookie clip, one or two questions, then a note back to the mission. Watching does not record mastery.
- Clips stay off unless `PRIMER_LEARNING_CLIPS=1` and `YOUTUBE_API_KEY` are set. Playtest `?clip=1` opens a fixture panel and does not search.
- **High priority, not done:** parent consent before a child-facing launch. Recorded in §4.1 and `docs/FUTURE_STORY_IDEAS.md` P0. A nocookie player can still let Google see the viewer. Do not send the child’s name or voice to YouTube.

### 2026-10-05 — Prologue editorial improvement cycle

- Ivan reports P01 mispronouncing Corporation and finds the fixed five-second facts disjointed. Preserved all V1 assets and added `public/cinematics/prologue-v1/LIBRARY.md` with reuse limitations. The first cut is not release-approved.
- Completed two critique/revision rounds with three explicitly simulated professional perspectives; saved the approximately30–35s continuous-briefing/acceptance/Rho/weather-turn proposal in `docs/PROLOGUE_SCRIPT_REVISION_02.md`. Timing awaits an actual read-through; replacement script/footage not yet accepted or generated.
- Recorded the requested recurring creative-improvement workflow in `docs/CREATIVE_IMPROVEMENT_CYCLE.md`, AGENTS, CLAUDE, style guide and project memory. Transcript word matching cannot certify pronunciation; future dialogue needs listening review. Documentation/editorial review only; no app changes, runtime test rerun, media generation or new credit charges.


Agents append here. Newest first.

### 2026-10-05 — Show-then-do, and math placement before assigned work

- Ivan: teach a new idea by showing a visual example first, then the child does the next one. A drawing tool is later.
- The diagnostic is the next build, not an optional placement doc. Math first. The same stop-rules are the engine for the other subjects. Assigned work waits on that starting point.
- Engine only: `lib/play/mathDiagnostic.ts`. Two correct steps up, two misses step down, eight items max. Below the seeded Grade 3 ladder the result is "below this catalog." No Grade 2 codes were invented. Not on screen yet.

### 2026-10-05 — Math pedagogy research, not a new lock

- Ivan clarified that practice (predict or try, then feedback) is how learning happens, not a feature called at-bats. §4.16 wording updated.
- Research for his review is in `docs/MATH_PEDAGOGY_RESEARCH.md`: Adding It Up, two IES practice guides, ST Math / DreamBox / Zearn / Khan / IXL / Prodigy evidence limits, and Kumon's small-step sequence versus bare drill. No philosophy lock and no math-dive build until he responds.

### 2026-10-05 — Subject-focus view

- After the wreck lesson, a learning sitting opens on “What do you want to work on?” The captain picks one catalog subject and sees every standard in it, marked seen or not yet. Choosing a different subject asks for a deliberate yes before the session lens changes.
- Not in this slice: the practice-with-feedback dive, or the camp product. The five pin jobs still open from Jobs.
- Files: `lib/play/subjectFocus.ts`, `components/play/SubjectFocusPanel.tsx`, `app/api/session/[id]/subject-focus/route.ts`, `e2e/subject-focus.spec.ts`.

### 2026-10-05 — Session focus locked (§4.16)

- Ivan stopped the five short pin jobs as the learning model. A sitting asks which subject the captain wants, shows progress toward the standards in that subject in the same view, and stays on one chapter problem: the child practices by predicting or trying and getting feedback, then makes a product the camp uses.
- A mid-session subject switch is allowed and must be a deliberate yes. The aim is depth and curiosity. The wreck walk remains the one-time movement lesson.
- Not built yet. Mission Loop v1 still runs until the subject-focus view replaces it.

### 2026-10-05 — First prologue assembled with editable captions/audio

- Ivan authorized first prologue videos and assembly. Generated three missing scene reference frames with built-in image tool, then six5s1080p Kling3.0 jobs with native direct-address dialogue/off-screen narration, one take each. Actual charges360; final Premier balance7,600. OAuth used; API key untouched.
- Saved watermark-free originals and task metadata, normalized1920×1080/24fps edit, clean30s H.264/AAC master, separate picture/audio and per-shot extracted mixes, VTT/SRT, selectable subtitles and captioned review copy in `public/cinematics/prologue-v1`. Exact shot prompts/lines and reproducible orchestration/assembly/transcription/export scripts retained.
- Whisper recovered all six lines; minor P04 singular “food shipment” captured in captions. Validated caption timing/coverage/two-line wrapping, media metadata and sampled frames/subtitle rendering. Full unit suite54 and TypeScript typecheck passed. User playback needed for voice/motion/lip-sync acceptance. No webpage/player integration, crash/objective/tutorial jobs, retries or music commissioning.

### 2026-10-05 — Crew log no longer gates camp-math

- Product change: camp-math unlocks after wreck salvage only (same as dune/treeline/creek). Ch1 crew log stays optional for story/handoff; wreck dismiss no longer auto-opens the reflection overlay.
- Files: `lib/play/missions.ts`, `lib/ai/{standardsTool,sessionOrchestrator,contextBuilder}.ts`, `components/play/PlayShell.tsx`, tests.

### 2026-10-05 — Crew log tools + orchestrator debug visibility

- Earlier fix for camp stuck when crew log *was* a gate: `open_crew_log` / `save_crew_log`, tool-result debug. Gate later removed (see entry above); tools kept as optional.
- Developer debug: `PRIMER_AI_DEBUG=1` logs tool **results** + SSE `debug_tool`; `NEXT_PUBLIC_PRIMER_AI_DEBUG=1` shows a PlayShell strip. Both off for real players.

### 2026-10-05 — Auto-read switch on Talking with Rho

- Top bar of the dialogue cutscene has an **Auto read** switch. Off skips the paid `/api/tts` call on each finished Rho turn and persists in `localStorage` (`primer.rhoTtsAutoRead`). On `next dev`, a missing preference starts off so local testing does not pay for speech; an explicit on still sticks. Production with no saved preference stays on. Manual **Hear Rho** still speaks. Existing **Voice on/off** still mutes both. Beach HUD (Jobs, Saga, Leave) hides during the cutscene so the switch stays clickable.
- Files: `lib/play/rhoAutoRead.ts`, `components/play/{useRhoTts,DialogueCutscene}.tsx`, `e2e/rho-auto-read.spec.ts`.

### 2026-10-05 — Playwright gate for visible UI

- Visible behavior changes now need a Playwright spec (`npm run test:e2e`) plus the existing Vitest and typecheck gate. Agents close a slice by offering the next build slice as clickable choices.
- First spec: `e2e/progress-handoff.spec.ts` signs in through the local agent bootstrap and checks `/progress` for the carried-forward section.
- Same instructions in `.cursor/rules/test-and-next-step.mdc`, `CLAUDE.md`, and `AGENTS.md`.

### 2026-10-05 — Agent playtest bootstrap (local)

- AI browser agents were stuck on login + first-run + Pixi. Added local-only `POST /api/dev/agent-bootstrap` and `/dev/agent`: seed captain cookie, `firstRunStep=complete`, ready `/learn` URL with `?dialogue=1` or `?board=1`. Documented in `docs/AGENT_PLAYTEST.md`.
- Files: `lib/play/{agentPlaytest,testCaptain}.ts`, `app/api/dev/agent-bootstrap/route.ts`, `app/dev/agent/page.tsx`, `PlayShell` auto-open flags, CONTEXT/CLAUDE.

### 2026-10-05 — show_mission_board tool + tool-first rule

- Rho can call `show_mission_board` to open the on-screen Jobs overlay (`mission_board_open` SSE → PlayShell). Prompt forbids narrating a wooden board without opening the UI. Distinct from `suggest_next_mission` (read) and `open_mission` (start quiz).
- **Product rule locked:** new child-facing features Rho/the captain can invoke should usually become orchestrator tools; if uncertain, ask Ivan before implementing. Documented in `CLAUDE.md` / `AGENTS.md`.
- Files: `lib/ai/{standardsTool,sessionOrchestrator,contextBuilder}.ts`, `lib/play/missions.ts`, `lib/types/index.ts`, `app/api/session/[id]/message/route.ts`, `components/play/{useSessionStream,PlayShell,MissionBoard}.tsx`, tests, workspace rules.

### 2026-10-05 — Ch1 world ledger + chapter handoff

- Saving the Chapter 1 crew log now writes two ledger facts (the note, and “the engineer is still missing”), stores `Chapter.handoffSummary`, and advances Ch2 as before.
- The next live turn injects a CHAPTER HANDOFF block that requires Rho to reuse that note. `/progress` shows the handoff. The crew-log overlay shows the carried-forward summary before Rho speaks.
- Not built: Ch2 ration-plan (or other make) artifact, Chapter Compiler, map stamps.
- Files: `prisma/schema.prisma`, `prisma/migrations/20261005120000_world_ledger/`, `lib/play/chapterHandoff.ts`, `lib/services/worldLedger.ts`, `lib/play/chapterReflection.ts`, `lib/ai/contextBuilder.ts`, `components/play/ReflectionOverlay.tsx`, `app/progress/page.tsx`.



### 2026-10-05 — 3D style locked; POV, terrain, emotional acting corrected

- Ivan selected3D A versions and requested guide for all future videos. Added `docs/CINEMATIC_STYLE_GUIDE.md`, AGENTS rule and CONTEXT route. Guides identity/proportions, palette/light, emotional range, first-person hands, geography, props, reference provenance and editable audio/captions; leaves Pixi game art unchanged.
- Revised three stills with built-in image tool: briefing thumbs-up + restrained professional officer, Rho introduction with untouched varied terrain, storm from captain's eyes with only hands at wheel and concerned/stressed Rho. Copied accepted P02A trade-port into active `3d-v1` folder. Viewed outputs; saved full prompts and gallery.
- Updated shot/script directions and memory. Original candidates remain history; realism stays ARCHIVED. No Kling calls/credit charges, no new video/character sheets/app-code changes.

### 2026-10-05 — Animated direction; eight scene candidates

- Ivan rejected realistic Rho as creepy and head too small; animated direction supersedes realism. Moved reference into `public/cinematics/references/ARCHIVED` and marked it excluded from future generation inputs. Previous video remains a rejected pilot.
- Generated exactly eight static images with built-in ChatGPT image tool: P01 briefing, P02 narrated resource exposition, S01 Rho introduction on ship, S02 storm bridge, each A 3D/B painted 2D characters. Saved PNGs, full prompts and labeled comparison in `public/cinematics/references/animated-v1`.
- Viewed all outputs. Friendly animated Rho, costume and escape-handle side carried within each style; background island settlements are unapproved and need cleanup before production. Candidate styles/characters are not locked. Await user feedback before reusable character sheets or video. No Kling calls/credits, no game-art or app-code changes.

### 2026-10-05 — Premier reported; single pilot reference prepared

- Ivan reports purchasing Premier and authorizes one short video test before further production. Generated a realistic Rho/beach candidate using the built-in image tool, preserving existing pixel portrait design; saved `public/cinematics/references/rho-dawn-v1.png`. Game art unchanged.
- Prepared five-second silent image-to-video prompt in `docs/KLING_PILOT_01.md`; public 1080p VIDEO 3.0 baseline estimate 40 credits, actual account/model verification pending. No batch or retries authorized.
- Native MCP tools absent; official global CLI OAuth succeeded. Account confirms Premier/8,000 initial credits. Completed one silent `kling-video-v3_0` pilot, charged40; verified remaining7,960. Saved `public/cinematics/pilots/rho-dawn-pilot-01.mp4`; verified H.264,1916×1080,24fps,5.04s,no audio. Five sampled frames preserve identity/setting but brief mouth movement violates the closed-mouth request; user playback/identity review pending. Task ID in pilot document. API key untouched; no credentials recorded. No app-code changes or further jobs.

### 2026-10-05 — Resources, trade, credits, future-idea capture

- Ivan specified oil/gold/silver ores, later rare materials/lithium, a 5s trade explanation, and a later abundant deuterium/tritium discovery tied to chemistry/fusion and energy/space travel. Revised prologue/subtitles; tutorials stay deferred.
- Created future-story backlog (no relevant active idea file found) and capture instructions in AGENTS/CLAUDE/CONTEXT. Automated lithium-based tritium replenishment is a proposed fictional explanation; Grade ~6 remains unverified. DOE/NRC facts distinguish isotope science from future technology.
- Verified rendered official MCP FAQ and live public membership plan: paid Personal credits only, no bonus/free off-peak MCP generations. Budget estimate 3,000–5,000 credits, not authorization; native tools/account balance still unavailable in this chat.
- Files: video brief, intro VTT, credit budget, future ideas, project instructions/router, this plan, project memory. No app-code changes, asset generations, or purchases.

### 2026-10-05 — Leadership objective + honest learning purpose

- Ivan requested post-crash captain/crew/camp/ship/world/space-empire objective and explicit learning-purpose communication, including standards, AI questions/reflection/metacognition, real tests, and writing/speaking evidence for progression.
- Added proposed 30s objective video + editable VTT and a communication design with opening disclosure, mission skill labels, practice versus independent-test labels, metacognition prompts, feedback/retry proposals, and no unsupported speed claim.
- Updated §4.4 hidden-purpose placement wording toward explicit low-pressure diagnostic disclosure. Recorded that checkpoint gates, writing/speaking scoring, and empire arc are not implemented; no mastery math or runtime changes.
- Sources: EEF metacognition guidance and IES learning practice guide; general evidence does not establish Primer acceleration. Files: production brief, learning-purpose proposal, objective VTT, cinematic README, this plan, project memory. No generation/purchase.

### 2026-10-05 — Mission prologue + editable captions; tutorials deferred

- Ivan clarified Merchant Corporation employment and the resource-survey → extraction → sale on other planets → company profit mission. Interplanetary commerce is now explicit in the opening; older blanket space concealment is superseded for this premise.
- Added a proposed 30s prologue alternating first-person officer/Rho address with exposition narration; combined intro target is 60s. Removed repeat Rho introduction on the beach. Guild/corporation organizational relationship remains a proposal.
- Added editable `public/cinematics/intro.en.vtt` covering all dialogue and meaningful sound cues; timing is draft pending final audio. Preserve separate picture/audio/text sources. Player caption/audio integration and live prompt synchronization remain open.
- Deferred tutorial videos per Ivan; parked drafts retained, no generation or app-code changes. Files: production brief, VTT draft, cinematic README, this plan, project memory.

### 2026-10-05 — Kling connection + cinematic script draft

- Registered global Codex `kling` MCP at Ivan's endpoint; OAuth login succeeded and CLI reports enabled/OAuth. No generation or purchase submitted; account balance, model capabilities, and per-job costs not yet verified.
- Ivan's realistic cinematic style supersedes the older illustrated cinematic preference. Draft follows Guild airship → escape/parachutes → implied crash → safe dawn beach, with the captain taking the key action.
- Added 30s shot list, prompts, and four proposed how-to-play clips. Tutorials use real UI recordings for controls; skill video system remains unbuilt. Scripts await review.
- Observed integration limits: intro autoplays muted, uses `object-cover`, and has fixed overlay text. No app code changed or runtime tests run.
- Files: `docs/KLING_VIDEO_PRODUCTION_BRIEF.md`, this plan, `public/cinematics/README.md`, `PROJECT_MEMORY.md`. Global MCP configuration is outside the repository; credentials are not recorded here.

### 2026-08-23 — Master plan sync (state + roadmap + world architecture)

- Bumped doc version to **2026-08-23**. Replaced stale **§9** inventory (old “Pixi not built / G4 not seeded”) with **§9 status matrix** + **§9.1 priority order**.
- Added **§4.15 World growth architecture** — hybrid lock: deterministic terrain + Chapter Compiler (medium model) + world ledger; not LLM-painted tiles on live turns.
- Marked **Phase A** and **Phase A′ (Mission Loop v1)** shipped; **§11 Step 2** points at §9.1.
- **Closed §20 questionnaire** — answers live in §4 / §17; do not re-ask U1–U15 in coding chats.
- Reconciled G4: catalogs **are** seeded + G4 enrollment works; G4 **activity bank + saga** still not built (supersedes earlier §18 note that said G4 not seeded).
- Files: `docs/MASTER_VISION_PLAN.md` only.

### 2026-08-23 — Grade 4 start path + disguised-placement lock

- Captains can **start on Grade 3 or Grade 4**. Onboarding `gradeBand` 3 enrolls `*_g3` subjects; 4–8 enrolls `*_g4` until G5+ catalogs exist (`readingLevel` stays independent). G4 Florida catalogs are seeded. Live sessions use G4 prompt lenses + G4 standards injection. Island jobs still use the G3 activity bank; starting a pin remaps the session lens (e.g. `math_g3` job → `math_g4` session). Saga planners stay on G3 keys.
- **§4.4 placement lock:** first ~30 minutes = Kumon-style diagnostic **in story**, starting from onboarding grade but not assuming on-grade skill; per-subject up/down; parent benchmark report. Not built yet.
- Files: `lib/constants/subjects.ts`, `lib/services/{profile,learnerSubjects,missions,storyCurriculum}.ts`, `lib/ai/{promptTemplates,sessionOrchestrator}.ts`, `prisma/seed.ts`, `app/api/session/start/route.ts`, `docs/MASTER_VISION_PLAN.md`.

### 2026-08-23 — Household two-login + first-run tutorial

- Replaced language-app onboarding (email user → name/grade → ocean dive) with MASTER §4.5 **two logins, one household**. Parent: email + password + COPPA checkbox. Child: username + 4-digit PIN. Parent `/household` adds captains and **Wake the captain** (switches JWT). No parent dashboard.
- Child first-run lives in `PlayShell`: Ivan’s 20–30s `crash_landing.mp4` (poster fallback) → Guild-log name (speak or type) → gated **move / talk+mic / salvage overlay**. Authored Rho coach; live luna still runs wreck talk and ZPD. Extra HUD (Jobs/Saga/Progress/Leave) hidden until work is done. Intro skip is per-learner, not Chromebook `localStorage`. Quiz no longer auto-opens at 8s.
- Schema: `Household`, `User.role/username/nullable email`, `LearnerProfile.householdId` + `firstRunStep`. Session APIs require child JWT and refuse sibling session ids.
- Files: `prisma/schema.prisma`, `prisma/migrations/20260823070000_household_first_run/`, `lib/auth/*`, `lib/services/household.ts`, `lib/play/firstRun.ts`, `components/{auth,household,onboarding,play}/*`, `app/{household,privacy,(auth),api/household,api/auth}/*`, `scripts/migrate-household.ts`, `docs/MASTER_VISION_PLAN.md`.
- Not legal advice: consent is checkbox + timestamp, not FTC verifiable consent. Dashboard/email/PDF still later.

### 2026-08-23 — Mission Loop v1 (pins + board + subject sessions)

- HUD **Jobs** board + `/saga` show subject, theme, ~minutes, XP/ration/map-pin stubs. Dune/treeline/creek/camp now start seeded bank overlays (`g3-ela-context-clues-bulletin`, `g3-sci-plants-make-food`, `g3-ss-social-science-terms`, `g3-ma-search-grid-tens`) after wreck salvage; camp waits on Ch1 crew log. Starting a job `startOrContinue`s a session on that `subjectSlug` (not always `math_g3`). Completing the crew log marks Ch1 COMPLETED and activates Ch2 food planners.
- Rho prompt includes available/completed missions. Tools: existing `record_standard_observation` + `generate_learning_activity`; new `suggest_next_mission` (read) and `open_mission` (opens overlay / client subject switch). Generated mini-quizzes use the same overlay as bank jobs.
- Did **not** build parent dashboard, perk trees, or per-student LLM unit authoring. XP/rations remain HUD stubs from completed missions.
- Files: `lib/play/{missions,overlayQuiz}.ts`, `lib/services/missions.ts`, `lib/ai/{standardsTool,sessionOrchestrator,contextBuilder}.ts`, `components/play/*`, `app/saga/page.tsx`, `app/api/missions/**`, `docs/MASTER_VISION_PLAN.md`.

### 2026-08-23 — Uneven island, north unexplored landmass (U5)

- `lib/play/beachMap.ts` now builds the map from one mask instead of a plain rectangle: a rock ridge (rows 30-33) seals the unchanged 18x12 tutorial beach (now south, rows 34-45) off from a new 30-row irregular landmass to the north (rows 0-29) — bays/peninsulas from two independent sine-blend coastlines (west/east edges computed separately so it reads as one uneven coast, not a drifting oval), tapering to a point at the map's north edge to imply the island keeps going. A small `TILE_OVERRIDES` map lets specific spots (a hand-carved cove today) be carved in without touching the formula — same pattern to reuse for future named landmarks.
- Rationale: the walk-camera mask, tile art, and the future parchment overlay (U5 "grows like Elden Ring") should all read off the same shape instead of three hand-drawn ones. North of the ridge isn't reachable yet (no content there) — it exists purely so fog (and later parchment) reveal "the island is bigger than you thought" from minute one. `components/play/beachWorld.ts` gained a `rock` tile color for the ridge; still flat Pixi `Graphics` rects, no tile art yet (separate follow-up: a small Stardew-style tileset keyed off `TileKind`).
- Added `scripts/preview-map.ts` (ASCII dump of the mask) for iterating on the coastline without booting the game. `lib/play/beachMap.test.ts` updated for the new coordinates (tutorial-band assertions now anchor off `SPAWN_ROW` instead of literal rows).
- Files: `lib/play/beachMap.ts`, `lib/play/beachMap.test.ts`, `components/play/beachWorld.ts`, `scripts/preview-map.ts`, `docs/MASTER_VISION_PLAN.md`.

### 2026-08-23 — Rho TTS (OpenAI)

- Rho speaks each finished dialogue turn via OpenAI `gpt-4o-mini-tts` (`coral` + First Mate instructions) when **Auto read** is on. The Talking with Rho top bar switch turns that off and persists in `localStorage`, so development turns do not call `/api/tts`. **Hear Rho** still speaks one line. `/api/tts` returns mp3 in memory; the client plays it and discards the blob (nothing stored). History is not auto-spoken on reopen. **Voice on/off** persists in `localStorage` and mutes both paths. Mic barge-in stops speech. Browser autoplay block → “Tap Rho to hear.”
- Not done: line cache, ElevenLabs, ambient ocean bed / U15 map mute.
- Files: `app/api/tts/route.ts`, `lib/play/{ttsText,rhoVoice}.ts`, `lib/ai/models.ts`, `components/play/{useRhoTts,DialogueCutscene,MicButton}.tsx`, `components/session/{MessageList,MessageCard,InputBar}.tsx`.

### 2026-08-23 — Onboarding: name + dive-in

- Removed goals / interests / “subjects ready” wizard steps. Onboarding is captain name (optional) → short dawn-ocean dive animation → `/learn`. Profile API no longer requires goals; `createProfile` fills story-default goals and empty interests; G3 core enroll + story chain unchanged.
- Files: `components/onboarding/OnboardingWizard.tsx`, `app/globals.css`, `app/api/profile/route.ts`, `lib/services/profile.ts`, `docs/MASTER_VISION_PLAN.md`.

### 2026-08-23 — Tutorial stills pack generated (§4.12)

- Generated all 15 files in `public/stills/tutorial/README.md` via `gpt-image-1.5` (OpenAI Images), one-off scripts `scripts/{generate-tutorial-stills,fix-sprite-transparency}.ts`. Filenames match `lib/play/stills.ts` exactly; `TODO(stills)` placeholders are gone.
- Rho's 3 portraits + overworld sprite share the same face/visor-eye/jacket language. Overworld sprites (`captain_placeholder_sprite.webp`, `rho_overworld_sprite.webp`) needed a PNG round-trip + `sharp` re-encode to actually get alpha transparency in the webp — plain `background: "transparent"` + `output_format: "webp"` on `images.generate` silently produced an opaque background.
- Not done: background/location scenes (`cinematic_poster`, `crash_aftermath_beach`, `wreck_pile_close`, `dune`, `treeline`, `creek`, `camp_site_empty`, `map_parchment_unexplored`) came back ~2–2.3MB each at 1536×1024 high quality — worth a compression pass before shipping, not blocking.
- Files: `public/stills/tutorial/*.webp`, `scripts/generate-tutorial-stills.ts`, `scripts/fix-sprite-transparency.ts`, `docs/MASTER_VISION_PLAN.md`.

### 2026-08-23 — Reading level settings + G4 readiness note

- **`/settings`** page lets parents/captains change `readingLevel` after onboarding (`PATCH /api/profile`); linked from `/progress`. Takes effect on the next dialogue turn.
- **Grade 4 (updated 2026-08-23 doc sync):** G4 catalogs **are seeded**; onboarding grade 4+ enrolls G4 subjects; sessions remap G3 job slugs → G4 lenses. Still missing: G4 activity bank, G4 saga planners, G4-specific island jobs.
- Files: `lib/services/profile.ts`, `app/api/profile/route.ts`, `app/settings/page.tsx`, `components/settings/ReadingLevelForm.tsx`, `app/progress/page.tsx`, `CONTEXT.md`.

### 2026-08-23 — Dialogue text size + reading level

- Dialogue cutscene copy is larger (assistant/user bubbles ~lg–xl; composer `text-base`/`text-lg`).
- Onboarding now asks **grade (3–8)**; persists `LearnerProfile.gradeBand` and sets `readingLevel` to the same value by default (new column + migration backfill).
- Live prompts inject a hard READING LEVEL rule from `profile.readingLevel` so Rho vocabulary/passages track the captain (overrides hardcoded “Grade 3 vocabulary” in subject lenses).
- Files: `prisma/schema.prisma`, `prisma/migrations/20260823050000_reading_level/`, `lib/{constants/grades,services/profile,types,ai/contextBuilder}.ts`, `app/api/profile/route.ts`, `components/onboarding/OnboardingWizard.tsx`, `components/{play/DialogueCutscene,session/*}.tsx`, `CONTEXT.md`.

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

### Vision-alignment test script (run after every slice)

Use this **before** building the Chapter Compiler or parent dashboard. A real child (or you role-playing one) on Chromebook + one on desktop if possible.

**Product shape (must pass)**

- [ ] **Home is the map** — child lands on Pixi beach, not a chat-first page or graphic-novel reader.
- [ ] **Talk is a cutscene** — wreck opens left-chat / right-Rho; mic visible; typing is fallback.
- [ ] **Work is diegetic** — overlay quiz feels like salvage/crate work, not a detached worksheet modal (even if MC-only for now).
- [ ] **Rho is sidekick** — captain is hero; Rho hints after struggle, never takes the quiz.
- [ ] **Rewards are island-shaped** — new pin / Jobs entry / saga chapter advance — not “+50 XP” as the main juice (stubs OK if visible unlock happens).

**First-run + Ch1 loop (must pass)**

- [ ] Parent creates household → child PIN login → **Wake the captain** works.
- [ ] Intro video or poster → name → move gate → talk gate → wreck salvage overlay (no auto-quiz at 8s).
- [ ] After wreck quiz: **dune, treeline, creek** unlock on map + Jobs board.
- [ ] Each mission starts the **correct subject session** (check network or `/saga` subject label).
- [ ] Wrong quiz answer → **ZPD ladder** (hint → worked example → retry), not infinite identical MC.
- [ ] Camp mission locked until **Ch1 crew log**; completing log marks Ch1 done and **Ch2 active** on `/saga`.

**Evidence + trust (must pass)**

- [ ] `/progress` shows **math + ELA + science + SS** standard codes after the four non-wreck missions — not math-only.
- [ ] Crew log text appears on `/progress`; `STORY_BEAT` memory influences next Rho line (spot-check one follow-up).
- [ ] Time: session duration + per-activity minutes recorded (hidden HUD unless toggled).
- [ ] Unknown standard code still **rejects** (orchestrator cannot invent Florida codes).

**Anti-patterns (must NOT happen)**

- [ ] Graphic novel as home; Three.js overworld; language-tutor as product.
- [ ] Parent must enter their password for the child to play daily.
- [ ] Raw child chat log visible to parent (recap only later).
- [ ] Per-turn scene image gen on live loop (stills pack only).
- [ ] LLM spawning new map tiles or biomes mid-conversation.

**Regression smoke**

- [ ] `npm test` + `npx tsc --noEmit` green.
- [ ] Missing still file → placeholder, no white screen crash.
- [ ] Logout / sibling switch cannot open another captain’s session id.

---

*End of master plan. Re-read §0 and §11 before writing code. Update §18 when you do.*
