import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.resolve(__dirname, '../data/github-stars.json');
const PROJECTS_DIR = path.resolve(__dirname, '../content/projects');
const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Extract "owner/repo" from a GitHub URL.
 * Returns null if the URL is not a valid GitHub repo URL.
 */
export function extractOwnerRepo(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== 'github.com') return null;
    const parts = parsed.pathname.split('/').filter(Boolean);
    if (parts.length < 2) return null;
    return `${parts[0]}/${parts[1]}`;
  } catch {
    return null;
  }
}

/**
 * Fetch star counts from GitHub API for a list of owner/repo slugs.
 * Returns a map of "owner/repo" -> star count.
 * Gracefully degrades: on any failure, returns empty object.
 */
export async function fetchGitHubStars(
  repos: string[]
): Promise<Record<string, number>> {
  if (repos.length === 0) return {};

  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'merlinalex.me-build',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const results: Record<string, number> = {};

  for (const repo of repos) {
    try {
      const response = await fetch(`https://api.github.com/repos/${repo}`, {
        headers,
      });
      if (!response.ok) continue;
      const data = await response.json();
      results[repo] = data.stargazers_count;
    } catch {
      // Graceful degradation: skip this repo
    }
  }

  return results;
}

/**
 * Read project files, extract GitHub URLs, fetch star counts, write to JSON.
 * Main entry point for build-time execution.
 */
export async function main(): Promise<void> {
  // Check cache freshness
  if (fs.existsSync(DATA_PATH)) {
    const stat = fs.statSync(DATA_PATH);
    const age = Date.now() - stat.mtimeMs;
    if (age < CACHE_MAX_AGE_MS) {
      console.log('[github-stars] Cache is fresh, skipping fetch');
      return;
    }
  }

  // Read project files and extract GitHub URLs
  const repos: string[] = [];
  try {
    const files = fs.readdirSync(PROJECTS_DIR);
    for (const file of files) {
      if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;
      const content = fs.readFileSync(path.join(PROJECTS_DIR, file), 'utf-8');
      // Simple frontmatter extraction
      const match = content.match(/^---\n([\s\S]*?)\n---/);
      if (!match) continue;
      const frontmatter = match[1];
      const githubMatch = frontmatter.match(/github:\s*["']?(https:\/\/github\.com\/[^\s"']+)["']?/);
      if (githubMatch) {
        const slug = extractOwnerRepo(githubMatch[1]);
        if (slug) repos.push(slug);
      }
    }
  } catch {
    console.warn('[github-stars] Could not read project files');
  }

  // Fetch stars
  const stars = await fetchGitHubStars(repos);

  // Write to JSON
  try {
    fs.writeFileSync(DATA_PATH, JSON.stringify(stars, null, 2));
    console.log(`[github-stars] Wrote ${Object.keys(stars).length} entries`);
  } catch {
    console.warn('[github-stars] Could not write github-stars.json');
  }
}

// Run if executed directly
main();
