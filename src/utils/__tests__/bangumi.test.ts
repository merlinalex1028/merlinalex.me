import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fs from 'node:fs';

vi.mock('node:fs', () => ({
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
  mkdirSync: vi.fn(),
  statSync: vi.fn(),
  existsSync: vi.fn(),
}));

import {
  fetchBangumiData,
  readCache,
  mergeOverrides,
  writeCollectionFiles,
  BANGUMI_TYPES,
  type BangumiItem,
} from '../bangumi';

const mockFs = vi.mocked(fs);

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal('fetch', vi.fn());
});

describe('BANGUMI_TYPES', () => {
  it('maps anime=2, book=1, music=3', () => {
    expect(BANGUMI_TYPES.anime).toBe(2);
    expect(BANGUMI_TYPES.book).toBe(1);
    expect(BANGUMI_TYPES.music).toBe(3);
  });
});

describe('fetchBangumiData', () => {
  it('returns empty array when API returns error', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(null, { status: 500, statusText: 'Internal Server Error' })
    );
    const result = await fetchBangumiData('testuser', 2);
    expect(result).toEqual([]);
  });

  it('flattens paginated results', async () => {
    const page1Data = {
      data: [
        { subject_id: 1, subject: { name: 'Anime 1', name_cn: '动漫1', images: { large: 'https://example.com/1.jpg' }, score: 8.5 }, rate: 8, type: 3, ep_status: 12, vol_status: 0, updated_at: '2026-01-01T00:00:00Z' },
      ],
      total: 2,
    };
    const page2Data = {
      data: [
        { subject_id: 2, subject: { name: 'Anime 2', name_cn: '动漫2', images: { large: 'https://example.com/2.jpg' }, score: 7.0 }, rate: 7, type: 2, ep_status: 24, vol_status: 0, updated_at: '2026-01-02T00:00:00Z' },
      ],
      total: 2,
    };

    vi.mocked(global.fetch)
      .mockResolvedValueOnce(new Response(JSON.stringify(page1Data), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify(page2Data), { status: 200 }));

    const result = await fetchBangumiData('testuser', 2);
    expect(result).toHaveLength(2);
    expect(result[0].subjectId).toBe(1);
    expect(result[1].subjectId).toBe(2);
  });

  it('sets User-Agent header', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ data: [], total: 0 }), { status: 200 })
    );
    await fetchBangumiData('testuser', 2);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'User-Agent': expect.stringContaining('merlinalex.me'),
        }),
      })
    );
  });

  it('maps API fields to BangumiItem shape', async () => {
    const apiData = {
      data: [
        {
          subject_id: 42,
          subject: {
            name: 'Test Anime',
            name_cn: '测试动漫',
            images: { large: 'https://example.com/cover.jpg' },
            score: 9.0,
            eps: 24,
          },
          rate: 9,
          type: 3,
          ep_status: 12,
          vol_status: 0,
          updated_at: '2026-06-01T00:00:00Z',
          comment: 'Great show!',
          subject_tags: [{ name: 'action' }, { name: 'fantasy' }],
        },
      ],
      total: 1,
    };

    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(apiData), { status: 200 })
    );

    const result = await fetchBangumiData('testuser', 2);
    expect(result[0]).toEqual({
      subjectId: 42,
      name: 'Test Anime',
      nameCn: '测试动漫',
      cover: 'https://example.com/cover.jpg',
      score: 9.0,
      rate: 9,
      type: 3,
      epStatus: 12,
      volStatus: 0,
      eps: 24,
      updatedAt: '2026-06-01T00:00:00Z',
      comment: 'Great show!',
      tags: ['action', 'fantasy'],
    });
  });
});

describe('readCache', () => {
  it('returns empty array for missing file', () => {
    mockFs.readFileSync.mockImplementation(() => {
      throw new Error('ENOENT');
    });
    const result = readCache('/nonexistent.json');
    expect(result.data).toEqual([]);
    expect(result.isStale).toBe(true);
  });

  it('returns parsed data for valid file', () => {
    const items: BangumiItem[] = [
      { subjectId: 1, name: 'Test', nameCn: '', cover: '', score: 0, rate: 0, type: 3, epStatus: 0, volStatus: 0, eps: 0, updatedAt: '', tags: [] },
    ];
    mockFs.readFileSync.mockReturnValueOnce(JSON.stringify(items));
    mockFs.statSync.mockReturnValueOnce({ mtimeMs: Date.now() } as fs.Stats);

    const result = readCache('/cache.json');
    expect(result.data).toEqual(items);
    expect(result.isStale).toBe(false);
  });

  it('marks data as stale when file is older than 12h', () => {
    const items: BangumiItem[] = [];
    mockFs.readFileSync.mockReturnValueOnce(JSON.stringify(items));
    // 13 hours ago in ms
    const oldTime = Date.now() - 13 * 60 * 60 * 1000;
    mockFs.statSync.mockReturnValueOnce({ mtimeMs: oldTime } as fs.Stats);

    const result = readCache('/cache.json');
    expect(result.isStale).toBe(true);
  });
});

describe('mergeOverrides', () => {
  it('replaces matching items by subjectId', () => {
    const items: BangumiItem[] = [
      { subjectId: 1, name: 'Original', nameCn: '', cover: '', score: 5, rate: 0, type: 3, epStatus: 0, volStatus: 0, eps: 0, updatedAt: '', tags: [] },
    ];
    const overrides: BangumiItem[] = [
      { subjectId: 1, name: 'Override', nameCn: '覆盖', cover: '', score: 10, rate: 0, type: 3, epStatus: 0, volStatus: 0, eps: 0, updatedAt: '', tags: [] },
    ];

    const result = mergeOverrides(items, overrides);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Override');
    expect(result[0].nameCn).toBe('覆盖');
  });

  it('adds new override items not in API data', () => {
    const items: BangumiItem[] = [
      { subjectId: 1, name: 'Existing', nameCn: '', cover: '', score: 0, rate: 0, type: 3, epStatus: 0, volStatus: 0, eps: 0, updatedAt: '', tags: [] },
    ];
    const overrides: BangumiItem[] = [
      { subjectId: 99, name: 'New', nameCn: '', cover: '', score: 0, rate: 0, type: 1, epStatus: 0, volStatus: 0, eps: 0, updatedAt: '', tags: [] },
    ];

    const result = mergeOverrides(items, overrides);
    expect(result).toHaveLength(2);
    expect(result.find(i => i.subjectId === 99)?.name).toBe('New');
  });
});

describe('writeCollectionFiles', () => {
  it('writes anime/books/music to separate JSON files', () => {
    const anime: BangumiItem[] = [{ subjectId: 1, name: 'A', nameCn: '', cover: '', score: 0, rate: 0, type: 2, epStatus: 0, volStatus: 0, eps: 0, updatedAt: '', tags: [] }];
    const books: BangumiItem[] = [{ subjectId: 2, name: 'B', nameCn: '', cover: '', score: 0, rate: 0, type: 1, epStatus: 0, volStatus: 0, eps: 0, updatedAt: '', tags: [] }];
    const music: BangumiItem[] = [];

    writeCollectionFiles({ anime, books, music });

    expect(mockFs.mkdirSync).toHaveBeenCalled();
    expect(mockFs.writeFileSync).toHaveBeenCalledTimes(3);
    // Verify each call writes valid JSON
    const calls = mockFs.writeFileSync.mock.calls;
    expect(JSON.parse(calls[0][1] as string)).toEqual(anime);
    expect(JSON.parse(calls[1][1] as string)).toEqual(books);
    expect(JSON.parse(calls[2][1] as string)).toEqual(music);
  });
});
