"use client";

import { useEffect, useRef } from "react";
import MessageCard from "./MessageCard";
import UserBubble from "./UserBubble";

export interface Message {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
  imageUrl?: string | null;
  streaming?: boolean;
}

interface MessageListProps {
  messages: Message[];
}

export default function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const visible = messages.filter((m) => m.content && m.content !== "__start__");

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 messages-scroll">
      <div className="max-w-2xl mx-auto space-y-1">
        {visible.map((msg, i) =>
          msg.role === "ASSISTANT" ? (
            <MessageCard key={msg.id} content={msg.content} isFirst={i === 0} />
          ) : (
            <UserBubble key={msg.id} content={msg.content} />
          )
        )}
        {visible.length === 0 && (
          <div className="flex items-center justify-center h-32">
            <p className="text-stone-400 text-sm">Beginning your session…</p>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
