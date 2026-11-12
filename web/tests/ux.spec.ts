import { test, expect, type Page } from '@playwright/test';

async function expectBelowHeader(page: Page, selector: string) {
  await expect
    .poll(async () => {
      const target = await page.locator(selector).boundingBox();
      const header = await page.locator('.site-header').boundingBox();
      return target!.y - header!.height;
    })
    .toBeGreaterThanOrEqual(8);
}

test('direct hashes retain the Projects heading, including delayed fonts, language and history', async ({
  page,
}) => {
  await page.route('**/*.woff2', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 350));
    await route.continue();
  });
  for (const lang of ['es', 'en']) {
    for (const width of [320, 390, 820, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${lang}/#dianimilo`);
      await expectBelowHeader(page, '#projects-heading');
      await expectBelowHeader(page, '#dianimilo-title');
      await page.reload();
      await expectBelowHeader(page, '#projects-heading');
      await page.locator('.main-nav a').first().click();
      await expect(page).toHaveURL(`/${lang}/`);
      await expect(page.locator('h1')).toBeInViewport();
      await page.goBack();
      await expectBelowHeader(page, '#projects-heading');
    }
    await page
      .locator(`[data-language="${lang === 'es' ? 'en' : 'es'}"]`)
      .click();
    await expectBelowHeader(page, '#projects-heading');
  }
});

test('header resize corrects an active anchor but does not drag a reader back after scrolling', async ({
  page,
}) => {
  await page.goto('/es/#dianimilo');
  await expectBelowHeader(page, '#projects-heading');
  await page.setViewportSize({ width: 390, height: 900 });
  await page.addStyleTag({ content: 'html {font-size:20px}' });
  await expectBelowHeader(page, '#projects-heading');
  await page.mouse.wheel(0, 800);
  await expect
    .poll(() =>
      page
        .locator('#projects-heading')
        .evaluate((el) => el.getBoundingClientRect().bottom),
    )
    .toBeLessThan(0);
  await page.setViewportSize({ width: 410, height: 900 });
  await page.waitForTimeout(150);
  expect(
    (await page.locator('#projects-heading').boundingBox())!.y,
  ).toBeLessThan(0);
  await page
    .locator('.main-nav')
    .getByRole('link', { name: 'Proyectos', exact: true })
    .click();
  await expectBelowHeader(page, '#projects-heading');
  // Activating an already current anchor is still a useful navigation action.
  await page.mouse.wheel(0, 600);
  await page
    .locator('.main-nav')
    .getByRole('link', { name: 'Proyectos', exact: true })
    .click();
  await expectBelowHeader(page, '#projects-heading');
});

test('native hashes and Homelab navigation also work without JavaScript', async ({
  browser,
  isMobile,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: isMobile ? 320 : 1440, height: 900 },
  });
  const page = await context.newPage();
  for (const lang of ['es', 'en']) {
    await page.goto(`/${lang}/#dianimilo`);
    await expectBelowHeader(page, '#projects-heading');
    for (const id of ['nube-camiska', 'convertix']) {
      await page.goto(`/${lang}/#${id}`);
      await expectBelowHeader(page, `#${id}-title`);
    }
    await page
      .locator('.main-nav')
      .getByRole('link', { name: 'Homelab', exact: true })
      .click();
    await expect(page).toHaveURL(`/${lang}/#homelab`);
    await page.locator('#homelab > summary').click();
    await expect(page.locator('.homelab-diagram')).toBeVisible();
    await page
      .locator(`[data-language="${lang === 'es' ? 'en' : 'es'}"]`)
      .click();
    await expect(page.locator('#homelab-heading')).toHaveText('Homelab');
  }
  await context.close();
});

test('preferences stay compact and footer navigation works with the keyboard on narrow screens', async ({
  page,
}) => {
  for (const lang of ['es', 'en']) {
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(`/${lang}/`);
      expect(
        (await page.locator('.site-header').boundingBox())!.height,
      ).toBeLessThan(80);
      const links = page.locator('.site-footer .main-nav a');
      await expect(page.locator('.site-header .main-nav')).toHaveCount(0);
      await expect(links).toHaveCount(4);
      await expect(links).toHaveText(
        lang === 'es'
          ? ['Inicio', 'Tecnologías', 'Proyectos', 'Homelab']
          : ['Home', 'Technologies', 'Projects', 'Homelab'],
      );
      for (const link of await links.all()) {
        const box = (await link.boundingBox())!;
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(width);
      }
      await links.nth(2).focus();
      await page.keyboard.press('Tab');
      await expect(links.nth(3)).toBeFocused();
      expect(
        await links.nth(3).evaluate((el) => getComputedStyle(el).outlineStyle),
      ).not.toBe('none');
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(`/${lang}/#homelab`);
    }
  }
});

test('public content contains no development notices, empty experience or internal configuration', async ({
  page,
  request,
}) => {
  const banned =
    /Portafolio en construcción|Portfolio in progress|Paleta provisional|Provisional palette|Capturas reales pendientes|Real screenshots pending|Información en preparación|Information in preparation|pendiente de documentar|yet to be documented|will complete its presentation|se añadirá aquí|will be added here/i;
  for (const lang of ['es', 'en']) {
    for (const suffix of [
      '',
      'homelab/',
      ...['dianimilo', 'nube-camiska', 'convertix', 'portafolio'].map(
        (id) => `${lang === 'es' ? 'proyectos' : 'projects'}/${id}/`,
      ),
    ]) {
      await page.goto(`/${lang}/${suffix}`);
      await expect(page.locator('body')).not.toContainText(banned);
      await expect(
        page.locator(
          '.experience, .media-placeholder, .palette-note, #contribution-heading',
        ),
      ).toHaveCount(0);
      await expect(page.locator('#media-heading')).toHaveCount(
        Number(/\/(dianimilo|convertix)\/$/.test(suffix)),
      );
      const text = await page.locator('body').innerText();
      expect(text).not.toMatch(
        /\b(?:10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[01])\.\d+\.\d+)\b|\/api\/internal|\/home\/|\/mnt\/|SECURITY_TOKEN|HUB_PASSWORD/,
      );
    }
  }
  expect(
    (await request.get('/docs/borradores/EXPERIENCIA_PROFESIONAL.md')).status(),
  ).toBe(404);
  await page.goto('/es/#experiencia');
  await expect(page.locator('[data-command]')).toHaveText('cd ~');
  await expect(page.locator('[data-language="en"]')).toHaveAttribute(
    'href',
    '/en/',
  );
});

test('Homelab documents components and recovery limits with revision-pinned sources', async ({
  page,
}) => {
  for (const lang of ['es', 'en']) {
    await page.goto(`/${lang}/#homelab`);
    await expect(page.locator('.diagram-services strong')).toHaveText([
      'Nube Camiska',
      'DianiMilo',
      'Camiska Hub',
    ]);
    await expect(page.locator('.diagram-host')).toContainText('Docker');
    await expect(page.locator('.diagram-access')).toContainText(
      'Cloudflare Tunnel',
    );
    await expect(page.locator('.diagram-connector')).toContainText(
      'cloudflared',
    );
    await expect(page.locator('.diagram-nginx')).toContainText('Nginx');
    await expect(page.locator('.homelab-operation li')).toHaveCount(3);
    await expect(page.locator('.operation-scope')).toContainText(
      lang === 'es'
        ? 'no una prueba de recuperación'
        : 'not a recovery exercise',
    );
    for (const link of await page.locator('.case-sources a').all()) {
      expect(await link.getAttribute('href')).toMatch(
        /^https:\/\/github.com\/camilo477\/[\w-]+\/blob\/[a-f0-9]{40}\//,
      );
    }
    await page.locator('.homelab-service a').first().click();
    await expect(page).toHaveURL(
      `/${lang}/${lang === 'es' ? 'proyectos' : 'projects'}/nube-camiska/`,
    );
  }
});

test('secondary categories are compact, exclusive and preserve non-link technology labels', async ({
  page,
}) => {
  await page.goto('/es/#tecnologias');
  await page.locator('.stack-inventory > summary').click();
  const categories = page.locator('.stack-category');
  await expect(categories).toHaveCount(8);
  await expect(page.locator('.stack-category[open]')).toHaveCount(0);
  expect(
    (await page.locator('.inventory-grid').boundingBox())!.height,
  ).toBeLessThan(560);
  const positions = () =>
    categories.evaluateAll((nodes) =>
      Object.fromEntries(
        nodes.map((node) => {
          const rect = node.getBoundingClientRect();
          const grid = node.closest('.inventory-grid')!.getBoundingClientRect();
          return [
            node.getAttribute('data-technology-group')!,
            { height: rect.height, top: rect.top - grid.top },
          ];
        }),
      ),
    );
  const before = await positions();
  const linux = page.locator('[data-technology-group="linux"]');
  await linux.locator('summary').click();
  const expanded = await positions();
  expect(expanded.linux.height).toBeGreaterThan(before.linux.height + 20);
  expect(expanded.databases.height).toBeCloseTo(before.databases.height, 1);
  await expect(
    page.locator('[data-technology-group="databases"]'),
  ).not.toHaveAttribute('open');
  if (page.viewportSize()!.width > 700) {
    // Expanding Linux must not create a gap or move the other column's categories.
    for (const id of ['data', 'ai', 'games', 'engineering'])
      expect(expanded[id].top).toBeCloseTo(before[id].top, 1);
  }
  await linux.locator('summary').click();
  for (const category of await categories.all()) {
    await category.locator('summary').click();
    await expect(category).toHaveAttribute('open', '');
    await expect(page.locator('.stack-category[open]')).toHaveCount(1);
    await expect(category.locator('[data-technology]').first()).toBeVisible();
  }
  const ids = await page
    .locator('.stack-inventory [data-technology]')
    .evaluateAll((nodes) =>
      nodes.map((node) => node.getAttribute('data-technology')),
    );
  expect(new Set(ids).size).toBe(ids.length);
  await expect(
    page.locator('.technologies a, .technology-name[tabindex]'),
  ).toHaveCount(0);
});
