"use client";

import { useEffect, useRef } from "react";
import type { StillKey } from "../../lib/play/stills";
import type { Message } from "../session/MessageList";
import MessageList from "../session/MessageList";
import InputBar from "../session/InputBar";
import PreviouslyOnCard from "../session/PreviouslyOnCard";
import BranchPickPanel from "../session/BranchPickPanel";
import type { SessionStoryUi } from "../../lib/types";
import SafeStill from "./SafeStill";
import { useRhoTts } from "./useRhoTts";

export default function DialogueCutscene(props: {
  sessionId: string;
  captainName: string;
  messages: Message[];
  streaming: boolean;
  thinkingLabel: string;
  portrait: StillKey;
  storyUi: SessionStoryUi | null;
  onSend: (content: string) => void;
  onClose: () => void;
  onBranchResolved?: (nextId: string) => void;
  onOpenMap?: () => void;
  mapContext?: string;
  worldUpdate?: string;
}) {
  const tts = useRhoTts();
  const speak = tts.speak;
  const stop = tts.stop;
  const wasStreaming = useRef(props.streaming);

  useEffect(() => {
    const was = wasStreaming.current;
    wasStreaming.current = props.streaming;
    if (props.streaming) {
      if (!was) stop();
      return;
    }
    if (!was) return;
    const last = [...props.messages]
      .reverse()
      .find((m) => m.role === "ASSISTANT" && m.content.trim());
    if (!last) return;
    void speak(last.content, last.id, "automatic");
  }, [props.streaming, props.messages, speak, stop]);

  function handlePortraitTap() {
    if (tts.muted) tts.setMuted(false);
    if (tts.playing) {
      stop();
      return;
    }
    tts.replayLast();
  }

  return (
    <div className="absolute inset-0 z-30 flex min-h-0 flex-col bg-[#071820]/70 md:flex-row">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col border-stone-800 bg-[#f7f1e4] md:border-r">
        <div className="flex flex-shrink-0 flex-wrap items-center justify-between gap-2 border-b border-amber-200/60 bg-[#efe4ce] px-3 py-2.5">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-900/80">
            Talking with Rho
          </p>
          <div className="flex flex-wrap items-center gap-1">
            {props.onOpenMap && <button type="button" onClick={props.onOpenMap} className="rounded-lg bg-teal-800 px-3 py-2 text-sm text-teal-50">Island map</button>}
            <button
              type="button"
              role="switch"
              aria-checked={tts.autoRead}
              aria-label="Automatic reading by Rho"
              title="Turn off to skip paid speech on new lines. Hear Rho still works."
              onClick={() => tts.setAutoRead(!tts.autoRead)}
              className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-stone-600 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <span>{tts.autoRead ? "Auto read" : "Auto read off"}</span>
              <span
                aria-hidden
                className={`relative inline-flex h-5 w-9 shrink-0 rounded-full ${tts.autoRead ? "bg-teal-700" : "bg-stone-400"}`}
              >
                <span
                  className={`absolute top-0.5 size-4 rounded-full bg-[#f7f1e4] shadow transition-transform ${tts.autoRead ? "translate-x-4" : "translate-x-0.5"}`}
                />
              </span>
            </button>
            <button
              type="button"
              aria-pressed={!tts.muted}
              aria-label={tts.muted ? "Turn Rho's voice on" : "Turn Rho's voice off"}
              onClick={() => tts.setMuted(!tts.muted)}
              className="rounded-lg px-2.5 py-1.5 text-sm text-stone-600 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {tts.muted ? "Voice off" : "Voice on"}
            </button>
            <button
              type="button"
              onClick={props.onClose}
              className="rounded-lg px-2.5 py-1.5 text-sm text-stone-600 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              Back to beach
            </button>
          </div>
        </div>
        {props.onOpenMap && <button type="button" onClick={props.onOpenMap} className="conversation-map-link"><span aria-hidden>✧</span><span>{props.worldUpdate ?? props.mapContext ?? "Our island"}</span><strong>View on map</strong></button>}
        {props.storyUi?.showPreviouslyOn && props.storyUi.previouslyOn && (
          <PreviouslyOnCard
            sessionId={props.sessionId}
            text={props.storyUi.previouslyOn}
          />
        )}
        <MessageList
          messages={props.messages}
          hearingId={tts.playingId}
          hearLoading={tts.loading}
          onHear={(id, content) => {
            if (tts.playingId === id) stop();
            else void speak(content, id);
          }}
        />
        {props.storyUi?.branchPoint && (
          <BranchPickPanel
            sessionId={props.sessionId}
            branchPoint={props.storyUi.branchPoint}
            onResolved={(nextId) => props.onBranchResolved?.(nextId)}
          />
        )}
        {props.streaming && (
          <p className="flex-shrink-0 px-4 pb-1 text-sm text-stone-500">{props.thinkingLabel}</p>
        )}
        <InputBar
          onSend={props.onSend}
          onMicStart={stop}
          disabled={props.streaming || Boolean(props.storyUi?.branchPoint)}
          speakFirst
          placeholder={`Tell Rho — talk or type a little, Captain ${props.captainName}…`}
        />
      </div>
      <div className="relative h-[34vh] min-h-[180px] w-full flex-shrink-0 bg-[#0c2a32] md:h-auto md:w-[42%] md:min-h-0">
        <SafeStill still={props.portrait} alt="Rho, First Mate" />
        <button
          type="button"
          onClick={handlePortraitTap}
          className="absolute inset-0 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-300"
          aria-label={
            tts.blocked
              ? "Tap to hear Rho"
              : tts.playing
                ? "Stop Rho's voice"
                : "Hear Rho again"
          }
        />
        {tts.playing && (
          <span className="pointer-events-none absolute right-3 top-3 h-3 w-3 rounded-full bg-teal-300 shadow-[0_0_12px_rgba(94,234,212,0.9)]" />
        )}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#071820] to-transparent px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-200/80">
            First Mate
          </p>
          <p className="text-lg text-teal-50">Rho</p>
          {tts.blocked && !tts.muted && (
            <p className="mt-0.5 text-sm text-teal-100/90">Tap Rho to hear</p>
          )}
          {tts.loading && <p className="mt-0.5 text-sm text-teal-100/80">Rho is getting ready…</p>}
        </div>
      </div>
    </div>
  );
}
