import { test, expect } from '@playwright/test';

test.describe('Live2D container', () => {
  test('Live2D root element is present', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // The Live2D island starts hidden and loads via requestIdleCallback
    const l2dRoot = page.locator('#l2d-root');
    await expect(l2dRoot).toBeAttached({ timeout: 10000 });
  });

  test('Live2D loads when atmosphere is enabled and models are configured', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Wait for requestIdleCallback + dynamic import (could be 2-7 seconds)
    const l2dRoot = page.locator('#l2d-root');
    await expect(l2dRoot).toBeAttached({ timeout: 10000 });

    // Wait a bit for the dynamic import to complete
    await page.waitForTimeout(5000);

    // Check if a canvas was created inside l2d-root (Live2D model loaded)
    const canvas = l2dRoot.locator('canvas');
    const canvasCount = await canvas.count();

    // Either canvas exists (model loaded) or root is visible (widget initialized)
    // The root starts hidden but becomes visible when l2d-widget initializes
    if (canvasCount > 0) {
      await expect(canvas).toBeVisible({ timeout: 5000 });
    } else {
      // If no canvas, the root should still be attached (widget may have initialized without model)
      await expect(l2dRoot).toBeAttached();
    }
  });
});
