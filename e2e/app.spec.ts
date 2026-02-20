import { test, expect } from '@playwright/test';

test.describe('App Loading', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load with correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Markdown Wiki');
  });

  test('should display the logo with app name', async ({ page }) => {
    const logo = page.locator('.logo h1');
    await expect(logo).toBeVisible();
    await expect(logo).toContainText('Markdown');
    await expect(logo).toContainText('Wiki');
  });

  test('should show the header with Save and Export buttons', async ({ page }) => {
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('#btn-save')).toBeVisible();
    await expect(page.locator('#btn-save')).toHaveText('Save');
    await expect(page.locator('#btn-export')).toBeVisible();
    await expect(page.locator('#btn-export')).toHaveText('Export');
  });

  test('should show the sidebar with Pages heading and search input', async ({ page }) => {
    await expect(page.locator('#sidebar')).toBeVisible();
    await expect(page.locator('.sidebar-header h2')).toHaveText('Pages');
    await expect(page.locator('#search-input')).toBeVisible();
    await expect(page.locator('#search-input')).toHaveAttribute('placeholder', 'Search pages...');
  });

  test('should show the page list with Welcome page', async ({ page }) => {
    const pageList = page.locator('#page-list');
    await expect(pageList).toBeVisible();
    await expect(pageList.locator('.page-item')).toHaveCount(1);
    await expect(pageList.locator('.page-name')).toHaveText('Welcome');
  });

  test('should show editor and preview panes', async ({ page }) => {
    await expect(page.locator('.editor-pane')).toBeVisible();
    await expect(page.locator('.preview-pane')).toBeVisible();
    await expect(page.locator('#editor')).toBeVisible();
    await expect(page.locator('#preview')).toBeVisible();
  });

  test('should display pane headers for Editor and Preview', async ({ page }) => {
    const editorHeader = page.locator('.editor-pane .pane-header span');
    const previewHeader = page.locator('.preview-pane .pane-header span');
    await expect(editorHeader).toHaveText('Editor');
    await expect(previewHeader).toHaveText('Preview');
  });

  test('should show page title input', async ({ page }) => {
    const titleInput = page.locator('#page-title');
    await expect(titleInput).toBeVisible();
    await expect(titleInput).toHaveValue('Welcome');
  });

  test('should have modal overlay attached but hidden', async ({ page }) => {
    const modal = page.locator('#modal-overlay');
    await expect(modal).toBeAttached();
    await expect(modal).not.toHaveClass(/open/);
  });

  test('should have toast element attached', async ({ page }) => {
    await expect(page.locator('#toast')).toBeAttached();
  });

  test('should show sidebar footer with keyboard shortcuts', async ({ page }) => {
    const footer = page.locator('.sidebar-footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('Ctrl');
    await expect(footer).toContainText('New');
    await expect(footer).toContainText('Save');
  });

  test('should load Welcome page content in the editor', async ({ page }) => {
    const editor = page.locator('#editor');
    await expect(editor).toHaveValue(/# Welcome to Markdown Wiki/);
  });
});
