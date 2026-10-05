import { describe, expect, it } from "vitest";
import { buildSystemPrompt } from "../ai/contextBuilder";
import { offerLearningClipTool } from "../ai/learningClipTool";
import type { LearnerProfileData } from "../types";
import {
  channelsFor,
  clipGateReason,
  knownSourceFor,
  clipReflectionMessage,
  fallbackWatchQuestions,
  LEARNING_CLIP_FIXTURE,
  learningClipEmbedUrl,
  offerFromVerdict,
  parseIsoDurationSeconds,
  parseRankerVerdict,
  type ClipCandidate,
} from "./learningClip";
import { findLearningClip } from "./learningClipSearch";

const KHAN = "UC4a-Gbdw7vOaccHmFo40b9g";
const OFF_LIST = "UCnotallowed0000000000";

function candidate(overrides: Partial<ClipCandidate> = {}): ClipCandidate {
  return {
    videoId: "jgWqSjgMAtw",
    channelId: KHAN,
    channelTitle: "Khan Academy",
    title: "Fraction basics",
    description: "Divide wholes into equal-sized pieces.",
    durationSeconds: 255,
    liveBroadcastContent: "none",
    embeddable: true,
    ...overrides,
  };
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const profile: LearnerProfileData = {
  id: "learner",
  displayName: "Aaron",
  gradeBand: "3",
  readingLevel: "3",
  firstRunStep: "complete",
  introSeenAt: null,
  householdId: "house",
  primarySubjectSlug: "math_g3",
  goals: "",
  interests: [],
  activeLanguage: null,
  currentLevel: null,
  enrolledSubjects: [],
};

describe("learning clip gates", () => {
  it("rejects overlong, blocked, and live videos, and still allows an unknown channel", () => {
    const opts = { gradeBand: "3" };
    expect(clipGateReason(candidate({ channelId: OFF_LIST }), opts)).toBeNull();
    expect(knownSourceFor(OFF_LIST)).toBeNull();
    expect(knownSourceFor(KHAN)?.name).toBe("Khan Academy");
    expect(clipGateReason(candidate({ durationSeconds: 20 * 60 }), opts)).toBe("too_long");
    expect(clipGateReason(candidate({ durationSeconds: 30 }), opts)).toBe("too_short");
    expect(clipGateReason(candidate({ title: "Fortnite prank challenge" }), opts)).toBe(
      "blocked_text"
    );
    expect(clipGateReason(candidate({ liveBroadcastContent: "live" }), opts)).toBe("live");
    expect(clipGateReason(candidate({ embeddable: false }), opts)).toBe("not_embeddable");
    expect(clipGateReason(candidate(), opts)).toBeNull();
  });

  it("allows a longer clip for older grades and keeps the known-source list broad", () => {
    expect(parseIsoDurationSeconds("PT9M30S")).toBe(570);
    expect(clipGateReason(candidate({ durationSeconds: 570 }), { gradeBand: "3" })).toBe(
      "too_long"
    );
    expect(clipGateReason(candidate({ durationSeconds: 570 }), { gradeBand: "6" })).toBeNull();
    const math = channelsFor("math_g3", "3").map((channel) => channel.name);
    expect(math.length).toBeGreaterThan(3);
    expect(math).toContain("Math Antics");
    expect(math).toContain("TED-Ed");
    expect(math).toContain("Mashup Math");
    const ela = channelsFor("ela_g4", "5").map((channel) => channel.name);
    expect(ela).toContain("Khan Academy");
    expect(ela).toContain("TED-Ed");
    expect(ela).toContain("Crash Course");
    expect(ela).toContain("Homeschool Pop");
  });

  it("does not open a clip when the ranker says none or names an unknown id", () => {
    const gated = [candidate()];
    expect(offerFromVerdict(gated, parseRankerVerdict('{"videoId":"NONE"}'), "share rations")).toBeNull();
    expect(
      offerFromVerdict(gated, { videoId: "xxxxxxxxxxx" }, "share rations")
    ).toBeNull();
    const offer = offerFromVerdict(gated, { videoId: "jgWqSjgMAtw", questions: [] }, "share rations");
    expect(offer?.videoId).toBe("jgWqSjgMAtw");
    expect(offer?.questions).toEqual(fallbackWatchQuestions("share rations"));
  });

  it("builds a nocookie embed for one video and keeps the child's note", () => {
    const src = learningClipEmbedUrl(LEARNING_CLIP_FIXTURE.videoId, "http://localhost:3000");
    expect(src).toContain("https://www.youtube-nocookie.com/embed/jgWqSjgMAtw");
    expect(src).toContain("rel=0");
    expect(src).toContain("fs=0");
    expect(src).not.toContain("youtube.com/watch");
    expect(learningClipEmbedUrl("not an id")).toBeNull();
    const note = "Equal pieces let us share the rations fairly.";
    const message = clipReflectionMessage(LEARNING_CLIP_FIXTURE, note);
    expect(message.startsWith("I watched")).toBe(true);
    expect(message).toContain(note);
  });

  it("tells Rho to open one clip and come back, without inventing a link", () => {
    expect(offerLearningClipTool.function.name).toBe("offer_learning_clip");
    const prompt = buildSystemPrompt(profile, [], null, [], { subjectSlug: "math_g3" });
    expect(prompt).toContain("offer_learning_clip");
    expect(prompt).toContain("Do not describe a link");
    expect(prompt).toContain('starts with "I watched"');
    expect(prompt).toContain("Watching is not mastery");
  });
});

describe("findLearningClip", () => {
  const env = {
    PRIMER_LEARNING_CLIPS: "1",
    YOUTUBE_API_KEY: "test-key",
    OPENAI_API_KEY: "unused",
  };

  function searchBody(channelId: string, videoId: string, title: string) {
    return {
      items: [
        {
          id: { videoId },
          snippet: {
            title,
            description: "Equal parts of a whole.",
            channelId,
            channelTitle: "Khan Academy",
            liveBroadcastContent: "none",
          },
        },
      ],
    };
  }

  it("can offer an unknown channel, still drops an overlong video, and none when the ranker abstains", async () => {
    const fetchImpl = async (input: RequestInfo | URL) => {
      const url = new URL(String(input));
      if (url.pathname.endsWith("/search")) {
        expect(url.searchParams.get("channelId")).toBeNull();
        expect(url.searchParams.get("safeSearch")).toBe("strict");
        return jsonResponse(searchBody(OFF_LIST, "aaaaaaaaaaa", "Equal pieces of a ration bar"));
      }
      return jsonResponse({
        items: [
          {
            id: "aaaaaaaaaaa",
            snippet: {
              title: "Equal pieces of a ration bar",
              description: "Split one bar into equal pieces.",
              channelId: OFF_LIST,
              channelTitle: "Someone",
              liveBroadcastContent: "none",
            },
            contentDetails: { duration: "PT4M" },
            status: { embeddable: true },
          },
        ],
      });
    };
    const offList = await findLearningClip(
      {
        gradeBand: "3",
        subjectSlug: "math_g3",
        learningGoal: "share rations in equal parts",
        topicQuery: "fractions",
      },
      { env, fetchImpl, cache: new Map(), rank: async () => ({ videoId: "aaaaaaaaaaa", questions: [] }) }
    );
    expect(offList).toMatchObject({
      status: "clip",
      clip: { videoId: "aaaaaaaaaaa", channelId: OFF_LIST },
    });

    const longFetch = async (input: RequestInfo | URL) => {
      const url = new URL(String(input));
      if (url.pathname.endsWith("/search")) {
        return jsonResponse(searchBody(KHAN, "bbbbbbbbbbb", "Long lesson"));
      }
      return jsonResponse({
        items: [
          {
            id: "bbbbbbbbbbb",
            snippet: {
              title: "Long lesson",
              description: "A full class.",
              channelId: KHAN,
              channelTitle: "Khan Academy",
              liveBroadcastContent: "none",
            },
            contentDetails: { duration: "PT30M" },
            status: { embeddable: true },
          },
        ],
      });
    };
    const overlong = await findLearningClip(
      {
        gradeBand: "3",
        subjectSlug: "math_g3",
        learningGoal: "share rations in equal parts",
        topicQuery: "fractions",
      },
      {
        env,
        fetchImpl: longFetch,
        cache: new Map(),
        rank: async () => ({ videoId: "bbbbbbbbbbb", questions: ["Why?"] }),
      }
    );
    expect(overlong.status).toBe("none");

    let fetches = 0;
    const goodFetch = async (input: RequestInfo | URL) => {
      fetches += 1;
      const url = new URL(String(input));
      if (url.pathname.endsWith("/search")) {
        return jsonResponse(searchBody(KHAN, "jgWqSjgMAtw", "Fraction basics"));
      }
      return jsonResponse({
        items: [
          {
            id: "jgWqSjgMAtw",
            snippet: {
              title: "Fraction basics",
              description: "Equal-sized pieces.",
              channelId: KHAN,
              channelTitle: "Khan Academy",
              liveBroadcastContent: "none",
            },
            contentDetails: { duration: "PT4M15S" },
            status: { embeddable: true },
          },
        ],
      });
    };
    const abstain = await findLearningClip(
      {
        gradeBand: "3",
        subjectSlug: "math_g3",
        learningGoal: "share rations in equal parts",
        topicQuery: "fractions equal parts",
      },
      {
        env,
        fetchImpl: goodFetch,
        cache: new Map(),
        rank: async () => ({ videoId: null, questions: [] }),
      }
    );
    expect(abstain.status).toBe("none");

    const cache = new Map();
    const picked = await findLearningClip(
      {
        gradeBand: "3",
        subjectSlug: "math_g3",
        learningGoal: "share rations in equal parts",
        topicQuery: "fractions equal parts",
      },
      {
        env,
        fetchImpl: goodFetch,
        cache,
        rank: async () => ({
          videoId: "jgWqSjgMAtw",
          questions: ["What is a fraction a count of?"],
        }),
      }
    );
    expect(picked).toMatchObject({
      status: "clip",
      clip: { videoId: "jgWqSjgMAtw" },
    });
    const after = fetches;
    const again = await findLearningClip(
      {
        gradeBand: "3",
        subjectSlug: "math_g3",
        learningGoal: "share rations in equal parts",
        topicQuery: "fractions equal parts",
      },
      { env, fetchImpl: goodFetch, cache, rank: async () => ({ videoId: null, questions: [] }) }
    );
    expect(again).toEqual(picked);
    expect(fetches).toBe(after);
  });

  it("stays off unless the learning-clip flag and YouTube key are set", async () => {
    let called = false;
    const fetchImpl = async () => {
      called = true;
      return jsonResponse({});
    };
    const off = await findLearningClip(
      {
        gradeBand: "3",
        subjectSlug: "math_g3",
        learningGoal: "fractions",
        topicQuery: "fractions",
      },
      { env: { PRIMER_LEARNING_CLIPS: "0", YOUTUBE_API_KEY: "test-key" }, fetchImpl, cache: new Map() }
    );
    expect(off).toEqual({ status: "off" });
    expect(called).toBe(false);
  });
});
