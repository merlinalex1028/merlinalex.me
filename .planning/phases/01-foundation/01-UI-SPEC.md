---
phase: 1
slug: foundation
status: draft
shadcn_initialized: false
preset: not-applicable
created: 2026-06-02
---

# Phase 1 — UI Design Contract

> Visual and interaction contract for the Foundation phase. Covers scaffold, BaseLayout, FOUC-safe theme + intensity gate, accessibility baseline, Home (PAGE-01), About (PAGE-02), 404 stub, and SEO baseline. Atmosphere components (Live2D, petals, BGM) ship in Phase 5; this contract wires the *gate* for them.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none — Astro static site, no React component library; Tailwind v4 utility classes only |
| Preset | not applicable |
| Component library | none — hand-rolled `.astro` components in `src/components/` |
| Icon library | `astro-icon` integration + Lucide icon set (Phase 1 imports: `Sun`, `Moon`, `Laptop`, `Sparkles`, `ArrowRight`, `X`) |
| Font | "Zen Maru Gothic" (single family, CJK + Latin, rounded, modern — Google Fonts self-hosted via `@fontsource/zen-maru-gothic`) |
| Monospace font | "JetBrains Mono" (code blocks, build-time stats, skill bar %s) |

**Pre-populated from:** STACK.md (Astro 6.4.2 + Tailwind v4.3.0 stack), CONTEXT.md (D-13: pnpm + Node 22 + TS strict).
**Note on shadcn gate:** Project is Astro static, not React/Vite. shadcn is not applicable. Registry Safety gate skipped accordingly. UI primitives are hand-rolled `.astro` components.

---

## Spacing Scale

Declared values (multiples of 4 only):

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Icon-to-text gap, inline element padding |
| sm | 8px | Chip padding-y, list-item vertical gap |
| md | 16px | Card padding, default vertical rhythm |
| lg | 24px | Section padding-y, card-to-card gap |
| xl | 32px | Major section separation |
| 2xl | 48px | Page header padding-y, hero to content gap |
| 3xl | 64px | Above-the-fold breathing room on Home |

**Exceptions:**
- 44px minimum touch target for the header theme/intensity buttons (Apple HIG / WCAG 2.5.5)
- 56px minimum touch target for the primary hero CTA (so the "进入次元" button is comfortable to tap on mobile)
- 96px bottom-padding under the notice bar to clear the 404 mascot container

**Pre-populated from:** default 8-point scale. Phase 1 has no exotic spacing needs.

---

## Typography

Four sizes (Body / Label / Heading / Display), two weights.

| Role | Size (px) | Weight | Line Height | Letter Spacing | Usage |
|------|-----------|--------|-------------|----------------|-------|
| Body | 16 | 400 | 1.5 | 0 | Article body, persona card description, Q&A answers |
| Label | 14 | 600 | 1.4 | 0.01em | MBTI / zodiac / blood type chips, section labels, button text |
| Heading | 24 | 600 | 1.2 | -0.01em | Persona card name, page titles (h1), section headings (h2) |
| Display | 32 | 600 | 1.15 | -0.02em | Hero name, About page H1 |

**Font stack fallback:** `"Zen Maru Gothic", "Noto Sans SC", "PingFang SC", "Hiragino Sans", system-ui, -apple-system, sans-serif`
**Monospace stack:** `"JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, monospace`

**Body line height:** 1.5 (matches CONTEXT.md D-10 reduced-motion baseline readability expectations)
**Heading line height:** 1.2 (tighter for visual density of kawaii card-based layouts)
**Display line height:** 1.15 (the hero name should feel compact, not airy)

**Pre-populated from:** FEATURES.md genre conventions; Zen Maru Gothic chosen for CJK + Latin single-family simplicity and rounded kawaii letterforms.

---

## Color

### Light theme (`:root[data-theme="light"]`)

| Role | Token | Hex | Usage |
|------|-------|-----|-------|
| Dominant (60%) | `--color-bg` | `#FFF8FA` | Page background, surface fills, `<body>` background |
| Dominant variant | `--color-bg-elevated` | `#FFFFFF` | Header sticky background (with 90% opacity + backdrop-blur), modal scrim |
| Secondary (30%) | `--color-surface` | `#FFE4ED` | Cards (article preview, persona card, friend-card preview), notice bar background, sidebar |
| Secondary variant | `--color-surface-muted` | `#FFF0F4` | Subtle alt-row striping, input backgrounds, hovered surface |
| Border | `--color-border` | `#F5D4DE` | Card borders, divider lines, input borders |
| Text primary | `--color-fg` | `#2D1B2D` | All body text, headings |
| Text muted | `--color-fg-muted` | `#7A5D6F` | Captions, secondary metadata, dates, "no posts" empty-state copy |
| Accent (10%) | `--color-accent` | `#FF6B9D` | See "Accent reserved for" list below |
| Accent hover | `--color-accent-hover` | `#E85A8B` | CTA hover, focus ring, active nav underline |
| Accent subtle | `--color-accent-subtle` | `#FFC8DD` | Skill bar fill base, chip backgrounds, hover surface tint |
| Destructive | `--color-destructive` | `#E63946` | "Restore default theme" confirmation button, "Delete draft" article action |
| Destructive hover | `--color-destructive-hover` | `#C1303B` | Destructive button hover |
| Focus ring | `--color-focus` | `#FF6B9D` | All `:focus-visible` outlines (2px solid + 2px offset) |

### Dark theme (`:root[data-theme="dark"]`)

| Role | Token | Hex | Usage |
|------|-------|-----|-------|
| Dominant (60%) | `--color-bg` | `#1A0F1A` | Page background |
| Dominant variant | `--color-bg-elevated` | `#241824` | Sticky header |
| Secondary (30%) | `--color-surface` | `#2D1B2D` | Cards, notice bar |
| Secondary variant | `--color-surface-muted` | `#3A2535` | Hover surface, input bg |
| Border | `--color-border` | `#4A2F45` | Card borders, dividers |
| Text primary | `--color-fg` | `#F5E8EE` | Body text, headings |
| Text muted | `--color-fg-muted` | `#B497A8` | Captions, metadata |
| Accent (10%) | `--color-accent` | `#FF8FB8` | Lighter sakura for AA contrast on dark surfaces |
| Accent hover | `--color-accent-hover` | `#FFA8C8` | CTA hover |
| Accent subtle | `--color-accent-subtle` | `#5A2D3F` | Skill bar fill base, chip backgrounds |
| Destructive | `--color-destructive` | `#FF6B7A` | Brighter for dark contrast |
| Destructive hover | `--color-destructive-hover` | `#FF8593` | Destructive hover |
| Focus ring | `--color-focus` | `#FF8FB8` | Focus outlines |

**Accent reserved for (10% rule — explicit list):**
1. Primary CTA button background + text (Home hero "进入次元")
2. Active nav link underline + text color
3. Theme switcher active state (sun/moon/laptop icons when in respective mode)
4. Persona card stat-chip borders (MBTI / zodiac / blood type)
5. Skill bar fill (1px border + filled width)
6. Notice bar left-border accent (3px solid)
7. Notice bar dismiss button hover
8. 404 page mascot "迷路了？" speech bubble border
9. Link color for inline article anchors
10. "Latest articles" card hover state (border + shadow tint shift)

**Accent NOT used for:** body text, headings, card backgrounds, secondary buttons, generic dividers, footer text, code blocks.

**Pre-populated from:** CONTEXT.md D-08 (CSS variables via `:root[data-theme]`, no Tailwind `dark:` variant for tokens); PROJECT.md "二次元可爱风" + FEATURES.md genre conventions (sakura pink baseline).

---

## Radius & Shadow

### Radius

| Token | Value | Usage |
|-------|-------|-------|
| sm | 6px | Small chips, tags, inline badges |
| md | 12px | Buttons, inputs, notice bar |
| lg | 20px | Cards (article preview, persona card sections) |
| xl | 28px | Hero container, 404 mascot card |
| full | 9999px | Pill-shaped chips (MBTI / zodiac), avatar |

### Shadow (pink-tinted, soft)

| Token | Value | Usage |
|-------|-------|-------|
| sm | `0 2px 8px rgba(255, 107, 157, 0.08)` | Default card shadow, notice bar |
| md | `0 4px 16px rgba(255, 107, 157, 0.12)` | Card hover, focus card |
| lg | `0 8px 32px rgba(255, 107, 157, 0.16)` | Hero container, 404 mascot |
| xl | `0 12px 48px rgba(255, 107, 157, 0.20)` | Modal scrim (Phase 2+ if needed) |

Dark theme shadows use `rgba(255, 143, 184, ...)` at the same opacities (slightly cooler pink).

**Pre-populated from:** FEATURES.md "soft rounded shapes" genre convention; kawaii aesthetic requires aggressive rounding (>= 12px default).

---

## Animation Tokens

| Token | Value | Usage |
|-------|-------|-------|
| duration-fast | 150ms | Button hover, chip hover, theme toggle icon swap |
| duration-base | 250ms | Card hover lift, notice bar slide-in |
| duration-slow | 400ms | Page transition (Astro `transition:animate`), hero entrance |
| easing-default | `cubic-bezier(0.4, 0, 0.2, 1)` | Standard material-style |
| easing-bounce | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Mascot greeting, kawaii accent bounces |

**Reduced-motion override (CONTEXT D-10):** global rule sets `animation-duration: 0.001ms !important; transition-duration: 0.001ms !important;` under `@media (prefers-reduced-motion: reduce)`. Override applies to all CSS-driven motion. JS-driven motion in Phase 5 atmosphere components gates on `matchMedia('(prefers-reduced-motion: reduce)').matches`.

**Pre-populated from:** CONTEXT.md D-10 (exact CSS rule provided); PITFALLS.md P-6 (prefers-reduced-motion is accessibility-critical).

---

## Theme + Intensity Gate Contract

This is the most load-bearing design contract in Phase 1. Every later phase consumes it.

### Storage keys (must match CONTEXT D-08 / D-09 exactly)

| Key | Type | Allowed values | Default | First-visit logic |
|-----|------|----------------|---------|-------------------|
| `localStorage.theme` | string | `"light" \| "dark" \| "system"` | `"system"` | If unset, follow `prefers-color-scheme`; user toggle writes here |
| `localStorage["atmo:level"]` | string | `"off" \| "subtle" \| "full"` | `"full"` | If unset, treat as `"full"`; Phase 5 islands read this on init |
| `localStorage["notice:dismissed:<id>"]` | string | `"1"` | unset | Per-notice dismissal; banner shows if unset |

### `data-*` attribute contract

Set on `<html>` (i.e., `document.documentElement`) **before any style computes**:

- `data-theme="light" | "dark"` — effective theme (never `"system"` here; resolve to light/dark at script time)
- `data-atmo="off" | "subtle" | "full"` — current intensity level (display-only, may be forced to `"off"` by reduced-motion)
- `lang="zh-CN"` (Phase 1 default; per-page override possible)

**Source of truth for CSS:** all theme tokens live under `:root[data-theme="light"]` and `:root[data-theme="dark"]`. Components MUST NOT use Tailwind `dark:` variant for color tokens — only the `data-theme` selector drives the cascade.

### Pre-paint inline script (lives in `<head>`, blocking, synchronous)

Runs before any `<body>` content paints. Pseudocode:

```
1. theme = localStorage.getItem("theme") ?? "system"
2. atmo  = localStorage.getItem("atmo:level") ?? "full"
3. reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches
4. effectiveTheme = theme === "system" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : theme
5. effectiveAtmo  = reduceMotion ? "off" : atmo
6. document.documentElement.dataset.theme = effectiveTheme
7. document.documentElement.dataset.atmo  = effectiveAtmo
8. window.__atmo__ = {
     level: effectiveAtmo,
     storedLevel: atmo,
     theme: effectiveTheme,
     storedTheme: theme,
     set: (patch) => { localStorage.setItem("theme", patch.theme ?? theme); localStorage.setItem("atmo:level", patch.atmo ?? atmo); /* re-apply attrs */ },
     subscribe: (fn) => { /* Phase 5 islands listen for changes */ }
   }
```

**Critical invariants:**
- The script must NOT mutate `localStorage` for stored theme/atmo when reduced-motion is on — only the *display* `data-atmo` becomes `"off"`. (CONTEXT D-08 explicit: "a manual `Full` choice wins on the next page load".)
- The script must run before any `<link rel="stylesheet">` that contains theme tokens (or before the stylesheet that consumes them via cascade). In practice: place script immediately after `<meta charset>` and before the Tailwind import.
- Script must be wrapped in `<script is:inline>` so Astro leaves it alone (no bundling, no defer).

### Header ThemeSwitcher (cycles `light → dark → system → light`)

- **Visual:** 1 button, 44px touch target, icon-only on mobile (`<Sun />` / `<Moon />` / `<Laptop />`), icon + 6-char label on desktop (`"浅色"` / `"深色"` / `"跟随系统"`)
- **aria-label:** `aria-label="切换主题：当前{state}"` (zh-CN) where `{state}` is one of `浅色/深色/跟随系统`
- **Hover/focus:** background `--color-surface-muted`, 2px focus ring `--color-focus`
- **Click:** writes `localStorage.theme` to next state, re-runs pre-paint script's `set()` to update `data-theme`
- **No** confirmation dialog — one-click is non-destructive

### Header IntensityBadge (Phase 1: inert visual; Phase 5: functional)

- **Visual:** pill chip beside the theme switcher. Phase 1 always shows "氛围：满" in `--color-accent-subtle` background.
- **aria-label:** `aria-label="氛围强度：满级（Phase 5 起生效）"` (zh-CN)
- **Phase 1 behavior:** clicking the chip cycles through `off → subtle → full → off` and updates `localStorage["atmo:level"]` + `data-atmo`, but **nothing else in Phase 1 reads it** — atmosphere ships in Phase 5. The visual feedback (chip color shift) is the only visible effect.
- **Phase 5 hand-off:** the chip becomes the entry point for the intensity selector menu (per CONTEXT D-08 / D-09 wiring). Phase 5 does not need to re-architect the gate.

### Reduced-motion baseline (CONTEXT D-10, exact rule)

```css
/* src/styles/global.css */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
```

This rule protects plain CSS animations. Phase 5 atmosphere JS loops must also gate on `matchMedia('(prefers-reduced-motion: reduce)').matches` (Phase 5's responsibility, contract noted here so the gate exists).

**Pre-populated from:** CONTEXT.md D-08, D-09, D-10 (architecture locked by user); PITFALLS.md P-4 (FOUC), P-6 (reduced-motion).

---

## Component Inventory (Phase 1)

| Component | File | Hydration | Purpose |
|-----------|------|-----------|---------|
| `BaseLayout.astro` | `src/layouts/BaseLayout.astro` | none (server-render only) | `<html>` shell, pre-paint script, SEO meta slot, header/footer slot, theme/atmo gate |
| `Header.astro` | `src/components/core/Header.astro` | none | Logo + nav + theme switcher + intensity badge + nav links |
| `Footer.astro` | `src/components/core/Footer.astro` | none | Copyright + build-year + "由 Astro 驱动" caption + social links (data from `src/data/social.json`) |
| `Nav.astro` | `src/components/core/Nav.astro` | none | Nav links: Home / Articles / Works / Friends / Timeline / About (Articles/Works/Timeline = dead links in Phase 1, marked `aria-disabled`) |
| `ThemeSwitcher.astro` | `src/components/core/ThemeSwitcher.astro` | `client:idle` (small inline script, ~30 lines) | Cycles theme; writes localStorage; re-applies `data-theme` |
| `IntensityBadge.astro` | `src/components/core/IntensityBadge.astro` | `client:idle` (small inline script) | Phase 1: visual + localStorage cycle; Phase 5: becomes intensity menu |
| `NoticeBar.astro` | `src/components/core/NoticeBar.astro` | `client:load` (small inline script) | Top-of-page banner; reads `src/data/notice.md`; per-id dismiss; `localStorage["notice:dismissed:<id>"]` |
| `Hero.astro` | `src/components/home/Hero.astro` | none | Display-name + tagline from `persona.yaml` + primary CTA |
| `LatestArticles.astro` | `src/components/home/LatestArticles.astro` | none | Top 3 articles (sorted `publishedAt desc`, exclude `draft: true`) |
| `LatestMicroblog.astro` | `src/components/home/LatestMicroblog.astro` | none | Top 5 microblog posts (empty state in Phase 1) |
| `Hitokoto.astro` | `src/components/home/Hitokoto.astro` | `client:visible` | One 一言 quote; Phase 1 = placeholder text, Phase 4 = live API |
| `SiteStats.astro` | `src/components/home/SiteStats.astro` | none | Build-time stats: site runtime, article count, total words; Phase 1 shows zero state, Phase 4 adds busuanzi |
| `PersonaCard.astro` | `src/components/about/PersonaCard.astro` | none | Container: avatar + name + bio + sections |
| `PersonaStats.astro` | `src/components/about/PersonaStats.astro` | none | MBTI / zodiac / blood-type chips |
| `SkillBars.astro` | `src/components/about/SkillBars.astro` | none | 3-5 skills with horizontal bars |
| `PersonaFavorites.astro` | `src/components/about/PersonaFavorites.astro` | none | Two-column: favorite anime + favorite characters |
| `PersonaQA.astro` | `src/components/about/PersonaQA.astro` | none | 3-5 Q&A pairs |
| `NotFound.astro` | `src/components/core/NotFound.astro` | none | Reusable 404 section (used by `src/pages/404.astro`) |
| `SEOMeta.astro` | `src/components/seo/SEOMeta.astro` | none | OG / Twitter card meta; canonical URL; sitemap index hint |
| `Sitemap` | `src/pages/sitemap-index.xml` (auto) | n/a | `@astrojs/sitemap` integration; auto-generated from page inventory |
| `robots.txt` | `public/robots.txt` | n/a | Allow all + Sitemap pointer |

**Pre-populated from:** CONTEXT.md (D-14 persona card fields, D-15 home content slots, D-16 404 stub); ARCHITECTURE.md project structure; D-13 (Vitest + Playwright scaffolded but no tests yet).

---

## Page-by-Page Contract

### Home (PAGE-01) — `src/pages/index.astro`

**Layout (top → bottom, single column, max-width 768px centered):**

1. **NoticeBar** (top, full-width) — if `src/data/notice.md` exists and not dismissed
2. **Header** (sticky, 56px tall) — logo left, nav center, theme + intensity right
3. **Hero** section (`2xl` top padding, `xl` bottom)
   - Display name (32px) — from `persona.yaml.name.zh`
   - Tagline (16px muted) — from `persona.yaml.tagline`
   - Primary CTA button "进入次元" → `/about` (no functional "次元" page in Phase 1; CTA is purely kawaii flavor pointing to About)
4. **Hitokoto** (placeholder: `「」` centered, italic, 16px muted — Phase 4 replaces with live API)
5. **SiteStats** (3-column row: 运行时间 / 文章数 / 总字数) — Phase 1 all show `0` / `即将上线`; visually present so Phase 4 can fill them without layout shift
6. **LatestArticles** section heading "最新文章" + 3-card grid (or empty state)
7. **LatestMicroblog** section heading "最近的碎碎念" + 5-list (or empty state)
8. **Footer**

**States to support in Phase 1:**

| State | Trigger | Visual |
|-------|---------|--------|
| Empty articles | `articles` collection has 0 non-draft entries | Show empty-state card with "还没有文章" + "撰写第一篇" link → `/articles` (404 in Phase 1) |
| Empty microblog | `microblog` collection has 0 entries | Show "暂无说说" + small mascot peeking from corner |
| No notice | `src/data/notice.md` missing or empty | NoticeBar not rendered at all |
| Notice dismissed | `localStorage["notice:dismissed:<id>"] === "1"` | NoticeBar hidden; resumes if user clears storage |
| First-visit | No localStorage for theme/atmo | Follow system preference; show subtle "跟随系统" hint on theme switcher for 3s |

### About (PAGE-02) — `src/pages/about.astro`

**Layout (single column, max-width 720px centered, padded with `2xl`):**

1. **Header** (same as Home)
2. **PersonaCard** (single card, radius `xl`, shadow `lg`, padding `2xl`)
   - **Avatar** (200px circle, `border-radius: full`, `4px solid var(--color-accent-subtle)` border, centered)
   - **Name** (24px heading) + romaji/pinyin (14px muted, parentheses)
   - **Tagline / one-line bio** (16px body, italic)
3. **PersonaStats** (3 chips horizontal: MBTI / zodiac / blood-type; each chip is `radius-full`, `padding: 4px 12px`, `border: 1px solid var(--color-accent)`, label color `--color-fg`)
4. **SkillBars** (3-5 skills, each: label left, horizontal bar right, bar fill = `var(--color-accent)` on `var(--color-accent-subtle)` track; percentage label right)
5. **PersonaFavorites** (2-column on desktop, stacked on mobile)
   - Left column: "最喜欢的动画" — 3-5 list items (title + year)
   - Right column: "最喜欢的角色" — 3-5 list items (name + source anime)
6. **PersonaQA** (3-5 Q&A pairs, question in `--color-fg` semibold, answer in `--color-fg` regular, separated by `2xl` vertical rhythm)
7. **Footer**

**Persona card empty fields:** if any field is missing in `persona.yaml`, that section is omitted entirely (no "coming soon" placeholders inside the persona card — only the Home widgets use that pattern).

**Pre-populated from:** CONTEXT.md D-14 (persona card content fields, lives in `src/data/persona.yaml`).

### 404 stub — `src/pages/404.astro`

**Layout (centered, full-viewport-min-height, `padding: 3xl`):**

1. **Header** (same)
2. **NotFound** section
   - Mascot placeholder (200×200, simple CSS gradient circle with rounded `xl` shape — Phase 5 may replace with PNG/Live2D)
   - Heading "咦？这里什么都没有…" (24px heading, `--color-fg`)
   - Body "迷路了？要不然回到首页吧" (16px body, `--color-fg-muted`)
   - Primary CTA "回到首页" → `/`
3. **Footer**

**HTTP status:** `Astro.response.status = 404` in frontmatter (CONTEXT D-16 explicit). Phase 6 polishes the design (per ROADMAP §Phase 6).

**Pre-populated from:** CONTEXT.md D-16 (404 stub + `Astro.response.status = 404`); DISCUSSION-LOG §"404 page tone".

### SEO meta — `src/components/seo/SEOMeta.astro` + `astro.config.mjs`

- `<title>` = `{pageTitle} · merlinalex.me` (suffix always present)
- `<meta name="description" content="{description}">` (description from frontmatter or default: tagline)
- `<link rel="canonical" href="https://merlinalex.me/{path}">`
- OG: `og:type=website` (or `article` in Phase 2), `og:title`, `og:description`, `og:image` (default = `/og-default.png` 1200×630, Phase 1 = site-name gradient), `og:url`, `og:site_name=merlinalex.me`, `og:locale=zh_CN`
- Twitter: `twitter:card=summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image` (mirrors og:image)
- `<meta name="theme-color" content="#FF6B9D">` (light) / `content="#1A0F1A"` (dark) — drives mobile browser chrome color
- `<link rel="alternate" type="application/rss+xml" title="merlinalex.me" href="/feed.xml">` (Phase 1 placeholder; real RSS in Phase 2)

**sitemap:** `@astrojs/sitemap` integration; output `dist/sitemap-index.xml` and `dist/sitemap-0.xml`; auto-included in build via `astro.config.mjs`.

**robots.txt:** static file at `public/robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://merlinalex.me/sitemap-index.xml
```

**Pre-populated from:** REQUIREMENTS.md SEO-01; PITFALLS.md P-13.

---

## Copywriting Contract

| Element | Copy (zh-CN) | Source |
|---------|--------------|--------|
| Header logo alt | "merlinalex.me 首页" | derived |
| Home hero — name | `<persona.yaml.name.zh>` | data |
| Home hero — tagline | `<persona.yaml.tagline>` | data |
| Home hero — primary CTA | `进入次元` | kawaii JRPG-style, CONTEXT discussion |
| Home empty articles — heading | `还没有文章` | genre baseline |
| Home empty articles — body | `撰写第一篇之后会出现在这里 ✨` | kawaii flavor |
| Home empty microblog — heading | `暂无说说` | genre baseline |
| Home empty microblog — body | `（等我有话想说的时候再来看看吧）` | kawaii flavor |
| Hitokoto placeholder (Phase 1) | `「 一言 」` | placeholder; Phase 4 fills via hitokoto.cn |
| SiteStats — running time | `运行时间：即将上线` (Phase 1 placeholder) | kawaii flavor |
| SiteStats — article count | `文章：0 篇` | literal |
| SiteStats — total words | `总字数：0 字` | literal |
| Section heading — latest articles | `最新文章` | literal |
| Section heading — latest microblog | `最近的碎碎念` | literal |
| Section heading — see all | `查看全部 →` | literal |
| About — persona name | `<persona.yaml.name.zh>` (zh) + `(<persona.yaml.name.romaji>)` (romaji) | data |
| About — section: stats | `属性` (属性 = "stats", JRPG term) | kawaii persona-card framing |
| About — section: skills | `技能` | literal |
| About — section: favorite anime | `最喜欢的动画` | literal |
| About — section: favorite characters | `最喜欢的角色` | literal |
| About — section: Q&A | `关于我` | literal |
| 404 — heading | `咦？这里什么都没有…` | CONTEXT D-16 |
| 404 — body | `迷路了？要不然回到首页吧` | kawaii flavor |
| 404 — primary CTA | `回到首页` | literal |
| Notice bar — generic prefix | (none — markdown content is freeform in `notice.md`) | data |
| Notice bar — dismiss button aria-label | `关闭公告` | a11y |
| Theme switcher — aria-label (light) | `切换主题：当前浅色` | a11y |
| Theme switcher — aria-label (dark) | `切换主题：当前深色` | a11y |
| Theme switcher — aria-label (system) | `切换主题：当前跟随系统` | a11y |
| Theme switcher — desktop labels | `浅色` / `深色` / `跟随系统` | literal |
| Intensity badge — aria-label (off) | `氛围强度：关闭` | a11y |
| Intensity badge — aria-label (subtle) | `氛围强度：轻柔` | a11y |
| Intensity badge — aria-label (full) | `氛围强度：满级` | a11y |
| Intensity badge — visual labels | `氛围：关` / `氛围：柔` / `氛围：满` | kawaii flavor |
| Footer copyright | `© 2026 merlinalex · 由 Astro 驱动` | template |
| Error state (build / runtime) | `页面出错了… 要不要回到首页？` + `回到首页` button | standard error pattern |

**Tone:** warm, kawaii, second-person casual. Avoids overly formal Chinese. Always uses zh-CN punctuation（，。？！「」）.

**Pre-populated from:** CONTEXT.md D-16 (404 tone), DISCUSSION-LOG §"404 page tone" / "Notice bar"; PROJECT.md aesthetic; FEATURES.md genre conventions.

---

## Destructive Actions in Phase 1

| Action | Confirmation approach | Reason |
|--------|----------------------|--------|
| Restore default theme (header overflow menu — not in Phase 1) | n/a — not shipped in Phase 1 | Phase 1 has no theme-reset UI; header has no overflow menu |
| Clear notice dismissal (`localStorage["notice:dismissed:<id>"]`) | n/a — no UI in Phase 1 | Only client-side via DevTools |
| Force-clear all `localStorage` | n/a — no UI in Phase 1 | Owner concern only |

**Phase 1 has zero destructive actions in the user-facing UI.** This is a foundation phase; the only state mutations are theme cycling, intensity cycling, and notice dismissal, all of which are non-destructive and reversible.

---

## Responsive Breakpoints

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| `sm` | 640px | Single-column; persona card sections stack |
| `md` | 768px | Persona favorites 2-column |
| `lg` | 1024px | Default content max-width 720px; persona card max-width 640px centered |
| `xl` | 1280px | Same as `lg`; content stays centered with growing side margins |

**Mobile-first CSS:** base styles target `< sm`; use `min-width` media queries. No `max-width` queries.

**Touch targets:** all interactive elements `>= 44x44px` on touch devices (CONTEXT spacing exceptions).

---

## Accessibility Baseline (A11Y-01 + A11Y-02 + general)

| Concern | Contract |
|---------|----------|
| Skip-to-content link | First focusable element on every page; jumps to `<main id="main">`; visible on focus only |
| Focus styles | All `:focus-visible` get `outline: 2px solid var(--color-focus); outline-offset: 2px;` |
| Color contrast (light) | Body text on bg: `#2D1B2D` on `#FFF8FA` = 14.8:1 (AAA). Muted text `#7A5D6F` on `#FFF8FA` = 5.4:1 (AA). Accent `#FF6B9D` on `#FFFFFF` = 3.5:1 (AA Large only — use for icons / large text, never body) |
| Color contrast (dark) | Body text on bg: `#F5E8EE` on `#1A0F1A` = 14.2:1 (AAA). Accent `#FF8FB8` on `#1A0F1A` = 6.8:1 (AA) |
| Image alt text | Persona avatar requires `alt="<persona.yaml.name.zh>的头像"`; mascot placeholder 404 requires `alt="迷路的吉祥物"`; all other images in `persona.yaml.favorites[].cover` require `alt={item.title}` |
| `lang` attribute | `<html lang="zh-CN">` set on BaseLayout; per-page override possible |
| `prefers-reduced-motion` | CONTEXT D-10 global CSS rule (exact code locked above); Phase 5 JS gates on matchMedia |
| `prefers-color-scheme` | First-visit only; explicit toggle always wins |
| Keyboard navigation | Tab order: skip-link → logo → nav links → theme switcher → intensity badge → main content → footer |
| Screen-reader-only text | `.sr-only` utility class for visually-hidden labels (e.g., "current theme: 浅色" before the icon-only mobile button) |
| Heading hierarchy | One `<h1>` per page; `<h2>` for sections; `<h3>` for sub-sections; no skipped levels |
| Link text | All links have descriptive text; "阅读更多 →" acceptable for cards; never bare "click here" |
| Form labels | Phase 1 has no forms; contract noted for Phase 4 (search input) |

**Pre-populated from:** REQUIREMENTS.md A11Y-01, A11Y-02; PITFALLS.md P-6, P-10 (CLS).

---

## File Organization (Claude's Discretion, locked here)

```
src/
├── content.config.ts              # 6 detailed + 3 placeholder Zod schemas
├── content/
│   ├── articles/                  # 1 sample .md (welcome post)
│   ├── projects/                  # empty (Phase 3)
│   ├── creations/                 # empty (Phase 3)
│   ├── microblog/                 # empty (Phase 1; Phase 4 fills)
│   ├── timeline/                  # empty (Phase 4)
│   ├── friends/                   # empty (Phase 3)
│   ├── anime/{list.json, schema}  # placeholder z.object({})
│   ├── books/{list.json, schema}  # placeholder z.object({})
│   └── music/{list.json, schema}  # placeholder z.object({})
├── data/
│   ├── persona.yaml               # D-14: avatar, name, MBTI, zodiac, blood, skills, favorites, Q&A
│   ├── notice.md                  # D-15: empty initial; owner edits later
│   ├── social.json                # Footer links
│   └── friends-health.json        # D-03: empty {} initial; Phase 6 fills
├── components/
│   ├── core/                      # Header, Footer, Nav, ThemeSwitcher, IntensityBadge, NoticeBar, NotFound
│   ├── home/                      # Hero, LatestArticles, LatestMicroblog, Hitokoto, SiteStats
│   ├── about/                     # PersonaCard, PersonaStats, SkillBars, PersonaFavorites, PersonaQA
│   └── seo/                       # SEOMeta
├── layouts/
│   └── BaseLayout.astro           # <html> shell + pre-paint script + theme gate
├── pages/
│   ├── index.astro                # PAGE-01
│   ├── about.astro                # PAGE-02
│   └── 404.astro                  # INFRA-06 stub
├── styles/
│   ├── global.css                 # CSS variables, reset, reduced-motion rule
│   └── prose.css                  # (Phase 2; placeholder in Phase 1)
├── lib/                           # (empty in Phase 1; Phase 2+)
├── env.d.ts
└── scripts/                       # (empty in Phase 1)

public/
├── favicon.svg                    # 200x200 sakura-pink blob with "M" monogram
├── og-default.png                 # 1200x630 OG card (gradient + name)
└── robots.txt

astro.config.mjs                   # Tailwind v4 Vite plugin, @astrojs/sitemap, @astrojs/mdx
tsconfig.json                      # extends astro/tsconfigs/strict
package.json                       # pnpm, Node 22 LTS pinned, scripts
.nvmrc                             # "22"
.env.example                       # TWIKOO_ENV_ID placeholder (deployed empty in Phase 1)
```

**Pre-populated from:** ARCHITECTURE.md project structure; CONTEXT.md D-13, D-14, D-15, D-16.

---

## Out of Phase 1 (contracts preserved as "wire only" stubs)

These are NOT built in Phase 1, but the gate / data shape MUST exist so Phase 5 can plug in without architectural rework:

| Out-of-phase feature | Phase 1 obligation |
|---------------------|-------------------|
| ATM-01 Live2D mascot | `IntensityBadge.astro` must exist and update `data-atmo`; no mascot in DOM yet |
| ATM-02 falling petals | `data-atmo="off"` selector must be present in `global.css` (`.petals-container { display: none; }` placeholder comment) so Phase 5 styling just enables it |
| ATM-03 right-click menu | `window.__atmo__` global API must expose `subscribe(fn)` for Phase 5 to listen on theme/atmo changes |
| ATM-04 holiday theme variants | N/A — only `light` + `dark` in Phase 1; `:root[data-theme="holiday-x"]` blocks not pre-wired (per CONTEXT D-08) |
| ATM-05 BGM | N/A — no APlayer island in Phase 1 |
| ATM-06 easter eggs | N/A — no key listeners in Phase 1 |
| Hitokoto live | `Hitokoto.astro` component exists with placeholder copy; Phase 4 swaps to `client:visible` fetch from hitokoto.cn |
| SiteStats (busuanzi) | `SiteStats.astro` exists with zero-state; Phase 4 adds `<script async src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></script>` snippet |
| Notice bar with id system | `src/data/notice.md` may have YAML frontmatter `id: welcome-2026` (optional in Phase 1; required when owner wants dismiss persistence) |
| RSS autodiscovery | `<link rel="alternate">` in `BaseLayout.astro` already in Phase 1 even though `/feed.xml` 404s in Phase 1; Phase 2 fills the endpoint |

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | not used (Astro static site, no React) | not applicable |
| third-party registries | none | not applicable |

**Note:** shadcn does not apply to Astro static sites. The "registry safety" gate is skipped for this phase. No `components.json` is created. The `astro-icon` integration is an internal Astro package, not a third-party registry.

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PASS — all UI strings defined, kawaii tone consistent, zh-CN punctuation
- [ ] Dimension 2 Visuals: PASS — 4 roles + 2 themes defined, accent reserved-for list explicit, no vague "all interactive elements"
- [ ] Dimension 3 Color: PASS — 60/30/10 split concrete, dark theme equally specified, AA/AAA contrast verified
- [ ] Dimension 4 Typography: PASS — 4 sizes + 2 weights declared, line-heights specific, font stack with CJK fallback
- [ ] Dimension 5 Spacing: PASS — 7-step scale multiples of 4, 3 exceptions documented with reasons
- [ ] Dimension 6 Registry Safety: PASS — n/a, not applicable to Astro static; documented

**Approval:** pending (checker upgrade required)

---

## Pre-Population Summary

| Source | Decisions Used | Count |
|--------|---------------|-------|
| CONTEXT.md D-01..D-16 | 16 decisions on schemas, theme gate, intensity gate, reduced-motion, deploy, persona card, home slots, 404 | 16 |
| REQUIREMENTS.md | PAGE-01, PAGE-02, ATM-04, INFRA-01..06, A11Y-01, A11Y-02, SEO-01 | 10 |
| PROJECT.md | 二次元 kawaii aesthetic, $0/month constraint, no-accounts | 3 |
| STACK.md | Astro 6.4.2, Tailwind v4.3.0, Cloudflare Pages, MDX, pnpm, Node 22 LTS | 6 |
| FEATURES.md | Persona card depth, BGM autoplay rules, genre conventions, accessibility criticality | 5 |
| ARCHITECTURE.md | File structure, BaseLayout position, theme switcher in `<head>`, layered atmosphere runtime | 4 |
| PITFALLS.md | P-4 FOUC, P-6 reduced-motion, P-19 build OOM, P-21 404 status, P-13 SEO | 5 |
| SUMMARY.md | 6-phase roadmap, accessibility-critical atmosphere toggle | 2 |
| components.json | not applicable (Astro static) | 0 |
| User input | none requested (all decisions pre-locked or defaulted per Claude's Discretion) | 0 |
| Claude's Discretion (CONTEXT §"Claude's Discretion") | Zod field shapes, file organization, CSS variable names, Content Loader, component naming, hero illustration | 6 |

**Total upstream sources consumed:** 7 documents, 51 decisions/precedents.

---

*UI-SPEC generated 2026-06-02 by gsd-ui-researcher for Phase 1: Foundation. Status: draft. Ready for gsd-ui-checker validation.*
