"use client";

import ActivitySurface from "./ActivitySurface";

import { useEffect, useState } from "react";
import MicButton from "./MicButton";
import {
  learningClipEmbedUrl,
  type LearningClipOffer,
} from "../../lib/play/learningClip";

type Stage = "brief" | "watch" | "reflect";

type YtPlayer = { destroy: () => void };

function attachEndListener(iframeId: string, onEnded: () => void): (() => void) | null {
  const yt = (window as unknown as { YT?: { Player: new (id: string, opts: object) => YtPlayer } })
    .YT;
  if (!yt?.Player) return null;
  const player = new yt.Player(iframeId, {
    events: {
      onStateChange: (event: { data: number }) => {
        if (event.data === 0) onEnded();
      },
    },
  });
  return () => player.destroy();
}

export default function LearningClipPanel(props: {
  clip: LearningClipOffer;
  onClose: () => void;
  onReflect: (note: string) => void;
}) {
  const [stage, setStage] = useState<Stage>("brief");
  const [note, setNote] = useState("");
  const [origin, setOrigin] = useState<string | undefined>(undefined);
  const embedUrl = learningClipEmbedUrl(props.clip.videoId, origin);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (stage !== "watch") return;
    let detach: (() => void) | null = null;
    let cancelled = false;
    const onEnded = () => {
      if (!cancelled) setStage("reflect");
    };
    const tryAttach = () => {
      if (cancelled) return;
      detach = attachEndListener("learning-clip-player", onEnded);
    };
    const w = window as unknown as { onYouTubeIframeAPIReady?: () => void };
    if ((window as unknown as { YT?: { Player?: unknown } }).YT?.Player) {
      tryAttach();
    } else {
      const previous = w.onYouTubeIframeAPIReady;
      w.onYouTubeIframeAPIReady = () => {
        previous?.();
        tryAttach();
      };
      if (!document.querySelector("script[data-primer-yt-iframe]")) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.dataset.primerYtIframe = "1";
        document.body.appendChild(script);
      }
    }
    return () => {
      cancelled = true;
      detach?.();
    };
  }, [stage]);

  return (
    <ActivitySurface
      className="absolute inset-0 z-[70] flex items-center justify-center bg-[#0a3340]/85 p-3"
      role="dialog"
      aria-labelledby="learning-clip-title"
    >
      <div className="flex max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-2xl border-4 border-amber-800/80 bg-[#3d2914] shadow-2xl">
        <div className="flex items-start justify-between gap-3 bg-[#5c4033] px-4 py-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-200/90">
              One clip
            </p>
            <h2 id="learning-clip-title" className="text-lg font-semibold text-amber-50">
              One clip for the mission
            </h2>
          </div>
          {stage === "brief" && (
            <button
              type="button"
              onClick={props.onClose}
              className="rounded-lg px-2 py-1 text-xs text-amber-100/80 hover:bg-amber-900/40"
            >
              Not now
            </button>
          )}
        </div>

        <div className="overflow-y-auto bg-[#f6f1e7] px-4 py-4 text-stone-900">
          {stage === "brief" && (
            <>
              <p className="text-sm">
                Rho found one clip for this: {props.clip.missionPrompt}
              </p>
              <p className="mt-2 text-sm font-medium">
                {props.clip.title}{" "}
                <span className="font-normal text-stone-600">· {props.clip.channelTitle}</span>
              </p>
              <p className="mt-3 text-xs text-stone-600">
                Hold these while you watch. This stays on this one clip.
              </p>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
                {props.clip.questions.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ol>
              <button
                type="button"
                onClick={() => setStage("watch")}
                disabled={!embedUrl}
                className="mt-4 rounded-lg bg-amber-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                Watch this clip
              </button>
            </>
          )}

          {stage === "watch" && embedUrl && (
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_14rem]">
              <iframe
                id="learning-clip-player"
                title={props.clip.title}
                src={embedUrl}
                className="aspect-video w-full rounded-lg bg-black"
                allow="encrypted-media; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
                  Hold these
                </p>
                <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm">
                  {props.clip.questions.map((question) => (
                    <li key={question}>{question}</li>
                  ))}
                </ol>
                <button
                  type="button"
                  onClick={() => setStage("reflect")}
                  className="mt-4 rounded-lg bg-amber-800 px-4 py-2 text-sm font-medium text-white"
                >
                  I&apos;ve seen enough
                </button>
              </div>
            </div>
          )}

          {stage === "reflect" && (
            <>
              <p className="text-sm">
                The clip is closed. What helps with this: {props.clip.missionPrompt}
              </p>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-stone-700">
                {props.clip.questions.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ol>
              <div className="mt-3 flex items-end gap-2">
                <MicButton
                  onTranscript={(spoken) =>
                    setNote((prev) => (prev.trim() ? `${prev.trim()} ${spoken}` : spoken))
                  }
                />
                <textarea
                  aria-label="What helps the mission?"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  rows={3}
                  placeholder="What can the camp use from that clip?"
                  className="min-h-[5.5rem] flex-1 resize-none rounded-xl border border-amber-900/20 bg-white px-3 py-2 text-sm"
                />
              </div>
              <button
                type="button"
                onClick={() => props.onReflect(note)}
                disabled={note.trim().length < 2}
                className="mt-4 rounded-lg bg-amber-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                Bring this back
              </button>
            </>
          )}
        </div>
      </div>
    </ActivitySurface>
  );
}
