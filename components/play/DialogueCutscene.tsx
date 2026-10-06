"use client";

import { useEffect, useRef } from "react";
import type { StillKey } from "../../lib/play/stills";
import type { CaptainChoicesPayload } from "../../lib/play/captainChoices";
import { formatCaptainChoiceReply } from "../../lib/play/captainChoices";
import { latestExchange, RHO_SPEAKER, type DialogueSpeaker } from "../../lib/play/dialogueLayout";
import MessageList, { type Message } from "../session/MessageList";
import InputBar from "../session/InputBar";
import PreviouslyOnCard from "../session/PreviouslyOnCard";
import BranchPickPanel from "../session/BranchPickPanel";
import CaptainChoicePanel from "./CaptainChoicePanel";
import SpeakerPresence from "./SpeakerPresence";
import ContentWorkspace from "./ContentWorkspace";
import type { SessionStoryUi } from "../../lib/types";
import { useRhoTts } from "./useRhoTts";

export default function DialogueCutscene(props: {
  sessionId: string; captainName: string; messages: Message[]; streaming: boolean;
  thinkingLabel: string; portrait: StillKey; storyUi: SessionStoryUi | null;
  captainChoices?: CaptainChoicesPayload | null; speaker?: DialogueSpeaker;
  open?: boolean; inert?: boolean; historyOpen?: boolean; narrow?: boolean; maximized?: boolean;
  onHistory?: () => void; onCloseHistory?: () => void; onMaximize?: () => void;
  onSend: (content: string) => void; onClose: () => void;
  workBusy?: boolean;
  onBranchResolved?: (nextId: string) => void; onOpenMap?: () => void;
  mapContext?: string; worldUpdate?: string;
}) {
  const speaker = props.speaker ?? { ...RHO_SPEAKER, portrait: props.portrait };
  const hasVoice = speaker.voice === "rho";
  const tts = useRhoTts();
  const { speak, stop } = tts;
  const wasStreaming = useRef(props.streaming);
  useEffect(() => {
    const was = wasStreaming.current; wasStreaming.current = props.streaming;
    if (props.streaming) { if (!was) stop(); return; }
    if (!was || !hasVoice || props.open === false) return;
    const last = latestExchange(props.messages).findLast((m) => m.role === "ASSISTANT" && m.content.trim());
    if (last) void speak(last.content, last.id, "automatic");
  }, [props.streaming, props.messages, props.open, hasVoice, speak, stop]);
  useEffect(() => { if (props.open === false || !hasVoice) stop(); }, [props.open, hasVoice, stop]);

  const hear = hasVoice ? (id: string, content: string) => {
    if (tts.playingId === id) stop(); else void speak(content, id);
  } : undefined;
  const showChoices = Boolean(props.captainChoices?.options.length) && !props.storyUi?.branchPoint;
  return <>
    {props.historyOpen && <ContentWorkspace title="Conversation history" narrow={Boolean(props.narrow)}
      maximized={Boolean(props.maximized)} onMaximize={() => props.onMaximize?.()} onClose={props.onCloseHistory}>
      {props.storyUi?.showPreviouslyOn && props.storyUi.previouslyOn && <PreviouslyOnCard sessionId={props.sessionId} text={props.storyUi.previouslyOn} />}
      <MessageList messages={props.messages} history containedDefinitions speakerName={speaker.name}
        hearingId={tts.playingId} hearLoading={tts.loading} onHear={hear} />
    </ContentWorkspace>}
    <section hidden={props.open === false} inert={props.inert || undefined} className="dialogue-dock" data-testid="dialogue-dock" aria-label={`Talking with ${speaker.name}`}>
      <div className="dialogue-main">
        <header className="dialogue-header">
          <p>Talking with {speaker.name}</p>
          <div className="dialogue-controls">
            {props.onHistory && <button type="button" aria-pressed={props.historyOpen} onClick={props.onHistory}>History</button>}
            {props.onOpenMap && <button type="button" disabled={props.workBusy} onClick={props.onOpenMap}>Island map</button>}
            {hasVoice && <details className="dialogue-audio" open={!props.narrow}><summary>Audio</summary><div>
              <button type="button" role="switch" aria-checked={tts.autoRead} aria-label={`Automatic reading by ${speaker.name}`} onClick={() => tts.setAutoRead(!tts.autoRead)}>{tts.autoRead ? "Auto read" : "Auto read off"}</button>
              <button type="button" aria-pressed={!tts.muted} aria-label={`Turn ${speaker.name}'s voice ${tts.muted ? "on" : "off"}`} onClick={() => tts.setMuted(!tts.muted)}>{tts.muted ? "Voice off" : "Voice on"}</button>
            </div></details>}
            <button type="button" disabled={props.workBusy} onClick={props.onClose}>Back to beach</button>
          </div>
        </header>
        <div className="dialogue-reading">
          {props.worldUpdate && props.onOpenMap && <button type="button" disabled={props.workBusy} onClick={props.onOpenMap} className="dock-world-update">{props.worldUpdate} · View on map</button>}
          <MessageList messages={latestExchange(props.messages)} containedDefinitions speakerName={speaker.name}
            hearingId={tts.playingId} hearLoading={tts.loading} onHear={hear} />
        </div>
        <div className="dialogue-decisions">
          {props.storyUi?.branchPoint && <BranchPickPanel sessionId={props.sessionId} branchPoint={props.storyUi.branchPoint} onResolved={(id) => props.onBranchResolved?.(id)} />}
          {showChoices && props.captainChoices && <CaptainChoicePanel choices={props.captainChoices} disabled={props.streaming || props.workBusy} onPick={(option) => props.onSend(formatCaptainChoiceReply(option))} />}
        </div>
        {props.streaming && <p className="dialogue-thinking" role="status">{props.thinkingLabel}</p>}
        <InputBar onSend={props.onSend} onMicStart={stop} disabled={props.streaming || props.workBusy || Boolean(props.storyUi?.branchPoint)} speakFirst
          placeholder={`Tell ${speaker.name} — talk or type a little, Captain ${props.captainName}…`} />
      </div>
      <SpeakerPresence speaker={speaker} playing={hasVoice && tts.playing} loading={hasVoice && tts.loading} blocked={hasVoice && tts.blocked && !tts.muted}
        onHear={hasVoice ? () => { if (tts.muted) tts.setMuted(false); if (tts.playing) stop(); else tts.replayLast(); } : undefined} />
    </section>
  </>;
}
