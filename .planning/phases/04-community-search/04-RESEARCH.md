# Phase 4: Community + Search - Research

**Researched:** 2026-06-03
**Domain:** Community features (microblog, Bangumi anime/book/music, timeline) + Discovery (Pagefind search, tag cloud, archive, home widgets)
**Confidence:** HIGH

## Summary

Phase 4 delivers the "alive" side of the site: a microblog feed with image lightbox and auto-archiving, Bangumi-driven anime/book/music lists with build-time data fetching, a year-grouped timeline, Pagefind-powered article search, a tag cloud + chronological archive page, and home page widgets (Hitokoto quote, site stats with busuanzi, latest microblog).

The phase builds on established patterns from Phases 1-3: content collections with Zod validation, `BaseLayout.astro` for theming, `TagChips.astro` for chip filtering (reuse for Bangumi status tabs), `ImageLightbox.astro` (reuse for microblog images), and CSS variables for consistent theming. All new pages follow the `src/pages/{feature}.astro` + `src/components/{feature}/` organization pattern.

Key technical decisions are locked in CONTEXT.md: card-based microblog with "load more" pagination, Bangumi API v0 build-time fetch with 12h TTL and manual override, vertical alternating-side timeline, Pagefind articles-only search in the nav bar, and Hitokoto + site stats + latest microblog as home widgets.

**Primary recommendation:** Follow the existing content collection + component patterns exactly. Reuse `TagChips.astro` for Bangumi status tabs, reuse `ImageLightbox.astro` for microblog lightbox, and integrate Pagefind via `astro-pagefind` v2.0.0 with the new Component UI (`pagefind-searchbox`).

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Microblog pages | API / Backend (build-time) | Browser / Client (pagination JS) | Content fetched from markdown files at build time; pagination is client-side "load more" |
| Bangumi data fetch | API / Backend (build-time) | CDN / Static (cached JSON) | Build-time script fetches from Bangumi API, writes to `src/data/bangumi.json` |
| Timeline | API / Backend (build-time) | — | Pure static content from markdown collection |
| Pagefind search | CDN / Static (index files) | Browser / Client (search UI) | Index built at build time, search runs entirely client-side |
| Tag cloud + archive | API / Backend (build-time) | — | Computed from article collection at build time |
| Home widgets | Browser / Client (Hitokoto fetch) | API / Backend (stats computed at build) | Hitokoto is client-side fetch; stats are build-time computed |
| Busuanzi visitors | Browser / Client (script) | — | Third-party script populates span elements client-side |

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `astro-pagefind` | `2.0.0` | Astro integration for Pagefind static search | Official integration, handles build pipeline + Component UI wiring. Published 3 weeks ago, active maintainer (shishkin). [VERIFIED: npm registry] |
| `pagefind` | `^1.5.2` | Static search indexer + Component UI | Build-time indexer, zero infrastructure, CJK support, ~100-300kB index. Bundled as dependency of `astro-pagefind`. [VERIFIED: npm registry] |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Bangumi API v0 | — (REST API, no SDK) | Anime/book/music collection data | Build-time fetch via native `fetch()` — no SDK needed. Endpoint: `GET /v0/users/{username}/collections`. [VERIFIED: bangumi/server OpenAPI spec] |
| Hitokoto API v1 | — (REST API, no SDK) | Random quote widget | Client-side fetch from `https://v1.hitokoto.cn/`. [ASSUMED — endpoint from training data, could not fetch live docs] |
| Busuanzi | — (external script) | Visitor counter | Script from `https://busuanzi.icodeq.com/busuanzi.pure.mini.js`. Populates `busuanzi_value_site_uv` span. [VERIFIED: busuanzi.icodeq.com] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `astro-pagefind` | Manual Pagefind CLI in build script | More control but loses dev-mode index serving + Astro view transitions support |
| Pagefind Component UI | Pagefind Default UI | Default UI is superseded by Component UI as of Pagefind 1.5.0; Component UI has better keyboard nav + custom templates |
| Bangumi API direct fetch | `bangumi-api` npm package | Unnecessary abstraction; native `fetch()` is simpler for build-time-only usage |
| Busuanzi self-hosted | Busuanzi icodeq CDN | Self-hosting adds complexity; CDN is sufficient for v1 |

**Installation:**
```bash
pnpm add astro-pagefind
```

Bangumi, Hitokoto, and Busuanzi require no npm packages — they are REST APIs and external scripts.

## Package Legitimacy Audit

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| `astro-pagefind` | npm | ~2 years (v1.0.0 ~2024) | Active | github.com/shishkin/astro-pagefind | [OK] | Approved |
| `pagefind` | npm | ~3 years | Active | github.com/CloudCannon/pagefind | [OK] | Approved |

**Packages removed due to slopcheck [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

*Note: slopcheck was not available at research time. Packages verified via npm registry + GitHub repo existence. Both are well-established with multi-year history and active maintenance.*

## Architecture Patterns

### System Architecture Diagram

```
[Build Time]
  |
  +-- Bangumi API v0 ──fetch──> src/data/bangumi.json (cached, 12h TTL)
  |                               └── merged with bangumi-override.json
  |
  +-- Content Collections ──glob()──> microblog/*.md, timeline/*.md
  |   └── Zod schema validation
  |
  +-- Astro Build ──> dist/
  |   ├── /microblog (paginated, 10/page)
  |   ├── /anime, /books, /music (Bangumi card grids)
  |   ├── /timeline (alternating milestones)
  |   ├── /archive (tag cloud + chronological)
  |   └── / (home: Hitokoto + stats + latest microblog)
  |
  +-- Pagefind Indexer ──> dist/pagefind/ (search index files)
      └── excludes microblog via data-pagefind-filter

[Client Time]
  |
  +-- pagefind-searchbox ──> instant article search (nav bar)
  +-- Hitokoto API ──> random quote (client-side fetch)
  +-- Busuanzi script ──> visitor count (client-side)
  +-- "Load more" JS ──> microblog pagination
  +-- Tab toggle JS ──> Bangumi status filtering
```

### Recommended Project Structure

```
src/
├── components/
│   ├── microblog/
│   │   ├── MicroblogCard.astro       # Individual post card
│   │   ├── MicroblogFeed.astro        # Paginated feed container
│   │   └── MicroblogLightbox.astro    # Reuse medium-zoom pattern
│   ├── bangumi/
│   │   ├── BangumiCard.astro          # Media card (cover, title, rating, progress)
│   │   ├── BangumiGrid.astro          # Card grid layout
│   │   └── BangumiStatusTabs.astro    # 全部/在看/看过/想看 toggle
│   ├── timeline/
│   │   ├── TimelineEntry.astro        # Single milestone entry
│   │   └── TimelineYear.astro         # Year group with header
│   ├── search/
│   │   └── SearchBar.astro            # Nav bar search integration
│   ├── archive/
│   │   ├── TagCloud.astro             # Tag cloud with size scaling
│   │   └── ArchiveList.astro          # Chronological article list
│   └── home/
│       ├── Hitokoto.astro             # (exists) Upgrade with real API fetch
│       ├── SiteStats.astro            # (exists) Add runtime + busuanzi
│       └── LatestMicroblog.astro      # (exists) Already shows 5 latest
├── data/
│   ├── bangumi.json                   # Bangumi cache (new)
│   └── bangumi-override.json          # Manual override (new)
├── pages/
│   ├── microblog/
│   │   └── index.astro                # Microblog feed page
│   ├── anime.astro                    # Anime list page
│   ├── books.astro                    # Books list page
│   ├── music.astro                    # Music list page
│   ├── timeline.astro                 # Timeline page
│   └── archive.astro                  # Tag cloud + archive page
└── utils/
    ├── bangumi.ts                     # Bangumi fetch + cache logic
    ├── reading-time.ts                # (exists) Reuse for word count
    └── word-count.ts                  # Article word count utility
```

### Pattern 1: Content Collection with Zod Schema (Bangumi Data)

**What:** Define Zod schemas for anime/books/music collections. Currently placeholder schemas exist — Phase 4 fills them with real field validation.

**When to use:** For all three Bangumi-driven collections (anime, books, music).

**Example:**
```typescript
// src/content.config.ts — updated anime schema
// Source: Bangumi API v0 UserSubjectCollection + SlimSubject schemas
const anime = defineCollection({
  loader: file('./src/content/anime/list.json'),
  schema: z.array(z.object({
    subjectId: z.number(),
    subjectType: z.number(),       // 2 = anime
    name: z.string(),
    nameCn: z.string().default(''),
    cover: z.string().url(),
    score: z.number().default(0),
    rate: z.number().default(0),    // user rating
    type: z.number(),               // 1=wish, 2=done, 3=doing, 4=on_hold, 5=dropped
    epStatus: z.number().default(0),
    volStatus: z.number().default(0),
    eps: z.number().default(0),     // total episodes
    tags: z.array(z.string()).default([]),
    updatedAt: z.string().optional(),
    comment: z.string().optional(),
    isOverride: z.boolean().default(false),
  })),
});
```

### Pattern 2: Build-Time Fetch with Cache + Override

**What:** Fetch Bangumi data at build time, cache to JSON, merge with manual overrides.

**When to use:** For INFRA-05 Bangumi integration.

**Example:**
```typescript
// src/utils/bangumi.ts
// Source: Bangumi API GET /v0/users/{username}/collections
const BANGUMI_USERNAME = import.meta.env.BANGUMI_USERNAME;
const CACHE_FILE = './src/data/bangumi.json';
const OVERRIDE_FILE = './src/data/bangumi-override.json';
const TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

async function fetchCollections(subjectType: number): Promise<BangumiItem[]> {
  const allItems: BangumiItem[] = [];
  let offset = 0;
  const limit = 50; // Bangumi API max

  while (true) {
    const url = `https://api.bgm.tv/v0/users/${BANGUMI_USERNAME}/collections` +
      `?subject_type=${subjectType}&limit=${limit}&offset=${offset}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'merlinalex.me/1.0 (Astro build)' }
    });
    if (!res.ok) break;
    const data = await res.json();
    allItems.push(...data.data);
    if (allItems.length >= data.total) break;
    offset += limit;
  }
  return allItems;
}
```

### Pattern 3: Client-Side "Load More" Pagination

**What:** Page-based pagination with a "加载更多" button, 10 posts per page.

**When to use:** For microblog feed (PAGE-09).

**Example:**
```astro
---
// src/pages/microblog/index.astro
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import MicroblogCard from '../../components/microblog/MicroblogCard.astro';

const allPosts = await getCollection('microblog');
const sorted = [...allPosts].sort(
  (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime()
);
const PAGE_SIZE = 10;
const initialPosts = sorted.slice(0, PAGE_SIZE);
const hasMore = sorted.length > PAGE_SIZE;
---

<BaseLayout title="说说" description="碎碎念 — merlinalex.me">
  <section class="microblog-page">
    <h1>说说</h1>
    <div id="microblog-feed" data-page-size={PAGE_SIZE}>
      {initialPosts.map(post => <MicroblogCard post={post} />)}
    </div>
    {hasMore && (
      <button id="load-more" class="load-more-btn">加载更多</button>
    )}
  </section>
</BaseLayout>

<script>
  // Client-side pagination: fetch remaining posts from pre-built JSON
  // or use Astro's static JSON endpoint
</script>
```

### Pattern 4: Pagefind Integration with Component UI

**What:** Add Pagefind search to the nav bar using `astro-pagefind` + `pagefind-searchbox`.

**When to use:** For DISC-02 search requirement.

**Example:**
```astro
---
// In Nav.astro or a new SearchBar.astro component
import PagefindConfig from 'astro-pagefind/components/PagefindConfig.astro';
---

<PagefindConfig />
<pagefind-searchbox
  placeholder="搜索文章..."
  shortcut="/"
  max-results="10"
  instance="search"
></pagefind-searchbox>
```

```astro
---
// In article layout — mark content for indexing
---
<article data-pagefind-body>
  <!-- article content indexed by Pagefind -->
</article>

<!-- In microblog layout — exclude from search -->
<div data-pagefind-filter="exclude">
  <!-- microblog content NOT indexed -->
</div>
```

### Pattern 5: Client-Side API Fetch (Hitokoto)

**What:** Fetch random quote from Hitokoto API client-side for variety on each visit.

**When to use:** For home page Hitokoto widget.

**Example:**
```astro
---
// src/components/home/Hitokoto.astro — upgrade from placeholder
---
<aside class="hitokoto" aria-label="一言">
  <span id="hitokoto-text">「 加载中... 」</span>
  <span id="hitokoto-from" class="hitokoto-from"></span>
</aside>

<script>
  async function loadHitokoto() {
    try {
      const res = await fetch('https://v1.hitokoto.cn/?encode=json');
      const data = await res.json();
      document.getElementById('hitokoto-text')!.textContent =
        `「 ${data.hitokoto} 」`;
      if (data.from) {
        document.getElementById('hitokoto-from')!.textContent =
          `—— ${data.from_who || ''}《${data.from}》`;
      }
    } catch {
      // Silent fail — keep placeholder text
    }
  }
  loadHitokoto();
</script>
```

### Anti-Patterns to Avoid

- **Bangumi data in client-side JS:** Never fetch Bangumi data client-side — it would expose the username, hit rate limits, and add latency. Always build-time fetch + cache.
- **Microblog in Pagefind index:** Microblog posts dilute the search index and are not articles. Use `data-pagefind-filter="exclude"` on microblog pages.
- **Hardcoded Bangumi username:** Use environment variable `BANGUMI_USERNAME` so it's configurable per deployment.
- **Synchronous Hitokoto fetch:** Always use `async/await` with try/catch — the API may be slow or down. Silent failure with fallback text is correct.
- **Busuanzi in `<head>`:** The script must be `async` and placed at end of `<body>` or in a component — never blocking.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Site search | Custom inverted index + JS | `astro-pagefind` + Pagefind Component UI | Pagefind handles CJK tokenization, index compression (~100-300kB), keyboard navigation, and IntersectionObserver lazy loading |
| Bangumi data fetching | Custom retry/circuit-breaker logic | Simple fetch loop with error boundary | Build-time only; if API is down, use cached data. No need for complex resilience patterns |
| Tag cloud sizing | Custom algorithm | CSS `font-size` scaling based on count percentile | Simple: map tag count to a size range (e.g., 14px-28px) |
| Microblog image lightbox | New lightbox component | Reuse `ImageLightbox.astro` from Phase 2 | Same medium-zoom pattern works for microblog images |
| Bangumi status tabs | New tab component | Reuse `TagChips.astro` pattern from Phase 2 | Same horizontal chip filtering, different data source |

## Runtime State Inventory

> Not applicable — Phase 4 is greenfield (new pages and features), not a rename/refactor/migration phase. No existing runtime state to inventory.

## Common Pitfalls

### Pitfall 1: Bangumi API 429 Rate Limit on Large Collections
**What goes wrong:** Users with 500+ anime/book/music entries hit the Bangumi API rate limit during build.
**Why it happens:** Each page of results is 50 items max; 500 items = 10 sequential requests per collection type (3 types = 30 requests total).
**How to avoid:** Cache to `src/data/bangumi.json` with 12h TTL. Only refresh when cache is stale or via manual trigger. Use prebuild script that checks cache age before fetching.
**Warning signs:** Build fails with HTTP 429; `bangumi.json` not updated.

### Pitfall 2: Pagefind Index Excludes Wrong Content
**What goes wrong:** Microblog posts appear in search results, or articles are excluded.
**Why it happens:** Missing `data-pagefind-filter="exclude"` on microblog pages, or `data-pagefind-body` placed too broadly.
**How to avoid:** Mark microblog pages with `data-pagefind-filter="exclude"`. Use `data-pagefind-body` only on article content areas. Test by searching for a known microblog phrase — it should not appear.
**Warning signs:** Search returns microblog results; article content missing from results.

### Pitfall 3: Bangumi Cover Images Hotlinking
**What goes wrong:** Bangumi CDN blocks or throttles image requests from the site.
**Why it happens:** Bangumi cover images are served from their CDN; excessive requests may be throttled.
**How to avoid:** Use `astro:assets` to optimize and cache Bangumi cover images at build time. Alternatively, proxy through Cloudflare's CDN. Store local copies in `public/bangumi-covers/` if needed.
**Warning signs:** Broken images on anime/book/music pages; console errors about CORS or 403.

### Pitfall 4: Busuanzi Script Blocks First Paint
**What goes wrong:** Busuanzi script loaded synchronously delays the site stats rendering.
**Why it happens:** Script tag without `async` or `defer` attribute.
**How to avoid:** Always use `<script async src="...">`. The span elements show empty until the script loads — this is acceptable behavior.
**Warning signs:** Lighthouse "Reduce render-blocking resources" warning.

### Pitfall 5: Hitokoto API CORS or Downtime
**What goes wrong:** Hitokoto API returns CORS error or is temporarily down.
**Why it happens:** The API may have CORS restrictions or maintenance windows.
**How to avoid:** Use try/catch with silent fallback. Keep the placeholder text "「 一言 」" as default. Never let Hitokoto failure break the page.
**Warning signs:** Empty quote section; console CORS errors.

### Pitfall 6: Microblog Pagination Performance with Large Collections
**What goes wrong:** Loading 1000+ microblog posts into memory for pagination is slow.
**Why it happens:** `getCollection('microblog')` loads all posts into memory at build time.
**How to avoid:** For build-time rendering, this is fine (Astro handles it). For client-side "load more", pre-build a JSON endpoint or use Astro's static data. At v1 scale (<100 posts), this is a non-issue.
**Warning signs:** Build time >30s for microblog page.

### Pitfall 7: Timeline Entries Not Sorted
**What goes wrong:** Timeline entries appear in arbitrary order instead of chronological.
**Why it happens:** `glob()` loader returns entries in filesystem order, not date order.
**How to avoid:** Always sort timeline entries by `date` field (newest first) before rendering. Same pattern used for articles sorting.
**Warning signs:** Timeline entries appear random; year headers don't group correctly.

## Code Examples

Verified patterns from official sources:

### Bangumi API Collection Fetch
```typescript
// Source: Bangumi API v0 OpenAPI spec (github.com/bangumi/server/blob/master/openapi/v0.yaml)
// GET /v0/users/{username}/collections
// Query params: subject_type (1=book, 2=anime, 3=music), type (1=wish, 2=done, 3=doing), limit (1-50), offset

const response = await fetch(
  `https://api.bgm.tv/v0/users/${username}/collections?subject_type=2&limit=50&offset=0`,
  { headers: { 'User-Agent': 'merlinalex.me/1.0' } }
);
const data = await response.json();
// data: { total: number, limit: number, offset: number, data: UserSubjectCollection[] }
// Each item: { subject_id, subject_type, rate, type, tags, ep_status, vol_status, updated_at, subject: { id, name, name_cn, images: { large, common, medium, small, grid }, score, eps, ... } }
```

### Pagefind Component UI (astro-pagefind)
```astro
---
// Source: github.com/shishkin/astro-pagefind README
import PagefindConfig from 'astro-pagefind/components/PagefindConfig.astro';
---

<PagefindConfig />
<pagefind-searchbox
  placeholder="搜索文章..."
  shortcut="/"
  max-results="10"
></pagefind-searchbox>
```

### Pagefind Content Marking
```html
<!-- Source: pagefind.app/docs/indexing/ -->
<!-- Mark article content for indexing -->
<article data-pagefind-body>
  <h1>Article Title</h1>
  <p>Article content...</p>
</article>

<!-- Exclude microblog from search -->
<div data-pagefind-filter="exclude">
  <p>Microblog post content...</p>
</div>

<!-- Add custom filter metadata -->
<span data-pagefind-filter="category">tech</span>
<meta data-pagefind-meta="title[content]" content="Article Title">
```

### Busuanzi Integration
```html
<!-- Source: busuanzi.icodeq.com -->
<script async src="https://busuanzi.icodeq.com/busuanzi.pure.mini.js"></script>
<span id="busuanzi_value_site_uv"></span>
```

### Tag Cloud Sizing
```astro
---
// Compute tag sizes based on count percentile
const tagCounts = articles.flatMap(a => a.data.tags).reduce((acc, tag) => {
  acc[tag] = (acc[tag] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

const counts = Object.values(tagCounts);
const max = Math.max(...counts);
const min = Math.min(...counts);

function getTagSize(count: number): string {
  if (max === min) return '16px';
  const ratio = (count - min) / (max - min);
  return `${14 + ratio * 14}px`; // 14px to 28px
}
---
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Pagefind Default UI (`PagefindUI`) | Pagefind Component UI (`pagefind-searchbox`) | Pagefind 1.5.0 | Better keyboard nav, custom templates, IntersectionObserver lazy loading |
| `astro-pagefind` Search.astro | `astro-pagefind` PagefindConfig + native web component | astro-pagefind 2.0.0 | Search.astro now in maintenance mode; use Component UI directly |
| Busuanzi official CDN (`busuanzi.ibruce.info`) | Busuanzi icodeq CDN (`busuanzi.icodeq.com`) | ~2024 | Official CDN unreliable; icodeq self-hosted replacement with FastAPI + Redis |

**Deprecated/outdated:**
- Pagefind Default UI: Superseded by Component UI in Pagefind 1.5.0. Still works but not recommended for new projects.
- `astro-pagefind` `Search.astro` component: In maintenance mode; use `PagefindConfig.astro` + native `pagefind-searchbox` element instead.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Hitokoto API endpoint is `https://v1.hitokoto.cn/?encode=json` | Code Examples | Low — fallback text handles API failure gracefully |
| A2 | Hitokoto API response includes `hitokoto`, `from`, `from_who` fields | Code Examples | Low — code uses optional chaining for `from`/`from_who` |
| A3 | Bangumi API rate limit allows 30 sequential requests per build | Pitfalls | Medium — if rate limit is lower, need to add delays between requests |
| A4 | Bangumi cover images can be hotlinked without CORS issues | Pitfalls | Medium — if blocked, need to proxy or cache images locally |
| A5 | Busuanzi icodeq CDN is reliable and free to use | Standard Stack | Low — fallback is to hide the visitor counter if script fails |

## Open Questions

1. **Bangumi username configuration**
   - What we know: The API requires a username in the URL path
   - What's unclear: What username to use; whether to use env var or hardcoded
   - Recommendation: Use `BANGUMI_USERNAME` env var, document in `.env.example`

2. **Bangumi data refresh strategy**
   - What we know: 12h TTL cache, prebuild script
   - What's unclear: Should the prebuild script run automatically or only on manual trigger?
   - Recommendation: Add `prebuild` script to `package.json` that checks cache age; also support `pnpm bangumi:refresh` for manual override

3. **Microblog "load more" implementation**
   - What we know: 10 posts per page, "加载更多" button
   - What's unclear: Client-side pagination via JSON endpoint vs. full page reload
   - Recommendation: Pre-build a JSON file at `/api/microblog.json` with all posts; client-side JS loads next page from this static file

4. **Pagefind search in nav bar vs. dedicated page**
   - What we know: CONTEXT.md says "search input in the nav bar"
   - What's unclear: Should results appear as dropdown overlay or navigate to a `/search` page?
   - Recommendation: Use `pagefind-searchbox` built-in dropdown (it has a results dropdown by default); no separate page needed

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build runtime | Check needed | Need >=22.0.0 | — |
| pnpm | Package manager | Check needed | Need >=11.x | — |
| Bangumi API | Data source | External service | v0 | Use cached data if API down |
| Hitokoto API | Widget | External service | v1 | Silent fail, show placeholder |
| Busuanzi CDN | Visitor counter | External service | — | Hide counter if script fails |
| Pagefind | Search indexer | npm package | ^1.5.2 | No search feature |

**Missing dependencies with no fallback:**
- Pagefind must be installed via npm — no alternative without significant custom work

**Missing dependencies with fallback:**
- Bangumi API: fallback to cached `bangumi.json`
- Hitokoto API: fallback to placeholder text
- Busuanzi: fallback to hidden counter

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | No user accounts; Bangumi API uses optional access token |
| V3 Session Management | no | No sessions |
| V4 Access Control | no | Public pages only |
| V5 Input Validation | yes | Zod schemas validate all content collection data; Bangumi API response validated before writing to cache |
| V6 Cryptography | no | No sensitive data |

### Known Threat Patterns for Phase 4 Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Bangumi API response injection | Tampering | Validate all API responses with Zod before writing to cache file |
| Hitokoto API XSS via response | Elevation of Privilege | Use `textContent` (not `innerHTML`) when inserting Hitokoto quote into DOM |
| Pagefind index bloat | Denial of Service | Exclude microblog from index; limit index to articles only |
| Busuanzi script MITM | Information Disclosure | Use HTTPS CDN URL; `async` loading prevents blocking |

## Sources

### Primary (HIGH confidence)
- Pagefind docs `pagefind.app/docs/` — indexing, filtering, Component UI, searchbox
- astro-pagefind GitHub `github.com/shishkin/astro-pagefind` — installation, configuration, PagefindConfig component
- Bangumi API OpenAPI spec `github.com/bangumi/server/blob/master/openapi/v0.yaml` — collections endpoint, schemas, enums
- npm registry `astro-pagefind@2.0.0` — version, dependencies, publish date
- npm registry `pagefind@1.5.2` — current version
- Busuanzi icodeq `busuanzi.icodeq.com` — script URL, element IDs, integration pattern

### Secondary (MEDIUM confidence)
- Bangumi API SubjectType enum `github.com/bangumi/server/openapi/components/subject_type.yaml` — enum values (1=book, 2=anime, 3=music, 4=game, 6=real)
- Bangumi API SubjectCollectionType enum — collection type values (1=wish, 2=done, 3=doing, 4=on_hold, 5=dropped)
- Bangumi API UserSubjectCollection schema — response fields (subject_id, rate, type, ep_status, vol_status, tags, subject)
- Bangumi API SlimSubject schema — subject fields (id, name, name_cn, images, score, eps, tags)

### Tertiary (LOW confidence)
- Hitokoto API endpoint and response format — from training data, could not fetch live documentation
- Busuanzi reliability claims — community knowledge, not formally documented

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — `astro-pagefind` and Pagefind verified via npm + official docs; Bangumi API verified via OpenAPI spec
- Architecture: HIGH — follows established patterns from Phases 1-3; content collections, component organization, and CSS variables already proven
- Pitfalls: MEDIUM — Bangumi rate limits and CORS behavior are ASSUMED from training data; Hitokoto API details are ASSUMED

**Research date:** 2026-06-03
**Valid until:** 2026-07-03 (30 days — stable technologies, API contracts unlikely to change)
