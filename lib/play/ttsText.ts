/** OpenAI TTS input cap is 4096; stay under that for latency and cost. */
export const TTS_MAX_CHARS = 2000;

/**
 * Strip markdown / extra whitespace so Rho reads the line, not the markup.
 * Returns null when there is nothing worth speaking.
 */
export function prepareTtsText(raw: string): string | null {
  let text = raw.replace(/\r\n/g, "\n");
  text = text.replace(/```[\s\S]*?```/g, " ");
  text = text.replace(/`([^`]+)`/g, "$1");
  text = text.replace(/!\[[^\]]*\]\([^)]+\)/g, " ");
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  text = text.replace(/[*_#>~]+/g, "");
  text = text.replace(/\s+/g, " ").trim();
  if (text.length < 2) return null;
  if (text.length > TTS_MAX_CHARS) {
    const sliced = text.slice(0, TTS_MAX_CHARS);
    const atWord = sliced.replace(/\s+\S*$/, "").trim();
    text = `${atWord || sliced}.`;
  }
  return text;
}
