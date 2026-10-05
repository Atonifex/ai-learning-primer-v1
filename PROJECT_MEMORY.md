# Primer working memory

## Session focus — 2026-10-05 (§4.16)
Locked: one subject per sitting, standards for that subject in the same view, deliberate switch, then a deep dive. Built: the chooser (`SubjectFocusPanel`) after first-run. Not built: at-bats, feedback, camp product. Five pin jobs still open from Jobs. Do not add more short jobs.

## Rho auto-read — 2026-10-05
Talking with Rho top bar has an Auto read switch. Off (`localStorage` `primer.rhoTtsAutoRead=0`) skips `/api/tts` on finished turns. `next dev` starts off when nothing is saved; production starts on. Hear Rho and Voice on/off stay separate.

## Crew log + AI debug — 2026-10-05
Camp-math unlocks only after the Ch1 crew log is persisted (`g3-reflect-u1-ch1`). Rho can call `open_crew_log` (slate) or `save_crew_log` (note from chat) — never ask the captain to type tool names. Chat notes count when Rho saves them via the tool.

Developer visibility (off unless env set):
- `PRIMER_AI_DEBUG=1` — server logs tool calls **and** results; SSE `debug_tool` events
- `NEXT_PUBLIC_PRIMER_AI_DEBUG=1` — floating AI debug strip in PlayShell (tool ok/fail). Omit both on child-facing Vercel envs.

## Test gate — 2026-10-05
Visible UI changes need `npm test`, `npx tsc --noEmit`, and `npm run test:e2e` (Playwright, `e2e/`). Close the reply with results, then offer 2–4 clickable choices for the next build slice. Jobs board “Start job” buttons are separate. Rule text is in `.cursor/rules/test-and-next-step.mdc`, `CLAUDE.md`, and `AGENTS.md`.

## Agent playtest harness — 2026-10-05
Local `/dev/agent` + `POST /api/dev/agent-bootstrap` logs in seeded `testcaptain`/`1234`, forces `firstRunStep=complete`, returns `/learn/{id}?dialogue=1` or `?board=1`. Docs: `docs/AGENT_PLAYTEST.md`. Use this for Cursor/Grok browser checks instead of Pixi/first-run.

## Mission board tool — 2026-10-05
Rho live turns = session orchestrator + tools. Added `show_mission_board` → SSE `mission_board_open` → opens `MissionBoard` overlay (not dialogue-only). Tool-first rule: new captain-facing features should usually be orchestrator tools; ask Ivan if unsure. HUD Jobs button still works.

## Ledger slice — 2026-10-05
Ch1 crew log now writes `WorldLedgerEntry` (note + missing-engineer thread) and `Chapter.handoffSummary`. The next Rho turn must reuse that note. The next learning product belongs inside a §4.16 subject dive, not a new pin. Map stamps stay later. Migration `20261005120000_world_ledger` must be applied before the new table exists.

## Current objective — 2026-10-05
Completed Ivan's authorized first prologue edit: six5s1080p `kling-video-v3_0` jobs, one take each, native officer/narrator/Rho audio, actual60 each,total360; verified remaining7,600 Premier credits. Files in `public/cinematics/prologue-v1/`: `prologue.mp4` clean1920×1080 H.264/AAC master (~30s), captioned preview, selectable-subtitle copy, separate picture/audio, per-shot sources, VTT/SRT, scripts and task records. Three missing scene stills generated from active3D refs. Whisper verifies all six spoken lines, with minor “food shipment” singular in P04 captured in captions. Five-frame samples per shot preserve style/first-person/untouched island; sampled caption rendering readable. User playback review remains for voices/motion/lip-sync. Caption coverage unit test + full54-test suite and TypeScript typecheck passed. No website integration or crash/objective/tutorial jobs. API key untouched; CLI OAuth used. No retries or extra purchases.

Ivan selected A's polished3D animation as the style for all future videos. Created `docs/CINEMATIC_STYLE_GUIDE.md` and routed AGENTS/CONTEXT to it. Active refs in `public/cinematics/references/3d-v1/`: revised P01 officer professionally positive + captain thumbs-up, revised S01 untouched varied island, revised S02 first-person hands at wheel + worried/stressed Rho, copied accepted P02 trade-port A. No visible captain back/body in briefing/bridge; island uninhabited with beaches/plains/river/hills/mountains; expressive emotions match scene, not constant smiles. Viewed outputs and saved prompts/gallery. These three revisions used built-in images, no Kling calls. Style accepted; new files implement feedback, dedicated character sheets and further video not yet generated. Original A/B gallery retained as history, realistic reference stays ARCHIVED.

## Earlier candidate round — superseded by 3D selection
Ivan rejected the realistic Rho pilot as creepy with a head too small for the body. Animated direction now supersedes realism. Archived the reference to `public/cinematics/references/ARCHIVED/rho-dawn-v1.png`; excluded from future inputs. Created exactly eight static scene candidates using built-in ChatGPT image generation, no Kling calls: P01 briefing, P02 resource exposition, S01 Rho introduction on ship, S02 storm bridge, each A (3D animation) / B (painted 2D characters). Saved all PNGs, prompts and comparison in `public/cinematics/references/animated-v1/REVIEW.md`. Await user choices/feedback before dedicated reusable character sheets or any further video. Generated island settlements are unapproved background details to remove before chosen references enter production. Game art unchanged.

## Earlier pilot — rejected visual direction
Ivan authorized one short Kling test before further videos. Candidate realistic Rho/beach reference generated with built-in image tool and now archived at `public/cinematics/references/ARCHIVED/rho-dawn-v1.png`; pilot prompt/task record in `docs/KLING_PILOT_01.md`. Official global CLI OAuth succeeded, account verified Premier/8,000 credits. Completed one silent `kling-video-v3_0` pilot, saved `public/cinematics/pilots/rho-dawn-pilot-01.mp4`; actual charge40, verified balance7,960. Metadata: H.264,1916×1080,24fps,5.04s,no audio. Five sampled frames show stable recognizable identity/setting but brief mouth opening despite closed-mouth instruction; user rejected the visual direction, no lip-sync claim. Native MCP tools still absent, CLI works. Provided API key untouched; OAuth needs no key. No batch/retry authorization.

Broader objective: 30s mission prologue + 30s crash + proposed 30s leadership objective, editable captions, explicit learning purpose. Initial survey resources oil/gold/silver ores; short trade explanation included. Tutorials deferred. Scripts/captions and learning copy saved; budget in `docs/KLING_CREDIT_BUDGET.md`; backlog in `docs/FUTURE_STORY_IDEAS.md`. One pilot generation now authorized/submitted as above; remaining production and app integration await review. No app-code changes.

## Video constraints / confirmed observations — 2026-10-05
- Current cinematic direction: approved A-style3D animation, friendly, balanced head/body proportions with readable expressive acting including stress/concern when appropriate. Canonical guide `docs/CINEMATIC_STYLE_GUIDE.md`. Briefing/bridge first-person hands only. Island initially uninhabited with varied terrain. Earlier realism/2D options superseded. Simple language for Grades3–8, action without blood or on-screen harm; Pixi home stays locked.
- Existing canon: Guild airship in storm, child captain, Rho humanoid AI First Mate, young-adult crew, escape/parachutes, dawn beach.
- Ivan clarified mission: crew works for Merchant Corporation, surveying island natural resources for extraction and sale on different planets to make company money. Interplanetary commerce is explicit upfront; this supersedes older blanket space concealment for the premise. Total intro now approximately 60s (30s prologue + 30s crash).
- Prologue requires first-person direct address plus classic exposition narration. All speech has editable subtitles; keep voice, music, effects, picture, and text sources separate. VTT is a storyboard draft pending final audio and not yet wired into the player.
- Ivan additionally requires post-crash leadership objective: gather crew, build camp, rebuild ship, rise in world, lead space empire. Objective confirmed; 30s clip and peaceful trade/council imagery proposed. Approximately 90s cinematic sequence if accepted. Empire is future saga, not built scope.
- Ivan prefers honest educational framing rather than concealed learning/test purpose. MASTER placement wording updated to visible low-pressure diagnostic purpose; actual diagnostic remains unbuilt. Real tests and writing/speaking evidence are intended progression requirements, not current verified functionality.
- Verified live `_shared_castaway_world.ts` still forbids planet/space references. Record this mismatch for a later synchronization before cinematic release; no runtime prompt changed in this authoring turn.
- Verified `public/cinematics/` has only README, no MP4. IntroCinematic currently autoplays muted, crops with object-cover, and displays fixed overlay copy. Tutorial video system is not built.
- Kling tool calls are not exposed in the running chat after registration; refresh the connection/session before capability discovery. OAuth success does not establish available models, credits, costs, or generation quality.
- Initial survey targets now oil and gold/silver ores; lithium/batteries and rare/unknown materials are later discoveries. Prologue trade slot proposed: “Trade brings materials for homes, food shipments, and travel between planets.” Full user wording retained in brief; no revival of control videos.
- Official rendered MCP FAQ checked 2026-10-05: web-equivalent prices, paid Personal credits only, no bonus/off-peak free MCP generation/Team benefits, no cancellation, result URLs valid 24h. Policy says technical failures refund; unwanted successful takes consume credits. Subscription credits valid one month; purchased top-ups two years.
- Live signed-out membership page confirms public monthly first-purchase/renewal offers: Standard 660 credits USD6.99/8.80; Pro 3,000 USD25.99/32.56; Premier 8,000 USD64.99/80.96. Account/checkout eligibility not verified. VIDEO 3.0 public 1080p baseline 8 credits/s silent, 12 native audio, optional voice control +2; connected model quote still requires verification.
- Membership FAQ Q9 confirms purchased subscriptions apply one at a time, with higher tiers prioritized. Introductory purchase offer is limited to one use; do not assume a second discount or price-difference-only upgrade from Pro to Premier. Personalized charge/proration/credit allocation remains unverified; check signed-in checkout before payment.
- Automatic approval review rejected external-browser discovery because it might expose unrelated authenticated accounts. Do not repeat it for this task; the CLI OAuth completed successfully without that step. No credentials or OAuth links retained in project files.

## Video proposals / next actions — not accepted commitments
- Proposed prologue: Guild officer addresses captain → resource needs across planets → island survey mission → resource shipping/sale → report/company profit → Rho departure. Guild briefs on behalf of Merchant Corporation is a proposed relationship, not confirmed ownership structure.
- Crash proposal remains 30s: storm → captain pulls escape handle → open parachutes → distant empty-ship crash → safe dawn → supplies/crew mission. Rho's introduction moves to prologue.
- Tutorial videos explicitly deferred; parked drafts are not a production commitment. Existing tutorial text remains.
- Communication proposal: short learning disclosure before cinematics; concise read-aloud learning card after; mission skills, practice/test labels, plan/check/reflect prompts, and specific feedback during play. Do not require a fourth explainer video. Rubric, independent-mode, retry/review, and skill-gate design remain proposals.
- No evidence supports “far faster” for Primer yet. Recommend “Focus on what you need; get help when stuck; move ahead when ready.” General EEF/IES research supports metacognitive instruction and retrieval/explanation, not a measured Primer speed claim.
- Review script and realistic references, inspect connected tools/account and current charges, agree a spending ceiling, then generate one representative shot before the rest. Before release: align captions to audio, wire external captions/sound controls, and sync live premise. No purchase or generation authorized by the script alone.
- Model advice is qualitative: Sol Medium for production; optionally Astra High for a creative critique. No measured quality comparison available.
- Proposed credit allowance 3,000–5,000 for polished 90s with source footage, a few takes, references, some dialogue; initial test cap 300–500 for approval. Pro monthly staged start; Premier monthly for more retry room. No purchase/charge authorization from readiness discussion.
- Future fusion idea saved outside current scope: abundant/available deuterium/tritium, discovered through chemistry/fusion learning, roughly Grade 6 tentative. Proposed mechanism: water/deuterium + lithium deposits + still-operating tritium-breeding facility. Mechanism not accepted canon; tritium scarcity/decay and fusion-vs-chemistry retained as scientific distinctions. AGENTS/CLAUDE/CONTEXT route future ideas to backlog; no early reveal or implementation.

## Prior objective / pedagogy context — 2026-10-05
Ivan evaluated the educational and enjoyable backbone after curriculum and standards mapping. Research and product advice below remain context, not implemented product changes.

## User constraints
- Game and story should activate curiosity and facilitate learning; avoid rewards overshadowing learning or creating overjustification.
- Support autonomy, relatedness (characters, parents, eventual cohorts), and competence through meaningful challenge and feedback.
- Avoid overinvesting in the 2D/3D world. Existing Pixi home remains the documented product choice.
- Clarification: Ivan wants to prioritize the AI-driven learning experience and eventually use curated YouTube content as a bridge to the real world, followed by reflection and mission application.

## Observed facts
- Read CLAUDE.md, CONTEXT.md, MASTER_VISION_PLAN.md and relevant mission/overlay code. No existing project working-memory document was found.
- Current mission catalog has five static jobs; XP/rations are explicitly stubs derived from completion.
- Overlay path parses multiple-choice items. Submission assigns the aggregate quiz correctness to every linked standard; this is guided evidence, not independent item-level mastery proof.
- Master plan already specifies coherence, active work, ZPD scaffolding, reflections, and later activity tools. Its dated status matrix is documentation, not a fresh runtime verification.

## Proposals — not accepted commitments
- Next proof slice: one 15–20 minute investigation where academic reasoning directly changes the world, followed by explanation and unassisted transfer.
- Evaluate learning and enjoyment together with a small formative child playtest, then delayed recall; small samples diagnose design, not establish efficacy.
- Keep feedback and consequences dependable; use surprise for discoveries rather than intermittent academic rewards.
- Prototype parent connection through a short child-led artifact explanation before building a dashboard or multiplayer.
- Morning recommendation: author and manually rehearse one learning encounter (question, attempt, short resource, recall, application, feedback, independent check) before further world mechanics or a generalized video integration.

## Research references
- Habgood & Ainsworth (2011), intrinsic integration: https://tca2.education.illinois.edu/docs/librariesprovider23/default-document-library/j-of-the-learning-sc-2011-habgood.pdf
- IES learning practice guide: https://ies.ed.gov/ncee/wwc/PracticeGuide/1
- Deci, Koestner & Ryan (2001), rewards: https://www.selfdeterminationtheory.org/SDT/documents/2001_DeciKoestnerRyan.pdf
- Bastani et al. (2025), AI and unassisted learning: https://pmc.ncbi.nlm.nih.gov/articles/PMC12232635/

## Next actions / open questions
- Ivan to choose a first investigation and playtest families; recommendations do not change locked scope.
- No browser playthrough, database verification, curriculum mapping audit, or efficacy study performed in this advisory turn.
