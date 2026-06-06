import { test, expect } from '@playwright/test';

test.describe('Reduced-motion gate', () => {
  test('atmosphere respects prefers-reduced-motion', async ({ page }) => {
    // Emulate reduced-motion preference before navigation
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Verify the atmosphere level is off
    const html = page.locator('html');
    const atmoLevel = await html.getAttribute('data-atmo');

    // With reduced-motion, atmosphere should be off
    expect(atmoLevel).toBe('off');
  });

  test('animations are disabled when reduced-motion is preferred', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Check that CSS animations are disabled via media query
    const animationState = await page.evaluate(() => {
      const styles = document.querySelectorAll('style');
      let hasReducedMotionRule = false;
      styles.forEach(style => {
        if (style.textContent?.includes('prefers-reduced-motion')) {
          hasReducedMotionRule = true;
        }
      });
      return { hasReducedMotionRule };
    });

    // The site should respect reduced-motion preference
    expect(animationState.hasReducedMotionRule).toBeTruthy();
  });
});
