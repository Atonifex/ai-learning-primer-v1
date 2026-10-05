/** Browser-only gate for the AI debug strip (never on for real players). */
export function isClientAiDebug(): boolean {
  const v = process.env.NEXT_PUBLIC_PRIMER_AI_DEBUG;
  if (!v) return false;
  const s = v.toLowerCase().trim();
  return s === "1" || s === "true" || s === "yes";
}
