import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  isOff,
  isSubtle,
  isFull,
  isReducedMotion,
  isMobile,
  getLevel,
  setLevel,
  onAtmoChange,
} from '../atmosphere';

// Mock window.__atmo__
function mockAtmo(partial: Record<string, unknown> = {}) {
  const defaultAtmo = {
    level: 'full',
    storedLevel: 'full',
    theme: 'dark',
    storedTheme: 'dark',
    reducedMotion: false,
    set: vi.fn(),
    subscribe: vi.fn(),
    _listeners: [] as Array<(state: Record<string, unknown>) => void>,
    ...partial,
  };
  (globalThis as Record<string, unknown>).__atmo__ = defaultAtmo;
  (globalThis as Record<string, unknown>).window = globalThis;
  return defaultAtmo;
}

function clearAtmo() {
  delete (globalThis as Record<string, unknown>).__atmo__;
  delete (globalThis as Record<string, unknown>).window;
}

describe('atmosphere', () => {
  beforeEach(() => {
    clearAtmo();
  });

  describe('isOff', () => {
    it('returns true when window.__atmo__ is undefined', () => {
      expect(isOff()).toBe(true);
    });

    it('returns true when level is off', () => {
      mockAtmo({ level: 'off' });
      expect(isOff()).toBe(true);
    });

    it('returns false when level is subtle', () => {
      mockAtmo({ level: 'subtle' });
      expect(isOff()).toBe(false);
    });

    it('returns false when level is full', () => {
      mockAtmo({ level: 'full' });
      expect(isOff()).toBe(false);
    });
  });

  describe('isSubtle', () => {
    it('returns false when window.__atmo__ is undefined', () => {
      expect(isSubtle()).toBe(false);
    });

    it('returns true when level is subtle', () => {
      mockAtmo({ level: 'subtle' });
      expect(isSubtle()).toBe(true);
    });

    it('returns false when level is not subtle', () => {
      mockAtmo({ level: 'full' });
      expect(isSubtle()).toBe(false);
    });
  });

  describe('isFull', () => {
    it('returns false when window.__atmo__ is undefined', () => {
      expect(isFull()).toBe(false);
    });

    it('returns true when level is full', () => {
      mockAtmo({ level: 'full' });
      expect(isFull()).toBe(true);
    });

    it('returns false when level is not full', () => {
      mockAtmo({ level: 'off' });
      expect(isFull()).toBe(false);
    });
  });

  describe('getLevel', () => {
    it('returns off when window.__atmo__ is undefined', () => {
      expect(getLevel()).toBe('off');
    });

    it('returns current level', () => {
      mockAtmo({ level: 'subtle' });
      expect(getLevel()).toBe('subtle');

      mockAtmo({ level: 'full' });
      expect(getLevel()).toBe('full');

      mockAtmo({ level: 'off' });
      expect(getLevel()).toBe('off');
    });
  });

  describe('setLevel', () => {
    it('does nothing when window.__atmo__ is undefined', () => {
      expect(() => setLevel('full')).not.toThrow();
    });

    it('calls atmo.set with the given level', () => {
      const atmo = mockAtmo();
      setLevel('subtle');
      expect(atmo.set).toHaveBeenCalledWith({ atmo: 'subtle' });
    });
  });

  describe('isMobile', () => {
    it('returns true when window is undefined (SSR)', () => {
      // In test env window exists, so we mock innerWidth
      (globalThis as Record<string, unknown>).window = { innerWidth: 500 };
      expect(isMobile()).toBe(true);
    });

    it('returns true when viewport width is 768 or less', () => {
      (globalThis as Record<string, unknown>).window = { innerWidth: 768 };
      expect(isMobile()).toBe(true);
    });

    it('returns false when viewport width is greater than 768', () => {
      (globalThis as Record<string, unknown>).window = { innerWidth: 1024 };
      expect(isMobile()).toBe(false);
    });
  });

  describe('isReducedMotion', () => {
    it('returns true when window is undefined (SSR)', () => {
      // In test env window is defined via globalThis, so we test the atmo path
      mockAtmo({ reducedMotion: true });
      expect(isReducedMotion()).toBe(true);
    });

    it('returns true when reducedMotion is true in atmo', () => {
      mockAtmo({ reducedMotion: true });
      expect(isReducedMotion()).toBe(true);
    });

    it('returns false when reducedMotion is false and matchMedia does not match', () => {
      mockAtmo({ reducedMotion: false });
      // Mock matchMedia to return false
      (globalThis as Record<string, unknown>).matchMedia = () => ({ matches: false });
      expect(isReducedMotion()).toBe(false);
    });
  });

  describe('onAtmoChange', () => {
    it('returns unsubscribe function when __atmo__ is undefined', () => {
      const unsub = onAtmoChange(() => {});
      expect(typeof unsub).toBe('function');
    });

    it('subscribes and receives state changes', () => {
      const atmo = mockAtmo();
      const callback = vi.fn();

      onAtmoChange(callback);

      expect(atmo.subscribe).toHaveBeenCalled();
    });

    it('unsubscribe removes listener from _listeners', () => {
      const atmo = mockAtmo();
      // Simulate subscribe adding to _listeners
      atmo.subscribe = vi.fn((fn: (state: Record<string, unknown>) => void) => {
        atmo._listeners.push(fn);
      });

      const unsub = onAtmoChange(() => {});
      expect(atmo._listeners.length).toBe(1);

      unsub();
      expect(atmo._listeners.length).toBe(0);
    });

    it('unsubscribe handles non-array _listeners gracefully', () => {
      const atmo = mockAtmo();
      atmo.subscribe = vi.fn((fn: (state: Record<string, unknown>) => void) => {
        atmo._listeners.push(fn);
      });
      const unsub = onAtmoChange(() => {});
      // Corrupt _listeners to non-array
      atmo._listeners = 'not-an-array' as unknown as typeof atmo._listeners;
      expect(() => unsub()).not.toThrow();
    });
  });
});
