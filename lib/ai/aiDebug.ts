/**
 * Gated logging for lib/ai (orchestration, tools, extraction).
 *
 * Set PRIMER_AI_DEBUG=1 in .env for structured logs (no full prompts by default).
 * Set PRIMER_AI_DEBUG_FULL=1 to also print full system prompts / long payloads (PII-heavy).
 */

function truthy(v: string | undefined): boolean {
  if (!v) return false;
  const s = v.toLowerCase().trim();
  return s === "1" || s === "true" || s === "yes";
}

export function isAiDebug(): boolean {
  return truthy(process.env.PRIMER_AI_DEBUG);
}

export function isAiDebugFull(): boolean {
  return truthy(process.env.PRIMER_AI_DEBUG_FULL);
}

function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return `${str.slice(0, max)}… (+${str.length - max} chars)`;
}

/**
 * Safe one-line summary of chat messages for logs (roles + lengths only).
 */
export function summarizeMessagesForDebug(
  messages: { role: string; content?: string | null }[],
  previewChars = 0
): { role: string; length: number; preview?: string }[] {
  return messages.map((m) => {
    const content = m.content ?? "";
    const row: { role: string; length: number; preview?: string } = {
      role: m.role,
      length: content.length,
    };
    if (previewChars > 0 && content.length > 0) {
      row.preview = truncate(content, previewChars);
    }
    return row;
  });
}

type DebugPayload = Record<string, unknown>;

export function aiDebug(scope: string, phase: string, data?: DebugPayload): void {
  if (!isAiDebug()) return;
  if (data && Object.keys(data).length > 0) {
    console.log(`[Primer AI:${scope}] ${phase}`, data);
  } else {
    console.log(`[Primer AI:${scope}] ${phase}`);
  }
}
