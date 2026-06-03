# Requirements: merlinalex.me

**Defined:** 2026-06-02
**Core Value:** A personal space that **feels alive and uniquely mine** — visitors (mostly the owner + close circle) should feel they're stepping into a little world, not scrolling a generic blog.

---

## v1 Requirements

### Pages & Navigation
- [ ] **PAGE-01**: Home page with hero, latest articles, latest microblog, Hitokoto random quote, site stats (runtime + article count + words + busuanzi), notice/announcement bar
- [ ] **PAGE-02**: About page with second-anime persona card (avatar, MBTI, zodiac, blood type, skill bars, favorite anime/character list, Q&A)
- [x] **PAGE-03**: Articles index with tag-based filtering (tags: tech, life, review, notes…)
- [x] **PAGE-04**: Article detail page with TOC, code highlight, reading time, last-updated, share buttons, copy-code button, image lightbox, prev/next + related, sticky/pinned posts, copyright footer, top button, password-protected posts
- [ ] **PAGE-05**: Works hub page linking to two sub-modules
- [ ] **PAGE-06**: Works → Projects module (open-source, tools, websites) with card grid, tech-stack tags, GitHub stars (build-time fetch)
- [ ] **PAGE-07**: Works → Creations module (illustrations, photos, crafts, videos) with masonry + lightbox gallery
- [ ] **PAGE-08**: Friend Links page with submission entry, health-check badge, sorted by category
- [ ] **PAGE-09**: Microblog (说说 / 碎碎念) feed with image lightbox + comments; cap home to 5 latest; auto-archive >180 days
- [ ] **PAGE-10**: Anime / Book / Music list pages (Bangumi-style: watching / watched / want) with build-time fetch + 12h cache
- [ ] **PAGE-11**: Timeline / Journey page (year-by-year vertical alternating-side milestones)
- [ ] **PAGE-12** (v2+): Avatar generator (let visitors generate kawaii avatars) — DEFERRED; embed Picrew link in v1

### Atmosphere & Decorations
- [ ] **ATM-01**: Live2D / static mascot (kanban girl) — interactive: greeting, model switcher; with device-capability gate (`navigator.deviceMemory >= 4 && hardwareConcurrency >= 4`) + `client:visible` hydration + static PNG fallback for low-end devices + WebP/AVIF textures
- [ ] **ATM-02**: Falling-petal / snow / cursor-trail effects; theme-linked color; capped to 20 on mobile; 30 FPS throttle; pause on `document.hidden`
- [ ] **ATM-03**: Custom right-click menu (`Shift+right-click` only — never hijack global `contextmenu`); long-press toolbar fallback
- [ ] **ATM-04**: Light/dark theme switcher with persistence; pre-paint inline script in `<head>` (FOUC-safe); light date-based atmosphere tweaks for 2–3 dates max
- [ ] **ATM-05**: Site-wide BGM player with APlayer+MetingJS, playlist + single-track mode, muted-by-default + unmute button, resume-on-return; iOS `AudioContext.resume()` in `'click'` / `'touchend'`
- [ ] **ATM-06**: Hidden easter eggs (Konami code, secret terminal); ignore key events in inputs/textareas/contenteditable
- [ ] **A11Y-01** (NEW): **Atmosphere intensity toggle** in right-click menu (Off / Subtle / Full); persisted in `localStorage`; gates Live2D/petals/BGM
- [ ] **A11Y-02** (NEW): `prefers-reduced-motion` media query — global CSS rule + gate Live2D motion amplitude + canvas RAF loops

### Discovery & Growth
- [x] **DISC-01**: RSS feed (`/feed.xml` summary + `/feed-full.xml` full-content) with CDATA escaping; validated in W3C feed validator; autodiscovery `<link rel="alternate">` in `<head>`
- [ ] **DISC-02** (v1: articles-only): Site search via Pagefind (excludes microblog with `data-pagefind-filter="exclude"`); v1.1 expands to works + microblog
- [ ] **DISC-03**: Tag cloud + chronological archive; hide tags with 0 or 1 posts
- [ ] **SEO-01** (NEW): Sitemap (`@astrojs/sitemap`), robots.txt, OG/Twitter cards per article, `Article` + `Person` + `BreadcrumbList` JSON-LD structured data
- [x] **SEO-02** (NEW): Internal linking "Related" component in article footer; alt text on all images

### Infrastructure
- [x] **INFRA-01**: Astro v6.4.2 + TypeScript strict + Tailwind v4 (via `@tailwindcss/vite`) + MDX; pnpm; Node 22 LTS
- [x] **INFRA-02**: Zod-validated content collections: `articles`, `projects`, `creations`, `microblog`, `timeline`, `friends`, `anime`, `books`, `music` (in `src/content.config.ts`)
- [ ] **INFRA-03**: Cloudflare Pages hosting — unlimited bandwidth, auto HTTPS, global CDN, 500 builds/month free
- [x] **INFRA-04**: Twikoo comments on separate Vercel project (MongoDB Atlas M0); embedded via `envId`; no Vercel Authentication enabled; third-party image host configured; admin email notifications
- [ ] **INFRA-05**: Bangumi API build-time fetch (`/v0/users/{username}/collections`); cached to `src/data/bangumi.json` with 12h TTL; refresh via prebuild script; manual override file for per-episode progress
- [ ] **INFRA-06**: APlayer v1.10.1 + MetingJS v2.0.2 for BGM; custom domain; custom 404 page returning HTTP 404 status (`Astro.response.status = 404`)
- [x] **INFRA-07**: Sticker/emote pack for Twikoo comments (Bilibili-style 表情包)
- [ ] **INFRA-08**: Friend-link health check via GitHub Action cron (5s timeout HEAD request); mark dead in UI
- [ ] **TEST-01**: Vitest + Playwright per CLAUDE.md testing rules; 80% coverage on critical paths (comment posting, theme persistence, search index, Live2D fallback)
- [ ] **GIT-01**: `NODE_OPTIONS=--max-old-space-size=4096` set in build env; cache Sharp outputs

---

## v2 Requirements (Deferred)

### Pages
- **PAGE-12-v2**: Avatar generator (requires 50–200 layered illustration assets; embed Picrew link in v1)

### Atmosphere
- **ATM-07-v2**: Live2D dress-up (requires Cubism Editor $90+/yr + custom modeling per outfit)
- **ATM-08-v2**: Holiday theme variants (full set: Christmas / NYE / Spring Festival / Sakura season / Halloween)

### Discovery
- **DISC-04-v1.x**: Email subscription (add when RSS subscribers >50)
- **DISC-05-v1.1**: Cross-collection site search (works + microblog)
- **DISC-06-v1.x**: Sitemap submission to Google Search Console + Bing Webmaster Tools automation

### Community
- **COMM-01-v2**: Friend-link submission form (self-service via GitHub Issue or external form)
- **COMM-02-v2**: Hot-pinned notice bar via Twikoo or admin panel
- **COMM-03-v2**: Mobile-first microblog posting via Memos integration (if markdown friction becomes a complaint)

### Multi-media
- **MEDIA-01-v1.x**: Game tracking inside PAGE-10
- **MEDIA-02-v1.x**: Music / podcast tracking (separate from MPD-style BGM)
- **MEDIA-03-v2**: PWA / service worker (offline access)

### Internationalization
- **I18N-01-v2**: Multi-language (zh-CN / en / ja-JP)
- **I18N-02-v2**: Per-article `lang` attribute + UI translations

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| User accounts / login / profiles | Visitor accounts not needed; comments are anonymous via 3rd party; per PROJECT.md constraint |
| Real-time chat / danmaku | High complexity, not core to "alive" feel |
| Video posts / podcast hosting | Bandwidth/storage too costly for v1 |
| E-commerce / shop | Out of scope entirely |
| Lottery / gashapon interactive games | Defer to v2 |
| Site statistics / visitor analytics dashboard | Not core to "alive" feel; busuanzi is sufficient |
| Guestbook (separate from comments) | Comments sufficient for v1 |
| Random-image widget | Defer; Hitokoto covers the "random fun" need |
| Self-hosted database | $0/month constraint; no need in v1 |
| Server-side rendering (SSR) | Static-first; no real-time data |
| AdSense / sponsored content | Site is non-commercial; PROJECT.md constraint |

---

## Traceability

Compound requirements (INFRA-06, INFRA-08) span phases by sub-scope but the owning phase per scope is unique.

| Phase | Requirements | Status |
|-------|--------------|--------|
| Phase 1 — Foundation | PAGE-01, PAGE-02, ATM-04, INFRA-01, INFRA-02, INFRA-03, INFRA-06 (custom domain + 404 stub), A11Y-01, A11Y-02, SEO-01 | Pending |
| Phase 2 — Core Content | PAGE-03, PAGE-04, DISC-01, INFRA-04, INFRA-07, SEO-02 | Pending |
| Phase 3 — Works + Friend Links | PAGE-05, PAGE-06, PAGE-07, PAGE-08, INFRA-08 (UI badge stub) | Pending |
| Phase 4 — Community + Search | PAGE-09, PAGE-10, PAGE-11, DISC-02, DISC-03, INFRA-05 | Pending |
| Phase 5 — Atmosphere | ATM-01, ATM-02, ATM-03, ATM-05, ATM-06, INFRA-06 (BGM portion via APlayer + MetingJS) | Pending |
| Phase 6 — Polish | INFRA-06 (custom 404 polish + JSON-LD), INFRA-08 (GitHub Action cron implementation), TEST-01, GIT-01 | Pending |

**Coverage:**
- v1 requirement scopes: 36 total
- Mapped to phases: 36
- Unmapped: 0 ✓
- Deferred to v2: PAGE-12 (avatar generator — embed Picrew link inline in Phase 2 article authoring instead)

---

*Requirements defined: 2026-06-02*
*Last updated: 2026-06-02 after roadmap synthesis (traceability rows refined with compound-requirement sub-scope annotations; TEST-01 and GIT-01 now explicitly named in Phase 6)*
