# Treeline garden — deep tutorial lesson + farm plot mini-game

2026-10-06. Ivan: early shore jobs offered too much **WHAT**-autonomy; he wants clear objectives, ~15+ minute depth, **one required** tutorial dive, and a visible world reward that scaffolds later farming/biology work. Target: `SC.3.L.17.2`.

Read `PROJECT_MEMORY.md` before continuing. This doc is the working plan for the Treeline/science farm slice. Promote reviewed pieces into MASTER §4 / §15 / §18 when shipped. Other shore places (dune, creek, camp math) stay available later — **not required** to finish the tutorial spine.

---

## Product rules for this slice

| Rule | Meaning here |
|---|---|
| **WHAT is fixed** | Learner goal: **What plants need to grow** (`SC.3.L.17.2`: plants use **Sun, air, and water** to make their own food). |
| **HOW is flexible** | Order of observing plots, asking Rho, retrying a bad bed, speaking vs tapping. |
| **World reward** | A real **garden patch** appears on the map / camp edge after a successful placement. Camp upgrades over later lessons. |
| **Deterministic mini-game** | Fixed plot layout + pure scoring function. Rho calls `open_garden_plot`; the UI does not invent outcomes. |
| **Revisitable** | Same beds can be replanted / newly understood later (watering systems, edible ID, spacing). Continuous experiment, not one-and-done. |
| **Tutorial spine** | Required after wreck salvage + math starting point: **this Treeline garden lesson only**. Dune / creek / camp jobs unlock as optional explores. |

Do not invent Florida codes. Access points (below) scaffold support; they do not replace the full benchmark for typical Grade 3 evidence.

---

## Standard and access points (CPALMS)

**Benchmark:** `SC.3.L.17.2` — Recognize that plants use energy from the Sun, air, and water to make their own food.

**Access points (support ladder, not separate unlocks):**

| Code | Focus | Use in Primer |
|---|---|---|
| `SC.3.L.17.Pa.2` | Plants need **water** | First scaffold: salt vs fresh; dry ridge fails |
| `SC.3.L.17.Su.2` | Plants need **light** | Second: deep shade vs sun |
| `SC.3.L.17.In.2` | Most plants make their **own food** | Bridge: biscuits/dirt ≠ plant food-making |
| Full benchmark | Sun + air + water | Independent check + garden apply |

**Learner-facing goal (face this, not the code):** **What plants need to grow**  
**One-line WHAT:** Plants make their own food using the Sun, air, and water.

**Big Idea context (Interdependence):** plants and people depend on the environment for basic needs; energy flows from the sun through producers. Story uses that without claiming later ecology standards are mastered in lesson 1.

---

## Story hook (world problem → learning)

**Chapter pressure:** Food will not last. Crew is scattered.

**Treeline problem:** We need to start growing food, but we brought **no garden plants**. Wild green shoots exist. Before we dig beds, we must know **what plants need to grow and make food** — or the “farm” will die and waste the last rations.

Rho does **not** ask “plants or path?” The sitting opens with the fixed goal, then HOW choices.

---

## Sitting shape (~15–20 minutes)

### 1. Hook (2–3 min)

- Restate chapter problem → farming need → no cargo plants.
- Face goal chip: **What plants need to grow**.
- One wonder prompt (optional HOW): “What do you think a shoot needs before we dig?”

### 2. Teach + practice (6–8 min)

Progression: **Observe → Wonder → Predict → Investigate → Explain/Revise → Apply** (science contract).

| Beat | Learner work | Evidence note |
|---|---|---|
| Model | Rho shows one healthy vs one dying shoot with Sun / air / water named | Supported |
| Guided | 3–4 quick cases (dark crate, ocean spray, dry sand, creek sun) | Guided |
| Misconception | Fix “plants eat dirt / biscuits” | Revise |
| Independent | Name the three inputs without the model on screen | Stronger evidence |

Keep practice inside one idea. No pin-hopping.

### 3. Apply — garden plot mini-game (5–7 min)

Tool: `open_garden_plot` → full-screen / overlay **GardenPlotPanel**.

- Six **authored** beds with fixed light / water / air traits (see engine).
- Captain places **2–3 wild seedlings** (first lesson capacity).
- Rho may hint after a bad placement; does not take the test.
- Submit → deterministic outcomes → short explain (“salt water is not the water plants use”).

**Pass for world reward (lesson 1):** at least **two** seedlings in **healthy** beds; **zero** in salt-spray beds. Partial credit can save a “struggling” garden for revisit, but the map visual should look weak until fixed.

### 4. World result (1–2 min)

- Persist garden state on the learner’s camp.
- Treeline / camp edge shows beds (Pixi + atlas).
- Camp grant: e.g. garden founded + tiny ration hope (authored, not invented hunger punishment).
- Rho: “We started a garden because we know what plants need. We can improve it later.”

---

## Deterministic mini-game (engine contract)

**Module:** `lib/play/gardenPlot.ts`  
**Invariants:** same inputs → same `evaluateGarden` result. No LLM scoring.

### Plot layout (tutorial island edge — fixed)

| Plot | Light | Water | Air | Child label |
|---|---|---|---|---|
| `creek-sun` | full_sun | fresh_canal | open | Creek edge in the sun |
| `ocean-spray` | full_sun | salt_spray | open | Beach by the waves |
| `tree-shade` | deep_shade | fresh_canal | open | Under tall trees |
| `tent-morning` | partial_sun | fresh_bucket | open | Beside tent, morning light |
| `dry-ridge` | full_sun | none | open | Dry sand ridge |
| `crate-shadow` | deep_shade | salt_spray | stale | Behind crates at the beach |

### Outcome rules (lesson 1 — photosynthesis needs)

A planted bed is:

- **healthy** if light ∈ {full_sun, partial_sun} AND water ∈ {fresh_canal, fresh_bucket} AND air ≠ stale  
- **struggling** if exactly one of (light ok, water ok) fails, and water is not salt  
- **failed** if water is `salt_spray`, or light is `deep_shade` with no other rescue, or water is `none`, or air is `stale` with deep shade  

(Exact boolean table lives in code + unit tests; this doc must stay aligned when rules change.)

### Actions

- `getTutorialGardenLayout()` → plots + empty plant slots  
- `placeSeedling(state, plotId)` / `clearPlot(state, plotId)`  
- `evaluateGarden(state)` → per-plot status + overall pass/fail + learner-facing reasons  
- `serialize` / `parse` for CampState persistence  

### Rho tool

`open_garden_plot` — opens the authored layout for this learner (loads saved garden if revisiting). Not a free-form generated quiz. Pair with sitting prompts; do not ask the captain to type the tool name.

Optional later tools: `save_garden_placement`, `show_garden_on_map` — only if open/save split helps UX.

---

## Map / Pixi visual

When garden state has ≥1 healthy planting (or any planting for “struggling” look):

- **Treeline landmark** gains small tilled rectangles + green sprouts (healthy = brighter; struggling = wilted; failed = brown).  
- **Atlas** node description updates: “Garden beds started — plants need Sun, air, and water.”  
- Optional future: walkable “garden” sub-pin beside treeline; not required for v1.

Visual is a **projection of saved garden state**, not a second source of truth.

---

## Tutorial gating change

| Step | Required? |
|---|---|
| Cinematic → purpose → walk → talk | Yes (Day 0) |
| Math starting check | Yes (placement) |
| Wreck salvage | Yes (found camp crates) |
| **Treeline garden deep lesson** | **Yes — the one required subject dive** |
| Dune ELA / Creek SS / Camp tens grid | Optional later explores |

Camp needs / Jobs board: highlight Treeline as “Your next deep work”; others labeled “Explore later” until the garden lesson completes (or remain available without blocking progression — product choice to lock in implementation).

---

## Later scaffold (same place, growing camp)

Same garden beds; new lessons upgrade variables and camp look. Not all built now.

| Later lesson (proposal) | Likely focus | World upgrade |
|---|---|---|
| 2 | Fresh vs salt watering systems; move irrigation | Canal ditch visual; healthier beds |
| 3 | Light / shade: prune, move, or choose sun-loving vs shade-tolerant (stay honest to Grade 3 recall vs later life science) | Shade cloth or cleared canopy |
| 4 | Edible vs not (separate standard — do not claim under 17.2 alone) | Labeled crop rows |
| Continuous | Change one variable, predict, observe authored result | Season / growth stages on map |

Each revisit can deepen photosynthesis understanding without restarting the island.

---

## Evidence and mastery

- Guided practice + garden apply → `GUIDED` / activity completion evidence against `SC.3.L.17.2` via existing observation paths.  
- Independent naming of Sun/air/water without scaffolds → stronger tier when available.  
- Finishing the mini-game alone is not silent mastery theater: record what was demonstrated.  
- Access-point wording may guide Rho support copy; do not invent new catalog codes.

---

## Implementation order (build slices)

1. **This doc + deterministic engine + tests** (rules cannot drift).  
2. **Persist garden JSON on camp** + grant when lesson 1 passes.  
3. **`open_garden_plot` tool + SSE + GardenPlotPanel** (place → evaluate → save).  
4. **Pixi / atlas garden visual** from saved state.  
5. **Sitting copy + mission board**: Treeline required; others optional; kill “what can we do here?” for this pin.  
6. **Replace** thin `g3-sci-plants-make-food` quiz as the Treeline driver (keep bank item for other uses or retire from mission slug).  
7. Later revisits / irrigation upgrades.

---

## Open choices for Ivan

1. Should optional dune/creek/camp stay **clickable** during tutorial, or **visible but locked** until the garden lesson finishes?  
2. First-lesson win: **two healthy beds** (proposed) vs one perfect bed + explain?  
3. Persist garden on `CampState.gardenJson` (proposed) vs separate table?  
4. After garden success, is the next required beat still subject-choice for other lenses, or free explore?

---

## Status

- Plan accepted for development: in progress.  
- Engine / tool / map visual: see repo files linked from MASTER §18 when landed.  
- Related backlog: F03 (deep dive not pin sampler), F07 (plain-language goals on all standards), F08 (map investigations).  
- `learnerGoal` on every standard remains a catalog task (not done by this lesson alone).
