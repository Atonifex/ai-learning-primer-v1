# Learning clip evaluation

2026-10-05. This is our rubric for which YouTube clip Rho may offer. It is not a closed list of six channels. Child-data rules in `docs/Future_Development_ideas.md` P0 still apply: clips stay off for a real child until a parent consents.

## What search is allowed to see

One YouTube Data API search for the topic. `safeSearch=strict`, embeddable videos only, English relevance, up to 10 results. The search is not limited to a channel id. ChatGPT, Gemini, and Exa do not choose the video.

## Hard fails

A video is dropped before the ranker if any of these are true:

- The id is not a normal YouTube video id, or it is on `CLIP_DENY_VIDEO_IDS`.
- It is not embeddable, or it is a livestream or premiere.
- It is under 90 seconds, over 8 minutes for grades 3–4, or over 12 minutes for grades 5–8.
- The title or description matches the blocklist (prank, challenge, smash, reaction, game titles, “top 10”, “you won’t believe”).

An unknown channel is not a hard fail.

## Known sources

`CLIP_CHANNELS` in `lib/play/learningClip.ts` is a catalog of educational channels, checked by channel id on 2026-10-05. It includes the original kids channels plus TED-Ed, Crash Course, SciShow, Kurzgesagt, Amoeba Sisters, Homeschool Pop, FreeSchool, National Geographic, Veritasium, 3Blue1Brown, SmarterEveryDay, Numberphile, Art of Problem Solving, and Mashup Math.

A known source is a plus. The ranker is told the channel is known and which grades it is aimed at. When two videos fit the goal equally, prefer the known source. Add a channel by appending that catalog. Do not treat a missing channel as a reason to hide every other good video during development.

## Topical decision

A text ranker sees only the grade, the learning goal, and each candidate’s title, channel, known-source flag, and description. It must return one id from that list, or `NONE`. It may not claim anything the description does not support. `NONE` means Rho teaches without a clip. Watching the video (for example with Gemini) is a later check, not this step.

The two questions the child holds are about the mission. They are not a quiz of unseen video details.

## What stays controlled

- One clip on screen. No search box. No second video.
- The player is privacy-enhanced, and our “I’ve seen enough” control removes it.
- The feature flag and YouTube key are both required. That is not parent consent.
- Do not send the child’s name or voice to YouTube.
- Do not record a standard only because they watched.
