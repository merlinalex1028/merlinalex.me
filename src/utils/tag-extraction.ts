import type { CollectionEntry } from 'astro:content';

/**
 * Extract unique, sorted tags from a collection of articles.
 */
export function extractTags(articles: CollectionEntry<'articles'>[]): string[] {
  const tagSet = new Set<string>();
  for (const article of articles) {
    for (const tag of article.data.tags) {
      tagSet.add(tag);
    }
  }
  return [...tagSet].sort();
}
