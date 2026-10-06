# Maya / Fortuna opening — V05

Read `PROJECT_MEMORY.md`, `docs/OPENING_SCREENPLAY_V05.md` and `docs/CINEMATIC_STYLE_GUIDE.md` before further work; update memory after meaningful discoveries.

**Complete and integrated,2026-10-06.** Media/app files are published in `6ab2073`; this release addendum records final verification. All27 pieces are reviewed. User authorized the full regeneration, at most two corrective retakes per segment, careful credits, subtle adventure music/natural flight sounds, and Git upload. He later approved the final three beach jobs together from the same approved reference to save queue time, with transitions checked afterward. Tutorials remain deferred.

| Cut | Duration | MP4 bytes |
|---|---:|---:|
| briefing | 84.02s | 43,758,887 |
| offer15 | 7.02s | 1,089,016 |
| offer20 | 7.02s | 1,083,252 |
| continuation | 120.52s | 51,643,165 |
| preview10 | 204.52s | 75,944,904 |
| preview20 | 218.52s | 78,114,361 |

`preview10.mp4` is the straight acceptance path; `preview20.mp4` includes both counteroffers for linear review. The app plays separate briefing/offers/continuation around its own Yes/No choices. Waiting loop is silent and has matching endpoints. Accepted shares and saved progress remain version3, independent of media version.

Wilhelm is the approved mustached Merchant Corp sergeant; clean Rho Element323213596308599 and concerned emergency Element323217795314817 retain her original synthetic voice. Same fixed-wing, wheeled twin-prop teal/cream/brass aircraft throughout. Seven crew safely escape before the EMPTY aircraft crashes; dawn has flat fallen chute fabric rather than a prebuilt camp. No viewer hands in exterior/beach shots. Current inputs are in `references/`; ARCHIVED assets are excluded.

`shots.json` / exact `*-job.json` prompts / `review/decisions.json` record production and review. Actual charge3,180 credits over32 jobs:26 first passes +6 one-per-segment corrective retakes (g08,n20,c01,c07,c08,c10). No segment exceeded one paid correction. Starting checked Premier balance6,096; the ledger records charges, not a guaranteed current account balance.

Clean cuts, original clips, separate generated audio, VTT/SRT, soft selectable MP4 subtitles, edit decisions and original instrumental WAV/score are retained. Music fades before takeoff, stays off through emergency and first dawn responsiveness check, then returns under leadership guidance. `assemble-prologue-v5.cjs` copies reviewed video streams when they fit79MB headroom and encodes only larger cuts; every final/source/archive MP4 must remain below80,000,000bytes (user hard ceiling100,000,000).

Full-duration frame samples, higher-rate action/seam samples, synthetic-speech transcription and actual browser decoding support review. **This environment cannot hear audio input; transcription confirms words/timing, not human pronunciation/music listening.** Ambiguous ASR is independently cross-checked before paid retakes. Original unreliable transcriptions are preserved; corrected caption timing documents its source.

Local repairs preserve originals in `attempts/`: free closed-mouth waiting animation (`wait-derived.json`); c01 offscreen Wilhelm handoff over Rho with the single accepted thumbs-up (`c01-repair.json`); c03 stray voice replaced with quiet original footsteps/cloth (`c03-repair.json`). No extra Kling charge for these repairs. Final dawn cuts use a motivated wider site-assessment cut then matched neutral framing; optional route-slate/crab props were omitted without paid retakes.

For local playback, `serve-prologue-v5.cjs` is a temporary loopback-only review server on4177; `CINEMATIC_REVIEW_ORIGIN` selects it in playback scripts when the shared Next server is busy. Stop it after review. Application flow checks still run against the actual Next app. Never store API keys, OAuth tokens or upload tickets.

## Verification

232 unit tests/59 files, TypeScript and all5 cinematic app browser tests passed. Complete218.52s browser playback ended successfully with56 caption cues; decoded pixels at six key times passed. Tests cover all accepted shares, saved progress/reload, silent loop, controls/Skip, save retry, matching ending and learning-purpose handoff. `review/release-verification.json` carries scope. Full52-case app run was stopped after unrelated beta-next-step/camp-plan failures; the broader app is not certified green. Human voice/music listening remains a review limit.
