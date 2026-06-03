import { describe, it, expect } from 'vitest';
import { calculateReadingTime } from '../reading-time';

describe('calculateReadingTime', () => {
  it('returns 1 for short text (minimum)', () => {
    expect(calculateReadingTime('Hello world')).toBe(1);
  });

  it('returns 1 for empty string', () => {
    expect(calculateReadingTime('')).toBe(1);
  });

  it('calculates reading time for pure English text', () => {
    // 200 words at 200 wpm = 1 minute
    const words = Array(200).fill('word').join(' ');
    expect(calculateReadingTime(words)).toBe(1);
  });

  it('calculates reading time for pure CJK text', () => {
    // 400 CJK chars at 400 chars/min = 1 minute
    const cjk = '你'.repeat(400);
    expect(calculateReadingTime(cjk)).toBe(1);
  });

  it('calculates reading time for mixed CJK + English text', () => {
    // 200 CJK chars + 100 English words
    // CJK: 200/400 = 0.5 min, English: 100/200 = 0.5 min => 1 min
    const cjk = '你'.repeat(200);
    const eng = Array(100).fill('word').join(' ');
    expect(calculateReadingTime(`${cjk} ${eng}`)).toBe(1);
  });

  it('rounds up to nearest minute', () => {
    // 600 CJK chars = 1.5 min => rounds to 2
    const cjk = '你'.repeat(600);
    expect(calculateReadingTime(cjk)).toBe(2);
  });

  it('handles text with only whitespace', () => {
    expect(calculateReadingTime('   \n\t  ')).toBe(1);
  });
});
