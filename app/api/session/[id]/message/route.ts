import { NextRequest } from "next/server";
import { getCurrentUser } from "../../../../../lib/auth/session";
import { getProfile } from "../../../../../lib/services/profile";
import { getSession, addMessage, updateMessageImage } from "../../../../../lib/services/session";
import {
  persistMessageSceneToStorage,
  updatePortraitsAfterSceneImage,
} from "../../../../../lib/services/characterPortraits";
import {
  getRelevantMemory,
  getRecentSummaries,
  getStoryStateForSessionContext,
} from "../../../../../lib/services/memory";
import { streamSessionResponse } from "../../../../../lib/ai/sessionOrchestrator";
import {
  getPreviouslyOnRecap,
  getStorySpineForSession,
} from "../../../../../lib/services/sessionStoryContext";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { id: sessionId } = await params;
  const { content } = await req.json();

  if (!content) return new Response("Missing content", { status: 400 });

  const profile = await getProfile(user.userId);
  if (!profile) return new Response("No profile", { status: 404 });

  const session = await getSession(sessionId);
  if (!session) return new Response("Session not found", { status: 404 });

  const isStart = content === "__start__";

  // Save user message (unless it's the auto-start signal)
  if (!isStart) {
    await addMessage(sessionId, "USER", content);
  }

  // Load context (story state scoped to this chapter when possible)
  const [memoryItems, recentSummaries, storyState, spine, previouslyOn] = await Promise.all([
    getRelevantMemory(profile.id),
    getRecentSummaries(profile.id),
    getStoryStateForSessionContext(sessionId),
    getStorySpineForSession(sessionId),
    getPreviouslyOnRecap(sessionId),
  ]);

  const encoder = new TextEncoder();
  let assistantText = "";
  let finalImageUrl: string | null = null;
  let finalImagePrompt: string | null = null;
  let lastCharactersInScene: string[] = [];

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
        );
      };

      try {
        const generator = streamSessionResponse(
          profile,
          memoryItems,
          storyState,
          recentSummaries,
          session.messages,
          content,
          {
            subjectSlug: session.subjectSlug,
            abortSignal: req.signal,
            spine,
            previouslyOn,
            sessionId,
          }
        );

        for await (const chunk of generator) {
          if (chunk.type === "text") {
            assistantText += chunk.content;
            send(chunk);
          } else if (chunk.type === "assistant_thinking") {
            send(chunk);
          } else if (chunk.type === "standard_observation") {
            send(chunk);
          } else if (chunk.type === "activity_generated") {
            send(chunk);
          } else if (chunk.type === "image_start") {
            send(chunk);
          } else if (chunk.type === "image_done") {
            if (chunk.url) {
              finalImageUrl = chunk.url;
              finalImagePrompt = chunk.prompt;
            }
            if (chunk.charactersInScene?.length) {
              lastCharactersInScene = chunk.charactersInScene;
            }
            send(chunk);
          }
        }

        if (req.signal.aborted) {
          return;
        }

        // Save assistant message
        const saved = await addMessage(
          sessionId,
          "ASSISTANT",
          assistantText,
          finalImageUrl,
          finalImagePrompt
        );

        if (finalImageUrl?.startsWith("data:image")) {
          const b64Match = /^data:image\/\w+;base64,(.+)$/.exec(finalImageUrl);
          if (b64Match?.[1]) {
            const pngBytes = Buffer.from(b64Match[1], "base64");
            const persisted = await persistMessageSceneToStorage({
              profileId: profile.id,
              sessionId,
              messageId: saved.id,
              pngBytes,
            });
            if (persisted) {
              await updateMessageImage(saved.id, {
                imageStoragePath: persisted.path,
                imageUrl: persisted.signedUrl ?? finalImageUrl,
              });
            }
            await updatePortraitsAfterSceneImage({
              profileId: profile.id,
              sessionId,
              messageId: saved.id,
              charactersInScene: lastCharactersInScene,
              imageStoragePath: persisted?.path ?? null,
            });
          }
        }

        send({ type: "done", messageId: saved.id });
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        console.error("Stream error:", err);
        send({ type: "error", message: "An error occurred" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
