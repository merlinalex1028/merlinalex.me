import { test, expect } from '@playwright/test';

test.describe('Search index (Pagefind)', () => {
  test('search input returns results', async ({ page }) => {
    await page.goto('/');

    // Pagefind search input
    const searchInput = page.locator('#pagefind-search, [data-pagefind-search], input[type="search"]');
    await expect(searchInput).toBeVisible();

    // Type a search query
    await searchInput.fill('welcome');
    await searchInput.press('Enter');

    // Wait for search results to appear
    const results = page.locator('.pagefind-ui__result, [data-pagefind-result]');
    await expect(results.first()).toBeVisible({ timeout: 5000 });

    // Verify at least one result
    const resultCount = await results.count();
    expect(resultCount).toBeGreaterThan(0);
  });
});
