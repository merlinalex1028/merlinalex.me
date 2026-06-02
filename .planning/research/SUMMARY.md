# Project Research Summary

**Project:** merlinalex.me — 二次元 (anime/kawaii) personal blog + portfolio + small community hub
**Domain:** Static personal site with immersive anime atmosphere; single author, dual audience (anime friends + tech circle)
**Researched:** 2026-06-02
**Confidence:** HIGH (stack/architecture/pitfalls well-documented; ecosystem norms HIGH for tooling, MEDIUM for "what users actually expect")

---

## Executive Summary

This is a **static-first personal website** that has to feel "alive and uniquely mine" through immersive anime atmosphere (Live2D mascot, falling petals, custom right-click, BGM, theme switching) while keeping the content structure practical (mixed-genre articles, two works modules, friend links, microblog, anime lists, timeline). The PROJECT.md spec explicitly excludes accounts, real-time data, analytics, and self-hosted DBs — all of which point to a static-site-generator architecture rather than a SPA/SSR.

**Recommended approach: Astro v6 + Tailwind v4 + l2d-widget + APlayer/MetingJS + tsParticles + Twikoo, hosted on Cloudflare Pages.** Astro wins over Hexo/Hugo because the "二次元" atmosphere is custom JS either way (none of the existing themes perfectly match the spec), and Astro's content collections with Zod validation cleanly model the 8+ distinct content types. Islands architecture is the natural answer to "Live2D must not block first paint" — every atmosphere widget is `client:visible` or `client:idle`, so static HTML ships first. Twikoo handles comments via a separate Vercel+MongoDB Atlas deployment (free tier), connected to the static site by a single `envId`.

**Key risks (all mitigatable in phase 1):** (1) Live2D is a 5–20 MB asset that can murder mobile performance — must ship a static-fallback path and a device-capability gate from day one; (2) BGM autoplay is silently blocked by all modern browsers — must be muted by default with an explicit unmute affordance; (3) the 沉浸二次元 atmosphere is hostile UX for users with vestibular disorders or low-end devices — a global "atmosphere intensity" toggle plus `prefers-reduced-motion` support is **non-negotiable** and was missing from PROJECT.md; (4) theme switching causes FOUC if not handled with a pre-paint inline script.

---

## Key Findings

### Recommended Stack

A **modern, static-first, type-safe stack** built on Astro's islands architecture. The combination is well-documented (HIGH confidence on every line item), all libraries are current (Astro v6.4.2, Tailwind v4.3.0, l2d-widget v0.1.0 — the 2026 rewrite of `oh-my-live2d`), and everything has a generous free tier that satisfies the $0/month constraint.

**Core technologies:**
- **Astro v6.4.2** — Static site generator + islands runtime. Content Collections with Zod schemas map exactly to PROJECT.md's multi-module content. `client:visible` / `client:idle` solve "Live2D must not block first paint" natively.
- **Tailwind v4.3.0** — CSS-first config via `@theme`; installed as a Vite plugin in Astro 5.2+ (NOT the legacy `@astrojs/tailwind` integration, which is Tailwind 3 only).
- **TypeScript 5.5.x** — Strict mode; Zod schema types are inferred into `getCollection()` return values.
- **MDX (`@astrojs/mdx`)** — Articles embed Astro components.
- **l2d-widget v0.1.0** — Live2D mascot. Replaces the abandoned `oh-my-live2d` package; ~500 LOC, zero deps, supports Cubism 2 + 6 runtimes.
- **tsParticles** — Falling petals/snow/cursor-trail with an official Astro wrapper. Replaces the unmaintained `particles.js`.
- **APlayer v1.10.1 + MetingJS v2.0.2** — Site-wide BGM. APlayer is stable but stagnant (2018); MetingJS v2 is actively maintained.
- **Twikoo v1.7.4** — Comments. Frontend lives on the static site; backend on Vercel serverless + MongoDB Atlas M0 (free).
- **Pagefind** — Static full-text search (~3KB runtime, native Astro integration, handles CJK well).
- **@astrojs/rss** + **@astrojs/sitemap** — One-line integrations for RSS/sitemap.
- **Cloudflare Pages** — Hosting. Unlimited bandwidth (critical advantage over Vercel Hobby), global CDN, auto HTTPS, 500 builds/month free.
- **Bangumi API v0** — Anime/manga/book/game tracking, build-time fetch only (no runtime calls).
- **Astro v6** requires Node 22 LTS. Package manager: pnpm. Tests: Vitest + Playwright per CLAUDE.md testing rules.

### Expected Features

PROJECT.md's 12 pages + 6 atmosphere requirements + 3 discovery + 6 infrastructure are mostly validated by genre conventions, with **several critical gaps to add to v1** and **one misclassification to fix**.

**Must have (table stakes for the 二次元 genre):**
- **Pages:** Home with hero + latest articles + latest microblog (PAGE-01), Articles index with tag filter (PAGE-03), Article detail with TOC + code highlight + reading time (PAGE-04), About with persona card (PAGE-02), Friend links (PAGE-08), Microblog feed (PAGE-09), Custom 404 (INFRA-06).
- **Atmosphere:** Light/dark theme switcher with persistence (ATM-04), Falling petals theme-linked (ATM-02), Custom right-click menu (ATM-03), BGM with resume (ATM-05), Live2D mascot static+switcher (ATM-01 trimmed — no dress-up).
- **Discovery:** RSS (DISC-01), site search (DISC-02 narrowed to articles only), tag cloud + chronological archive (DISC-03).
- **Infrastructure:** Astro SSG (INFRA-01), Cloudflare Pages + HTTPS (INFRA-02/06), Twikoo comments (INFRA-03), APlayer+MetingJS (INFRA-05).
- **Article-level UX (missing from PROJECT.md, add to PAGE-04):** copy-code button, image lightbox/zoom, prev/next + related posts, last-updated vs published, share buttons, sticky/pinned posts, copyright footer, top button, password-protected posts.
- **Home-page widgets (missing from PROJECT.md, add to PAGE-01):** Hitokoto random quote, site stats widget (runtime + article count + words + busuanzi visitors), notice/announcement bar.
- **Critical accessibility add:** "atmosphere intensity" toggle + `prefers-reduced-motion` support — disables Live2D/petals/BGM. **Without this, the site is hostile to users with vestibular disorders or low-end devices.**

**Should have (differentiators — "uniquely mine"):**
- **Dual works modules (PAGE-05/06/07)** — Projects (card grid + tech-stack tags + GitHub stars) vs Creations (masonry + lightbox) with distinct visual treatments.
- **Persona card with depth (PAGE-02)** — Avatar + pronunciation + MBTI/zodiac/blood-type + skill bars + favorite anime/character list.
- **Timeline / Journey (PAGE-11)** — Year-by-year milestones; vertical alternating-side layout.
- **Site-wide BGM with single-track + resume-on-return (ATM-05)**.
- **Easter eggs (ATM-06)** — Pair with ATM-03.
- **Sticker/emote pack for comments** — Bilibili-style 表情包.
- **Friend-link health check** — GitHub Action cron.
- **Hitokoto on home banner** — Reclassify from Out of Scope.
- **OG/Twitter cards + sitemap + robots.txt** — SEO baseline.

**Defer (v1.x or v2+):**
- **Avatar generator (PAGE-12)** — Requires 50–200 layered illustration assets. Embed Picrew link for v1.
- **Live2D dress-up (ATM-01 sub-feature)** — Drop as distinct feature; keep model switcher.
- **Holiday theme variants (ATM-04 full sub-scope)** — Replace with lightweight date-based atmosphere tweaks for 2–3 dates.
- **Email subscription (DISC-01 email portion)** — Add only if RSS subscribers >50.
- **Cross-collection site search (DISC-02 full scope)** — Ship articles-only first.
- **Game + music tracking inside PAGE-10** — Defer.
- **PWA / service worker** — Defer.
- **Multi-language (CN/EN)** — Defer.

### Architecture Approach

A **static-first Astro site** with **typed content collections**, a **layered atmosphere runtime** that hydrates via `client:visible` / `client:idle`, and **external runtime services only for user-generated content**. Build-time data fetching (Bangumi, GitHub stars) means zero external API calls during page view.

**Major components:**
1. **Content sources + Zod schemas (`src/content.config.ts`)** — Author-supplied markdown (articles, projects, creations, microblog, timeline) and JSON (anime/book/music lists, friends). Zod-validated at build.
2. **Astro build pipeline** — Renders all 12 pages to static HTML, generates `dist/`, runs Pagefind indexer, emits RSS + sitemap. `output: 'static'`.
3. **Layered atmosphere runtime (`src/components/atmosphere/*`)** — Live2D, BGM, petals, cursor trail, theme switcher, right-click, easter eggs. All opt-in islands.
4. **External services (deployed separately, embedded via island)** — Twikoo (Vercel + MongoDB Atlas M0), Bangumi API (build-time only), APlayer+MetingJS.
5. **Atmosphere disable toggle (NEW, accessibility-critical)** — Global state in `localStorage` that gates all atmosphere features.

### Critical Pitfalls

1. **Live2D model becomes a mobile performance black hole (P-1)** — 5–20 MB asset can drop mobile FPS to <20, eat 200–400 MB RAM. Mitigate with device-capability gate, `client:visible` directive, WebP/AVIF textures, and a **static PNG fallback**.
2. **BGM autoplay blocked silently by every modern browser (P-2)** — Mitigate with "muted autoplay + unmute button" pattern; persist user preference; use `AudioContext.resume()` in `'click'` / `'touchend'`.
3. **Falling petals / snow / cursor-trail effects tank mobile battery (P-3)** — Cap particle count to 20 on mobile, throttle canvas to 30 FPS, pause on `document.hidden`, tie to `prefers-reduced-motion`.
4. **Theme switching causes FOUC on first paint (P-4)** — Inline a tiny pre-paint script in `<head>` that reads theme from `localStorage` and sets `document.documentElement.dataset.theme` synchronously.
5. **`prefers-reduced-motion` ignored — accessibility violation (P-6)** — Global CSS rule + gate Live2D motion + canvas RAF on `reducedMotion` boolean.

Other significant pitfalls: Live2D model licensing + custom vs stock (P-5), Twikoo Vercel deployment quirks (P-8), Bangumi API staleness (P-9 — cache 12h, refresh via cron), View Transitions + Live2D widget reload (P-11 — use `transition:persist`), CJK web font load time + CLS (P-10/P-18).

---

## Implications for Roadmap

**Suggested phases: 6**

### Phase 1: Foundation
**Delivers:** Astro project initialized with TS strict + Tailwind v4 + MDX; Zod schemas for all 5 content collections; `BaseLayout.astro` with FOUC-safe theme-switcher in `<head>`; global CSS tokens; Cloudflare Pages wired up; PAGE-01 (home with hero) and PAGE-02 (about with persona card) rendering.
**Addresses:** INFRA-01, INFRA-02, INFRA-06, PAGE-01, PAGE-02, ATM-04 (core).
**Avoids:** P-4 (FOUC), P-6 (prefers-reduced-motion), P-19 (build OOM).
**Research flag:** No.

### Phase 2: Core Content
**Delivers:** Articles index with tag filter (PAGE-03), article detail (PAGE-04) with all article-level UX (copy-code, lightbox, prev/next, last-updated, share, copyright, sticky, password-protected, top button), RSS (DISC-01), sitemap, OG/Twitter cards, Twikoo comments deployed (INFRA-03).
**Addresses:** PAGE-03, PAGE-04, DISC-01, INFRA-03.
**Avoids:** P-8 (Twikoo Vercel), P-12 (RSS), P-13 (SEO).
**Research flag:** Maybe (Twikoo Vercel + MongoDB Atlas wiring).

### Phase 3: Works Modules + Friend Links
**Delivers:** Works hub (PAGE-05), Projects module (PAGE-06) with tech-stack tags + GitHub stars fetched at build, Creations module (PAGE-07) with lightbox gallery, Friend Links page (PAGE-08) with submission entry.
**Addresses:** PAGE-05, PAGE-06, PAGE-07, PAGE-08.
**Avoids:** Anti-pattern (don't merge projects+creations), P-16 (friend links going stale — GitHub Action cron).
**Research flag:** No.

### Phase 4: Community Pages + Search
**Delivers:** Microblog feed (PAGE-09) with image lightbox + comments, Bangumi-style anime/book lists (PAGE-10) with build-time fetch + 12h cache, Timeline (PAGE-11), Pagefind search (DISC-02 — articles only), Hitokoto random quote, site stats widget, notice/announcement bar.
**Addresses:** PAGE-09, PAGE-10, PAGE-11, DISC-02, INFRA-04.
**Avoids:** P-9 (Bangumi staleness), P-14 (Pagefind build time), P-15 (microblog graveyard).
**Research flag:** Yes (Bangumi API specifics + sync strategy).

### Phase 5: Atmosphere
**Delivers:** BGM player (ATM-05) with APlayer+MetingJS+muted-by-default, Falling petals (ATM-02) with theme-linked color + mobile cap + reduced-motion gate, Live2D mascot (ATM-01) with static+switcher + device-capability gate + static-PNG fallback, Custom right-click (ATM-03 — `Shift+right-click` only), Easter eggs (ATM-06), date-based atmosphere tweaks, **atmosphere intensity toggle (NEW — a11y critical)**, **sticker/emote pack for comments (NEW)**, **password-protected posts (NEW)**.
**Addresses:** ATM-01, ATM-02, ATM-03, ATM-05, ATM-06, INFRA-05.
**Avoids:** P-1, P-2, P-3, P-5, P-7, P-11, P-17.
**Research flag:** Yes (Live2D licensing + performance tuning).

### Phase 6: Discovery Polish + 404
**Delivers:** Tag cloud + chronological archive (DISC-03), custom-styled 404 (INFRA-06 final), `Article` + `Person` + `BreadcrumbList` JSON-LD, sitemap submission to Google + Bing, friend-link health check GitHub Action.
**Addresses:** DISC-03, INFRA-06 (final).
**Avoids:** P-13, P-21.
**Research flag:** No.

### Phase Ordering Rationale

- **Schemas first** — every listing/filtering page depends on collection schemas.
- **BaseLayout in Phase 1** — every page uses it.
- **Twikoo in Phase 2** — requires articles as a comment target.
- **Bangumi in Phase 4** — safer to ship after site has content.
- **Live2D in Phase 5 (last)** — heaviest, most failure-prone; do it last.
- **Atmosphere disable toggle ships with ATM-01** — not retrofitted.
- **Pagefind in Phase 4** — only makes sense once there's content to search.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| **Stack** | HIGH | Every library version verified via Context7 + GitHub 2026-06-02. |
| **Features** | HIGH for table stakes; MEDIUM for differentiators | Cross-referenced against Butterfly/Yun/Sakura/Stellar. |
| **Architecture** | HIGH for Astro mechanics; MEDIUM for ecosystem patterns | Verified against official Astro + Twikoo docs. |
| **Pitfalls** | HIGH for critical; MEDIUM-LOW for minor | Chrome/MDN/Twikoo sources for critical. |
| **Overall** | **HIGH** | MEDIUM areas are tuning, not architectural risk. |

### Gaps to Address

- **Live2D model licensing + acquisition** — Phase 5 decision.
- **MetingJS backend** — default proxy vs self-hosted Worker; Phase 5 decision.
- **Bangumi API rate limits** — mitigated by build-only + 12h cache.
- **Twikoo commercial-use clause for Vercel Hobby** — owner assertion; review Vercel ToS in Phase 2.
- **Twikoo China-mainland latency** — custom domain or Tencent CloudBase; Phase 2.
- **Avatar generator (PAGE-12) feasibility** — defer to v2+ per FEATURES.md.
- **Live2D dress-up feasibility** — drop in v1 per FEATURES.md.

---

## Notable PROJECT.md Adjustments to Validate

1. **Reclassify Hitokoto** from Out of Scope → in-scope (differentiator tier).
2. **Add accessibility-critical "atmosphere intensity" toggle + `prefers-reduced-motion` support**.
3. **Add article-level UX features** to PAGE-04: copy-code, image lightbox, prev/next, last-updated, share, copyright, sticky, password-protected, top button.
4. **Add home-page widgets** to PAGE-01: Hitokoto, site stats, notice bar.
5. **Add SEO baseline**: OG/Twitter cards, sitemap, robots.txt, JSON-LD.
6. **Trim ATM-01**: drop "dress-up"; keep "model switcher".
7. **Trim ATM-04**: drop "holiday variants" full sub-scope; replace with lightweight date-based tweaks.
8. **Defer PAGE-12 (avatar generator) to v2+**; embed Picrew link in v1.
9. **Defer DISC-01 email subscription** to v1.x.
10. **Defer DISC-02 cross-collection search** to v1.1; ship articles-only in v1.

---

## Sources

### Primary (HIGH confidence — verified 2026-06-02)
- Astro docs (`/withastro/docs` via Context7) — Collections, Zod, islands, `client:visible` / `client:idle`, Tailwind v4 Vite plugin
- Tailwind v4.3.0 (`tailwindlabs/tailwindcss/releases`)
- `hacxy/l2d-widget` v0.1.0 (May 2026)
- APlayer v1.10.1 + MetingJS v2.0.2
- Twikoo v1.7.4 via Context7
- Cloudflare Pages limits (`developers.cloudflare.com/pages/platform/limits/`)
- Bangumi API v0 spec
- Hexo themes directory (Anzhiyu, Butterfly, Sakura, Stellar)
- Pagefind via Context7
- Chrome Autoplay Policy, MDN `prefers-reduced-motion`, Web Vitals CLS

### Secondary (MEDIUM)
- Hexo theme Butterfly + Valaxy/Yun + Stellar docs
- Vercel Hobby tier commercial-use clause (community-known)

### Tertiary (LOW)
- 不蒜子 (busuanzi) visitor counter
- Hitokoto API (`hitokoto.cn`)
- Picrew (`picrew.me/en`)
- Bangumi anonymous-read rate limits (inferred)

---

*Research completed: 2026-06-02*
*Ready for roadmap: yes*
