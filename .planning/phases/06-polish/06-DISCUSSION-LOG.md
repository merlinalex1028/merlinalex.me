# Phase 6: Polish - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-05
**Phase:** 6-Polish
**Areas discussed:** 404 page personality, JSON-LD coverage, Test strategy, Build hardening

---

## 404 Page Personality

### Vibe

| Option | Description | Selected |
|--------|-------------|----------|
| Lost mascot | A confused/lost mascot illustration (static image or CSS art) with a fun message like "咦？这里什么都没有…" — matches the 二次元 aesthetic | ✓ |
| Animated scene | A small animated scene — mascot walking around looking lost, or floating in space. More immersive but heavier. | |
| Minimal kawaii | Clean design with kawaii typography and a single cute icon. Lighter, faster, but less personality. | |

**User's choice:** Lost mascot (Recommended)
**Notes:** User wants the 二次元 aesthetic with a confused mascot illustration

### Interactivity

| Option | Description | Selected |
|--------|-------------|----------|
| Random messages | Each visit shows a random fun message from a pool (e.g., "迷路了？" / "走丢了？" / "这里什么都没有哦~") — lightweight JS, adds personality | ✓ |
| Static only | One fixed message, no JS. Simpler, faster, but less surprising on repeat visits. | |
| Mini-game | A tiny interactive element like clicking the mascot for a reaction. Fun but adds complexity. | |

**User's choice:** Random messages (Recommended)
**Notes:** Lightweight JS to show different messages on each visit

### Mascot Implementation

| Option | Description | Selected |
|--------|-------------|----------|
| CSS art | Pure CSS mascot illustration — no external image, loads instantly, theme-aware colors. Similar to the existing gradient box but more detailed. | ✓ |
| Static PNG/WebP | A pre-made mascot image file. Easier to design but adds a network request and needs dark/light variants. | |
| SVG illustration | Inline SVG — scalable, theme-aware via CSS variables, no network request. More work to create but best quality. | |

**User's choice:** CSS art (Recommended)
**Notes:** No external image dependency, theme-aware via CSS variables

### Navigation

| Option | Description | Selected |
|--------|-------------|----------|
| Home + back | "回到首页" button + browser back button. Simple, covers the common cases. | ✓ |
| Home + search + popular | Home button + search input + links to popular pages (articles, works). More helpful but heavier. | |
| Home only | Just a single "回到首页" button. Minimal and clean. | |

**User's choice:** Home + back (Recommended)
**Notes:** Simple navigation covering common cases

---

## JSON-LD Coverage

### Pages

| Option | Description | Selected |
|--------|-------------|----------|
| Articles only | Article + Person + BreadcrumbList on article pages. This is what ROADMAP requires and what Google Rich Results Test validates. | ✓ |
| Articles + works | Also add structured data to projects and creations pages. More SEO coverage but not required for v1. | |
| All pages | Every page gets appropriate schema (WebPage, CollectionPage, etc.). Maximum SEO but significant work. | |

**User's choice:** Articles only (Recommended)
**Notes:** Focus on ROADMAP requirements, other pages can be added in v2

### Person Schema

| Option | Description | Selected |
|--------|-------------|----------|
| Basic profile | Name, avatar URL, sameAs (GitHub, Twitter if available). Minimal but valid per schema.org. | ✓ |
| Full profile | Name, avatar, jobTitle, description, sameAs, knowsAbout. More complete but requires more data. | |
| Site-level only | Person schema on the site level (not per-article). Simpler but less granular for Rich Results. | |

**User's choice:** Basic profile (Recommended)
**Notes:** Minimal but valid per schema.org

### BreadcrumbList

| Option | Description | Selected |
|--------|-------------|----------|
| Home > Articles > Title | 3-level breadcrumb matching the URL structure. Standard, valid per schema.org. | ✓ |
| Home > Tag > Title | Breadcrumb shows the article's primary tag instead of "Articles". More informative but requires tag data. | |
| Flat (no breadcrumb) | Only Article + Person schemas, skip BreadcrumbList. Simpler but less SEO coverage. | |

**User's choice:** Home > Articles > Title (Recommended)
**Notes:** Standard 3-level breadcrumb matching URL structure

### Implementation

| Option | Description | Selected |
|--------|-------------|----------|
| Reusable Astro component | A `<JsonLd>` component that accepts schema objects as props. Clean, reusable, follows existing patterns. | ✓ |
| Inline in article layout | JSON-LD script tag directly in the article layout. Simpler but less reusable. | |
| Astro integration | A custom Astro integration that injects JSON-LD at build time. Most powerful but overkill for v1. | |

**User's choice:** Reusable Astro component (Recommended)
**Notes:** Clean, reusable component following existing patterns

### Validation

| Option | Description | Selected |
|--------|-------------|----------|
| Build-time + manual test | Unit test that JSON-LD output matches expected schema + manual validation in Google Rich Results Test after deploy. Practical for v1. | ✓ |
| Automated Rich Results Test | Script that calls Google's Rich Results Test API in CI. More thorough but adds external dependency. | |
| Schema.org validator only | Use schema.org validator in tests. Simpler but doesn't guarantee Google Rich Results eligibility. | |

**User's choice:** Build-time + manual test (Recommended)
**Notes:** Practical for v1, manual validation after deploy

### Article Fields

| Option | Description | Selected |
|--------|-------------|----------|
| Standard fields | headline, description, author, datePublished, dateModified, image, url. These are the minimum for Rich Results. | ✓ |
| Extended fields | Standard + wordCount, keywords, articleSection, isPartOf. More complete but some fields don't affect Rich Results. | |
| Minimal | Only headline, datePublished, author. Bare minimum for valid schema. Less SEO value. | |

**User's choice:** Standard fields (Recommended)
**Notes:** Minimum for Rich Results eligibility

---

## Test Strategy

### Coverage Approach

| Option | Description | Selected |
|--------|-------------|----------|
| Critical paths first | Focus on the 6 critical paths from ROADMAP (comment posting, theme persistence, search index, Live2D fallback, BGM unmute, reduced-motion gate). Pragmatic, high-value. | ✓ |
| Breadth-first | Test all utilities and components evenly. More uniform coverage but may miss critical flows. | |
| Risk-based | Test what's most likely to break (atmosphere features, third-party integrations). Targeted but requires risk assessment. | |

**User's choice:** Critical paths first (Recommended)
**Notes:** Focus on ROADMAP's 6 critical paths for maximum value

### Test Balance

| Option | Description | Selected |
|--------|-------------|----------|
| 70% unit, 30% E2E | Most tests are Vitest unit tests for utilities and component logic. Playwright E2E for the 6 critical user flows. Standard pyramid. | ✓ |
| 50/50 | Equal unit and E2E coverage. More thorough E2E but slower CI. | |
| Unit only | Only Vitest tests, no Playwright. Faster but misses integration issues. | |

**User's choice:** 70% unit, 30% E2E (Recommended)
**Notes:** Standard test pyramid, pragmatic balance

### E2E Paths

| Option | Description | Selected |
|--------|-------------|----------|
| ROADMAP's 6 paths | Comment posting, theme persistence, search index, Live2D fallback, BGM unmute, reduced-motion gate. These are explicitly required. | ✓ |
| ROADMAP + navigation | Also test main navigation flows (home → articles → article → back). More comprehensive. | |
| ROADMAP + atmosphere | Also test all atmosphere features (petals, right-click, Konami code). Maximum coverage but more work. | |

**User's choice:** ROADMAP's 6 paths (Recommended)
**Notes:** Focus on explicitly required critical paths

### CI Integration

| Option | Description | Selected |
|--------|-------------|----------|
| GitHub Actions | Run Vitest + Playwright in GitHub Actions on push/PR. Standard, free for public repos. Fail CI if coverage drops below 80%. | ✓ |
| Cloudflare Pages build | Run tests as part of Cloudflare Pages build process. Simpler but slower deploys. | |
| Local only | Tests run locally only, no CI gate. Faster deploys but no safety net. | |

**User's choice:** GitHub Actions (Recommended)
**Notes:** Standard CI with coverage gate

---

## Build Hardening

### Optimizations

| Option | Description | Selected |
|--------|-------------|----------|
| ROADMAP requirements | NODE_OPTIONS=--max-old-space-size=4096 + Sharp output cache. These are explicitly required by ROADMAP. | ✓ |
| ROADMAP + caching | Also add build cache for node_modules and .astro cache. Faster rebuilds but more complex. | |
| ROADMAP + parallel | Also optimize for parallel builds. Not needed for solo dev but future-proofs for growth. | |

**User's choice:** ROADMAP requirements (Recommended)
**Notes:** Focus on explicitly required optimizations

### Sharp Caching

| Option | Description | Selected |
|--------|-------------|----------|
| Cloudflare env var | Set NODE_OPTIONS and cache dir via Cloudflare Pages environment variables. Simple, no code changes. | ✓ |
| wrangler.toml config | Configure in wrangler.toml for local dev parity. More explicit but adds config file. | |
| Build script | Custom build script that handles caching. Most flexible but more maintenance. | |

**User's choice:** Cloudflare env var (Recommended)
**Notes:** Simple, no code changes needed

### Build Time Budget

| Option | Description | Selected |
|--------|-------------|----------|
| <2 minutes | Reasonable for a personal blog with ~50 pages. Leaves margin within Cloudflare's 20-min timeout. | ✓ |
| <5 minutes | More relaxed budget. Acceptable but wastes free tier builds. | |
| No hard limit | Just ensure it completes. Risky if build time creeps up. | |

**User's choice:** <2 minutes (Recommended)
**Notes:** Reasonable budget with margin for growth

### NODE_OPTIONS Location

| Option | Description | Selected |
|--------|-------------|----------|
| Cloudflare Pages env | Set NODE_OPTIONS=--max-old-space-size=4096 in Cloudflare Pages project settings. No code changes needed. | ✓ |
| .env file | Add to .env file in repo. Works locally but needs Cloudflare env for production. | |
| Build command | Prefix build command with NODE_OPTIONS. Simple but less clean. | |

**User's choice:** Cloudflare Pages env (Recommended)
**Notes:** No code changes, configured in Cloudflare dashboard

---

## Claude's Discretion

- Specific CSS art design for the 404 mascot
- Random message pool content and count
- JSON-LD component API design
- GitHub Action workflow YAML structure
- Playwright test setup and browser configuration
- Vitest configuration and coverage reporting
- Specific unit test cases for utilities and components

## Deferred Ideas

- None — discussion stayed within Phase 6 scope
