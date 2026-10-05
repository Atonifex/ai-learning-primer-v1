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
- Generated activities attach to a validated known location (camp by default) and remain accessible after reload. Their questions are fetched separately with ownership checks; answer keys never go into the snapshot.
- Chapter `plannerJson.mapStamps` accepts bounded catalog recipes and named terrain slots. Only active/completed chapters appear. Existing chapters without a pack receive a deterministic chapter marker. No live arbitrary terrain generation or invented curriculum. Planned chapter titles stay hidden.
- Rho can open/focus the map and save a captain-requested place note. These tools use actual snapshot IDs, enforce locks server-side, and emit map events. Notes never award mastery, claim a building is built, or unlock a chapter.
- Chapter activation controls northern access; pathfinding and both map views use the same terrain rules. Learning still starts with subject selection and placement.

## Research applied

- [Nielsen Norman Group: usability heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/): visible status, recognition instead of recall, clear exits → update feedback, shared labels, resumable dialogue.
- [Xbox Accessibility Guideline 109](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/109): revisit objectives and completed work; optional paths; postpone unrelated interruptions → chapter problem, task states, route, no forced quiz when new work arrives.
- [Game Developer: Level design, tricks of the trade](https://www.gamedeveloper.com/design/level-design-tricks-of-the-trade): distinct landmarks and signposting → wreck silhouette, dune, grove, creek, camp; terrain stays spatially stable across modes.

These are design applications, not evidence of measured learning or retention gains in Primer.

## Verification plan

Unit-test projection, locks, pack validation, route reachability, tool contracts and ownership. Browser tests cover atlas → Rho → atlas, live generated content → reload, notes, task completion, responsive navigation and errors. Run full Vitest, TypeScript and Playwright; then exercise actual interactions in the browser.
