/**
 * Whisper (and gpt-transcribe) sniff format from the *filename extension*.
 * Browser MediaRecorder may produce webm (Chrome) or mp4/m4a (Safari).
 * Naming everything ".webm" causes "Invalid file format" 400s.
 */

export function mimeBase(mime: string | undefined | null): string {
  return (mime ?? "").split(";")[0].trim().toLowerCase();
}

/** Map MediaRecorder / Blob MIME → Whisper-safe file extension. */
export function extensionForAudioMime(mime: string | undefined | null): string {
  const base = mimeBase(mime);
  if (base.includes("webm")) return "webm";
  if (base.includes("ogg")) return "ogg";
  if (base.includes("wav")) return "wav";
  if (base.includes("mpeg") || base === "audio/mp3") return "mp3";
  // Safari / some Edge builds: audio/mp4 or audio/aac → container Whisper accepts as m4a
  if (base.includes("mp4") || base.includes("m4a") || base.includes("aac")) return "m4a";
  return "webm";
}

export function speechFilenameForMime(mime: string | undefined | null): string {
  return `speech.${extensionForAudioMime(mime)}`;
}

export function pickRecorderMime(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;
  const types = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/aac"];
  return types.find((t) => MediaRecorder.isTypeSupported(t));
}
