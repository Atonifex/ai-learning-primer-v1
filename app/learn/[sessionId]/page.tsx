"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import ScenePanel from "../../../components/session/ScenePanel";
import MessageList, { type Message } from "../../../components/session/MessageList";
import InputBar from "../../../components/session/InputBar";

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
  const streamingIdRef = useRef<string>(`streaming-${Date.now()}`);
  const hasStarted = useRef(false);

  // Resolve params
  useEffect(() => {
    params.then(({ sessionId: sid }) => setSessionId(sid));
  }, [params]);

  // Load existing session messages
  useEffect(() => {
    if (!sessionId) return;
    fetch(`/api/session/${sessionId}`)
      .then((r) => r.json())
      .then(({ session }) => {
        if (!session) return;
        const msgs: Message[] = session.messages.map((m: {
          id: string;
          role: "USER" | "ASSISTANT";
          content: string;
          imageUrl?: string | null;
        }) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          imageUrl: m.imageUrl,
        }));
        setMessages(msgs);

        // Set last image if any
        const lastWithImage = [...msgs].reverse().find((m) => m.imageUrl);
        if (lastWithImage?.imageUrl) setCurrentImage(lastWithImage.imageUrl);
      });
  }, [sessionId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!sessionId || streaming) return;

      const isStart = content === "__start__";
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
      setStreaming(true);

      const streamingMsg: Message = {
        id: streamingId,
        role: "ASSISTANT",
        content: "",
        streaming: true,
      };
      setMessages((prev) => [...prev, streamingMsg]);

      try {
        const res = await fetch(`/api/session/${sessionId}/message`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
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
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === streamingId
                      ? { ...m, content: m.content + data.content }
                      : m
                  )
                );
              } else if (data.type === "image_start") {
                setImageLoading(true);
              } else if (data.type === "image_done") {
                setCurrentImage(data.url);
                setImageLoading(false);
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === streamingId ? { ...m, imageUrl: data.url } : m
                  )
                );
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
        console.error("Stream error:", err);
        setMessages((prev) =>
          prev.filter((m) => m.id !== streamingId)
        );
      } finally {
        setStreaming(false);
      }
    },
    [sessionId, streaming]
  );

  // Auto-start if no messages
  useEffect(() => {
    if (!sessionId || hasStarted.current) return;
    // Wait a tick to ensure messages are loaded
    const timer = setTimeout(() => {
      if (messages.length === 0 && !streaming) {
        hasStarted.current = true;
        sendMessage("__start__");
      } else if (messages.length > 0) {
        hasStarted.current = true;
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [sessionId, messages.length, streaming, sendMessage]);

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
          <span className="text-stone-400 text-sm">Learning session</span>
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

      {/* Scene panel */}
      <ScenePanel imageUrl={currentImage} loading={imageLoading} />

      {/* Messages */}
      <MessageList messages={messages} />

      {/* Streaming indicator */}
      {streaming && (
        <div className="flex-shrink-0 px-4 pb-1">
          <div className="max-w-2xl mx-auto flex items-center gap-2 text-stone-400 text-xs ml-10">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <span>Primer is writing…</span>
          </div>
        </div>
      )}

      {/* Input */}
      <InputBar onSend={sendMessage} disabled={streaming || leaving} />

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
