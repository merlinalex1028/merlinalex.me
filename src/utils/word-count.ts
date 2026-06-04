/**
 * CJK-aware word count utility.
 * CJK characters are counted individually; non-CJK text is split by whitespace.
 */
export function countWords(text: string): number {
  if (!text.trim()) return 0;

  // Match CJK characters (CJK Unified Ideographs + Extension A)
  const cjkChars = (text.match(/[一-鿿㐀-䶿]/g) ?? []).length;

  // Count non-CJK words
  const nonCjkWords = text
    .replace(/[一-鿿㐀-䶿]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  return cjkChars + nonCjkWords;
}
