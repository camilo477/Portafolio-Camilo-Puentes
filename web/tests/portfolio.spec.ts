import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const command = (page: Page) => page.locator('[data-command]');
const diani = (page: Page) => page.locator('#dianimilo .project-title a');
const nube = (page: Page) => page.locator('#nube-camiska .project-title a');
const convertix = (page: Page) => page.locator('#convertix .project-title a');
const panel = (page: Page, id: string) =>
  page.locator(`article[data-project="${id}"]`);

test.beforeEach(async ({ page }) => {
  await page.goto('/es/');
});

test('static content, visible controls, and four ordered projects are available', async ({
  page,
}) => {
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Camilo Alberto Puentes Valencia',
  );
  await expect(
    page.getByRole('heading', { name: 'Proyectos', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'EN — English', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: /tema/ })).toBeVisible();
  await expect(command(page)).toHaveText('cd ~');
  await expect(page.locator('[data-command-bar]')).toHaveAttribute(
    'aria-hidden',
    'true',
  );
  await expect(
    page
      .locator('.site-header')
      .getByRole('link', { name: 'Camilo Puentes', exact: true }),
  ).toHaveCount(0);
  await expect(page.locator('.project-title')).toHaveText([
    'DianiMilo',
    'Nube Camiska',
    'Convertix',
    'Portafolio Camilo Puentes',
  ]);
  for (const content of await page.locator('.project-content').all())
    await expect(content).toBeVisible();
  await expect(
    page.locator('.project-story details, .project-toggle'),
  ).toHaveCount(0);
  await expect(page.locator('.media-placeholder')).toHaveCount(0);
  await expect(diani(page)).toHaveAccessibleName('DianiMilo');
  await expect(nube(page)).toHaveAccessibleName('Nube Camiska');
  await expect(convertix(page)).toHaveAccessibleName('Convertix');
  await expect(
    panel(page, 'portafolio').locator('.project-title a'),
  ).toHaveAccessibleName('Portafolio Camilo Puentes');
});

test('portfolio overview preserves its translated hash and opens GitHub separately', async ({
  page,
  isMobile,
}) => {
  const summary = panel(page, 'portafolio').locator('.project-title a');
  if (!isMobile) {
    await summary.hover();
    await expect(command(page)).toHaveText('cd ~/proyectos/portafolio');
    await page.mouse.move(0, 0);
    await expect(command(page)).toHaveText('cd ~');
  }
  await summary.focus();
  await expect(command(page)).toHaveText('cd ~/proyectos/portafolio');
  await page.goto('/es/#portafolio');
  await expect(page).toHaveURL('/es/#portafolio');
  await expect(
    panel(page, 'portafolio').locator('.project-content'),
  ).toBeVisible();
  await expect(panel(page, 'portafolio').locator('.prose')).toContainText(
    'Astro',
  );
  await page.locator('[data-language="en"]').click();
  await expect(page).toHaveURL('/en/#portafolio');
  await expect(
    panel(page, 'portafolio').locator('.project-content'),
  ).toBeVisible();
  await expect(
    panel(page, 'portafolio').locator('.project-title a'),
  ).toHaveAccessibleName('Camilo Puentes Portfolio');
  await page.goBack();
  await expect(page).toHaveURL('/es/#portafolio');
  await expect(
    panel(page, 'portafolio').locator('.project-content'),
  ).toBeVisible();
  const repository = page.locator('.story-portafolio .repository-link');
  const repoUrl = 'https://github.com/camilo477/Portafolio-Camilo-Puentes';
  await expect(repository).toHaveAttribute('href', repoUrl);
  await expect(repository).toHaveAttribute('target', '_blank');
  await expect(repository).toHaveAttribute('rel', 'noopener noreferrer');
  await page.context().route(repoUrl, (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: '<title>Repository navigation test</title>',
    }),
  );
  const popupPromise = page.waitForEvent('popup');
  await repository.click();
  const popup = await popupPromise;
  await expect(popup).toHaveURL(repoUrl);
  expect(await popup.evaluate(() => window.opener === null)).toBe(true);
  await expect(page).toHaveURL('/es/#portafolio');
  await popup.close();
});

test('hover previews, cancels rapid changes, and restores the active path', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Touch navigation is tested separately.');
  await diani(page).hover();
  await expect(command(page)).toHaveText('cd ~/proyectos/dianimilo');
  await expect(page).toHaveURL('/es/');
  await nube(page).hover();
  await convertix(page).hover();
  await nube(page).hover();
  await diani(page).hover();
  await nube(page).hover();
  await expect(command(page)).toHaveText('cd ~/proyectos/nube-camiska');
  await page.mouse.move(0, 0);
  await expect(command(page)).toHaveText('cd ~');
  await page.waitForTimeout(300);
  await expect(command(page)).toHaveText('cd ~');
});

test('keyboard focus previews and Enter follows the project title link', async ({
  page,
}) => {
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Saltar al contenido' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  for (
    let index = 0;
    index < 8 &&
    !(await diani(page).evaluate((el) => el === document.activeElement));
    index++
  )
    await page.keyboard.press('Tab');
  await expect(diani(page)).toBeFocused();
  await expect(command(page)).toHaveText('cd ~/proyectos/dianimilo');
  expect(
    await diani(page).evaluate((el) => getComputedStyle(el).outlineStyle),
  ).not.toBe('none');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/es/proyectos/dianimilo/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('DianiMilo');
  await page.goBack();
  await expect(
    panel(page, 'dianimilo').locator('.project-content'),
  ).toBeVisible();
});

test('blur restores the path without stealing focus', async ({ page }) => {
  await diani(page).focus();
  // Layout/scroll hit-testing must not replace keyboard focus with a stale hover.
  await nube(page).dispatchEvent('pointerenter', { pointerType: 'mouse' });
  await expect(command(page)).toHaveText('cd ~/proyectos/dianimilo');
  await page.getByRole('button', { name: /tema/ }).focus();
  await expect(command(page)).toHaveText('cd ~');
  await expect(page.getByRole('button', { name: /tema/ })).toBeFocused();
});

test('project titles navigate with click or touch and preserve language and history', async ({
  page,
  isMobile,
}) => {
  if (isMobile) await diani(page).tap();
  else await diani(page).click();
  await expect(page).toHaveURL('/es/proyectos/dianimilo/');
  await expect(command(page)).toHaveText('cd ~/proyectos/dianimilo');
  await page.getByRole('link', { name: 'EN — English', exact: true }).click();
  await expect(page).toHaveURL('/en/projects/dianimilo/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('DianiMilo');
  await page.goBack();
  await expect(page).toHaveURL('/es/proyectos/dianimilo/');
  await page.goBack();
  await expect(page).toHaveURL('/es/');
  for (const content of await page.locator('.project-content').all())
    await expect(content).toBeVisible();
  await page.goForward();
  await expect(page).toHaveURL('/es/proyectos/dianimilo/');
  await expect(command(page)).toHaveText('cd ~/proyectos/dianimilo');
});

test('project content stays visible when following section anchors and browser history', async ({
  page,
}) => {
  await page.goto('/es/#dianimilo');
  await page
    .locator('.main-nav')
    .getByRole('link', { name: 'Tecnologías', exact: true })
    .click();
  await expect(page).toHaveURL('/es/#tecnologias');
  for (const content of await page.locator('.project-content').all())
    await expect(content).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL('/es/#dianimilo');
  await expect(command(page)).toHaveText('cd ~/proyectos/dianimilo');
  await expect(page.locator('.project-list')).not.toContainText(
    /Ampliar resumen|Cerrar resumen|Expand overview|Close overview/,
  );
  await expect(
    page.locator('.project-story summary, .project-story [aria-expanded]'),
  ).toHaveCount(0);
});

test('hovering another project restores the active anchor on leave', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Hover is not available on touch devices.');
  await page.goto('/es/#dianimilo');
  await convertix(page).hover();
  await expect(command(page)).toHaveText('cd ~/proyectos/convertix');
  await page.mouse.move(0, 0);
  await expect(command(page)).toHaveText('cd ~/proyectos/dianimilo');
  await expect(
    panel(page, 'dianimilo').locator('.project-content'),
  ).toBeVisible();
});

test('direct project hashes retain visible content and the current command', async ({
  page,
}) => {
  for (const lang of ['es', 'en']) {
    for (const id of ['dianimilo', 'nube-camiska', 'convertix', 'portafolio']) {
      await page.goto(`/${lang}/#${id}`);
      await expect(page).toHaveURL(`/${lang}/#${id}`);
      await expect(panel(page, id).locator('.project-content')).toBeVisible();
      await expect(command(page)).toHaveText(`cd ~/proyectos/${id}`);
    }
  }
  await page.reload();
  await expect(
    panel(page, 'portafolio').locator('.project-content'),
  ).toBeVisible();
});

test('project section and language switch preserve the active anchor', async ({
  page,
}) => {
  await page.getByRole('link', { name: 'Ver proyectos', exact: true }).click();
  await expect(page).toHaveURL('/es/#proyectos');
  await expect(command(page)).toHaveText('ls ~/proyectos');
  await diani(page).focus();
  await expect(command(page)).toHaveText('cd ~/proyectos/dianimilo');
  await page.getByRole('link', { name: 'EN — English', exact: true }).focus();
  await expect(command(page)).toHaveText('ls ~/proyectos');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/en/#projects');
  await expect(command(page)).toHaveText('ls ~/proyectos');
});

test('theme follows the system and the explicit choice survives navigation and reload', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(
    page.getByRole('button', { name: 'Activar tema claro' }),
  ).toBeVisible();
  expect(
    await page
      .locator('body')
      .evaluate((el) => getComputedStyle(el).backgroundColor),
  ).toBe('rgb(19, 27, 34)');
  await page.getByRole('button', { name: 'Activar tema claro' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.getByRole('link', { name: 'EN — English', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('reduced motion writes only the complete command', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
  const frames = await page.evaluate(async () => {
    const output = document.querySelector('[data-command]')!;
    const values: string[] = [];
    const observer = new MutationObserver(() =>
      values.push(output.textContent ?? ''),
    );
    observer.observe(output, { childList: true });
    document.querySelector<HTMLElement>('#dianimilo .project-title a')!.focus();
    await new Promise((resolve) => setTimeout(resolve, 280));
    observer.disconnect();
    return values;
  });
  expect(frames.length).toBeGreaterThan(0);
  expect(frames.every((value) => value === 'cd ~/proyectos/dianimilo')).toBe(
    true,
  );
  await expect(
    page.getByRole('checkbox', { name: 'Animar comandos' }),
  ).toBeDisabled();
});

test('optional motion preference persists and cancels typing', async ({
  page,
}) => {
  await page.getByRole('checkbox', { name: 'Animar comandos' }).uncheck();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
  await diani(page).focus();
  await expect(command(page)).toHaveText('cd ~/proyectos/dianimilo');
  await page.reload();
  await expect(
    page.getByRole('checkbox', { name: 'Animar comandos' }),
  ).not.toBeChecked();
});

test('all project descriptions and title links work without JavaScript in both languages', async ({
  browser,
  isMobile,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    colorScheme: 'dark',
    viewport: isMobile
      ? { width: 390, height: 844 }
      : { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  for (const lang of ['es', 'en']) {
    await page.goto(`/${lang}/`);
    await expect(page.locator('.project-content')).toHaveCount(4);
    for (const id of ['dianimilo', 'nube-camiska', 'convertix', 'portafolio']) {
      await expect(panel(page, id).locator('.project-content')).toBeVisible();
      const link = panel(page, id).locator('.project-title a');
      await link.click();
      await expect(page).toHaveURL(
        `/${lang}/${lang === 'es' ? 'proyectos' : 'projects'}/${id}/`,
      );
      await page.goBack();
      await expect(panel(page, id).locator('.project-content')).toBeVisible();
    }
  }
  expect(
    await page
      .locator('body')
      .evaluate((el) => getComputedStyle(el).backgroundColor),
  ).toBe('rgb(19, 27, 34)');
  await context.close();
});

test('blocked storage does not break preferences or navigation', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('Blocked', 'SecurityError');
      },
    });
  });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.reload();
  await page.getByRole('button', { name: /tema/ }).click();
  await diani(page).click();
  await expect(page).toHaveURL('/es/proyectos/dianimilo/');
  expect(errors).toEqual([]);
});

test('touch pointer cannot start a hover preview', async ({ page }) => {
  await diani(page).dispatchEvent('pointerenter', { pointerType: 'touch' });
  await page.waitForTimeout(250);
  await expect(command(page)).toHaveText('cd ~');
});

test('narrow layouts and the bottom bar leave controls unobscured', async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/es/#convertix');
    await expect(
      panel(page, 'convertix').locator('.project-content'),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(
      page.getByRole('link', { name: 'EN — English', exact: true }),
    ).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    // User input releases the initial hash alignment before scrolling to the footer.
    await page.locator('#main').focus();
    await page.keyboard.press('End');
    await expect
      .poll(() =>
        page.evaluate(() =>
          Math.abs(
            document.documentElement.scrollHeight - innerHeight - scrollY,
          ),
        ),
      )
      .toBeLessThanOrEqual(1);
    const checkbox = await page
      .getByRole('checkbox', { name: 'Animar comandos' })
      .boundingBox();
    const bar = await page.locator('[data-command-bar]').boundingBox();
    expect(checkbox!.y + checkbox!.height).toBeLessThan(bar!.y);
  }
});

test('all project descriptions pass accessibility checks in both themes and languages', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const lang of ['es', 'en']) {
    for (const theme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: theme });
      expect((await page.goto(`/${lang}/`))?.status()).toBe(200);
      for (const content of await page.locator('.project-content').all())
        await expect(content).toBeVisible();
      const result = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(result.violations, `${lang} ${theme}`).toEqual([]);
    }
  }
  expect(errors).toEqual([]);
});
