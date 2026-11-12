import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

test('capture real desktop and mobile pages in both themes and languages', async ({
  browser,
}) => {
  test.setTimeout(90_000);
  const output = resolve('../docs/capturas');
  await mkdir(output, { recursive: true });
  for (const [device, viewport] of Object.entries({
    wide: { width: 1920, height: 1080 },
    desktop: { width: 1440, height: 1000 },
    laptop: { width: 1280, height: 900 },
    tablet: { width: 820, height: 1180 },
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
        if (device === 'wide') {
          await page.locator('.professional-rail a').first().focus();
          await page.screenshot({
            path: resolve(output, `professional-tooltip-${theme}-${lang}.png`),
          });
          await page.keyboard.press('Escape');
        }
        await page.locator('.professional-footer').scrollIntoViewIfNeeded();
        await page.screenshot({
          path: resolve(
            output,
            `professional-footer-${device}-${theme}-${lang}.png`,
          ),
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
        await page.goto(
          `/${lang}/#${lang === 'es' ? 'tecnologias' : 'technologies'}`,
        );
        await page.evaluate(() => document.fonts.ready);
        await page
          .locator('.technologies')
          .evaluate((el) => el.scrollIntoView({ block: 'start' }));
        await page.screenshot({
          path: resolve(output, `technologies-${device}-${theme}-${lang}.png`),
          fullPage: false,
        });
        await page.locator('.stack-inventory > summary').click();
        await page
          .locator('.inventory-grid')
          .evaluate((el) => el.scrollIntoView({ block: 'start' }));
        await page.mouse.move(0, 0);
        await page.screenshot({
          path: resolve(
            output,
            `technologies-expanded-${device}-${theme}-${lang}.png`,
          ),
          fullPage: false,
        });
      }
      for (const project of [
        'dianimilo',
        'nube-camiska',
        'convertix',
        'portafolio',
      ]) {
        await page.goto(`/es/#${project}`);
        await expect(
          page.locator(`details[data-project="${project}"]`),
        ).toHaveAttribute('open', '');
        await page.evaluate(() => document.fonts.ready);
        // Capture actual hash navigation, without manually repairing its scroll position.
        await expect
          .poll(
            async () =>
              (await page
                .locator(
                  project === 'dianimilo'
                    ? '#projects-heading'
                    : `#${project}-title`,
                )
                .boundingBox())!.y -
              (await page.evaluate(() =>
                parseFloat(
                  getComputedStyle(document.documentElement).getPropertyValue(
                    '--header-height',
                  ),
                ),
              )),
          )
          .toBeGreaterThan(0);
        await page.screenshot({
          path: resolve(output, `${project}-${device}-${theme}.png`),
          fullPage: false,
        });
      }
      for (const lang of ['es', 'en']) {
        for (const project of [
          'dianimilo',
          'nube-camiska',
          'convertix',
          'portafolio',
        ]) {
          await page.goto(
            `/${lang}/${lang === 'es' ? 'proyectos' : 'projects'}/${project}/`,
          );
          await page.evaluate(() => document.fonts.ready);
          await page.screenshot({
            path: resolve(
              output,
              `case-${project}-${device}-${theme}-${lang}.png`,
            ),
            fullPage: true,
          });
          await page.screenshot({
            path: resolve(
              output,
              `case-${project}-${device}-${theme}-${lang}-viewport.png`,
            ),
            fullPage: false,
          });
        }
        await page.goto(`/${lang}/#homelab`);
        await expect(page.locator('#homelab')).toHaveAttribute('open', '');
        await page.evaluate(() => document.fonts.ready);
        // Record the real navigation viewport before full-page capture can resize
        // Chromium's mobile viewport and affect its scroll anchoring.
        await expect
          .poll(async () => {
            const summary = (await page
              .locator('#homelab > summary')
              .boundingBox())!;
            const top = await page.evaluate(() =>
              parseFloat(
                getComputedStyle(document.documentElement).getPropertyValue(
                  '--header-height',
                ),
              ),
            );
            return summary.y - top;
          })
          .toBeGreaterThanOrEqual(8);
        await expect(page.locator('#homelab-heading')).toBeInViewport();
        await page.screenshot({
          path: resolve(
            output,
            `homelab-${device}-${theme}-${lang}-viewport.png`,
          ),
          fullPage: false,
        });
        await page.screenshot({
          path: resolve(output, `homelab-${device}-${theme}-${lang}.png`),
          fullPage: true,
        });
        await page
          .locator('.homelab-architecture')
          .evaluate((el) => el.scrollIntoView({ block: 'start' }));
        await page.screenshot({
          path: resolve(
            output,
            `homelab-diagram-${device}-${theme}-${lang}.png`,
          ),
          fullPage: false,
        });
      }
      await context.close();
    }
  }
});
