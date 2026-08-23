"use client";

import { useRef, useState } from "react";

function pickRecorderMime(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;
  const types = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  return types.find((t) => MediaRecorder.isTypeSupported(t));
}

export default function MicButton(props: {
  disabled?: boolean;
  onTranscript: (text: string) => void;
}) {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function releaseStream() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  async function finish(blob: Blob) {
    setBusy(true);
    try {
      if (blob.size < 200) {
        setError("I didn’t catch that — try again, or type a little.");
        return;
      }
      const form = new FormData();
      form.append("audio", blob, "speech.webm");
      const res = await fetch("/api/stt", { method: "POST", body: form });
      const data = (await res.json()) as { text?: string; error?: string };
      if (!res.ok) {
        setError(data.error || "Could not hear that — type a little.");
        return;
      }
      const text = data.text?.trim() ?? "";
      if (!text) {
        setError("I didn’t catch words — try the mic again, or type.");
        return;
      }
      setError(null);
      props.onTranscript(text);
    } catch {
      setError("Could not hear that — type a little.");
    } finally {
      setBusy(false);
    }
  }

  async function startRecording() {
    if (props.disabled || busy || recording) return;
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Mic isn’t available here — type a little instead.");
      return;
    }
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setError("Mic needs permission — you can type a little.");
      return;
    }
    streamRef.current = stream;
    const mime = pickRecorderMime();
    const recorder = mime
      ? new MediaRecorder(stream, { mimeType: mime })
      : new MediaRecorder(stream);
    recorderRef.current = recorder;
    chunksRef.current = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, {
        type: recorder.mimeType || "audio/webm",
      });
      releaseStream();
      setRecording(false);
      void finish(blob);
    };
    recorder.start();
    setRecording(true);
    timerRef.current = window.setTimeout(() => {
      if (recorder.state === "recording") recorder.stop();
    }, 20000);
  }

  function handleClick() {
    if (recording) {
      if (recorderRef.current?.state === "recording") recorderRef.current.stop();
      return;
    }
    void startRecording();
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={props.disabled || busy}
        aria-pressed={recording}
        aria-label={recording ? "Stop recording" : "Speak"}
        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 ${
          recording
            ? "border-red-400 bg-red-600 text-white"
            : "border-stone-200 bg-stone-50 text-stone-700 hover:bg-amber-50"
        }`}
      >
        {recording ? (
          <span className="h-3 w-3 rounded-sm bg-white" />
        ) : (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2Z" />
          </svg>
        )}
      </button>
      {error && (
        <p className="max-w-[10rem] text-center text-[10px] leading-tight text-amber-800">
          {error}
        </p>
      )}
    </div>
  );
}
