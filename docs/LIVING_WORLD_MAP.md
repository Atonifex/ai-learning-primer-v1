# Living expedition map — 2026-10-05

Ivan authorized a substantial world-map and Rho interaction redesign, including dynamic updates from generated content. Preserve Pixi home, dialogue left/portrait right, subject-focus learning, Luna live turns, and the shared saga. Read PROJECT_MEMORY.md before continuing; update it concisely after meaningful discoveries.

## Design

The island is the focal point: lagoon `#166c78`, deep ocean `#153e4b`, sea glass `#a4ded1`, dune `#ead4a0`, forest `#346b50`, signal coral `#e7835f`. Existing Geist for controls and readable descriptions; Georgia only for atlas place titles. Use left-aligned, plain-language objectives. The atlas is a navigator's chart with a location list, not a dashboard of generic cards.

```
Walking: captain + supplies      Island map / Focus / Jobs
                 living Pixi island
         current destination / location actions
Rho radio                               compact chart

Atlas: chapter problem                      Return
          coast + landmarks       selected location
                                  tasks / captain note
                                  Walk here / Ask Rho
```

Review: keep bright coral for the captain/destination and sea glass for established places; do not scatter animated badges around the interface. Movement and a chosen route provide motion; ambient waves stop for reduced motion. Canvas navigation has equivalent named DOM controls. No new external fonts, embeds, libraries, or paid assets.

## Data contract

- A learner-owned snapshot projects saved chapters, mission completions, generated activities, and map notes. Both Pixi and atlas consume it. Refresh after tool events/work completion, when the tab regains focus, and periodically while visible. Ignore stale responses; keep the last good map on failure.
- Generated activities attach to a validated known location (camp by default) and remain accessible after reload. Their questions are fetched separately with ownership checks; answer keys never go into the snapshot. “Back to map” lets the captain defer generated work without recording a completion; reopening starts a fresh attempt.
- Chapter `plannerJson.mapStamps` accepts bounded catalog recipes and named terrain slots. Only active/completed chapters appear. Existing chapters without a pack receive a deterministic chapter marker. No live arbitrary terrain generation or invented curriculum. Planned chapter titles stay hidden.
- Rho can open/focus the map and save a captain-requested place note. These tools use actual snapshot IDs, enforce locks server-side, and emit map events. Notes never award mastery, claim a building is built, or unlock a chapter.
- Chapter activation controls northern access; pathfinding and both map views use the same terrain rules. Learning still starts with subject selection and placement.
- A job handoff follows the returned session ID and resets session-local state. The island renderer pauses while the job loads and during navigation; a visible opening state prevents conflicting interactions.

## Research applied

- [Nielsen Norman Group: usability heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/): visible status, recognition instead of recall, clear exits → update feedback, shared labels, resumable dialogue.
- [Xbox Accessibility Guideline 109](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/109): revisit objectives and completed work; optional paths; postpone unrelated interruptions → chapter problem, task states, route, no forced quiz when new work arrives.
- [Game Developer: Level design, tricks of the trade](https://www.gamedeveloper.com/design/level-design-tricks-of-the-trade): distinct landmarks and signposting → wreck silhouette, dune, grove, creek, camp; terrain stays spatially stable across modes.

These are design applications, not evidence of measured learning or retention gains in Primer.

## Verification plan

Unit-test projection, locks, pack validation, route reachability, tool contracts and ownership. Browser tests cover atlas → Rho → atlas, live generated content → reload, notes, task completion, responsive navigation and errors. Run full Vitest, TypeScript and Playwright; then exercise actual interactions in the browser.

## Implemented limits

The map projects saved story state. A new Chapter Compiler is not implemented: active/completed chapters from Chapter 3 onward accept up to three validated stamps or receive a fallback marker in a six-slot northern catalog. Planned chapter titles stay hidden. The current active arc supplies chapter locations; retired or unknown activity locations fall back to camp. New activity cards currently represent generated mini-quizzes; additional tool types can extend this model. They are real saved questions, not additional terrain.

Captain position resets to the beach on reload; chapter reveals, work and notes persist. Walking exploration fog is still future work. The map adds no building reward for a note or quiz and does not restore the removed camp-sentence exercise. No database migration or new runtime dependency is required.

## Verification evidence — 2026-10-05

- Full unit suite: 114 tests passed. TypeScript check passed using the local compiler (the machine's global npx launcher points to a missing installation).
- Final full browser suite: **20/20 passed in 4.1 minutes**, with the implementation held steady. All five new map tests passed, including real note persistence, generated-content SSE/reload/defer/completion, chapter reveal, walking/return to chat, and mobile failure/retry. The cross-subject Jobs handoff passed in 12.4 seconds.
- Live browser: Rho executed the actual note and map tools from “save a note at the creek… then show me the creek.” The map opened with Creek selected and the saved note present. Rho then generated “Camp Flasks: Even or Odd”; its three actual questions appeared at Camp, survived a full reload, and opened from the map while chat remained unobstructed until the captain chose the task. “Back to map” returned to the still-ready activity without submitting. Automated generated-content/completion and chapter events also use controlled fixtures. Screenshot: `docs/living-map-preview.png`.
- Regression failures corrected: a catalog slot was in water (moved onto reachable land, all six slots route-tested); final movement position was suppressed by coarse position updates; map loads needed bounded timeouts/coalesced refreshes. Jobs now follow the actual returned session ID and reset session-local hooks; pausing Pixi through both loading and navigation resolved repeated handoff timeouts. Earlier runs also hit slow development-route/database requests and a connection reset; the final complete run passed. The long-lived dev server developed database authentication timeouts and was restarted successfully. Avoid interpreting those outages as map correctness evidence.
