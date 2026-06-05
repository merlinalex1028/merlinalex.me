import { test, expect } from '@playwright/test';

test.describe('Theme persistence', () => {
  test('theme toggle switches to dark and persists after reload', async ({ page }) => {
    await page.goto('/');

    // Find and click the theme toggle button
    const themeToggle = page.locator('button[aria-label*="theme"], button[aria-label*="Theme"], [data-theme-toggle]');
    await expect(themeToggle).toBeVisible();
    await themeToggle.click();

    // Verify dark mode is applied
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    // Reload and verify persistence
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('theme toggle switches to light and persists after reload', async ({ page }) => {
    await page.goto('/');

    // Switch to dark first
    const themeToggle = page.locator('button[aria-label*="theme"], button[aria-label*="Theme"], [data-theme-toggle]');
    await expect(themeToggle).toBeVisible();
    await themeToggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    // Switch back to light
    await themeToggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    // Reload and verify persistence
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });
});
