/**
 * CJK-aware reading time calculator.
 * CJK characters: ~400 chars/min, non-CJK words: ~200 words/min.
 * Returns minimum 1 minute.
 */
export function calculateReadingTime(text: string): number {
  if (!text.trim()) return 1;

  const cjkChars = (text.match(/[一-鿿㐀-䶿぀-ゟ゠-ヿ]/g) || []).length;
  const nonCjkWords = text
    .replace(/[一-鿿㐀-䶿぀-ゟ゠-ヿ]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 0).length;

  const minutes = cjkChars / 400 + nonCjkWords / 200;
  return Math.max(1, Math.ceil(minutes));
}
