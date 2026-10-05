# Primer cinematic style guide

Locked by Ivan, 2026-10-05: **the A candidates' polished 3D family-adventure animation**. Applies to all future Primer videos and their cinematic reference images, including later tutorials. Pixi home/game art remains its existing style. MASTER is product authority; this guide is the visual production reference. Current user feedback supersedes the guide when direction changes.

Before any cinematic work, read `PROJECT_MEMORY.md`, this guide and the relevant script. After meaningful discoveries, update memory concisely with accepted decisions, asset versions and costs. Never include credentials. Use active references below; older A/B candidates are history, and ARCHIVED assets are excluded from generation inputs.

## Visual style

- Clearly animated 3D: appealing sculpted forms, soft illustrative skin, expressive eyes, simplified tactile cloth/wood/metal, cinematic depth and light. Avoid photorealistic humans, uncanny faces, plastic dolls, pixel art or a drift into painted 2D characters.
- Balanced proportions: heads slightly larger than realistic anatomy, comfortably scaled to modest shoulders and slim/practical bodies. Do not shrink heads relative to torso. Match reference proportions rather than forcing a numeric ratio in every shot.
- Warm brass/amber light, teal ship surfaces and visor accents, navy captain sleeves, brown Rho jacket. Storm changes the surrounding light to blue-gray while warm instrument light keeps facial acting readable. Dawn brings relief through gold/teal tones.
- Frame 16:9 with one readable action per source shot. Keep hands, faces and important props large enough to read; preserve lower space for editable subtitles. Compose for central cropping without losing the storytelling action.

## Character identity and emotional acting

**Rho:** friendly young-adult female humanoid AI first mate. Short side-swept golden blond hair, amber eyes, thin translucent teal visor that keeps eyes readable, subtle cheek-edge panels and simple metallic neck collar, brown flight jacket with teal shoulder panels and cream shirt. Keep the approved animated face/proportions; avoid exposed frightening machinery. Rho helps the captain act rather than taking over their decision.

**Briefing officer:** young-adult female, medium-brown skin, dark curly hair tied back, teal survey uniform, cream collar and unlettered brass circular badge. Positive but professional and serious about the assignment: focused eye contact, upright posture, restrained smile, modest gestures. Not an exuberant entertainer.

**Captain/player:** identity remains open. Mission briefing and bridge interaction use the player's eye position. Only gloved hands and short navy sleeve cuffs appear in the foreground: no head, face, hair, back, torso or over-the-shoulder substitution. At mission acceptance, one hand makes a clear thumbs-up; the other can rest at the console. In the storm, both hands firmly grip the steering wheel. Future shots with a different viewpoint must be specified deliberately in the script rather than introduced by a generator.

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

- Teal-and-brass scout airship, rounded cockpit glazing, arched brass window ribs, warm analog-style gauges and wood/brass wheel. Keep civilian survey craft, not a warship. Final exterior turnaround/layout remains to be authored; do not claim every mechanical detail is already locked.
- In the active 3D cockpit, the **blue escape handle is on the left wall** from the captain's viewpoint. Keep that side and its position across shots. Rho braces at the rail while pointing to it in the storm.
- First-person bridge has wheel/hands at the bottom and Rho clearly visible beyond it. No accidental rear view of the captain. Limit motion to an intentional camera move; avoid violent shake or rapid flashes.
- Oil is safely sealed; gold/silver samples are ore-bearing rocks, not pure metal bars. These are survey targets/illustrative cargo, not proven island discoveries. Lithium/fusion discoveries stay out of the opening.

## Active scene references

Folder: `public/cinematics/references/3d-v1/`. `REVIEW.md` shows the current four scenes. `prompts.json` retains exact revision prompts and source provenance.

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

Inspect identity, proportions, natural hands, readable emotion, camera viewpoint, terrain, prop side and any accidental text. Preserve one active version per shot while retaining prior candidates as history. Generate static corrections before spending video credits. A still reference helps continuity but does not guarantee motion or lip-sync quality.

All spoken audio needs editable external captions. Keep clean picture and separate dialogue/music/effects/text/edit sources. No baked-in subtitles in the sole master image/video. Keep danger school-appropriate: no blood, injuries, on-screen harm or fireball; crash occurs after visible safe escape. Tutorials remain deferred. More Kling video work requires the user's next authorization; style acceptance is not permission for a batch.
