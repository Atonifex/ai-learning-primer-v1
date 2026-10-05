# Prologue V03 production library

Read `PROJECT_MEMORY.md`, `docs/CINEMATIC_STYLE_GUIDE.md` and `docs/PROLOGUE_BRANCHING_SCRIPT_V03.md` before changes. Update project memory after meaningful discoveries; never save credentials.

Generated 2026-10-05 under Ivan's authorization: five new matched ChatGPT reference images, 19 completed Kling v3.0 video jobs, reusable officer/Rho Elements with synthetic voice references, and three stitched 1080p review paths. V1 remains separate history. Exact video prompts/settings/edit order are in `shots.json`; provider task/result records retain job IDs and costs.

## Review and app files

| File | Purpose | Measured length |
|---|---|---|
| `preview10.mp4` | Immediate Yes, clean master | 111.02s |
| `preview15.mp4` | One No, then Yes | 119.02s |
| `preview20.mp4` | Two No replies, then Yes | 127.02s |
| `preview20-captioned.mp4` | Longest path with visible review captions | 127.02s |
| `preview20-softcaptions.mp4` | Longest path with selectable subtitles | 127.02s |
| `briefing.mp4` | Initial mission and 10% offer | 47.02s |
| `offer15.mp4`, `offer20.mp4` | App counteroffer responses | 8.02s each |
| `continuation.mp4` | Shared Yes, handshake, learning walk, launch, approaching storm | 64.02s |
| `waiting-loop.mp4` | Silent forward/reverse idle; matching endpoint pose | 6s |

Choice pauses are not in the review cuts. Onboarding overlays its own bubbles after the spoken offer, then plays the silent loop until an answer. No →15%; No again →20% final, Yes only. Accepted share/progress persists as `STORY_CONTINUITY` memory through `/api/profile/intro`; this is story continuity, not a financial payout engine. Local preview: `/dev/agent` → **Play new intro** (resets only the seeded test captain's intro).

The shuttle and scout ship are one ship. Recorded explanation: “You can build your own base and lead your own crew. Profit is the money left after costs.” Then: “You'll get ten percent of that profit. Sound good?”

## Editable materials

- `sources/`: original provider footage and normalized edit clips. Originals are untouched.
- `audio/`: extracted native source mixes, cached synthetic-dialogue transcripts and voice reference MP3s. These are not isolated dialogue/music/effects stems.
- Branch and review `.en.vtt` / `.en.srt`: captions based on actual word timing. “Rho” spelling corrected; the small generated “Hmm” in N15 is retained.
- `preview20-picture.mp4` and `preview20-audio.wav`: separate picture and final mixed audio.
- `scripts/cinematics/prepare-prologue-v3.cjs`, `kling-prologue-v3.ps1`, `assemble-prologue-v3.ps1`, `caption-prologue-v3.cjs`, `export-prologue-v3.ps1`: reproducible prompt, submission, edit and caption workflow. Submissions skip already recorded jobs; never resubmit just to rebuild an edit.

## Reference library

All five new images were generated with the built-in ChatGPT image tool, using accepted A-style 3D references and previous new views as continuity inputs. Scene constraints: warm brass/teal, same officer and Rho, navy captain cuffs/hands only, same rounded civilian scout ship, no settlement on arrival island.

| Reference | Locked view |
|---|---|
| `references/briefing-anchor.png` | Physical officer/desk, island display, briefing-room doorway; branch anchor |
| `references/rho-handshake.png` | Same room/officer; Rho extends right hand to captain |
| `references/rho-corridor.png` | Rho at viewer-left; arched corridor toward matching docked ship |
| `references/cockpit-docked.png` | First-person hands/wheel, Rho left, blue escape handle left, launch port outside |
| `references/ship-flight.png` | Matching teal/cream/brass exterior above untouched beach/river/plains/forest/ridge |

## Cost and checks

19 completed jobs cost **1,504 Kling credits**, leaving **6,096 Premier credits**, checked at 2026-10-05 13:23 UTC (`account-latest.json`). Five new reference images used ChatGPT image generation. OAuth CLI was used; the separate supplied API key was untouched. No additional purchases or aesthetic retries.

Outputs: H.264 1920×1080, 24fps; spoken edits have stereo AAC. Waiting loop has no audio stream; first/last frames inspected in `waiting-loop-seam.jpg`. Transcription recovered intended spoken content, with number formatting, Rho spelling and the N15 “Hmm” differences documented in `speech-validation.json`. Transcription does not certify pronunciation, acting or lip-sync.

Review limitations: corridor generation also shows the established officer escorting the crew despite the prompt requesting no extra person; Rho's alert expression softens during the last shot. Review full playback before release. No child comprehension study was performed. Actual storm/crash and post-crash leadership footage are not generated here: onboarding currently bridges to a beach still with short text. Tutorial videos remain deferred.

Validation: 94 unit tests and final TypeScript passed. All five intro browser scenarios passed. Live browser walked the entire two-No path through final Yes, common continuation and beach bridge; screenshot `onboarding-choices-review.png`. All seven VTT files have ordered, positive-duration, non-overlapping cues. Sequential whole-suite run: 14/15 passed; the separate Jobs→quiz test fails to show its quiz overlay. Concurrent suite first revealed shared seeded-captain collisions; Playwright now runs one worker to prevent fixture resets racing.
