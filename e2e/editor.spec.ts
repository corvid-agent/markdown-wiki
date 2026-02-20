import { test, expect } from '@playwright/test';

test.describe('Editor and Preview', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to start fresh, then reload
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should type markdown and see live preview', async ({ page }) => {
    const editor = page.locator('#editor');
    await editor.fill('# Hello World');
    await expect(page.locator('#preview h1')).toHaveText('Hello World');
  });

  test('should render bold text with double asterisks', async ({ page }) => {
    const editor = page.locator('#editor');
    await editor.fill('**bold text**');
    const strong = page.locator('#preview strong');
    await expect(strong).toHaveText('bold text');
  });

  test('should render italic text with single asterisks', async ({ page }) => {
    const editor = page.locator('#editor');
    await editor.fill('*italic text*');
    const em = page.locator('#preview em');
    await expect(em).toHaveText('italic text');
  });

  test('should render inline code with backticks', async ({ page }) => {
    const editor = page.locator('#editor');
    await editor.fill('some `inline code` here');
    const code = page.locator('#preview code');
    await expect(code).toHaveText('inline code');
  });

  test('should render headings at multiple levels', async ({ page }) => {
    const editor = page.locator('#editor');
    await editor.fill('# H1\n\n## H2\n\n### H3');
    await expect(page.locator('#preview h1')).toHaveText('H1');
    await expect(page.locator('#preview h2')).toHaveText('H2');
    await expect(page.locator('#preview h3')).toHaveText('H3');
  });

  test('should render unordered lists', async ({ page }) => {
    const editor = page.locator('#editor');
    await editor.fill('- Item A\n- Item B\n- Item C');
    const items = page.locator('#preview ul li');
    await expect(items).toHaveCount(3);
    await expect(items.nth(0)).toHaveText('Item A');
    await expect(items.nth(1)).toHaveText('Item B');
    await expect(items.nth(2)).toHaveText('Item C');
  });

  test('should render ordered lists', async ({ page }) => {
    const editor = page.locator('#editor');
    await editor.fill('1. First\n2. Second\n3. Third');
    const items = page.locator('#preview ol li');
    await expect(items).toHaveCount(3);
    await expect(items.nth(0)).toHaveText('First');
  });

  test('should render blockquotes', async ({ page }) => {
    const editor = page.locator('#editor');
    await editor.fill('> This is a quote');
    const bq = page.locator('#preview blockquote');
    await expect(bq).toBeVisible();
    await expect(bq).toContainText('This is a quote');
  });

  test('should render horizontal rules', async ({ page }) => {
    const editor = page.locator('#editor');
    await editor.fill('above\n\n---\n\nbelow');
    await expect(page.locator('#preview hr')).toBeVisible();
  });

  test('should render links', async ({ page }) => {
    const editor = page.locator('#editor');
    await editor.fill('[Example](https://example.com)');
    const link = page.locator('#preview a[href="https://example.com"]');
    await expect(link).toHaveText('Example');
    await expect(link).toHaveAttribute('target', '_blank');
  });

  test('should render wiki links with correct class', async ({ page }) => {
    const editor = page.locator('#editor');
    await editor.fill('Link to [[Welcome]]');
    const wikiLink = page.locator('#preview a.wiki-link');
    await expect(wikiLink).toHaveText('Welcome');
    await expect(wikiLink).toHaveAttribute('data-wiki', 'Welcome');
  });

  test('should mark missing wiki links with missing class', async ({ page }) => {
    const editor = page.locator('#editor');
    await editor.fill('Link to [[Nonexistent Page]]');
    const missingLink = page.locator('#preview a.wiki-link.missing');
    await expect(missingLink).toHaveText('Nonexistent Page');
  });

  test('should render strikethrough text', async ({ page }) => {
    const editor = page.locator('#editor');
    await editor.fill('~~deleted~~');
    const del = page.locator('#preview del');
    await expect(del).toHaveText('deleted');
  });

  test('should update preview in real-time on input', async ({ page }) => {
    const editor = page.locator('#editor');
    await editor.fill('# Step 1');
    await expect(page.locator('#preview h1')).toHaveText('Step 1');

    await editor.fill('# Step 2');
    await expect(page.locator('#preview h1')).toHaveText('Step 2');
  });

  test('should render code blocks', async ({ page }) => {
    const editor = page.locator('#editor');
    await editor.fill('```js\nconsole.log("hi");\n```');
    const pre = page.locator('#preview pre');
    await expect(pre).toBeVisible();
    await expect(pre.locator('code')).toContainText('console.log("hi");');
  });
});

test.describe('Page Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should save a page and show toast', async ({ page }) => {
    await page.locator('#btn-save').click();
    const toast = page.locator('#toast');
    await expect(toast).toHaveClass(/show/);
    await expect(toast).toHaveText('Page saved');
  });

  test('should search and filter pages', async ({ page }) => {
    const searchInput = page.locator('#search-input');
    await searchInput.fill('Welcome');
    await expect(page.locator('#page-list .page-item')).toHaveCount(1);

    await searchInput.fill('zzz_nonexistent');
    await expect(page.locator('#page-list .page-item')).toHaveCount(0);
  });

  test('should open new page modal with Ctrl+N', async ({ page }) => {
    await page.keyboard.press('Control+n');
    const modal = page.locator('#modal-overlay');
    await expect(modal).toHaveClass(/open/);
    await expect(page.locator('#modal-title')).toHaveText('New Page');
    await expect(page.locator('#modal-confirm')).toHaveText('Create');
  });

  test('should create a new page via modal', async ({ page }) => {
    await page.keyboard.press('Control+n');
    await page.locator('#modal-input').fill('Test Page');
    await page.locator('#modal-confirm').click();

    // Modal should close
    await expect(page.locator('#modal-overlay')).not.toHaveClass(/open/);

    // New page should appear in sidebar
    await expect(page.locator('#page-list .page-name', { hasText: 'Test Page' })).toBeVisible();

    // Title should update
    await expect(page.locator('#page-title')).toHaveValue('Test Page');
  });

  test('should close modal with Cancel button', async ({ page }) => {
    await page.keyboard.press('Control+n');
    await expect(page.locator('#modal-overlay')).toHaveClass(/open/);
    await page.locator('#modal-cancel').click();
    await expect(page.locator('#modal-overlay')).not.toHaveClass(/open/);
  });

  test('should close modal with Escape key', async ({ page }) => {
    await page.keyboard.press('Control+n');
    await expect(page.locator('#modal-overlay')).toHaveClass(/open/);
    await page.keyboard.press('Escape');
    await expect(page.locator('#modal-overlay')).not.toHaveClass(/open/);
  });

  test('should switch between pages', async ({ page }) => {
    // Create a second page
    await page.keyboard.press('Control+n');
    await page.locator('#modal-input').fill('Second Page');
    await page.locator('#modal-confirm').click();

    // Should be on Second Page now
    await expect(page.locator('#page-title')).toHaveValue('Second Page');

    // Click Welcome in sidebar to switch back
    await page.locator('#page-list .page-name', { hasText: 'Welcome' }).click();
    await expect(page.locator('#page-title')).toHaveValue('Welcome');
    await expect(page.locator('#editor')).toHaveValue(/# Welcome to Markdown Wiki/);
  });
});
