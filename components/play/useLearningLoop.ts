"use client";

import { useCallback, useEffect, useState } from "react";
import { HIDDEN_TURN } from "../../lib/play/hiddenTurns";
import type { ChapterReflectionPublic } from "../../lib/play/chapterReflection";
import type { OverlayQuizPublic } from "../../lib/play/overlayQuiz";
import { TUTORIAL_QUIZ_SLUG } from "../../lib/play/tutorialQuizSlug";
import { WRECK_WORKED_EXAMPLE, nextZpdStage, type ZpdStage } from "../../lib/play/zpd";
import type { GeneratedActivity } from "../../lib/types";

type QuizResult = {
  score: number;
  total: number;
  correct: number;
  missed: string[];
  hints: string[];
  standardCodes?: string[];
};

function generatedToOverlay(activity: GeneratedActivity): OverlayQuizPublic {
  return {
    id: activity.id,
    slug: `generated:${activity.id}`,
    standardCode: activity.standardCode,
    standardCodes: [activity.standardCode],
    title: activity.title,
    instructions: activity.instructions,
    items: activity.items,
    hints: [],
    completionId: activity.id,
    alreadyCompleted: false,
    priorScore: null,
    source: "generated",
  };
}

export function useLearningLoop(
  sessionId: string,
  captain: string,
  sendMessage: (content: string) => Promise<void> | void
) {
  const [quizDone, setQuizDone] = useState(false);
  const [quiz, setQuiz] = useState<OverlayQuizPublic | null>(null);
  const [generatedSessionId, setGeneratedSessionId] = useState(sessionId);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizSubmitting, setQuizSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [zpdStage, setZpdStage] = useState<ZpdStage | null>(null);

  const [reflectionDone, setReflectionDone] = useState(false);
  const [reflection, setReflection] = useState<ChapterReflectionPublic | null>(null);
  const [showReflection, setShowReflection] = useState(false);
  const [reflectionSubmitting, setReflectionSubmitting] = useState(false);
  const [reflectionError, setReflectionError] = useState<string | null>(null);
  const [carriedForward, setCarriedForward] = useState<string | null>(null);
  const [savedCrewNote, setSavedCrewNote] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/session/${sessionId}/overlay-quiz?slug=${TUTORIAL_QUIZ_SLUG}`).then((r) =>
        r.json()
      ),
      fetch(`/api/session/${sessionId}/reflection`).then((r) => r.json()),
    ])
      .then(([quizData, reflectData]: [{ completed?: boolean }, { completed?: boolean }]) => {
        if (quizData.completed) setQuizDone(true);
        if (reflectData.completed) setReflectionDone(true);
      })
      .catch(() => undefined);
  }, [sessionId]);

  const openOverlayQuiz = useCallback(async (slug: string) => {
    try {
      const res = await fetch(`/api/session/${sessionId}/overlay-quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start", slug }),
      });
      const data = (await res.json()) as { quiz?: OverlayQuizPublic; error?: string };
      if (!res.ok || !data.quiz) throw new Error(data.error || "Quiz missing");
      if (data.quiz.alreadyCompleted) {
        if (slug === TUTORIAL_QUIZ_SLUG) setQuizDone(true);
      }
      setQuiz(data.quiz);
      setQuizResult(null);
      setQuizError(null);
      setZpdStage(null);
      setShowQuiz(true);
      return { alreadyDone: data.quiz.alreadyCompleted, slug };
    } catch (e) {
      throw e instanceof Error ? e : new Error("Could not open the crate lid.");
    }
  }, [sessionId]);

  const openTutorialQuiz = useCallback(
    () => openOverlayQuiz(TUTORIAL_QUIZ_SLUG),
    [openOverlayQuiz]
  );

  const openGeneratedQuiz = useCallback((activity: GeneratedActivity, sourceSessionId?: string) => {
    setGeneratedSessionId(sourceSessionId ?? sessionId);
    setQuiz(generatedToOverlay(activity));
    setQuizResult(null);
    setZpdStage(null);
    setShowQuiz(true);
  }, [sessionId]);

  const submitQuiz = useCallback(
    async (answers: Array<{ itemId: string; selectedIndex: number }>) => {
      if (!quiz || quiz.alreadyCompleted) return;
      setQuizSubmitting(true);
      setQuizError(null);
      try {
        if (quiz.source === "generated") {
          const res = await fetch(
            `/api/session/${generatedSessionId}/activity/${quiz.id}/submit`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ answers }),
            }
          );
          const data = (await res.json()) as {
            result?: { score: number; total: number; correct: number };
            error?: string;
          };
          if (!res.ok || !data.result) throw new Error(data.error || "Submit failed");
          const result: QuizResult = {
            score: data.result.score,
            total: data.result.total,
            correct: data.result.correct,
            missed: [],
            hints: [],
            standardCodes: quiz.standardCodes,
          };
          setQuizResult(result);
          void sendMessage(
            `${HIDDEN_TURN.quizResultPrefix} ${captain} scored ${result.correct}/${result.total} on ${quiz.standardCode}.`
          );
          return;
        }

        const res = await fetch(`/api/session/${sessionId}/overlay-quiz`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "submit",
            slug: quiz.slug,
            completionId: quiz.completionId,
            answers,
          }),
        });
        const data = (await res.json()) as { result?: QuizResult; error?: string };
        if (!res.ok || !data.result) throw new Error(data.error || "Submit failed");
        setQuizResult(data.result);
        if (quiz.slug === TUTORIAL_QUIZ_SLUG) setQuizDone(true);
        const useZpd = quiz.slug === TUTORIAL_QUIZ_SLUG;
        const next = useZpd ? nextZpdStage(null, data.result.missed.length) : "done";
        setZpdStage(next);
        const miss = data.result.missed.length
          ? `missed ${data.result.missed.join(", ")}`
          : "all correct";
        const codes = data.result.standardCodes?.join(", ") ?? quiz.standardCode;
        void sendMessage(
          `${HIDDEN_TURN.quizResultPrefix} ${captain} scored ${data.result.correct}/${data.result.total} (${miss}) on ${codes}.`
        );
        if (next === "hint") {
          void sendMessage(
            `${HIDDEN_TURN.zpdHintPrefix} ${captain} missed crate lids. Give one place-value hint.`
          );
        }
      } catch (e) {
        setQuizError(e instanceof Error ? e.message : "Submit failed");
      } finally {
        setQuizSubmitting(false);
      }
    },
    [captain, quiz, sendMessage, sessionId, generatedSessionId]
  );

  const advanceZpd = useCallback(() => {
    const missed = quizResult?.missed.length ?? 0;
    const next = nextZpdStage(zpdStage, missed);
    setZpdStage(next);
    if (next === "example") {
      void sendMessage(
        `${HIDDEN_TURN.zpdExamplePrefix} Walk crate ${WRECK_WORKED_EXAMPLE.standardForm} as ${WRECK_WORKED_EXAMPLE.expandedForm}.`
      );
    } else if (next === "fade") {
      void sendMessage(`${HIDDEN_TURN.zpdFadePrefix} ${WRECK_WORKED_EXAMPLE.fadePrompt}`);
    }
  }, [quizResult, sendMessage, zpdStage]);

  const openReflection = useCallback(async () => {
    if (reflectionDone) return;
    try {
      const res = await fetch(`/api/session/${sessionId}/reflection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start" }),
      });
      const data = (await res.json()) as {
        reflection?: ChapterReflectionPublic;
        error?: string;
      };
      if (!res.ok || !data.reflection) throw new Error(data.error || "Crew log missing");
      if (data.reflection.alreadyCompleted) {
        setReflectionDone(true);
        return;
      }
      setReflection(data.reflection);
      setShowReflection(true);
    } catch {
      setReflectionError("Could not open the crew log.");
    }
  }, [reflectionDone, sessionId]);

  const submitReflection = useCallback(
    async (text: string) => {
      if (!reflection) return;
      setReflectionSubmitting(true);
      setReflectionError(null);
      try {
        const res = await fetch(`/api/session/${sessionId}/reflection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "submit",
            completionId: reflection.completionId,
            text,
          }),
        });
        const data = (await res.json()) as {
          result?: { text: string; handoffSummary?: string | null };
          error?: string;
        };
        if (!res.ok || !data.result) throw new Error(data.error || "Could not save");
        setReflectionDone(true);
        if (data.result.handoffSummary) {
          setSavedCrewNote(data.result.text);
          setCarriedForward(data.result.handoffSummary);
          return;
        }
        setShowReflection(false);
        void sendMessage(`${HIDDEN_TURN.reflectionPrefix} ${data.result.text}`);
      } catch (e) {
        setReflectionError(e instanceof Error ? e.message : "Could not save");
      } finally {
        setReflectionSubmitting(false);
      }
    },
    [reflection, sendMessage, sessionId]
  );

  const continueAfterHandoff = useCallback(() => {
    const note = savedCrewNote;
    setShowReflection(false);
    setCarriedForward(null);
    setSavedCrewNote(null);
    if (!note) return;
    void sendMessage(`${HIDDEN_TURN.reflectionPrefix} ${note}`);
  }, [savedCrewNote, sendMessage]);

  const markReflectionDoneFromTool = useCallback((text: string, _handoffSummary: string | null) => {
    setReflectionDone(true);
    setShowReflection(false);
    setCarriedForward(null);
    setSavedCrewNote(null);
    void text;
  }, []);

  return {
    quizDone,
    quiz,
    showQuiz,
    setShowQuiz,
    quizSubmitting,
    quizResult,
    quizError,
    zpdStage,
    openTutorialQuiz,
    openOverlayQuiz,
    openGeneratedQuiz,
    submitQuiz,
    advanceZpd,
    reflectionDone,
    reflection,
    showReflection,
    reflectionSubmitting,
    reflectionError,
    carriedForward,
    openReflection,
    submitReflection,
    continueAfterHandoff,
    markReflectionDoneFromTool,
  };
}
