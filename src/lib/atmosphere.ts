/**
 * Atmosphere gate utility — shared by all Phase 5 atmosphere islands.
 *
 * Wraps the `window.__atmo__` global API (set by BaseLayout's pre-paint script)
 * into typed helper functions. Every function guards against `window.__atmo__`
 * being undefined (SSR safety / pre-paint script failure).
 */

/** Internal: safely access window.__atmo__ or return undefined */
function getAtmo(): WindowAtmo | undefined {
  if (typeof window === 'undefined') return undefined;
  return (window as WindowWithAtmo).__atmo__;
}

interface WindowAtmo {
  level: string;
  storedLevel: string;
  theme: string;
  storedTheme: string;
  reducedMotion: boolean;
  set: (patch: { theme?: string; atmo?: string }) => void;
  subscribe: (fn: (state: WindowAtmo) => void) => void;
  _listeners: Array<(state: WindowAtmo) => void>;
}

interface WindowWithAtmo extends Window {
  __atmo__?: WindowAtmo;
}

interface AtmoState {
  level: string;
  theme: string;
  reducedMotion: boolean;
}

/** Returns true when atmosphere is off (or __atmo__ is unavailable). */
export function isOff(): boolean {
  const atmo = getAtmo();
  if (!atmo) return true;
  return atmo.level === 'off';
}

/** Returns true when atmosphere level is 'subtle'. */
export function isSubtle(): boolean {
  const atmo = getAtmo();
  if (!atmo) return false;
  return atmo.level === 'subtle';
}

/** Returns true when atmosphere level is 'full'. */
export function isFull(): boolean {
  const atmo = getAtmo();
  if (!atmo) return false;
  return atmo.level === 'full';
}

/** Returns the current effective atmosphere level. */
export function getLevel(): 'off' | 'subtle' | 'full' {
  const atmo = getAtmo();
  if (!atmo) return 'off';
  const lvl = atmo.level;
  if (lvl === 'subtle') return 'subtle';
  if (lvl === 'full') return 'full';
  return 'off';
}

/** Set atmosphere intensity level. Persists to localStorage. */
export function setLevel(level: 'off' | 'subtle' | 'full'): void {
  const atmo = getAtmo();
  if (!atmo) return;
  atmo.set({ atmo: level });
}

/**
 * Returns true when reduced motion is preferred.
 *
 * Checks both `window.__atmo__?.reducedMotion` (set by pre-paint script)
 * AND the live media query (defensive: in case the pre-paint value is stale
 * after a system preference change without page reload).
 */
export function isReducedMotion(): boolean {
  if (typeof window === 'undefined') return true;
  const atmo = getAtmo();
  if (atmo?.reducedMotion) return true;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return true;
  }
}

/** Returns true when viewport width is 768px or less. */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return true;
  return window.innerWidth <= 768;
}

/**
 * Subscribe to atmosphere state changes.
 *
 * Calls `fn` whenever `window.__atmo__.set()` is invoked.
 * Returns an unsubscribe function that removes the listener from `_listeners`.
 */
export function onAtmoChange(
  fn: (state: AtmoState) => void
): () => void {
  const atmo = getAtmo();
  if (!atmo) return () => {};

  const wrapper = (state: WindowAtmo) => {
    fn({
      level: state.level,
      theme: state.theme,
      reducedMotion: state.reducedMotion,
    });
  };

  atmo.subscribe(wrapper);

  return () => {
    const listeners = atmo._listeners;
    if (!Array.isArray(listeners)) return;
    const idx = listeners.indexOf(wrapper);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}
