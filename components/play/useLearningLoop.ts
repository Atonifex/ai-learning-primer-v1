"use client";

import { useCallback, useEffect, useState } from "react";
import { HIDDEN_TURN } from "../../lib/play/hiddenTurns";
import type { ChapterReflectionPublic } from "../../lib/play/chapterReflection";
import type { TutorialQuizPublic } from "../../lib/play/tutorialQuiz";
import { WRECK_WORKED_EXAMPLE, nextZpdStage, type ZpdStage } from "../../lib/play/zpd";

type QuizResult = {
  score: number;
  total: number;
  correct: number;
  missed: string[];
  hints: string[];
  standardCodes?: string[];
};

export function useLearningLoop(
  sessionId: string,
  captain: string,
  sendMessage: (content: string) => Promise<void> | void
) {
  const [quizDone, setQuizDone] = useState(false);
  const [quiz, setQuiz] = useState<TutorialQuizPublic | null>(null);
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

  useEffect(() => {
    Promise.all([
      fetch(`/api/session/${sessionId}/tutorial-quiz`).then((r) => r.json()),
      fetch(`/api/session/${sessionId}/reflection`).then((r) => r.json()),
    ])
      .then(([quizData, reflectData]: [{ completed?: boolean }, { completed?: boolean }]) => {
        if (quizData.completed) setQuizDone(true);
        if (reflectData.completed) setReflectionDone(true);
      })
      .catch(() => undefined);
  }, [sessionId]);

  const openTutorialQuiz = useCallback(async () => {
    try {
      const res = await fetch(`/api/session/${sessionId}/tutorial-quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start" }),
      });
      const data = (await res.json()) as { quiz?: TutorialQuizPublic; error?: string };
      if (!res.ok || !data.quiz) throw new Error(data.error || "Quiz missing");
      if (data.quiz.alreadyCompleted) {
        setQuizDone(true);
        return { alreadyDone: true };
      }
      setQuiz(data.quiz);
      setQuizResult(null);
      setZpdStage(null);
      setShowQuiz(true);
      return { alreadyDone: false };
    } catch (e) {
      throw e instanceof Error ? e : new Error("Could not open the crate lid.");
    }
  }, [sessionId]);

  const submitQuiz = useCallback(
    async (answers: Array<{ itemId: string; selectedIndex: number }>) => {
      if (!quiz) return;
      setQuizSubmitting(true);
      setQuizError(null);
      try {
        const res = await fetch(`/api/session/${sessionId}/tutorial-quiz`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "submit",
            completionId: quiz.completionId,
            answers,
          }),
        });
        const data = (await res.json()) as { result?: QuizResult; error?: string };
        if (!res.ok || !data.result) throw new Error(data.error || "Submit failed");
        setQuizResult(data.result);
        setQuizDone(true);
        const next = nextZpdStage(null, data.result.missed.length);
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
    [captain, quiz, sendMessage, sessionId]
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
        const data = (await res.json()) as { result?: { text: string }; error?: string };
        if (!res.ok || !data.result) throw new Error(data.error || "Could not save");
        setReflectionDone(true);
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
    submitQuiz,
    advanceZpd,
    reflectionDone,
    reflection,
    showReflection,
    reflectionSubmitting,
    reflectionError,
    openReflection,
    submitReflection,
  };
}
