"use client";

import { useCallback, useEffect, useRef, useState, useTransition, type CSSProperties, type SetStateAction } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SPAWN_COL, SPAWN_ROW, tileCenter } from "../../lib/play/beachMap";
import { HIDDEN_TURN } from "../../lib/play/hiddenTurns";
import { TUTORIAL_QUIZ_SLUG } from "../../lib/play/tutorialQuizSlug";
import type { StillKey } from "../../lib/play/stills";
import { SUBJECT_DISPLAY_NAMES, type PlayableCoreSubjectSlug } from "../../lib/constants/subjects";
import { formatHiddenMinutes, secondsBetween } from "../../lib/services/timeMath";
import IntroCinematic from "./IntroCinematic";
import ResourceHud from "./ResourceHud";
import RhoRadio from "./RhoRadio";
import DialogueCutscene from "./DialogueCutscene";
import QuizOverlay from "./QuizOverlay";
import ReflectionOverlay from "./ReflectionOverlay";
import MissionBoard from "./MissionBoard";
import GardenPlotPanel from "./GardenPlotPanel";
import GardenTeachPanel from "./GardenTeachPanel";
import LearningClipPanel from "./LearningClipPanel";
import SubjectFocusPanel from "./SubjectFocusPanel";
import MathFiveCheck from "./MathFiveCheck";
import AiDebugPanel from "./AiDebugPanel";
import FirstRunCoach from "./FirstRunCoach";
import LearningPurposeCard from "./LearningPurposeCard";
import {
  campNeedsMissions,
  campNeedsTitle,
  CHAPTER_PROBLEM,
  day0AllDone,
  day0Checklist,
} from "../../lib/play/day0";
import { hasSavedMathPlacement } from "../../lib/play/mathPlacement";
import { useFirstRunTutorial } from "./useFirstRunTutorial";
import { useSessionStream } from "./useSessionStream";
import { useLearningLoop } from "./useLearningLoop";
import { useMissions } from "./useMissions";
import { unlockRhoAudio } from "../../lib/play/rhoAudio";
import { isClientAiDebug } from "../../lib/play/clientAiDebug";
import { WORKSPACE_PANELS } from "../../lib/play/dialogueLayout";
import ContentWorkspace from "./ContentWorkspace";
import { useWorkspace } from "./useWorkspace";
import { usePlayViewport } from "./usePlayViewport";
import "./dialogueDock.css";
import { useWorldMap } from "./useWorldMap";
import WorldMapPanel from "./WorldMapPanel";
import WorldHud from "./WorldHud";
import type { MapTask, WorldNode } from "../../lib/play/worldMap";
import type { GeneratedActivity } from "../../lib/types";
import "./worldMap.css";
import {
  clipReflectionMessage,
  LEARNING_CLIP_FIXTURE,
  type LearningClipOffer,
} from "../../lib/play/learningClip";

const OverworldCanvas = dynamic(() => import("./OverworldCanvas"), { ssr: false });

const TIMER_KEY = "primer.showTimers";

function subjectBadge(slug: string): string {
  const full = SUBJECT_DISPLAY_NAMES[slug as PlayableCoreSubjectSlug];
  if (full) return full.replace("Grade 3 ", "");
  return slug.replace("_g3", "").replaceAll("_", " ");
}

export default function PlayShell(props: {
  sessionId: string;
  displayName: string;
  subjectSlug: string;
  sessionStartedAt: string;
  initialMission?: string;
  firstRunStep?: string;
  /** Agent playtest: open dialogue cutscene on mount. */
  autoOpenDialogue?: boolean;
  /** Agent playtest: open Jobs board on mount. */
  autoOpenBoard?: boolean;
  /** Open the subject-focus view after a math starting point is saved. */
  autoOpenFocus?: boolean;
  /** Playtest: open the one-clip panel with a fixture, no YouTube search. */
  autoOpenClip?: boolean;
}) {
  const router = useRouter();
  const captain = props.displayName.trim() || "Captain";
  const firstRun = useFirstRunTutorial(props.firstRunStep ?? "video", captain);
  const missions = useMissions();
  const [dialogueOpen, setDialogueOpen] = useState(() => Boolean(props.autoOpenDialogue));
  const { panel, setPanel, setOpen } = useWorkspace(props.autoOpenBoard ? "board" : props.autoOpenFocus ? "focus" : props.autoOpenClip ? "clip" : null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const viewport = usePlayViewport();
  const boardOpen = panel === "board";
  const setBoardOpen = useCallback((value: SetStateAction<boolean>) => setOpen("board", value), [setOpen]);
  const gardenOpen = panel === "garden";
  const setGardenOpen = useCallback((value: SetStateAction<boolean>) => setOpen("garden", value), [setOpen]);
  const gardenTeachOpen = panel === "gardenTeach";
  const setGardenTeachOpen = useCallback((value: SetStateAction<boolean>) => setOpen("gardenTeach", value), [setOpen]);
  const focusOpen = panel === "focus";
  const setFocusOpen = useCallback((value: SetStateAction<boolean>) => setOpen("focus", value), [setOpen]);
  const mathCheckOpen = panel === "math";
  const setMathCheckOpen = useCallback((value: SetStateAction<boolean>) => setOpen("math", value), [setOpen]);
  const mapOpen = panel === "map";
  const setMapOpen = useCallback((value: SetStateAction<boolean>) => setOpen("map", value), [setOpen]);
  const [clipOffer, setClipOffer] = useState<LearningClipOffer | null>(() => props.autoOpenClip ? LEARNING_CLIP_FIXTURE : null);
  const clip = panel === "clip" ? clipOffer : null;
  const setClip = useCallback((value: LearningClipOffer | null) => { setClipOffer(value); setOpen("clip", Boolean(value)); }, [setOpen]);
  const [subjectSlug, setSubjectSlug] = useState(props.subjectSlug);
  const [startingId, setStartingId] = useState<string | null>(null);
  const [navigatingToMission, startMissionNavigation] = useTransition();
  const [talkedToWreck, setTalkedToWreck] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [showTimers, setShowTimers] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [crewLogToast, setCrewLogToast] = useState<string | null>(null);
  const pendingQuizRef = useRef(false);
  const wreckOpeningRef = useRef(false);
  const openedMissionRef = useRef<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [position, setPosition] = useState(() => tileCenter(SPAWN_COL, SPAWN_ROW));
  const [travel, setTravel] = useState<{ id: string; sequence: number } | null>(null);
  const [activityBusy, setActivityBusy] = useState(false);
  const [mapActionError, setMapActionError] = useState<string | null>(null);
  useEffect(() => { setMapReady(true); }, []);
  const openQuizRef = useRef<(() => Promise<{ alreadyDone: boolean } | undefined>) | null>(
    null
  );

  const onTurnEnd = useCallback(() => {
    if (!pendingQuizRef.current) return;
    pendingQuizRef.current = false;
    void openQuizRef.current?.()
      .then((r) => {
        if (r?.alreadyDone) setHint("The wreck is counted. Other sites are open.");
      })
      .catch((e: unknown) => {
        setHint(e instanceof Error ? e.message : "Could not open the crate lid.");
      });
  }, []);

  const stream = useSessionStream(props.sessionId, onTurnEnd);
  const worldMap = useWorldMap(props.sessionId, stream.worldVersion);
  const selectedNode = worldMap.world?.nodes.find((n) => n.id === selectedPlace);
  const learning = useLearningLoop(props.sessionId, captain, stream.sendMessage);
  openQuizRef.current = learning.openTutorialQuiz;


  const openTreelineLesson = useCallback(async () => {
    setMapOpen(false);
    setBoardOpen(false);
    setFocusOpen(false);
    setDialogueOpen(false);
    setGardenOpen(false);
    setGardenTeachOpen(false);
    try {
      const res = await fetch("/api/garden");
      const data = (await res.json()) as { state?: { teachCompleted?: boolean }; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Could not open the Treeline lesson.");
      if (data.state?.teachCompleted) setGardenOpen(true);
      else setGardenTeachOpen(true);
    } catch (e) {
      setHint(e instanceof Error ? e.message : "Could not open the Treeline lesson.");
      setGardenTeachOpen(true);
    }
  }, []);

  const beginMission = useCallback(
    async (missionId: string) => {
      setStartingId(missionId);
      try {
        const started = await missions.startMission(missionId);
        setBoardOpen(false);
        setMapOpen(false);
        setFocusOpen(false);
        setDialogueOpen(false);
        if (started.sessionId !== props.sessionId) {
          setHint(`Opening ${started.mission.title}…`);
          startMissionNavigation(() => router.push(`/learn/${started.sessionId}?mission=${started.mission.id}`));
          return;
        }
        if (started.mission.status !== "completed") {
          void stream.sendMessage(
            `${HIDDEN_TURN.missionStartPrefix} ${started.mission.title} (${started.mission.subjectSlug}) at the ${started.mission.pinId}.`
          );
        }
        if (missionId === "treeline-sci") {
          void openTreelineLesson();
          void missions.refresh();
          return;
        }
        const opened = await learning.openOverlayQuiz(started.mission.activitySlug);
        if (opened.alreadyDone) {
          setHint(`Reviewing ${started.mission.title}. Your result is saved.`);
        }
        void missions.refresh();
      } catch (e) {
        setHint(e instanceof Error ? e.message : "Could not start that job.");
      } finally {
        setStartingId(null);
      }
    },
    [learning, missions, openTreelineLesson, props.sessionId, router, stream]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    setShowTimers(window.localStorage.getItem(TIMER_KEY) === "1");
  }, []);

  useEffect(() => {
    const tick = () => {
      setElapsedSeconds(secondsBetween(new Date(props.sessionStartedAt), new Date()));
    };
    tick();
    if (!showTimers) return;
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, [props.sessionStartedAt, showTimers]);

  useEffect(() => {
    if (!stream.loaded) return;
    if (stream.messages.length > 0) {
      setTalkedToWreck(true);
    }
  }, [stream.loaded, stream.messages.length]);

  useEffect(() => {
    const missionId = props.initialMission;
    if (!missionId || openedMissionRef.current === missionId) return;
    if (!firstRun.complete) return;
    openedMissionRef.current = missionId;
    void beginMission(missionId);
  }, [beginMission, props.initialMission, firstRun.complete]);

  useEffect(() => { setOpen("quiz", learning.showQuiz); }, [learning.showQuiz, setOpen]);
  useEffect(() => { setOpen("reflection", learning.showReflection); }, [learning.showReflection, setOpen]);
  useEffect(() => { if (panel) setDialogueOpen(true); setHistoryOpen(false); setMaximized(false); }, [panel]);

  useEffect(() => {
    if (stream.streaming) return;
    const pending = stream.pendingMissionOpen;
    if (!pending) return;
    stream.clearPendingMissionOpen();
    if (pending.missionId === "treeline-sci") {
      void openTreelineLesson();
      return;
    }
    if (pending.switched) {
      void beginMission(pending.missionId);
      return;
    }
    setDialogueOpen(false);
    void learning.openOverlayQuiz(pending.activitySlug).catch((e: unknown) => {
      setHint(e instanceof Error ? e.message : "Could not open that job.");
    });
  }, [beginMission, learning, openTreelineLesson, stream]);

  useEffect(() => {
    if (!stream.pendingMissionBoardOpen) return;
    stream.clearPendingMissionBoardOpen();
    setMapOpen(false);
    setDialogueOpen(false);
    setFocusOpen(false);
    void missions.refresh();
    setBoardOpen(true);
  }, [stream.pendingMissionBoardOpen, stream, missions.refresh]);

  useEffect(() => {
    if (!stream.pendingGardenPlotOpen) return;
    stream.clearPendingGardenPlotOpen();
    void openTreelineLesson();
  }, [stream.pendingGardenPlotOpen, openTreelineLesson, stream]);

  useEffect(() => {
    if (!stream.pendingCrewLogOpen) return;
    stream.clearPendingCrewLogOpen();
    setMapOpen(false);
    void learning.openReflection();
  }, [stream.pendingCrewLogOpen, stream, learning]);

  useEffect(() => {
    const pending = stream.pendingLearningClip;
    if (!pending) return;
    stream.clearPendingLearningClip();
    setMapOpen(false);
    setClip(pending);
  }, [stream.pendingLearningClip, stream]);

  useEffect(() => {
    const saved = stream.pendingCrewLogSaved;
    if (!saved) return;
    stream.clearPendingCrewLogSaved();
    learning.markReflectionDoneFromTool(saved.text, saved.handoffSummary);
    void missions.refresh();
    setCrewLogToast(
      saved.alreadyCompleted
        ? "Crew log already on file. Camp work can open."
        : "Crew log saved. Camp work unlocked."
    );
    const t = window.setTimeout(() => setCrewLogToast(null), 4500);
    return () => window.clearTimeout(t);
  }, [stream.pendingCrewLogSaved, stream, learning, missions]);

  useEffect(() => {
    if (!stream.pendingMapOpen) return;
    if (stream.pendingMapOpen.nodeId) setSelectedPlace(stream.pendingMapOpen.nodeId);
    setMapOpen(true);
    stream.clearPendingMapOpen();
    void worldMap.refresh();
  }, [stream.pendingMapOpen, stream, worldMap.refresh]);

  useEffect(() => {
    if (!stream.worldUpdate) return;
    if (stream.worldUpdate.nodeId) setSelectedPlace(stream.worldUpdate.nodeId);
    setHint(stream.worldUpdate.reason);
  }, [stream.worldUpdate]);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (!firstRun.complete || e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
      if (e.target instanceof HTMLElement && (e.target.closest("input,textarea,select,dialog") || e.target.isContentEditable)) return;
      if (e.key.toLowerCase() === "m" && !learning.showQuiz && !learning.showReflection && !clip && !focusOpen && !boardOpen) { e.preventDefault(); setMapOpen((open) => !open); }
    };
    window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key);
  }, [firstRun.complete, learning.showQuiz, learning.showReflection, clip, focusOpen, boardOpen]);

  function walkToPlace(node: WorldNode) {
    setMapOpen(false); setDialogueOpen(false); setBoardOpen(false); setFocusOpen(false);
    setSelectedPlace(node.id); setTravel({ id: node.id, sequence: Date.now() });
  }

  function askAboutPlace(node: WorldNode) {
    setMapOpen(false); setBoardOpen(false); setFocusOpen(false); setDialogueOpen(true);
    unlockRhoAudio();
    if (stream.streaming) return;
    if (node.id === "treeline") {
      void stream.sendMessage(
        "At the Treeline we need to start a garden so camp can grow food. Our goal is What plants need to grow — Sun, air, and fresh water. Open the garden beds when I am ready."
      );
      return;
    }
    void stream.sendMessage(`Let's talk about ${node.title} on our map. What can we do here for our chapter problem?`);
  }

  async function openMapActivity(task: MapTask) {
    if (activityBusy) return;
    setActivityBusy(true);
    setMapActionError(null);
    try {
      const response = await fetch(`/api/world/activity/${encodeURIComponent(task.id)}`);
      const data = await response.json() as { activity: GeneratedActivity; sessionId: string; error?: string };
      if (!response.ok) throw new Error(data.error ?? "Could not open this work.");
      setMapOpen(false); setDialogueOpen(false);
      learning.openGeneratedQuiz(data.activity, data.sessionId);
    } catch (e) { setMapActionError(e instanceof Error ? e.message : "Could not open this work. Try opening it again."); }
    finally { setActivityBusy(false); }
  }

  function skipIntro() {
    void firstRun.advance("video_done");
  }

  function openWreckTalk() {
    unlockRhoAudio();
    setDialogueOpen(true);
    setHint(null);
    if (firstRun.step === "move") {
      void firstRun.advance("walked_to_wreck");
    }
    if (!talkedToWreck && !wreckOpeningRef.current) {
      wreckOpeningRef.current = true;
      setTalkedToWreck(true);
      const waitForSpeech = firstRun.step === "move" || firstRun.step === "talk";
      pendingQuizRef.current = !waitForSpeech;
      void stream.sendMessage(HIDDEN_TURN.wreckApproach);
      return;
    }
    if (firstRun.step === "talk") return;
    if (!learning.quizDone && !learning.showQuiz) {
      void learning.openTutorialQuiz().catch((e: unknown) => {
        setHint(e instanceof Error ? e.message : "Could not open the crate lid.");
      });
    }
  }

  function onCaptainSend(content: string) {
    void stream.sendMessage(content);
    if (firstRun.step === "talk") {
      pendingQuizRef.current = true;
      void firstRun.advance("spoke_to_rho");
    }
  }

  function onArriveAtPin(id: string) {
    setSelectedPlace(id); setTravel(null);
    if (id === "wreck" && !firstRun.complete) {
      openWreckTalk();
    }
  }

  function callRho() {
    unlockRhoAudio();
    setMapOpen(false); setBoardOpen(false); setFocusOpen(false);
    setDialogueOpen(true);
    if (!stream.messages.length && !stream.streaming) void stream.sendMessage(HIDDEN_TURN.rhoCall);
  }

  async function handleLeave() {
    if (leaving) return;
    setLeaving(true);
    try {
      await fetch(`/api/session/${props.sessionId}/complete`, { method: "POST" });
    } catch {
      // best effort
    }
    router.push("/sessions");
  }

  useEffect(() => {
    const handler = () => {
      navigator.sendBeacon(`/api/session/${props.sessionId}/complete`, "{}");
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [props.sessionId]);

  const portrait: StillKey = stream.streaming
    ? "rhoPortraitThinking"
    : learning.quizResult && learning.quizResult.missed.length === 0
      ? "rhoPortraitEncouraging"
      : "rhoPortraitNeutral";

  if (firstRun.step === "video") {
    return (
      <div className="h-screen" style={layoutStyle} data-conversation={dockVisible} data-panel={Boolean(effectivePanel)} data-narrow={viewport.narrow} data-maximized={maximized && Boolean(effectivePanel)} data-testid="play-shell" data-ready={mapReady} inert={!mapReady} aria-busy={!mapReady}>
        <IntroCinematic onSkip={skipIntro} />
      </div>
    );
  }

  if (firstRun.step === "purpose") {
    return (
      <div className="h-screen" data-testid="play-shell" data-ready={mapReady} inert={!mapReady} aria-busy={!mapReady}>
        <LearningPurposeCard captain={captain} onContinue={() => void firstRun.advance("purpose_done")} />
      </div>
    );
  }

  const chrome = firstRun.chrome;
  const day0 = day0Checklist({
    firstRunStep: firstRun.step,
    wreckQuizDone: missions.wreckQuizDone,
    campFounded: missions.camp.founded,
    mathPlacementCode: missions.mathPlacementCode,
    mathPlacementStatus: missions.mathPlacementStatus,
  });
  const placementReady = hasSavedMathPlacement(
    missions.mathPlacementCode,
    missions.mathPlacementStatus
  );

  const dockVisible = dialogueOpen || Boolean(panel) || historyOpen;
  const workBusy = (panel === "quiz" && !learning.quiz?.alreadyCompleted && !learning.quizResult) || panel === "reflection";
  const canClosePanel = !workBusy;
  function closePanel() {
    if (panel === "quiz") learning.setShowQuiz(false);
    if (panel === "clip") setClipOffer(null);
    setPanel(null); setDialogueOpen(true); void missions.refresh(); void worldMap.refresh();
  }
  const effectivePanel = historyOpen ? "history" : panel;
  const workspaceWidth = maximized ? "100%" : effectivePanel && WORKSPACE_PANELS[effectivePanel].wide ? "max(660px, 65%)" : "max(460px, 40%)";
  const layoutStyle = { "--workspace-width": workspaceWidth, ...(viewport.height ? { height: viewport.height } : {}) } as CSSProperties;

  return (
    <div className="play-world relative h-dvh overflow-hidden bg-[#195563]" data-testid="play-shell" data-ready={mapReady} inert={!mapReady} aria-busy={!mapReady}>
      <div className="overworld-viewport" inert={viewport.narrow && Boolean(panel || historyOpen)} aria-hidden={maximized || undefined}>
      <OverworldCanvas
        paused={
          navigatingToMission ||
          Boolean(startingId) ||
          dockVisible ||
          learning.showQuiz ||
          learning.showReflection ||
          boardOpen ||
          focusOpen ||
          mathCheckOpen ||
          mapOpen ||
          confirmLeave ||
          Boolean(clip) || gardenOpen || gardenTeachOpen
        }
        world={worldMap.world}
        travel={travel}
        onArrive={onArriveAtPin}
        onSelect={(id) => {
          if (!firstRun.complete && id === "wreck") setTravel({ id, sequence: Date.now() });
          else setSelectedPlace(id);
        }}
        onPosition={setPosition}
      />
      </div>
      <ResourceHud
        captainName={captain}
        camp={missions.camp}
        xp={missions.xp}
        chapterProblem={CHAPTER_PROBLEM}
        checklist={day0AllDone(day0) ? null : day0}
        onOpenMathCheck={() => setMathCheckOpen(true)}
        hint={firstRun.coach ? null : hint}
        timerLabel={chrome.leave && showTimers ? formatHiddenMinutes(elapsedSeconds) : null}
      />
      {(navigatingToMission || Boolean(startingId)) && <div role="status" className="absolute inset-0 z-50 grid place-items-center bg-[#153e4b]/70">
        <p className="rounded-2xl bg-[#fff8e8] px-6 py-4 text-[#153e4b]">{hint ?? "Opening your job…"}</p>
      </div>}

      <header
        className={`world-toolbar pointer-events-none absolute right-3 top-3 z-20 flex flex-wrap items-center justify-end gap-2 ${dialogueOpen || focusOpen || mathCheckOpen || boardOpen || learning.showQuiz || learning.showReflection || Boolean(clip) ? "hidden" : ""}`}
      >
        {chrome.jobs && <button type="button" disabled={!mapReady} className="pointer-events-auto map-button primary" onClick={() => setMapOpen(true)}>Island map</button>}
        {chrome.subjectBadge && (
          <span className="rounded-full bg-[#1a120c]/80 px-3 py-1.5 text-xs text-amber-100/70">
            {subjectBadge(subjectSlug)}
          </span>
        )}
        {chrome.jobs && (
          <button
            type="button"
            onClick={() => setFocusOpen((open) => !open)}
            aria-expanded={focusOpen}
            className="pointer-events-auto rounded-full bg-amber-100 px-3 py-1.5 text-xs font-medium text-stone-900 hover:bg-amber-50"
          >
            Focus
          </button>
        )}
        {chrome.jobs && (
          <button
            type="button"
            onClick={() => setBoardOpen(true)}
            className="pointer-events-auto rounded-full bg-amber-700/90 px-3 py-1.5 text-xs text-amber-50 hover:bg-amber-600"
          >
            {campNeedsTitle(placementReady)}
          </button>
        )}
        {chrome.saga && (
          <Link
            href="/saga"
            className="pointer-events-auto rounded-full bg-[#1a120c]/80 px-3 py-1.5 text-xs text-amber-100 hover:bg-[#1a120c]"
          >
            Saga
          </Link>
        )}
        {chrome.leave && (
          <Link href="/settings" className="pointer-events-auto rounded-full bg-[#1a120c]/80 px-3 py-1.5 text-xs text-amber-100 hover:bg-[#1a120c]">
            Settings
          </Link>
        )}
        {chrome.leave && (
          <button
            type="button"
            onClick={() => {
              const next = !showTimers;
              setShowTimers(next);
              window.localStorage.setItem(TIMER_KEY, next ? "1" : "0");
            }}
            className="pointer-events-auto rounded-full bg-[#1a120c]/80 px-3 py-1.5 text-xs text-amber-100/70 hover:bg-[#1a120c]"
          >
            {showTimers ? "Hide time" : "Time"}
          </button>
        )}
        {chrome.progress && (
          <Link
            href="/progress"
            className="pointer-events-auto rounded-full bg-[#1a120c]/80 px-3 py-1.5 text-xs text-amber-100 hover:bg-[#1a120c]"
          >
            Progress
          </Link>
        )}
        {chrome.leave && (
          <button
            type="button"
            onClick={() => setConfirmLeave(true)}
            className="pointer-events-auto rounded-full bg-[#1a120c]/80 px-3 py-1.5 text-xs text-amber-100 hover:bg-[#1a120c]"
          >
            Leave
          </button>
        )}
      </header>

      {firstRun.complete && !dialogueOpen && !focusOpen && !boardOpen && !learning.showQuiz && !learning.showReflection && !clip && <WorldHud
        world={worldMap.world} selected={selectedNode} position={position} error={worldMap.error}
        travelTitle={travel ? selectedNode?.title : undefined}
        onMap={() => setMapOpen(true)} onAsk={askAboutPlace} onWalk={walkToPlace} onDismiss={() => setSelectedPlace(null)} />}


      {chrome.radio && !dockVisible && (
        <div className="pointer-events-none absolute bottom-4 left-3 z-20">
          <RhoRadio
            onCall={callRho}
            disabled={learning.showQuiz || learning.showReflection || Boolean(clip)}
          />
        </div>
      )}

      {firstRun.coach && !dockVisible && !learning.showQuiz && (
        <FirstRunCoach text={firstRun.coach} />
      )}

        <DialogueCutscene
          open={dockVisible} inert={viewport.narrow && Boolean(panel || historyOpen)}
          workBusy={workBusy} historyOpen={historyOpen} narrow={viewport.narrow} maximized={maximized}
          onHistory={() => setHistoryOpen((open) => !open)} onCloseHistory={() => setHistoryOpen(false)}
          onMaximize={() => setMaximized((value) => !value)}
          sessionId={props.sessionId}
          captainName={captain}
          messages={stream.messages}
          streaming={stream.streaming}
          thinkingLabel={stream.streaming ? "Rho is listening…" : ""}
          portrait={portrait}
          storyUi={stream.storyUi}
          captainChoices={stream.pendingCaptainChoices}
          onOpenMap={mapReady ? () => setMapOpen(true) : undefined}
          mapContext={selectedNode ? `${selectedNode.title} · ${selectedNode.tasks.filter((t) => !t.completed).length} ready to try` : worldMap.world?.chapterTitle}
          worldUpdate={stream.worldUpdate?.reason}
          onSend={onCaptainSend}
          onClose={() => { if (!workBusy) { setPanel(null); setHistoryOpen(false); setDialogueOpen(false); } }}
          onBranchResolved={(id) => router.push(`/learn/${id}`)}
        />

      {panel && <ContentWorkspace title={WORKSPACE_PANELS[panel].title} narrow={viewport.narrow} maximized={maximized}
        hidden={historyOpen} onMaximize={() => setMaximized((value) => !value)} onClose={canClosePanel ? closePanel : undefined}>
      {mapOpen && <WorldMapPanel world={worldMap.world} selectedId={selectedPlace} position={position}
        onSelect={setSelectedPlace} onClose={() => setMapOpen(false)} onWalk={walkToPlace} onAsk={askAboutPlace}
        onMission={(id) => void beginMission(id)} onActivity={(task) => void openMapActivity(task)}
        onFocus={() => { setMapOpen(false); setDialogueOpen(false); setFocusOpen(true); }}
        onSaveNote={worldMap.saveNote} error={worldMap.error ?? mapActionError} refreshing={worldMap.refreshing}
        onRefresh={() => { setMapActionError(null); void worldMap.refresh(); }} busy={activityBusy || Boolean(startingId)} conversationBusy={stream.streaming} />}
      {mathCheckOpen && (
        <MathFiveCheck
          sessionId={props.sessionId}
          onClose={() => {
            setMathCheckOpen(false);
            void missions.refresh();
          }}
        />
      )}

      {focusOpen && (
        <SubjectFocusPanel
          sessionId={props.sessionId}
          onClose={() => { setFocusOpen(false); void worldMap.refresh(); }}
          onSubjectChanged={setSubjectSlug}
          onTalk={() => {
            setFocusOpen(false); unlockRhoAudio(); setDialogueOpen(true);
            if (!stream.streaming) void stream.sendMessage(HIDDEN_TURN.subjectCheckReview);
          }}
          onOpenMathCheck={() => {
            setFocusOpen(false);
            setMathCheckOpen(true);
          }}
        />
      )}

      {clip && (
        <LearningClipPanel
          clip={clip}
          onClose={() => setClip(null)}
          onReflect={(note) => {
            const content = clipReflectionMessage(clip, note);
            setClip(null);
            unlockRhoAudio();
            setDialogueOpen(true);
            void stream.sendMessage(content);
          }}
        />
      )}

      {boardOpen && (
        <MissionBoard
          missions={campNeedsMissions(missions.missions, placementReady)}
          boardTitle={campNeedsTitle(placementReady)}
          chapterTitle={missions.activeChapterTitle}
          startingId={startingId}
          loading={!missions.loaded}
          error={missions.error}
          onRetry={() => void missions.refresh()}
          placementReady={placementReady}
          onMathCheck={() => { setBoardOpen(false); setDialogueOpen(false); setFocusOpen(false); setMathCheckOpen(true); }}
          onFocus={() => { setBoardOpen(false); setDialogueOpen(false); setFocusOpen(true); }}
          onClose={() => setBoardOpen(false)}
          onStart={(id) => void beginMission(id)}
        />
      )}

      {gardenTeachOpen && (
        <GardenTeachPanel
          onClose={() => setGardenTeachOpen(false)}
          onReadyToPlant={() => {
            void (async () => {
              try {
                await fetch("/api/garden", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ action: "teach_done" }),
                });
              } catch {
                /* still open beds */
              }
              setGardenTeachOpen(false);
              setGardenOpen(true);
            })();
          }}
        />
      )}

      {gardenOpen && (
        <GardenPlotPanel
          onClose={() => setGardenOpen(false)}
          onSaved={(passed) => {
            void worldMap.refresh();
            void missions.refresh();
            setHint(
              passed
                ? "Garden started on the map. Plants have what they need to grow."
                : "Garden saved. Adjust beds so plants get Sun, air, and fresh water."
            );
          }}
        />
      )}

      {panel === "quiz" && learning.showQuiz && learning.quiz && (
        <QuizOverlay
          quiz={learning.quiz}
          submitting={learning.quizSubmitting}
          result={learning.quizResult}
          error={learning.quizError}
          zpdStage={learning.zpdStage}
          onSubmit={(a) => void learning.submitQuiz(a)}
          onZpdAdvance={learning.advanceZpd}
          onReturnToMap={() => { learning.setShowQuiz(false); setMapOpen(true); }}
          onDismiss={() => {
            const wreck = learning.quiz?.slug === TUTORIAL_QUIZ_SLUG;
            learning.setShowQuiz(false);
            unlockRhoAudio();
            setDialogueOpen(true);
            setHint("The island is a little bigger than it looked.");
            void missions.refresh();
            void worldMap.refresh();
            if (wreck && firstRun.step === "work") {
              void firstRun.advance("work_done");
            }
          }}
        />
      )}

      {panel === "reflection" && learning.showReflection && learning.reflection && (
        <ReflectionOverlay
          reflection={learning.reflection}
          submitting={learning.reflectionSubmitting}
          error={learning.reflectionError}
          carriedForward={learning.carriedForward}
          onSubmit={(text) =>
            void learning.submitReflection(text).then(() => missions.refresh())
          }
          onContinue={learning.continueAfterHandoff}
        />
      )}

      </ContentWorkspace>}

      {stream.observationToasts.map((t) => (
        <div
          key={t.id}
          className="absolute bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-950"
        >
          Progress saved: {t.standardCode}
        </div>
      ))}

      {crewLogToast && (
        <div
          className="absolute bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-teal-50 px-3 py-2 text-xs text-teal-950"
          data-testid="crew-log-saved-toast"
        >
          {crewLogToast}
        </div>
      )}

      {isClientAiDebug() && (
        <AiDebugPanel
          turns={stream.aiDebugTurns}
          thinkingPhase={stream.aiThinkingPhase}
          streamError={stream.streamError}
        />
      )}

      {confirmLeave && (
        <div className="leave-confirmation absolute inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6">
            <h3 className="text-lg font-semibold">End this session?</h3>
            <p className="mt-2 text-sm text-stone-500">
              Primer will save your progress. Time on the beach is already recorded.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmLeave(false)}
                className="flex-1 rounded-xl border border-stone-200 py-2.5 text-sm"
              >
                Keep playing
              </button>
              <button
                type="button"
                onClick={() => void handleLeave()}
                disabled={leaving}
                className="flex-1 rounded-xl bg-stone-900 py-2.5 text-sm text-white"
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
