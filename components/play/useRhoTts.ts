"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { prepareTtsText } from "../../lib/play/ttsText";
import { getRhoAudioContext, unlockRhoAudio } from "../../lib/play/rhoAudio";

const MUTE_KEY = "primer.rhoTtsMuted";

export function useRhoTts() {
  const [muted, setMutedState] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [blocked, setBlocked] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const lastRef = useRef<{ text: string; id: string | null } | null>(null);
  const mutedRef = useRef(false);

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
    setMutedState(mutedRef.current);
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
    async (raw: string, id?: string) => {
      if (mutedRef.current) return;
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
    if (mutedRef.current) return;
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
    playing,
    loading,
    playingId,
    blocked,
    speak,
    stop,
    replayLast,
  };
}
