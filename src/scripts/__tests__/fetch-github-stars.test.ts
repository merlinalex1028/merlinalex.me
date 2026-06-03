import { describe, it, expect, vi, beforeEach } from 'vitest';
import { extractOwnerRepo, fetchGitHubStars } from '../fetch-github-stars';

describe('extractOwnerRepo', () => {
  it('extracts owner/repo from github URL', () => {
    expect(extractOwnerRepo('https://github.com/merlinalex/merlinalex.me')).toBe('merlinalex/merlinalex.me');
  });

  it('returns null for non-github URLs', () => {
    expect(extractOwnerRepo('https://gitlab.com/owner/repo')).toBeNull();
  });

  it('returns null for invalid URLs', () => {
    expect(extractOwnerRepo('not-a-url')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(extractOwnerRepo('')).toBeNull();
  });
});

describe('fetchGitHubStars', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns empty object when no projects have github URLs', async () => {
    const result = await fetchGitHubStars([]);
    expect(result).toEqual({});
  });

  it('gracefully degrades on network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));
    const result = await fetchGitHubStars(['owner/repo']);
    expect(result).toEqual({});
  });

  it('returns star counts for successful fetches', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ stargazers_count: 42 }),
    }));
    const result = await fetchGitHubStars(['owner/repo']);
    expect(result).toEqual({ 'owner/repo': 42 });
  });

  it('handles API rate limit gracefully', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
    }));
    const result = await fetchGitHubStars(['owner/repo']);
    expect(result).toEqual({});
  });
});
