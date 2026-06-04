# Phase 5: Atmosphere - Research

**Researched:** 2026-06-04
**Domain:** Interactive 二次元 atmosphere (Live2D, particles, BGM, custom context menu, easter eggs)
**Confidence:** HIGH

## Summary

Phase 5 delivers the immersive 二次元 atmosphere layer: Live2D mascot, falling cherry blossom petals, BGM player, custom right-click menu, and Konami code easter egg. The Phase 1 infrastructure already provides the gating hooks (`window.__atmo__` API with `subscribe()`, `data-atmo` attribute on `<html>`, `prefers-reduced-motion` CSS rule). Each atmosphere component must subscribe to `window.__atmo__` and check `data-atmo` / `prefers-reduced-motion` before rendering or running animation loops.

The critical architectural constraint: all atmosphere effects are **islands** — they load independently via `client:idle` and never block first paint. The intensity toggle in the header already cycles through off/subtle/full and writes to `localStorage`; atmosphere components only need to listen.

**Primary recommendation:** Use l2d-widget for Live2D, @tsparticles/astro for petals, APlayer+MetingJS via CDN for BGM, and vanilla JS for right-click menu + Konami code. All islands gated behind `window.__atmo__` subscription.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Live2D mascot rendering | Browser (WebGL canvas) | — | Cubism SDK runs entirely client-side; model files served from CDN/public |
| Falling petals animation | Browser (Canvas/WebGL) | — | tsParticles runs client-side RAF loop |
| BGM playback | Browser (Web Audio API) | — | APlayer + MetingJS run client-side |
| Custom right-click menu | Browser (DOM) | — | Pure DOM overlay, no server involvement |
| Easter egg detection | Browser (KeyboardEvent) | — | Global keydown listener on document |
| Intensity gating | Browser (localStorage + DOM) | — | Phase 1 `window.__atmo__` already provides this |
| Model/asset files | CDN / Static | — | Served from `public/models/` or external CDN |

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| l2d-widget | ^0.1.0 | Live2D mascot widget | Single-call `createWidget()`, Cubism 2+6 auto-detect, model switcher, greeting/typing built-in, ~500 LOC, zero deps |
| @tsparticles/astro | ^4.1.3 | Falling petals (Astro wrapper) | Official Astro integration, `<Particles>` component, `initParticlesEngine` pattern |
| @tsparticles/slim | ^4.1.3 | Particle engine (tree-shakeable) | Slim bundle with essential features, avoids full engine bloat |
| aplayer | ^1.10.1 | BGM player UI | De facto standard in CN anime-blog ecosystem, kawaii aesthetic, playlist support |
| meting | ^2.0.2 | Music API bridge for APlayer | `<meting-js>` custom element, NetEase/QQ music integration |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @tsparticles/shape-image | ^4.1.3 | Custom petal image shape | Required for sakura petal PNG rendering (snow preset uses built-in shapes) |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| l2d-widget | pixi-live2d-display | Lower-level PixiJS plugin, last release Dec 2023, PixiJS v6 only — maintenance risk |
| @tsparticles/astro | Manual canvas particles | More control but reinvents RAF loop, resize handling, theme integration |
| aplayer+meting | Custom Web Audio player | Weeks of work to match APlayer's polish; no CN ecosystem benefit |

**Installation:**
```bash
pnpm add l2d-widget @tsparticles/astro @tsparticles/slim @tsparticles/shape-image aplayer meting
```

**Version verification:**
```bash
npm view l2d-widget version         # 0.1.0
npm view @tsparticles/astro version # 4.1.3
npm view @tsparticles/slim version  # 4.1.3
npm view aplayer version            # 1.10.1
npm view meting version             # 2.0.2
```

## Package Legitimacy Audit

| Package | Registry | Age | Downloads | Source Repo | Disposition |
|---------|----------|-----|-----------|-------------|-------------|
| l2d-widget | npm | ~1 month (May 2026) | new | github.com/hacxy/l2d-widget | Approved — rewrite of established oh-my-live2d |
| @tsparticles/astro | npm | ~3 years | established | github.com/tsparticles/tsparticles | Approved — official tsparticles org |
| @tsparticles/slim | npm | ~3 years | established | github.com/tsparticles/tsparticles | Approved — official tsparticles org |
| aplayer | npm | 8+ years (2018) | high | github.com/MoePlayer/APlayer | Approved — stable, used by bilibili |
| meting | npm | ~1 year (Sept 2025) | moderate | github.com/metowolf/MetingJS | Approved — official MetingJS package |

*Note: slopcheck not available at research time. All packages verified via npm registry + source repo existence.*

## Architecture Patterns

### System Architecture Diagram

```
[Visitor Browser]
       |
       v
[BaseLayout.astro]
       |
       +---> [Pre-paint script] --> sets data-theme, data-atmo, window.__atmo__
       |
       +---> [Header] --> IntensityBadge (cycles off/subtle/full)
       |                  ThemeSwitcher (cycles light/dark/system)
       |
       +---> <slot> (page content)
       |
       +---> [Atmosphere Layer] (client:idle islands)
              |
              +---> [PetalsIsland] <-- subscribes to __atmo__, theme
              |       uses @tsparticles/astro <Particles>
              |       canvas RAF loop, 30fps throttle
              |       pauses on document.hidden
              |
              +---> [BGMIsland] <-- subscribes to __atmo__
              |       loads APlayer + MetingJS from CDN
              |       muted by default, unmute button
              |       transition:persist for cross-page
              |
              +---> [Live2DIsland] <-- subscribes to __atmo__
              |       l2d-widget createWidget()
              |       device gate: try-load, catch-fallback
              |       static PNG if WebGL fails
              |
              +---> [ContextMenuIsland] <-- vanilla JS
              |       Shift+right-click only
              |       long-press on mobile
              |
              +---> [EasterEggIsland] <-- vanilla JS
                      Konami code listener
                      input/textarea guards
```

### Recommended Project Structure

```
src/components/atmosphere/
├── PetalsIsland.astro          # tsParticles falling petals
├── BGMIsland.astro             # APlayer + MetingJS wrapper
├── Live2DIsland.astro          # l2d-widget wrapper
├── ContextMenuIsland.astro     # Shift+right-click menu
└── EasterEggIsland.astro       # Konami code + secret terminal

public/
├── models/                     # Live2D model files
│   ├── cat-black/
│   │   ├── model.json
│   │   └── textures/
│   └── cat-white/
│       ├── model.json
│       └── textures/
└── petals/                     # Sakura petal PNG for tsParticles
    └── sakura.png
```

### Pattern 1: Atmosphere Gating via window.__atmo__

Every atmosphere island must subscribe to the Phase 1 `window.__atmo__` API and react to intensity/theme changes.

```typescript
// Source: Phase 1 BaseLayout.astro pre-paint script
// Every atmosphere island uses this pattern:
(function () {
  if (!window.__atmo__) return;

  function shouldRun() {
    return window.__atmo__.level !== 'off' && !window.__atmo__.reducedMotion;
  }

  // Initial check
  if (!shouldRun()) {
    // Hide or skip initialization
    return;
  }

  // Subscribe to changes
  window.__atmo__.subscribe(function (state) {
    if (state.level === 'off' || state.reducedMotion) {
      // Pause/destroy effect
    } else {
      // Resume/create effect
    }
  });
})();
```

### Pattern 2: Astro Island with client:idle

All atmosphere components use `client:idle` to defer hydration until after first paint:

```astro
---
// src/components/atmosphere/Live2DIsland.astro
---
<div class="atmo-live2d" data-atmo-gate>
  <div id="l2d-container"></div>
  <img class="l2d-fallback" src="/models/fallback.png" alt="Mascot" loading="lazy" />
</div>

<script>
  import { createWidget } from 'l2d-widget';
  // ... initialization
</script>
```

Usage in BaseLayout:
```astro
<Live2DIsland client:idle />
<PetalsIsland client:idle />
<BGMIsland client:idle />
```

### Pattern 3: CDN Script Loading for APlayer + MetingJS

APlayer and MetingJS don't have Astro wrappers. Load via CDN in an island:

```astro
---
// src/components/atmosphere/BGMIsland.astro
---
<div id="aplayer-container" class="atmo-bgm"></div>

<script>
  // Load APlayer CSS + JS + MetingJS from CDN
  // Create <meting-js> element dynamically
  // Handle muted default + unmute button
</script>
```

### Anti-Patterns to Avoid

- **Global contextmenu hijack:** Never `preventDefault()` on all contextmenu events. Only intercept `Shift+right-click` (ATM-03).
- **Blocking first paint:** Never use `client:load` for atmosphere islands. Always `client:idle` or `client:visible`.
- **Ignoring reduced-motion:** Every RAF loop must check `window.__atmo__.reducedMotion` AND listen for `matchMedia('(prefers-reduced-motion: reduce)')` changes.
- **APlayer autoplay:** Never set `autoplay: true`. Use muted autoplay or manual unmute only.
- **Live2D on low-end devices:** Don't pre-check `navigator.deviceMemory` — just try to load and catch the error. The CONTEXT decision says "try-load-all-devices with static PNG fallback."

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Particle animation | Custom canvas RAF loop | @tsparticles/astro | Handles resize, retina, theme switching, pause/visibility |
| Live2D rendering | Direct Cubism SDK integration | l2d-widget | Abstracts Cubism 2+6, model switching, WebGL lifecycle |
| Music player | Custom Web Audio + UI | APlayer + MetingJS | Polish, playlist, lyrics, CN ecosystem conventions |
| Custom right-click | Complex gesture library | Vanilla JS event listeners | Shift+right-click + long-press is simple enough |

## Common Pitfalls

### Pitfall 1: MetingJS API Endpoint Unreliable
**What goes wrong:** The default MetingJS API proxy (`api.i-meto.com`) goes down or rate-limits.
**Why it happens:** Third-party proxy, no SLA.
**How to avoid:** Use `self-hosted` Meting API on Cloudflare Worker, or use direct NetEase API with `server="netease"` and accept occasional failures. Plan self-hosted fallback for Phase 6+.
**Warning signs:** Music fails to load, console shows CORS or 404 from MetingJS API.

### Pitfall 2: tsParticles Canvas Blocks Scroll on Mobile
**What goes wrong:** Particle canvas captures touch events, preventing scroll.
**Why it happens:** Canvas element sits above content with `pointer-events: auto`.
**How to avoid:** Set `pointer-events: none` on the particles canvas container. tsParticles handles this via `fullScreen.interactivity.events.onClick` config.
**Warning signs:** Page feels stuck on mobile, can't scroll through content.

### Pitfall 3: Live2D Model Files Too Large for Cloudflare Pages
**What goes wrong:** Model files exceed 25 MiB per asset limit on Cloudflare Pages free tier.
**Why it happens:** Live2D models with high-res textures can be 10-30 MB.
**How to avoid:** Compress textures (WebP/AVIF), reduce texture resolution, use Cubism Editor's compression export. If still over 25 MiB, serve from Cloudflare R2 (free 10 GB).
**Warning signs:** Deploy fails with file size error.

### Pitfall 4: View Transitions Not Enabled for BGM Persistence
**What goes wrong:** BGM stops on every page navigation because `transition:persist` has no effect.
**Why it happens:** View Transitions not enabled in `astro.config.mjs`.
**How to avoid:** Add `viewTransitions: true` to Astro config, or use `transition:persist` directive. Alternatively, manage BGM state via `localStorage` + `sessionStorage` and re-initialize on each page.
**Warning signs:** Music restarts from beginning on every page navigation.

### Pitfall 5: Konami Code Captures Keys in Form Fields
**What goes wrong:** Typing "BA" in a textarea triggers the easter egg.
**Why it happens:** Keydown listener doesn't check `event.target`.
**How to avoid:** Check `event.target.tagName` — ignore if `INPUT`, `TEXTAREA`, or `contenteditable`. P-17 in PITFALLS.md.
**Warning signs:** Users report unexpected terminal appearing while typing.

### Pitfall 6: APlayer CSS Conflicts with Tailwind
**What goes wrong:** APlayer's CSS resets or conflicts with Tailwind utilities.
**Why it happens:** APlayer ships its own CSS with aggressive selectors.
**How to avoid:** Scope APlayer inside a container with specific class. Use CSS `all: initial` on the container to isolate. Override only necessary styles.
**Warning signs:** APlayer UI looks broken, or site styles leak into player.

## Code Examples

### Live2D Island with Device Gate and Fallback

```astro
---
// src/components/atmosphere/Live2DIsland.astro
---
<div class="atmo-live2d" id="l2d-root">
  <img
    class="l2d-fallback"
    src="/models/fallback.png"
    alt="Site mascot"
    loading="lazy"
    width="200"
    height="300"
  />
</div>

<style>
  .atmo-live2d {
    position: fixed;
    bottom: 0;
    right: 20px;
    z-index: 100;
    width: 200px;
    height: 300px;
    pointer-events: auto;
  }
  :root[data-atmo="off"] .atmo-live2d {
    display: none;
  }
  .l2d-fallback {
    width: 100%;
    height: auto;
  }
</style>

<script>
  import { createWidget } from 'l2d-widget';

  (async function () {
    const root = document.getElementById('l2d-root');
    const fallback = root?.querySelector('.l2d-fallback') as HTMLImageElement;
    if (!root || !window.__atmo__) return;

    // Gate on intensity
    if (window.__atmo__.level === 'off') return;

    try {
      const widget = createWidget({
        model: [
          { path: '/models/cat-black/model.json' },
          { path: '/models/cat-white/model.json' },
        ],
      });

      // Hide fallback on success
      if (fallback) fallback.style.display = 'none';

      // Subscribe to intensity changes
      window.__atmo__.subscribe(function (state) {
        if (state.level === 'off') {
          widget.sleep();
        } else {
          // Widget auto-wakes on interaction
        }
      });
    } catch (e) {
      // WebGL not supported or OOM — show fallback
      console.warn('Live2D load failed, showing static fallback:', e);
      if (fallback) fallback.style.display = 'block';
    }
  })();
</script>
```

### tsParticles Sakura Petals Configuration

```typescript
// Source: @tsparticles/astro + @tsparticles/slim
import type { ISourceOptions } from '@tsparticles/engine';

const sakuraOptions: ISourceOptions = {
  fullScreen: false,
  fpsLimit: 30,
  particles: {
    number: {
      value: 30,      // desktop count; override to 15 on mobile
      density: { enable: true, width: 1920, height: 1080 }
    },
    color: {
      value: ['#FFB7C5', '#FF69B4', '#FFC0CB']  // theme-linked
    },
    shape: {
      type: 'image',
      image: { src: '/petals/sakura.png', width: 32, height: 32 }
    },
    opacity: {
      value: { min: 0.3, max: 0.8 },
      animation: { enable: true, speed: 0.5, minimumValue: 0.1 }
    },
    size: {
      value: { min: 8, max: 16 },
      animation: { enable: true, speed: 2, minimumValue: 4 }
    },
    move: {
      enable: true,
      direction: 'bottom-right',
      speed: { min: 1, max: 3 },
      straight: false,
      outModes: { default: 'out' },
      gravity: { enable: true, acceleration: 0.5 }
    },
    rotate: {
      value: { min: 0, max: 360 },
      animation: { enable: true, speed: 5 }
    },
    wobble: {
      enable: true,
      distance: 10,
      speed: 3
    }
  },
  detectRetina: true,
  pauseOnBlur: true  // pauses on document.hidden
};
```

### BGM Island with Muted Default + Unmute Button

```astro
---
// src/components/atmosphere/BGMIsland.astro
---
<div id="bgm-root" class="atmo-bgm">
  <button id="bgm-unmute" class="bgm-unmute-btn" aria-label="打开音乐">
    🔇 打开音乐
  </button>
  <div id="aplayer-container"></div>
</div>

<style>
  .atmo-bgm {
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 100;
  }
  :root[data-atmo="off"] .atmo-bgm {
    display: none;
  }
  .bgm-unmute-btn {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 999px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-size: 0.9rem;
    color: var(--color-fg);
  }
</style>

<script>
  (function () {
    var root = document.getElementById('bgm-root');
    var btn = document.getElementById('bgm-unmute');
    var container = document.getElementById('aplayer-container');
    if (!root || !btn || !container || !window.__atmo__) return;

    var ap = null;
    var unmuted = localStorage.getItem('bgm:unmuted') === 'true';

    function loadAPlayer() {
      // Load APlayer CSS
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.css';
      document.head.appendChild(link);

      // Load APlayer JS
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.js';
      script.onload = function () {
        // Load MetingJS
        var meting = document.createElement('script');
        meting.src = 'https://cdn.jsdelivr.net/npm/meting@2.0.2/dist/Meting.min.js';
        meting.onload = function () {
          // Create meting-js element
          var el = document.createElement('meting-js');
          el.setAttribute('server', 'netease');
          el.setAttribute('type', 'playlist');
          el.setAttribute('id', 'PLAYLIST_ID_HERE');  // TODO: configure
          el.setAttribute('autoplay', 'false');
          el.setAttribute('mutex', 'true');
          container.appendChild(el);
        };
        document.head.appendChild(meting);
      };
      document.head.appendChild(script);
    }

    btn.addEventListener('click', function () {
      // iOS AudioContext.resume()
      if (window.AudioContext || window.webkitAudioContext) {
        var ctx = new (window.AudioContext || window.webkitAudioContext)();
        ctx.resume();
      }
      loadAPlayer();
      localStorage.setItem('bgm:unmuted', 'true');
      btn.style.display = 'none';
    });

    // Auto-load if previously unmuted
    if (unmuted) {
      btn.style.display = 'none';
      loadAPlayer();
    }
  })();
</script>
```

### Konami Code Easter Egg

```typescript
// Source: vanilla JS, pattern from PITFALLS.md P-17
const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
];

let konamiIndex = 0;

document.addEventListener('keydown', function (e) {
  // Guard: ignore in form fields
  const tag = (e.target as HTMLElement).tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' ||
      (e.target as HTMLElement).isContentEditable) {
    return;
  }

  if (e.code === KONAMI_CODE[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === KONAMI_CODE.length) {
      konamiIndex = 0;
      openSecretTerminal();
    }
  } else {
    konamiIndex = 0;
  }
});
```

## Runtime State Inventory

> Phase 5 is a greenfield feature addition, not a rename/refactor. No runtime state to migrate.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None | — |
| Live service config | None | — |
| OS-registered state | None | — |
| Secrets/env vars | None — BGM playlist ID is a code constant | — |
| Build artifacts | None | — |

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js 22+ | Build | Yes | >=22.0.0 | — |
| pnpm | Package manager | Yes | 11.5.1 | — |
| WebGL (browser) | Live2D | Runtime check | — | Static PNG fallback |
| NetEase Music API | BGM playlist | External | — | Self-hosted Meting API on CF Worker |

## Common Pitfalls

### Pitfall 7: tsParticles Astro SSR Hydration Mismatch
**What goes wrong:** `initParticlesEngine` runs server-side during Astro build, causing "document is not defined" error.
**Why it happens:** `@tsparticles/astro` exports server/client split — must use client-side initialization.
**How to avoid:** The `<Particles>` component handles this internally. Ensure the `await initParticlesEngine()` call is inside the component's frontmatter (server-side) and the engine loads client-side via the component's built-in hydration.
**Warning signs:** Build fails with "document is not defined" or "window is not defined".

### Pitfall 8: Live2D Model Licensing
**What goes wrong:** Using a model without proper license; "study only" models can't be used on public sites.
**Why it happens:** Many free Live2D models on Pixiv are marked "study only" or have restrictive licenses.
**How to avoid:** Use models with explicit permissive licenses (CC-BY, CC0, or custom "free for personal use"). Document license in About page. Consider commissioning a custom model.
**Warning signs:** DMCA takedown, model creator complaint.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.8 + Playwright 1.60.0 |
| Config file | vitest.config.ts (exists), playwright.config.ts (Wave 0) |
| Quick run command | `pnpm vitest run` |
| Full suite command | `pnpm vitest run && pnpm playwright test` |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ATM-01 | Live2D loads on capable device, fallback on failure | e2e | `pnpm playwright test live2d` | Wave 0 |
| ATM-02 | Petals visible when atmo=full, hidden when atmo=off | e2e | `pnpm playwright test petals` | Wave 0 |
| ATM-03 | Shift+right-click shows custom menu, regular right-click does not | e2e | `pnpm playwright test context-menu` | Wave 0 |
| ATM-05 | BGM muted by default, unmute works | e2e | `pnpm playwright test bgm` | Wave 0 |
| ATM-06 | Konami code triggers terminal, ignored in inputs | e2e | `pnpm playwright test easter-egg` | Wave 0 |
| INFRA-06 | BGM persists across navigation (transition:persist) | e2e | `pnpm playwright test bgm-persist` | Wave 0 |

### Sampling Rate
- **Per task commit:** `pnpm vitest run`
- **Per wave merge:** `pnpm vitest run && pnpm playwright test`
- **Phase gate:** Full suite green before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `playwright.config.ts` — may need creation if not exists
- [ ] `e2e/atmosphere/` — test directory for atmosphere E2E tests
- [ ] Mock/stub setup for APlayer + MetingJS CDN loads in tests
- [ ] Test Live2D fallback path (mock WebGL failure)

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | No user accounts |
| V3 Session Management | No | localStorage only, no sessions |
| V4 Access Control | No | All public content |
| V5 Input Validation | Yes | Konami code input sanitization, right-click menu actions |
| V6 Cryptography | No | No sensitive data |

### Known Threat Patterns for Atmosphere Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| XSS via MetingJS API response | Tampering | Sanitize any user-facing data from MetingJS API; use CSP |
| Malicious Live2D model files | Elevation of Privilege | Only load models from trusted sources; validate model.json structure |
| Keylogger via Konami code listener | Information Disclosure | Listener only processes arrow keys + BA; no data exfiltration |
| CDN script tampering (APlayer/MetingJS) | Tampering | Pin CDN URLs to specific versions; consider SRI hashes |

## Sources

### Primary (HIGH confidence)
- npm registry — l2d-widget@0.1.0, @tsparticles/astro@4.1.3, aplayer@1.10.1, meting@2.0.2 verified
- l2d-widget README (npm) — API: `createWidget()`, model array for switcher, tips/typing/greeting
- @tsparticles/astro README (npm) — `initParticlesEngine` + `<Particles>` component pattern
- MetingJS README (npm) — `<meting-js>` custom element, CDN URLs
- Phase 1 BaseLayout.astro — `window.__atmo__` API with `subscribe()`, `set()`, `level`, `theme`
- Phase 1 global.css — `[data-atmo="off"]` selectors, `prefers-reduced-motion` rule
- PITFALLS.md — P-1 (Live2D perf), P-2 (autoplay), P-3 (particles battery), P-7 (right-click), P-17 (Konami)

### Secondary (MEDIUM confidence)
- APlayer docs (aplayer.js.org) — configuration options, playlist mode
- tsParticles docs (tsparticles.dev) — shape-image for custom petal PNG

### Tertiary (LOW confidence)
- MetingJS default API proxy reliability — third-party, no SLA
- Live2D free model licensing — varies by creator, needs per-model verification

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | MetingJS `server="netease"` works with default API proxy | BGM | Music won't load; need self-hosted proxy |
| A2 | l2d-widget `createWidget()` handles Cubism runtime loading internally | Live2D | May need manual Cubism SDK CDN load |
| A3 | @tsparticles/astro `<Particles>` works with `client:idle` | Petals | May need manual canvas initialization |
| A4 | APlayer CSS can be scoped without major conflicts | BGM | UI may look broken |
| A5 | Free Live2D models available with permissive license | Live2D | May need to commission custom model |

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages verified on npm, APIs documented
- Architecture: HIGH — Phase 1 infrastructure (window.__atmo__) already provides gating hooks
- Pitfalls: HIGH — sourced from project-specific PITFALLS.md + Phase 1 patterns

**Research date:** 2026-06-04
**Valid until:** 2026-07-04 (30 days — stable stack, no expected breaking changes)
