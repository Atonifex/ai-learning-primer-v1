# Bottom dialogue and reusable speaker — implementation plan

Date: 2026-10-06. Status: plan for review; no runtime implementation in this slice.

## Requested and accepted direction

Source: Ivan's interface request and three clarification replies in this chat.

- Main conversation runs across the bottom, approximately 45% of the playable viewport on desktop/landscape tablet.
- Speaker picture is at bottom-right. Speaker name sits above the chat area, on the dock's upper edge. Rho is the first speaker; picture/name presentation must be reusable for later characters.
- Small embedded content stays inside chat; larger content expands from the right.
- Chat opens during conversations. Exploring uses a compact Rho/radio control.
- Default reading view is the latest exchange plus a History button.
- Phones/narrow portrait screens may use taller chat and temporarily full-screen learning content.
- Plan, risks, mitigation and evaluation precede implementation. This document does not authorize starting implementation during the planning turn.

The supplied Prodigy screenshot is a spatial reference. Primer retains its own art, amber/cream/teal palette and Pixi island. Screenshot labels and dialogue are reference content, not instructions.

## Recommended layout for review

**Conversation only:** upper ~55% shows the island; lower ~45% is an opaque cream dialogue dock. Latest learner message and current speaker reply occupy the left/center. Choices and a pinned speak/type composer sit below. A contained portrait occupies roughly 20–25% of dock width at bottom-right; its exact width is a prototype decision, not a fixed requirement. Nameplate sits on the dock's top edge, aligned with the speaker column. Keep a readable minimum width for text; reduce portrait size before shrinking text.

**Expanded content:** a titled workspace opens at upper-right, above the dock, leaving chat and the bottom-right speaker intact. Start near 40% of screen width, expand toward 65% when the activity needs it, and offer Maximize to fill the upper area. These widths are prototype defaults. Each panel declares its minimum usable width; small laptops may open directly maximized. Content scrolls within the panel; its close/back controls remain visible. The island uses the remaining upper-left region; when maximized it is temporarily hidden.

This resolves the tension between a full-width bottom chat, a literal bottom-right portrait and a growing right panel: the right panel first grows across the area above chat. Desktop learning content does not silently cover the dock. If a specific activity still cannot fit, review its requirements rather than compressing controls indefinitely. Narrow-screen full-screen content is already accepted.

**Exploring:** dock and workspace close; the island returns to the full playable region and the compact Rho control remains available. Walking stays paused during conversation/content, matching the current cutscene behavior. A visible world is not automatically a clickable world.

**Small screens / keyboard:** choose layout by available width and height, not device name alone. Use dynamic viewport sizing/safe-area insets; composer stays above the keyboard, portrait becomes compact, and History/content can become full-screen sheets. No rigid 45% rule when it would hide usable input or text. Returning from content restores dialogue and the draft.

## Reading and interaction contract

- Show the latest visible exchange, excluding existing hidden orchestration turns. While Rho is streaming, keep the learner message and streaming reply together. In an empty conversation, show an invitation; never expose tool/internal content.
- Long replies scroll inside their reading area rather than stretching the whole dock. History contains the full visible transcript and opens at the latest exchange; reading older messages must not be pulled back down by each streaming token. Returning restores the current exchange and draft.
- Choices and story branches remain actionable and follow their current exclusivity rules. Opening History/content must not clear choices or send another turn.
- Preserve dictation into an editable draft, Send, Hear/replay, mute, Auto read, barge-in and autoplay recovery. Layout switches must not remount the composer or speech controller in ways that reset state/replay history.
- Use a compact header: nameplate, History, audio controls and close. Fold secondary controls when necessary; keep mic, Send and the primary decision visible. World-update/map links become compact inline cards rather than consuming multiple permanent header rows.
- Speaker identity changes name, role, picture, accessible labels and empty/composer copy together. Rho's TTS is an adapter, not a voice assumed for every character. Later speakers require an explicit voice policy; this slice demonstrates identity replacement with a fixture, not a new NPC/story integration.

## Content placement contract

| Content | Default destination | Interaction rule |
|---|---|---|
| Captain choices, short feedback, map link, recap | Inside dock | Keep composer/primary choice reachable |
| Word definition | Inside dock reading area | Clamp to dock bounds; expand right if too long |
| History | Right workspace | Full visible transcript; retain current turn/draft |
| Quiz/check/practice, reflection, Focus, Camp needs | Right workspace | Panel body hosts existing logic; preserve progress/submission/retry |
| Atlas, garden, existing enabled learning clip | Right workspace, wider as needed | Maximize upper area; preserve map/action/media policies |
| Small confirmation such as Leave | Inside dock; compact host when exploring | Explicit cancellation/focus restoration |
| Learning content on narrow screens | Temporary full-screen sheet | One active sheet, with clear return and retained state |

Use one presentation owner and one expanded workspace at a time. Opening a nested definition/confirmation is owned by that surface. Back returns to the prior surface; replacing a tool with unsaved work requires a deliberate navigation rule. Do not solve simultaneous overlays with more z-index values.

Side workspaces are nonmodal regions when chat is available; they must not claim aria-modal or trap focus away from chat. Blocking confirmations/narrow full-screen sheets use modal semantics, background inertness, focus containment and return to the opener. Escape dismisses the topmost dismissible surface; required activities retain their existing completion gates and get an explicit return/back path where permitted.

## Source findings informing the plan

- `DialogueCutscene.tsx` currently uses absolute inset-0 and a 42%-width desktop portrait; its mobile portrait alone takes 34vh. Name/copy/audio labels are Rho-specific.
- `MessageList.tsx` currently renders all visible messages and scrolls to the bottom whenever messages change. Latest-exchange selection and respectful History scrolling need explicit behavior.
- `InputBar.tsx` keeps its draft locally and limits its growing textarea to 160px. Moving/remounting it risks draft loss and crowding.
- `PlayShell.tsx` hosts separate dialogue/map/check/board/quiz/reflection/clip/garden booleans. Existing tool SSE should still open the real UI through the shell.
- Quiz/Focus currently use full-screen wrappers with modal focus handling; garden uses fixed inset-0. Their content must be separated from these wrappers before embedding.
- `ConceptPopup.tsx` currently positions against window bounds; it can escape the dock unless given surface bounds.
- `beachWorld.ts` centers using the full canvas and stops its ticker while paused. Dock/workspace changes need camera updates even while paused, or the captain may sit behind chat. Canvas resize currently follows its host.
- `SafeStill` defaults to object-cover and retains failure state. Verify contained portrait cropping and reset/recovery when speaker/art changes after a failed image.
- `e2e/quiz-over-dialogue.spec.ts` currently asserts that the conversation disappears during a quiz. Update it to assert the intended dock/panel relationship and reachable controls; do not merely remove the regression.
- Shared workspace has unrelated uncommitted onboarding, teaching, garden, choice-tool and cinematic changes. Preserve these and use current source as the migration baseline.

## Build order after plan review

1. **Layout prototype:** static desktop/tablet/narrow fixtures for dock-only, dock+workspace, long reply, choice row and keyboard-constrained height. Review actual rendered states against the reference before connecting live flows.
2. **Reusable speaker + dock:** small `DialogueDock`/`SpeakerPresence` components, a typed speaker descriptor and latest-exchange selector. Keep current stream/composer/TTS ownership. Demonstrate Rho and a fixture speaker, including missing/replaced portraits.
3. **Shared presentation host:** centralize surface selection/return behavior in the shell. Extract tool bodies from overlay wrappers; first connect History, choices, definition and one real quiz, then remaining checks/practice/Focus/Camp needs/map/garden/reflection/clip/confirmation. Preserve tool dispatch and persistence contracts. No new orchestrator tool is required merely to reposition an existing tool; any new callable behavior must follow the existing tool-first policy.
4. **World/responsive integration:** give Pixi the unobscured bounds or resize its world region, update its paused camera, preserve captain position/route, and exercise resize/keyboard/focus/media behavior. Avoid recreating Pixi on every panel toggle.
5. **Evaluation and closeout:** run required suites and interactive browser flows; fix failures, review screenshots from exercised states, sync MASTER/CLAUDE/CONTEXT layout descriptions and update memory. Keep components focused; no new dependency/database/model/curriculum change is expected.

For a later implementation prompt/handoff: read `PROJECT_MEMORY.md` and this plan first. Update project memory concisely after meaningful discoveries, corrections or changed decisions; preserve unrelated work and distinguish proposed from shipped behavior. Consult relevant bundled Next documentation before code changes.

## Risks, mitigations and proof

| Risk | Mitigation | Evaluation |
|---|---|---|
| 45% dock crowds long text, choices, header and voice input | Pinned composer; compact header; constrained scrolling; smaller portrait on short screens | Long reply + three choices + growing draft remain readable/reachable together |
| Captain or important scene area hidden behind dock/workspace | Use unobscured world bounds; update camera while paused | Captain remains visible in ordinary dock and right-panel states; location is unchanged on close |
| Independent overlays obscure each other or steal focus | One host; distinguish nonmodal workspace/modal sheet; nested surface ownership | Open each tool; Tab/Shift-Tab/Escape/Back and focus return work without overlap |
| Drafts, quiz answers or streaming state lost during moves | Keep state above movable bodies; retain component identity; explicit back/replace rules | Open/close History and panels mid-draft/mid-turn; values survive and submissions remain single |
| Streaming repeatedly interrupts reading or speech repeats | Separate latest view/History scroll behavior; retain speech controller and auto-read guard | Read older History while streaming; reopen without auto-speaking old turns |
| Portrait identity mismatches or broken-image state sticks | One descriptor, contained art, keyed/reset failure recovery | Fixture speaker swaps all labels/art; missing art recovers; no Rho voice applied implicitly |
| Smaller learning area weakens task usability | Per-tool minimum width, wider/maximized upper region, adaptive full-screen sheet | Real garden/map/check interactions fit or choose the approved fallback without clipped controls |
| Broad migration regresses session handoffs/progress | Extract presentation only; retain server validation, SSE and saved state; use existing regressions | Cross-subject job and completed-job review still return correctly and preserve evidence/rewards |

## Acceptance checklist: how we know it is good

These are proposed engineering targets, not results or claims from child testing.

- [ ] On 1440×900, 1366×768 and 1024×768 landscape viewports, ordinary dialogue dock measures 42–48% of the playable shell height; it spans its width and touches its lower edge. Nameplate is included in the occupied-height budget.
- [ ] Rho picture is visibly bottom-right and her name is above the chat body. Default latest exchange is readable at existing large dialogue text sizes; no horizontal overflow or clipped composer/choice controls.
- [ ] The island/captain remains visible above normal conversation. Closing conversation restores exploration without moving the captain, advancing required tutorial steps or resetting route/session state.
- [ ] History shows all visible turns, excludes hidden turns, supports reading older messages during streaming, and returns without losing the draft/current reply.
- [ ] Each content type in the placement table opens in its intended surface. Right panels expand/maximize as needed; no orphan backdrop/overlapping modal/floating definition escapes its owner.
- [ ] Voice dictation fills the editable draft; mic remains first-class; Send/choices produce one request; barge-in/mute/Auto read/Hear and autoplay recovery retain existing behavior. Report any real microphone/audio path that cannot be tested on the available device.
- [ ] An alternate speaker fixture changes name/role/art/labels/copy, with safe missing-art fallback/recovery; no stream/API change is necessary to change presentation.
- [ ] Exercise 390×844 and 768×1024 portrait, an open virtual keyboard on an available real/emulated device, landscape/portrait changes and 200% browser zoom. Composer and close/back controls stay reachable; narrow content uses the accepted full-screen fallback.
- [ ] Main touch actions target at least 44×44 CSS pixels; text/control contrast meets AA targets; visible keyboard focus, correct region/dialog semantics, reduced-motion behavior and topmost Escape/focus restoration pass inspection.
- [ ] Unit regressions test latest-visible exchange, placement/transition rules and speaker fallback behavior. New Playwright layout/History tests plus updated existing quiz/choice/auto-read/map/check/garden/handoff specs exercise actual actions, not just static screenshots.
- [ ] `npm test`, `npx tsc --noEmit` and `npm run test:e2e` pass on final code. Also interactively exercise conversation → tool → return, draft/History/streaming, voice controls and exploration in the browser. Record exact blocked checks instead of treating source review or typecheck as runtime validation.
- [ ] Ivan reviews dock-only and expanded-content states. A later formative learner check should confirm that a learner can identify the speaker, find mic/choices, open/return from content and keep following the scene; no learning-efficacy claim from this layout slice.

## Planning evaluation and remaining review

Checked this plan against every requested layout requirement and all three replies. Revised the initial right-panel concept to keep it above the dock so the requested bottom-right speaker stays visible. Added paused-camera, image-recovery, History scrolling and modal-semantics checks from source inspection.

No clarification remains unanswered. Upper-right expansion geometry, portrait width and prototype acceptance targets are recommendations for plan review. No application code, runtime test, browser interaction, art generation or deployment was performed in this planning slice.
