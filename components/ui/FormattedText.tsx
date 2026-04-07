"use client";

interface FormattedTextProps {
  content: string;
  /** When provided, every word becomes a clickable hover target */
  onWordClick?: (word: string, context: string, rect: DOMRect) => void;
}

const CLICK_CLASS =
  "rounded-sm px-px cursor-pointer transition-colors duration-100 hover:bg-stone-200/60 active:bg-stone-300/70";

export default function FormattedText({ content, onWordClick }: FormattedTextProps) {
  // Plain text used for extracting surrounding context on click
  const plainText = content.replace(/\*\*/g, "");

  function getContext(word: string): string {
    const idx = plainText.indexOf(word);
    if (idx === -1) return plainText.slice(0, 220);
    return plainText.slice(Math.max(0, idx - 110), idx + word.length + 110).trim();
  }

  function handleClick(displayText: string) {
    return (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation();
      const clean = displayText.replace(/^[^\w\u00C0-\u024F]+|[^\w\u00C0-\u024F]+$/g, "");
      if (!clean || !onWordClick) return;
      onWordClick(clean, getContext(clean), e.currentTarget.getBoundingClientRect());
    };
  }

  // Render one bold/normal segment, splitting into clickable word tokens if interactive
  function renderSegment(text: string, bold: boolean, key: string) {
    if (!onWordClick) {
      return bold
        ? <strong key={key} className="font-semibold">{text}</strong>
        : <span key={key}>{text}</span>;
    }

    return text.split(/(\s+)/).map((token, i) => {
      if (!token) return null;
      const k = `${key}-${i}`;
      if (/^\s+$/.test(token)) return <span key={k}>{token}</span>;
      return bold
        ? <strong key={k} className={`font-semibold ${CLICK_CLASS}`} onClick={handleClick(token)}>{token}</strong>
        : <span key={k} className={CLICK_CLASS} onClick={handleClick(token)}>{token}</span>;
    });
  }

  // Split a line into alternating [normal, bold, normal, ...] segments
  function renderLine(line: string, lineKey: string) {
    return line
      .split(/\*\*(.+?)\*\*/g)
      .map((seg, i) => renderSegment(seg, i % 2 === 1, `${lineKey}-${i}`));
  }

  const lines = content.split("\n");

  return (
    <>
      {lines.map((line, li) => (
        <span key={li}>
          {renderLine(line, `${li}`)}
          {li < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}
