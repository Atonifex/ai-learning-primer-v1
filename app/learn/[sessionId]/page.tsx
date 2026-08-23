"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ScenePanel from "../../../components/session/ScenePanel";
import MessageList, { type Message } from "../../../components/session/MessageList";
import InputBar from "../../../components/session/InputBar";
import PreviouslyOnCard from "../../../components/session/PreviouslyOnCard";
import BranchPickPanel from "../../../components/session/BranchPickPanel";
import GeneratedActivityCard from "../../../components/session/GeneratedActivityCard";
import { SUBJECT_DISPLAY_NAMES } from "../../../lib/constants/subjects";
import type { GeneratedActivity, SessionStoryUi } from "../../../lib/types";

function subjectLabel(slug: string | undefined | null): string {
  if (!slug) return "Learning session";
  return (
    SUBJECT_DISPLAY_NAMES[slug as keyof typeof SUBJECT_DISPLAY_NAMES] ?? slug
  );
}

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

export default function SessionPage({ params }: PageProps) {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [storyUi, setStoryUi] = useState<SessionStoryUi | null>(null);
  const [generatedActivities, setGeneratedActivities] = useState<GeneratedActivity[]>([]);
  const [sessionSubjectSlug, setSessionSubjectSlug] = useState<string | null>(null);
  const [chapterMeta, setChapterMeta] = useState<{
    actCurrent: number;
    actTotal: number;
    pathAheadWhisper: string | null;
  } | null>(null);
  const streamingIdRef = useRef<string>(`streaming-${Date.now()}`);
  const streamAbortRef = useRef<AbortController | null>(null);
  const opSeqRef = useRef(0);
  const streamingRef = useRef(false);
  const hasStarted = useRef(false);
  const [streamingHasAssistantText, setStreamingHasAssistantText] = useState(false);
  const [thinkingPhase, setThinkingPhase] = useState<"tools" | "continuation" | null>(null);
  const [observationToasts, setObservationToasts] = useState<
    { id: string; standardCode: string; mastery: number }[]
  >([]);

  // Resolve params
  useEffect(() => {
    params.then(({ sessionId: sid }) => setSessionId(sid));
  }, [params]);

  useEffect(() => {
    hasStarted.current = false;
  }, [sessionId]);

  // Load existing session messages + story UI metadata
  useEffect(() => {
    if (!sessionId) return;
    fetch(`/api/session/${sessionId}`)
      .then((r) => r.json())
      .then(({ session, storyUi: su }: { session?: unknown; storyUi?: SessionStoryUi }) => {
        if (!session || typeof session !== "object" || !("messages" in session)) return;
        const s = session as {
          subjectSlug?: string;
          messages: Array<{
            id: string;
            role: "USER" | "ASSISTANT";
            content: string;
            imageUrl?: string | null;
          }>;
          chapter?: {
            actCurrent: number;
            actTotal: number;
            pathAheadWhisper: string | null;
          } | null;
        };
        if (s.subjectSlug) setSessionSubjectSlug(s.subjectSlug);
        const msgs: Message[] = s.messages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          imageUrl: m.imageUrl,
        }));
        setMessages(msgs);

        const lastWithImage = [...msgs].reverse().find((m) => m.imageUrl);
        if (lastWithImage?.imageUrl) setCurrentImage(lastWithImage.imageUrl);

        if (su) setStoryUi(su);
        if (s.chapter) {
          setChapterMeta({
            actCurrent: s.chapter.actCurrent,
            actTotal: s.chapter.actTotal,
            pathAheadWhisper: s.chapter.pathAheadWhisper,
          });
        } else {
          setChapterMeta(null);
        }
      });
  }, [sessionId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!sessionId || leaving) return;
      if (storyUi?.branchPoint) return;
      if (content === "__start__" && streamingRef.current) return;

      const isStart = content === "__start__";

      if (streamingRef.current && !isStart) {
        streamAbortRef.current?.abort();
        const droppedId = streamingIdRef.current;
        setMessages((prev) => prev.filter((m) => m.id !== droppedId));
        setImageLoading(false);
        streamingRef.current = false;
        setStreamingHasAssistantText(false);
        setThinkingPhase(null);
      }

      const mySeq = ++opSeqRef.current;

      if (!isStart) {
        const userMsg: Message = {
          id: `user-${Date.now()}`,
          role: "USER",
          content,
        };
        setMessages((prev) => [...prev, userMsg]);
      }

      const streamingId = `streaming-${Date.now()}`;
      streamingIdRef.current = streamingId;
      streamingRef.current = true;
      setStreamingHasAssistantText(false);
      setThinkingPhase(null);
      setStreaming(true);

      const streamingMsg: Message = {
        id: streamingId,
        role: "ASSISTANT",
        content: "",
        streaming: true,
      };
      setMessages((prev) => [...prev, streamingMsg]);

      const ac = new AbortController();
      streamAbortRef.current = ac;

      try {
        const res = await fetch(`/api/session/${sessionId}/message`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
          signal: ac.signal,
        });

        if (!res.body) throw new Error("No response body");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === "text") {
                setStreamingHasAssistantText(true);
                setThinkingPhase(null);
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === streamingId
                      ? { ...m, content: m.content + data.content }
                      : m
                  )
                );
              } else if (data.type === "assistant_thinking") {
                if (data.phase === "tools" || data.phase === "continuation") {
                  setThinkingPhase(data.phase);
                }
              } else if (data.type === "standard_observation") {
                const id = `obs-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
                setObservationToasts((prev) => [
                  ...prev,
                  { id, standardCode: data.standardCode, mastery: data.mastery },
                ]);
                window.setTimeout(() => {
                  setObservationToasts((prev) => prev.filter((t) => t.id !== id));
                }, 6000);
              } else if (data.type === "image_start") {
                setImageLoading(true);
              } else if (data.type === "image_done") {
                if (data.url) {
                  setCurrentImage(data.url);
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === streamingId ? { ...m, imageUrl: data.url } : m
                    )
                  );
                }
                setImageLoading(false);
              } else if (data.type === "activity_generated" && data.activity) {
                setGeneratedActivities((prev) => {
                  const exists = prev.some((a) => a.id === data.activity.id);
                  if (exists) return prev;
                  return [...prev, data.activity];
                });
              } else if (data.type === "error") {
                setImageLoading(false);
              } else if (data.type === "done") {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === streamingId
                      ? { ...m, id: data.messageId, streaming: false }
                      : m
                  )
                );
              }
            } catch {
              // ignore parse errors
            }
          }
        }
      } catch (err) {
        const aborted = err instanceof Error && err.name === "AbortError";
        if (!aborted) {
          console.error("Stream error:", err);
          setMessages((prev) => prev.filter((m) => m.id !== streamingId));
          setImageLoading(false);
        }
      } finally {
        if (mySeq !== opSeqRef.current) return;
        if (streamAbortRef.current === ac) streamAbortRef.current = null;
        streamingRef.current = false;
        setStreaming(false);
        setImageLoading(false);
        setThinkingPhase(null);
        setStreamingHasAssistantText(false);
      }
    },
    [sessionId, leaving, storyUi?.branchPoint]
  );

  // Auto-start if no messages (wait until branch choice is cleared if present)
  useEffect(() => {
    if (!sessionId || hasStarted.current) return;
    if (storyUi?.branchPoint) return;
    const timer = setTimeout(() => {
      if (messages.length === 0 && !streamingRef.current) {
        hasStarted.current = true;
        sendMessage("__start__");
      } else if (messages.length > 0) {
        hasStarted.current = true;
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [sessionId, messages.length, sendMessage, storyUi?.branchPoint]);

  async function handleLeave() {
    if (leaving) return;
    setLeaving(true);
    try {
      await fetch(`/api/session/${sessionId}/complete`, { method: "POST" });
    } catch {
      // best effort
    }
    router.push("/sessions");
  }

  // beforeunload — best-effort beacon
  useEffect(() => {
    if (!sessionId) return;
    const handler = () => {
      navigator.sendBeacon(`/api/session/${sessionId}/complete`, "{}");
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [sessionId]);

  return (
    <div className="flex flex-col h-screen bg-stone-50">
      {/* Header */}
      <header className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-stone-900 text-white">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight">Primer</span>
          <span className="text-stone-500 text-xs">◈</span>
          <span className="text-stone-400 text-sm">{subjectLabel(sessionSubjectSlug)}</span>
          <Link
            href="/progress"
            className="ml-2 text-xs text-amber-400/90 hover:text-amber-300 transition-colors"
          >
            Progress
          </Link>
        </div>
        <button
          onClick={() => setConfirmLeave(true)}
          disabled={leaving}
          className="flex items-center gap-1.5 text-stone-400 hover:text-white transition-colors text-sm disabled:opacity-50"
        >
          <span>Leave</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      {/* Main: chat left, scene image right (stacked on small screens: chat first, image below) */}
      <div className="flex flex-1 min-h-0 flex-col md:flex-row">
        <div className="flex min-h-0 min-w-0 flex-1 flex-col border-stone-200/90 md:border-r">
          {storyUi?.showPreviouslyOn && storyUi.previouslyOn && (
            <PreviouslyOnCard sessionId={sessionId} text={storyUi.previouslyOn} />
          )}
          <MessageList messages={messages} />
          {storyUi?.branchPoint && (
            <BranchPickPanel
              sessionId={sessionId}
              branchPoint={storyUi.branchPoint}
              onResolved={(nextId) => {
                router.push(`/learn/${nextId}`);
              }}
            />
          )}
          {generatedActivities.map((activity) => (
            <GeneratedActivityCard
              key={activity.id}
              sessionId={sessionId}
              activity={activity}
            />
          ))}

          {observationToasts.length > 0 && (
            <div className="flex-shrink-0 space-y-1 px-4 pb-1">
              {observationToasts.map((t) => (
                <div
                  key={t.id}
                  className="mx-auto max-w-2xl rounded-lg border border-amber-100 bg-amber-50/90 px-3 py-2 text-xs text-amber-900 ml-10"
                >
                  Progress saved:{" "}
                  <span className="font-semibold">{t.standardCode}</span> mastery{" "}
                  <span className="font-semibold">{Math.round(t.mastery)}</span>
                </div>
              ))}
            </div>
          )}

          {streaming && (
            <div className="flex-shrink-0 px-4 pb-1">
              <div className="mx-auto flex max-w-2xl items-center gap-2 text-stone-400 text-xs ml-10">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-400"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
                <span>
                  {streamingHasAssistantText
                    ? "Primer is writing…"
                    : imageLoading
                      ? "Painting the scene…"
                      : thinkingPhase === "tools"
                        ? "Using tools (scene, quizzes, standards)…"
                        : thinkingPhase === "continuation"
                          ? "Continuing your scene…"
                          : "Primer is thinking…"}
                </span>
              </div>
            </div>
          )}

          <InputBar onSend={sendMessage} disabled={leaving || Boolean(storyUi?.branchPoint)} />
        </div>

        <div className="flex min-h-[220px] min-w-0 flex-1 flex-col border-t border-stone-200 bg-stone-900 md:h-full md:min-h-0 md:border-l md:border-t-0">
          <ScenePanel
            imageUrl={currentImage}
            loading={imageLoading}
            className="h-full min-h-[220px] md:min-h-0"
            actCurrent={chapterMeta?.actCurrent}
            actTotal={chapterMeta?.actTotal}
            pathAheadWhisper={chapterMeta?.pathAheadWhisper}
          />
        </div>
      </div>

      {/* Leave confirmation */}
      {confirmLeave && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-semibold text-stone-900 mb-2">End this session?</h3>
            <p className="text-stone-500 text-sm mb-6">
              Primer will save your progress and remember what you practiced.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmLeave(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-sm font-medium hover:bg-stone-50 transition-colors"
              >
                Keep learning
              </button>
              <button
                onClick={handleLeave}
                disabled={leaving}
                className="flex-1 px-4 py-2.5 rounded-xl bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors disabled:opacity-50"
              >
                {leaving ? "Saving…" : "End session"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
