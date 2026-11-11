import { test } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

test('capture real desktop and mobile pages in both themes and languages', async ({
  browser,
}) => {
  const output = resolve('../docs/capturas');
  await mkdir(output, { recursive: true });
  for (const [device, viewport] of Object.entries({
    desktop: { width: 1440, height: 1000 },
    mobile: { width: 390, height: 844 },
  })) {
    for (const theme of ['light', 'dark'] as const) {
      const context = await browser.newContext({
        viewport,
        colorScheme: theme,
        isMobile: device === 'mobile',
        hasTouch: device === 'mobile',
        reducedMotion: 'reduce',
      });
      const page = await context.newPage();
      for (const lang of ['es', 'en']) {
        await page.goto(`/${lang}/`);
        await page.evaluate(() => document.fonts.ready);
        await page.screenshot({
          path: resolve(output, `${device}-${theme}-${lang}.png`),
          fullPage: false,
        });
        await page
          .getByRole('link', {
            name: lang === 'es' ? 'Ver proyectos' : 'View projects',
            exact: true,
          })
          .click();
        await page.screenshot({
          path: resolve(output, `${device}-${theme}-${lang}-projects.png`),
          fullPage: false,
        });
      }
      await page.goto('/es/proyectos/dianimilo/');
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({
        path: resolve(output, `dianimilo-${device}-${theme}.png`),
        fullPage: false,
      });
      await context.close();
    }
  }
});
