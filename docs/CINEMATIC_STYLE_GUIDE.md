# Primer cinematic style guide

Locked by Ivan, 2026-10-05: **the A candidates' polished 3D family-adventure animation**. Applies to all future Primer videos and their cinematic reference images, including later tutorials. Pixi home/game art remains its existing style. MASTER is product authority; this guide is the visual production reference. Current user feedback supersedes the guide when direction changes.

Before any cinematic work, read `PROJECT_MEMORY.md`, this guide and the relevant script. After meaningful discoveries, update memory concisely with accepted decisions, asset versions and costs. Never include credentials. Use active references below; older A/B candidates are history, and ARCHIVED assets are excluded from generation inputs.

**Historical production reference extension, 2026-10-05:** V03 added matched physical briefing officer, Rho handshake/corridor, docked cockpit and ship exterior in `public/cinematics/prologue-v3/references/`. Retain these as history; current V05 references below supersede the old officer and wingless craft for new production. `public/cinematics/prologue-v3/README.md` records generated footage, editable materials and remaining playback-review limitations. The same shuttle/scout ship appears throughout; no second vehicle.

**Earlier V04 playback corrections, 2026-10-05 (identity/names superseded below):** V04 screenplay/design is `docs/OPENING_SCREENPLAY_V04.md` after three review cycles. Existing officer is **Sara, Director at Merchant Corporation**, always physical in briefing, never replaced by her face on a screen. No early thumbs-up; one permitted only after app deal acceptance. Rho is a professional expedition colleague: normal distance, brief purposeful eye contact, map/checklist/destination focus, quick handshake release. No coy/romantic walk. Concern during rain/danger lasts through the alert; reassurance returns after safety. Exterior/landscape prompts and references must exclude all viewer hands/body/cockpit, rather than inherit first-person foundation. Requested runway takeoff needs a proposed fixed-wing/wheeled aircraft reference sheet retaining color/character identity; older wingless airship exterior is incompatible. Names Vela/Farreach and exact aircraft design remain proposals. Do not generate V04 until camera/geography/vehicle/animatic checks are done; V03 remains media history/working app.

**Current V05 production references:** `public/cinematics/prologue-v5/references/` carries the mustached Wilhelm office/map, retained Rho, matching fixed-wing twin-prop aircraft/runway/cockpit, Fortuna landscape, seven-person safe escape and dawn recovery. These supersede V03 officer/wingless-airship references for new scenes. `shots.json`, per-job prompts and `review/decisions.json` are the production authority for actual shot timing and checks. V03 remains runtime until full V05 verification.

**Clean Rho Element,2026-10-05:** V5 uses `323213596308599` from corrected dawn/cockpit/handshake references with the original synthetic Rho voice. Old V3 Element references contain the former officer/background context and can spawn an unwanted assistant; preserve as history, use clean V5 context in new scenes. Exact character resource is in `public/cinematics/prologue-v5/rho-element-v5.json`.

**Emergency continuity,2026-10-06:** use worried Rho Element `323217795314817` with the original Rho voice for storm/cockpit emergency. `aircraft-fire.png` forces persistent right-engine damage and nose-down motion after the bolt; `cockpit-fire.png` keeps damage outside the right window. `cockpit-handle-pulled.png` is the fixed wide end frame for the captain’s left-glove contact with the left-wall blue handle. Review actual contact at higher temporal sampling; an arm rising toward the roof is a failed pull, even with correct dialogue.

## Visual style

**Rho introduction, accepted 2026-10-05:** During the professional handshake, Rho says: “I'm Rho, your first mate. I'll help you learn about Maya and Fortuna, and guide you along the way.” Delivery is warm, clear and professional, with natural speech timing and editable subtitles.

**Latest accepted story/tone update,2026-10-05:** planet **Maya**, island **Fortuna**. Future briefing officer is a **male military man**, friendly but stern, named **Sergeant Wilhelm**, with a **mustache**, representing **Merchant Corp** per the user's correction. This supersedes the female officer identity for new production; old officer imagery/voice/Element remain history only. Current condensed screenplay is `docs/OPENING_SCREENPLAY_V05.md`. New male identity/expression references required. User requests occasional fun/comedic effects; favor dry bargaining reactions, brief practical visual beats and restrained sound accents, without romantic acting or undermining danger/competence. Requested lightning strike ignites an aircraft engine, causes power loss and steep descent; fire stays localized outside the cabin, safe crew escape precedes empty impact, no injuries/gore/fireball. V04 names and4:47 timing are superseded; V05 targets~3:10 plus branches/waits, unrecorded estimate.

- Clearly animated 3D: appealing sculpted forms, soft illustrative skin, expressive eyes, simplified tactile cloth/wood/metal, cinematic depth and light. Avoid photorealistic humans, uncanny faces, plastic dolls, pixel art or a drift into painted 2D characters.
- Balanced proportions: heads slightly larger than realistic anatomy, comfortably scaled to modest shoulders and slim/practical bodies. Do not shrink heads relative to torso. Match reference proportions rather than forcing a numeric ratio in every shot.
- Warm brass/amber light, teal ship surfaces and visor accents, navy captain sleeves, brown Rho jacket. Storm changes the surrounding light to blue-gray while warm instrument light keeps facial acting readable. Dawn brings relief through gold/teal tones.
- Frame 16:9 with one readable action per source shot. Keep hands, faces and important props large enough to read; preserve lower space for editable subtitles. Compose for central cropping without losing the storytelling action.

## Character identity and emotional acting

**Rho:** friendly young-adult female humanoid AI first mate. Short side-swept golden blond hair, amber eyes, thin translucent teal visor that keeps eyes readable, subtle cheek-edge panels and simple metallic neck collar, brown flight jacket with teal shoulder panels and cream shirt. Keep the approved animated face/proportions; avoid exposed frightening machinery. Rho helps the captain act rather than taking over their decision.

**Briefing officer for new production:** Sergeant Wilhelm, a male military man with a distinct neat mustache, representing Merchant Corp. Friendly but stern: focused eye contact, upright posture, controlled warm greeting, restrained gestures, firm negotiating terms and occasional dry comic reaction. Locked V05 practical teal/navy uniform with brass details and neat mustache; use the approved V05 Wilhelm references/Element, with no weapon. Former female officer face/costume/voice are superseded, not reusable identity references. Later conflict role belongs in Future_Development_ideas F04, not an opening villain reveal.

**Captain/player:** identity remains open. Declared first-person briefing/bridge shots may show gloved hands and short navy cuffs: no head, face, back or body. Briefing hands stay down until an accepted deal; at most one acceptance thumbs-up. In cockpit danger, hands operate the visible controls/escape handle. **External island, aircraft, parachute and wreck shots show no captain hands/body or cockpit framing.** Camera family is explicit per shot; never attach a universal first-person-hand instruction to scenery.

| Story beat | Required expression/posture |
|---|---|
| Welcome/exploration | Rho's open smile, bright engaged eyes, relaxed posture |
| Professional briefing | Officer's restrained encouraging smile, focused eyes and composed posture |
| Storm/escape urgency | Rho's brows draw together with inner brows lifted, eyes widen, mouth tenses or opens for urgent instructions, body braces and leans forward; no cheerful grin |
| Thinking/problem solving | Focused gaze, slight brow tension, small deliberate gestures |
| Safe landing/recovery | Visible relief, softened posture, reassuring warmth |

Use clearly readable, somewhat exaggerated emotion like an animated children's TV adventure. Positivity is a baseline, not a permanent expression. Danger needs genuine concern/stress, while Rho remains capable. Avoid horror faces, prolonged screaming or a panic that overwhelms the learner. Guide expression through eyes, brows, mouth and posture together; do not rely only on an adjective such as “worried.”

## Island and location continuity

- The surveyed island is **uninhabited at arrival**: no buildings, villages, lights, roads, cultivated fields, ports, walls or ruins in opening references. Later player-built camp/repair structures belong only to the appropriate future story beat, never the untouched arrival view.
- Mixed terrain: broad sandy beaches, flatter grassland/river plains, winding river, low rolling hills, forests, and inland mountains. Mountains occupy part of the island; do not replace the entire coastline with jagged cliffs/spires. Leave believable flat areas for a later camp.
- Use the same terrain layout across calm arrival and storm shots. Weather/time changes; geographic features do not jump around. Current wide shore, river plain and inland ridge are visual anchors; a formal island map is not yet authored.
- Populated planets/cargo ports in the resource exposition are separate locations and may have buildings. Do not transfer their settlements onto the surveyed island.

## Ship, props and camera

- Same V05 teal/cream/brass fixed-wing, wheeled twin-prop survey aircraft throughout, with rounded cockpit glazing, brass window ribs, warm gauges and wood/brass wheel. Use the V05 runway/flight/cockpit references; the older wingless craft is history. Keep civilian survey equipment rather than weapons.
- In the active 3D cockpit, the **blue escape handle is on the left wall** from the captain's viewpoint. Keep that side and its position across shots. Rho braces at the rail while pointing to it in the storm.
- First-person bridge has wheel/hands at the bottom and Rho clearly visible beyond it. No accidental rear view of the captain. Limit motion to an intentional camera move; avoid violent shake or rapid flashes.
- Oil is safely sealed; gold/silver samples are ore-bearing rocks, not pure metal bars. These are survey targets/illustrative cargo, not proven island discoveries. Lithium/fusion discoveries stay out of the opening.

## Historical approved 3D reference family

Folder: `public/cinematics/references/3d-v1/`. These retain the original approved style family; current production uses V05 references above. `REVIEW.md` shows those original four scenes. `prompts.json` retains exact revision prompts and source provenance.

| File | Role | Status |
|---|---|---|
| `p01-briefing.png` | Officer, professional tone, console and thumbs-up acceptance | Revised to feedback; scene playback review still needed later |
| `p02-resources.png` | Accepted 3D look for populated trade port/materials | Copied from original P02 A; distinct planet/port location |
| `s01-rho-introduction.png` | Rho identity/costume, cockpit and corrected untouched island | Revised terrain; warm introductory acting |
| `s02-storm-bridge.png` | First-person wheel/hands, stress acting, same island/cockpit | Revised to feedback; urgent acting |

Style A is accepted. New scene revisions are current working references, not a claim that Ivan has already reviewed the new files. Dedicated character/expression turnarounds and an exterior ship/island map are not yet generated. When making them, derive from the active references without redesigning accepted identities.

## Reusable prompt foundation

> Polished stylized 3D family-adventure animation matching the supplied active Primer references. Appealing sculpted forms, expressive eyes, soft illustrative skin, simplified tactile cloth/metal/wood, balanced slightly larger heads and modest shoulders. Teal/brass/navy/brown palette, cinematic light, one clear action, 16:9. Preserve the referenced character identity, costume, geography and prop placement. Emotion is [specific eyes/brows/mouth/posture for the story beat]. For player-view briefing/bridge: first-person eye position, only hands and small navy sleeve cuffs in foreground, no visible captain body or rear view. Survey island at arrival: uninhabited beaches, flat river plains, rolling hills, forests and inland mountains, no buildings/lights/roads/ruins. No photorealism, tiny heads, gore, weapons, horror, embedded lettering or subtitles.

For trade-port shots, replace the surveyed-island clause with the explicit populated off-island location; do not blindly apply contradictory settings. For a later camp scene, state that construction occurs after arrival. Add exact shot action, approved source filenames, required mood and continuity constraints. Put dialogue/audio requirements in the shot specification, not in a still image caption request.

## Review before video spending

Latest screenplay/shot design: `docs/OPENING_SCREENPLAY_V05.md`; V04 retains the earlier three critique/rewrite cycles. V03 is generated/working media, not final accepted footage. Same physical Sergeant Wilhelm, mustache and set across offers, silent matching-endpoint waiting anchor, app-owned choices. One ship throughout is confirmed; requested runway mechanics require a reviewed matching aircraft sheet before new production. Rho left and blue escape handle left in cockpit. Simple dialogue retains the user-requested Sergeant Wilhelm/Merchant Corp terms and ten/fifteen/twenty percent; define resources concretely and use collect/get for extract.

For script iteration, follow `docs/CREATIVE_IMPROVEMENT_CYCLE.md`. V05 is current authoring/production; V03 remains runtime until complete V05 validation. V04/V02 are editorial history. Let dramatic beats and accepted dialogue determine edit duration, not uniform generation slots. Listen for pronunciation and consistent performance; transcription alone is insufficient.

Inspect identity, proportions, natural hands, readable emotion, camera viewpoint, terrain, prop side and any accidental text. Preserve one active version per shot while retaining prior candidates as history. Generate static corrections before spending video credits. A still reference helps continuity but does not guarantee motion or lip-sync quality.

All spoken audio needs editable external captions. Keep clean picture and separate dialogue/music/effects/text/edit sources. No baked-in subtitles in the sole master image/video. Keep danger school-appropriate: no blood, injuries, on-screen harm or fireball; crash occurs after visible safe escape. Tutorials remain deferred. Paid generation must stay within explicit user authorization. The entire V05 sequence and at most two corrective retakes per segment are authorized; tutorials remain deferred.
