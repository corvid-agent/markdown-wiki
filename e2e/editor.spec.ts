import { test, expect } from '@playwright/test';

test.describe('Editor', () => {
  test('should type markdown and see preview', async ({ page }) => {
    await page.goto('/');
    const editor = page.locator('#editor');
    await editor.click();
    await editor.fill('# Hello World');
    // Wait for preview to update
    await page.waitForTimeout(500);
    await expect(page.locator('#preview')).toContainText('Hello World');
  });

  test('should show page list', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#page-list')).toBeVisible();
  });

  test('should show search input', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#search-input')).toBeVisible();
  });

  test('should have modal elements', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#modal-overlay')).toBeAttached();
  });

  test('should render bold text', async ({ page }) => {
    await page.goto('/');
    const editor = page.locator('#editor');
    await editor.click();
    await editor.fill('**bold text**');
    await page.waitForTimeout(500);
    const preview = page.locator('#preview');
    await expect(preview).toContainText('bold text');
  });
});
