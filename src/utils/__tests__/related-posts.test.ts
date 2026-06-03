import { describe, it, expect } from 'vitest';
import { findRelated } from '../related-posts';

// Mock article with id, tags, and publishedAt
function makeArticle(
  id: string,
  tags: string[],
  publishedAt: string = '2026-01-01'
) {
  return {
    id,
    data: {
      tags,
      publishedAt: new Date(publishedAt),
    },
  } as any;
}

describe('findRelated', () => {
  it('returns empty array when no other articles exist', () => {
    const current = makeArticle('current', ['a', 'b']);
    expect(findRelated(current, [], 3)).toEqual([]);
  });

  it('returns articles sorted by shared tag count', () => {
    const current = makeArticle('current', ['a', 'b']);
    const articles = [
      makeArticle('one', ['a', 'b', 'c']), // 2 shared
      makeArticle('two', ['a', 'c']),       // 1 shared
      makeArticle('three', ['x', 'y']),     // 0 shared
    ];
    const result = findRelated(current, articles, 3);
    expect(result.map((a: any) => a.id)).toEqual(['one', 'two', 'three']);
  });

  it('excludes the current article by id', () => {
    const current = makeArticle('current', ['a']);
    const articles = [
      current,
      makeArticle('other', ['a']),
    ];
    const result = findRelated(current, articles, 3);
    expect(result.every((a: any) => a.id !== 'current')).toBe(true);
  });

  it('respects the limit parameter', () => {
    const current = makeArticle('current', ['a']);
    const articles = [
      makeArticle('one', ['a']),
      makeArticle('two', ['a']),
      makeArticle('three', ['a']),
    ];
    const result = findRelated(current, articles, 2);
    expect(result).toHaveLength(2);
  });

  it('falls back to most recent articles when few share tags', () => {
    const current = makeArticle('current', ['unique']);
    const articles = [
      makeArticle('old', ['other'], '2025-01-01'),
      makeArticle('new', ['other'], '2026-06-01'),
    ];
    const result = findRelated(current, articles, 2);
    // Both have 0 shared tags, should be sorted by date (newest first)
    expect(result.map((a: any) => a.id)).toEqual(['new', 'old']);
  });
});
