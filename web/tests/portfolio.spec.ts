import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const command = (page: Page) => page.locator('[data-command]');
// summary is a native disclosure; Playwright does not give it an implicit button role.
const diani = (page: Page) => page.locator('#dianimilo > summary');
const nube = (page: Page) => page.locator('#nube-camiska > summary');
const convertix = (page: Page) => page.locator('#convertix > summary');
const panel = (page: Page, id: string) =>
  page.locator(`details[data-project="${id}"]`);

test.beforeEach(async ({ page }) => {
  await page.goto('/es/');
});

test('static content, visible controls, and three ordered projects are available', async ({
  page,
}) => {
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Camilo Alberto Puentes Valencia',
  );
  await expect(
    page.getByRole('heading', { name: 'Proyectos', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'English', exact: true }),
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
  ]);
  await expect(page.locator('details[open]')).toHaveCount(0);
  for (const id of ['dianimilo', 'nube-camiska', 'convertix']) {
    await expect(page.locator(`[data-media-for="${id}"]`)).toBeVisible();
  }
  await expect(diani(page)).toHaveAccessibleName('DianiMilo');
  await expect(nube(page)).toHaveAccessibleName('Nube Camiska');
  await expect(convertix(page)).toHaveAccessibleName('Convertix');
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

test('keyboard focus previews and Enter or Space toggles inline details', async ({
  page,
}) => {
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Saltar al contenido' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  // Walk the document with Tab, without focusing the project programmatically.
  for (
    let index = 0;
    index < 8 &&
    !(await diani(page).evaluate((el) => el === document.activeElement));
    index++
  ) {
    await page.keyboard.press('Tab');
  }
  await expect(diani(page)).toBeFocused();
  await expect(command(page)).toHaveText('cd ~/proyectos/dianimilo');
  const outline = await diani(page).evaluate(
    (el) => getComputedStyle(el).outlineStyle,
  );
  expect(outline).not.toBe('none');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/es/#dianimilo');
  await expect(panel(page, 'dianimilo')).toHaveAttribute('open', '');
  await expect(diani(page)).toBeFocused();
  await expect(command(page)).toHaveText('cd ~/proyectos/dianimilo');
  await page.keyboard.press('Space');
  await expect(panel(page, 'dianimilo')).not.toHaveAttribute('open');
  await expect(page).toHaveURL('/es/#proyectos');
  await expect(command(page)).toHaveText('ls ~/proyectos');
  await expect(diani(page)).toBeFocused();
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

test('click or tap, browser history and language preserve the expanded project', async ({
  page,
  isMobile,
}) => {
  if (isMobile) await diani(page).tap();
  else await diani(page).click();
  await expect(page).toHaveURL('/es/#dianimilo');
  await expect(panel(page, 'dianimilo')).toHaveAttribute('open', '');
  await expect(command(page)).toHaveText('cd ~/proyectos/dianimilo');
  await page.getByRole('link', { name: 'English', exact: true }).click();
  await expect(page).toHaveURL('/en/#dianimilo');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Camilo Alberto Puentes Valencia',
  );
  await expect(panel(page, 'dianimilo')).toHaveAttribute('open', '');
  await page.goBack();
  await expect(page).toHaveURL('/es/#dianimilo');
  await expect(panel(page, 'dianimilo')).toHaveAttribute('open', '');
  await page.goBack();
  await expect(page).toHaveURL('/es/');
  await expect(page.locator('details[open]')).toHaveCount(0);
  await expect(command(page)).toHaveText('cd ~');
  await page.goForward();
  await expect(command(page)).toHaveText('cd ~/proyectos/dianimilo');
  await expect(panel(page, 'dianimilo')).toHaveAttribute('open', '');
});

test('projects expand in the same document, one at a time, and can be closed', async ({
  page,
}) => {
  const documentRequests: string[] = [];
  page.on('request', (request) => {
    if (request.isNavigationRequest() && request.frame() === page.mainFrame())
      documentRequests.push(request.url());
  });
  await diani(page).click();
  await expect(
    panel(page, 'dianimilo').locator('.project-expanded'),
  ).toBeVisible();
  await nube(page).click();
  await expect(panel(page, 'nube-camiska')).toHaveAttribute('open', '');
  await expect(panel(page, 'dianimilo')).not.toHaveAttribute('open');
  await convertix(page).click();
  await expect(page).toHaveURL('/es/#convertix');
  await expect(
    page
      .locator('[data-media-for="convertix"]')
      .getByText('Capturas y vídeo de uso pendientes.', { exact: true }),
  ).toBeVisible();
  await expect(
    page.locator('.story-convertix .repository-link'),
  ).toHaveAttribute('href', 'https://github.com/camilo477/Converter-files');
  await expect(page.locator('details[open]')).toHaveCount(1);
  await convertix(page).click();
  await expect(page.locator('details[open]')).toHaveCount(0);
  await expect(page).toHaveURL('/es/#proyectos');
  await expect(command(page)).toHaveText('ls ~/proyectos');
  expect(documentRequests).toEqual([]);
});

test('hovering another project restores the expanded project on leave', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Hover is not available on touch devices.');
  await diani(page).click();
  await convertix(page).hover();
  await expect(command(page)).toHaveText('cd ~/proyectos/convertix');
  await page.mouse.move(0, 0);
  await expect(command(page)).toHaveText('cd ~/proyectos/dianimilo');
  await expect(panel(page, 'dianimilo')).toHaveAttribute('open', '');
});

test('old hash links still open the corresponding inline project', async ({
  page,
}) => {
  for (const lang of ['es', 'en']) {
    for (const id of ['dianimilo', 'nube-camiska', 'convertix']) {
      await page.goto(`/${lang}/#${id}`);
      await expect(page).toHaveURL(`/${lang}/#${id}`);
      await expect(panel(page, id)).toHaveAttribute('open', '');
      await expect(command(page)).toHaveText(`cd ~/proyectos/${id}`);
    }
  }
  await page.reload();
  await expect(panel(page, 'convertix')).toHaveAttribute('open', '');
});

test('project section and language switch preserve the active anchor', async ({
  page,
}) => {
  await page.getByRole('link', { name: 'Ver proyectos', exact: true }).click();
  await expect(page).toHaveURL('/es/#proyectos');
  await expect(command(page)).toHaveText('ls ~/proyectos');
  await diani(page).focus();
  await expect(command(page)).toHaveText('cd ~/proyectos/dianimilo');
  await page.getByRole('link', { name: 'English', exact: true }).focus();
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
  await page.getByRole('link', { name: 'English', exact: true }).click();
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
    document.querySelector<HTMLElement>('summary')!.focus();
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

test('all three projects expand and close without JavaScript in both languages', async ({
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
  await page.goto('/es/');
  for (const lang of ['es', 'en']) {
    if (lang === 'en')
      await page.getByRole('link', { name: 'English', exact: true }).click();
    for (const id of ['dianimilo', 'nube-camiska', 'convertix']) {
      await panel(page, id).locator('summary').click();
      await expect(page).toHaveURL(`/${lang}/`);
      await expect(panel(page, id)).toHaveAttribute('open', '');
      await expect(panel(page, id).locator('.project-expanded')).toBeVisible();
      await expect(
        page.locator(`.story-${id} .project-page-link`),
      ).toBeVisible();
      await expect(page.locator('details[open]')).toHaveCount(1);
    }
    await convertix(page).click();
    await expect(page.locator('details[open]')).toHaveCount(0);
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
  await expect(page).toHaveURL('/es/#dianimilo');
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
    await expect(panel(page, 'convertix')).toHaveAttribute('open', '');
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(
      page.getByRole('link', { name: 'English', exact: true }),
    ).toBeVisible();
    await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
    const checkbox = await page
      .getByRole('checkbox', { name: 'Animar comandos' })
      .boundingBox();
    const bar = await page.locator('[data-command-bar]').boundingBox();
    expect(checkbox!.y + checkbox!.height).toBeLessThan(bar!.y);
  }
});

test('collapsed and expanded projects pass accessibility checks in both themes and languages', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const lang of ['es', 'en']) {
    for (const theme of ['light', 'dark']) {
      const response = await page.goto(`/${lang}/`);
      expect(response?.status()).toBe(200);
      await page.evaluate((value) => {
        document.documentElement.dataset.theme = value;
      }, theme);
      for (const id of ['', 'dianimilo', 'nube-camiska', 'convertix']) {
        if (id) await panel(page, id).locator('summary').click();
        const result = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze();
        expect(result.violations, `${lang} ${theme} ${id || 'closed'}`).toEqual(
          [],
        );
      }
    }
  }
  expect(errors).toEqual([]);
});
