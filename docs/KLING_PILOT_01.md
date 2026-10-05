# Kling pilot 01 — Rho on the dawn beach

Date: 2026-10-05. User reports purchasing Premier and authorizes one short video test before further production. No batch or automatic retry authorization. Read `PROJECT_MEMORY.md` before continuing and update meaningful discoveries, accepted assets, task IDs, and actual charges. Never record credentials.

**Rejected after playback:** Ivan found the realistic Rho creepy and her head too small for her body. Reference moved to `public/cinematics/references/ARCHIVED/rho-dawn-v1.png`; do not reuse it or this video as a production reference. Animated static candidates are in `public/cinematics/references/animated-v1/REVIEW.md`; await feedback before further videos or reusable character sheets.

## Reference

Existing `public/stills/tutorial/rho_portrait_neutral.webp` supplies character design, not cinematic visual style. Inspected portrait and beach art: both are pixel art. Generated one realistic translation using the built-in ChatGPT image tool, originally saved as `public/cinematics/references/rho-dawn-v1.png`, now moved to `public/cinematics/references/ARCHIVED/rho-dawn-v1.png`.

Identity: young-adult humanoid AI, side-swept blond hair, amber eyes, thin translucent teal visor, subtle cheek-edge metal, articulated metal neck, brown flight jacket, teal shoulders, cream shirt. Golden dawn, real cloth/metal/sand/water, safe tropical beach, intact salvage crates. The image is a candidate continuity anchor pending the user's review of the pilot; no replacement of game sprites or portraits.

Reference prompt: Translate the existing pixel portrait into one realistic family-adventure film frame, 16:9, medium eye-level waist-up shot. Rho faces the unseen captain beside unmarked salvage crates. Warm dawn, gentle turquoise surf, palms and misty hills, collapsed teal-and-cream parachute in background. Keep the portrait's hair, visor, metal cheek/neck, jacket, and teal shoulder details. No text, gore, weapons, other people, or sailing-ship wreck.

## Proposed single job

Five seconds, 16:9, 1080p, image-to-video, without native audio. Use the reference as the start frame. No dialogue or burned-in captions; this isolates identity/motion/lighting before a dialogue test. Editable audio and caption sources will accompany final story clips. Public VIDEO 3.0 silent baseline would be 40 credits; confirm actual model/account parameters before submitting.

Exact video prompt:

> One continuous five-second realistic family-adventure film shot. Preserve the reference frame's Rho identity exactly: blond side-swept hair, amber eyes, thin translucent teal visor, subtle metallic cheek panels and articulated neck, brown flight jacket with teal shoulders and cream shirt. From the unseen captain's eye level, Rho looks warmly toward the camera, makes one small encouraging nod, gently extends the already open hand toward the intact salvage crates, then holds and waits for the captain's decision. Natural restrained expression, mouth closed; no speaking. A light breeze moves the hair and jacket subtly; small waves roll onto the beach in the background. Nearly locked camera with a very slow subtle push-in. Preserve the golden dawn lighting and beach layout. No scene cuts, extra characters, text, logos, subtitles, added props, injury, violence, or distorted fingers. Keep movements small and physically believable.

Review: recognizable Rho across all frames; believable visor/metal/face/hands; safe and inviting expression; stable clothes, crates, light and geography; no invented letters or sudden camera movements. This quiet test validates continuity, not the later crash action or lip-sync.

## Connection status

Kling native MCP tools still absent in this running chat. Installed official global Kling CLI as an alternate client for the same MCP service. Its separate OAuth login succeeded. Account query confirms Premier and 8,000 available credits before submission. The user-provided API key has not been read, printed, or stored.

## Submitted pilot

- Model `kling-video-v3_0`; five seconds, 1080p, one output, `prefer_multi_shots=false`, `enable_audio=false`. These parameters verified against authenticated `who_am_i` declaration before submission.
- Submitted once, using the saved reference above. Actual charge **40 credits**; subsequent account query confirms **7,960 credits** remaining.
- Generation ID: `AY6KWa25oT50uKd1PeHbuJtill0Rbd00ZLjB2R9FYziUyz3_wVWgLd2wEHYUVYSyNdkQIikg`.
- Status: completed. Saved watermark-free output to `public/cinematics/pilots/rho-dawn-pilot-01.mp4` (12,140,875 bytes). Review sheet: `public/cinematics/pilots/rho-dawn-pilot-01-review.jpg`.
- Verified with ffprobe: H.264, 1916×1080, 24fps, 5.041667s, one video stream and no audio. Slightly short of exact 1920px width; normalization belongs to final editing, not a reason to regenerate.
- Inspected five evenly spaced frames: face, visor, jacket, dawn lighting and beach remain recognizable; gesture stays restrained; no visible gore or caption text. Mouth opens briefly despite the closed-mouth prompt, so footage cannot be assumed lip-sync-ready. Temporal smoothness and final character acceptance need user playback review; frame sampling is limited evidence.
- No retries or additional generation submitted. User review before further production; next useful test after accepted identity would be a short direct-address line with editable audio/caption handling.
