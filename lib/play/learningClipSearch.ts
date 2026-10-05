import OpenAI from "openai";
import { UTILITY_MODEL } from "../ai/models";
import {
  clipCacheKey,
  CLIP_DENY_VIDEO_IDS,
  gateCandidates,
  knownSourceFor,
  learningClipsEnabled,
  offerFromVerdict,
  parseIsoDurationSeconds,
  parseRankerVerdict,
  type ClipCandidate,
  type LearningClipOffer,
} from "./learningClip";

export type FindClipResult =
  | { status: "off" }
  | { status: "none"; reason: string }
  | { status: "clip"; clip: LearningClipOffer };

type Ranker = (
  candidates: ClipCandidate[],
  goal: string
) => Promise<{ videoId: string | null; questions: string[] }>;

const sharedCache = new Map<string, LearningClipOffer>();

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function snippetOf(item: Record<string, unknown>): Record<string, unknown> | null {
  return asRecord(item.snippet);
}

async function youtubeGet(
  fetchImpl: typeof fetch,
  apiKey: string,
  path: string,
  params: Record<string, string>,
  signal?: AbortSignal
): Promise<unknown> {
  const url = new URL(`https://www.googleapis.com/youtube/v3/${path}`);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  url.searchParams.set("key", apiKey);
  const res = await fetchImpl(url, { signal });
  if (!res.ok) throw new Error(`YouTube request failed (${res.status})`);
  return res.json();
}

function searchHits(body: unknown): ClipCandidate[] {
  const root = asRecord(body);
  const items = Array.isArray(root?.items) ? root.items : [];
  const hits: ClipCandidate[] = [];
  for (const raw of items) {
    const item = asRecord(raw);
    const id = asRecord(item?.id);
    const snippet = item ? snippetOf(item) : null;
    const videoId = typeof id?.videoId === "string" ? id.videoId : "";
    if (!item || !snippet || !videoId) continue;
    hits.push({
      videoId,
      channelId: typeof snippet.channelId === "string" ? snippet.channelId : "",
      channelTitle: typeof snippet.channelTitle === "string" ? snippet.channelTitle : "",
      title: typeof snippet.title === "string" ? snippet.title : "",
      description: typeof snippet.description === "string" ? snippet.description : "",
      durationSeconds: 0,
      liveBroadcastContent:
        typeof snippet.liveBroadcastContent === "string"
          ? snippet.liveBroadcastContent
          : "none",
      embeddable: false,
    });
  }
  return hits;
}

function applyVideoDetails(candidates: ClipCandidate[], body: unknown): ClipCandidate[] {
  const root = asRecord(body);
  const items = Array.isArray(root?.items) ? root.items : [];
  const byId = new Map<string, Record<string, unknown>>();
  for (const raw of items) {
    const item = asRecord(raw);
    const id = typeof item?.id === "string" ? item.id : "";
    if (item && id) byId.set(id, item);
  }
  return candidates.map((candidate) => {
    const item = byId.get(candidate.videoId);
    if (!item) return candidate;
    const details = asRecord(item.contentDetails);
    const status = asRecord(item.status);
    const snippet = snippetOf(item);
    const duration =
      typeof details?.duration === "string"
        ? parseIsoDurationSeconds(details.duration)
        : candidate.durationSeconds;
    return {
      ...candidate,
      title: typeof snippet?.title === "string" ? snippet.title : candidate.title,
      description:
        typeof snippet?.description === "string" ? snippet.description : candidate.description,
      channelId:
        typeof snippet?.channelId === "string" ? snippet.channelId : candidate.channelId,
      channelTitle:
        typeof snippet?.channelTitle === "string"
          ? snippet.channelTitle
          : candidate.channelTitle,
      liveBroadcastContent:
        typeof snippet?.liveBroadcastContent === "string"
          ? snippet.liveBroadcastContent
          : candidate.liveBroadcastContent,
      durationSeconds: duration,
      embeddable: status?.embeddable === true,
    };
  });
}

async function defaultRank(
  candidates: ClipCandidate[],
  goal: string,
  apiKey: string | undefined,
  gradeBand: string
): Promise<{ videoId: string | null; questions: string[] }> {
  if (!apiKey || candidates.length === 0) return { videoId: null, questions: [] };
  const lines = candidates.map((candidate, index) => {
    const description = candidate.description.replace(/\s+/g, " ").trim().slice(0, 400);
    const known = knownSourceFor(candidate.channelId);
    const source = known
      ? `knownSource=yes aimedAt=${known.minGrade}-${known.maxGrade}`
      : "knownSource=no";
    return `${index + 1}. id=${candidate.videoId} channel=${candidate.channelTitle} ${source} title=${candidate.title} description=${description}`;
  });
  try {
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: UTILITY_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You choose one educational video id from the list, or NONE. Reply with JSON only: {\"videoId\":\"id or NONE\",\"questions\":[\"...\",\"...\"]}. The child is in the given grade band. A known educational source is a plus, not a requirement. An unknown channel is allowed when the title and description clearly teach the goal. Questions must help the child hold the learning goal. Do not invent what the video shows beyond its title and description. Prefer NONE over a weak or off-topic fit.",
        },
        {
          role: "user",
          content: `Grade band: ${gradeBand}\nLearning goal: ${goal}\n\n${lines.join("\n")}`,
        },
      ],
    });
    return parseRankerVerdict(completion.choices[0]?.message?.content ?? "");
  } catch (err) {
    console.error(
      "Learning clip ranker failed",
      err instanceof Error ? err.message : "unknown"
    );
    return { videoId: null, questions: [] };
  }
}

/**
 * One open YouTube search (safe search, embeddable). Known sources are a plus.
 * Never receives the child's name or voice. The model does not pick the video id.
 */
export async function findLearningClip(
  input: {
    gradeBand: string;
    subjectSlug: string;
    learningGoal: string;
    topicQuery: string;
    signal?: AbortSignal;
  },
  deps: {
    fetchImpl?: typeof fetch;
    rank?: Ranker;
    env?: Record<string, string | undefined>;
    cache?: Map<string, LearningClipOffer>;
    denyIds?: Set<string>;
  } = {}
): Promise<FindClipResult> {
  const env = deps.env ?? process.env;
  if (!learningClipsEnabled(env)) return { status: "off" };

  const goal = input.learningGoal.replace(/\s+/g, " ").trim();
  const topic = (input.topicQuery || goal).replace(/\s+/g, " ").trim().slice(0, 80);
  if (!goal || !topic) return { status: "none", reason: "empty_goal" };

  const cache = deps.cache ?? sharedCache;
  const denyIds = deps.denyIds ?? CLIP_DENY_VIDEO_IDS;
  const key = clipCacheKey({
    gradeBand: input.gradeBand,
    subjectSlug: input.subjectSlug,
    learningGoal: goal,
    topicQuery: topic,
  });
  const cached = cache.get(key);
  if (cached && !denyIds.has(cached.videoId)) return { status: "clip", clip: cached };

  const fetchImpl = deps.fetchImpl ?? fetch;
  const apiKey = env.YOUTUBE_API_KEY?.trim() ?? "";
  let found: ClipCandidate[] = [];
  let searchFailed = false;
  try {
    const body = await youtubeGet(
      fetchImpl,
      apiKey,
      "search",
      {
        part: "snippet",
        type: "video",
        safeSearch: "strict",
        videoEmbeddable: "true",
        videoSyndicated: "true",
        q: topic,
        maxResults: "10",
        relevanceLanguage: "en",
      },
      input.signal
    );
    found = searchHits(body);
  } catch (err) {
    searchFailed = true;
    console.error(
      "Learning clip search failed",
      err instanceof Error ? err.message : "unknown"
    );
  }

  const unique = new Map<string, ClipCandidate>();
  for (const hit of found) {
    if (!unique.has(hit.videoId)) unique.set(hit.videoId, hit);
  }
  const ids = [...unique.keys()].slice(0, 15);
  if (ids.length === 0) {
    return {
      status: "none",
      reason: searchFailed ? "search_failed" : "no_results",
    };
  }

  let detailed: ClipCandidate[];
  try {
    const body = await youtubeGet(
      fetchImpl,
      apiKey,
      "videos",
      { part: "contentDetails,status,snippet", id: ids.join(",") },
      input.signal
    );
    detailed = applyVideoDetails([...unique.values()], body);
  } catch (err) {
    console.error(
      "Learning clip details failed",
      err instanceof Error ? err.message : "unknown"
    );
    return { status: "none", reason: "details_failed" };
  }

  const gated = gateCandidates(detailed, {
    gradeBand: input.gradeBand,
    denyIds,
  }).slice(0, 8);
  if (gated.length === 0) return { status: "none", reason: "none_passed_gates" };

  const rank =
    deps.rank ??
    ((candidates, learningGoal) =>
      defaultRank(candidates, learningGoal, env.OPENAI_API_KEY, input.gradeBand));
  const verdict = await rank(gated, goal);
  const clip = offerFromVerdict(gated, verdict, goal);
  if (!clip) return { status: "none", reason: "ranker_none" };
  cache.set(key, clip);
  return { status: "clip", clip };
}
