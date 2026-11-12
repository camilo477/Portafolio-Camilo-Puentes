import { test, expect, type Page } from '@playwright/test';

const story = (page: Page) => page.locator('#dianimilo');

test('professional introduction and homelab replace desktop decoration in ES/EN', async ({
  page,
}) => {
  for (const [lang, role, intro, homelab] of [
    [
      'es',
      'Desarrollador backend y full stack',
      'Desarrollo aplicaciones web y APIs con Python, Django, React y PostgreSQL. Trabajo tanto en la lógica y los datos como en las integraciones y el despliegue de servicios en Linux.',
      'Mis proyectos web están alojados en una Raspberry Pi que utilizo como homelab. Allí administro servicios Linux, contenedores Docker y el despliegue de mis aplicaciones.',
    ],
    [
      'en',
      'Backend and full stack developer',
      'I develop web applications and APIs with Python, Django, React and PostgreSQL. My work spans application logic and data, integrations, and deploying services on Linux.',
      'My web projects are hosted on a Raspberry Pi that I use as a homelab. I manage Linux services, Docker containers and application deployments there.',
    ],
  ]) {
    await page.goto(`/${lang}/`);
    await expect(page.locator('.role')).toHaveText(role);
    await expect(page.locator('.intro-text')).toHaveText(intro);
    await expect(page.locator('#homelab-summary')).toHaveText(homelab);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      intro,
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
