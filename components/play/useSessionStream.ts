"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { isHiddenTurn } from "../../lib/play/hiddenTurns";
import type { Message } from "../session/MessageList";
import type { GeneratedActivity, SessionStoryUi } from "../../lib/types";

export function useSessionStream(sessionId: string, onAssistantTurnEnd?: () => void) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [storyUi, setStoryUi] = useState<SessionStoryUi | null>(null);
  const [generatedActivities, setGeneratedActivities] = useState<GeneratedActivity[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [observationToasts, setObservationToasts] = useState<
    { id: string; standardCode: string; mastery: number }[]
  >([]);
  const streamingIdRef = useRef(`streaming-${Date.now()}`);
  const streamAbortRef = useRef<AbortController | null>(null);
  const opSeqRef = useRef(0);
  const streamingRef = useRef(false);
  const endCbRef = useRef(onAssistantTurnEnd);
  endCbRef.current = onAssistantTurnEnd;

  useEffect(() => {
    if (!sessionId) return;
    fetch(`/api/session/${sessionId}`)
      .then((r) => r.json())
      .then(({ session, storyUi: su }: { session?: unknown; storyUi?: SessionStoryUi }) => {
        if (!session || typeof session !== "object" || !("messages" in session)) {
          setLoaded(true);
          return;
        }
        const s = session as {
          messages: Array<{
            id: string;
            role: "USER" | "ASSISTANT";
            content: string;
            imageUrl?: string | null;
          }>;
        };
        setMessages(
          s.messages.map((m) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            imageUrl: m.imageUrl,
          }))
        );
        if (su) setStoryUi(su);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [sessionId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!sessionId) return;
      if (streamingRef.current) {
        streamAbortRef.current?.abort();
      }

      const mySeq = ++opSeqRef.current;
      const hidden = isHiddenTurn(content);

      if (!hidden) {
        setMessages((prev) => [
          ...prev,
          { id: `user-${Date.now()}`, role: "USER", content },
        ]);
      }

      const streamingId = `streaming-${Date.now()}`;
      streamingIdRef.current = streamingId;
      streamingRef.current = true;
      setStreaming(true);
      setMessages((prev) => [
        ...prev,
        { id: streamingId, role: "ASSISTANT", content: "", streaming: true },
      ]);

      const ac = new AbortController();
      streamAbortRef.current = ac;
      let gotText = false;

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
              const data = JSON.parse(line.slice(6)) as {
                type?: string;
                content?: string;
                messageId?: string;
                activity?: GeneratedActivity;
                standardCode?: string;
                mastery?: number;
              };
              if (data.type === "text" && data.content) {
                gotText = true;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === streamingId
                      ? { ...m, content: m.content + data.content }
                      : m
                  )
                );
              } else if (data.type === "standard_observation" && data.standardCode) {
                const id = `obs-${Date.now()}`;
                setObservationToasts((prev) => [
                  ...prev,
                  { id, standardCode: data.standardCode!, mastery: data.mastery ?? 0 },
                ]);
                window.setTimeout(() => {
                  setObservationToasts((p) => p.filter((t) => t.id !== id));
                }, 5000);
              } else if (data.type === "activity_generated" && data.activity) {
                setGeneratedActivities((prev) =>
                  prev.some((a) => a.id === data.activity!.id)
                    ? prev
                    : [...prev, data.activity!]
                );
              } else if (data.type === "done" && data.messageId) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === streamingId
                      ? { ...m, id: data.messageId!, streaming: false }
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
          setMessages((prev) => prev.filter((m) => m.id !== streamingId));
        }
      } finally {
        if (mySeq !== opSeqRef.current) return;
        streamingRef.current = false;
        setStreaming(false);
        if (gotText) endCbRef.current?.();
      }
    },
    [sessionId]
  );

  return {
    messages,
    streaming,
    storyUi,
    loaded,
    generatedActivities,
    observationToasts,
    sendMessage,
    setStoryUi,
  };
}
