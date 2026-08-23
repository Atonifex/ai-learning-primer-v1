"use client";

import type { StillKey } from "../../lib/play/stills";
import type { Message } from "../session/MessageList";
import MessageList from "../session/MessageList";
import InputBar from "../session/InputBar";
import PreviouslyOnCard from "../session/PreviouslyOnCard";
import BranchPickPanel from "../session/BranchPickPanel";
import type { SessionStoryUi } from "../../lib/types";
import SafeStill from "./SafeStill";

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
}) {
  return (
    <div className="absolute inset-0 z-30 flex min-h-0 flex-col bg-[#071820]/70 md:flex-row">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col border-stone-800 bg-[#f7f1e4] md:border-r">
        <div className="flex flex-shrink-0 items-center justify-between border-b border-amber-200/60 bg-[#efe4ce] px-3 py-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-900/80">
            Talking with Rho
          </p>
          <button
            type="button"
            onClick={props.onClose}
            className="rounded-lg px-2 py-1 text-xs text-stone-600 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            Back to beach
          </button>
        </div>
        {props.storyUi?.showPreviouslyOn && props.storyUi.previouslyOn && (
          <PreviouslyOnCard
            sessionId={props.sessionId}
            text={props.storyUi.previouslyOn}
          />
        )}
        <MessageList messages={props.messages} />
        {props.storyUi?.branchPoint && (
          <BranchPickPanel
            sessionId={props.sessionId}
            branchPoint={props.storyUi.branchPoint}
            onResolved={(nextId) => props.onBranchResolved?.(nextId)}
          />
        )}
        {props.streaming && (
          <p className="flex-shrink-0 px-4 pb-1 text-xs text-stone-500">{props.thinkingLabel}</p>
        )}
        <InputBar
          onSend={props.onSend}
          disabled={props.streaming || Boolean(props.storyUi?.branchPoint)}
          speakFirst
          placeholder={`Tell Rho — talk or type a little, Captain ${props.captainName}…`}
        />
      </div>
      <div className="relative h-[34vh] min-h-[180px] w-full flex-shrink-0 bg-[#0c2a32] md:h-auto md:w-[42%] md:min-h-0">
        <SafeStill still={props.portrait} alt="Rho, First Mate" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#071820] to-transparent px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-200/80">
            First Mate
          </p>
          <p className="text-lg text-teal-50">Rho</p>
        </div>
      </div>
    </div>
  );
}
