"use client";

interface ClickableTextProps {
  content: string;
  onWordClick: (word: string, sentence: string, rect: DOMRect) => void;
}

export default function ClickableText({ content, onWordClick }: ClickableTextProps) {
  // Split into alternating word / whitespace tokens, preserving all whitespace for pre-wrap
  const tokens = content.split(/(\s+)/);

  function getContext(tokenIndex: number): string {
    const before = tokens.slice(Math.max(0, tokenIndex - 12), tokenIndex).join("");
    const after = tokens.slice(tokenIndex + 1, tokenIndex + 13).join("");
    return (before + tokens[tokenIndex] + after).trim().slice(0, 220);
  }

  return (
    <>
      {tokens.map((token, i) => {
        if (!token) return null;

        // Pure whitespace — render as-is so whitespace-pre-wrap works correctly
        if (/^\s+$/.test(token)) {
          return <span key={i}>{token}</span>;
        }

        return (
          <span
            key={i}
            className="rounded-sm px-px cursor-pointer transition-colors duration-100 hover:bg-stone-200/60 active:bg-stone-300/70"
            onClick={(e) => {
              e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              // Strip leading/trailing punctuation before querying
              const clean = token.replace(/^[^\w\u00C0-\u024F]+|[^\w\u00C0-\u024F]+$/g, "");
              if (clean.length > 0) {
                onWordClick(clean, getContext(i), rect);
              }
            }}
          >
            {token}
          </span>
        );
      })}
    </>
  );
}
