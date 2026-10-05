import type { SubjectDomain } from "../constants/subjects";

/**
 * Known educational sources. Channel IDs checked 2026-10-05.
 * A match is a plus for the ranker. During development it is not required:
 * an unknown channel can still be offered when the rubric passes.
 * See docs/LEARNING_CLIP_EVALUATION.md.
 */
export type ClipChannel = {
  channelId: string;
  name: string;
  subjects: SubjectDomain[];
  minGrade: number;
  maxGrade: number;
};

export const CLIP_CHANNELS: ClipChannel[] = [
  {
    channelId: "UCBuMwlP7kHkNxdPAqtFSJTw",
    name: "Math Antics",
    subjects: ["math"],
    minGrade: 3,
    maxGrade: 8,
  },
  {
    channelId: "UCRFIPG2u1DxKLNuE3y2SjHA",
    name: "SciShow Kids",
    subjects: ["science"],
    minGrade: 3,
    maxGrade: 5,
  },
  {
    channelId: "UCONtPx56PSebXJOxbFv-2jQ",
    name: "Crash Course Kids",
    subjects: ["science", "social_studies"],
    minGrade: 3,
    maxGrade: 6,
  },
  {
    channelId: "UCXVCgDuD_QCkI7gTKU7-tpg",
    name: "Nat Geo Kids",
    subjects: ["science", "social_studies"],
    minGrade: 3,
    maxGrade: 6,
  },
  {
    channelId: "UC4a-Gbdw7vOaccHmFo40b9g",
    name: "Khan Academy",
    subjects: ["math", "ela", "science", "social_studies"],
    minGrade: 3,
    maxGrade: 8,
  },
  {
    channelId: "UC2ri4rEb8abnNwXvTjg5ARw",
    name: "Khan Academy Kids",
    subjects: ["math", "ela"],
    minGrade: 3,
    maxGrade: 3,
  },
  {
    channelId: "UCsooa4yRKGN_zEE8iknghZA",
    name: "TED-Ed",
    subjects: ["math", "ela", "science", "social_studies"],
    minGrade: 3,
    maxGrade: 8,
  },
  {
    channelId: "UCX6b17PVsYBQ0ip5gyeme-Q",
    name: "Crash Course",
    subjects: ["math", "ela", "science", "social_studies"],
    minGrade: 4,
    maxGrade: 8,
  },
  {
    channelId: "UCZYTClx2T1of7BRZ86-8fow",
    name: "SciShow",
    subjects: ["science"],
    minGrade: 4,
    maxGrade: 8,
  },
  {
    channelId: "UCsXVk37bltHxD1rDPwtNM8Q",
    name: "Kurzgesagt",
    subjects: ["science", "social_studies"],
    minGrade: 5,
    maxGrade: 8,
  },
  {
    channelId: "UCb2GCoLSBXjmI_Qj1vk-44g",
    name: "Amoeba Sisters",
    subjects: ["science"],
    minGrade: 6,
    maxGrade: 8,
  },
  {
    channelId: "UCfPyVJEBD7Di1YYjTdS2v8g",
    name: "Homeschool Pop",
    subjects: ["math", "ela", "science", "social_studies"],
    minGrade: 3,
    maxGrade: 6,
  },
  {
    channelId: "UCebMFnw6WxozGmqGekJHOJg",
    name: "FreeSchool",
    subjects: ["math", "ela", "science", "social_studies"],
    minGrade: 3,
    maxGrade: 6,
  },
  {
    channelId: "UCpVm7bg6pXKo1Pr6k5kxG9A",
    name: "National Geographic",
    subjects: ["science", "social_studies"],
    minGrade: 3,
    maxGrade: 8,
  },
  {
    channelId: "UCHnyfMqiRRG1u-2MsSQLbXA",
    name: "Veritasium",
    subjects: ["science", "math"],
    minGrade: 5,
    maxGrade: 8,
  },
  {
    channelId: "UCYO_jab_esuFRV4b17AJtAw",
    name: "3Blue1Brown",
    subjects: ["math"],
    minGrade: 6,
    maxGrade: 8,
  },
  {
    channelId: "UC6107grRI4m0o2-emgoDnAA",
    name: "SmarterEveryDay",
    subjects: ["science"],
    minGrade: 4,
    maxGrade: 8,
  },
  {
    channelId: "UCoxcjq-8xIDTYp3uz647V5A",
    name: "Numberphile",
    subjects: ["math"],
    minGrade: 5,
    maxGrade: 8,
  },
  {
    channelId: "UCHZwMwa96o5gwBmVaIj_zVA",
    name: "Art of Problem Solving",
    subjects: ["math"],
    minGrade: 5,
    maxGrade: 8,
  },
  {
    channelId: "UCtBtcQJ8_jsrjPzb8i1tOsA",
    name: "Mashup Math",
    subjects: ["math"],
    minGrade: 3,
    maxGrade: 8,
  },
];

/** Veto a video id without waiting on the ranker. Checked on cache hits too. */
export const CLIP_DENY_VIDEO_IDS = new Set<string>();

export const MIN_CLIP_SECONDS = 90;

const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

const BLOCKED_TEXT =
  /\b(prank|challenge|smash|reaction|fortnite|roblox|minecraft|among us|you won't believe|top 10|top ten)\b/i;

export type LearningClipOffer = {
  videoId: string;
  title: string;
  channelId: string;
  channelTitle: string;
  questions: string[];
  missionPrompt: string;
};

export type ClipCandidate = {
  videoId: string;
  channelId: string;
  channelTitle: string;
  title: string;
  description: string;
  durationSeconds: number;
  liveBroadcastContent: string;
  embeddable: boolean;
};

/** Playtest / e2e fixture. Opens the panel without a YouTube search. */
export const LEARNING_CLIP_FIXTURE: LearningClipOffer = {
  videoId: "jgWqSjgMAtw",
  title: "Fraction basics",
  channelId: "UC4a-Gbdw7vOaccHmFo40b9g",
  channelTitle: "Khan Academy",
  missionPrompt: "How could equal pieces help us share the camp rations?",
  questions: [
    "What is a fraction a count of?",
    "How could equal pieces help us share the camp rations?",
  ],
};

export function learningClipsEnabled(
  env: Record<string, string | undefined> = process.env
): boolean {
  return env.PRIMER_LEARNING_CLIPS === "1" && Boolean(env.YOUTUBE_API_KEY?.trim());
}

export function subjectDomainFromSlug(slug: string): SubjectDomain | null {
  if (slug.startsWith("math")) return "math";
  if (slug.startsWith("ela")) return "ela";
  if (slug.startsWith("science")) return "science";
  if (slug.startsWith("social_studies")) return "social_studies";
  return null;
}

export function gradeNumber(gradeBand: string): number {
  const grade = Number.parseInt(gradeBand, 10);
  return Number.isFinite(grade) ? grade : 3;
}

export function maxClipSeconds(gradeBand: string): number {
  return gradeNumber(gradeBand) <= 4 ? 8 * 60 : 12 * 60;
}

/** Known sources that fit this subject and grade. Not a cap on search. */
export function channelsFor(subjectSlug: string, gradeBand: string): ClipChannel[] {
  const domain = subjectDomainFromSlug(subjectSlug);
  if (!domain) return [];
  const grade = gradeNumber(gradeBand);
  return CLIP_CHANNELS.filter(
    (channel) =>
      channel.subjects.includes(domain) &&
      grade >= channel.minGrade &&
      grade <= channel.maxGrade
  );
}

export function knownSourceFor(channelId: string): ClipChannel | null {
  return CLIP_CHANNELS.find((channel) => channel.channelId === channelId) ?? null;
}

export function parseIsoDurationSeconds(iso: string): number {
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso.trim());
  if (!match) return 0;
  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  const seconds = Number(match[3] ?? 0);
  return hours * 3600 + minutes * 60 + seconds;
}

export function isBlockedClipText(title: string, description: string): boolean {
  return BLOCKED_TEXT.test(`${title}\n${description}`);
}

export function isAllowedVideoId(videoId: string): boolean {
  return VIDEO_ID.test(videoId);
}

/**
 * Hard fails only: identity, deny list, embeddable, not live, duration, blocked text.
 * An unknown channel is not a fail. The ranker decides topical fit.
 */
export function clipGateReason(
  candidate: ClipCandidate,
  opts: {
    gradeBand: string;
    denyIds?: Set<string>;
  }
): string | null {
  const deny = opts.denyIds ?? CLIP_DENY_VIDEO_IDS;
  if (!isAllowedVideoId(candidate.videoId)) return "bad_id";
  if (deny.has(candidate.videoId)) return "denied";
  if (!candidate.embeddable) return "not_embeddable";
  if (candidate.liveBroadcastContent !== "none") return "live";
  if (candidate.durationSeconds < MIN_CLIP_SECONDS) return "too_short";
  if (candidate.durationSeconds > maxClipSeconds(opts.gradeBand)) return "too_long";
  if (isBlockedClipText(candidate.title, candidate.description)) return "blocked_text";
  return null;
}

export function gateCandidates(
  candidates: ClipCandidate[],
  opts: {
    gradeBand: string;
    denyIds?: Set<string>;
  }
): ClipCandidate[] {
  return candidates.filter((candidate) => clipGateReason(candidate, opts) === null);
}

export function parseRankerVerdict(text: string): {
  videoId: string | null;
  questions: string[];
} {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return { videoId: null, questions: [] };
  try {
    const parsed = JSON.parse(match[0]) as { videoId?: unknown; questions?: unknown };
    const questions = Array.isArray(parsed.questions)
      ? parsed.questions
          .filter((q): q is string => typeof q === "string" && q.trim().length > 0)
          .map((q) => q.trim().slice(0, 180))
          .slice(0, 2)
      : [];
    const raw = typeof parsed.videoId === "string" ? parsed.videoId.trim() : "";
    if (!raw || raw.toUpperCase() === "NONE") return { videoId: null, questions };
    return { videoId: raw, questions };
  } catch {
    return { videoId: null, questions: [] };
  }
}

export function fallbackWatchQuestions(goal: string): string[] {
  const focus = goal.replace(/\s+/g, " ").trim().slice(0, 140) || "the mission";
  return [
    `What in the clip helps with this: ${focus}?`,
    "What will you try when you come back to the mission?",
  ];
}

export function offerFromVerdict(
  candidates: ClipCandidate[],
  verdict: { videoId: string | null; questions?: string[] },
  goal: string
): LearningClipOffer | null {
  if (!verdict.videoId) return null;
  const chosen = candidates.find((candidate) => candidate.videoId === verdict.videoId);
  if (!chosen) return null;
  const questions =
    verdict.questions && verdict.questions.length > 0
      ? verdict.questions.slice(0, 2)
      : fallbackWatchQuestions(goal);
  return {
    videoId: chosen.videoId,
    title: chosen.title,
    channelId: chosen.channelId,
    channelTitle: chosen.channelTitle,
    questions,
    missionPrompt: goal.replace(/\s+/g, " ").trim().slice(0, 180) || "the mission",
  };
}

export function clipCacheKey(input: {
  gradeBand: string;
  subjectSlug: string;
  learningGoal: string;
  topicQuery: string;
}): string {
  const norm = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  return [
    input.gradeBand,
    input.subjectSlug,
    norm(input.learningGoal),
    norm(input.topicQuery),
  ].join("|");
}

export function learningClipEmbedUrl(videoId: string, origin?: string): string | null {
  if (!isAllowedVideoId(videoId)) return null;
  const url = new URL(`https://www.youtube-nocookie.com/embed/${videoId}`);
  url.searchParams.set("rel", "0");
  url.searchParams.set("fs", "0");
  url.searchParams.set("modestbranding", "1");
  url.searchParams.set("iv_load_policy", "3");
  url.searchParams.set("playsinline", "1");
  url.searchParams.set("enablejsapi", "1");
  if (origin) url.searchParams.set("origin", origin);
  return url.toString();
}

export function clipReflectionMessage(
  clip: { title: string; missionPrompt: string },
  note: string
): string {
  const said = note.replace(/\s+/g, " ").trim();
  return `I watched "${clip.title}" to help with this: ${clip.missionPrompt} I noticed: ${said}`;
}
