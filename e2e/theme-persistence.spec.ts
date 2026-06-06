import { test, expect } from '@playwright/test';

test.describe('Theme persistence', () => {
  test('theme toggle switches to dark and persists after reload', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // The actual button is: <button class="theme-switcher" aria-label="切换主题">
    const themeToggle = page.locator('button.theme-switcher');
    await expect(themeToggle).toBeVisible({ timeout: 10000 });

    // Click until we reach dark theme
    // Starting from "system", one click goes to "light", two clicks to "dark"
    await themeToggle.click(); // → light
    await themeToggle.click(); // → dark
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    // Reload and verify persistence
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('theme toggle switches to light and persists after reload', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const themeToggle = page.locator('button.theme-switcher');
    await expect(themeToggle).toBeVisible({ timeout: 10000 });

    // Switch to light (from default "system")
    await themeToggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    // Reload and verify persistence
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  });
});
