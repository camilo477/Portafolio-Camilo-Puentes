import { test, expect } from '@playwright/test';

test('Homelab expands in the same document and closes with focus restored', async ({
  page,
  isMobile,
}) => {
  for (const lang of ['es', 'en']) {
    await page.goto(`/${lang}/`);
    await page.evaluate(() => {
      document.body.dataset.sameDocument = 'yes';
    });
    const panel = page.locator('#homelab');
    const summary = panel.locator(':scope > summary');
    await expect(panel).not.toHaveAttribute('open');
    if (isMobile) await summary.tap();
    else {
      await summary.focus();
      await page.keyboard.press('Enter');
    }
    await expect(panel).toHaveAttribute('open', '');
    await expect(page.locator('#homelab-heading')).toBeInViewport();
    await expect(page).toHaveURL(`/${lang}/#homelab`);
    await expect(page.locator('body')).toHaveAttribute(
      'data-same-document',
      'yes',
    );
    await expect(page.locator('.homelab-diagram')).toBeVisible();
    await expect(page.locator('[data-command]')).toHaveText('cd ~/homelab');
    await page.locator('[data-homelab-close]').click();
    await expect(panel).not.toHaveAttribute('open');
    await expect(summary).toBeFocused();
    await expect(summary).toBeInViewport();
    await expect(page).toHaveURL(`/${lang}/`);
    await page.goBack();
    await expect(panel).toHaveAttribute('open', '');
    await page.goForward();
    await expect(panel).not.toHaveAttribute('open');
  }
});

test('hash, language, theme, reload and project navigation preserve the correct expanded content', async ({
  page,
}) => {
  for (const lang of ['es', 'en']) {
    await page.goto(`/${lang}/#homelab`);
    await expect(page.locator('#homelab')).toHaveAttribute('open', '');
    await expect
      .poll(
        async () =>
          (await page.locator('#homelab > summary').boundingBox())!.y -
          (await page.locator('.site-header').boundingBox())!.height,
      )
      .toBeGreaterThanOrEqual(8);
    await page.locator('[data-theme-toggle]').click();
    const theme = await page.locator('html').getAttribute('data-theme');
    const other = lang === 'es' ? 'en' : 'es';
    await page.locator(`[data-language="${other}"]`).click();
    await expect(page).toHaveURL(`/${other}/#homelab`);
    await expect(page.locator('#homelab')).toHaveAttribute('open', '');
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme!);
    await page.reload();
    await expect(page.locator('#homelab')).toHaveAttribute('open', '');
    await expect(page.locator('#homelab-heading')).toBeInViewport();
    await page.locator('.main-nav a').nth(1).click();
    await expect(page.locator('#homelab')).not.toHaveAttribute('open');
    await expect
      .poll(
        async () =>
          (await page.locator('#projects-heading').boundingBox())!.y -
          (await page.locator('.site-header').boundingBox())!.height,
      )
      .toBeGreaterThanOrEqual(8);
    await page.locator('#dianimilo > summary').click();
    await expect(page).toHaveURL(`/${other}/#dianimilo`);
    await page
      .locator('.main-nav')
      .getByRole('link', { name: 'Homelab', exact: true })
      .click();
    await expect(page.locator('#homelab')).toHaveAttribute('open', '');
    await expect(page.locator('#dianimilo')).not.toHaveAttribute('open');
    await page.goBack();
    await expect(page.locator('#homelab')).not.toHaveAttribute('open');
    await expect(page.locator('#dianimilo')).toHaveAttribute('open', '');
  }
});

test('native disclosure works without JavaScript and old URLs resolve to the home block', async ({
  browser,
  isMobile,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: isMobile ? 320 : 1440, height: 900 },
  });
  const page = await context.newPage();
  for (const lang of ['es', 'en']) {
    await page.goto(`/${lang}/homelab/`);
    await expect(page).toHaveURL(`/${lang}/#homelab`);
    const summary = page.locator('#homelab > summary');
    await summary.focus();
    await page.keyboard.press('Space');
    await expect(page.locator('.homelab-diagram')).toBeVisible();
    await expect(page.locator('[data-homelab-close]')).toBeHidden();
    await page.keyboard.press('Enter');
    await expect(page.locator('#homelab')).not.toHaveAttribute('open');
    await expect(page.locator('h1')).toContainText('Camilo Alberto');
  }
  await context.close();
});

test('Homelab command previews restore, reduced motion is immediate and opening does not overflow', async ({
  page,
  isMobile,
}) => {
  await page.goto('/es/');
  const summary = page.locator('#homelab > summary');
  await summary.focus();
  await expect(page.locator('[data-command]')).toHaveText('cd ~/homelab');
  await page.locator('[data-theme-toggle]').focus();
  await expect(page.locator('[data-command]')).toHaveText('cd ~');
  if (!isMobile) {
    await summary.hover();
    await expect(page.locator('[data-command]')).toHaveText('cd ~/homelab');
    await page.mouse.move(0, 0);
    await expect(page.locator('[data-command]')).toHaveText('cd ~');
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [320, 390, 820, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/es/#homelab');
    await expect(page.locator('#homelab')).toHaveAttribute('open', '');
    await expect(page.locator('[data-command]')).toHaveText('cd ~/homelab');
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(page.locator('.diagram-access')).toContainText(
      'Cloudflare Tunnel',
    );
    await expect(page.locator('.diagram-services strong')).toHaveCount(3);
  }
});
