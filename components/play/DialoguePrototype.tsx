"use client";

import { useState, type CSSProperties } from "react";
import DialogueCutscene from "./DialogueCutscene";
import ContentWorkspace from "./ContentWorkspace";
import ActivitySurface from "./ActivitySurface";
import { usePlayViewport } from "./usePlayViewport";
import { RHO_SPEAKER } from "../../lib/play/dialogueLayout";
import { HIDDEN_TURN } from "../../lib/play/hiddenTurns";
import type { Message } from "../session/MessageList";
import "./worldMap.css";
import "./dialogueDock.css";

const history: Message[] = Array.from({ length: 20 }, (_, i) => ({ id: `past-${i}`, role: i % 2 ? "ASSISTANT" : "USER", content: `Earlier exchange ${i + 1}: we are investigating what plants need to grow.` }));
const initial: Message[] = [...history, { id: "hidden", role: "USER", content: HIDDEN_TURN.subjectCheckReview },
  { id: "question", role: "USER", content: "Can we grow food near the trees?" },
  { id: "reply", role: "ASSISTANT", content: "We can investigate that. What do you notice about the sunlight here? Choose a place for our first garden bed, then we can test your idea." }];

/** Local-only fixture for layout, replacement speakers and state-preserving transitions. */
export default function DialoguePrototype() {
  const viewport = usePlayViewport();
  const [open, setOpen] = useState(true), [historyOpen, setHistoryOpen] = useState(false);
  const [content, setContent] = useState(false), [maximized, setMaximized] = useState(false);
  const [alternate, setAlternate] = useState(false), [choices, setChoices] = useState(false);
  const [messages, setMessages] = useState(initial);
  const [streaming, setStreaming] = useState(false);
  const width = maximized ? "100%" : content && !historyOpen ? "max(660px, 65%)" : "max(460px, 40%)";
  const style = { "--workspace-width": width, ...(viewport.height ? { height: viewport.height } : {}) } as CSSProperties;
  const speaker = alternate ? { ...RHO_SPEAKER, id: "fixture-engineer", name: "Engineer", role: "Speaker fixture", portrait: "rhoPortraitThinking" as const, voice: null } : RHO_SPEAKER;
  return <div className="play-world relative h-dvh overflow-hidden bg-[#195563]" style={style} data-testid="play-shell"
    data-ready={viewport.height !== undefined} data-conversation={open} data-narrow={viewport.narrow} data-panel={content || historyOpen} data-maximized={maximized}>
    <div className="overworld-viewport" style={{ background: "#759b80", padding: 24 }}><p className="text-white">Island viewport · local layout fixture</p></div>
    <nav aria-label="Prototype controls" className="absolute left-3 top-12 z-20 flex max-w-72 flex-wrap gap-2" inert={viewport.narrow && (content || historyOpen)}>
      {[ ["Change speaker", () => setAlternate((v) => !v)], ["Show choices", () => setChoices((v) => !v)],
        ["Long reply", () => setMessages([...initial.slice(0, -1), { ...initial.at(-1)!, content: "Plants need sunlight, air and fresh water. ".repeat(30) }])],
        ["Open activity", () => { setOpen(true); setContent(true); setHistoryOpen(false); }],
        ["Append streaming reply", () => { setStreaming(true); setMessages((v) => [...v, { id: `stream-${v.length}`, role: "ASSISTANT", content: "Another observation arrives while you read.", streaming: true }]); }],
        ["Call Rho", () => setOpen(true)]
      ].map(([label, action]) => <button key={label as string} className="map-button" onClick={action as () => void}>{label as string}</button>)}
    </nav>
    <DialogueCutscene sessionId="fixture" captainName="Captain" messages={messages} streaming={streaming} thinkingLabel="Listening…"
      portrait={speaker.portrait} speaker={speaker} storyUi={null} open={open} inert={viewport.narrow && (content || historyOpen)}
      historyOpen={historyOpen} narrow={viewport.narrow} maximized={maximized}
      captainChoices={choices ? { prompt: "Where should we investigate?", options: [{ id: "A", label: "Sunny clearing" }, { id: "B", label: "Under the trees" }, { id: "C", label: "Near the creek" }] } : null}
      onHistory={() => setHistoryOpen((v) => !v)} onCloseHistory={() => setHistoryOpen(false)} onMaximize={() => setMaximized((v) => !v)}
      onOpenMap={() => { setContent(true); setHistoryOpen(false); }} onClose={() => { setOpen(false); setHistoryOpen(false); setContent(false); }}
      onSend={(text) => { setStreaming(false); setMessages((v) => [...v, { id: `user-${v.length}`, role: "USER", content: text }, { id: `rho-${v.length}`, role: "ASSISTANT", content: "Let's test that idea together." }]); }} />
    {content && <ContentWorkspace title="Activity fixture" narrow={viewport.narrow} hidden={historyOpen} maximized={maximized}
      onMaximize={() => setMaximized((v) => !v)} onClose={() => setContent(false)}>
      <ActivitySurface><div className="space-y-4 p-5"><h3 className="text-xl">Plan our garden</h3><p>Try opening History while keeping this answer.</p>
        <label className="block">Garden plan<input className="mt-2 block w-full rounded border p-3" /></label>
        <button className="map-button" onClick={() => setContent(false)}>Return to Rho</button>
      </div></ActivitySurface>
    </ContentWorkspace>}
  </div>;
}
