import { test, expect } from '@playwright/test';

test.describe('App', () => {
  test('should load with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Markdown Wiki/i);
  });

  test('should show editor', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#editor')).toBeVisible();
  });

  test('should show preview', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#preview')).toBeVisible();
  });

  test('should show page title', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#page-title')).toBeVisible();
  });
});
