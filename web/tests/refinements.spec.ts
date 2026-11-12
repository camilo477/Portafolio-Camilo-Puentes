import { test, expect, type Page } from '@playwright/test';

const story = (page: Page) => page.locator('#dianimilo');

test('professional introduction and homelab replace desktop decoration in ES/EN', async ({
  page,
}) => {
  for (const [lang, role, intro, homelab] of [
    [
      'es',
      'Desarrollador backend y full stack',
      'Desarrollo aplicaciones empresariales, APIs e integraciones con Python, Django, Java y Spring Boot. Trabajo con bases de datos, automatización y validación de información. También construyo proyectos personales y administro servicios Linux para alojar mis propias aplicaciones.',
      'Este portafolio está alojado en mi Raspberry Pi, junto a Nube Camiska, DianiMilo y Camiska Hub. Nginx sirve el sitio y Cloudflare Tunnel lo conecta con camiska.lat.',
    ],
    [
      'en',
      'Backend and full stack developer',
      'I develop business applications, APIs and system integrations with Python, Django, Java and Spring Boot. My work involves databases, automation and data validation. I also build personal projects and manage Linux services to host my own applications.',
      'This portfolio is hosted on my Raspberry Pi alongside Nube Camiska, DianiMilo and Camiska Hub. Nginx serves the site, and Cloudflare Tunnel makes it available at camiska.lat.',
    ],
  ]) {
    await page.goto(`/${lang}/`);
    await expect(page.locator('.role')).toHaveText(role);
    await expect(page.locator('.intro-text')).toHaveText(intro);
    await expect(page.locator('#homelab-summary')).toHaveText(homelab);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /Camilo Puentes.*Python, Django, Java.*Spring Boot.*Linux/,
    );
    await expect(page.locator('.introduction')).not.toContainText(
      /En mi escritorio|On my desktop|KDE Plasma/,
    );
    await expect(page.locator('.introduction svg, .section-intro')).toHaveCount(
      0,
    );
    await expect(page.locator('main')).not.toContainText(
      /Planes compartidos|Shared plans|Backend, interfaces|Backend, interfaces, data/,
    );
    await expect(page.locator('.intro-links a')).toHaveCount(2);
    const siteBuild = page.getByRole('complementary', {
      name:
        lang === 'es' ? 'Este sitio está hecho con' : 'This site is built with',
    });
    await expect(siteBuild).toBeVisible();
    await expect(siteBuild).toContainText(
      lang === 'es'
        ? 'Astro, TypeScript, HTML, CSS propio y Markdown.'
        : 'Astro, TypeScript, HTML, custom CSS and Markdown.',
    );
    await expect(siteBuild.getByRole('link')).toHaveAttribute(
      'href',
      `/${lang}/${lang === 'es' ? 'proyectos' : 'projects'}/portafolio/`,
    );
  }
});

test('only preferences remain at the top right and anchors stay clear in both themes and languages', async ({
  page,
}) => {
  for (const lang of ['es', 'en']) {
    for (const theme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: theme });
      await page.goto(`/${lang}/`);
      await expect(page.locator('.site-header .main-nav')).toHaveCount(0);
      await expect(page.locator('.preferences a')).toHaveCount(2);
      const controls = (await page.locator('.preferences').boundingBox())!;
      const wrap = (await page.locator('.header-inner').boundingBox())!;
      expect(controls.x + controls.width).toBeCloseTo(wrap.x + wrap.width, 0);
      expect(
        await page.locator('.site-header').evaluate((el) => ({
          background: getComputedStyle(el).backgroundColor,
          border: getComputedStyle(el).borderBottomWidth,
          events: getComputedStyle(el).pointerEvents,
        })),
      ).toEqual({
        background: 'rgba(0, 0, 0, 0)',
        border: '0px',
        events: 'none',
      });
      for (const section of [
        lang === 'es' ? 'Proyectos' : 'Projects',
        lang === 'es' ? 'Tecnologías' : 'Technologies',
      ]) {
        await page
          .locator('.main-nav')
          .getByRole('link', { name: section, exact: true })
          .click();
        const heading = page.locator(
          section === 'Proyectos' || section === 'Projects'
            ? '#projects-heading'
            : '#technologies-heading',
        );
        const header = await page.locator('.site-header').boundingBox();
        const title = await heading.boundingBox();
        expect(header!.y).toBeCloseTo(0, 0);
        expect(title!.y).toBeGreaterThan(header!.height);
        expect(
          await page
            .locator('.preferences')
            .evaluate((el) => getComputedStyle(el).backgroundColor),
        ).toBe(theme === 'dark' ? 'rgb(19, 27, 34)' : 'rgb(242, 240, 233)');
        for (const control of await page
          .locator('.preferences a, .preferences button')
          .all()) {
          expect(
            await control.evaluate((el) => {
              const r = el.getBoundingClientRect();
              const hit = document.elementFromPoint(
                r.x + r.width / 2,
                r.y + r.height / 2,
              );
              return Boolean(hit && el.contains(hit));
            }),
          ).toBe(true);
        }
      }
      await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
      expect((await page.locator('.site-header').boundingBox())!.y).toBeCloseTo(
        0,
        0,
      );
      await page.locator('[data-language="en"]').focus();
      await page.keyboard.press('Tab');
      await expect(page.locator('.theme-toggle')).toBeFocused();
      expect(
        await page
          .locator('.theme-toggle')
          .evaluate((el) => getComputedStyle(el).outlineStyle),
      ).not.toBe('none');
    }
  }
});

test('direct project anchors and narrow or enlarged navigation remain unobscured', async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/es/#dianimilo');
    await expect(story(page).locator('.project-content')).toBeVisible();
    const header = await page.locator('.site-header').boundingBox();
    expect(
      (await story(page).locator('.project-title a').boundingBox())!.y,
    ).toBeGreaterThanOrEqual(header!.height);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  // A larger root font can wrap controls: the scroll offset must follow the real height.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addStyleTag({ content: 'html { font-size: 20px; }' });
  await page
    .locator('.main-nav')
    .getByRole('link', { name: 'Tecnologías', exact: true })
    .click();
  expect(
    (await page.locator('#technologies-heading').boundingBox())!.y,
  ).toBeGreaterThan((await page.locator('.site-header').boundingBox())!.height);
});
