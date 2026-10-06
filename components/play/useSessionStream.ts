"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { isClientAiDebug } from "../../lib/play/clientAiDebug";
import { isHiddenTurn } from "../../lib/play/hiddenTurns";
import type { Message } from "../session/MessageList";
import type { LearningClipOffer } from "../../lib/play/learningClip";
import type { CaptainChoicesPayload } from "../../lib/play/captainChoices";
import { decodeCaptainChoices } from "../../lib/play/captainChoices";
import type { GeneratedActivity, SessionStoryUi } from "../../lib/types";
import type { AiDebugTurn } from "./AiDebugPanel";

export type MissionOpenEvent = {
  missionId: string;
  subjectSlug: string;
  activitySlug: string;
  sessionId: string;
  switched: boolean;
};

export type CrewLogSavedEvent = {
  text: string;
  handoffSummary: string | null;
  alreadyCompleted: boolean;
};

const DEBUG_RING = 8;

export function useSessionStream(sessionId: string, onAssistantTurnEnd?: () => void) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [storyUi, setStoryUi] = useState<SessionStoryUi | null>(null);
  const [generatedActivities, setGeneratedActivities] = useState<GeneratedActivity[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [observationToasts, setObservationToasts] = useState<
    { id: string; standardCode: string; mastery: number }[]
  >([]);
  const [pendingMissionOpen, setPendingMissionOpen] = useState<MissionOpenEvent | null>(null);
  const [pendingMissionBoardOpen, setPendingMissionBoardOpen] = useState(false);
  const [pendingGardenPlotOpen, setPendingGardenPlotOpen] = useState(false);
  const [pendingMapOpen, setPendingMapOpen] = useState<{ nodeId?: string } | null>(null);
  const [worldVersion, setWorldVersion] = useState(0);
  const [worldUpdate, setWorldUpdate] = useState<{ reason: string; nodeId?: string } | null>(null);
  const [pendingCrewLogOpen, setPendingCrewLogOpen] = useState(false);
  const [pendingLearningClip, setPendingLearningClip] = useState<LearningClipOffer | null>(
    null
  );
  const [pendingCaptainChoices, setPendingCaptainChoices] =
    useState<CaptainChoicesPayload | null>(null);
  const [pendingCrewLogSaved, setPendingCrewLogSaved] = useState<CrewLogSavedEvent | null>(
    null
  );
  const [aiDebugTurns, setAiDebugTurns] = useState<AiDebugTurn[]>([]);
  const [aiThinkingPhase, setAiThinkingPhase] = useState<string | null>(null);
  const [streamError, setStreamError] = useState<string | null>(null);
  const streamingIdRef = useRef(`streaming-${Date.now()}`);
  const streamAbortRef = useRef<AbortController | null>(null);
  const opSeqRef = useRef(0);
  const streamingRef = useRef(false);
  const endCbRef = useRef(onAssistantTurnEnd);
  endCbRef.current = onAssistantTurnEnd;
  const clientDebug = isClientAiDebug();

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

  const pushDebugTurn = useCallback(
    (blocks: AiDebugTurn["blocks"]) => {
      if (!clientDebug) return;
      setAiDebugTurns((prev) =>
        [...prev, { id: `dbg-${Date.now()}-${prev.length}`, blocks, tools: [] }].slice(-DEBUG_RING)
      );
    },
    [clientDebug]
  );

  const pushDebugTool = useCallback(
    (tool: AiDebugTurn["tools"][number]) => {
      if (!clientDebug) return;
      setAiDebugTurns((prev) => {
        if (!prev.length) {
          return [{ id: `dbg-${Date.now()}`, blocks: [], tools: [tool] }];
        }
        const next = [...prev];
        const last = next[next.length - 1];
        next[next.length - 1] = { ...last, tools: [...last.tools, tool] };
        return next;
      });
    },
    [clientDebug]
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!sessionId) return;
      if (streamingRef.current) {
        streamAbortRef.current?.abort();
      }

      const mySeq = ++opSeqRef.current;
      const hidden = isHiddenTurn(content);
      setStreamError(null);
      setAiThinkingPhase(null);
      setPendingCaptainChoices(null);

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
                message?: string;
                messageId?: string;
                activity?: GeneratedActivity;
                standardCode?: string;
                mastery?: number;
                missionId?: string;
                subjectSlug?: string;
                activitySlug?: string;
                sessionId?: string;
                switched?: boolean;
                text?: string;
                videoId?: string;
                title?: string;
                channelTitle?: string;
                questions?: string[];
                missionPrompt?: string;
                handoffSummary?: string | null;
                alreadyCompleted?: boolean;
                name?: string;
                ok?: boolean;
                args?: string;
                result?: string;
                detail?: string;
                blocks?: { label?: string; text?: string }[];
                phase?: string;
                nodeId?: string;
                reason?: string;
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
              } else if (data.type === "assistant_thinking" && data.phase) {
                if (clientDebug) setAiThinkingPhase(data.phase);
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
              } else if (
                data.type === "mission_open" &&
                data.missionId &&
                data.activitySlug &&
                data.subjectSlug &&
                data.sessionId
              ) {
                setPendingMissionOpen({
                  missionId: data.missionId,
                  subjectSlug: data.subjectSlug,
                  activitySlug: data.activitySlug,
                  sessionId: data.sessionId,
                  switched: Boolean(data.switched),
                });
              } else if (data.type === "mission_board_open") {
                setPendingMissionBoardOpen(true);
              } else if (data.type === "garden_plot_open") {
                setPendingGardenPlotOpen(true);
              } else if (data.type === "captain_choices") {
                const decoded = decodeCaptainChoices(data);
                if (decoded) setPendingCaptainChoices(decoded);
              } else if (data.type === "world_map_open") {
                setPendingMapOpen({ nodeId: data.nodeId });
              } else if (data.type === "world_updated") {
                setWorldVersion((v) => v + 1);
                setWorldUpdate({ reason: data.reason ?? "Your map changed", nodeId: data.nodeId });
              } else if (
                data.type === "learning_clip_open" &&
                data.videoId &&
                data.title &&
                data.channelTitle &&
                data.missionPrompt &&
                Array.isArray(data.questions)
              ) {
                setPendingLearningClip({
                  videoId: data.videoId,
                  title: data.title,
                  channelId: "",
                  channelTitle: data.channelTitle,
                  questions: data.questions.filter((q): q is string => typeof q === "string"),
                  missionPrompt: data.missionPrompt,
                });
              } else if (data.type === "crew_log_open") {
                setPendingCrewLogOpen(true);
              } else if (data.type === "crew_log_saved" && typeof data.text === "string") {
                setPendingCrewLogSaved({
                  text: data.text,
                  handoffSummary: data.handoffSummary ?? null,
                  alreadyCompleted: Boolean(data.alreadyCompleted),
                });
              } else if (data.type === "debug_context" && Array.isArray(data.blocks)) {
                pushDebugTurn(
                  data.blocks.filter(
                    (block): block is { label: string; text: string } =>
                      Boolean(block) &&
                      typeof block.label === "string" &&
                      typeof block.text === "string"
                  )
                );
              } else if (data.type === "debug_tool" && data.name) {
                pushDebugTool({
                  name: data.name,
                  ok: Boolean(data.ok),
                  args: typeof data.args === "string" ? data.args : "",
                  result: typeof data.result === "string" ? data.result : data.detail ?? "",
                });
              } else if (data.type === "error") {
                const msg = data.message || "An error occurred";
                setStreamError(msg);
                console.warn("[Primer AI] stream error", msg);
              } else if (data.type === "done" && data.messageId) {
                setAiThinkingPhase(null);
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
          const msg = err instanceof Error ? err.message : "Stream failed";
          setStreamError(msg);
          console.warn("[Primer AI] stream failed", msg);
          setMessages((prev) => prev.filter((m) => m.id !== streamingId));
        }
      } finally {
        if (mySeq !== opSeqRef.current) return;
        streamingRef.current = false;
        setStreaming(false);
        setWorldVersion((v) => v + 1);
        if (gotText) endCbRef.current?.();
      }
    },
    [clientDebug, pushDebugTurn, pushDebugTool, sessionId]
  );

  return {
    messages,
    streaming,
    storyUi,
    loaded,
    generatedActivities,
    observationToasts,
    pendingMissionOpen,
    clearPendingMissionOpen: () => setPendingMissionOpen(null),
    pendingMissionBoardOpen,
    pendingGardenPlotOpen,
    pendingMapOpen,
    clearPendingMapOpen: () => setPendingMapOpen(null),
    worldVersion,
    worldUpdate,
    clearPendingMissionBoardOpen: () => setPendingMissionBoardOpen(false),
    clearPendingGardenPlotOpen: () => setPendingGardenPlotOpen(false),
    pendingCrewLogOpen,
    clearPendingCrewLogOpen: () => setPendingCrewLogOpen(false),
    pendingLearningClip,
    clearPendingLearningClip: () => setPendingLearningClip(null),
    pendingCaptainChoices,
    clearPendingCaptainChoices: () => setPendingCaptainChoices(null),
    pendingCrewLogSaved,
    clearPendingCrewLogSaved: () => setPendingCrewLogSaved(null),
    aiDebugTurns,
    aiThinkingPhase,
    streamError,
    sendMessage,
    setStoryUi,
  };
}
