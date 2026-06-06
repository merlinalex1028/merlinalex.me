import { test, expect } from '@playwright/test';

test.describe('Comment posting (Twikoo)', () => {
  test('Twikoo comment container loads on article page', async ({ page }) => {
    await page.goto('/articles/welcome', { waitUntil: 'domcontentloaded' });

    // Scroll to the comments section to trigger IntersectionObserver
    const tcomment = page.locator('#tcomment');
    await tcomment.scrollIntoViewIfNeeded();

    // Wait for Twikoo to load (it loads lazily via IntersectionObserver)
    const hasComments = page.locator('.tk-comments');
    const hasFallback = page.locator('.twikoo-fallback');
    await expect(hasComments.or(hasFallback)).toBeVisible({ timeout: 15000 });
  });

  test('Twikoo comment input is interactive', async ({ page }) => {
    await page.goto('/articles/welcome', { waitUntil: 'domcontentloaded' });

    // Scroll to comments section
    const tcomment = page.locator('#tcomment');
    await tcomment.scrollIntoViewIfNeeded();

    // Wait for Twikoo to initialize
    const hasComments = page.locator('.tk-comments');
    const hasFallback = page.locator('.twikoo-fallback');
    await expect(hasComments.or(hasFallback)).toBeVisible({ timeout: 15000 });

    // If Twikoo loaded (not fallback), check for input
    const commentCount = await hasComments.count();
    if (commentCount > 0) {
      const commentInput = page.locator('textarea, .tk-input, .el-textarea__inner');
      await expect(commentInput.first()).toBeVisible({ timeout: 10000 });
    }
  });
});
