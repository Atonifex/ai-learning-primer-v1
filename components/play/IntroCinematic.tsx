"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EMPTY_INTRO_DEAL, INTRO_MEDIA_ROOT, introChoices, introMedia, introOffer, parseIntroDeal, type IntroDeal, type IntroEvent } from "../../lib/play/introDeal";
import SafeStill from "./SafeStill";

export default function IntroCinematic(props: { onSkip: () => void }) {
  const [deal, setDeal] = useState<IntroDeal>(EMPTY_INTRO_DEAL);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [videoFailed, setVideoFailed] = useState(false);
  const [muted, setMuted] = useState(true);
  const [captions, setCaptions] = useState(true);
  const [paused, setPaused] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const saving = useRef(false);
  const retryEvent = useRef<IntroEvent | null>(null);
  const media = introMedia(deal.phase);
  const choices = introChoices(deal.phase);

  const load = useCallback(async () => {
    setError("");
    try {
      const res = await fetch("/api/profile/intro", { cache: "no-store" });
      if (!res.ok) throw new Error("The intro could not load. Please try again.");
      const data = await res.json();
      setDeal(parseIntroDeal(data.deal)); setLoaded(true);
    } catch (err) { setError(err instanceof Error ? err.message : "Please try again."); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    const player = video.current;
    if (!player) return;
    for (const track of player.textTracks) track.mode = captions && !media.loop ? "showing" : "hidden";
  }, [captions, media.id, media.loop]);

  async function advance(event: IntroEvent) {
    if (saving.current) return;
    saving.current = true; retryEvent.current = event; setBusy(true); setError("");
    try {
      const res = await fetch("/api/profile/intro", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Your choice could not be saved. Please try again.");
      setDeal(parseIntroDeal(data.deal)); setVideoFailed(false); setPaused(false); retryEvent.current = null;
    } catch (err) { setError(err instanceof Error ? err.message : "Please try again."); }
    finally { saving.current = false; setBusy(false); }
  }
  function toggleSound() {
    const next = !muted; setMuted(next);
    if (video.current) { video.current.muted = next || media.loop; if (!paused) void video.current.play().catch(() => setPaused(true)); }
  }
  function togglePause() {
    if (!video.current) return;
    if (paused) void video.current.play().then(() => setPaused(false)).catch(() => setError("Press Play to keep watching."));
    else { video.current.pause(); setPaused(true); }
  }
  return (
    <div className="relative flex h-full min-h-0 w-full flex-col bg-[#071820] text-amber-50" data-intro-phase={deal.phase}>
      <div className="relative min-h-0 flex-1">
        {deal.phase === "complete" ? (
          <>
            <SafeStill still="crashAftermathBeach" alt="Dawn on the beach after the crew escapes the storm." />
            <div className="absolute inset-x-0 bottom-12 bg-[#071820]/90 p-6 text-center">
              <p className="text-xl">The storm hits. You and your crew escape. At dawn, you reach the beach.</p>
              <button type="button" onClick={props.onSkip} className="mt-5 rounded-full bg-amber-200 px-7 py-3 font-semibold text-slate-950">Go to the beach</button>
            </div>
          </>
        ) : !loaded ? (
          <div className="flex h-full items-center justify-center">Getting your ship ready…</div>
        ) : (
          <>
            {videoFailed ? (
              <div className="relative h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="h-full w-full object-contain" src={`${INTRO_MEDIA_ROOT}/references/${deal.phase === "continuation" ? "rho-handshake" : "briefing-anchor"}.png`} alt="Your crew is ready for the island trip." />
                {!media.loop && <button type="button" onClick={() => void advance("ended")} disabled={busy} className="absolute left-1/2 top-1/2 -translate-x-1/2 rounded-full bg-amber-200 px-6 py-3 text-slate-950">Continue</button>}
              </div>
            ) : (
              <video key={media.id} ref={video} className="h-full w-full object-contain" src={media.src} autoPlay muted={muted || media.loop} playsInline loop={media.loop} preload="auto" poster={`${INTRO_MEDIA_ROOT}/references/briefing-anchor.png`} onError={() => setVideoFailed(true)} onEnded={() => { if (!media.loop) void advance("ended"); }} onPlay={() => setPaused(false)} onLoadedData={() => { if (video.current && !paused) void video.current.play().catch(() => setPaused(true)); }} aria-label={media.loop ? "Officer waits for your choice" : "Your island mission"}>
                {!media.loop && <track kind="captions" src={media.captions} srcLang="en" label="English" default={captions} />}
              </video>
            )}
            {choices.length > 0 && (
              <div className="absolute inset-x-0 bottom-7 flex flex-col items-center gap-3 px-4" role="group" aria-label="Make a deal">
                <p className="rounded-xl bg-[#071820]/90 px-5 py-2 text-center">Your share: {introOffer(deal.phase)}% of the profit{deal.phase === "offer20" ? " — last offer" : ""}</p>
                <div className="flex gap-4">
                  {choices.map((choice) => <button key={choice} type="button" onClick={() => void advance(choice)} disabled={busy} className="min-w-28 rounded-full border-2 border-amber-200 bg-amber-50 px-8 py-4 text-xl font-bold text-slate-950 shadow-lg focus-visible:outline-4 focus-visible:outline-teal-300 disabled:opacity-50">{choice === "yes" ? "Yes" : "No"}</button>)}
                </div>
              </div>
            )}
          </>
        )}
        {error && <div role="alert" className="absolute inset-x-4 top-4 rounded-xl bg-slate-950/95 p-4 text-center">{error} <button type="button" className="underline" onClick={() => { if (!loaded) void load(); else if (retryEvent.current) void advance(retryEvent.current); else setError(""); }}>Try again</button></div>}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 px-4 py-4">
        {loaded && deal.phase !== "complete" && <>
          <button type="button" onClick={toggleSound} aria-pressed={!muted} className="rounded-full border border-teal-100/40 px-4 py-2">{muted ? "Sound on" : "Sound off"}</button>
          <button type="button" onClick={() => setCaptions(!captions)} aria-pressed={captions} className="rounded-full border border-teal-100/40 px-4 py-2">{captions ? "Captions off" : "Captions on"}</button>
          {!media.loop && !videoFailed && <button type="button" onClick={togglePause} className="rounded-full border border-teal-100/40 px-4 py-2">{paused ? "Play" : "Pause"}</button>}
        </>}
        <button type="button" onClick={props.onSkip} disabled={busy} className="rounded-full border border-amber-200/40 px-6 py-2 font-semibold">Skip — wake on the beach</button>
      </div>
    </div>
  );
}
