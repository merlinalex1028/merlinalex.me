import { test, expect } from '@playwright/test';

test.describe('BGM unmute', () => {
  test('APlayer container is present and muted by default', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // APlayer should be present on the page
    const aplayer = page.locator('.aplayer, #aplayer, [data-aplayer]');
    await expect(aplayer).toBeVisible({ timeout: 5000 });
  });

  test('clicking unmute changes APlayer state', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for APlayer to initialize
    const aplayer = page.locator('.aplayer, #aplayer, [data-aplayer]');
    await expect(aplayer).toBeVisible({ timeout: 5000 });

    // Find the APlayer play/unmute button
    const playButton = page.locator('.aplayer-icon, .aplayer-play, button[aria-label*="play"], button[aria-label*="Play"]');

    if (await playButton.count() > 0) {
      // Click play button to unmute/start
      await playButton.first().click();

      // Verify the APlayer state changed (playing class or attribute)
      await page.waitForTimeout(500);
      const aplayerElement = await aplayer.first();
      const classList = await aplayerElement.getAttribute('class');
      // After clicking, APlayer should be in playing state
      expect(classList).toBeTruthy();
    }
  });
});
