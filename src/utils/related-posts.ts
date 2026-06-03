import type { CollectionEntry } from 'astro:content';

/**
 * Find related articles by tag overlap, with fallback to most recent.
 * Excludes the current article. Returns up to `limit` articles.
 */
export function findRelated(
  current: CollectionEntry<'articles'>,
  all: CollectionEntry<'articles'>[],
  limit = 3
): CollectionEntry<'articles'>[] {
  const others = all.filter(a => a.id !== current.id);
  if (others.length === 0) return [];

  const currentTags = new Set(current.data.tags);

  const scored = others
    .map(article => {
      const sharedCount = article.data.tags.filter(t => currentTags.has(t)).length;
      return { article, sharedCount };
    })
    .sort((a, b) => {
      // Primary: shared tag count (descending)
      if (b.sharedCount !== a.sharedCount) return b.sharedCount - a.sharedCount;
      // Secondary: most recent first
      return b.article.data.publishedAt.getTime() - a.article.data.publishedAt.getTime();
    });

  return scored.slice(0, limit).map(s => s.article);
}
