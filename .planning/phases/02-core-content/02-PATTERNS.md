# Phase 2: Core Content - Pattern Map

**Mapped:** 2026-06-03
**Files analyzed:** 22 (new) / 5 (modified)
**Analogs found:** 20 / 22 — strong in-repo coverage from Phase 1 components and pages

---

## File Classification

### Pages (routes)

| New File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `src/pages/articles/index.astro` | page/route | request-response (static) | `src/pages/index.astro` | exact — same `getCollection` + filter + sort pattern |
| `src/pages/articles/[id].astro` | page/route (dynamic) | request-response (static) | `src/pages/index.astro` + `src/pages/about.astro` | role-match — `getStaticPaths` + `render()` is new but page shell same |
| `src/pages/feed.xml.js` | endpoint (build-time) | transform (MD→XML) | None in-repo | no-analog — Astro RSS endpoint pattern from `@astrojs/rss` docs |
| `src/pages/feed-full.xml.js` | endpoint (build-time) | transform (MD→XML) | None in-repo | no-analog — same as feed.xml.js but with `markdown-it` body rendering |

### Components — Articles

| New File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `src/components/articles/ArticleCard.astro` | component (data-list item) | server-render | `src/components/home/LatestArticles.astro` | exact — same card pattern, expanded for list view with category pill |
| `src/components/articles/TagChips.astro` | component (interactive filter) | server-render + client URL param | `src/components/core/Nav.astro` | role-match — horizontal link list with active state |
| `src/components/articles/ArticleTOC.astro` | component (interactive sidebar) | server-render + client IntersectionObserver | `src/components/core/Header.astro` | partial — sticky positioning pattern only; TOC is new |
| `src/components/articles/ArticleNav.astro` | component (navigation) | server-render | `src/components/home/LatestArticles.astro` | role-match — card-style link pattern |
| `src/components/articles/RelatedPosts.astro` | component (data-grid) | server-render | `src/components/home/LatestArticles.astro` | exact — 3-card grid, same card styling |
| `src/components/articles/CopyCode.astro` | component (interactive island) | client Clipboard API | `src/components/core/ThemeSwitcher.astro` | role-match — small client-side island pattern |
| `src/components/articles/ImageLightbox.astro` | component (interactive island) | client medium-zoom | `src/components/core/ThemeSwitcher.astro` | role-match — client script with View Transition re-init |
| `src/components/articles/ShareButtons.astro` | component (presentational) | server-render | `src/components/core/Footer.astro` | role-match — icon link list pattern |
| `src/components/articles/CopyrightFooter.astro` | component (presentational) | server-render | `src/components/core/Footer.astro` | role-match — footer-like text block |
| `src/components/articles/TopButton.astro` | component (interactive island) | client scroll event | `src/components/core/ThemeSwitcher.astro` | role-match — small client-side interactive component |
| `src/components/articles/ReadingTime.astro` | component (presentational) | server-render | `src/components/home/SiteStats.astro` | role-match — small data display |

### Components — Comments

| New File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `src/components/comments/TwikooComments.astro` | component (CDN island) | client CDN load + event-driven | `src/components/core/ThemeSwitcher.astro` | role-match — inline `<script>` island; CDN loading is new pattern |

### Components — SEO

| New File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `src/components/seo/ArticleSEO.astro` | component (head meta) | server-render | `src/components/seo/SEOMeta.astro` | exact — extends SEOMeta with article-specific OG tags |

### Utilities

| New File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `src/utils/reading-time.ts` | utility | transform (text→minutes) | None in-repo | no-analog — pure function, pattern from RESEARCH.md |
| `src/utils/related-posts.ts` | utility | transform (collection→subset) | None in-repo | no-analog — pure function, pattern from RESEARCH.md |
| `src/utils/tag-extraction.ts` | utility | transform (collection→tags) | None in-repo | no-analog — pure function, pattern from RESEARCH.md |

### Modified Files

| Modified File | Role | Data Flow | Change Description |
|---|---|---|---|
| `src/components/core/Nav.astro` | component (layout chrome) | server-render | Enable articles link (remove `disabled: true`) |
| `src/components/core/Footer.astro` | component (layout chrome) | server-render | Add RSS icon link |
| `src/components/seo/SEOMeta.astro` | component (head meta) | server-render | Add second RSS autodiscovery link for `/feed-full.xml` |
| `src/content/articles/welcome.md` | content seed | build-time | Enrich with headings, code blocks, images for testing |
| `.env.example` | config | n/a | Add `TWIKOO_ENV_ID` placeholder comment |

---

## Pattern Assignments

### `src/pages/articles/index.astro` (page, request-response)

**Analog:** `src/pages/index.astro` (lines 1-38)

**Imports pattern** (lines 1-9):
```typescript
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import TagChips from '../../components/articles/TagChips.astro';
import ArticleCard from '../../components/articles/ArticleCard.astro';
```

**Collection query + filter + sort pattern** (lines 12-16 from index.astro):
```typescript
const allArticles = await getCollection('articles', ({ data }) => !data.draft);
const latestArticles = allArticles
  .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime())
  .slice(0, 3);
```

Adapted for Phase 2 with tag filtering and sticky sort:
```typescript
const allArticles = await getCollection('articles', ({ data }) => !data.draft);
const tags = [...new Set(allArticles.flatMap(a => a.data.tags))].sort();
const selectedTag = Astro.url.searchParams.get('tag');
const filtered = selectedTag
  ? allArticles.filter(a => a.data.tags.includes(selectedTag))
  : allArticles;
const sorted = filtered.sort((a, b) => {
  if (a.data.sticky !== b.data.sticky) return b.data.sticky ? 1 : -1;
  return b.data.publishedAt.getTime() - a.data.publishedAt.getTime();
});
```

**Page shell pattern** (line 30 from index.astro):
```astro
<BaseLayout title="文章" description="全部文章 — merlinalex.me" type="website">
  <TagChips tags={tags} selected={selectedTag} />
  <ul>
    {sorted.map(article => <ArticleCard article={article} />)}
  </ul>
</BaseLayout>
```

**CSS pattern:** Follow `LatestArticles.astro` card grid styles (lines 76-125) but switch from 3-column grid to single-column list layout per D-01. Use same CSS variable tokens: `var(--color-surface)`, `var(--color-border)`, `var(--color-fg)`, `var(--color-fg-muted)`, `var(--radius-lg)`, `var(--duration-fast)`.

---

### `src/pages/articles/[id].astro` (page/dynamic, request-response)

**Analog:** `src/pages/index.astro` for page shell; `src/pages/about.astro` for prop passing

**`getStaticPaths` pattern** (new, no in-repo analog):
```typescript
export async function getStaticPaths() {
  const articles = await getCollection('articles', ({ data }) => !data.draft);
  return articles.map(article => ({
    params: { id: article.id },
    props: { article },
  }));
}
```

**Render pattern** (new — uses `render()` from `astro:content`):
```typescript
const { article } = Astro.props;
const { Content, headings } = await render(article);
```

**Page shell pattern** (from index.astro line 30 + about.astro line 9):
```astro
<BaseLayout title={article.data.title} description={article.data.description} type="article">
  <!-- Article header with title, date, reading time, category -->
  <!-- ArticleTOC if article.data.toc -->
  <!-- <Content /> -->
  <!-- ShareButtons, CopyrightFooter -->
  <!-- ArticleNav (prev/next) -->
  <!-- RelatedPosts -->
  <!-- TwikooComments -->
</BaseLayout>
```

**CSS pattern:** Article content container max-width 768px (same as `LatestArticles.astro` line 33: `max-width: 768px; margin: 0 auto`). Prose styling for headings, paragraphs, code blocks, images within `<article>`.

---

### `src/pages/feed.xml.js` (endpoint, transform)

**Analog:** None in-repo. Use `@astrojs/rss` API pattern from RESEARCH.md lines 296-328.

**Core pattern:**
```typescript
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

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

**Note:** `context.site` resolves from `astro.config.mjs` line 13: `site: 'https://merlinalex.me'`.

---

### `src/pages/feed-full.xml.js` (endpoint, transform)

**Analog:** Same as `feed.xml.js` above, plus `markdown-it` + `sanitize-html` for body rendering.

**Additional imports:**
```typescript
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';

const parser = new MarkdownIt();
```

**Content rendering pattern** (RESEARCH.md lines 349-355):
```typescript
content: sanitizeHtml(parser.render(article.body), {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
}),
```

**Post-processing requirement:** Convert relative image URLs to absolute using `new URL(path, context.site).toString()`.

---

### `src/components/articles/ArticleCard.astro` (component, server-render)

**Analog:** `src/components/home/LatestArticles.astro` (full file, 126 lines)

**Props pattern** (line 2 from LatestArticles):
```typescript
const { article } = Astro.props;
```

**Card markup pattern** (lines 16-26 from LatestArticles):
```astro
<li class="article-card">
  <a href={`/articles/${article.id}`}>
    <h3>{article.data.title}</h3>
    {article.data.description && <p class="excerpt">{article.data.description}</p>}
    <time datetime={article.data.publishedAt.toISOString()}>
      {article.data.publishedAt.toLocaleDateString('zh-CN')}
    </time>
  </a>
</li>
```

**Extend for list view:** Add category pill (colored badge), cover image thumbnail (optional). Category pill uses `var(--color-accent-subtle)` background with `var(--color-accent)` text.

**CSS pattern** (lines 88-125 from LatestArticles):
```css
.article-card a {
  display: block;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg, 20px);
  padding: var(--space-md, 1rem);
  text-decoration: none;
  color: inherit;
  transition: border-color var(--duration-fast) var(--easing-default),
              box-shadow var(--duration-base) var(--easing-default);
}
.article-card a:hover,
.article-card a:focus-visible {
  border-color: var(--color-accent);
  box-shadow: 0 4px 16px rgba(255, 107, 157, 0.12);
}
```

Adapt: change from grid item to full-width list row. Remove `grid-template-columns`, use `display: flex` or full-width block.

---

### `src/components/articles/TagChips.astro` (component, server-render + client)

**Analog:** `src/components/core/Nav.astro` (68 lines) — horizontal link list with active state

**Props pattern:**
```typescript
const { tags = [], selected = null } = Astro.props;
```

**Active state pattern** (lines 17-18 from Nav.astro):
```typescript
const active = path === item.href || (item.href !== '/' && path.startsWith(item.href));
```

Adapted for tag chips:
```astro
<a href="/articles" class={!selected ? 'active' : ''}>全部</a>
{tags.map(tag => (
  <a href={`/articles?tag=${encodeURIComponent(tag)}`}
     class={selected === tag ? 'active' : ''}>
    {tag}
  </a>
))}
```

**CSS pattern** (from Nav.astro lines 37-67): horizontal flex, `gap`, `list-style: none`, active state with `border-bottom-color: var(--color-accent)`. Adapt to pill-shaped chips with `border-radius: var(--radius-full)` and `background: var(--color-surface)` for inactive, `var(--color-accent)` for active.

**Scrollable wrapper:** `overflow-x: auto; white-space: nowrap; -webkit-overflow-scrolling: touch;` for mobile horizontal scroll.

---

### `src/components/articles/ArticleTOC.astro` (component, server-render + client)

**Analog:** `src/components/core/Header.astro` (52 lines) — sticky positioning only

**Props pattern:**
```typescript
const { headings = [] } = Astro.props;
// headings: { depth: number, slug: string, text: string }[]
```

**Sticky positioning pattern** (from Header.astro lines 20-28):
```css
position: sticky;
top: 0;  /* adjust to header height: top: 72px for TOC below 56px header */
```

**Desktop layout:** `position: sticky; top: 72px;` left sidebar, `width: 240px; max-height: calc(100vh - 72px); overflow-y: auto;`

**Mobile layout:** Collapsible drawer or accordion. Hide on `<1024px`, show toggle button.

**Client IntersectionObserver** (new pattern — inline `<script>`):
```astro
<script is:inline>
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // highlight corresponding TOC link
        }
      });
    },
    { rootMargin: '-80px 0px -80px 0px', threshold: 0 }
  );
  document.querySelectorAll('article h2, article h3').forEach(h => observer.observe(h));
</script>
```

---

### `src/components/articles/ArticleNav.astro` (component, server-render)

**Analog:** `src/components/home/LatestArticles.astro` — card-style link pattern

**Props pattern:**
```typescript
const { prev, next } = Astro.props;
// prev/next: CollectionEntry<'articles'> | undefined
```

**Markup pattern:** Two cards side by side (flexbox), left arrow for prev, right arrow for next. Each card links to `/articles/${article.id}`.

**CSS pattern:** Reuse card styling from `LatestArticles.astro` lines 88-103 (background, border, border-radius, hover shadow). Grid: `display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;`

---

### `src/components/articles/RelatedPosts.astro` (component, server-render)

**Analog:** `src/components/home/LatestArticles.astro` (exact match — 3-card grid)

**Props pattern:**
```typescript
const { articles = [] } = Astro.props;
```

**Grid pattern** (from LatestArticles.astro lines 76-87):
```css
.article-grid {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md, 1rem);
}
@media (min-width: 640px) {
  .article-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

Reuse this exact grid. Card styling from lines 88-125. This is the highest-fidelity analog in the codebase.

---

### `src/components/articles/CopyCode.astro` (component, client island)

**Analog:** `src/components/core/ThemeSwitcher.astro` — small interactive island with `<script>`

**Pattern:** Client-side script that injects copy buttons into all `<pre>` blocks within the article.

**Client directive:** `client:idle` — load after page is interactive.

**Script pattern:**
```astro
<script>
  document.querySelectorAll('pre').forEach(pre => {
    const btn = document.createElement('button');
    btn.textContent = '复制';
    btn.className = 'copy-code-btn';
    btn.addEventListener('click', async () => {
      await navigator.clipboard.writeText(pre.textContent || '');
      btn.textContent = '已复制!';
      setTimeout(() => { btn.textContent = '复制'; }, 2000);
    });
    pre.style.position = 'relative';
    pre.appendChild(btn);
  });
</script>
```

**Note:** Must re-initialize after View Transitions. Listen for `astro:after-swap` event (same pattern as ImageLightbox).

---

### `src/components/articles/ImageLightbox.astro` (component, client island)

**Analog:** `src/components/core/ThemeSwitcher.astro` — client script with View Transition awareness

**Pattern:** Import `medium-zoom`, initialize on `[data-zoomable]` images.

**View Transition re-init pattern** (from RESEARCH.md lines 418-424):
```astro
<script>
  import mediumZoom from 'medium-zoom';

  function initZoom() {
    mediumZoom('[data-zoomable]', {
      margin: 24,
      background: 'rgba(0, 0, 0, 0.8)',
    });
  }

  initZoom();
  document.addEventListener('astro:after-swap', initZoom);
</script>
```

**Client directive:** `client:idle`

---

### `src/components/articles/ShareButtons.astro` (component, server-render)

**Analog:** `src/components/core/Footer.astro` (51 lines) — icon link list

**Props pattern:**
```typescript
const { title, url } = Astro.props;
```

**Link list pattern** (from Footer.astro lines 8-17):
```astro
<ul class="share-links">
  <li><a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`} rel="noopener noreferrer">Twitter/X</a></li>
  <li><a href={`https://service.weibo.com/share/share.php?title=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`} rel="noopener noreferrer">微博</a></li>
  <li><button id="copy-link">复制链接</button></li>
</ul>
```

**CSS pattern** (from Footer.astro lines 33-50): flex row, gap, muted color, accent on hover.

---

### `src/components/articles/CopyrightFooter.astro` (component, server-render)

**Analog:** `src/components/core/Footer.astro` — text footer block

**Props pattern:**
```typescript
const { title, url } = Astro.props;
```

**Markup:** Standard CN blog copyright pattern: "本文作者: merlinalex · 本文链接: [permalink] · 转载请注明出处"

**CSS pattern:** `border-top: 1px solid var(--color-border); padding: 1.5rem 0; font-size: 0.85rem; color: var(--color-fg-muted);`

---

### `src/components/articles/TopButton.astro` (component, client island)

**Analog:** `src/components/core/ThemeSwitcher.astro` — small client interactive component

**Pattern:** Floating button, hidden by default, appears after scrolling past first viewport.

**Client directive:** `client:visible` — only load when scrolled into view (but actually needs `client:idle` since it must be active even when not visible).

**Script pattern:**
```astro
<script>
  const btn = document.getElementById('top-btn');
  window.addEventListener('scroll', () => {
    btn?.classList.toggle('visible', window.scrollY > window.innerHeight);
  });
  btn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
</script>
```

**CSS pattern:** `position: fixed; bottom: 2rem; right: 2rem; opacity: 0; pointer-events: none; transition: opacity var(--duration-fast);` Add `.visible { opacity: 1; pointer-events: auto; }`

---

### `src/components/articles/ReadingTime.astro` (component, server-render)

**Analog:** `src/components/home/SiteStats.astro` — small data display

**Props pattern:**
```typescript
const { minutes } = Astro.props;
```

**Markup:** `{minutes} 分钟阅读` — simple text display next to date.

**CSS pattern:** `font-size: 0.85rem; color: var(--color-fg-muted);`

---

### `src/components/comments/TwikooComments.astro` (component, CDN island)

**Analog:** `src/components/core/ThemeSwitcher.astro` — inline script pattern

**Pattern:** CDN-loaded Twikoo with `envId` from environment variable.

**Core pattern** (from RESEARCH.md lines 369-396):
```astro
---
const envId = import.meta.env.TWIKOO_ENV_ID;
---

<div id="tcomment"></div>
<script is:inline define:vars={{ envId }}>
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/twikoo@1.7.11/dist/twikoo.min.js';
  script.onload = () => {
    twikoo.init({
      envId: envId,
      el: '#tcomment',
    });
  };
  document.head.appendChild(script);
</script>
```

**Styling pattern:** Override Twikoo CSS variables to match site theme. Use `var(--color-fg)`, `var(--color-surface)`, `var(--color-border)`, `var(--color-accent)` from `global.css`.

**View Transition re-init:** Twikoo must re-initialize after `astro:after-swap` if the component is on a navigated page.

---

### `src/components/seo/ArticleSEO.astro` (component, server-render)

**Analog:** `src/components/seo/SEOMeta.astro` (27 lines) — exact match

**Props pattern** (from SEOMeta.astro line 2):
```typescript
const { title, description, image, type, canonical, publishedAt, updatedAt, tags } = Astro.props;
```

**Extend SEOMeta with article-specific OG tags:**
```astro
<!-- Article-specific OG (in addition to base SEOMeta) -->
<meta property="og:type" content="article" />
<meta property="article:published_time" content={publishedAt} />
<meta property="article:modified_time" content={updatedAt} />
<meta property="article:author" content="merlinalex" />
{tags?.map(tag => <meta property="article:tag" content={tag} />)}
```

**Integration approach:** Either extend SEOMeta to accept optional article props, or create ArticleSEO that imports and wraps SEOMeta. Recommend the wrapper approach to keep SEOMeta generic.

---

### `src/utils/reading-time.ts` (utility, transform)

**Analog:** None in-repo. Pattern from RESEARCH.md lines 509-521.

**Core function:**
```typescript
export function calculateReadingTime(text: string): number {
  const cjkChars = (text.match(/[一-鿿鿿぀-ゟ゠-ヿ]/g) || []).length;
  const nonCjkWords = text
    .replace(/[一-鿿぀-ゟ゠-ヿ]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 0).length;

  const minutes = (cjkChars / 400) + (nonCjkWords / 200);
  return Math.max(1, Math.ceil(minutes));
}
```

---

### `src/utils/related-posts.ts` (utility, transform)

**Analog:** None in-repo. Pattern from RESEARCH.md lines 541-569.

**Core function:**
```typescript
import type { CollectionEntry } from 'astro:content';

export function findRelated(
  current: CollectionEntry<'articles'>,
  all: CollectionEntry<'articles'>[],
  limit = 3
): CollectionEntry<'articles'>[] {
  // Tag overlap scoring, fallback to most recent
}
```

---

### `src/utils/tag-extraction.ts` (utility, transform)

**Analog:** None in-repo. Pattern from RESEARCH.md lines 527-537.

**Core function:**
```typescript
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

---

## Shared Patterns

### Page Shell (BaseLayout wrapping)

**Source:** `src/pages/index.astro` (lines 30-37), `src/pages/about.astro` (lines 9-11)
**Apply to:** `articles/index.astro`, `articles/[id].astro`

```astro
<BaseLayout title="..." description="..." type="website">
  <!-- page content -->
</BaseLayout>
```

All article pages inherit the theme gate (`data-theme` + `data-atmo`), SEOMeta, Header, Footer from BaseLayout. No need to duplicate.

---

### CSS Variable Tokens

**Source:** `src/styles/global.css` (lines 1-82)
**Apply to:** All new components

Key tokens used across Phase 1 components:
- Background: `var(--color-bg)`, `var(--color-bg-elevated)`, `var(--color-surface)`, `var(--color-surface-muted)`
- Text: `var(--color-fg)`, `var(--color-fg-muted)`
- Accent: `var(--color-accent)`, `var(--color-accent-hover)`, `var(--color-accent-subtle)`
- Border: `var(--color-border)`
- Radius: `var(--radius-lg, 20px)`, `var(--radius-md, 12px)`, `var(--radius-full)` (for pills)
- Duration: `var(--duration-fast, 150ms)`, `var(--duration-base, 250ms)`
- Easing: `var(--easing-default)`, `var(--easing-bounce)`

---

### Component Structure Convention

**Source:** All Phase 1 components follow: `---` frontmatter (TypeScript) → template (Astro/HTML) → `<style>` (scoped CSS)

```astro
---
// TypeScript in frontmatter
const { ... } = Astro.props;
---

<!-- Astro template -->
<div>...</div>

<style>
  /* Scoped CSS using CSS variables */
</style>
```

---

### View Transition Re-initialization

**Source:** `src/components/core/ThemeSwitcher.astro` pattern
**Apply to:** CopyCode, ImageLightbox, TwikooComments, TopButton — any component with client-side JS

```javascript
// Re-initialize after View Transitions navigation
document.addEventListener('astro:after-swap', () => {
  // re-init logic
});
```

---

### Client Directive Selection

**Source:** Phase 1 conventions from BaseLayout + ThemeSwitcher
**Apply to:** All interactive components

| Directive | When to Use | Phase 2 Components |
|---|---|---|
| (none/static) | Server-rendered, no JS | ArticleCard, TagChips, ArticleNav, RelatedPosts, ShareButtons, CopyrightFooter, ReadingTime |
| `client:idle` | Load after page interactive | CopyCode, ImageLightbox, TopButton |
| `client:visible` | Load when scrolled into view | TwikooComments |
| `is:inline` | Must run before paint (blocking) | Theme switcher script in BaseLayout (already done) |

---

### Responsive Breakpoints

**Source:** `src/components/home/LatestArticles.astro` line 83
**Apply to:** All grid/list layouts

```css
/* Mobile first: single column */
grid-template-columns: 1fr;

/* Desktop: multi-column */
@media (min-width: 640px) {
  grid-template-columns: repeat(3, 1fr);
}
```

Phase 2 TOC breakpoint: `@media (min-width: 1024px)` for sidebar vs drawer.

---

### Nav Link Activation

**Source:** `src/components/core/Nav.astro` (lines 3-9, 17-18)
**Apply to:** Enable the "文章" link by removing `disabled: true`

Current Nav.astro has `{ label: '文章', href: '/articles', disabled: true }`. Change to `disabled: false` (or remove the property).

---

## No Analog Found

Files with no close match in the codebase (planner should use RESEARCH.md patterns instead):

| File | Role | Data Flow | Reason |
|---|---|---|---|
| `src/pages/feed.xml.js` | endpoint | transform | No XML endpoint files exist in codebase; use `@astrojs/rss` docs + RESEARCH.md lines 296-328 |
| `src/pages/feed-full.xml.js` | endpoint | transform | Same as above; additionally needs `markdown-it` + `sanitize-html` pattern from RESEARCH.md lines 330-361 |

---

## New Dependencies Installation

Required before any Phase 2 file can be built:

```bash
pnpm add @astrojs/rss medium-zoom markdown-it sanitize-html
```

Twikoo is loaded from CDN (not installed via npm):
```
https://cdn.jsdelivr.net/npm/twikoo@1.7.11/dist/twikoo.min.js
```

---

## Metadata

**Analog search scope:** `src/pages/`, `src/components/`, `src/layouts/`, `src/styles/`, `src/utils/`, `src/content/`
**Files scanned:** 38
**Pattern extraction date:** 2026-06-03
