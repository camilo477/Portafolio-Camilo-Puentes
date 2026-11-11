import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const command = (page: Page) => page.locator('[data-command]');
const diani = (page: Page) =>
  page.getByRole('link', { name: 'DianiMilo', exact: true });
const nube = (page: Page) =>
  page.getByRole('link', { name: 'Nube Camiska', exact: true });

test.beforeEach(async ({ page }) => {
  await page.goto('/es/');
});

test('static content, visible controls, and project links are available', async ({
  page,
}) => {
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Camilo Puentes.',
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
  await expect(diani(page)).toHaveAttribute('href', '/es/proyectos/dianimilo/');
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
  await diani(page).hover();
  await nube(page).hover();
  await expect(command(page)).toHaveText('cd ~/proyectos/nube-camiska');
  await page.mouse.move(0, 0);
  await expect(command(page)).toHaveText('cd ~');
  await page.waitForTimeout(300);
  await expect(command(page)).toHaveText('cd ~');
});

test('keyboard focus previews and Enter navigates immediately', async ({
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
  await expect(page).toHaveURL('/es/proyectos/dianimilo/');
  await expect(command(page)).toHaveText('cd ~/proyectos/dianimilo');
});

test('blur restores the path without stealing focus', async ({ page }) => {
  await diani(page).focus();
  await expect(command(page)).toHaveText('cd ~/proyectos/dianimilo');
  await page.getByRole('button', { name: /tema/ }).focus();
  await expect(command(page)).toHaveText('cd ~');
  await expect(page.getByRole('button', { name: /tema/ })).toBeFocused();
});

test('click or tap, browser history and translated detail routes work', async ({
  page,
  isMobile,
}) => {
  if (isMobile) await diani(page).tap();
  else await diani(page).click();
  await expect(page).toHaveURL('/es/proyectos/dianimilo/');
  await expect(command(page)).toHaveText('cd ~/proyectos/dianimilo');
  await page.getByRole('link', { name: 'English', exact: true }).click();
  await expect(page).toHaveURL('/en/projects/dianimilo/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('DianiMilo');
  await page.goBack();
  await expect(page).toHaveURL('/es/proyectos/dianimilo/');
  await page.goBack();
  await expect(page).toHaveURL('/es/');
  await expect(command(page)).toHaveText('cd ~');
  await page.goForward();
  await expect(command(page)).toHaveText('cd ~/proyectos/dianimilo');
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
  ).toBe('rgb(25, 29, 31)');
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
    document.querySelector<HTMLAnchorElement>('h3 a')!.focus();
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

test('all pages remain navigable without JavaScript', async ({
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
  await diani(page).click();
  await expect(page).toHaveURL('/es/proyectos/dianimilo/');
  await expect(command(page)).toHaveText('cd ~/proyectos/dianimilo');
  await page.getByRole('link', { name: 'English', exact: true }).click();
  await expect(page).toHaveURL('/en/projects/dianimilo/');
  await page.getByRole('link', { name: 'Back to projects' }).click();
  await expect(page).toHaveURL('/en/#projects');
  await nube(page).click();
  await expect(page).toHaveURL('/en/projects/nube-camiska/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Nube Camiska',
  );
  expect(
    await page
      .locator('body')
      .evaluate((el) => getComputedStyle(el).backgroundColor),
  ).toBe('rgb(25, 29, 31)');
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

test('all six content routes pass automated accessibility checks in both themes', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const lang of ['es', 'en']) {
    const section = lang === 'es' ? 'proyectos' : 'projects';
    for (const path of [
      `/${lang}/`,
      `/${lang}/${section}/dianimilo/`,
      `/${lang}/${section}/nube-camiska/`,
    ]) {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      for (const theme of ['light', 'dark']) {
        await page.evaluate((value) => {
          document.documentElement.dataset.theme = value;
        }, theme);
        const result = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze();
        expect(result.violations, `${path} ${theme}`).toEqual([]);
      }
    }
  }
  expect(errors).toEqual([]);
});
