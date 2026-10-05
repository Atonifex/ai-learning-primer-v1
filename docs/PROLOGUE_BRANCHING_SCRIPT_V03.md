# Prologue V03 — The deal, the crew, the flight

2026-10-05. Status: generated and integrated into onboarding under Ivan's authorization. Five new reference images and 19 Kling video sources are preserved in `public/cinematics/prologue-v3/`; see its `README.md` and `shots.json` for actual prompts, timings, checks and limitations. Supersedes V02. Read `PROJECT_MEMORY.md` and `docs/CINEMATIC_STYLE_GUIDE.md` before production and update meaningful decisions, verified costs and asset locations. Never retain secrets.

**User wording correction:** Ivan accepts “percent” in spoken dialogue. Use ten/fifteen/twenty percent in the final offers, not coins out of twenty. The earlier coin suggestion in the critique below is retained as editorial history and superseded by this correction. Other dialogue stays simple; timing estimates remain provisional.

## Accepted user direction and open assumptions

Ivan requests simple Grade 3 spoken language; personal benefit for captain (own base, crew, initial10% share); Yes/No bargaining with15% after first No,20% final offer after second No, then Yes only; reusable silent loop behind app-rendered bubbles; same officer introduces Rho, who walks up and shakes the player's hand; first-person corridor walk with Rho on left explaining learning/leadership; first-person takeoff; exterior calm flight with gathering clouds; then worried Rho/weather turn. This direction is generated and integrated; final production resolutions below supersede the original planning checklist.

Confirmed for production:
- Ivan confirms “shuttle” is the same civilian teal-and-brass scout ship/airship that later crashes. Briefing/corridor are at an off-island launch port; new exterior reference fixes the visual direction.
- Ivan accepts gross-profit wording explained simply; recorded captain share uses mission money left after costs. This is fictional story continuity, not a company-wide payout engine.

The base and crew reward is a story promise, not verified app/economy functionality. It does not imply infrastructure already exists on the island. No newly named worlds, officer, crew members or discoveries introduced. Spoken “company” replaces the harder formal name Merchant Corporation without renaming that entity. Technical crew title “first mate” and requested school subject names are retained; other spoken words and short sentences target Grade 3 comprehension. This is editorial judgment, not a verified grade placement of every word.

## Draft 1 before critique

### Dialogue and story

- Officer greets the captain: “Captain, we have a job for you and your crew.”
- Narrator over briefing cargo display: “Trade moves things from world to world. It helps us build homes, send food, and travel.”
- Officer shows the island: “No one lives on this island. It may have oil, gold, and silver. Your job is to find them. Our company can get them, sell them, and make money.”
- Offer: “You can build your own base and lead your own crew. You'll get ten percent of our profits. Sound good?”
- After first No, disappointed officer: “Not enough? All right. Fifteen percent. Sound good?”
- After second No, comically exasperated officer: “Again? Fine! Twenty percent. That's my last offer.”
- After any Yes: “We have a deal!” Player gives thumbs-up.
- Officer: “Let me show you your crew. First, meet Rho, your first mate.” Rho enters, shakes the player's hand and says, “Hi, Captain. I'm glad we're a team.”
- Walking to the ship, Rho on left: “This mission will need lots of learning. We'll use science, math, English, and social studies. We don't know what's on the island. That's why we need you to lead us.”
- First-person takeoff, Rho: “Ready, Captain? Let's fly.”
- Exterior ship flies smoothly; distant cloud bank gathers.
- First-person cockpit, Rho grows concerned: “Captain… look ahead.”

### Draft 1 prompt plan

Use approved 3D officer/Rho references. First-person off-island briefing room with resource display; insert off-island trade imagery; locked officer shot for all offers; silent idle loop without bubbles/text; branching disappointed/exasperated responses return to idle pose; common acceptance/crew intro; first-person handshake; corridor walk with Rho left; same ship's first-person takeoff and exterior flight; worried Rho at cockpit rail as weather builds. No player face/body, no buildings on surveyed island, no baked captions. Preserve separate audio/text. Durations flexible, approximately100–115s of viewing before user waits.

## One critique round: three simulated lenses

| Lens | Specific problem in draft 1 | Final change |
|---|---|---|
| Screenwriter | The benefit is finally personal, but “profits/percent” can hide what the captain gains. “Find them” sounds certain after “may.” Rho's learning line is another abstract fact list. | Use two/three/four coins out of twenty, with costs explained simply. Ask what is there, not promise deposits. Give Rho practical learning actions and connect unknown island → learning → leadership. |
| Director | A monitor-only officer cannot naturally introduce someone in the same physical space. Multi-character handshake and independently invented exterior could break continuity. Waiting footage with speech or camera drift will feel wrong when repeated. | Place the same officer physically in one off-island briefing room. Anchor all offer clips and idle loop to one frame. Create matched handshake/corridor/ship references before video. Use a silent closed-mouth loop with a fixed camera and matched first/last pose. |
| Producer/editor | Equal-duration cuts must not return. A mandatory Yes at the end means No is bargaining, not a true opt-out. Independent voice generation and long corridor speech risk seams and rushed delivery. | Explicit branching graph with local/global times, common acceptance, comic rather than personal disapproval; actual speech rehearsal before timing. Continuous sound, same voices, logical sub-beats if model duration limits require segmentation. Clean masters and editable captions. |

User's required Yes/No labels and final Yes-only stage are preserved. Recommendation: app framing should make clear this is making a deal; do not present the branch as a genuine option to refuse the story. No new labels, buttons, numbers, contract graphics or app UI are generated inside video.

## Final production foundation — prepend to every visual prompt

> Polished stylized 3D family-adventure animation matching the supplied active Primer references. Soft sculpted forms, expressive eyes, balanced slightly larger heads and modest shoulders; tactile cloth, brass and wood; teal/brass/navy/brown palette; warm cinematic light. Preserve exact referenced faces, hairstyles, costumes, props, geography and ship design across clips. 16:9, target1080p, continuous natural acting, no rushed speech. Player POV shows only gloved hands and short navy cuffs; no visible player head, face, back, torso or rear-view substitute. School-appropriate excitement; no blood, injury, horror, guns or fireball. No embedded captions, logos, lettering, numbers, buttons, speech bubbles or generated UI. Add all subtitles/UI later. Keep camera/action endpoints consistent with the shot notes. Do not redesign the character to match a new mood. Dialogue, when specified, is spoken exactly once by the stated person; no ad-libbing, extra voices or music in the generated mix. Silence for the waiting loop; ambient sound and score are separate editing layers.

### Character and set locks

- **Officer:** derive identity from `public/cinematics/references/3d-v1/p01-briefing.png`: young-adult woman, medium-brown skin, dark curly hair tied back, practical teal uniform, cream collar, small brass emblem. Same person physically present in the briefing room, not a new officer. Friendly/professionally serious, then disappointed, then theatrically exasperated at bargaining, never cruel or threatening. Same voice for every branch and introduction.
- **Rho:** derive identity/costume from `s01-rho-introduction.png` and stress expression from `s02-storm-bridge.png`: short side-swept blond hair, amber eyes, thin transparent teal visor, restrained cheek/neck metal, brown jacket with teal shoulders, cream shirt. Young-adult humanoid AI First Mate. Same voice, helpful rather than heroic. Same head/body proportions; mood changes through eyebrows, eyes, mouth and posture.
- **Captain:** viewer identity stays open. Same glove/navy cuff design in briefing, thumbs-up, handshake and cockpit. Right hand shakes Rho's right hand; do not swap mid-shot. User's Yes/No clicks are app actions, not spoken player dialogue.
- **Briefing set:** off-island launch-port room, warm brass wall ribs, teal desk, simple blank map display, doorway behind officer at frame right. Officer centered at eye level; leave lower frame uncluttered for app bubbles and captions. Normal port architecture is allowed here.
- **Path:** same room → doorway → single port corridor → docked scout ship cockpit. Rho stays viewer-left during walk and cockpit scenes. She enters from the room's frame-right doorway, greets center-front, then steps to viewer-left to guide the walk. No teleporting or unexplained second ship.
- **Ship:** proposed same scout airship/shuttle all the way to crash: rounded teal hull, restrained brass trim, arched cockpit window ribs, wood/brass wheel, warm gauges. Blue escape handle stays on viewer-left wall. Exterior shell/silhouette and boarding-door placement need a new approved reference; no final design claimed yet.
- **Island:** offshore target, no people/buildings/roads/lights/ruins at arrival. Beach, broad flat river plain, rolling hills/forest and inland mountain ridge. Use same river/coast/ridge arrangement in resource display, flight and storm. Opening map depicts location, not proven deposits. Base is future construction.
- **Trade inserts:** populated locations are other off-island ports. Oil safely sealed; gold/silver are ore-bearing rock illustrations, not proof of this island's deposits. No lithium/fusion spoilers.

## Final script and per-asset prompts

Paper-edit shortest path: **111s (1:51)** before crash. One rejected offer adds8s; two add16s: **119s/127s**, excluding three-second-loop repetitions and time choosing. Waiting is not a countdown. Timings allow more breathing room for the welcome, trade and mission sentences; they are targets pending full read-through, not provider duration settings or fixed subtitle timings. Final speech delivery/gesture holds take priority over the targets.

Each asset below uses the production foundation and relevant character/set locks above. Lines are exact proposed dialogue. Local zero-based times are for branch assets; main timeline below assumes the captain accepts10% immediately.

### A01 — Welcome — 00:00–00:05 (5s)

**Officer:** “Captain, we have a job for you and your crew.”

**Prompt:** First-person medium shot in locked briefing room. Same officer centered behind teal desk, warm focused eye contact, restrained welcoming smile. Player hands rest at bottom of frame. No thumbs-up yet. She gestures toward the blank briefing display as the sentence ends; maintain room light and camera axis. Start the continuous quiet port ambience in the edit, not as a new mix in each clip.

### A02 — Trade has a purpose — 00:05–00:14 (9s)

**Narrator, off-screen:** “Trade moves things from world to world. It helps us build homes, send food, and travel.”

**Prompt:** Motivated close-in transition from the officer's briefing display to illustrative off-island trade footage. Follow one plain teal cargo crate on a trolley, beside safely sealed supplies, into a populated port loading bay. Home construction is visible in the background, food crates being loaded nearby, civilian transport beyond. One connected movement, not three unrelated resets. No on-screen speaking person; generate clean silent picture so the single narrator performance can span the cut. Return through the same display to briefing, retaining sound bed. No text or numbers on crate.

### A03 — The island job — 00:14–00:30 (16s)

**Officer:** “No one lives on this island. It may have oil, or rocks with gold and silver. Find what's there. Our company can get these things, sell them, and make money.”

**Prompt:** Same officer/room/axis. Simple island shape on a text-free briefing display, sealed oil illustration and two ore-bearing samples. Officer points to island then addresses viewer, professional and clear. The samples describe possible targets; don't show completed extraction or discovered treasure. No base/buildings on island. If duration limits require two sources, split after “silver” and carry the same officer voice/ambience across a matched map insert; this is one dramatic beat, not two new scenes.

### A04 — What the captain gets — 00:30–00:47 (17s)

**Officer (recorded A04a, 10s):** “You can build your own base and lead your own crew. Profit is the money left after costs.”

**Officer (recorded A04b, 7s):** “You'll get ten percent of that profit. Sound good?”

**Prompt:** Same locked officer medium shot, sincere smile as she describes captain's future, small open-palm gesture for the deal. This is10% of mission profit under the proposed accounting meaning. No generated percentage/coin numerals, no imagined base cutaway on island, no thumbs-up. After the question, return hands to desk and mouth closed; gaze steady, shoulders relaxed. End exactly in neutral waiting anchor W. Spoken line may use two matched takes if model limits require; no mechanical five-second resets.

### W — Reusable waiting loop — local00:00–00:03 (3s), indefinite at decision points

**Dialogue:** None. No repeating chuckle, music, audible breath or other looped speech.

**Prompt:** Same locked medium camera, officer and room as A04 ending, neutral professionally friendly closed-mouth expression, hands resting on teal desk. Subtle breathing completes one full cycle; exact same head, eye direction, facial expression, shoulder, hand and clothing position at beginning and end. First and final images match anchor W; no blink across the seam, no moving background, no light shift, no camera drift. Officer patiently waits; no gesture toward imaginary UI. Lower frame clear. Silent seamless idle loop; no captions, bubbles, numbers or buttons.

Reuse this one loop after A04, N15 and N20. All three dialogue assets must end at W; all branch responses start at W. Endpoint match is a requested output property, not a guarantee: inspect first/last frames and replay the loop before acceptance. If visible seams persist, use a clean hold/crossfade in editing or revise the loop source before reuse. App speech/ambience must not restart on each loop.

### N15 — First No: better offer — local00:00–00:08 (8s)

**Officer:** “Oh! You want more. All right. Fifteen percent. Sound good?”

**Prompt:** Start at W. Same officer briefly loses her smile, eyebrows lift, gives one small disappointed sigh without spoken additions. Regains professional composure and offers15% with an open-palm gesture. Her frustration is with the bargaining, not an attack on the child. Same face, costume, voice, room, lens and light. End at W, mouth closed. No generated Yes/No bubbles or coin/percentage graphics.

### N20 — Second No: last offer — local00:00–00:08 (8s)

**Officer:** “Again? Oh, all right! Twenty percent. That's my last offer.”

**Prompt:** Start at W. Same officer, larger comic reaction: raised brows, brief upward glance, shoulder slump, palms up, one theatrical exhale. Exasperated but safe and respectful; no yelling, insult, blame or threat. Straightens, speaks final20% offer firmly and clearly, then returns hands/mouth/pose to W. No extra dialogue or generated UI. Only Yes is presented by app after this asset, as requested.

### Y — Common Yes response — 00:47–00:50 (3s on shortest path)

**Officer:** “We have a deal!”

**Prompt:** Start at W, same composition. Officer brightens and gives a pleased approving nod. Player right hand rises into clear thumbs-up, then lowers. Do not say a percentage; this response must work for10%,15% or20%. Allow the celebratory gesture to finish; no overjoyed caricature or early handshake. Same gloves/cuffs as later shots.

### A05 — Meet the first mate — 00:50–00:57 (7s)

**Officer:** “Let me show you your crew. First, meet Rho, your first mate.”

**Prompt:** Same room and officer after Y; she turns slightly toward frame-right doorway and gestures welcomingly. Same Rho enters through that doorway with a warm smile, walks toward viewer. Other crew remain off-camera; no new cast designs. Officer stays physically present; no communicator-screen version. Keep the doorway, light and camera axis constant. Rho reaches greeting distance at end; don't shake hands yet.

### A06 — Handshake — 00:57–01:02 (5s)

**Rho:** “Hi, Captain. I'm glad we're a team.”

**Prompt:** First-person, same room at A05 endpoint. Rho at center-front meets viewer's eyes, extends her right hand. Captain's right gloved hand with navy cuff enters bottom-right; one gentle complete handshake with anatomically natural fingers and stable contact, then both release. Rho turns toward the exit and moves to viewer-left. Officer remains softly visible behind her. No viewer face/body or rear shot. No extra fingers, hands passing through one another, sleeve changes or Rho redesign. Preserve room/corridor doorway continuity.

### A07 — Walk and learn — 01:02–01:26 (24s)

**Rho:** “This is a learning game. We'll use science, math, English, and social studies. Ask questions. Try things. Learn from what goes wrong. We don't know what's on the island. That's why we need you to lead us.”

**Prompt:** First-person walking from briefing-room exit down the single launch-port corridor toward the docked scout ship. Rho walks beside viewer on the LEFT, keeping pace, naturally looking toward captain while speaking; mild controlled walking motion, no dizzy head bob or backwards walking. Same Rho face/visor/costume. Keep her visible at left while destination remains readable forward. Warm light/brass ribs/teal rail provide repeatable spatial anchors. Her mood shifts from friendly encouragement to thoughtful curiosity at unknown island, then confidence in the captain. Do not put scary unknown monsters on island or hide destination behind subject graphics. No visible player body, no subtitles/UI baked in.

**Planned continuous sub-beats if source limits require segmentation:**
- A07a,01:02–01:10: “This is a learning game. We'll use science, math, English, and social studies.” Exit room; Rho left.
- A07b,01:10–01:17: “Ask questions. Try things. Learn from what goes wrong.” Pass the same teal rail, ship cockpit visible ahead.
- A07c,01:17–01:26: “We don't know what's on the island. That's why we need you to lead us.” Approach the same ship boarding door; Rho glances ahead, then back to captain.

Carry one voice/ambience performance through seams. Use exact endpoint/start references for Rho/camera/corridor, not three independently reinvented corridors. Don't force every source to the target sub-beat length if the actual performance needs adjustment. Formal school-subject names are the requested terms; the learning message does not claim actual tests/gates are already implemented. Fuller practice/test explanation remains in `docs/LEARNING_PURPOSE_AND_PROGRESSION.md`.

### A08 — Board the same ship — 01:26–01:30 (4s)

**Dialogue:** None.

**Prompt:** First-person continuity shot through established boarding doorway into the same scout ship cockpit. Rho goes just ahead then settles at viewer-left rail; camera enters captain's seat position facing the window, gloved hands come to the same wheel. Same arched brass ribs, warm gauges and left blue escape handle as active bridge references. Port exterior remains outside window, no sudden island arrival. Short purposeful movement, no montage, no second ship. Space/layout must match approved boarding/cockpit reference.

### A09 — First-person takeoff — 01:30–01:38 (8s)

**Rho:** “Ready, Captain? Let's fly.”

**Prompt:** First-person hands at wheel, Rho viewer-left. Smooth civilian scout airship launch from established off-island dock. Captain steadies wheel and ship rises forward; dock sinks below the cockpit view, blue sky and sea open ahead. Same hull/window/rail geometry and gloves, warm gauges, left escape handle. Rho excited but composed. No external shot within this asset, no random console interaction, no violent shaking. Ship already powered; no unexplained ignition controls or changing wheel.

### A10 — Smooth flight, trouble ahead — 01:38–01:45 (7s)

**Dialogue:** None.

**Prompt:** Deliberate exterior cut: same approved teal/brass scout airship, exact hull silhouette/windows/door placement from approved exterior reference. Smooth flight over sea toward island; warm light on hull, cloud bank darkens in distance along the island's inland ridge. Gentle following camera, no acrobatics, rockets, warship, teleporting, extra wings or changing propulsion. Island uses same beach/river plain/forest/ridge, no settlements. Ominous weather is ahead, not already engulfing ship. Carry cockpit engine/wind sound across the cut in editing, not a fresh disconnected ambience.

### A11 — The turn — 01:45–01:51 (6s)

**Rho, quieter and concerned:** “Captain… look ahead.”

**Prompt:** Cut back to established first-person cockpit with hands on same wheel, Rho at viewer-left rail, blue escape handle still left. Island/coast/ridge/cloud bank align with exterior approach. A gust rattles a chart edge; Rho sees dark weather ahead, smile falls, brows draw together, eyes widen slightly, mouth tenses. She braces at rail, looks toward windshield, then alerts captain. No cheerful grin, panic scream, lightning flash sequence or crash yet. Last view and wind lead directly into the later storm/crash scene from the same direction of flight. Don't move escape handle or introduce island buildings.

## Branch contract — implemented in onboarding

```text
A01 → A02 → A03 → A04 → W [app: Yes / No, offer10]
  Yes → save accepted share10 → Y
  No  → N15 → W [app: Yes / No, offer15]
          Yes → save accepted share15 → Y
          No  → N20 → W [app: Yes only, offer20]
                  Yes → save accepted share20 → Y
Y → A05 → A06 → A07 → A08 → A09 → A10 → A11 → later crash
```

The app owns bubbles, accessible labels, branch selection, persisted accepted share and resumable progress (`IntroCinematic`, `introDeal`, `/api/profile/intro`). Choices appear after spoken responses; W loops silently. Final Yes-only is intentional requested behavior. Common Y has no numeric line so paths merge cleanly. Accepted share is story memory, not an implemented payout system.

## Original production checklist — historical planning

- Keep existing V1 and ARCHIVED/history assets intact; no overwritten masters. V03 lives in its own future asset folder when authorized. Some V1 off-island inserts may be reusable; V1 communicator-only officer picture cannot automatically become the in-person room shot.
- Before paid video, make/approve matched stills: officer in physical briefing room and waiting anchor; Rho handshake start/contact/end; corridor entry/middle/boarding door; cockpit docked/takeoff; same ship exterior; calm-to-storm approach with stable island layout. Dedicated character views/expression references should derive from existing active identities. No new stills generated in this pass.
- Each Kling submission needs foundation + character/set locks + its shot prompt + exact dialogue and relevant attached references. File names written in a prompt do not attach an image by themselves. Verify live provider duration, multi-reference/end-frame, voice and audio options before mapping editorial shots to supported jobs; do not claim this document is a tested API payload.
- All “company” wording is intentionally simpler; do not restore “extract,” “profits,” “uninhabited,” “exposition,” “metacognition” or “Corporation” to spoken lines. Ivan explicitly accepts “percent”: use ten/fifteen/twenty percent instead of the superseded coin explanation. Canonical formal entity remains Merchant Corporation in project documentation. Any displayed percentages are added by the app; do not generate them in picture.
- Rehearse full shortest and longest paths before timing lock. Listen for Rho ("row"), subject names, ten/fifteen/twenty and “percent.” Record/cast consistent officer/narrator/Rho voices. Review pronunciation, pacing, vocal identity and visible lip-sync by listening/playback; transcription alone insufficient.
- No automatic expectation of isolated stems from native audio. Prefer approved separately recorded narration for A02 and a continuous corridor voice; visible speech requires compatible lip-sync workflow. Keep clean picture, actual separate dialogue/music/effects where possible, source mixed audio where native, editable timeline and VTT/SRT. Never call an extracted mix an isolated dialogue stem.
- Captions follow accepted audio, not paper timestamps. Local caption files for each branch plus common sequence allow synchronization after pauses; no single fixed-time SRT should include mutually exclusive branches. Waiting W has no dialogue captions; meaningful audio cues can be app/edit tracks. Bubbles and captions need separate reserved space in later UI.
- Inspect motion/identity/handshake, island/ship continuity and first/last loop frames; preview W several times after each offer and both No paths. Check shortest path111s, one-No119s, two-No127s only after measured assembly. These are estimates, not tested durations or a credit quote.
- No paid generation authorized or made by this writing request. Provider account/pricing not queried this turn. Current remaining balance is not freshly verified; prior production recorded7,600 credits.

## Production resolutions and remaining review

1. Ivan confirmed the shuttle is the same ship. Briefing/corridor remain at an off-island launch port.
2. Ivan accepted gross profits with a simple explanation; recorded mission-share definition is “Profit is the money left after costs,” followed by ten/fifteen/twenty percent. No accounting system is implied.
3. Requested comic bargaining and required final Yes are implemented; Skip remains available.
4. Five matched references and reusable officer/Rho Elements with synthetic voice references were created; 19 jobs completed for 1,504 credits. Remaining checked balance: 6,096.
5. Measured cuts: 111.02/119.02/127.02s plus untimed app choice pauses. Editable branch captions and clean/source mixes are retained. Pronunciation, acting and lip-sync still need human playback review; transcript matching alone is insufficient. Generated corridor includes the established officer escorting the crew, and the alert expression softens late in A11.
6. Actual crash and leadership-objective footage remain future production. Onboarding currently uses a beach still/text bridge after the storm approach; tutorial videos remain deferred.
