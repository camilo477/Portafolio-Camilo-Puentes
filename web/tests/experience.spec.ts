import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const variants = {
  es: {
    anchor: 'experiencia',
    heading: 'Experiencia profesional',
    role: 'Software Developer - Fullstack',
    period: 'Octubre 2025 – Actualidad',
    navigation: 'Experiencia',
  },
  en: {
    anchor: 'experience',
    heading: 'Professional Experience',
    role: 'Software Developer - Fullstack',
    period: 'October 2025 – Present',
    navigation: 'Experience',
  },
} as const;

const command = (page: Page) => page.locator('[data-command]');
const section = (page: Page) => page.locator('.experience');

async function expectAnchorVisible(page: Page) {
  await expect(page.locator('#experience-heading')).toBeInViewport();
  await expect
    .poll(() =>
      section(page).evaluate((element) => {
        const offset = parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            '--header-height',
          ),
        );
        return Math.abs(element.getBoundingClientRect().top - offset - 16);
      }),
    )
    .toBeLessThan(2);
}

for (const lang of ['es', 'en'] as const) {
  const content = variants[lang];
  const path = `/${lang}/#${content.anchor}`;

  test(`${lang}: one approved position, five contributions and professional technologies`, async ({
    page,
  }) => {
    await page.goto(path);
    await expect(section(page).locator('article')).toHaveCount(1);
    await expect(section(page).getByRole('heading', { level: 2 })).toHaveText(
      content.heading,
    );
    await expect(section(page).getByRole('heading', { level: 3 })).toHaveText(
      content.role,
    );
    await expect(page.locator('.experience-company')).toHaveText(
      'ICOMM Solutions',
    );
    await expect(page.locator('.experience-period')).toHaveText(content.period);
    await expect(page.locator('.experience-contributions li')).toHaveCount(5);
    await expect(page.locator('.experience-description')).toHaveCount(1);
    await expect(page.locator('.experience-progression')).toContainText(
      lang === 'es' ? 'contrato indefinido' : 'open-ended employment contract',
    );
    await expect(page.locator('.experience-technologies p')).toHaveText(
      'Python · Django · Java · Spring Boot · React · TypeScript · PostgreSQL · SQL · Git · GitHub Actions',
    );
    await expect(section(page)).not.toContainText(
      /pendiente|por aprobar|borrador|to be confirmed|draft|Oracle|commits?|repositorios|repositories|coautor|coauthor|https?:|\/home\/|\/mnt\//i,
    );
    await expect(section(page).locator('a')).toHaveCount(0);
    await expect(
      page.locator('.area-java [data-technology="spring"]'),
    ).toHaveText('Spring Boot');
    await expect(page.locator('.stack-exploration')).not.toContainText(
      'Spring Boot',
    );
    await expect(page.locator('.area-java')).not.toContainText(
      /learning|aprendizaje/i,
    );
    await expect(page.locator('#homelab')).not.toHaveAttribute('open');
  });

  test(`${lang}: footer keyboard navigation, translated anchors, theme and history`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
    await page.goto(`/${lang}/`);
    const link = page.locator('.footer-nav').getByRole('link', {
      name: content.navigation,
      exact: true,
    });
    await link.focus();
    await expect(link).toBeFocused();
    expect(
      await link.evaluate((element) => getComputedStyle(element).outlineStyle),
    ).not.toBe('none');
    await expect(command(page)).toHaveText('cat ~/experiencia.md');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(path);
    await expectAnchorVisible(page);
    await page.locator('[data-theme-toggle]').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expectAnchorVisible(page);
    const other = lang === 'es' ? 'en' : 'es';
    await page.locator(`[data-language="${other}"]`).click();
    await expect(page).toHaveURL(`/${other}/#${variants[other].anchor}`);
    await expect(section(page).getByRole('heading', { level: 3 })).toHaveText(
      variants[other].role,
    );
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(command(page)).toHaveText('cat ~/experiencia.md');
    await expectAnchorVisible(page);
    await page.goBack();
    await expect(page).toHaveURL(path);
    await expectAnchorVisible(page);
  });

  for (const theme of ['light', 'dark'] as const) {
    test(`${lang} ${theme}: readable responsive layout and accessible experience`, async ({
      page,
      isMobile,
    }) => {
      await page.emulateMedia({ colorScheme: theme });
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      await expectAnchorVisible(page);
      const meta = (await page.locator('.experience-meta').boundingBox())!;
      const body = (await page.locator('.experience-body').boundingBox())!;
      if (isMobile) {
        expect(body.y).toBeGreaterThan(meta.y + meta.height);
        expect(Math.abs(body.x - meta.x)).toBeLessThan(1);
      } else {
        expect(body.x).toBeGreaterThan(meta.x + meta.width);
        expect(Math.abs(body.y - meta.y)).toBeLessThan(1);
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const accessibility = await new AxeBuilder({ page })
        .include('.experience')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(accessibility.violations).toEqual([]);
    });
  }
}

test('wide index includes experience in order and supports keyboard command preview', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'The contextual index uses wide-screen spare margins.');
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/en/');
  const index = page.locator('.context-index');
  await expect(index.locator('.index-number')).toHaveText([
    '01',
    '02',
    '03',
    '04',
    '05',
  ]);
  const experience = index.getByRole('link', {
    name: 'Experience',
    exact: true,
  });
  await expect(experience.locator('.index-number')).toHaveText('03');
  await experience.focus();
  await expect(command(page)).toHaveText('cat ~/experiencia.md');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/en/#experience');
  await expect(experience).toHaveAttribute('aria-current', 'location');
  await expectAnchorVisible(page);
  await page.locator('[data-language="es"]').click();
  await expect(
    index.getByRole('link', { name: 'Experiencia', exact: true }),
  ).toHaveAttribute('aria-current', 'location');
  await expect(page).toHaveURL('/es/#experiencia');
});

test('experience and footer anchors work without JavaScript', async ({
  browser,
  baseURL,
  isMobile,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
    viewport: isMobile
      ? { width: 390, height: 844 }
      : { width: 1920, height: 1080 },
  });
  try {
    const page = await context.newPage();
    for (const lang of ['es', 'en'] as const) {
      await page.goto(`/${lang}/`);
      const content = variants[lang];
      await page
        .locator('.footer-nav')
        .getByRole('link', { name: content.navigation, exact: true })
        .click();
      await expect(page).toHaveURL(`/${lang}/#${content.anchor}`);
      await expect(page.locator('#experience-heading')).toBeInViewport();
      await expect(section(page).getByRole('heading', { level: 3 })).toHaveText(
        content.role,
      );
      await expect(page.locator('.experience-contributions li')).toHaveCount(5);
      await expect(page.locator('#homelab')).not.toHaveAttribute('open');
    }
  } finally {
    await context.close();
  }
});
