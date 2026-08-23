"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { PinId } from "../../lib/play/beachMap";
import { TUTORIAL_PINS } from "../../lib/play/beachMap";
import { HIDDEN_TURN } from "../../lib/play/hiddenTurns";
import type { TutorialQuizPublic } from "../../lib/play/tutorialQuiz";
import type { StillKey } from "../../lib/play/stills";
import IntroCinematic from "./IntroCinematic";
import ResourceHud from "./ResourceHud";
import RhoRadio from "./RhoRadio";
import DialogueCutscene from "./DialogueCutscene";
import QuizOverlay from "./QuizOverlay";
import { useSessionStream } from "./useSessionStream";

const OverworldCanvas = dynamic(() => import("./OverworldCanvas"), { ssr: false });

const INTRO_KEY = "primer.introSkipped";

export default function PlayShell(props: {
  sessionId: string;
  displayName: string;
  subjectSlug: string;
}) {
  const router = useRouter();
  const captain = props.displayName.trim() || "Captain";
  const [showIntro, setShowIntro] = useState(true);
  const [dialogueOpen, setDialogueOpen] = useState(false);
  const [talkedToWreck, setTalkedToWreck] = useState(false);
  const [quizDone, setQuizDone] = useState(false);
  const [quiz, setQuiz] = useState<TutorialQuizPublic | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<{
    score: number;
    total: number;
    correct: number;
    missed: string[];
    hints: string[];
  } | null>(null);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(
    "Tap the wreck — or use WASD. Rho follows you."
  );
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const pendingQuizRef = useRef(false);
  const wreckOpeningRef = useRef(false);

  const onTurnEnd = useCallback(() => {
    if (!pendingQuizRef.current) return;
    pendingQuizRef.current = false;
    void openTutorialQuiz();
  }, []);

  const stream = useSessionStream(props.sessionId, onTurnEnd);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(INTRO_KEY) === "1") setShowIntro(false);
  }, []);

  useEffect(() => {
    if (!stream.loaded) return;
    if (stream.messages.length > 0) {
      setTalkedToWreck(true);
      setShowIntro(false);
    }
  }, [stream.loaded, stream.messages.length]);

  useEffect(() => {
    fetch(`/api/session/${props.sessionId}/tutorial-quiz`)
      .then((r) => r.json())
      .then((d: { completed?: boolean }) => {
        if (d.completed) setQuizDone(true);
      })
      .catch(() => undefined);
  }, [props.sessionId]);

  async function openTutorialQuiz() {
    try {
      const res = await fetch(`/api/session/${props.sessionId}/tutorial-quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start" }),
      });
      const data = (await res.json()) as { quiz?: TutorialQuizPublic; error?: string };
      if (!res.ok || !data.quiz) throw new Error(data.error || "Quiz missing");
      if (data.quiz.alreadyCompleted) {
        setQuizDone(true);
        setHint("The wreck is counted. Other sites are open.");
        return;
      }
      setQuiz(data.quiz);
      setQuizResult(null);
      setShowQuiz(true);
    } catch (e) {
      setHint(e instanceof Error ? e.message : "Could not open the crate lid.");
    }
  }

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
        void openTutorialQuiz();
      }, 8000);
      return;
    }
    if (!quizDone && !showQuiz) void openTutorialQuiz();
  }

  function onArriveAtPin(id: PinId) {
    const pin = TUTORIAL_PINS.find((p) => p.id === id);
    if (!pin) return;
    if (id === "wreck") {
      openWreckTalk();
      return;
    }
    if (pin.lockedUntilQuiz && !quizDone) {
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

  async function submitQuiz(answers: Array<{ itemId: string; selectedIndex: number }>) {
    if (!quiz) return;
    setQuizSubmitting(true);
    setQuizError(null);
    try {
      const res = await fetch(`/api/session/${props.sessionId}/tutorial-quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit",
          completionId: quiz.completionId,
          answers,
        }),
      });
      const data = (await res.json()) as {
        result?: {
          score: number;
          total: number;
          correct: number;
          missed: string[];
          hints: string[];
        };
        error?: string;
      };
      if (!res.ok || !data.result) throw new Error(data.error || "Submit failed");
      setQuizResult(data.result);
      setQuizDone(true);
      const miss = data.result.missed.length
        ? `missed ${data.result.missed.join(", ")}`
        : "all correct";
      void stream.sendMessage(
        `${HIDDEN_TURN.quizResultPrefix} ${captain} scored ${data.result.correct}/${data.result.total} (${miss}).`
      );
    } catch (e) {
      setQuizError(e instanceof Error ? e.message : "Submit failed");
    } finally {
      setQuizSubmitting(false);
    }
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
    : quizResult && quizResult.missed.length === 0
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
        paused={dialogueOpen || showQuiz}
        quizDone={quizDone}
        talkedToWreck={talkedToWreck}
        onArriveAtPin={onArriveAtPin}
        onWanderFromWreck={onWander}
      />
      <ResourceHud captainName={captain} rations={3} xp={quizDone ? 12 : 0} hint={hint} />

      <header className="pointer-events-none absolute right-3 top-3 z-[60] flex items-center gap-2">
        <span className="rounded-full bg-[#1a120c]/80 px-3 py-1.5 text-xs text-amber-100/70">
          {props.subjectSlug.replace("_g3", "").replace("_", " ")}
        </span>
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
        <RhoRadio onCall={callRho} disabled={showQuiz} />
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

      {showQuiz && quiz && (
        <QuizOverlay
          quiz={quiz}
          submitting={quizSubmitting}
          result={quizResult}
          error={quizError}
          onSubmit={(a) => void submitQuiz(a)}
          onDismiss={() => {
            setShowQuiz(false);
            setDialogueOpen(true);
            setHint("The island is a little bigger than it looked.");
          }}
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
