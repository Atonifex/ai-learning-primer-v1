"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { PinId } from "../../lib/play/beachMap";
import { TUTORIAL_PINS } from "../../lib/play/beachMap";
import { HIDDEN_TURN } from "../../lib/play/hiddenTurns";
import type { StillKey } from "../../lib/play/stills";
import { formatHiddenMinutes, secondsBetween } from "../../lib/services/timeMath";
import IntroCinematic from "./IntroCinematic";
import ResourceHud from "./ResourceHud";
import RhoRadio from "./RhoRadio";
import DialogueCutscene from "./DialogueCutscene";
import QuizOverlay from "./QuizOverlay";
import ReflectionOverlay from "./ReflectionOverlay";
import { useSessionStream } from "./useSessionStream";
import { useLearningLoop } from "./useLearningLoop";

const OverworldCanvas = dynamic(() => import("./OverworldCanvas"), { ssr: false });

const INTRO_KEY = "primer.introSkipped";
const TIMER_KEY = "primer.showTimers";

export default function PlayShell(props: {
  sessionId: string;
  displayName: string;
  subjectSlug: string;
  sessionStartedAt: string;
}) {
  const router = useRouter();
  const captain = props.displayName.trim() || "Captain";
  const [showIntro, setShowIntro] = useState(true);
  const [dialogueOpen, setDialogueOpen] = useState(false);
  const [talkedToWreck, setTalkedToWreck] = useState(false);
  const [hint, setHint] = useState<string | null>(
    "Tap the wreck — or use WASD. Rho follows you."
  );
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [showTimers, setShowTimers] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const pendingQuizRef = useRef(false);
  const wreckOpeningRef = useRef(false);
  const openQuizRef = useRef<(() => Promise<{ alreadyDone: boolean } | undefined>) | null>(null);

  const onTurnEnd = useCallback(() => {
    if (!pendingQuizRef.current) return;
    pendingQuizRef.current = false;
    void openQuizRef.current?.().then((r) => {
      if (r?.alreadyDone) setHint("The wreck is counted. Other sites are open.");
    }).catch((e: unknown) => {
      setHint(e instanceof Error ? e.message : "Could not open the crate lid.");
    });
  }, []);

  const stream = useSessionStream(props.sessionId, onTurnEnd);
  const learning = useLearningLoop(props.sessionId, captain, stream.sendMessage);
  openQuizRef.current = learning.openTutorialQuiz;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(INTRO_KEY) === "1") setShowIntro(false);
    setShowTimers(window.localStorage.getItem(TIMER_KEY) === "1");
  }, []);

  useEffect(() => {
    const tick = () => {
      setElapsedSeconds(
        secondsBetween(new Date(props.sessionStartedAt), new Date())
      );
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
      setShowIntro(false);
    }
  }, [stream.loaded, stream.messages.length]);

  function skipIntro() {
    window.localStorage.setItem(INTRO_KEY, "1");
    setShowIntro(false);
  }

  function openWreckTalk() {
    setDialogueOpen(true);
    setHint(null);
    if (!talkedToWreck && !wreckOpeningRef.current) {
      wreckOpeningRef.current = true;
      setTalkedToWreck(true);
      pendingQuizRef.current = true;
      void stream.sendMessage(HIDDEN_TURN.wreckApproach);
      window.setTimeout(() => {
        if (!pendingQuizRef.current) return;
        pendingQuizRef.current = false;
        void learning.openTutorialQuiz().catch((e: unknown) => {
          setHint(e instanceof Error ? e.message : "Could not open the crate lid.");
        });
      }, 8000);
      return;
    }
    if (!learning.quizDone && !learning.showQuiz) {
      void learning.openTutorialQuiz().catch((e: unknown) => {
        setHint(e instanceof Error ? e.message : "Could not open the crate lid.");
      });
      return;
    }
    if (learning.quizDone && !learning.reflectionDone) {
      void learning.openReflection();
    }
  }

  function onArriveAtPin(id: PinId) {
    const pin = TUTORIAL_PINS.find((p) => p.id === id);
    if (!pin) return;
    if (id === "wreck") {
      openWreckTalk();
      return;
    }
    if (pin.lockedUntilQuiz && !learning.quizDone) {
      setHint("Rho: Salvage the wreck first, Captain. The rest can wait.");
      return;
    }
    setHint(`Rho: ${pin.label} is marked. We can look closer later.`);
  }

  function onWander() {
    if (talkedToWreck || dialogueOpen) return;
    setDialogueOpen(true);
    setHint("Rho is calling.");
    void stream.sendMessage(HIDDEN_TURN.rhoWander);
  }

  function callRho() {
    setDialogueOpen(true);
    void stream.sendMessage(HIDDEN_TURN.rhoCall);
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

  if (showIntro) {
    return (
      <div className="h-screen">
        <IntroCinematic onSkip={skipIntro} />
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden bg-[#0a3340]">
      <OverworldCanvas
        paused={dialogueOpen || learning.showQuiz || learning.showReflection}
        quizDone={learning.quizDone}
        talkedToWreck={talkedToWreck}
        onArriveAtPin={onArriveAtPin}
        onWanderFromWreck={onWander}
      />
      <ResourceHud
        captainName={captain}
        rations={3}
        xp={learning.quizDone ? 12 : 0}
        hint={hint}
        timerLabel={showTimers ? formatHiddenMinutes(elapsedSeconds) : null}
      />

      <header className="pointer-events-none absolute right-3 top-3 z-[60] flex items-center gap-2">
        <span className="rounded-full bg-[#1a120c]/80 px-3 py-1.5 text-xs text-amber-100/70">
          {props.subjectSlug.replace("_g3", "").replace("_", " ")}
        </span>
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
        <Link
          href="/progress"
          className="pointer-events-auto rounded-full bg-[#1a120c]/80 px-3 py-1.5 text-xs text-amber-100 hover:bg-[#1a120c]"
        >
          Progress
        </Link>
        <button
          type="button"
          onClick={() => setConfirmLeave(true)}
          className="pointer-events-auto rounded-full bg-[#1a120c]/80 px-3 py-1.5 text-xs text-amber-100 hover:bg-[#1a120c]"
        >
          Leave
        </button>
      </header>

      <div className="pointer-events-none absolute bottom-4 left-3 z-20">
        <RhoRadio onCall={callRho} disabled={learning.showQuiz || learning.showReflection} />
      </div>

      {dialogueOpen && (
        <DialogueCutscene
          sessionId={props.sessionId}
          captainName={captain}
          messages={stream.messages}
          streaming={stream.streaming}
          thinkingLabel={stream.streaming ? "Rho is listening…" : ""}
          portrait={portrait}
          storyUi={stream.storyUi}
          onSend={stream.sendMessage}
          onClose={() => setDialogueOpen(false)}
          onBranchResolved={(id) => router.push(`/learn/${id}`)}
        />
      )}

      {learning.showQuiz && learning.quiz && (
        <QuizOverlay
          quiz={learning.quiz}
          submitting={learning.quizSubmitting}
          result={learning.quizResult}
          error={learning.quizError}
          zpdStage={learning.zpdStage}
          onSubmit={(a) => void learning.submitQuiz(a)}
          onZpdAdvance={learning.advanceZpd}
          onDismiss={() => {
            learning.setShowQuiz(false);
            setDialogueOpen(true);
            setHint("The island is a little bigger than it looked.");
            if (!learning.reflectionDone) void learning.openReflection();
          }}
        />
      )}

      {learning.showReflection && learning.reflection && (
        <ReflectionOverlay
          reflection={learning.reflection}
          submitting={learning.reflectionSubmitting}
          error={learning.reflectionError}
          onSubmit={(text) => void learning.submitReflection(text)}
        />
      )}

      {stream.observationToasts.map((t) => (
        <div
          key={t.id}
          className="absolute bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-950"
        >
          Progress saved: {t.standardCode}
        </div>
      ))}

      {confirmLeave && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
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
