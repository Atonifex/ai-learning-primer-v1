let ctx: AudioContext | null = null;

function AudioCtx(): typeof AudioContext | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & { webkitAudioContext?: typeof AudioContext };
  return window.AudioContext ?? w.webkitAudioContext ?? null;
}

/** Call from a tap that opens dialogue so later TTS is allowed to play. */
export function unlockRhoAudio(): AudioContext | null {
  const Ctor = AudioCtx();
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function getRhoAudioContext(): AudioContext | null {
  return unlockRhoAudio();
}
