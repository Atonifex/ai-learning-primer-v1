"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { prepareTtsText } from "../../lib/play/ttsText";
import { getRhoAudioContext, unlockRhoAudio } from "../../lib/play/rhoAudio";
import {
  RHO_AUTO_READ_KEY,
  rhoSpeechPlan,
  storedRhoAutoRead,
  type RhoSpeechMode,
} from "../../lib/play/rhoAutoRead";

const MUTE_KEY = "primer.rhoTtsMuted";
const devAutoReadOff = process.env.NODE_ENV === "development";

export function useRhoTts() {
  const [muted, setMutedState] = useState(false);
  const [autoRead, setAutoReadState] = useState(!devAutoReadOff);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [blocked, setBlocked] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const lastRef = useRef<{ text: string; id: string | null } | null>(null);
  const mutedRef = useRef(false);
  const autoReadRef = useRef(!devAutoReadOff);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    const src = sourceRef.current;
    if (src) {
      src.onended = null;
      try {
        src.stop();
      } catch {
        // already stopped
      }
      sourceRef.current = null;
    }
    setPlaying(false);
    setLoading(false);
    setPlayingId(null);
  }, []);

  useEffect(() => {
    mutedRef.current = window.localStorage.getItem(MUTE_KEY) === "1";
    autoReadRef.current = storedRhoAutoRead(
      window.localStorage.getItem(RHO_AUTO_READ_KEY),
      devAutoReadOff
    );
    setMutedState(mutedRef.current);
    setAutoReadState(autoReadRef.current);
    return () => stop();
  }, [stop]);

  const setMuted = useCallback(
    (next: boolean) => {
      mutedRef.current = next;
      setMutedState(next);
      window.localStorage.setItem(MUTE_KEY, next ? "1" : "0");
      if (next) stop();
    },
    [stop]
  );

  const setAutoRead = useCallback(
    (next: boolean) => {
      autoReadRef.current = next;
      setAutoReadState(next);
      window.localStorage.setItem(RHO_AUTO_READ_KEY, next ? "1" : "0");
      if (!next) stop();
    },
    [stop]
  );

  const playBuffer = useCallback(
    async (audioBuffer: AudioBuffer, id: string | null) => {
      const ctx = getRhoAudioContext();
      if (!ctx) {
        setBlocked(true);
        setPlaying(false);
        return;
      }
      if (ctx.state === "suspended") await ctx.resume();
      if (ctx.state !== "running") {
        setBlocked(true);
        setPlaying(false);
        return;
      }

      const existing = sourceRef.current;
      if (existing) {
        existing.onended = null;
        try {
          existing.stop();
        } catch {
          // already stopped
        }
        sourceRef.current = null;
      }

      const src = ctx.createBufferSource();
      src.buffer = audioBuffer;
      src.connect(ctx.destination);
      src.onended = () => {
        if (sourceRef.current !== src) return;
        sourceRef.current = null;
        setPlaying(false);
        setPlayingId(null);
      };
      sourceRef.current = src;
      setPlayingId(id);
      setPlaying(true);
      setBlocked(false);
      src.start();
    },
    []
  );

  const speak = useCallback(
    async (raw: string, id?: string, mode: RhoSpeechMode = "manual") => {
      const plan = rhoSpeechPlan({
        mode,
        autoRead: autoReadRef.current,
        muted: mutedRef.current,
      });
      if (plan === "skip") return;
      const text = prepareTtsText(raw);
      if (!text) return;

      stop();
      lastRef.current = { text: raw, id: id ?? null };
      unlockRhoAudio();

      const ac = new AbortController();
      abortRef.current = ac;
      setLoading(true);
      setPlayingId(id ?? null);
      setBlocked(false);

      try {
        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
          signal: ac.signal,
        });
        if (!res.ok) {
          if (!ac.signal.aborted) {
            setLoading(false);
            setPlayingId(null);
          }
          return;
        }
        const bytes = await res.arrayBuffer();
        if (ac.signal.aborted) return;

        const ctx = getRhoAudioContext();
        if (!ctx) {
          setLoading(false);
          setBlocked(true);
          return;
        }
        const audioBuffer = await ctx.decodeAudioData(bytes.slice(0));
        if (ac.signal.aborted) return;
        bufferRef.current = audioBuffer;
        setLoading(false);
        await playBuffer(audioBuffer, id ?? null);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setLoading(false);
        setPlaying(false);
        setPlayingId(null);
      }
    },
    [playBuffer, stop]
  );

  const replayLast = useCallback(() => {
    if (
      rhoSpeechPlan({ mode: "manual", autoRead: autoReadRef.current, muted: mutedRef.current }) ===
      "skip"
    ) {
      return;
    }
    unlockRhoAudio();
    const buf = bufferRef.current;
    if (buf) {
      void playBuffer(buf, lastRef.current?.id ?? null);
      return;
    }
    const last = lastRef.current;
    if (!last) return;
    void speak(last.text, last.id ?? undefined);
  }, [playBuffer, speak]);

  return {
    muted,
    setMuted,
    autoRead,
    setAutoRead,
    playing,
    loading,
    playingId,
    blocked,
    speak,
    stop,
    replayLast,
  };
}
