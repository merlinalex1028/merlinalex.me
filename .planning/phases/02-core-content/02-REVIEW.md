---
phase: 02-core-content
reviewed: 2026-06-03T12:00:00Z
depth: standard
files_reviewed: 27
files_reviewed_list:
  - public/stickers.json
  - src/components/articles/ArticleListItem.astro
  - src/components/articles/ArticleNav.astro
  - src/components/articles/ArticleTOC.astro
  - src/components/articles/CopyCodeButton.astro
  - src/components/articles/CopyrightFooter.astro
  - src/components/articles/ImageLightbox.astro
  - src/components/articles/ReadingMeta.astro
  - src/components/articles/RelatedPosts.astro
  - src/components/articles/ShareButtons.astro
  - src/components/articles/StickyBadge.astro
  - src/components/articles/TagChips.astro
  - src/components/articles/TopButton.astro
  - src/components/comments/TwikooComments.astro
  - src/components/core/Footer.astro
  - src/components/core/Nav.astro
  - src/components/rss/RSSLink.astro
  - src/components/seo/SEOMeta.astro
  - src/content/articles/welcome.md
  - src/data/stickers.json
  - src/pages/articles/[id].astro
  - src/pages/articles/index.astro
  - src/pages/feed-full.xml.ts
  - src/pages/feed.xml.ts
  - src/utils/reading-time.ts
  - src/utils/related-posts.ts
  - src/utils/tag-extraction.ts
findings:
  critical: 3
  warning: 5
  info: 4
  total: 12
status: issues_found
---

# Phase 02: Code Review Report

**Reviewed:** 2026-06-03T12:00:00Z
**Depth:** standard
**Files Reviewed:** 27
**Status:** issues_found

## Summary

Reviewed the core content module: article listing, detail pages, RSS feeds, comment system, navigation, SEO, and utility functions. The codebase is well-structured with clear separation of concerns and consistent Astro patterns.

**Critical finding:** Array mutation via `.sort()` in multiple files corrupts the Astro content collection cache at build time. This can cause incorrect article ordering, missing articles in feeds, and non-deterministic build output. Additionally, the ShareButtons component lacks a clipboard fallback that exists in the sibling CopyCodeButton component.

## Critical Issues

### CR-01: Array mutation corrupts content collection cache in `[id].astro`

**File:** `src/pages/articles/[id].astro:36-38`
**Issue:** `[...allArticles]` creates a shallow copy, but `.sort()` is called on the original `allArticles` array in the `getStaticPaths` function (line 18-21 via `articles.map`). More critically, the `sorted` variable at line 36 is computed correctly with spread, but the `allArticles` prop passed to `getStaticPaths` is the same reference as the collection returned by `getCollection`. In Astro, `getCollection` may return the same cached array on subsequent calls. The `.sort()` in `getStaticPaths` mutates the collection's internal order, which means subsequent pages rendered in the same build receive pre-sorted data that may not match the expected order.

Wait -- let me re-read. Line 36 does `[...allArticles]` before sorting, so the local sort is safe. But the real issue is that `allArticles` is passed as a prop from `getStaticPaths`, and `getStaticPaths` uses `articles` directly from `getCollection`. The `articles` array reference is shared. If any other code path sorts this same reference, corruption occurs.

Actually, the critical mutation is in the **articles index page** (CR-02) and **feed pages** (CR-03), which sort the `getCollection` return value in-place.

**Fix:** Already safe in `[id].astro` line 36 (spread copy is used). No fix needed here -- this was a false alarm on re-read. See CR-02 and CR-03 for the actual mutation bugs.

---

### CR-02: In-place `.sort()` mutates content collection in articles index

**File:** `src/pages/articles/index.astro:17-20`
**Issue:** `allArticles.sort(...)` mutates the array returned by `getCollection` in-place. In Astro's build, `getCollection` may return the same cached array reference across multiple page renders. This in-place sort corrupts the collection order for all subsequent consumers in the same build, including `[id].astro` and feed pages. The sort also lacks a stable tiebreaker -- when two articles have the same `sticky` and `publishedAt`, the order is engine-dependent and non-deterministic across builds.

**Fix:**
```typescript
// Before (mutates):
const sorted = allArticles.sort((a, b) => {
  if (a.data.sticky !== b.data.sticky) return a.data.sticky ? -1 : 1;
  return b.data.publishedAt.getTime() - a.data.publishedAt.getTime();
});

// After (immutable):
const sorted = [...allArticles].sort((a, b) => {
  if (a.data.sticky !== b.data.sticky) return a.data.sticky ? -1 : 1;
  const timeDiff = b.data.publishedAt.getTime() - a.data.publishedAt.getTime();
  if (timeDiff !== 0) return timeDiff;
  return a.id.localeCompare(b.id); // stable tiebreaker
});
```

---

### CR-03: In-place `.sort()` mutates content collection in both feed files

**File:** `src/pages/feed.xml.ts:11-13` and `src/pages/feed-full.xml.ts:28-30`
**Issue:** Both feed files call `articles.sort(...)` directly on the `getCollection` return value without spreading first. Same mutation bug as CR-02. Additionally, the non-null assertion `context.site!` at lines 16/35 will throw a cryptic `TypeError` if `astro.config.mjs` ever removes the `site` field, rather than failing with a clear error message.

**Fix:**
```typescript
// feed.xml.ts and feed-full.xml.ts -- both need:
const sorted = [...articles].sort(
  (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime()
);

// And replace context.site! with a guard:
if (!context.site) {
  return new Response('Missing site config', { status: 500 });
}
```

---

## Warnings

### WR-01: ShareButtons missing clipboard fallback for older browsers

**File:** `src/components/articles/ShareButtons.astro:54-58`
**Issue:** The copy-link button only uses `navigator.clipboard.writeText()` with no fallback. On HTTP (non-HTTPS) contexts or older browsers, `navigator.clipboard` is `undefined`, and the button silently does nothing. The sibling `CopyCodeButton.astro` (line 27-35) already implements a correct `textarea` + `document.execCommand('copy')` fallback -- the same pattern should be used here.

**Fix:**
```javascript
btn.addEventListener('click', function () {
  var url = btn.getAttribute('data-copy-url');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(function () {
      showCopyFeedback(btn);
    });
  } else {
    var textarea = document.createElement('textarea');
    textarea.value = url;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showCopyFeedback(btn);
  }
});
```

---

### WR-02: Duplicate sticker data in `public/` and `src/data/`

**File:** `public/stickers.json` and `src/data/stickers.json`
**Issue:** Both files contain identical Bilibili sticker JSON (147 lines each). The Twikoo component references `/stickers.json` (served from `public/`), so `src/data/stickers.json` appears unused. Duplicate data creates a maintenance burden -- updates must be applied to both files or they will diverge silently.

**Fix:** Remove `src/data/stickers.json` if it is not imported anywhere. If it is needed for build-time access, add a comment in both files noting which is the source of truth.

---

### WR-03: `toAbsoluteUrls` only handles `<img>` tags in full-content RSS

**File:** `src/pages/feed-full.xml.ts:9-19`
**Issue:** The `toAbsoluteUrls` regex only converts `<img src="...">` to absolute URLs. Relative URLs in `<a href="...">` tags are left as-is. RSS readers that render full content (e.g., Feedly, Inoreader) will resolve relative links against the reader's own domain, producing broken navigation links.

**Fix:**
```typescript
function toAbsoluteUrls(html: string, site: URL): string {
  return html.replace(
    /((?:src|href)=["'])([^"']+)(["'])/g,
    (match, prefix, url, suffix) => {
      if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:') || url.startsWith('#')) {
        return match;
      }
      const absolute = new URL(url, site).toString();
      return `${prefix}${absolute}${suffix}`;
    }
  );
}
```

---

### WR-04: ImageLightbox `initZoom` may leak medium-zoom instances

**File:** `src/components/articles/ImageLightbox.astro:8-13`
**Issue:** On `astro:after-swap` (View Transitions navigation), `initZoom()` is called again. The `medium-zoom` library creates a new overlay/container each time. Without calling `.detach()` on the previous instance, old zoom overlays accumulate in the DOM. On repeated navigation, this causes visual glitches (multiple overlays stacking) and memory leaks.

**Fix:**
```javascript
let zoomInstance = null;

function initZoom() {
  if (zoomInstance) {
    zoomInstance.detach();
  }
  zoomInstance = mediumZoom('article img', {
    margin: 24,
    background: 'rgba(0, 0, 0, 0.8)',
  });
}
```

---

### WR-05: ArticleTOC `initTOC` adds duplicate event listeners on View Transitions

**File:** `src/components/articles/ArticleTOC.astro:53-105`
**Issue:** `initTOC()` is called on initial load and again on `astro:after-swap`. Each call adds new `click` listeners to `.toc-link` elements and creates a new `IntersectionObserver`. After View Transitions navigation, old observers are not disconnected and old click handlers remain on any persisted DOM elements. This causes the smooth-scroll to fire multiple times per click and the active-state highlight to flicker between stale and current observer callbacks.

**Fix:**
```javascript
let currentObserver = null;

function initTOC() {
  // Disconnect previous observer
  if (currentObserver) {
    currentObserver.disconnect();
    currentObserver = null;
  }

  var links = document.querySelectorAll('.toc-link');
  if (links.length === 0) return;

  links.forEach(function (link) {
    // Remove old listeners by replacing the element
    var newLink = link.cloneNode(true);
    link.parentNode.replaceChild(newLink, link);
    newLink.addEventListener('click', function (e) {
      e.preventDefault();
      var slug = newLink.getAttribute('data-slug');
      var target = document.getElementById(slug);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Re-query after cloneNode replacements
  links = document.querySelectorAll('.toc-link');

  var headings = document.querySelectorAll('article h2, article h3');
  if (headings.length === 0) return;

  currentObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          updateActiveLink(entry.target.id);
        }
      });
    },
    { rootMargin: '-80px 0px -80px 0px', threshold: 0 }
  );

  headings.forEach(function (h) {
    if (h.id) currentObserver.observe(h);
  });

  function updateActiveLink(slug) {
    document.querySelectorAll('.toc-link').forEach(function (link) {
      if (link.getAttribute('data-slug') === slug) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}
```

---

## Info

### IN-01: `new URL(image, Astro.site)` in SEOMeta will throw on invalid image path

**File:** `src/components/seo/SEOMeta.astro:3`
**Issue:** If `image` is an empty string, `undefined`, or an invalid path, `new URL(image, Astro.site)` throws a `TypeError` at build time. BaseLayout defaults `image` to `'/og-default.png'`, so this is safe in the current call chain, but SEOMeta as a standalone component has no defensive check.

**Fix:** Add a guard: `const fullImage = image ? new URL(image, Astro.site).toString() : new URL('/og-default.png', Astro.site).toString();`

---

### IN-02: Date formatting uses server locale, not user locale

**File:** `src/components/articles/ArticleListItem.astro:23` and `src/components/articles/RelatedPosts.astro:19`
**Issue:** `toLocaleDateString('zh-CN')` runs at Astro build time on the server (Node.js). The output is baked into the static HTML. This is fine for a Chinese-language site targeting Chinese readers, but means the date format is hardcoded regardless of the visitor's locale.

**Fix:** No fix needed if Chinese locale is intentional. Otherwise, use a locale-agnostic format like `YYYY-MM-DD` or use a client-side formatting library.

---

### IN-03: Global CSS selectors risk naming collisions

**File:** `src/components/articles/CopyCodeButton.astro:58` (`<style is:global>`) and `src/components/articles/ImageLightbox.astro:19` (`<style is:global>`)
**Issue:** `.copy-code-btn` and `article img` are global selectors. If any third-party script (e.g., Twikoo) or future component uses the same class name or targets `article img`, styles will collide. This is a minor risk for a single-author site but worth noting.

**Fix:** Consider using scoped selectors or more specific class names (e.g., `.merlin-copy-btn`).

---

### IN-04: Content schema defines `password` field but no protection logic exists

**File:** `src/content.config.ts:18` defines `password: z.string().optional()`, but `src/pages/articles/[id].astro` has no password-gating logic.
**Issue:** The `password` field suggests articles should be password-protected, but no protection is implemented. If an author sets `password` on a frontmatter field, the article will be fully public regardless. This could lead to a false sense of security.

**Fix:** Either implement password protection (e.g., client-side gate before rendering content) or remove the `password` field from the schema to avoid confusion.

---

_Reviewed: 2026-06-03T12:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
