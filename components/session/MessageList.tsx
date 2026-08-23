"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import MessageCard from "./MessageCard";
import UserBubble from "./UserBubble";
import ConceptPopup from "./ConceptPopup";
import { isHiddenTurn } from "../../lib/play/hiddenTurns";

export interface Message {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
  imageUrl?: string | null;
  streaming?: boolean;
}

interface PopupState {
  word: string;
  sentence: string;
  rect: DOMRect;
  content: string;
  streaming: boolean;
}

interface MessageListProps {
  messages: Message[];
  hearingId?: string | null;
  hearLoading?: boolean;
  onHear?: (id: string, content: string) => void;
}

export default function MessageList({
  messages,
  hearingId,
  hearLoading,
  onHear,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [popup, setPopup] = useState<PopupState | null>(null);
  const defineAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleWordClick = useCallback(
    async (word: string, sentence: string, rect: DOMRect) => {
      defineAbortRef.current?.abort();
      const ac = new AbortController();
      defineAbortRef.current = ac;

      setPopup({ word, sentence, rect, content: "", streaming: true });

      try {
        const res = await fetch("/api/define", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ word, sentence }),
          signal: ac.signal,
        });

        if (!res.body) return;

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
              if (data.content) {
                setPopup((p) => (p ? { ...p, content: p.content + data.content } : p));
              }
              if (data.done) {
                setPopup((p) => (p ? { ...p, streaming: false } : p));
              }
            } catch {
              // ignore parse errors
            }
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setPopup((p) => (p ? { ...p, streaming: false } : p));
      }
    },
    []
  );

  const closePopup = useCallback(() => {
    defineAbortRef.current?.abort();
    setPopup(null);
  }, []);

  const visible = messages.filter(
    (m) => m.content && !isHiddenTurn(m.content)
  );

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 messages-scroll">
      <div className="max-w-2xl mx-auto space-y-1">
        {visible.map((msg, i) =>
          msg.role === "ASSISTANT" ? (
            <MessageCard
              key={msg.id}
              content={msg.content}
              isFirst={i === 0}
              onWordClick={handleWordClick}
              hearing={hearingId === msg.id}
              hearLoading={Boolean(hearLoading && hearingId === msg.id)}
              onHear={
                onHear && !msg.streaming
                  ? () => onHear(msg.id, msg.content)
                  : undefined
              }
            />
          ) : (
            <UserBubble key={msg.id} content={msg.content} />
          )
        )}
        {visible.length === 0 && (
          <div className="flex items-center justify-center h-32">
            <p className="text-base text-stone-400 md:text-lg">
              Rho is waiting — you can talk or type a little.
            </p>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {popup && (
        <ConceptPopup
          word={popup.word}
          rect={popup.rect}
          content={popup.content}
          streaming={popup.streaming}
          onClose={closePopup}
        />
      )}
    </div>
  );
}
