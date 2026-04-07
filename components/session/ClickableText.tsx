"use client";

interface ClickableTextProps {
  content: string;
  onWordClick: (word: string, sentence: string, rect: DOMRect) => void;
}

export default function ClickableText({ content, onWordClick }: ClickableTextProps) {
  // Flat token list: split by whitespace, preserving the whitespace tokens
  const tokens = content.split(/(\s+)/);

  // Plain text (no **) used for context extraction
  const plainText = content.replace(/\*\*/g, "");

  function getContext(cleanWord: string): string {
    const idx = plainText.indexOf(cleanWord);
    if (idx === -1) return plainText.slice(0, 220);
    const start = Math.max(0, idx - 110);
    const end = Math.min(plainText.length, idx + cleanWord.length + 110);
    return plainText.slice(start, end).trim();
  }

  return (
    <>
      {tokens.map((token, i) => {
        if (!token) return null;

        // Newline → explicit line break
        if (token === "\n" || token === "\r\n") {
          return <br key={i} />;
        }

        // Other pure whitespace — preserve as-is
        if (/^\s+$/.test(token)) {
          return <span key={i}>{token}</span>;
        }

        // Detect **bold** tokens (single-token bold, e.g. **Seguimos** or **word,**)
        const boldMatch = token.match(/^\*\*(.+)\*\*$/);
        const displayText = boldMatch ? boldMatch[1] : token;
        const isBold = !!boldMatch;

        // Strip leading/trailing punctuation for the query word
        const clean = displayText.replace(/^[^\w\u00C0-\u024F]+|[^\w\u00C0-\u024F]+$/g, "");

        const handleClick = (e: React.MouseEvent<HTMLElement>) => {
          e.stopPropagation();
          if (clean.length === 0) return;
          const rect = e.currentTarget.getBoundingClientRect();
          onWordClick(clean, getContext(clean), rect);
        };

        const className =
          "rounded-sm px-px cursor-pointer transition-colors duration-100 hover:bg-stone-200/60 active:bg-stone-300/70";

        if (isBold) {
          return (
            <strong key={i} className={`font-semibold ${className}`} onClick={handleClick}>
              {displayText}
            </strong>
          );
        }

        return (
          <span key={i} className={className} onClick={handleClick}>
            {displayText}
          </span>
        );
      })}
    </>
  );
}
