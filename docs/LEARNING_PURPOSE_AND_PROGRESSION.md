# Primer — honest learning purpose and progression

2026-10-05. Status: communication/design proposal for Ivan's review; no runtime changes. Read `PROJECT_MEMORY.md` and MASTER §4.4/§4.12/§8 before implementation; update memory concisely after meaningful discoveries. Do not store private learner responses here.

## Confirmed user direction

The student should know Primer is a learning platform. Story supports the learning goal. AI dialogue, questions, reflection, and learning how to learn are central. Periodic real tests and demonstrated writing/speaking ability determine progression. The post-crash cinematic establishes captain → gather crew → camp → rebuilt ship → rising influence → leadership of a space empire.

Detailed wording, assessment rules, unlock criteria, timing, and UI below are proposals, not implemented behavior. The long-term empire is a saga aspiration, not a feature currently built. Current bank overlays and aggregated quiz correctness do not establish independent item-level mastery, writing proficiency, or speech proficiency.

## Recommended opening sequence

1. Before cinematic playback: one plain-language disclosure, with optional read-aloud: **“Primer is a learning adventure. Build real skills to move the story forward.”** The learner should hear/see the purpose before investing in the fiction.
2. Mission prologue (30s), crash (30s), then proposed leadership objective video (30s). Approximately 90s cinematic runtime total; preserve skip and replay. Do not require a fourth instructional video. Existing control tutorials remain text/interactive and video production stays deferred.
3. After the objective, show a concise “How learning works” card. Read-aloud is optional; this is explicit educational copy, not a fictional corporate contract. Continue into the first playable task promptly.
4. During first jobs, explain that they help estimate starting skills. Do not surprise the student later with the fact that a supposedly unmeasured conversation was a placement assessment.

### Student copy — proposed launch-state wording

> This is a learning adventure. You'll build skills in math, reading, writing, science, and social studies. These skills are called learning standards.
>
> Rho is your AI learning partner. Ask questions, try ideas, and explain your thinking. You'll also learn how to learn.
>
> Sometimes you'll take a real test or show what you can write and say on your own. Those skills unlock bigger missions. Need more practice? We'll help you get ready and try again.

Use this future-state promise only once the assessment/unlock system exists. Prototype disclosure should instead say: **“In this early version, you'll try story missions and explain your thinking. Real tests and skill-based story unlocks are planned.”** Do not imply the current app already offers independently scored writing/speech checkpoints or the empire arc.

Starting-skill disclosure: **“Your first jobs help us find what you already know and what to practice next. You don't need to know everything yet.”** Tasks stay embedded in the wreck/camp story; their diagnostic purpose is visible. This clarifies/supersedes the older hidden-purpose placement preference, without turning every practice action into a high-stakes test.

For Grades 3–4, read the same concrete wording aloud and explain one idea at a time. For Grades 5–8, optional “How progress works” detail can use the terms standards, mastery, and metacognition. Students can inspect actual standards without seeing code strings on every screen; parents can inspect the authoritative code mapping and evidence. Never invent standard codes in copy.

## Repeated communication in play

| Moment | Story purpose | Plain educational copy / behavior |
|---|---|---|
| Choose a mission | Recover food crates. | “Skill: divide a total into equal groups. Use it to plan food for the crew.” Show skill and purpose, not just XP or time. |
| Begin practice | Plan supplies with Rho. | “Practice — Rho can help.” Student tries first; hints/examples support real thinking. Asking for help does not revoke earned progress. |
| Before the task | Decide a plan. | “What do you know? What could you try?” A brief plan question tied to the actual skill. |
| During struggle | Recheck the crew plan. | “What's working? What could you change?” Rho models a strategy if needed, then fades support. Don't interrupt every answer with a reflection prompt. |
| After practice | Record the crew plan. | “Explain why your plan works. What helped you figure it out?” When appropriate, hide worked examples so this is recall, not copying. |
| Before a checkpoint | Show readiness for a bigger responsibility. | “Checkpoint — a real test of this skill. Try it on your own. Rho won't give hints or answers during this test.” State permitted tools, assessed skills, and what the result unlocks before starting. |
| Writing/speaking checkpoint | Write a crew message or explain a plan. | “Show your own ideas. We'll check your explanation and evidence.” Show skill-specific criteria; distinguish explaining aloud from explicitly assessed writing. |
| After success | Take on the next mission. | “You showed you can divide supplies and explain your plan. That skill unlocked the next mission.” Only say this when supported by the actual evidence. |
| Not ready yet | Prepare for the next responsibility. | “Your plan is clear. The totals need another check. Let's practice that part, then try a new test.” Feedback names the gap and next action. No crew death, loss of camp, or deletion of past progress. |
| Return later | Check a previous plan. | “Can you solve a new version without help?” Use spaced recall and a changed context, not just an immediate repeat of the same question. |

## Assessment and progression proposals

- Label evidence types distinctly: **Practice with help**, **Independent skill check**, **Chapter/unit test**. A tiny recall question may be low-stakes practice; periodic formal tests must still be called tests even when they appear as Guild inspections. A story label can coexist with a clear assessment label.
- Keep practice open-ended with Rho support. For independent checks, disable answer-giving/hints for the scored skill, while retaining stated accessibility supports that do not invalidate that skill. For example, reading the question aloud may be fine on a math check but not on a decoding assessment; speech-to-text should not be silently treated as proof of spelling/written conventions.
- Prefer checks after a coherent learning sequence/chapter and larger tests at unit boundaries; frequency depends on skill coverage, not a fixed number of chat messages. State approximate scope beforehand, avoid surprise stakes or pressure timers, and set retry plans openly.
- Progress depends on relevant demonstrated skills, not time spent, talking more to Rho, or collecting XP. A learner who already knows a skill should be able to demonstrate it and move ahead; a learner who needs practice receives targeted help and alternate accessible practice paths. Design this before adding gates.
- Show prerequisites for major story responsibilities, plus the learner's readiness for each skill. Let them keep practicing/exploring available activities if one prerequisite is not ready; don't stall all four subjects behind an unrelated writing score.
- Writing/speaking use grade-appropriate rubrics, e.g. accurate ideas, relevant evidence, clear reasoning, then the explicitly assessed conventions. Do not grade accent, personality, apparent confidence, or microphone quality as knowledge. Provide a recording/transcription-error retry path and a route for review of disputed scoring.
- A learner can speak a reflection when the aim is explaining reasoning. A writing checkpoint still requires a writing sample suited to the assessed objective; one mode does not prove all skills in the other. Define equivalent accommodations per skill rather than assuming interchangeability.
- AI supports learning but can make mistakes. Teach “What evidence supports that?” and cross-check important claims. Avoid treating fluent AI-written answers or AI-assisted practice as independent student mastery. Rubrics/checkpoints need quality review before carrying consequential unlock decisions.
- Keep `standardsMasteryMath` unchanged in this authoring task. Assessment items, rubric calibration, independent-mode behavior, review flow, and gate implementation are future work; no new threshold or universal pass percentage is declared here.

## Teach metacognition concretely

Use **Plan → Try and check → Explain and improve** inside subject tasks. Rho briefly models a useful strategy, practices it with the learner, then asks the learner to choose/apply it independently. Reflection should identify a strategy and its effect, not produce a generic “I learned a lot” sentence.

Useful student-to-Rho examples:
- “Give me a hint, not the answer.”
- “Show me a different example.”
- “Ask me why my answer works.”
- “Give me a new problem to try alone.”

Teacher-facing term: metacognition. Child-facing explanation: **“Notice how you learn, so you can choose what helps.”** Use the learner's task and subject, not a separate abstract metacognition quiz or a promise that conversation alone is enough.

## Honest effectiveness language

Do not promise “far faster,” “years ahead,” or a multiplier until Primer has comparative evidence on independent learning and retention. Proposed copy: **“Focus on what you need. Get help when you're stuck. Move ahead when you're ready.”** Faster progress is an aim to evaluate, not a fact established by general AI or learning-strategy research.

A future evaluation should track independent skill performance, delayed recall/transfer, and time to a defined learning criterion; chat volume, task completion, and enjoyment alone do not establish accelerated mastery. State the comparison, cohort, and uncertainty before making speed claims.

## Research supporting the design, not a Primer efficacy claim

- EEF, Metacognition and Self-Regulated Learning (2025 guidance): explicit planning, monitoring, evaluating, modelling, scaffolding, and integration into subject learning. https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/metacognition
- IES, Organizing Instruction and Study to Improve Student Learning: retrieval quizzes, spacing, worked examples with independent problems, and explanatory questions. Evidence strength differs by recommendation. https://ies.ed.gov/ncee/wwc/practiceguide/1

## Next implementation decisions

Review copy and video script, then define one skill-based mission with a practice/checkpoint/reflection contract and clear rubric. Confirm assessment constraints and accessible retry/review behavior before writing unlock code or claiming launch-state learning promises. Tutorial videos remain deferred. No assets generated or app behavior changed here.
