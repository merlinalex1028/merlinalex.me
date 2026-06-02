# PITFALLS: merlinalex.me (二次元 Personal Site)

**Domain:** Anime/kawaii personal blog + portfolio (Live2D, particles, BGM, custom right-click)
**Researched:** 2026-06-02
**Overall confidence:** MEDIUM (HIGH for Live2D, autoplay, prefers-reduced-motion, Twikoo; MEDIUM-LOW for ecosystem norms)

---

## Critical Pitfalls

### P-1. Live2D model becomes a mobile performance black hole

**What goes wrong:** Live2D widget loads a 1-3 MB Cubism Core bundle plus a 5-20 MB model. On a low-end Android phone frame rate can drop to <20 FPS, eat 200-400 MB RAM, and block the main thread during initial JSON parse.

**Prevention:**
- Set `display.width`/`display.height` to actual pixel dimensions; `superSample: 1`.
- Defer the widget load to `requestIdleCallback`; only on devices with `navigator.deviceMemory >= 4` and `(navigator.hardwareConcurrency || 2) >= 4`. On low-end devices, swap to a static PNG mascot (no CLS).
- Convert `.moc3` textures to WebP/AVIF; serve via CDN with long cache.
- Gate with `IntersectionObserver` if mascot is off-screen.
- Pre-compress models with Cubism Editor's "Texture Compression" export.

**Detection:** Lighthouse mobile Performance < 60; "WebGL: CONTEXT_LOST" in console.

**Phase:** ATM-01 (Live2D mascot) — must ship a static fallback path on day one.

---

### P-2. BGM autoplay blocked silently by every modern browser

**What goes wrong:** Audio's `autoplay` attribute is silently ignored; `play()` returns a rejected Promise; UI shows "playing" with no sound.

**Prevention:**
- Treat BGM as opt-in; require first click to actually play.
- Use "muted autoplay + unmute button" pattern. Muted autoplay is allowed everywhere.
- APlayer + MetingJS override: `autoplay: false, mutex: true`; only enable after first scroll/click.
- Persist user preference in `localStorage`.
- For iOS: use `AudioContext.resume()` inside `'click'` / `'touchend'` (not `'touchstart'`).

**Detection:** Open in fresh Safari private window — should work after one click.

**Phase:** ATM-05 (BGM player).

---

### P-3. Falling petals / snow / cursor-trail effects tank mobile battery

**What goes wrong:** Particle libraries run RAF loops creating 30-100 DOM elements per second. Mobile compositor can drop to 15 FPS; battery drain jumps 8-15%.

**Prevention:**
- Cap particle count to 20 on mobile or skip entirely (use a repeating background image with CSS animation).
- Canvas particles: throttle to 30 FPS; pause when `document.hidden`.
- Tie particle count to `prefers-reduced-motion` — return zero when set to `reduce`.
- Provide a global "atmosphere intensity" toggle in the right-click menu.
- Use `contain: layout paint` and `content-visibility: auto`.

**Detection:** Chrome DevTools Performance panel — flame chart should show <4ms per frame.

**Phase:** ATM-02 — ship the toggle and mobile cap on day one.

---

### P-4. Theme switching causes FOUC on first paint

**What goes wrong:** Site renders light for ~100-300 ms, then flashes to dark/holiday theme. Visible "blink" on slow connections.

**Prevention:**
- Inline a tiny pre-paint script in `<head>` (not external, not deferred) that reads theme from `localStorage` and sets `document.documentElement.dataset.theme` synchronously.
- Use CSS with theme selectors on `:root[data-theme="..."]`.
- For holiday/seasonal themes, compute date at build time.
- Test in Chrome with "Slow 3G" throttling — no visible flash.

**Phase:** ATM-04 (theme switcher) — must ship the pre-paint script with the first theme.

---

### P-5. Live2D model license and CDN duplication

**What goes wrong:** Popular public models are licensed "study only"; also identical models are pulled from a public CDN used by thousands of sites, so the "uniquely mine" feel is lost.

**Prevention:**
- Commission or create a custom model (Cubism Editor free tier exports models).
- If using a stock model, self-host textures and `moc3` JSON in `/public/live2d/`.
- Add a model credits + license page in About.
- For dress-up — keep model count to 2-3; textures.cache bloat kills performance.

**Phase:** ATM-01 — decision about custom vs stock must happen in this phase.

---

## Moderate Pitfalls

### P-6. `prefers-reduced-motion` ignored — accessibility violation

**What goes wrong:** Every animation runs at full intensity for users who've turned motion down. ~3-7% of users have this on; vestibular disorders and migraine sufferers are a real subset.

**Prevention:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
```
- Live2D: motion amplitude 0; show static mascot.
- Canvas particles: gate RAF loop on `reducedMotion` boolean.
- Replace `transform: scale()` with `opacity` transitions.
- Listen for changes: `matchMedia(...).addEventListener('change', ...)`.

**Phase:** Any phase that introduces animation.

---

### P-7. Custom right-click menu breaks expected UX and accessibility tools

**What goes wrong:** `contextmenu` handler hijacks right-click; power users lose "Inspect Element", "View Source", "Save Image As"; browser extensions can't inject items.

**Prevention:**
- Don't `preventDefault()` on the global `contextmenu` event. Listen only on specific elements (e.g., the mascot).
- Better: provide custom actions as a hover toolbar or button, not by replacing the universal right-click.
- If must have a custom menu on page background, only on `Shift+right-click`.
- Respect `event.target` — never hijack on `<img>`, `<a>`, or input elements.

**Phase:** ATM-03 (custom right-click).

---

### P-8. Twikoo deployment quirks on free Vercel/Cloudflare

**What goes wrong:** Vercel serverless 10s timeout on cold start; CORS errors; image upload needs a third-party host; Vercel Authentication being on blocks email notifications.

**Prevention:**
- Use Vercel MongoDB Storage (free tier) or Tencent Cloud free tier.
- Disable Vercel Authentication in Deployment Protection.
- Configure a third-party image host (lsky-pro, EasyImage2.0, or a GitHub repo) before the first user comment.
- Add Twikoo's "blocked by client" adblock guidance to your README.
- Set `CORS_ALLOW_ORIGIN` correctly in admin panel.

**Phase:** INFRA-03 (Twikoo comments).

---

### P-9. Bangumi API staleness and rate limits

**What goes wrong:** Build-time data is frozen; large libraries can hit 429s; outdated "watching" lists undermine "alive" feel.

**Prevention:**
- Cache Bangumi data in build-time JSON; refresh only when content changes or weekly via cron.
- Use `access_token` flow if usage is heavy.
- For per-episode progress, maintain a small manual override file.
- For "currently watching" badge, compute from `lastUpdated`; warn when >14 days.
- Mark Bangumi integration as "best-effort"; if API is down, the site must still build.

**Phase:** INFRA-04 (Bangumi integration).

---

### P-10. CLS from late-loading decorative elements (mascot, particles, web fonts)

**What goes wrong:** Web Vitals CLS >0.1 because Live2D canvas appears 200-300px tall mid-page, or CJK web fonts swap and reflow paragraphs.

**Prevention:**
- Reserve fixed `width`/`height` for the mascot slot; use `place-self: end`.
- For CJK web fonts: use `size-adjust` `@font-face` descriptors; subset to only used characters; use `font-display: optional` to never swap.
- For particles: `min-height: 100vh` on the container.
- For images in articles: always set `width`/`height` attributes.

**Phase:** All visual-feature phases.

---

### P-11. PJAX / view-transitions + Live2D widget reloads or breaks

**What goes wrong:** With PJAX or Astro view transitions, the Live2D widget re-downloads 5-20 MB of model assets on every navigation or loses its canvas reference.

**Prevention:**
- Place the Live2D script outside the PJAX container.
- For Astro view transitions, use `transition:persist` on the mascot DOM element.
- Use `client:idle` directive on the mascot island so it only initializes once.
- Disable PJAX for initial release; only re-enable after mascot persists correctly.

**Phase:** INFRA-01 + ATM-01.

---

### P-12. RSS feed reader compatibility

**What goes wrong:** Feed validates locally but Feedly/Inoreader reject some entries; HTML inside `<description>` not CDATA-wrapped; full-content feeds hit rate limits.

**Prevention:**
- Use `@astrojs/rss` with proper sanitization.
- Ship both summary and full-content feeds; let readers choose.
- Escape `&`, `<`, `>` in titles. Wrap HTML in `<![CDATA[...]]>`.
- Code blocks: use `<pre><code>` with language classes.
- Validate at `validator.w3.org/feed/` before launch.
- Add autodiscovery `<link rel="alternate">` in `<head>`.

**Phase:** DISC-01 (RSS).

---

### P-13. SEO for 二次元 content — discoverability and indexing

**What goes wrong:** CJK mixed content ranks poorly; tags overlap with thousands of dev blogs; image alt text missing.

**Prevention:**
- Generate sitemap at build time; submit to Google + Bing.
- For each article: explicit `title`, `description`, `og:image`, `twitter:card` in frontmatter.
- Use `lang="zh-CN"` / `ja-JP` for CJK; `lang="en"` for English.
- Add alt text to all images.
- Implement `Article`, `Person`, `BreadcrumbList` schema.
- Internal linking: "Related" component in article footer.
- Critical content not inside iframes (Twikoo/APlayer).

**Phase:** All content phases.

---

### P-14. Search index build time on SSG (Pagefind)

**What goes wrong:** Full-text search adds 30-60s to build time and 2-5 MB of index files. Microblog dilutes the index.

**Prevention:**
- Use Pagefind (modern, ~100-300kB for thousands of pages, supports CJK).
- Configure Pagefind to skip microblog pages (`data-pagefind-filter="exclude"`).
- Index only specific sections (articles, works), not full site.
- Run search build only on production deploys, not PR previews.

**Phase:** DISC-02 (search).

---

## Minor Pitfalls

### P-15. Microblog becomes an abandoned graveyard
**Prevention:** Cap home microblog to 5 latest; auto-archive entries >180 days old; "Posted X days ago" timestamps.

### P-16. Friend Links go stale
**Prevention:** Build-time HEAD-check each friend link (5s timeout); mark dead in UI; run monthly via scheduled workflow.

### P-17. Konami code intercepts other shortcuts
**Prevention:** Only listen for full sequence; ignore key events whose `target` is input/textarea/contenteditable.

### P-18. CJK web font load time
**Prevention:** Subset fonts with `glyphhanger`/`pyftsubset`; `font-display: swap` with metric-matched fallback; preconnect to font CDN.

### P-19. Build pipeline OOM on big image sets
**Prevention:** `NODE_OPTIONS=--max-old-space-size=4096`; cache Sharp outputs; pre-process images locally.

### P-20. Third-party widget bloat hits LCP
**Prevention:** Defer non-critical widgets (comments only on article pages, search only on search page, Live2D on idle); preconnect to critical origins only.

### P-21. Custom domain + 404 page combinations
**Prevention:** Serve 404 with HTTP 404 status (Astro: `Astro.response.status = 404`); single canonical domain; redirect the other with 301.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| INFRA-01 (Astro setup) | Build OOM (P-19) | Set `NODE_OPTIONS`; cache Sharp outputs |
| PAGE-01 (Home) | Widget bloat (P-20) | Defer all non-critical widgets |
| ATM-01 (Live2D) | Performance (P-1); license (P-5); PJAX (P-11) | Static fallback, custom model, place outside PJAX |
| ATM-02 (Particles) | Mobile battery (P-3) | Cap to 20 on mobile, reduced-motion gate |
| ATM-03 (Custom right-click) | UX breakage (P-7) | Don't hijack global contextmenu |
| ATM-04 (Theme switcher) | FOUC (P-4) | Pre-paint inline script |
| ATM-05 (BGM) | Autoplay block (P-2) | Muted autoplay + unmute button; persist preference |
| ATM-06 (Easter eggs) | Keyboard capture (P-17) | Ignore key events in inputs |
| DISC-01 (RSS) | Feed reader compat (P-12) | Validate in W3C feed validator |
| DISC-02 (Search) | Build time (P-14) | Pagefind, exclude microblog |
| INFRA-03 (Twikoo) | Vercel quirks (P-8) | MongoDB storage, third-party image host |
| INFRA-04 (Bangumi) | Stale data (P-9) | Build cache + manual override |
| INFRA-06 (Domain + 404) | 404 status code (P-21) | Explicit 404 in Astro |

---

## Sources

| Source | URL | Confidence |
|--------|-----|------------|
| Live2D widget README — PJAX, license, model loading | github.com/stevenjoezhang/live2d-widget | HIGH |
| Chrome Autoplay Policy | developer.chrome.com/blog/autoplay/ | HIGH |
| MDN prefers-reduced-motion | developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion | HIGH |
| web.dev CLS | web.dev/articles/cls | HIGH |
| Twikoo FAQ | twikoo.js.org/faq.html | HIGH |
| MetingJS README | github.com/metowolf/MetingJS | HIGH |
| Astro content collections | docs.astro.build/en/guides/content-collections/ | HIGH |
| Pagefind | pagefind.app | MEDIUM |
| 二次元 blog community norms | n/a (training-data synthesis) | LOW |

---

*Researched: 2026-06-02*
