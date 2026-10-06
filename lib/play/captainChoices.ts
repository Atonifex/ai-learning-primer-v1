/**
 * Captain decision buttons — wire contract.
 *
 * Authoritative path (tool-first): Rho calls `present_captain_choices` with
 * structured options. The orchestrator validates via `decodeCaptainChoices`,
 * yields SSE `captain_choices`, and the dialogue UI renders tap targets.
 *
 * Do NOT parse A/B/C out of free assistant prose. The tool payload is the
 * delimiter; typed letters in chat are not a UI protocol.
 *
 * Click → `formatCaptainChoiceReply` → captain USER message so Rho (and tests)
 * can decode the pick with `parseCaptainChoiceReply`.
 */

export const CAPTAIN_CHOICE_IDS = ["A", "B", "C"] as const;
export type CaptainChoiceId = (typeof CAPTAIN_CHOICE_IDS)[number];

export type CaptainChoiceOption = {
  id: CaptainChoiceId;
  label: string;
};

export type CaptainChoicesPayload = {
  prompt: string;
  options: CaptainChoiceOption[];
};

const MAX_PROMPT = 120;
const MAX_LABEL = 60;
const MIN_OPTIONS = 2;
const MAX_OPTIONS = 3;

/** Visible reply shape: `I choose A — Check the wreck` */
export const CAPTAIN_CHOICE_REPLY_RE =
  /^I choose\s+([ABC])\s*[—\-–]\s*(.+)$/i;

export function normalizeChoiceId(raw: unknown): CaptainChoiceId | null {
  if (typeof raw !== "string") return null;
  const id = raw.trim().toUpperCase();
  if (id === "A" || id === "B" || id === "C") return id;
  return null;
}

function cleanLabel(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const label = raw.trim().replace(/\s+/g, " ");
  if (!label || label.length > MAX_LABEL) return null;
  return label;
}

/**
 * Decode and validate tool args (or an SSE payload) into UI-ready choices.
 * Returns null when the payload is unusable — never invent options.
 */
export function decodeCaptainChoices(raw: unknown): CaptainChoicesPayload | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;

  const promptRaw =
    typeof obj.decision_prompt === "string"
      ? obj.decision_prompt
      : typeof obj.prompt === "string"
        ? obj.prompt
        : "";
  const prompt = promptRaw.trim().replace(/\s+/g, " ").slice(0, MAX_PROMPT);

  const list = Array.isArray(obj.options) ? obj.options : null;
  if (!list || list.length < MIN_OPTIONS || list.length > MAX_OPTIONS) return null;

  const options: CaptainChoiceOption[] = [];
  const seen = new Set<CaptainChoiceId>();

  for (let i = 0; i < list.length; i++) {
    const row = list[i];
    if (!row || typeof row !== "object") return null;
    const rec = row as Record<string, unknown>;
    const fromField = normalizeChoiceId(rec.id ?? rec.choice_id);
    const fallback = CAPTAIN_CHOICE_IDS[i] ?? null;
    const id = fromField ?? fallback;
    if (!id || seen.has(id)) return null;
    const label = cleanLabel(rec.label ?? rec.text);
    if (!label) return null;
    seen.add(id);
    options.push({ id, label });
  }

  if (options.length < MIN_OPTIONS) return null;
  return { prompt, options };
}

export function formatCaptainChoiceReply(option: CaptainChoiceOption): string {
  return `I choose ${option.id} — ${option.label.trim()}`;
}

export function parseCaptainChoiceReply(
  content: string
): CaptainChoiceOption | null {
  const m = CAPTAIN_CHOICE_REPLY_RE.exec(content.trim());
  if (!m) return null;
  const id = normalizeChoiceId(m[1]);
  const label = cleanLabel(m[2]);
  if (!id || !label) return null;
  return { id, label };
}

export function isCaptainChoiceReply(content: string): boolean {
  return parseCaptainChoiceReply(content) !== null;
}
