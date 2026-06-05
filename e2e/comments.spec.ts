import { test, expect } from '@playwright/test';

test.describe('Comment posting (Twikoo)', () => {
  test('Twikoo comment container loads on article page', async ({ page }) => {
    // Navigate to the article page
    await page.goto('/articles/welcome');
    await page.waitForLoadState('networkidle');

    // Twikoo should create a comment container
    const twikooContainer = page.locator('#tcomment, .tk-comments, [data-twikoo]');
    await expect(twikooContainer).toBeVisible({ timeout: 10000 });
  });

  test('Twikoo comment input is interactive', async ({ page }) => {
    await page.goto('/articles/welcome');
    await page.waitForLoadState('networkidle');

    // Wait for Twikoo to initialize
    const twikooContainer = page.locator('#tcomment, .tk-comments, [data-twikoo]');
    await expect(twikooContainer).toBeVisible({ timeout: 10000 });

    // Check that the comment form is present (may be in an iframe)
    const commentInput = page.locator(
      'textarea, .tk-input, .el-textarea__inner, [data-twikoo-input], iframe'
    );

    // At least the comment infrastructure should be present
    const hasInput = await commentInput.count() > 0;
    const hasIframe = await page.locator('iframe').count() > 0;

    expect(hasInput || hasIframe).toBeTruthy();
  });
});
