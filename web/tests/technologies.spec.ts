import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const command = (page: Page) => page.locator('[data-command]');
const group = (page: Page, id: string) =>
  page.locator(`[data-technology-group="${id}"]`);
const tech = (page: Page, id: string) =>
  page.locator(`[data-technology="${id}"]`).first();
const stackCommand = 'cat ~/skills/stack.yaml';

test('full name, page title and technology navigation are translated', async ({
  page,
}) => {
  for (const [lang, title, anchor, label] of [
    ['es', 'Portafolio Camilo Puentes', 'tecnologias', 'Tecnologías'],
    ['en', 'Camilo Puentes Portfolio', 'technologies', 'Technologies'],
  ]) {
    await page.goto(`/${lang}/`);
    await expect(page).toHaveTitle(title);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Camilo Alberto Puentes Valencia',
    );
    await page
      .locator('.main-nav')
      .getByRole('link', { name: label, exact: true })
      .click();
    await expect(page).toHaveURL(`/${lang}/#${anchor}`);
    await expect(command(page)).toHaveText(stackCommand);
    await expect(page.locator('.main-nav [aria-current]')).toHaveText(label);
    await expect(page.locator('[data-command-bar]')).toHaveCount(1);
  }
});

test('inventory includes supplied additions with names only and no proficiency claims', async ({
  page,
}) => {
  await page.goto('/es/#tecnologias');
  for (const summary of await page.locator('.stack-category > summary').all())
    await summary.click();
  for (const id of [
    'dart',
    'flask',
    'nest',
    'maven',
    'flutter',
    'axios',
    'mysql',
    'firebase',
    'fabric',
    'azure',
    'aws',
    'databricks',
    'qwen',
    'piper',
    'paper',
    'soap',
    'grpc',
    'authentication',
  ]) {
    await expect(tech(page, id)).toBeVisible();
    await expect(tech(page, id)).toHaveAttribute('href', /^https:\/\//);
  }
  await expect(page.locator('[data-technology-group]')).toHaveCount(8);
  await expect(page.locator('.technologies')).not.toContainText(
    /experiencia que conozco|conocimientos básicos|experto|aprendizaje|formación|\d+%/i,
  );
  await expect(
    page.locator('.technologies [role="progressbar"], .technology-projects'),
  ).toHaveCount(0);
});

test('hover cancels rapid technology previews and returns to the active section', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Touch does not depend on hover.');
  await page.goto('/es/#tecnologias');
  await tech(page, 'python').hover();
  await expect(command(page)).toHaveText('python3 --version');
  await tech(page, 'java').hover();
  await tech(page, 'bash').hover();
  await tech(page, 'python').hover();
  await expect(command(page)).toHaveText('python3 --version');
  await page.mouse.move(0, 0);
  await expect(command(page)).toHaveText(stackCommand);
  await page.waitForTimeout(250);
  await expect(command(page)).toHaveText(stackCommand);
  await expect(page).toHaveURL('/es/#tecnologias');
});

test('keyboard opens categories, previews technology focus and keeps normal links', async ({
  page,
}) => {
  await page.goto('/es/#tecnologias');
  const summary = group(page, 'databases').locator('summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(group(page, 'databases')).toHaveAttribute('open', '');
  await page.keyboard.press('Tab');
  await expect(tech(page, 'postgresql')).toBeFocused();
  await expect(command(page)).toHaveText('psql --version');
  expect(
    await tech(page, 'postgresql').evaluate(
      (el) => getComputedStyle(el).outlineStyle,
    ),
  ).not.toBe('none');
  // Fulfil locally: prove Enter follows the link without depending on an external site.
  await page.route('https://www.postgresql.org/docs/', (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: '<h1>Documentation destination</h1>',
    }),
  );
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('https://www.postgresql.org/docs/');
  await page.goBack();
  await expect(page).toHaveURL('/es/#tecnologias');
  await expect(command(page)).toHaveText(stackCommand);
});

test('section language and history survive leaving an expanded project', async ({
  page,
}) => {
  await page.goto('/es/#dianimilo');
  await expect(page.locator('#dianimilo')).toHaveAttribute('open', '');
  await page
    .locator('.main-nav')
    .getByRole('link', { name: 'Tecnologías', exact: true })
    .click();
  await expect(page).toHaveURL('/es/#tecnologias');
  await expect(page.locator('#dianimilo')).not.toHaveAttribute('open');
  await page.waitForTimeout(200);
  await expect(command(page)).toHaveText(stackCommand);
  await page.getByRole('link', { name: 'English', exact: true }).click();
  await expect(page).toHaveURL('/en/#technologies');
  await expect(command(page)).toHaveText(stackCommand);
  await page.goBack();
  await expect(page).toHaveURL('/es/#tecnologias');
  await page.goBack();
  await expect(page).toHaveURL('/es/#dianimilo');
  await expect(page.locator('#dianimilo')).toHaveAttribute('open', '');
  await page.goForward();
  await expect(page).toHaveURL('/es/#tecnologias');
  await expect(command(page)).toHaveText(stackCommand);
});

test('native categories work with touch and without JavaScript', async ({
  browser,
  isMobile,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    isMobile,
    hasTouch: isMobile,
  });
  const page = await context.newPage();
  for (const lang of ['es', 'en']) {
    await page.goto(
      `/${lang}/#${lang === 'es' ? 'tecnologias' : 'technologies'}`,
    );
    await expect(tech(page, 'python')).toBeVisible();
    for (const id of [
      'frameworks',
      'databases',
      'linux',
      'data',
      'ai',
      'games',
      'engineering',
    ]) {
      const summary = group(page, id).locator('summary');
      if (isMobile) await summary.tap();
      else await summary.click();
      await expect(group(page, id)).toHaveAttribute('open', '');
      await expect(group(page, id).getByRole('link').first()).toBeVisible();
      await summary.click();
      await expect(group(page, id)).not.toHaveAttribute('open');
    }
  }
  await context.close();
});

test('reduced motion, touch pointers and blur never leave partial commands', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/es/#tecnologias');
  await tech(page, 'python').dispatchEvent('pointerenter', {
    pointerType: 'touch',
  });
  await page.waitForTimeout(220);
  await expect(command(page)).toHaveText(stackCommand);
  const values = await page.evaluate(async () => {
    const output = document.querySelector('[data-command]')!;
    const recorded: string[] = [];
    const observer = new MutationObserver(() =>
      recorded.push(output.textContent ?? ''),
    );
    observer.observe(output, { childList: true });
    document.querySelector<HTMLElement>('[data-technology="python"]')!.focus();
    await new Promise((resolve) => setTimeout(resolve, 240));
    observer.disconnect();
    return recorded;
  });
  expect(values.length).toBeGreaterThan(0);
  expect(values.every((value) => value === 'python3 --version')).toBe(true);
  await page.getByRole('button', { name: /tema/ }).focus();
  await expect(command(page)).toHaveText(stackCommand);
});

test('full name and expanded technologies fit narrow screens without covering controls', async ({
  page,
}) => {
  for (const lang of ['es', 'en']) {
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(`/${lang}/`);
      for (const summary of await page
        .locator('.stack-category > summary')
        .all())
        await summary.click();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const link = group(page, 'engineering').getByRole('link').last();
      await link.focus();
      const rect = await link.boundingBox();
      const bar = await page.locator('[data-command-bar]').boundingBox();
      expect(rect!.y).toBeGreaterThanOrEqual(0);
      expect(rect!.y + rect!.height).toBeLessThanOrEqual(bar!.y);
    }
  }
});

test('all expanded categories pass accessibility checks in both themes and languages', async ({
  page,
}) => {
  test.setTimeout(60000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const lang of ['es', 'en']) {
    for (const theme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: theme });
      await page.goto(
        `/${lang}/#${lang === 'es' ? 'tecnologias' : 'technologies'}`,
      );
      for (const summary of await page
        .locator('.stack-category > summary')
        .all())
        await summary.click();
      const result = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(result.violations, `${lang} ${theme}`).toEqual([]);
    }
  }
  expect(errors).toEqual([]);
});
