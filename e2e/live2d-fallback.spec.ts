import { test, expect } from '@playwright/test';

test.describe('Live2D fallback', () => {
  test('Live2D canvas or static fallback is present', async ({ page }) => {
    await page.goto('/');

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    // Check for either Live2D canvas or static PNG fallback
    const live2dCanvas = page.locator('canvas, #live2d, [data-live2d]');
    const staticFallback = page.locator('img[data-live2d-fallback], .live2d-fallback img');

    const hasCanvas = await live2dCanvas.count() > 0;
    const hasFallback = await staticFallback.count() > 0;

    // At least one should be present
    expect(hasCanvas || hasFallback).toBeTruthy();
  });

  test('static fallback loads on low-end device simulation', async ({ page }) => {
    // Simulate low-end device by reducing memory
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'deviceMemory', { value: 2 });
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // On low-end devices, the fallback image should be visible
    // or the Live2D should not be loaded (no canvas)
    const canvas = page.locator('canvas');
    const fallbackImg = page.locator('img[data-live2d-fallback], .live2d-fallback img');

    const hasCanvas = await canvas.count() > 0;
    const hasFallback = await fallbackImg.count() > 0;

    // Either no canvas (disabled for low-end) or fallback is shown
    expect(!hasCanvas || hasFallback).toBeTruthy();
  });
});
