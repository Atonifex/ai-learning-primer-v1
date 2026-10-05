"use client";

export type AiDebugEntry = {
  id: string;
  name: string;
  ok: boolean;
  detail?: string;
};

/** Developer-only strip. Mount only when NEXT_PUBLIC_PRIMER_AI_DEBUG is set. */
export default function AiDebugPanel(props: {
  entries: AiDebugEntry[];
  thinkingPhase?: string | null;
  streamError?: string | null;
}) {
  if (
    props.entries.length === 0 &&
    !props.thinkingPhase &&
    !props.streamError
  ) {
    return null;
  }

  return (
    <div
      className="pointer-events-none absolute bottom-2 left-2 z-[60] max-h-40 max-w-sm overflow-auto rounded border border-amber-700/60 bg-black/80 px-2 py-1 font-mono text-[10px] text-amber-100 shadow-lg"
      data-testid="ai-debug-panel"
    >
      <p className="font-semibold text-amber-300">AI debug (dev only)</p>
      {props.thinkingPhase && (
        <p className="text-amber-200/80">thinking: {props.thinkingPhase}</p>
      )}
      {props.streamError && (
        <p className="text-red-300">error: {props.streamError}</p>
      )}
      <ul className="mt-0.5 space-y-0.5">
        {props.entries.map((e) => (
          <li key={e.id}>
            <span className={e.ok ? "text-emerald-300" : "text-red-300"}>
              {e.ok ? "ok" : "fail"}
            </span>{" "}
            {e.name}
            {e.detail ? ` — ${e.detail}` : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
