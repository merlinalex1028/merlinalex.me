import { describe, it, expect } from 'vitest';
import { extractTags } from '../tag-extraction';

// Minimal mock matching CollectionEntry<'articles'>.data.tags shape
function makeArticle(tags: string[]) {
  return { data: { tags } } as any;
}

describe('extractTags', () => {
  it('returns empty array for empty input', () => {
    expect(extractTags([])).toEqual([]);
  });

  it('extracts unique tags from multiple articles', () => {
    const articles = [
      makeArticle(['tech', 'life']),
      makeArticle(['tech', 'notes']),
    ];
    expect(extractTags(articles)).toEqual(['life', 'notes', 'tech']);
  });

  it('deduplicates tags', () => {
    const articles = [
      makeArticle(['tech']),
      makeArticle(['tech']),
      makeArticle(['tech']),
    ];
    expect(extractTags(articles)).toEqual(['tech']);
  });

  it('returns sorted tags', () => {
    const articles = [
      makeArticle(['zebra', 'apple', 'mango']),
    ];
    expect(extractTags(articles)).toEqual(['apple', 'mango', 'zebra']);
  });

  it('handles articles with no tags', () => {
    const articles = [
      makeArticle([]),
      makeArticle(['tech']),
    ];
    expect(extractTags(articles)).toEqual(['tech']);
  });
});
