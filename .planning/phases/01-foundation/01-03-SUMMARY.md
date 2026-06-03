---
phase: 01-foundation
plan: 03
subsystem: ui
tags: [astro, tailwind, cloudflare-pages, sitemap, seo, 404, persona, yaml]

# Dependency graph
requires:
  - phase: 01-foundation/01-02
    provides: BaseLayout, Header, Footer, NotFound, NoticeBar, SEOMeta, pre-paint FOUC-safe gate
provides:
  - Home (PAGE-01) page with 5 component slots and locked section order
  - About (PAGE-02) page with persona card composed from src/data/persona.yaml
  - 404 page (INFRA-06) returning HTTP 404 with kawaii NotFound UI
  - public/_redirects www->apex 301 fallback for Cloudflare Pages
  - Owner-side Cloudflare Pages deploy checklist
affects: [01-03 deploy, 02-core-content, 05-atmosphere, 06-polish]

# Tech tracking
tech-stack:
  added: []
  patterns: [astro content collections getCollection with filter callback, Astro.response.status = 404 for custom 404, astro:assets image optimization, file() loader for JSON content, YAML import for build-time persona data]

key-files:
  created:
    - src/components/home/Hero.astro
    - src/components/home/LatestArticles.astro
    - src/components/home/LatestMicroblog.astro
    - src/components/home/Hitokoto.astro
    - src/components/home/SiteStats.astro
    - src/components/about/PersonaCard.astro
    - src/components/about/PersonaStats.astro
    - src/components/about/SkillBars.astro
    - src/components/about/PersonaFavorites.astro
    - src/components/about/PersonaQA.astro
    - src/pages/about.astro
    - src/pages/404.astro
    - public/_redirects
  modified:
    - src/pages/index.astro
    - src/data/persona.yaml
    - src/layouts/BaseLayout.astro (added data-theme + data-atmo defaults on <html>)
    - .planning/STATE.md

key-decisions:
  - "Used Astro.response.status = 404 + statusText = 'Not Found' in frontmatter (PITFALLS P-21) instead of meta-refresh redirect"
  - "Loaded persona from src/data/persona.yaml at build time (Astro 6 native YAML import) — single source of truth, owner edits YAML not components"
  - "Used getCollection('articles', ({ data }) => !data.draft) filter-callback form (Astro 6 idiom; skips drafts at loader level)"
  - "Used entry.id (Astro 6) instead of removed entry.slug for slug-based routing"
  - "Added data-theme=light + data-atmo=full defaults on <html> so the static file is self-sufficient if the pre-paint script fails (FOUC defense-in-depth)"

patterns-established:
  - "Pattern F: Persona card sections rendered conditionally on field presence (no 'coming soon' placeholders inside the card per UI-SPEC line 334)"
  - "Pattern G: 404 page with Astro.response.status = 404 + NotFound component from core/"
  - "Pattern H: Cloudflare Pages _redirects file (1 rule per line, source destination status) for static-platform redirects"

requirements-completed: [PAGE-01, PAGE-02, INFRA-03, INFRA-06]

# Metrics
duration: ~30min
completed: 2026-06-03
---

# Phase 1 Plan 3: Home + About + 404 + Cloudflare Pages Deploy Summary

**Home + About + 404 + Cloudflare Pages deploy config — the Walking Skeleton loop closes; site is production-ready**

## Performance

- **Duration:** ~30 min
- **Started:** 2026-06-03T10:45:00Z (approximate)
- **Completed:** 2026-06-03T11:25:00Z
- **Tasks:** 3 (all complete)
- **Files modified:** 14

## Accomplishments

- Home (PAGE-01) ships with 5 components (Hero, Hitokoto, SiteStats, LatestArticles, LatestMicroblog) composed in `src/pages/index.astro` in the locked order (NoticeBar → Hero → Hitokoto → SiteStats → LatestArticles → LatestMicroblog). Empty-state branches handle the no-content-yet condition; the dynamic `/articles/<id>` route 404s in Phase 1 (expected — Phase 2 adds the route).
- About (PAGE-02) ships with 5 components (PersonaCard, PersonaStats, SkillBars, PersonaFavorites, PersonaQA) composed from `src/data/persona.yaml` at build time. Owner edits the YAML to update persona data; no component code changes needed.
- 404 page (INFRA-06) returns `HTTP 404` with the kawaii `NotFound` UI. `Astro.response.status = 404` + `Astro.response.statusText = 'Not Found'` in the frontmatter prevent the soft-404 anti-pattern (PITFALLS P-21).
- `public/_redirects` provides the www→apex 301 fallback for the case when the CF Pages dashboard toggle is unavailable.
- Cloudflare Pages deploy config documented in commit body: framework preset Astro, build command `pnpm build`, output `dist/`, env vars `NODE_VERSION=22` + `NODE_OPTIONS=--max-old-space-size=4096`, custom domain + 301 redirect setup, post-deploy verification commands.

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Home components and `src/pages/index.astro`** - `7965258` (feat)
2. **Task 2: Create About components, `src/pages/about.astro`, and `src/pages/404.astro`** - `cd202ec` (feat)
3. **Task 3: Cloudflare Pages deploy config + final verification + commit + STATE update** - `7eda672` (feat)

**Plan metadata:** `pending` (this docs commit)

_Note: No TDD tasks in this plan — UI assembly only._

## Files Created/Modified

- `src/components/home/Hero.astro` - Display name (32px) + tagline + `进入次元` CTA → /about
- `src/components/home/LatestArticles.astro` - Top 3 articles or `还没有文章` empty state
- `src/components/home/LatestMicroblog.astro` - Top 5 microblog or `暂无说说` empty state
- `src/components/home/Hitokoto.astro` - 「 一言 」 placeholder (Phase 4 replaces with API)
- `src/components/home/SiteStats.astro` - 3-column row: 运行时间 / 文章数 / 总字数
- `src/components/about/PersonaCard.astro` - Container composing all 4 sub-components
- `src/components/about/PersonaStats.astro` - 3 chips (MBTI / zodiac / blood) with accent border + radius-full
- `src/components/about/SkillBars.astro` - Skill list with bars + percent
- `src/components/about/PersonaFavorites.astro` - 2-column favorites (anime + characters)
- `src/components/about/PersonaQA.astro` - `<dl>` of Q&A pairs
- `src/pages/index.astro` - Home page (replaces plan 01-01 Hello-World)
- `src/pages/about.astro` - About page (loads persona from YAML)
- `src/pages/404.astro` - 404 page (Astro.response.status = 404)
- `src/data/persona.yaml` - All D-14 fields populated with real placeholder values
- `public/_redirects` - www → apex 301 redirect (CF Pages fallback)
- `src/layouts/BaseLayout.astro` - Added `data-theme="light"` + `data-atmo="full"` defaults on `<html>` (deviation)
- `.planning/STATE.md` - Marked Phase 1 complete; added Phase 1 Closeout section

## Decisions Made

- **Persona as YAML, not TS module.** Build-time `import persona from '../data/persona.yaml'` is owner-editable without touching component code. Astro 6 supports YAML imports natively; no `@rollup/plugin-yaml` install needed.
- **404 status in frontmatter, not meta-refresh.** PITFALLS P-21: `Astro.response.status = 404` in frontmatter is the canonical pattern; meta-refresh returns 200 + UI which search engines treat as duplicate of homepage.
- **FOUC defense-in-depth.** Pre-paint script already sets `data-theme` at runtime; added static `data-theme="light"` + `data-atmo="full"` defaults on `<html>` so the file is self-sufficient if the script fails or is delayed (e.g., network partition, CSP issue, ad blocker).
- **GetCollection with filter callback.** Used `getCollection('articles', ({ data }) => !data.draft)` form (Astro 6 idiom) so drafts are skipped at the loader level, not by post-filter.
- **`entry.id`, not `entry.slug`.** Astro 5 removed `entry.slug`; the `id` is the slug-based path for `src/content/articles/*` entries.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added static `data-theme` + `data-atmo` defaults on `<html>`**
- **Found during:** Task 3 (final build verification)
- **Issue:** Plan's verification check `grep -c "data-theme=" dist/index.html` ≥ 1 was failing because the pre-paint script sets `data-theme` on `<html>` at runtime (via `document.documentElement.dataset.theme = ...`). The static HTML had no `data-theme` attribute, which means a no-JS visitor (or a visitor whose pre-paint script fails) would have NO theme applied, breaking the FOUC contract.
- **Fix:** Added `data-theme="light"` and `data-atmo="full"` defaults to the `<html>` element in `src/layouts/BaseLayout.astro`. The pre-paint script still overrides these at runtime based on `localStorage` and `prefers-color-scheme`. This is defense-in-depth: the static HTML is now self-sufficient even if the script never runs.
- **Files modified:** `src/layouts/BaseLayout.astro`
- **Verification:** `grep -c "data-theme=" dist/index.html` returns 1; `grep -c "data-atmo=" dist/index.html` returns 1; pre-paint `<script>` still runs at line 1, before the first `<link>` at line 49 (FOUC-safe invariant preserved).
- **Committed in:** `7eda672` (Task 3 commit)

---

**Total deviations:** 1 auto-fixed (1 missing critical — FOUC contract hardening)
**Impact on plan:** The default `data-theme="light"` is a safe minimum that the pre-paint script immediately overrides for users with stored preferences. No risk of behavior regression. The change strengthens the FOUC contract for edge cases (no-JS, script failure, slow script load).

## Issues Encountered

- **Build port collision in dev server.** `pnpm dev` started on port 4324 instead of 4321 because ports 4321-4323 were already in use by previous dev servers that weren't fully killed. Worked around by using `$PORT=4324` in the verification curls and confirming all checks pass. Cosmetic issue, not a blocker.
- **Build warning about `microblog` collection.** Astro emitted `The collection "microblog" does not exist or is empty. Please check your content config file for errors.` even though the collection is defined and the `file()` loader reports "No items found". The build still completes with `0` pages generated from the empty collection (correct behavior). Pre-existing warning from plan 01-02, not introduced by 01-03. No action taken — the warning is benign and disappears once content files are added in Phase 2.

## User Setup Required

**External services require manual configuration.** The owner must:

1. **Connect Cloudflare account to the GitHub repo** (or push to a new GitHub repo first).
2. **Create Cloudflare Pages project** with framework preset Astro.
3. **Set build command and output directory**: `pnpm build` / `dist`.
4. **Set environment variables**: `NODE_VERSION=22`, `NODE_OPTIONS=--max-old-space-size=4096`.
5. **Configure custom domains**: add `merlinalex.me` (apex, CF auto-provisions SSL) + `www.merlinalex.me` (toggle "Redirect to primary domain" ON).
6. **Push to main** to trigger the first production build.
7. **Verify post-deploy** with the curl checks listed in the commit body.

The `public/_redirects` file in the repo provides a fallback for the www→apex redirect if the dashboard toggle is ever removed.

## Next Phase Readiness

Phase 1 is complete. The Walking Skeleton loop is closed:
- Scaffold + 9 Zod-validated content collections + FOUC-safe theme/atmo gate + reduced-motion baseline + Home + About + 404 + Cloudflare Pages deploy config.
- Site is production-ready pending the owner's manual Cloudflare Pages setup.

Ready for **Phase 2 — Core Content**:
- Articles index (`/articles`) + per-article pages (`/articles/<id>`)
- Real article + microblog content (replaces the empty-state branches in Home)
- RSS feed content + email subscription
- Twikoo comments (Vercel + MongoDB Atlas deployment)
- Sticker pack
- Article-reading flow: frontmatter → render → reading-time → related-articles

No blockers for Phase 2.

---
*Phase: 01-foundation*
*Completed: 2026-06-03*
