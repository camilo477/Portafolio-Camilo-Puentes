import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const command = (page: Page) => page.locator('[data-command]');
const group = (page: Page, id: string) =>
  page.locator(`[data-technology-group="${id}"]`);
const tech = (page: Page, id: string) =>
  page.locator(`[data-technology="${id}"]`).first();
const stackCommand = 'cat ~/skills/stack.yaml';
async function revealTechnology(page: Page, id: string) {
  const category = page
    .locator('.stack-category')
    .filter({ has: page.locator(`[data-technology="${id}"]`) });
  if (
    (await category.count()) &&
    (await category.getAttribute('open')) === null
  )
    await category.locator('summary').click();
}

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
    await expect(page.locator('.main-nav [aria-current]')).toHaveAccessibleName(
      label,
    );
    await expect(page.locator('[data-command-bar]')).toHaveCount(1);
  }
});

test('inventory includes supplied additions without invented proficiency ratings', async ({
  page,
}) => {
  await page.goto('/es/#tecnologias');
  await page.locator('.stack-inventory > summary').click();
  for (const id of [
    'dart',
    'flask',
    'nest',
    'maven',
    'flutter',
    'axios',
    'mysql',
    'firebase',
    'qwen',
    'piper',
    'paper',
    'soap',
    'grpc',
    'authentication',
  ]) {
    await revealTechnology(page, id);
    await expect(tech(page, id)).toBeVisible();
    await expect(tech(page, id)).not.toHaveAttribute('href');
  }
  await expect(page.locator('[data-technology-group]')).toHaveCount(8);
  await expect(page.locator('.technologies')).not.toContainText(
    /experiencia que conozco|conocimientos básicos|experto|\d+%/i,
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
  await tech(page, 'typescript').hover();
  await tech(page, 'python').hover();
  await expect(command(page)).toHaveText('python3 --version');
  await page.mouse.move(0, 0);
  await expect(command(page)).toHaveText(stackCommand);
  await page.waitForTimeout(250);
  await expect(command(page)).toHaveText(stackCommand);
  await expect(page).toHaveURL('/es/#tecnologias');
});

test('keyboard opens the inventory and skips non-interactive technology names', async ({
  page,
}) => {
  await page.goto('/es/#tecnologias');
  const summary = page.locator('.stack-inventory > summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.stack-inventory')).toHaveAttribute('open', '');
  await expect(summary).toBeFocused();
  expect(
    await summary.evaluate((el) => getComputedStyle(el).outlineStyle),
  ).not.toBe('none');
  await expect(
    page.locator(
      '.technologies a, .technologies [tabindex], .technologies button',
    ),
  ).toHaveCount(0);
  await page.keyboard.press('Tab');
  const firstCategory = page.locator('.stack-category').first();
  await expect(firstCategory.locator('summary')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(firstCategory).toHaveAttribute('open', '');
  await page.keyboard.press('Tab');
  await expect(
    page.locator('.stack-category').nth(1).locator('summary'),
  ).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Space');
  await expect(firstCategory).not.toHaveAttribute('open');
  await page.keyboard.press('Shift+Tab');
  await expect(summary).toBeFocused();
  await page.keyboard.press('Space');
  await expect(page.locator('.stack-inventory')).not.toHaveAttribute('open');
  await expect(page).toHaveURL('/es/#tecnologias');
});

test('section language and history preserve the project anchor and visible text', async ({
  page,
}) => {
  await page.goto('/es/#dianimilo');
  await expect(page.locator('#dianimilo .project-content')).toBeVisible();
  await page
    .locator('.main-nav')
    .getByRole('link', { name: 'Tecnologías', exact: true })
    .click();
  await expect(page).toHaveURL('/es/#tecnologias');
  await expect(page.locator('#dianimilo .project-content')).toBeVisible();
  await page.waitForTimeout(200);
  await expect(command(page)).toHaveText(stackCommand);
  await page.getByRole('link', { name: 'English', exact: true }).click();
  await expect(page).toHaveURL('/en/#technologies');
  await expect(command(page)).toHaveText(stackCommand);
  await page.goBack();
  await expect(page).toHaveURL('/es/#tecnologias');
  await page.goBack();
  await expect(page).toHaveURL('/es/#dianimilo');
  await expect(page.locator('#dianimilo .project-content')).toBeVisible();
  await page.goForward();
  await expect(page).toHaveURL('/es/#tecnologias');
  await expect(command(page)).toHaveText(stackCommand);
});

test('complete inventory works with touch and without JavaScript', async ({
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
    const summary = page.locator('.stack-inventory > summary');
    if (isMobile) await summary.tap();
    else await summary.click();
    await expect(page.locator('.stack-inventory')).toHaveAttribute('open', '');
    for (const id of [
      'languages',
      'frameworks',
      'databases',
      'linux',
      'data',
      'ai',
      'games',
      'engineering',
    ]) {
      await group(page, id).locator('summary').click();
      await expect(
        group(page, id).locator('[data-technology]').first(),
      ).toBeVisible();
    }
    await summary.click();
    await expect(page.locator('.stack-inventory')).not.toHaveAttribute('open');
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
  await page.locator('#dianimilo .project-title a').focus();
  await expect(command(page)).toHaveText('cd ~/proyectos/dianimilo');
  const values = await page.evaluate(async () => {
    const output = document.querySelector('[data-command]')!;
    const recorded: string[] = [];
    const observer = new MutationObserver(() =>
      recorded.push(output.textContent ?? ''),
    );
    observer.observe(output, { childList: true });
    document.querySelector<HTMLElement>('.stack-inventory > summary')!.focus();
    await new Promise((resolve) => setTimeout(resolve, 240));
    observer.disconnect();
    return recorded;
  });
  expect(values.length).toBeGreaterThan(0);
  expect(values.every((value) => value === stackCommand)).toBe(true);
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
      await page.locator('.stack-inventory > summary').click();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await group(page, 'engineering').locator('summary').click();
      const item = group(page, 'engineering')
        .locator('[data-technology]')
        .last();
      await item.evaluate((el) => el.scrollIntoView({ block: 'center' }));
      const rect = await item.boundingBox();
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
      if (
        (await page.locator('.stack-inventory').getAttribute('open')) === null
      )
        await page.locator('.stack-inventory > summary').click();
      await expect(page.locator('.stack-inventory')).toHaveAttribute(
        'open',
        '',
      );
      for (const category of await page.locator('.stack-category').all()) {
        if ((await category.getAttribute('open')) === null)
          await category.locator('summary').click();
        await expect(
          category.locator('[data-technology]').first(),
        ).toBeVisible();
        const result = await new AxeBuilder({ page })
          .include('.technologies')
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze();
        expect(result.violations, `${lang} ${theme}`).toEqual([]);
      }
    }
  }
  expect(errors).toEqual([]);
});

test('main areas are visible while declared exploration stays separate', async ({
  page,
}) => {
  await page.goto('/es/#tecnologias');
  await expect(page.locator('.stack-inventory')).not.toHaveAttribute('open');
  for (const id of [
    'python',
    'django',
    'drf',
    'javascript',
    'typescript',
    'react',
    'java',
    'spring',
    'sql',
    'postgresql',
    'oracle',
    'fedora',
    'docker',
  ]) {
    await expect(
      page.locator(`.main-stack [data-technology="${id}"]`),
    ).toBeVisible();
  }
  await expect(page.locator('.area-java .learning-label')).toHaveCount(0);
  await expect(page.locator('.stack-exploration [data-technology]')).toHaveText(
    ['Lua'],
  );
  await expect(
    page.locator('.stack-exploration [data-technology="python"]'),
  ).toHaveCount(0);
});

test('technology names never navigate and removed tools are absent in both languages', async ({
  page,
}) => {
  for (const lang of ['es', 'en']) {
    await page.goto(
      `/${lang}/#${lang === 'es' ? 'tecnologias' : 'technologies'}`,
    );
    const url = page.url();
    await tech(page, 'python').click();
    await tech(page, 'django').click();
    await expect(page).toHaveURL(url);
    await page.locator('.stack-inventory > summary').click();
    await expect(page.locator('.technologies a')).toHaveCount(0);
    await expect(page.locator('.technologies')).not.toContainText(
      /openpyxl|Streamlit|Microsoft Fabric|Azure Data Services|AWS Data Services|Databricks/i,
    );
    for (const id of [
      'openpyxl',
      'streamlit',
      'fabric',
      'azure',
      'aws',
      'databricks',
    ])
      await expect(page.locator(`[data-technology="${id}"]`)).toHaveCount(0);
    expect(
      await tech(page, 'python').evaluate((el) => {
        const style = getComputedStyle(el);
        return {
          tag: el.tagName,
          cursor: style.cursor,
          underline: style.textDecorationLine,
        };
      }),
    ).toEqual({ tag: 'SPAN', cursor: 'text', underline: 'none' });
  }
});
