import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const email = 'camilopuentes.av@gmail.com';
const linkedin = 'https://www.linkedin.com/in/camilo-puentes-6671a6262/';
const index = (page: Page) => page.locator('.context-index');
const rail = (page: Page) => page.locator('.professional-rail');
const active = (page: Page) => index(page).locator('[aria-current="location"]');
const command = (page: Page) => page.locator('[data-command]');
const topOffset = (page: Page) =>
  page.evaluate(() =>
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        '--header-height',
      ),
    ),
  );

async function wide(page: Page, path = '/en/') {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(path);
  await page.evaluate(() => document.fonts.ready);
}

test('English is the default even without JavaScript; explicit Spanish remains available', async ({
  page,
  browser,
}) => {
  await page.goto('/');
  await expect(page).toHaveURL('/en/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await page.locator('[data-language="es"]').click();
  await expect(page).toHaveURL('/es/');
  const context = await browser.newContext({
    javaScriptEnabled: false,
    locale: 'es-CO',
  });
  const native = await context.newPage();
  await native.goto('/');
  await expect(native).toHaveURL('/en/');
  await context.close();
});

test('sidebars use spare margins, disappear on smaller screens and keep the reading width', async ({
  page,
}) => {
  for (const width of [2560, 1920, 1600, 1536, 1440, 1280, 820, 390, 320]) {
    await page.setViewportSize({ width, height: 1080 });
    await page.goto('/en/');
    if (width >= 1600) {
      await expect(rail(page)).toBeVisible();
      await expect(index(page)).toBeVisible();
      const main = (await page.locator('main').boundingBox())!;
      const left = (await rail(page).boundingBox())!;
      const right = (await index(page).boundingBox())!;
      const preferences = (await page.locator('.preferences').boundingBox())!;
      expect(left.x + left.width).toBeLessThan(main.x);
      expect(right.x).toBeGreaterThan(main.x + main.width);
      expect(preferences.x).toBeGreaterThan(main.x + main.width);
      expect(preferences.y + preferences.height).toBeLessThan(right.y);
      expect(right.y - preferences.y - preferences.height).toBeLessThanOrEqual(
        24,
      );
      expect(main.width).toBe(1120);
    } else {
      await expect(rail(page)).toBeHidden();
      await expect(index(page)).toBeHidden();
      await expect(page.locator('.preferences')).toBeVisible();
    }
    await expect(page.locator('[data-theme-toggle]')).toHaveCount(1);
    await expect(page.locator('[data-language]')).toHaveCount(2);
    await expect(
      page.locator('.professional-footer a[href^="mailto:"]'),
    ).toHaveAttribute('href', `mailto:${email}`);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await wide(page);
  await page.addStyleTag({ content: 'html { font-size: 32px; }' });
  await expect(rail(page)).toBeHidden();
  await expect(index(page)).toBeHidden();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.setViewportSize({ width: 960, height: 540 });
  await expect(
    page.locator('.professional-footer a[href^="mailto:"]'),
  ).toBeVisible();
});

test('professional links have real destinations, accessible tooltips and Linux previews', async ({
  page,
  isMobile,
}) => {
  await wide(page, '/es/#dianimilo');
  const github = rail(page).getByRole('link', { name: /^GitHub,/ });
  const linkedInLink = rail(page).getByRole('link', { name: /^LinkedIn,/ });
  const mail = rail(page).getByRole('link', { name: 'Correo', exact: true });
  await expect(github).toHaveAttribute('href', 'https://github.com/camilo477');
  await expect(linkedInLink).toHaveAttribute('href', linkedin);
  await expect(mail).toHaveAttribute('href', `mailto:${email}`);
  await expect(page.locator('.professional-links a[href$=".pdf"]')).toHaveCount(
    0,
  );
  await expect(
    page.locator('[data-preview-command="xdg-open ~/cv.pdf"]'),
  ).toHaveCount(0);
  await github.focus();
  await expect(page.locator('#rail-github-tip')).toBeVisible();
  await expect(command(page)).toHaveText(
    'xdg-open https://github.com/camilo477',
  );
  expect(
    await github.evaluate((el) => getComputedStyle(el).outlineStyle),
  ).not.toBe('none');
  await page.keyboard.press('Escape');
  await expect(page.locator('#rail-github-tip')).toBeHidden();
  await page.keyboard.press('Tab');
  await expect(linkedInLink).toBeFocused();
  await expect(page.locator('#rail-linkedin-tip')).toBeVisible();
  await expect(command(page)).toHaveText(`xdg-open ${linkedin}`);
  await page.keyboard.press('Tab');
  await expect(mail).toBeFocused();
  await expect(page.locator('#rail-email-tip')).toBeVisible();
  await expect(command(page)).toHaveText(`xdg-email ${email}`);
  await page.locator('[data-theme-toggle]').focus();
  await expect(command(page)).toHaveText('cd ~/proyectos/dianimilo');
  if (!isMobile) {
    await github.hover();
    await mail.hover();
    await github.hover();
    await page.mouse.move(0, 0);
    await expect(command(page)).toHaveText('cd ~/proyectos/dianimilo');
  }
});

test('professional profiles open in a new tab and keep the portfolio in place', async ({
  page,
  context,
  isMobile,
}) => {
  // Check browser behavior without depending on live third-party websites.
  await context.route(
    /^https:\/\/(github\.com|www\.linkedin\.com)\//,
    (route) =>
      route.fulfill({
        contentType: 'text/html',
        body: '<title>Profile</title>',
      }),
  );
  if (!isMobile) await page.setViewportSize({ width: 1920, height: 1080 });
  for (const lang of ['es', 'en']) {
    await page.goto(`/${lang}/`);
    const links = page.locator(
      `${isMobile ? '.professional-footer' : '.professional-rail'} a[href^="https:"], .intro-links a[href^="https:"]`,
    );
    await expect(links).toHaveCount(3);
    for (const link of await links.all()) {
      const destination = (await link.getAttribute('href'))!;
      const popupPromise = page.waitForEvent('popup');
      await link.click();
      const popup = await popupPromise;
      await expect(popup).toHaveURL(destination);
      expect(await popup.evaluate(() => window.opener === null)).toBe(true);
      await expect(page).toHaveURL(`/${lang}/`);
      await popup.close();
    }
    await expect(page.locator('a[href^="mailto:"][target]')).toHaveCount(0);
  }
});

test('copy writes the public email, announces success and handles denied or absent clipboard access', async ({
  page,
  context,
  browser,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await wide(page);
  await rail(page)
    .getByRole('button', { name: 'Copy email', exact: true })
    .click();
  await expect(rail(page).getByRole('status')).toHaveText(
    'Email address copied.',
  );
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(email);
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: () =>
          Promise.reject(new DOMException('Denied', 'NotAllowedError')),
      },
    });
  });
  await page.reload();
  await rail(page)
    .getByRole('button', { name: 'Copy email', exact: true })
    .click();
  await expect(rail(page).getByRole('status')).toContainText('Could not copy');
  await expect(
    rail(page).getByRole('button', { name: 'Copy email', exact: true }),
  ).toBeEnabled();
  const unavailableContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });
  await unavailableContext.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: undefined,
    });
  });
  const unavailable = await unavailableContext.newPage();
  await unavailable.goto('/en/');
  await expect(unavailable.locator('[data-copy-email]:visible')).toHaveCount(0);
  await expect(unavailable.locator('.professional-footer')).toContainText(
    email,
  );
  await unavailableContext.close();
});

test('reading updates the index without changing the URL or adding history entries', async ({
  page,
}) => {
  await wide(page);
  const originalHistory = await page.evaluate(() => history.length);
  await expect(active(page)).toHaveAttribute('data-index-target', 'home');
  expect(
    await index(page)
      .locator('a')
      .evaluateAll((links) =>
        links.map((link) => link.getAttribute('data-index-target')),
      ),
  ).toEqual(['home', 'technologies', 'projects', 'homelab']);
  expect(
    await page
      .locator('main > section')
      .evaluateAll((sections) =>
        sections.map((section) => section.getAttribute('aria-labelledby')),
      ),
  ).toEqual(['intro-heading', 'technologies-heading', 'projects-heading']);
  for (const id of ['technologies', 'projects', 'home']) {
    await page
      .locator(`#${id}`)
      .evaluate((el) => el.scrollIntoView({ block: 'start' }));
    await expect(active(page)).toHaveAttribute('data-index-target', id);
    await expect(page).toHaveURL('/en/');
    expect(await page.evaluate(() => history.length)).toBe(originalHistory);
  }
  await expect(index(page).locator('a[href*="experience"]')).toHaveCount(0);
  await expect(index(page).locator('a').last()).toHaveAttribute(
    'data-index-target',
    'homelab',
  );
  await page.locator('.site-footer').scrollIntoViewIfNeeded();
  await expect(active(page)).toHaveAttribute('data-index-target', 'homelab');
  await expect(page.locator('#homelab')).not.toHaveAttribute('open');
  await expect(page).toHaveURL('/en/');
  expect(await page.evaluate(() => history.length)).toBe(originalHistory);
});

test('index activation respects motion preferences, history, Homelab expansion and sticky offsets', async ({
  page,
}) => {
  await wide(page);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.evaluate(() => {
    const native = HTMLElement.prototype.scrollIntoView;
    HTMLElement.prototype.scrollIntoView = function (options) {
      document.body.dataset.lastScrollBehavior =
        typeof options === 'object' ? options.behavior : '';
      native.call(this, options);
    };
  });
  await index(page)
    .getByRole('link', { name: 'Technologies', exact: true })
    .click();
  await expect(page).toHaveURL('/en/#technologies');
  await expect(page.locator('body')).toHaveAttribute(
    'data-last-scroll-behavior',
    'smooth',
  );
  await expect
    .poll(() =>
      page.locator('#technologies').evaluate((section) => {
        const top =
          parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue(
              '--header-height',
            ),
          ) + 16;
        // A final section can only align as far as the remaining document permits.
        const alignment = Math.abs(section.getBoundingClientRect().top - top);
        const endOfPage = Math.abs(
          document.documentElement.scrollHeight - innerHeight - scrollY,
        );
        return Math.min(alignment, endOfPage);
      }),
    )
    .toBeLessThan(2);
  await expect(page.locator('#technologies-heading')).toBeInViewport();
  await expect(active(page)).toHaveAttribute(
    'data-index-target',
    'technologies',
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const homelab = index(page).getByRole('link', {
    name: 'Homelab',
    exact: true,
  });
  await homelab.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/en/#homelab');
  await expect(page.locator('#homelab')).toHaveAttribute('open', '');
  await expect(page.locator('#homelab-heading')).toBeInViewport();
  await expect(page.locator('body')).toHaveAttribute(
    'data-last-scroll-behavior',
    'instant',
  );
  await expect(active(page)).toHaveAttribute('data-index-target', 'homelab');
  await page.locator('[data-language="es"]').click();
  await expect(page).toHaveURL('/es/#homelab');
  await expect(index(page)).toContainText('Tecnologías');
  await page.goBack();
  await page.goBack();
  await expect(page).toHaveURL('/en/#technologies');
  await expect(page.locator('#homelab')).not.toHaveAttribute('open');
  await expect(active(page)).toHaveAttribute(
    'data-index-target',
    'technologies',
  );
});

test('case indices contain only rendered headings and preserve translated section anchors', async ({
  page,
}) => {
  for (const id of ['dianimilo', 'nube-camiska', 'convertix', 'portafolio']) {
    await wide(page, `/en/projects/${id}/`);
    const targets = await index(page)
      .locator('a')
      .evaluateAll((links) =>
        links.map((link) => link.getAttribute('data-index-target')!),
      );
    expect(targets).toContain('problem-heading');
    expect(targets.includes('media-heading')).toBe(
      ['dianimilo', 'nube-camiska', 'convertix'].includes(id),
    );
    expect(targets).not.toContain('contribution-heading');
    for (const target of targets)
      await expect(page.locator(`#${target}`)).toHaveCount(1);
    await index(page)
      .locator('[data-index-target="architecture-heading"]')
      .click();
    await expect(page.locator('#architecture-heading')).toBeInViewport();
    await expect(active(page)).toHaveAttribute(
      'data-index-target',
      'architecture-heading',
    );
    await page.locator('[data-language="es"]').click();
    await expect(page).toHaveURL(`/es/proyectos/${id}/#architecture-heading`);
    await expect(page.locator('#architecture-heading')).toBeInViewport();
    const historyLength = await page.evaluate(() => history.length);
    await page.mouse.wheel(0, -5000);
    await expect(active(page)).toHaveAttribute('data-index-target', 'overview');
    expect(await page.evaluate(() => history.length)).toBe(historyLength);
  }
});

test('native sidebar links still navigate without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1920, height: 1080 },
  });
  const page = await context.newPage();
  await page.goto('/en/');
  await expect(rail(page)).toBeVisible();
  await index(page)
    .getByRole('link', { name: 'Projects', exact: true })
    .click();
  await expect(page).toHaveURL('/en/#projects');
  expect(
    (await page.locator('#projects-heading').boundingBox())!.y,
  ).toBeGreaterThan(await topOffset(page));
  await expect(page.locator('[data-copy-email]:visible')).toHaveCount(0);
  await page.goto('/en/projects/dianimilo/');
  await index(page).locator('[data-index-target="problem-heading"]').click();
  await expect(page.locator('#problem-heading')).toBeInViewport();
  await context.close();
});

test('sidebars, tooltips and copy feedback pass axe in both themes and languages', async ({
  page,
  context,
}) => {
  test.setTimeout(90_000);
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  for (const lang of ['es', 'en']) {
    for (const theme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: theme });
      await wide(page, `/${lang}/#homelab`);
      await rail(page)
        .getByRole('link', { name: /^GitHub,/ })
        .focus();
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
            .analyze()
        ).violations,
      ).toEqual([]);
      await rail(page).locator('[data-copy-email]').click();
      await expect(rail(page).getByRole('status')).not.toBeEmpty();
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
            .analyze()
        ).violations,
      ).toEqual([]);
    }
  }
});
