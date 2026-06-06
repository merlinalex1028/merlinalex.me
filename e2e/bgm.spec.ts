import { test, expect } from '@playwright/test';

test.describe('BGM unmute', () => {
  test('unmute button is present by default', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // The BGM island has an unmute button that loads APlayer on click
    const bgmRoot = page.locator('#bgm-root');
    await expect(bgmRoot).toBeAttached({ timeout: 10000 });

    const unmuteButton = page.locator('#bgm-unmute');
    await expect(unmuteButton).toBeVisible({ timeout: 10000 });
  });

  test('clicking unmute loads APlayer', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Wait for the unmute button
    const unmuteButton = page.locator('#bgm-unmute');
    await expect(unmuteButton).toBeVisible({ timeout: 10000 });

    // Click unmute to load APlayer
    await unmuteButton.click();

    // APlayer should now load dynamically
    const aplayer = page.locator('.aplayer');
    await expect(aplayer).toBeVisible({ timeout: 10000 });
  });
});
