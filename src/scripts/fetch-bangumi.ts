/**
 * Prebuild script: fetch Bangumi collection data and write to content collection JSON files.
 * Run via `pnpm bangumi:refresh` or as `prebuild` hook.
 */
import * as path from 'node:path';
import * as fs from 'node:fs';
import {
  fetchBangumiData,
  readCache,
  mergeOverrides,
  writeCollectionFiles,
  BANGUMI_TYPES,
  type BangumiItem,
} from '../utils/bangumi';

const CONTENT_DIR = path.resolve(process.cwd(), 'src/content');
const OVERRIDE_PATH = path.resolve(process.cwd(), 'src/data/bangumi-override.json');

async function main() {
  const username = process.env.BANGUMI_USERNAME;

  if (!username) {
    console.warn('[bangumi] BANGUMI_USERNAME not set — writing empty collections');
    writeCollectionFiles({ anime: [], books: [], music: [] });
    return;
  }

  // Load overrides
  let overrides: { anime: BangumiItem[]; books: BangumiItem[]; music: BangumiItem[] } = {
    anime: [],
    books: [],
    music: [],
  };
  try {
    const raw = fs.readFileSync(OVERRIDE_PATH, 'utf-8');
    overrides = JSON.parse(raw);
  } catch {
    // No overrides file — fine
  }

  const results: Record<string, BangumiItem[]> = {};
  const types: Array<{ key: string; bangumiType: number }> = [
    { key: 'anime', bangumiType: BANGUMI_TYPES.anime },
    { key: 'books', bangumiType: BANGUMI_TYPES.book },
    { key: 'music', bangumiType: BANGUMI_TYPES.music },
  ];

  for (const { key, bangumiType } of types) {
    const cachePath = path.join(CONTENT_DIR, key, 'list.json');
    const { data: cached, isStale } = readCache(cachePath);

    if (!isStale && cached.length > 0) {
      console.log(`[bangumi] ${key}: using cached data (${cached.length} items, fresh)`);
      results[key] = mergeOverrides(cached, overrides[key as keyof typeof overrides] || []);
    } else {
      console.log(`[bangumi] ${key}: fetching from API...`);
      const fetched = await fetchBangumiData(username, bangumiType);
      results[key] = mergeOverrides(fetched, overrides[key as keyof typeof overrides] || []);
    }
  }

  writeCollectionFiles({
    anime: results.anime,
    books: results.books,
    music: results.music,
  });

  console.log(
    `[bangumi] Done: ${results.anime.length} anime, ${results.books.length} books, ${results.music.length} music written`
  );
}

main().catch(err => {
  console.error('[bangumi] Fatal error:', err);
  // Graceful fallback: write empty collections so build doesn't break
  writeCollectionFiles({ anime: [], books: [], music: [] });
});
