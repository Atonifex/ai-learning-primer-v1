"use client";

import { useState } from "react";

export type AiDebugBlock = { label: string; text: string };

export type AiDebugTool = {
  name: string;
  ok: boolean;
  args: string;
  result: string;
};

export type AiDebugTurn = {
  id: string;
  blocks: AiDebugBlock[];
  tools: AiDebugTool[];
};

/** Developer packet. Mount only when NEXT_PUBLIC_PRIMER_AI_DEBUG is set. Starts closed. */
export default function AiDebugPanel(props: {
  turns: AiDebugTurn[];
  thinkingPhase?: string | null;
  streamError?: string | null;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="pointer-events-none absolute left-3 top-14 z-[80] max-w-[min(440px,92vw)]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="pointer-events-auto rounded border border-amber-700/70 bg-black/85 px-2 py-1 font-mono text-[10px] text-amber-200"
        data-testid="ai-debug-toggle"
      >
        {open ? "Hide AI packet" : "AI packet"}
        {props.turns.length ? ` (${props.turns.length})` : ""}
      </button>
      {open && (
        <div
          className="pointer-events-auto mt-1 max-h-[70vh] overflow-auto rounded border border-amber-700/60 bg-black/90 px-2 py-1 font-mono text-[10px] text-amber-100 shadow-lg"
          data-testid="ai-debug-panel"
        >
          <p className="font-semibold text-amber-300">What Rho received</p>
          {props.thinkingPhase && (
            <p className="text-amber-200/80">thinking: {props.thinkingPhase}</p>
          )}
          {props.streamError && <p className="text-red-300">error: {props.streamError}</p>}
          {props.turns.length === 0 && (
            <p className="mt-1 text-amber-200/70">No turn yet this sitting.</p>
          )}
          <ol className="mt-1 space-y-2">
            {props.turns.map((turn, index) => (
              <li key={turn.id} className="border-t border-amber-800/50 pt-1">
                <p className="text-amber-300">Turn {index + 1}</p>
                {turn.blocks.map((block) => (
                  <details key={block.label} open={block.label === "Authority" || block.label === "This turn"}>
                    <summary className="cursor-pointer text-amber-200">{block.label}</summary>
                    <pre className="whitespace-pre-wrap text-amber-50/90">{block.text}</pre>
                  </details>
                ))}
                {turn.tools.map((tool, toolIndex) => (
                  <details key={`${tool.name}-${toolIndex}`}>
                    <summary className={tool.ok ? "text-emerald-300" : "text-red-300"}>
                      tool {tool.ok ? "ok" : "fail"} {tool.name}
                    </summary>
                    <p className="text-amber-200">arguments</p>
                    <pre className="whitespace-pre-wrap">{tool.args || "(none)"}</pre>
                    <p className="text-amber-200">result</p>
                    <pre className="whitespace-pre-wrap">{tool.result || "(none)"}</pre>
                  </details>
                ))}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
