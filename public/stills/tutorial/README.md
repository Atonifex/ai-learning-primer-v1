# Tutorial stills pack — generate these, then drop the files here

**Owner:** Ivan (product). **Agents:** use these paths. If a file is missing, show the matching `.placeholder.txt` (or a solid-color Pixi sprite) and keep a `TODO(stills)` in the UI.

**Style:** Stardew-like readable top-down world, slightly more animated/modern than pure SNES pixels — **not** a copy of Stardew or Pokémon, **not** graphic-novel watercolor for the map. Dialogue portraits may be a bit more illustrated than overworld sprites.

**Full MVP:** every scene can be generated dynamically (GPT Image). **Tonight / first playable loop:** **only this pack.** Do not call image gen per turn.

| Filename (put in this folder) | What it is | Where it is used |
|-------------------------------|------------|------------------|
| `cinematic_poster.webp` | Crash-landing poster (ship, storm, beach) | Intro screen until `public/cinematics/crash_landing.mp4` exists |
| `crash_aftermath_beach.webp` | Dawn beach, wreckage, fog at edges | Overworld starting camera / first scene |
| `wreck_pile_close.webp` | Salvage pile the player clicks first | Highlight when wreck is the current job |
| `rho_portrait_neutral.webp` | Rho (humanoid AI First Mate), young adult, calm | Dialogue panel, **right side** |
| `rho_portrait_encouraging.webp` | Rho encouraging (ZPD / Duolingo-like support) | Dialogue after a struggle or success |
| `rho_portrait_thinking.webp` | Rho thinking / listening | While `gpt-5.6-luna` is responding |
| `rho_overworld_sprite.webp` | Small top-down follower sprite | Map follower when Rho is “with you” |
| `captain_placeholder_sprite.webp` | Generic young captain, top-down. **Temporary.** | Player avatar until cosmetics unlock |
| `dune.webp` | Dune location | Tutorial map pin |
| `treeline.webp` | Treeline location | Tutorial map pin |
| `creek.webp` | Fresh-water creek | Tutorial map pin |
| `camp_site_empty.webp` | Possible camp ground, not built yet | Tutorial map pin |
| `food_crates.webp` | Salvaged rations / crates | Food emergency beat |
| `torn_guild_orders.webp` | Ship’s log / torn orders (readable prop, not a wall of text) | Reading activity / overlay |
| `map_parchment_unexplored.webp` | Parchment world map with fog of unknown lands (Elden Ring–like “the island is bigger”) | Map overlay UI, not the walk camera |

**Optional later (not blockers):** `engineer_portrait.webp`, `quartermaster_portrait.webp`, `camp_site_founded.webp`.

After you export, replace each `*.placeholder.txt` with the real image using the **exact filename** in the table (`.webp` preferred, `.png` ok).
