/** Labeled blocks for the developer turn inspector. Not shown to captains. */

export type DebugBlock = { label: string; text: string };

export function clipDebugText(text: string, max = 1800): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}… (+${text.length - max} chars)`;
}

export function buildTurnDebugPacket(input: {
  expandedUser: string;
  previouslyOn: string | null;
  chapterHandoff: string | null;
  authority: string;
  campNeeds: string;
  memoryItems: { type: string; content: string }[];
}): { blocks: DebugBlock[] } {
  const memory = input.memoryItems.length
    ? input.memoryItems.map((item) => `- [${item.type}] ${item.content}`).join("\n")
    : "(none)";
  const blocks: DebugBlock[] = [
    { label: "This turn", text: input.expandedUser || "(empty)" },
    { label: "Authority", text: input.authority || "(none)" },
    { label: "Previously on", text: input.previouslyOn?.trim() || "(none)" },
    { label: "Chapter handoff", text: input.chapterHandoff?.trim() || "(none)" },
    { label: "Camp needs", text: input.campNeeds.trim() || "(none)" },
    { label: "Memory", text: memory },
  ];
  return {
    blocks: blocks.map((block) => ({ ...block, text: clipDebugText(block.text) })),
  };
}
