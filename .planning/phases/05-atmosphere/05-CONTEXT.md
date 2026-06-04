# Phase 5: Atmosphere - Context

**Gathered:** 2026-06-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver the full immersive 二次元 atmosphere. Visitors experience:

- Live2D mascot with greeting, model switcher, CDN-loaded Cubism SDK, local model files, try-load-all-devices with static PNG fallback
- Falling cherry blossom petals (30 desktop / 15 mobile, 30 FPS throttle, pause on document.hidden) + cursor trail effect on desktop
- BGM player via APlayer + MetingJS (NetEase Cloud Music playlist), muted by default with manual unmute button, cross-page persistence via transition:persist
- Custom right-click menu (Shift+right-click only) with terminal, home, sponsor, intensity selector; long-press toolbar fallback on mobile
- Konami code easter egg triggering a secret terminal interface
- All effects gated behind intensity toggle (off/subtle/full) and respects prefers-reduced-motion

**Out of Phase 5 scope** (shipped later): JSON-LD (Phase 6), 80% tests (Phase 6), friend-link health-check Action (Phase 6).

</domain>

<decisions>
## Implementation Decisions

### Live2D Mascot (D-01)
- **Loading:** CDN loads Cubism SDK runtime, model files stored locally in `public/models/`. Use l2d-widget v0.1.0.
- **Model:** Use free Pixiv二次创作 Live2D models (need to verify licensing). Multiple models for switcher.
- **Device gate:** Try to load Live2D on all devices. If load fails (WebGL not supported, out of memory, etc.), gracefully degrade to static PNG fallback. Do NOT pre-check deviceMemory/hardwareConcurrency — just attempt and catch.
- **Interaction:** Greeting message (e.g., "欢迎回来~") and model switcher button. Click to cycle through available models.
- **Hydration:** Use `client:idle` directive to defer loading until after first paint. Never block initial page render.

### Falling Petals + Effects (D-02)
- **Type:** Cherry blossom petals, pink color theme-linked (light pink in light mode, darker pink in dark mode).
- **Particle count:** Desktop 30, mobile 15 (≤20 on mobile per ATM-02).
- **Performance:** 30 FPS throttle, pause when `document.hidden` is true.
- **Cursor trail:** Desktop-only cursor trail effect — petals follow mouse movement.
- **Gating:** Disabled when intensity is "off" or `prefers-reduced-motion: reduce`.
- **Technology:** tsParticles with Astro wrapper.

### BGM Player (D-03)
- **Source:** NetEase Cloud Music (网易云音乐) playlist via MetingJS API.
- **Default state:** Muted. Show a prominent "打开音乐" button for user to unmute.
- **iOS handling:** AudioContext.resume() on touch/click events.
- **Cross-page persistence:** Use Astro `transition:persist` to maintain playback state across navigation.
- **Technology:** APlayer v1.10.1 + MetingJS v2.0.2.

### Right-click Menu (D-04)
- **Trigger:** Shift+right-click only (never hijack global contextmenu).
- **Menu items:** Terminal (opens secret terminal), Home (navigate to /), Sponsor (placeholder), Intensity selector (off/subtle/full toggle).
- **Mobile fallback:** Long-press shows a toolbar with the same options.
- **Styling:** Kawaii-themed custom menu matching site design.

### Easter Eggs (D-05)
- **Konami code:** ↑↑↓↓←→←→BA triggers a secret terminal interface.
- **Input guards:** Key events inside `input`, `textarea`, and `contenteditable` elements are ignored — Konami code only works on the page body.
- **Terminal:** Simple interactive terminal with fun commands (help, whoami, secret, etc.).

### Claude's Discretion
- Specific Live2D model files and licensing verification
- tsParticles configuration for petals (speed, rotation, opacity)
- APlayer theme customization to match site design
- Right-click menu CSS and animation
- Konami code terminal commands and Easter egg content
- MetingJS playlist ID configuration

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project-Level
- `.planning/PROJECT.md` — Core value, constraints, key decisions
- `.planning/REQUIREMENTS.md` — REQ-IDs and traceability for Phase 5: ATM-01, ATM-02, ATM-03, ATM-05, ATM-06, INFRA-06 (BGM portion)
- `.planning/ROADMAP.md` — Phase 5 success criteria, 5-plan breakdown
- `.planning/STATE.md` — Project state and accumulated context from Phases 1-4

### Prior Phase Context (patterns to follow)
- `.planning/phases/01-foundation/01-CONTEXT.md` — Theme architecture, intensity toggle, prefers-reduced-motion, window.__atmo__ API

### Research
- `.planning/research/STACK.md` — Library versions, l2d-widget, tsParticles, APlayer + MetingJS
- `.planning/research/FEATURES.md` — Genre conventions, 二次元 aesthetic patterns
- `.planning/research/PITFALLS.md` — Relevant pitfalls for atmosphere features

### External Specs
- l2d-widget v0.1.0: GitHub `hacxy/l2d-widget` — Cubism 2 & 6 runtime, model switcher, greeting
- tsParticles: `tsparticles.dev` — Astro wrapper, snow/petal presets
- APlayer: GitHub `DIYgod/APlayer` — v1.10.1
- MetingJS: GitHub `metowolf/MetingJS` — v2.0.2, NetEase/QQ music API

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `window.__atmo__` global API (Phase 1): `{ level, theme, set }` — atmosphere components subscribe to intensity changes
- `data-theme` + `data-atmo` attributes on `<html>`: CSS can target `[data-atmo="off"]` to hide effects
- `prefers-reduced-motion` global CSS rule (Phase 1): already disables CSS animations
- Content collections + component organization patterns from Phases 1-4

### Established Patterns
- `client:idle` directive for deferred hydration (Live2D should use this)
- CSS variables for theming (`--color-accent`, etc.)
- Component organization: `src/components/{feature}/` directories

### Integration Points
- `src/components/atmosphere/` — new directory for all atmosphere components
- `src/layouts/BaseLayout.astro` — add atmosphere components here
- `src/styles/global.css` — prefers-reduced-motion already wired
- `public/models/` — new directory for Live2D model files
- `public/bgm/` — optional local audio files if needed

</code_context>

<specifics>
## Specific Ideas

- Live2D mascot should feel alive — greeting changes based on time of day, model switcher has smooth transitions
- Cherry blossom petals should be subtle — not overwhelming, just enough to create atmosphere
- BGM should be opt-in — never auto-play, always muted by default
- Right-click menu should feel like a hidden feature — discovery is part of the fun
- Konami code terminal should have personality — fun responses, maybe a hidden message

</specifics>

<deferred>
## Deferred Ideas

- Live2D dress-up feature (ATM-07-v2) — requires Cubism Editor subscription
- Holiday theme variants (ATM-08-v2) — full Christmas/NYE/Spring Festival sets

</deferred>

---

*Phase: 5-Atmosphere*
*Context gathered: 2026-06-04*
