import * as fs from 'node:fs';
import * as path from 'node:path';

export interface BangumiItem {
  subjectId: number;
  name: string;
  nameCn: string;
  cover: string;
  score: number;
  rate: number;
  type: number; // 1=wish, 2=done, 3=doing
  epStatus: number;
  volStatus: number;
  eps: number;
  updatedAt: string;
  comment?: string;
  tags: string[];
}

export const BANGUMI_TYPES = {
  anime: 2,
  book: 1,
  music: 3,
  game: 4,
} as const;

const USER_AGENT = 'merlinalex.me/1.0 (Astro build)';
const STALE_HOURS = 12;

interface BangumiApiResponse {
  data: Array<{
    subject_id: number;
    subject: {
      name: string;
      name_cn: string;
      images: { large: string };
      score: number;
      eps?: number;
    };
    rate: number;
    type: number;
    ep_status: number;
    vol_status: number;
    updated_at: string;
    comment?: string;
    subject_tags?: Array<{ name: string }>;
  }>;
  total: number;
}

export async function fetchBangumiData(
  username: string,
  subjectType: number
): Promise<BangumiItem[]> {
  const limit = 50;
  let offset = 0;
  const allItems: BangumiItem[] = [];

  try {
    while (true) {
      const url = `https://api.bgm.tv/v0/users/${username}/collections?subject_type=${subjectType}&limit=${limit}&offset=${offset}`;
      const response = await fetch(url, {
        headers: { 'User-Agent': USER_AGENT },
      });

      if (!response.ok) break;

      const body: BangumiApiResponse = await response.json();
      const items = (body.data || []).map(item => ({
        subjectId: item.subject_id,
        name: item.subject.name,
        nameCn: item.subject.name_cn || '',
        cover: item.subject.images?.large || '',
        score: item.subject.score ?? 0,
        rate: item.rate ?? 0,
        type: item.type,
        epStatus: item.ep_status ?? 0,
        volStatus: item.vol_status ?? 0,
        eps: item.subject.eps ?? 0,
        updatedAt: item.updated_at || '',
        comment: item.comment || undefined,
        tags: (item.subject_tags || []).map(t => t.name),
      }));

      allItems.push(...items);
      offset += limit;

      if (allItems.length >= body.total) break;
    }
  } catch {
    return [];
  }

  return allItems;
}

export function readCache(filePath: string): { data: BangumiItem[]; isStale: boolean } {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data: BangumiItem[] = JSON.parse(raw);
    const stat = fs.statSync(filePath);
    const isStale = Date.now() - stat.mtimeMs > STALE_HOURS * 60 * 60 * 1000;
    return { data, isStale };
  } catch {
    return { data: [], isStale: true };
  }
}

export function mergeOverrides(
  items: BangumiItem[],
  overrides: BangumiItem[]
): BangumiItem[] {
  const map = new Map<number, BangumiItem>();
  for (const item of items) {
    map.set(item.subjectId, item);
  }
  for (const override of overrides) {
    map.set(override.subjectId, override);
  }
  return Array.from(map.values());
}

export function writeCollectionFiles(data: {
  anime: BangumiItem[];
  books: BangumiItem[];
  music: BangumiItem[];
  game: BangumiItem[];
}): void {
  const baseDir = path.resolve(process.cwd(), 'src/content');
  const entries: [string, BangumiItem[]][] = [
    ['anime', data.anime],
    ['books', data.books],
    ['music', data.music],
    ['game', data.game],
  ];

  for (const [type, items] of entries) {
    const dir = path.join(baseDir, type);
    fs.mkdirSync(dir, { recursive: true });
    // Add id field required by Astro file() loader
    const itemsWithId = items.map((item) => ({ id: String(item.subjectId), ...item }));
    fs.writeFileSync(path.join(dir, 'list.json'), JSON.stringify(itemsWithId, null, 2));
  }
}
