import { describe, it, expect } from 'vitest';
import { countWords } from '../word-count';

describe('countWords', () => {
  it('returns 0 for empty string', () => {
    expect(countWords('')).toBe(0);
  });

  it('returns 0 for whitespace-only input', () => {
    expect(countWords('   ')).toBe(0);
    expect(countWords('\n\t')).toBe(0);
  });

  it('counts English words correctly', () => {
    expect(countWords('hello')).toBe(1);
    expect(countWords('hello world')).toBe(2);
    expect(countWords('one two three four five')).toBe(5);
  });

  it('counts CJK characters individually', () => {
    expect(countWords('你好世界')).toBe(4);
    expect(countWords('今天天气真好')).toBe(6);
  });

  it('counts mixed English and Chinese correctly', () => {
    expect(countWords('hello 你好')).toBe(3); // 1 English + 2 CJK
    expect(countWords('这是 test 文本')).toBe(5); // 2 CJK + 1 English + 2 CJK
  });

  it('handles multiple spaces between words', () => {
    expect(countWords('hello   world')).toBe(2);
    expect(countWords('  hello  world  ')).toBe(2);
  });
});
