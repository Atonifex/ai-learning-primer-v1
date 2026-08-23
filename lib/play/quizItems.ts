type BankQuizItem = {
  itemType?: string;
  prompt?: string;
  choices?: string[];
  correctIndex?: number;
};

export function overlayMcItemsFromBankContent(raw: unknown): Array<{
  id: string;
  question: string;
  options: string[];
}> {
  return parseMcItems(raw).map(({ id, question, options }) => ({
    id,
    question,
    options,
  }));
}

export function parseMcItems(raw: unknown): Array<{
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}> {
  const content = (raw ?? {}) as { quizItems?: BankQuizItem[] };
  const items = Array.isArray(content.quizItems) ? content.quizItems : [];
  const out: Array<{
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
  }> = [];
  for (let i = 0; i < items.length; i++) {
    const row = items[i];
    if (!row || row.itemType !== "multiple_choice") continue;
    const question = typeof row.prompt === "string" ? row.prompt.trim() : "";
    const options = Array.isArray(row.choices)
      ? row.choices.filter((c): c is string => typeof c === "string")
      : [];
    const correctIndex =
      typeof row.correctIndex === "number" ? row.correctIndex : -1;
    if (!question || options.length < 2) continue;
    if (correctIndex < 0 || correctIndex >= options.length) continue;
    out.push({
      id: `q${i + 1}`,
      question,
      options,
      correctIndex,
    });
  }
  return out;
}

export function hintsFromContent(raw: unknown): string[] {
  const content = (raw ?? {}) as { scaffoldHints?: unknown };
  if (!Array.isArray(content.scaffoldHints)) return [];
  return content.scaffoldHints.filter((h): h is string => typeof h === "string");
}
