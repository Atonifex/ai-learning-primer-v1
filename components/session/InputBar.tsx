"use client";

import { useRef, useState, KeyboardEvent } from "react";
import MicButton from "../play/MicButton";

interface InputBarProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
  /** ChatGPT/Claude placement: mic on the composer. Speak-first for Grade 3. */
  speakFirst?: boolean;
}

export default function InputBar({
  onSend,
  disabled,
  placeholder,
  speakFirst = false,
}: InputBarProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function resize() {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
  }

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value);
    resize();
  }

  function handleTranscript(text: string) {
    setValue((prev) => {
      const next = prev.trim() ? `${prev.trim()} ${text}` : text;
      return next;
    });
    window.setTimeout(resize, 0);
    textareaRef.current?.focus();
  }

  const ph =
    placeholder ||
    (speakFirst
      ? "Tell Rho — talk or type a little…"
      : "Type your response… (Enter to send, Shift+Enter for new line)");

  return (
    <div className="border-t border-stone-100 bg-white px-4 py-3">
      <div className="mx-auto flex max-w-2xl items-end gap-2">
        {speakFirst && (
          <MicButton disabled={disabled} onTranscript={handleTranscript} />
        )}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={ph}
          rows={1}
          className="max-h-40 min-h-12 flex-1 resize-none overflow-y-auto rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 transition-colors focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20 disabled:opacity-50"
          style={{ height: "auto" }}
        />
        <button
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-600 text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Send"
        >
          <svg className="h-4 w-4 -rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
