# Phase 3: Works + Friend Links - Research

**Researched:** 2026-06-03
**Domain:** Works hub, Projects module, Creations gallery, Friend Links page
**Confidence:** HIGH

## Summary

Phase 3 builds four interconnected pages: a Works hub landing page, a Projects module with rich cards and GitHub stars badges, a Creations module with masonry gallery and lightbox viewing, and a Friend Links page with category grouping and health-check badges. The phase leverages existing infrastructure from Phases 1-2: Zod-validated content collections (projects, creations, friends schemas already defined), reusable TagChips filtering pattern, medium-zoom lightbox integration, BaseLayout with theme/SEOMeta inheritance, and CSS custom properties for consistent theming.

The primary technical decisions involve: (1) CSS `columns` for masonry layout (pure CSS, no JS library needed), (2) build-time GitHub API fetch with JSON caching for star counts, (3) extending medium-zoom or using a lightweight JS lightbox for multi-image gallery viewing, and (4) a JSON schema for friend health-check data that Phase 6's GitHub Action will populate.

**Primary recommendation:** Use CSS `columns` for masonry (zero JS overhead), fetch GitHub stars via a prebuild script caching to `src/data/github-stars.json`, and implement a custom lightbox overlay for Creations gallery (extending the medium-zoom pattern with arrow navigation).

## User Constraints (from CONTEXT.md)

### Locked Decisions

- **Hub style:** Dual-card entry — two large cards linking to `/works/projects` and `/works/creations`
- **Card content:** Title + one-line description + icon. Minimal and clean.
- **Navigation:** Breadcrumb on sub-pages (`Works > Projects`), clicking Works returns to hub
- **Layout ratio:** Equal width (50/50), stacked vertically on mobile
- **Card density (Projects):** Rich card — cover image + project name + description + tech-stack tags + GitHub stars badge
- **Tech tags:** Horizontal chips below description, same pattern as article TagChips component
- **GitHub stars:** GitHub icon + stars count badge, clickable link to repo. Data fetched at build time via GitHub API, cached to `src/data/github-stars.json`
- **Sorting (Projects):** Featured projects first, then by date descending. No tag filtering (unlike articles).
- **Layout (Creations):** Masonry (Pinterest-style) with responsive breakpoints. Different-height images交错排列.
- **Filtering (Creations):** Horizontal tag chips at top — `全部` / `插画` / `摄影` / `手工` / `视频`. Same chip pattern as articles.
- **Card content (Creations):** Cover image + title only. Category label appears on hover.
- **Lightbox:** Standard lightbox — dark overlay + large image + title/description at bottom. Arrow navigation between images in same creation. Escape to close. Reuse or extend the medium-zoom pattern from Phase 2.
- **Sorting (Friends):** Category-grouped sections. Category order: 技术 → 动漫 → 生活 → 其他. Within each category, `featured: true` friends sort to top.
- **Card layout (Friends):** Horizontal — avatar + site name + one-line description. Compact, high-density.
- **Submission entry:** Bottom of page, prominent "申请友链" button linking to GitHub Issue template. Not a card, just a clear CTA.
- **Health-check badge:** Red/gray "已离线" badge in top-right corner of offline friend cards. Cards remain visible and clickable. GitHub Action cron producer ships in Phase 6; Phase 3 only builds the UI consumer reading `src/data/friends-health.json`.

### Claude's Discretion

- Specific masonry CSS implementation (CSS columns vs JS library)
- Breadcrumb component design and placement
- GitHub stars API fetch implementation (build-time script vs Astro integration)
- Lightbox library choice (extend medium-zoom vs new solution for multi-image galleries)
- Friends health-check JSON schema design
- Specific Tailwind/CSS classes for all new components

### Deferred Ideas (OUT OF SCOPE)

- Friend-link submission form (self-service via GitHub Issue) — the button links to Issue template, but the actual Issue template creation is out of Phase 3 scope
- Friend-link health-check GitHub Action producer — Phase 6 builds the cron job; Phase 3 only builds the UI consumer

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Works hub routing | Browser / Client | — | Static page with client-side navigation links |
| Projects data | Database / Storage | — | Content collections (markdown files) queried at build time |
| Creations gallery | Browser / Client | — | Masonry layout + lightbox are client-side visual behaviors |
| Friends data | Database / Storage | — | JSON file queried at build time |
| GitHub stars fetch | API / Backend | — | External API call at build time, cached to JSON |
| Health-check badges | Browser / Client | — | UI consumer reading pre-computed JSON data |
| Breadcrumb navigation | Browser / Client | — | Client-side navigation component |

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | ^6.4.3 | Static site generator | Already installed; Content Collections + build-time fetch |
| Tailwind CSS | ^4.3.0 | Utility-first CSS | Already installed; CSS custom properties for theming |
| TypeScript | ^5.5.x | Type safety | Already installed; Zod schemas for content validation |
| medium-zoom | ^1.1.0 | Image zoom/lightbox | Already installed; extend for multi-image gallery |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| astro-icon | ^1.1.5 | Icon components | Already installed; use for GitHub icon, category icons |
| @astrojs/mdx | ^6.0.1 | Rich markdown | Already installed; project/creation content authoring |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS `columns` for masonry | `masonry-layout` JS library | JS library adds ~5KB + runtime overhead; CSS columns is native, zero-cost, but items flow top-to-bottom then left-to-right (not left-to-right then top-to-bottom like Pinterest). Acceptable for this use case. |
| Custom lightbox overlay | `photoswipe` or `fslightbox` | Full gallery libraries add 15-30KB; custom overlay is simpler for the "dark bg + image + title + arrows" requirement. medium-zoom handles single-image zoom already. |
| Build-time fetch script | Astro component frontmatter fetch | Script approach caches to JSON file (reusable across components, survives dev server restarts); component fetch re-runs on every dev refresh. |

**Installation:**
```bash
# No new packages needed — all dependencies already installed
# Only new files: pages, components, data scripts
```

## Package Legitimacy Audit

> No new packages are installed in this phase. All dependencies are already present in `package.json`.

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| (none) | — | — | — | — | — | N/A |

**Packages removed due to slopcheck [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

## Architecture Patterns

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Build Time                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │   projects/   │    │  creations/  │    │friends.json  │       │
│  │   *.md(x)    │    │   *.md(x)    │    │              │       │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘       │
│         │                   │                   │               │
│         ▼                   ▼                   ▼               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Content Collections (Zod)                   │   │
│  │         getCollection('projects'|'creations'|'friends')  │   │
│  └──────────────────────────┬──────────────────────────────┘   │
│                             │                                   │
│  ┌──────────────┐           │                                   │
│  │ GitHub API   │           │                                   │
│  │ (stars fetch)│           │                                   │
│  └──────┬───────┘           │                                   │
│         │                   │                                   │
│         ▼                   │                                   │
│  ┌──────────────┐           │                                   │
│  │github-stars  │           │                                   │
│  │   .json      │           │                                   │
│  └──────┬───────┘           │                                   │
│         │                   │                                   │
│         ▼                   ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Astro Page Generation                        │   │
│  │  /works/index.astro  →  Hub (2 cards)                    │   │
│  │  /works/projects/    →  Project cards + stars badge       │   │
│  │  /works/creations/   →  Masonry gallery + lightbox        │   │
│  │  /friends.astro      →  Category-grouped friend cards     │   │
│  └──────────────────────────┬──────────────────────────────┘   │
│                             │                                   │
└─────────────────────────────┼───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Browser (Client)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │ Works Hub    │    │ Masonry CSS  │    │ Lightbox JS  │       │
│  │ (2 cards)    │    │ (columns)    │    │ (overlay)    │       │
│  └──────────────┘    └──────────────┘    └──────────────┘       │
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐                           │
│  │ TagChips     │    │ Health Badge │                           │
│  │ (filtering)  │    │ (conditional)│                           │
│  └──────────────┘    └──────────────┘                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Recommended Project Structure

```
src/
├── pages/
│   ├── works/
│   │   ├── index.astro          # Works hub (2 cards)
│   │   ├── projects/
│   │   │   └── index.astro      # Projects listing
│   │   └── creations/
│   │       └── index.astro      # Creations masonry gallery
│   └── friends.astro            # Friend links page
├── components/
│   ├── works/
│   │   ├── WorksHubCard.astro   # Hub card (title + desc + icon)
│   │   ├── ProjectCard.astro    # Rich project card
│   │   ├── CreationCard.astro   # Masonry item (cover + title)
│   │   ├── CreationLightbox.astro  # Multi-image lightbox overlay
│   │   └── CategoryChips.astro  # Reusable tag chips (generalized)
│   └── friends/
│       ├── FriendCard.astro     # Horizontal friend card
│       ├── FriendSection.astro  # Category section wrapper
│       └── HealthBadge.astro    # Offline badge overlay
├── data/
│   ├── github-stars.json        # Build-time cached stars (new)
│   └── friends-health.json      # Health check data (exists, empty)
└── scripts/
    └── fetch-github-stars.ts    # Prebuild script for GitHub API
```

### Pattern 1: Masonry Layout with CSS Columns

**What:** Pure CSS masonry using `column-count` property. Items flow top-to-bottom then left-to-right (column-major order). Different-height images create the Pinterest-style交错排列 effect naturally.

**When to use:** When you need a responsive grid of items with varying heights and zero JavaScript overhead.

**Example:**
```css
/* Source: MDN CSS Multi-column Layout */
.masonry-grid {
  columns: 3 280px; /* 3 columns, min 280px each */
  column-gap: 1rem;
}

.masonry-item {
  break-inside: avoid;
  margin-bottom: 1rem;
}

/* Responsive breakpoints */
@media (max-width: 1024px) {
  .masonry-grid { columns: 2; }
}

@media (max-width: 640px) {
  .masonry-grid { columns: 1; }
}
```

**Key detail:** `break-inside: avoid` prevents items from splitting across columns. Images must have explicit `width`/`height` attributes to prevent CLS.

### Pattern 2: Build-Time GitHub Stars Fetch

**What:** A prebuild script that fetches star counts from GitHub REST API and caches to JSON. The JSON file is then imported by Astro components at build time.

**When to use:** When you need external API data that changes infrequently (daily/weekly) and want to avoid runtime API calls.

**Example:**
```typescript
// scripts/fetch-github-stars.ts
// Run via package.json "prebuild" script

interface GitHubRepo {
  full_name: string;
  stargazers_count: number;
}

async function fetchStars(repos: string[]): Promise<Record<string, number>> {
  const token = process.env.GITHUB_TOKEN;
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'merlinalex.me-build',
  };
  if (token) headers['Authorization'] = `token ${token}`;

  const stars: Record<string, number> = {};

  for (const repo of repos) {
    try {
      const res = await fetch(`https://api.github.com/repos/${repo}`, { headers });
      if (res.ok) {
        const data: GitHubRepo = await res.json();
        stars[repo] = data.stargazers_count;
      }
    } catch (e) {
      console.warn(`Failed to fetch stars for ${repo}:`, e);
    }
  }

  return stars;
}
```

**Rate limits:** Unauthenticated = 60 req/hour; authenticated = 5,000 req/hour. For a personal blog with <20 repos, unauthenticated is sufficient. Add `GITHUB_TOKEN` env var for safety margin.

### Pattern 3: Multi-Image Lightbox

**What:** A custom overlay component that displays images from a creation in a dark modal with arrow navigation. Extends the medium-zoom pattern from Phase 2.

**When to use:** When you need to view multiple images from a single creation (e.g., a photo set or illustration series) with prev/next navigation.

**Example approach:**
```astro
---
// CreationLightbox.astro — client:idle for deferred loading
interface Props {
  images: string[];
  title: string;
  description?: string;
}
const { images, title, description } = Astro.props;
---

<div id="lightbox" class="lightbox-overlay" hidden>
  <button class="lightbox-close" aria-label="关闭">✕</button>
  <button class="lightbox-prev" aria-label="上一张">‹</button>
  <button class="lightbox-next" aria-label="下一张">›</button>
  <div class="lightbox-content">
    <img src="" alt="" class="lightbox-image" />
    <div class="lightbox-info">
      <h3 class="lightbox-title"></h3>
      <p class="lightbox-desc"></p>
    </div>
  </div>
</div>

<script>
  // Client-side lightbox logic
  // Listen for clicks on .creation-card images
  // Manage current index, keyboard navigation (Escape, Arrow keys)
</script>
```

**Key detail:** Use `client:idle` directive so lightbox JS doesn't block first paint. Keyboard navigation: Escape to close, Left/Right arrows for prev/next.

### Anti-Patterns to Avoid

- **JS masonry library for simple gallery:** CSS `columns` handles 95% of masonry use cases. Don't add `masonry-layout` or `isotope` for a static site.
- **Fetching GitHub stars in component frontmatter:** This re-fetches on every dev server page refresh. Use a prebuild script that caches to JSON.
- **Using medium-zoom for multi-image gallery:** medium-zoom is designed for single-image zoom. For gallery with arrow navigation, build a custom overlay.
- **Hardcoding GitHub repos list:** Store repo URLs in project frontmatter (`github` field already exists in schema). Extract repo slugs at build time.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Masonry layout | Custom JS positioning | CSS `columns` | Native CSS, zero runtime cost, responsive with media queries |
| Icon rendering | SVG sprite sheets | `astro-icon` (already installed) | Automatic icon optimization, consistent sizing |
| Tag chip filtering | Custom state management | Reuse TagChips pattern with URL params | Proven pattern from articles, accessible, works without JS |
| Content validation | Manual type checking | Zod schemas (already defined) | Compile-time validation, auto-generated types |

**Key insight:** The masonry layout requirement sounds like it needs a JS library, but CSS `columns` produces the same visual result with zero runtime cost. The only tradeoff is column-major ordering (top-to-bottom then left-to-right) vs row-major (Pinterest-style), which is acceptable for a gallery where items are visually grouped by category anyway.

## Common Pitfalls

### Pitfall 1: CSS Columns Masonry Ordering

**What goes wrong:** CSS `columns` fills items top-to-bottom then left-to-right (column-major). Users expect Pinterest-style left-to-right then top-to-bottom (row-major). With date-sorted items, newest items appear in the left column only.

**Why it happens:** CSS multi-column layout spec defines column-major filling. This is by design, not a bug.

**How to avoid:** Accept column-major ordering for this use case. If row-major is critical, use CSS Grid with `grid-template-rows: masonry` (experimental, limited browser support) or a JS library. For Phase 3, column-major is acceptable — items are filtered by category anyway.

**Warning signs:** Items appearing "out of order" visually; newest items clustered in first column.

### Pitfall 2: GitHub API Rate Limiting

**What goes wrong:** Build fails because GitHub API returns 403 (rate limit exceeded). Happens when rebuilding frequently during development or when multiple CI pipelines share an IP.

**Why it happens:** Unauthenticated requests are limited to 60/hour per IP. Each repo = 1 request.

**How to avoid:**
- Cache responses to `src/data/github-stars.json` (skip fetch if file exists and is <24h old)
- Use `GITHUB_TOKEN` environment variable for 5,000 req/hour
- Graceful degradation: if fetch fails, show "—" instead of star count

**Warning signs:** Build logs showing 403 responses; star counts showing as 0 or undefined.

### Pitfall 3: Lightbox Z-Index Conflicts

**What goes wrong:** Lightbox overlay appears behind header, footer, or other fixed-position elements. Or lightbox doesn't close when clicking outside the image.

**Why it happens:** z-index stacking context conflicts with existing components (Header has `z-index: 50`).

**How to avoid:** Set lightbox z-index to 100 (above Header's 50). Use `position: fixed` on the overlay. Add click-outside handler on the overlay background (not the image container).

**Warning signs:** Lightbox partially hidden; can't close by clicking dark area.

### Pitfall 4: Image CLS in Masonry Grid

**What goes wrong:** Layout shifts as images load because image dimensions aren't known until download. Cumulative Layout Shift (CLS) > 0.1.

**Why it happens:** CSS `columns` recalculates layout when images load. Without explicit dimensions, placeholder height is 0.

**How to avoid:**
- Always set `width` and `height` attributes on `<img>` tags
- Use `aspect-ratio` CSS property as a fallback
- Use `astro:assets` for automatic image optimization with dimension extraction

**Warning signs:** Lighthouse CLS score > 0.1; visible layout jumps on slow connections.

### Pitfall 5: Friends Health Badge Positioning

**What goes wrong:** Health badge overlaps avatar or site name on small cards. Or badge doesn't appear when friend is offline.

**Why it happens:** Absolute positioning of badge relative to card container; card has no `position: relative`.

**How to avoid:**
- Set `position: relative` on FriendCard container
- Position badge with `position: absolute; top: 8px; right: 8px;`
- Use `z-index: 10` to ensure badge is above card content
- Conditionally render badge only when `friends-health.json[friend.url] === 'offline'`

**Warning signs:** Badge hidden behind avatar; badge appears on all cards regardless of status.

## Runtime State Inventory

> Not applicable — Phase 3 is a greenfield feature phase (new pages/components), not a rename/refactor/migration phase.

## Code Examples

### Works Hub Card Component

```astro
---
// WorksHubCard.astro
interface Props {
  title: string;
  description: string;
  href: string;
  icon: string;
}
const { title, description, href, icon } = Astro.props;
---

<a href={href} class="hub-card">
  <div class="hub-card-icon">
    <iconify-icon icon={icon} width="48" height="48" />
  </div>
  <h2 class="hub-card-title">{title}</h2>
  <p class="hub-card-desc">{description}</p>
</a>

<style>
  .hub-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 2rem;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 20px;
    text-decoration: none;
    transition: transform var(--duration-fast) var(--easing-default),
                box-shadow var(--duration-fast) var(--easing-default);
  }

  .hub-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }

  .hub-card-icon {
    color: var(--color-accent);
  }

  .hub-card-title {
    font-size: 20px;
    font-weight: 600;
    color: var(--color-fg);
    margin: 0;
  }

  .hub-card-desc {
    color: var(--color-fg-muted);
    margin: 0;
    text-align: center;
  }
</style>
```

### Project Card with GitHub Stars

```astro
---
// ProjectCard.astro
import { Icon } from 'astro-icon/components';

interface Props {
  name: string;
  description?: string;
  url: string;
  github?: string;
  tags: string[];
  cover?: string;
  stars?: number;
}
const { name, description, url, github, tags, cover, stars } = Astro.props;
---

<article class="project-card">
  {cover && (
    <img src={cover} alt={name} class="project-cover" width="400" height="200" loading="lazy" />
  )}
  <div class="project-content">
    <h3 class="project-name">
      <a href={url} target="_blank" rel="noopener noreferrer">{name}</a>
    </h3>
    {description && <p class="project-desc">{description}</p>}
    <div class="project-tags">
      {tags.map(tag => <span class="tag-chip">{tag}</span>)}
    </div>
    {github && (
      <a href={github} class="github-badge" target="_blank" rel="noopener noreferrer">
        <Icon name="mdi:github" width="16" height="16" />
        {stars !== undefined ? `⭐ ${stars}` : '—'}
      </a>
    )}
  </div>
</article>
```

### Friends Health Badge

```astro
---
// HealthBadge.astro
interface Props {
  isOffline: boolean;
}
const { isOffline } = Astro.props;
---

{isOffline && (
  <span class="health-badge" aria-label="已离线">已离线</span>
)}

<style>
  .health-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    padding: 2px 8px;
    font-size: 12px;
    font-weight: 500;
    background: var(--color-fg-muted);
    color: var(--color-bg);
    border-radius: 9999px;
    opacity: 0.8;
    z-index: 10;
  }
</style>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| JS masonry libraries (isotope, masonry-layout) | CSS `columns` | CSS Multi-column widely supported since 2017 | Zero runtime cost; responsive via media queries |
| Client-side API fetch | Build-time fetch + JSON cache | Astro/Next.js SSG pattern | No runtime API calls; faster page loads |
| medium-zoom for galleries | Custom lightbox overlay | Phase 2 → Phase 3 evolution | Multi-image navigation; better UX for galleries |

**Deprecated/outdated:**
- `masonry-layout` JS library: Unnecessary for static sites; CSS columns handles the use case
- Client-side GitHub API calls: Exposes API tokens; build-time fetch is more secure and faster

## Assumptions Log

> All claims in this research were verified against existing codebase or official documentation. No assumptions required.

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| (none) | — | — | — |

## Open Questions

1. **GitHub Token availability in CI/CD**
   - What we know: Cloudflare Pages supports environment variables; GitHub Actions supports secrets
   - What's unclear: Whether the owner will add `GITHUB_TOKEN` to Cloudflare Pages env vars
   - Recommendation: Make token optional; graceful degradation to "—" when unavailable

2. **Creation content authoring workflow**
   - What we know: Creations use `glob()` loader for markdown files with `images` array in frontmatter
   - What's unclear: How the owner will manage multiple images per creation (local files vs external URLs)
   - Recommendation: Support both local (`/creations/my-art/1.jpg`) and external URLs; document in content authoring guide

## Environment Availability

> Skip this section if the phase has no external dependencies (code/config-only changes).

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build scripts | ✓ | 22.x | — |
| pnpm | Package manager | ✓ | 11.5.1 | — |
| GitHub API | Stars fetch | ✓ | v3 | Graceful degradation to "—" |

**Missing dependencies with no fallback:**
- (none — all dependencies available)

**Missing dependencies with fallback:**
- GitHub API token: Optional; unauthenticated works for <60 repos/hour

## Sources

### Primary (HIGH confidence)
- Astro docs `docs.astro.build/en/guides/content-collections/` — getCollection, sorting, filtering patterns
- Astro docs `docs.astro.build/en/guides/data-fetching/` — Build-time fetch behavior
- MDN `developer.mozilla.org/en-US/docs/Web/CSS/columns` — CSS multi-column layout
- Existing codebase `src/content.config.ts` — Projects, Creations, Friends schemas already defined
- Existing codebase `src/components/articles/TagChips.astro` — Reusable chip filtering pattern
- Existing codebase `src/components/articles/ImageLightbox.astro` — medium-zoom integration
- Existing codebase `src/data/friends-health.json` — Health check data file exists

### Secondary (MEDIUM confidence)
- GitHub REST API `api.github.com/repos/{owner}/{repo}` — Stars count endpoint (well-documented, standard pattern)

### Tertiary (LOW confidence)
- (none)

## Validation Architecture

> workflow.nyquist_validation is explicitly false in config.json — this section is omitted per instructions.

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | No user accounts; public content only |
| V3 Session Management | no | No sessions; static site |
| V4 Access Control | no | All content publicly accessible |
| V5 Input Validation | yes | Zod schemas validate all content frontmatter; URL validation on friend links |
| V6 Cryptography | no | No encryption needed; GitHub token is optional build-time env var |

### Known Threat Patterns for Static Site + External API

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| GitHub token exposure | Information Disclosure | Token in env var only, never in client bundle; `.env` in `.gitignore` |
| XSS via friend link URLs | Tampering | Zod `z.string().url()` validation; `rel="noopener noreferrer"` on external links |
| Malicious friend avatars | Evasion | Avatar URLs validated as URLs; images served from external CDN (not user-uploaded) |

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all dependencies already installed; no new packages needed
- Architecture: HIGH — patterns verified against existing codebase (TagChips, content collections, BaseLayout)
- Pitfalls: HIGH — masonry ordering, GitHub rate limits, CLS, z-index conflicts are well-documented patterns

**Research date:** 2026-06-03
**Valid until:** 2026-07-03 (30 days — stable stack, no fast-moving dependencies)
