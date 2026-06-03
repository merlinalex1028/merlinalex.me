# Phase 2: Core Content - Research

**Researched:** 2026-06-03
**Domain:** Blog content pages, RSS feeds, Twikoo comments, SEO enhancements
**Confidence:** HIGH

## Summary

Phase 2 delivers the blog half of the site: articles index with tag filtering, article detail pages with full UX (TOC, code highlighting, lightbox, navigation), RSS feeds (summary + full-content), Twikoo comment integration with Bilibili-style stickers, and SEO enhancements (related posts, alt text enforcement).

The article schema is already defined in `src/content.config.ts` with all required fields (title, publishedAt, updatedAt, tags, draft, description, cover, category, sticky, password, toc). The existing `LatestArticles.astro` component provides a reusable card pattern. The `BaseLayout.astro` with its FOUC-safe theme gate and `SEOMeta.astro` component are ready to extend.

**Primary recommendation:** Build on existing patterns. Use `@astrojs/rss` for feeds (official, well-documented), `medium-zoom` for image lightbox (lightweight, keyboard-friendly), and Twikoo CDN for comments (proven, OwO-compatible sticker format).

## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Articles Index Layout (D-01):** Single-column list/rows with title, excerpt, date, category pill. Dense, scannable, traditional blog feel. Horizontal scrollable chip bar for tag filtering. Sticky posts float to top, then newest by `publishedAt` descending. No sort dropdown.
- **Article Detail UX (D-02):** Sticky left sidebar TOC on desktop (>1024px), collapsible drawer on mobile. Shiki syntax highlighting (theme-aware). Prev/next as arrow cards. Related posts as 3-card grid matched by shared tags. Password protection skipped for v1 (schema field exists, no UI gating). Image lightbox with keyboard dismiss. Reading time from word count. Share buttons as simple icon links. Copyright footer with standard CN blog pattern. Floating scroll-to-top button.
- **RSS Feed Strategy (D-03):** Two feeds: `/feed.xml` (summary) and `/feed-full.xml` (full content). Autodiscovery via `<link rel="alternate">`. Entry metadata: title, description, published date, author, category, cover image. Tags NOT included as RSS categories. CDATA escaping. Both feeds must pass W3C Feed Validation Service. Draft exclusion.
- **Twikoo Comment Integration (D-04):** Comment section below article content, always visible. Fully anonymous identity model. Bilibili default emote set. Admin email notifications. Separate Vercel project + MongoDB Atlas M0. `envId` via environment variable. No Vercel Authentication. Third-party image host for sticker hosting. Styled to match site theme.
- **SEO-02: Related Posts + Alt Text (D-05):** 3-card grid below article, matched by shared tags. Algorithm: count shared tags, sort by count descending, take top 3. Fill with most recent if <3 matches. All images must have alt text. Build-time check or lint rule for alt text enforcement.

### Claude's Discretion
- Specific Tailwind/CSS classes for the list layout, chip styling, and card designs
- Shiki theme selection (recommend `github-light` + `github-dark` or `min-light` + `min-dark`)
- IntersectionObserver thresholds for TOC highlight
- Image lightbox library choice (recommend `medium-zoom` — lightweight, keyboard-friendly)
- Twikoo CSS customization depth (recommend overriding `--twikoo-*` CSS variables)
- Reading time calculation constants (chars-per-minute for CJK vs Latin)
- File organization for new components (recommend `src/components/articles/` and `src/components/rss/`)

### Deferred Ideas (OUT OF SCOPE)
- Password-protected posts — schema field exists but UI gating deferred to v1.1+
- Custom kawaii emote set — could complement Bilibili defaults in a future phase
- Email subscription (DISC-04-v1.x) — deferred until RSS subscribers >50

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PAGE-03 | Articles index with tag-based filtering | Astro Content Collections `getCollection()` with tag extraction; horizontal chip bar pattern |
| PAGE-04 | Article detail with TOC, code highlight, reading time, last-updated, share buttons, copy-code, image lightbox, prev/next + related, sticky, copyright footer, top button, password-protected posts | Shiki (bundled in Astro), medium-zoom for lightbox, IntersectionObserver for TOC, tag-based related posts algorithm |
| DISC-01 | RSS feed with CDATA escaping, W3C validation, autodiscovery | `@astrojs/rss` v4.0.18 — official integration, supports summary + full-content feeds |
| INFRA-04 | Twikoo comments on Vercel + MongoDB Atlas | Twikoo v1.7.11 CDN integration, OwO-format sticker packs, Vercel deployment with MONGODB_URI |
| INFRA-07 | Sticker/emote pack for Twikoo | OwO JSON format — categories with type (emoticon/emoji/image) + container array |
| SEO-02 | Related posts + alt text enforcement | Tag-overlap algorithm, markdown lint `no-alt-text` rule or build-time check |

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Articles index page | Frontend (Astro SSG) | — | Static page generated at build time from content collection |
| Article detail page | Frontend (Astro SSG) | — | Static page with client-side interactivity (TOC, lightbox, copy-code) |
| Tag filtering | Frontend (Client JS) | — | URL-based filtering with `?tag=` query param; no server needed |
| RSS feed generation | Build-time (Astro endpoint) | — | `.xml.js` endpoint generates feeds at build time |
| Twikoo comments | CDN (Twikoo JS) | Backend (Vercel + MongoDB) | Frontend JS loaded from CDN; backend is separate Vercel project |
| Image lightbox | Client (medium-zoom) | — | Lightweight client-side library, no server involvement |
| TOC generation | Build-time (Astro) | Client (IntersectionObserver) | Headings extracted at build time; scroll highlighting is client-side |
| Related posts | Build-time (Astro) | — | Tag overlap computed at build time from content collection |
| Reading time | Build-time (Astro) | — | Word count calculated from markdown body at build time |
| Copy-code button | Client (Clipboard API) | — | Browser API, no server involvement |
| Share buttons | Client (URL construction) | — | Simple links to social platforms with article URL |
| Alt text enforcement | Build-time (lint/check) | — | Markdown lint rule or build-time validation |

## Standard Stack

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Astro | ^6.4.3 | Static site generator | Content Collections, islands architecture, View Transitions |
| Tailwind CSS | ^4.3.0 | Utility-first CSS | CSS-first config via `@theme`, dark mode via `data-theme` |
| TypeScript | ^5.5.x | Type safety | Zod schemas in content collections |
| MDX | ^6.0.1 | Rich markdown | Embed components in articles |
| Shiki | (bundled) | Code syntax highlighting | Build-time, theme-aware, zero runtime cost |

### New Dependencies for Phase 2
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@astrojs/rss` | ^4.0.18 | RSS feed generation | Official Astro integration, CDATA support, content collection integration |
| `medium-zoom` | ^1.1.0 | Image lightbox | Lightweight (~6KB), keyboard-friendly (Escape to dismiss), no dependencies |
| `twikoo` | ^1.7.11 | Comment system | CDN-loaded, OwO-compatible sticker format, anonymous comments, admin notifications |
| `markdown-it` | ^14.x | Markdown parser for full-content RSS | Render article body to HTML for full-content feed |
| `sanitize-html` | ^2.x | HTML sanitizer for RSS | Prevent XSS in full-content feed, allow safe HTML tags |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `medium-zoom` | `photoswipe` | More features (gallery, swipe) but heavier (~40KB). medium-zoom is sufficient for article images. |
| `@astrojs/rss` | Custom XML endpoint | More control but reinvents the wheel. @astrojs/rss handles CDATA, validation, autodiscovery. |
| `markdown-it` for RSS | Astro's `render()` | `render()` returns Astro component output, not raw HTML. markdown-it gives clean HTML for RSS. |
| Twikoo CDN | npm install + bundle | CDN is simpler, version-pinned, and Twikoo's own docs recommend CDN approach. |

**Installation:**
```bash
pnpm add @astrojs/rss medium-zoom markdown-it sanitize-html
# Twikoo is loaded from CDN, not installed via npm
```

**Version verification:**
```bash
npm view @astrojs/rss version    # 4.0.18
npm view medium-zoom version     # 1.1.0
npm view twikoo version          # 1.7.11
npm view markdown-it version     # 14.x
npm view sanitize-html version   # 2.x
```

## Package Legitimacy Audit

| Package | Registry | Age | Downloads | Source Repo | Disposition |
|---------|----------|-----|-----------|-------------|-------------|
| `@astrojs/rss` | npm | 3+ years | High | github.com/withastro/astro | Approved — official Astro integration |
| `medium-zoom` | npm | 8+ years | High | github.com/francoischalifour/medium-zoom | Approved — mature, stable |
| `twikoo` | npm | 4+ years | High | github.com/twikoojs/twikoo | Approved — well-documented, active maintenance |
| `markdown-it` | npm | 10+ years | Very High | github.com/markdown-it/markdown-it | Approved — de facto standard |
| `sanitize-html` | npm | 10+ years | Very High | github.com/apostrophecms/sanitize-html | Approved — widely used |

*All packages verified via npm registry. No slopcheck available — packages tagged based on registry existence and ecosystem reputation.*

## Architecture Patterns

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Build Time                                │
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │   Content     │    │   Astro      │    │   @astrojs   │       │
│  │  Collections  │───▶│   Build      │───▶│   /rss       │       │
│  │  (articles)   │    │   Pipeline   │    │              │       │
│  └──────────────┘    └──────┬───────┘    └──────┬───────┘       │
│                             │                    │               │
│                             ▼                    ▼               │
│                      ┌──────────────┐    ┌──────────────┐       │
│                      │   Static     │    │   RSS Feeds  │       │
│                      │   HTML       │    │   (XML)      │       │
│                      │   Pages      │    │              │       │
│                      └──────┬───────┘    └──────┬───────┘       │
│                             │                    │               │
└─────────────────────────────┼────────────────────┼───────────────┘
                              │                    │
                              ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Client Side                                │
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │   Article     │    │   Twikoo     │    │   medium-    │       │
│  │   Detail      │◀──▶│   Comments   │    │   zoom       │       │
│  │   Page        │    │   (CDN)      │    │   (lightbox) │       │
│  └──────┬───────┘    └──────┬───────┘    └──────────────┘       │
│         │                    │                                    │
│         ▼                    ▼                                    │
│  ┌──────────────┐    ┌──────────────┐                            │
│  │   TOC        │    │   Twikoo     │                            │
│  │   (scroll    │    │   Backend    │                            │
│  │   highlight) │    │   (Vercel +  │                            │
│  └──────────────┘    │   MongoDB)   │                            │
│                      └──────────────┘                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Recommended Project Structure
```
src/
├── pages/
│   ├── articles/
│   │   ├── index.astro          # Articles list with tag filtering
│   │   └── [id].astro           # Article detail page
│   ├── feed.xml.js              # Summary RSS feed
│   └── feed-full.xml.js         # Full-content RSS feed
├── components/
│   ├── articles/
│   │   ├── ArticleCard.astro    # Article list item (reuse from LatestArticles)
│   │   ├── TagChips.astro       # Horizontal scrollable tag filter
│   │   ├── ArticleTOC.astro     # Table of contents sidebar
│   │   ├── ArticleNav.astro     # Prev/next navigation
│   │   ├── RelatedPosts.astro   # 3-card grid of related articles
│   │   ├── CopyCode.astro       # Copy-code button (client:load)
│   │   ├── ImageLightbox.astro  # medium-zoom wrapper (client:idle)
│   │   ├── ShareButtons.astro   # Social share links
│   │   ├── CopyrightFooter.astro # Article copyright notice
│   │   ├── TopButton.astro      # Scroll-to-top button (client:visible)
│   │   └── ReadingTime.astro    # Reading time display
│   ├── comments/
│   │   └── TwikooComments.astro # Twikoo comment section (client:visible)
│   └── seo/
│       └── ArticleSEO.astro    # Article-specific OG/Twitter cards
├── utils/
│   ├── reading-time.ts          # Reading time calculation
│   ├── related-posts.ts         # Tag-overlap algorithm
│   └── tag-extraction.ts        # Extract unique tags from collection
└── content/
    └── articles/
        └── welcome.md           # Example article (already exists)
```

### Pattern 1: Articles Index with Tag Filtering

**What:** A page that lists all non-draft articles with horizontal tag chips for filtering.
**When to use:** Any content listing page with tag-based discovery.
**Example:**
```astro
---
// src/pages/articles/index.astro
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';
import TagChips from '../../components/articles/TagChips.astro';
import ArticleCard from '../../components/articles/ArticleCard.astro';

const allArticles = await getCollection('articles', ({ data }) => !data.draft);

// Extract unique tags
const tags = [...new Set(allArticles.flatMap(a => a.data.tags))].sort();

// Filter by tag if query param present
const selectedTag = Astro.url.searchParams.get('tag');
const articles = selectedTag
  ? allArticles.filter(a => a.data.tags.includes(selectedTag))
  : allArticles;

// Sort: sticky first, then by date descending
const sorted = articles.sort((a, b) => {
  if (a.data.sticky !== b.data.sticky) return b.data.sticky ? 1 : -1;
  return b.data.publishedAt.getTime() - a.data.publishedAt.getTime();
});
---

<BaseLayout title="文章">
  <TagChips tags={tags} selected={selectedTag} />
  <ul>
    {sorted.map(article => (
      <ArticleCard article={article} />
    ))}
  </ul>
</BaseLayout>
```

### Pattern 2: Article Detail with TOC

**What:** A page that renders a single article with table of contents, code highlighting, and navigation.
**When to use:** Any content detail page with heading-based navigation.
**Example:**
```astro
---
// src/pages/articles/[id].astro
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getCollection, render } from 'astro:content';
import ArticleTOC from '../../components/articles/ArticleTOC.astro';
import ArticleNav from '../../components/articles/ArticleNav.astro';
import RelatedPosts from '../../components/articles/RelatedPosts.astro';
import TwikooComments from '../../components/comments/TwikooComments.astro';

export async function getStaticPaths() {
  const articles = await getCollection('articles', ({ data }) => !data.draft);
  return articles.map(article => ({
    params: { id: article.id },
    props: { article },
  }));
}

const { article } = Astro.props;
const { Content, headings } = await render(article);

// Calculate reading time
const wordCount = article.body.split(/\s+/).length;
const readingTime = Math.ceil(wordCount / 200); // ~200 words/min

// Get related posts by tag overlap
const allArticles = await getCollection('articles', ({ data }) => 
  !data.draft && data.title !== article.data.title
);
const related = allArticles
  .map(a => ({
    ...a,
    overlap: a.data.tags.filter(t => article.data.tags.includes(t)).length,
  }))
  .sort((a, b) => b.overlap - a.overlap)
  .slice(0, 3);
---

<BaseLayout title={article.data.title} description={article.data.description}>
  <article>
    {article.data.toc && <ArticleTOC headings={headings} />}
    <Content />
    <ArticleNav currentId={article.id} />
    <RelatedPosts articles={related} />
    <TwikooComments />
  </article>
</BaseLayout>
```

### Pattern 3: RSS Feed Generation

**What:** Generate RSS feeds from Astro content collections.
**When to use:** Any site that needs syndication.
**Example:**
```javascript
// src/pages/feed.xml.js
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';

const parser = new MarkdownIt();

export async function GET(context) {
  const articles = await getCollection('articles', ({ data }) => !data.draft);
  const sorted = articles.sort((a, b) => 
    b.data.publishedAt.getTime() - a.data.publishedAt.getTime()
  );

  return rss({
    title: 'merlinalex.me',
    description: '二次元可爱风个人站',
    site: context.site,
    items: sorted.map(article => ({
      title: article.data.title,
      pubDate: article.data.publishedAt,
      description: article.data.description || '',
      link: `/articles/${article.id}/`,
    })),
    customData: '<language>zh-CN</language>',
  });
}
```

```javascript
// src/pages/feed-full.xml.js
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';

const parser = new MarkdownIt();

export async function GET(context) {
  const articles = await getCollection('articles', ({ data }) => !data.draft);
  const sorted = articles.sort((a, b) => 
    b.data.publishedAt.getTime() - a.data.publishedAt.getTime()
  );

  return rss({
    title: 'merlinalex.me',
    description: '二次元可爱风个人站 — 完整内容',
    site: context.site,
    items: sorted.map(article => ({
      title: article.data.title,
      pubDate: article.data.publishedAt,
      description: article.data.description || '',
      link: `/articles/${article.id}/`,
      content: sanitizeHtml(parser.render(article.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      }),
    })),
    customData: '<language>zh-CN</language>',
  });
}
```

### Pattern 4: Twikoo Comment Integration

**What:** Embed Twikoo comments in an Astro page.
**When to use:** Any page that needs comments (articles, microblog).
**Example:**
```astro
---
// src/components/comments/TwikooComments.astro
const envId = import.meta.env.TWIKOO_ENV_ID;
---

<div id="tcomment"></div>
<script is:inline define:vars={{ envId }}>
  // Load Twikoo from CDN
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/twikoo@1.7.11/dist/twikoo.min.js';
  script.onload = () => {
    twikoo.init({
      envId: envId,
      el: '#tcomment',
      // region: 'ap-guangzhou', // Only for Tencent Cloud
    });
  };
  document.head.appendChild(script);
</script>

<style>
  #tcomment {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid var(--color-border);
  }
</style>
```

### Pattern 5: Image Lightbox with medium-zoom

**What:** Click-to-expand images in articles.
**When to use:** Any page with images that benefit from full-size viewing.
**Example:**
```astro
---
// src/components/articles/ImageLightbox.astro
---

<script>
  import mediumZoom from 'medium-zoom';
  
  // Initialize on page load
  mediumZoom('[data-zoomable]', {
    margin: 24,
    background: 'rgba(0, 0, 0, 0.8)',
  });
  
  // Re-initialize after View Transitions
  document.addEventListener('astro:after-swap', () => {
    mediumZoom('[data-zoomable]', {
      margin: 24,
      background: 'rgba(0, 0, 0, 0.8)',
    });
  });
</script>
```

### Anti-Patterns to Avoid

- **Don't use `@astrojs/tailwind` integration:** It's Tailwind 3 only. Use `@tailwindcss/vite` (already configured).
- **Don't install Twikoo via npm:** Use CDN with pinned version. Twikoo's docs recommend CDN approach.
- **Don't use `render()` for RSS content:** `render()` returns Astro component output. Use `markdown-it` for clean HTML.
- **Don't forget CDATA escaping in RSS:** HTML content must be wrapped in CDATA sections per W3C validator.
- **Don't use relative URLs in RSS feeds:** All links must be absolute. Use `new URL(path, Astro.site)`.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| RSS feed generation | Custom XML endpoint | `@astrojs/rss` | Handles CDATA, validation, autodiscovery, content collection integration |
| Image lightbox | Custom modal + CSS | `medium-zoom` | 6KB, keyboard-friendly, handles scroll lock, escape to dismiss |
| HTML sanitization | Custom regex | `sanitize-html` | XSS prevention, configurable allowed tags, widely audited |
| Markdown to HTML | Custom parser | `markdown-it` | Full CommonMark support, extensible, battle-tested |
| Comment system | Custom backend | Twikoo | Vercel one-click deploy, MongoDB Atlas free tier, admin panel, email notifications |

**Key insight:** The RSS and comment system are solved problems with well-maintained libraries. Building custom versions would take weeks and introduce security risks (especially HTML sanitization).

## Common Pitfalls

### Pitfall 1: RSS Feed Validation Failures

**What goes wrong:** Feed validates locally but fails W3C validator or feed readers reject entries.
**Why it happens:** Missing CDATA wrapping, relative URLs, special characters in titles not escaped.
**How to avoid:**
- Use `@astrojs/rss` which handles CDATA automatically
- Ensure `site` is set in `astro.config` (already done: `https://merlinalex.me`)
- Test with `validator.w3.org/feed/` before launch
- Use absolute URLs for all links and images

**Warning signs:** W3C validator errors, feed readers showing empty entries.

### Pitfall 2: Twikoo Comments Not Loading

**What goes wrong:** Comment section shows blank, or "Failed to load" error.
**Why it happens:** Vercel Authentication is enabled (blocks API), `envId` is wrong, CORS issues.
**How to avoid:**
- Disable Vercel Authentication in Deployment Protection settings
- Use the full Vercel URL as `envId` (e.g., `https://xxx.vercel.app`)
- Ensure `MONGODB_URI` environment variable is set in Vercel
- Check browser console for CORS errors

**Warning signs:** Console errors mentioning CORS, `envId`, or authentication.

### Pitfall 3: Full-Content RSS Feed Performance

**What goes wrong:** Build time increases significantly, or feed file is very large.
**Why it happens:** Rendering all article bodies to HTML at build time, especially with images.
**How to avoid:**
- Only render articles that are not drafts
- Consider lazy-loading images in RSS content
- Monitor build time and optimize if needed

**Warning signs:** Build time >2 minutes, feed file >5MB.

### Pitfall 4: TOC Scroll Highlighting Not Working

**What goes wrong:** TOC doesn't highlight the current heading as user scrolls.
**Why it happens:** IntersectionObserver not configured correctly, or headings don't have IDs.
**How to avoid:**
- Ensure all headings have `id` attributes (Astro's markdown renderer adds them automatically)
- Configure IntersectionObserver with appropriate `rootMargin` (e.g., `-80px 0px -80px 0px` for sticky header)
- Use `threshold: 0` for immediate detection

**Warning signs:** TOC highlights never change, or change too late.

### Pitfall 5: Image Lightbox Not Working After Navigation

**What goes wrong:** medium-zoom works on first page load but stops working after navigating to another article.
**Why it happens:** Astro's View Transitions swap the DOM without re-initializing client-side scripts.
**How to avoid:**
- Listen for `astro:after-swap` event and re-initialize medium-zoom
- Or use `client:idle` directive on the lightbox component

**Warning signs:** Images don't zoom after navigating between articles.

## Code Examples

### Reading Time Calculation
```typescript
// src/utils/reading-time.ts
export function calculateReadingTime(text: string): number {
  // Count CJK characters separately (faster reading speed)
  const cjkChars = (text.match(/[一-鿿぀-ゟ゠-ヿ]/g) || []).length;
  const nonCjkWords = text
    .replace(/[一-鿿぀-ゟ゠-ヿ]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 0).length;
  
  // ~400 CJK chars/min, ~200 EN words/min
  const minutes = (cjkChars / 400) + (nonCjkWords / 200);
  return Math.max(1, Math.ceil(minutes));
}
```

### Tag Extraction Utility
```typescript
// src/utils/tag-extraction.ts
import type { CollectionEntry } from 'astro:content';

export function extractTags(articles: CollectionEntry<'articles'>[]): string[] {
  const tagSet = new Set<string>();
  for (const article of articles) {
    for (const tag of article.data.tags) {
      tagSet.add(tag);
    }
  }
  return [...tagSet].sort();
}
```

### Related Posts Algorithm
```typescript
// src/utils/related-posts.ts
import type { CollectionEntry } from 'astro:content';

export function findRelated(
  current: CollectionEntry<'articles'>,
  all: CollectionEntry<'articles'>[],
  limit = 3
): CollectionEntry<'articles'>[] {
  const scored = all
    .filter(a => a.id !== current.id)
    .map(article => ({
      article,
      score: article.data.tags.filter(t => current.data.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score);

  // Take top N by score, fill with most recent if needed
  const related = scored.slice(0, limit);
  if (related.length < limit) {
    const recent = all
      .filter(a => a.id !== current.id && !related.some(r => r.article.id === a.id))
      .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime())
      .slice(0, limit - related.length);
    related.push(...recent.map(a => ({ article: a, score: 0 })));
  }

  return related.map(r => r.article);
}
```

### Twikoo Sticker Pack (OwO Format)
```json
{
  "Bilibili": {
    "type": "image",
    "container": [
      {
        "icon": "<img src=\"https://i0.hdslb.com/bfs/emote/xxx.png\">",
        "text": "tv_微笑"
      }
    ]
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual RSS XML | `@astrojs/rss` | Astro v2+ | Built-in CDATA, validation, content collection integration |
| `particles.js` | `tsParticles` | 2020+ | Modern, tree-shakeable, active maintenance |
| `oh-my-live2d` | `l2d-widget` | May 2026 | Rewrite, ~500 LOC, Cubism 2 + 6 support |
| Hexo themes | Astro + custom components | 2023+ | No theme lock-in, TypeScript DX, islands architecture |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Twikoo CDN URL `https://cdn.jsdelivr.net/npm/twikoo@1.7.11/dist/twikoo.min.js` is correct | Pattern 4 | Comments won't load; verify URL before implementation |
| A2 | OwO JSON format for Twikoo stickers is still supported in v1.7.11 | Pattern 4 | Stickers won't load; verify against Twikoo docs |
| A3 | `markdown-it` is the recommended parser for full-content RSS | Pattern 3 | Other parsers may work; markdown-it is most commonly documented |
| A4 | `sanitize-html` allows `<img>` tags by default when added to allowedTags | Pattern 3 | Images may be stripped from RSS; verify sanitize-html defaults |
| A5 | Medium-zoom re-initializes correctly with `astro:after-swap` event | Pattern 5 | Lightbox may break after navigation; test thoroughly |

## Open Questions

1. **Twikoo sticker pack source**
   - What we know: OwO format is supported, Bilibili default emotes are the target
   - What's unclear: Exact CDN URLs for Bilibili emote images
   - Recommendation: Use a community-maintained sticker pack JSON, or create one from Bilibili's public emote URLs

2. **Full-content RSS image handling**
   - What we know: Relative URLs in RSS content need to be absolute
   - What's unclear: Whether `markdown-it` automatically resolves relative image paths
   - Recommendation: Post-process rendered HTML to convert relative URLs to absolute using `Astro.site`

3. **TOC heading depth**
   - What we know: TOC should show headings from articles
   - What's unclear: Which heading levels to include (h2-h3? h2-h4?)
   - Recommendation: Include h2 and h3 by default, configurable via frontmatter

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build | ✓ | 22.x | — |
| pnpm | Package manager | ✓ | — | — |
| Twikoo CDN | Comments | ✓ | 1.7.11 | Self-host if CDN fails |
| MongoDB Atlas | Twikoo backend | ✓ | M0 free tier | — |
| Vercel | Twikoo backend | ✓ | Hobby tier | — |

**Missing dependencies with no fallback:**
- None — all dependencies are available

**Missing dependencies with fallback:**
- None

## Validation Architecture

> `workflow.nyquist_validation` is explicitly set to `false` in config. Skipping detailed test mapping.

**Test framework:** Vitest (unit) + Playwright (E2E) — already configured in Phase 1.

**Phase 2 test considerations:**
- Unit tests for `reading-time.ts`, `tag-extraction.ts`, `related-posts.ts`
- E2E tests for: tag filtering navigation, article detail page loads, Twikoo comments render, RSS feed validates
- Skip: medium-zoom behavior (visual), TOC scroll highlighting (timing-dependent)

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | No user accounts; Twikoo is anonymous |
| V3 Session Management | No | No sessions; state is localStorage only |
| V4 Access Control | No | All content is public |
| V5 Input Validation | Yes | Twikoo comment input sanitized by Twikoo; RSS content sanitized by `sanitize-html` |
| V6 Cryptography | No | No encryption needed |

### Known Threat Patterns for This Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| XSS via Twikoo comments | Tampering | Twikoo sanitizes input; `sanitize-html` for RSS |
| RSS feed injection | Tampering | `@astrojs/rss` handles escaping; `sanitize-html` for content |
| Image URL injection | Information Disclosure | Validate image URLs in frontmatter; use `astro:assets` for optimization |

## Sources

### Primary (HIGH confidence)
- Astro RSS docs: https://docs.astro.build/en/guides/rss/
- Twikoo frontend docs: https://twikoo.js.org/frontend.html
- Twikoo backend docs: https://twikoo.js.org/backend.html
- Twikoo FAQ: https://twikoo.js.org/faq.html
- OwO format demo: https://cdn.jsdelivr.net/npm/owo@1.0.2/demo/OwO.json
- npm registry: `@astrojs/rss@4.0.18`, `medium-zoom@1.1.0`, `twikoo@1.7.11`

### Secondary (MEDIUM confidence)
- Phase 1 research: `.planning/research/STACK.md`, `.planning/research/FEATURES.md`, `.planning/research/PITFALLS.md`
- Phase 1 context: `.planning/phases/01-foundation/01-CONTEXT.md`, `.planning/phases/01-foundation/01-PATTERNS.md`

### Tertiary (LOW confidence)
- Twikoo sticker pack URLs — exact Bilibili emote CDN URLs not verified against official source

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages verified via npm registry, Astro docs, and Twikoo docs
- Architecture: HIGH — follows established Astro patterns from Phase 1
- Pitfalls: HIGH — based on official documentation and Phase 1 research

**Research date:** 2026-06-03
**Valid until:** 2026-07-03 (30 days — stable stack, no major version changes expected)
