import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const projects = [
  {
    id: 'dianimilo',
    title: 'DianiMilo',
    repo: 'watchlist-plans-goals-pwa',
    demo: 'https://diamilo.camiska.lat/?demo=1#/',
  },
  {
    id: 'nube-camiska',
    title: 'Nube Camiska',
    repo: 'nube-camiska',
    demo: 'https://nube.camiska.lat/',
  },
  { id: 'convertix', title: 'Convertix', repo: 'Converter-files', demo: null },
  {
    id: 'portafolio',
    title: 'Portafolio Camilo Puentes',
    titleEn: 'Camilo Puentes Portfolio',
    repo: 'Portafolio-Camilo-Puentes',
    demo: null,
  },
];
const projectVideos = [
  {
    id: 'nube-camiska',
    file: 'navigation-tour',
    duration: 45,
    captions: 11,
    title: {
      en: "A tour of Nube Camiska's files",
      es: 'Recorrido por los archivos de Nube Camiska',
    },
  },
  {
    id: 'convertix',
    file: 'desktop-demo',
    duration: 44,
    captions: 12,
    title: {
      en: 'From JPG to PNG and PDF on KDE',
      es: 'De JPG a PNG y PDF en KDE',
    },
  },
  {
    id: 'dianimilo',
    file: 'navigation-tour',
    duration: 40.833333,
    captions: 7,
    title: {
      en: "A tour of DianiMilo's tabs",
      es: 'Recorrido por las pestañas de DianiMilo',
    },
  },
];
const path = (lang: string, id: string) =>
  `/${lang}/${lang === 'es' ? 'proyectos' : 'projects'}/${id}/`;
const command = (page: Page) => page.locator('[data-command]');

test('fresh home starts at the top and portfolio back returns to the introduction', async ({
  page,
}) => {
  for (const lang of ['es', 'en']) {
    await page.goto(`/${lang}/`);
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => scrollY)).toBe(0);
    await page.locator('.site-build-link').click();
    await expect(page).toHaveURL(path(lang, 'portafolio'));
    await page.locator('.back-link').first().click();
    await expect(page).toHaveURL(`/${lang}/`);
    await expect(page.locator('h1')).toContainText('Camilo Alberto');
    await expect(command(page)).toHaveText('cd ~');
  }
});

test('direct project access falls back to the top of the home page', async ({
  page,
}) => {
  for (const lang of ['es', 'en']) {
    for (const project of projects) {
      await page.goto(path(lang, project.id));
      await expect(page.locator('.back-link').first()).toHaveAccessibleName(
        lang === 'es' ? 'Volver' : 'Go back',
      );
      await page.locator('.back-link').first().click();
      await expect(page).toHaveURL(`/${lang}/`);
      await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
    }
  }
});

for (const project of projects) {
  test(`${project.title}: direct pages, equivalent language, theme and back navigation`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    for (const lang of ['es', 'en']) {
      const url = path(lang, project.id);
      expect((await page.goto(url))?.status()).toBe(200);
      await expect(page).toHaveURL(url);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(
        lang === 'en' ? (project.titleEn ?? project.title) : project.title,
      );
      await expect(command(page)).toHaveText(`cd ~/proyectos/${project.id}`);
      if (['dianimilo', 'nube-camiska'].includes(project.id))
        await expect(page.locator('.case-description')).toContainText('(PWA)');
      await expect(page.locator('.main-nav [aria-current]')).toContainText(
        lang === 'es' ? 'Proyectos' : 'Projects',
      );
      await expect(page.locator('.repository-link')).toHaveAttribute(
        'href',
        `https://github.com/camilo477/${project.repo}`,
      );
      await expect(page.locator('.demo-link')).toHaveCount(
        project.demo ? 1 : 0,
      );
      if (project.demo)
        await expect(page.locator('.demo-link')).toHaveAttribute(
          'href',
          project.demo,
        );
      await page.locator('[data-theme-toggle]').click();
      const theme = await page.locator('html').getAttribute('data-theme');
      const other = lang === 'es' ? 'en' : 'es';
      await page.locator(`[data-language="${other}"]`).click();
      await expect(page).toHaveURL(path(other, project.id));
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme!);
      await page.reload();
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme!);
      await page.locator('.back-link').first().click();
      // Go back returns to the previous language/page in browser history.
      await expect(page).toHaveURL(path(lang, project.id));
    }
    expect(errors).toEqual([]);
  });
}

test('visible project content and page/demo links work with keyboard and touch', async ({
  page,
  isMobile,
}) => {
  for (const project of projects) {
    await page.goto(`/es/#${project.id}`);
    await expect(page.locator(`#${project.id} .project-content`)).toBeVisible();
    await page.locator(`#${project.id} .project-title a`).focus();
    const link = page.locator(`.story-${project.id} .project-page-link`);
    await page.keyboard.press('Tab');
    await expect(link).toBeFocused();
    await expect(command(page)).toHaveText(`cd ~/proyectos/${project.id}`);
    expect(
      await link.evaluate((el) => getComputedStyle(el).outlineStyle),
    ).not.toBe('none');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(path('es', project.id));
    await page.goBack();
    await expect(page.locator(`#${project.id} .project-content`)).toBeVisible();
    if (project.demo) {
      const demo = page.locator(`.story-${project.id} .demo-link`);
      await expect(demo).toHaveAttribute('href', project.demo);
      await expect(demo).toHaveAttribute('target', '_blank');
      await expect(demo).toHaveAttribute('rel', 'noopener noreferrer');
      // Verify browser navigation without depending on or changing a live application.
      await page
        .context()
        .route(`${new URL(project.demo).origin}/**`, (route) =>
          route.fulfill({
            contentType: 'text/html',
            body: '<title>Demo navigation test</title>',
          }),
        );
      const popupPromise = page.waitForEvent('popup');
      if (isMobile) await demo.tap();
      else await demo.click();
      const popup = await popupPromise;
      await expect(popup).toHaveURL(project.demo);
      expect(await popup.evaluate(() => window.opener === null)).toBe(true);
      await expect(page).toHaveURL(`/es/#${project.id}`);
      await popup.close();
    }
  }
});

test('project navigation and equivalent language work without JavaScript', async ({
  browser,
  isMobile,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: isMobile
      ? { width: 390, height: 844 }
      : { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  for (const project of projects) {
    await page.goto('/es/');
    await page.locator(`.story-${project.id} .project-page-link`).click();
    await expect(page).toHaveURL(path('es', project.id));
    await expect(command(page)).toHaveText(`cd ~/proyectos/${project.id}`);
    await page.locator('[data-language="en"]').click();
    await expect(page).toHaveURL(path('en', project.id));
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      project.titleEn ?? project.title,
    );
    const demo = projectVideos.find(({ id }) => id === project.id);
    if (demo) {
      const video = page.locator('.project-video video');
      await expect(video).toBeVisible();
      await video.focus();
      await page.keyboard.press('Space');
      await expect
        .poll(() => video.evaluate((el: HTMLVideoElement) => el.currentTime))
        .toBeGreaterThan(0);
      await page.keyboard.press('Space');
      await expect
        .poll(() => video.evaluate((el: HTMLVideoElement) => el.paused))
        .toBe(true);
      await expect(video).toHaveAccessibleName(demo.title.en);
    }
    await page.locator('.back-link').first().click();
    await expect(page).toHaveURL('/en/');
    expect(
      (await page.locator('#intro-heading').boundingBox())!.y,
    ).toBeGreaterThan(
      (await page.locator('.site-header').boundingBox())!.height,
    );
  }
  await context.close();
});

for (const demo of projectVideos) {
  test(`${demo.id} video loads on demand, plays with keyboard, seeks and offers both caption languages`, async ({
    page,
    request,
  }) => {
    test.setTimeout(60_000);
    const src = `/media/projects/${demo.id}/videos/${demo.file}.mp4`;
    const mediaRequests: string[] = [];
    page.on('request', (req) => {
      if (new URL(req.url()).pathname === src) mediaRequests.push(req.url());
    });
    const response = await request.get(src, {
      headers: { Range: 'bytes=0-31' },
    });
    expect(response.status()).toBe(206);
    expect(response.headers()['content-type']).toContain('video/mp4');
    expect((await response.body()).length).toBe(32);
    for (const lang of ['en', 'es'] as const) {
      for (const url of [`/${lang}/#${demo.id}`, path(lang, demo.id)]) {
        mediaRequests.length = 0;
        await page.goto(url);
        const figure = page
          .locator(`.story-${demo.id}, .case-${demo.id}`)
          .locator('.project-video');
        const video = figure.locator('video');
        await video.scrollIntoViewIfNeeded();
        await expect(video).toHaveAttribute('preload', 'none');
        await expect(video).toHaveAttribute('controls', '');
        await expect(video).not.toHaveAttribute('autoplay');
        await expect(video.locator('track[default]')).toHaveAttribute(
          'srclang',
          lang,
        );
        expect(mediaRequests).toEqual([]);
        expect(await video.evaluate((el: HTMLVideoElement) => el.paused)).toBe(
          true,
        );
        await video.focus();
        await page.keyboard.press('Space');
        await expect
          .poll(() => video.evaluate((el: HTMLVideoElement) => el.currentTime))
          .toBeGreaterThan(0.1);
        await page.keyboard.press('Space');
        await expect
          .poll(() => video.evaluate((el: HTMLVideoElement) => el.paused))
          .toBe(true);
        expect(
          await video.evaluate((el: HTMLVideoElement) => [
            el.videoWidth,
            el.videoHeight,
          ]),
        ).toEqual([1440, 900]);
        expect(
          await video.evaluate((el: HTMLVideoElement) => el.duration),
        ).toBeCloseTo(demo.duration, 5);
        for (const captionLanguage of ['en', 'es']) {
          await video.evaluate((el: HTMLVideoElement, language) => {
            for (const track of el.textTracks)
              track.mode = track.language === language ? 'showing' : 'disabled';
          }, captionLanguage);
          await expect
            .poll(() =>
              video.evaluate(
                (el: HTMLVideoElement, language) =>
                  [...el.textTracks].find(
                    (track) => track.language === language,
                  )?.cues?.length,
                captionLanguage,
              ),
            )
            .toBe(demo.captions);
        }
        await video.evaluate((el: HTMLVideoElement, time) => {
          el.currentTime = time;
        }, demo.duration - 2);
        await expect
          .poll(() =>
            video.evaluate(
              (el: HTMLVideoElement, time) =>
                !el.seeking && el.currentTime >= time,
              demo.duration - 2,
            ),
          )
          .toBe(true);
        expect(
          await video.evaluate((el: HTMLVideoElement) => el.error),
        ).toBeNull();
        await expect(video).toHaveAccessibleName(demo.title[lang]);
        await expect(figure).toHaveText('');
        await expect(figure.locator('a')).toHaveCount(0);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
      }
    }
  });
}

test('case commands revert to the actual page and reduced motion leaves no typing queue', async ({
  page,
  isMobile,
}) => {
  await page.goto(path('es', 'dianimilo'));
  const back = page.locator('.back-link').first();
  await back.focus();
  await expect(command(page)).toHaveText('cd ~');
  await page.locator('[data-language="en"]').focus();
  await expect(command(page)).toHaveText('cd ~/proyectos/dianimilo');
  if (!isMobile) {
    await page.locator('.main-nav a').nth(2).hover();
    await back.hover();
    await page.locator('.main-nav a').first().hover();
    await page.mouse.move(0, 0);
    await expect(command(page)).toHaveText('cd ~/proyectos/dianimilo');
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const values = await page.evaluate(async () => {
    const changes: string[] = [];
    const output = document.querySelector('[data-command]')!;
    const observer = new MutationObserver(() =>
      changes.push(output.textContent ?? ''),
    );
    observer.observe(output, { childList: true });
    document.querySelector<HTMLElement>('.back-link')!.focus();
    await new Promise((resolve) => setTimeout(resolve, 260));
    observer.disconnect();
    return changes;
  });
  expect(values.length).toBeGreaterThan(0);
  expect(values.every((value) => value === 'cd ~')).toBe(true);
  await page.goto(`${path('es', 'dianimilo')}#architecture-heading`);
  await expect(command(page)).toHaveText('cd ~/proyectos/dianimilo');
  expect(
    (await page.locator('#architecture-heading').boundingBox())!.y,
  ).toBeGreaterThan((await page.locator('.site-header').boundingBox())!.height);
});

test('approved experience and Homelab have primary navigation in both languages', async ({
  page,
}) => {
  for (const lang of ['es', 'en']) {
    await page.goto(`/${lang}/`);
    await expect(page.locator('.experience-entry')).toHaveCount(1);
    await expect(
      page.locator(
        `a[href*="#${lang === 'es' ? 'experiencia' : 'experience'}"]`,
      ),
    ).toHaveCount(2);
    await page
      .locator('.main-nav')
      .getByRole('link', { name: 'Homelab', exact: true })
      .click();
    await expect(page).toHaveURL(`/${lang}/#homelab`);
    await expect(page.locator('#homelab')).toHaveAttribute('open', '');
    await expect(page.locator('h1')).toContainText('Camilo Alberto');
    await expect(page.locator('#homelab-summary')).toContainText(
      'Raspberry Pi',
    );
    await expect(page.locator('#homelab-summary')).toContainText('Nginx');
    await expect(page.locator('#homelab-summary')).toContainText(
      'Cloudflare Tunnel',
    );
    await expect(command(page)).toHaveText('cd ~/homelab');
    await expect(page.locator('.main-nav [aria-current]')).toHaveAccessibleName(
      'Homelab',
    );
    const other = lang === 'es' ? 'en' : 'es';
    await page.locator(`[data-language="${other}"]`).click();
    await expect(page).toHaveURL(`/${other}/#homelab`);
  }
});

test('all internal links and anchors resolve, absent media stays compact, narrow screens do not overflow', async ({
  page,
  request,
}) => {
  const urls = [
    '/es/',
    '/en/',
    '/es/#homelab',
    '/en/#homelab',
    ...projects.flatMap((project) =>
      ['es', 'en'].map((lang) => path(lang, project.id)),
    ),
  ];
  const checked = new Set<string>();
  for (const url of urls) {
    await page.goto(url);
    const hrefs = await page
      .locator('a[href^="/"], a[href^="#"]')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')!));
    for (const href of hrefs) {
      const target = new URL(href, page.url());
      if (checked.has(target.href)) continue;
      const response = await request.get(target.pathname);
      expect(response.status(), target.href).toBe(200);
      if (target.hash) {
        const html = await response.text();
        expect(html, target.href).toContain(`id="${target.hash.slice(1)}"`);
      }
      checked.add(target.href);
    }
    await expect(page.locator('.project-gallery, .case-cover')).toHaveCount(0);
    await expect(page.locator('.project-video')).toHaveCount(
      url.includes('/proyectos/') || url.includes('/projects/')
        ? Number(projectVideos.some(({ id }) => url.endsWith(`/${id}/`)))
        : projectVideos.length,
    );
    await expect(
      page.locator('.media-placeholder, .pending-note, .palette-note'),
    ).toHaveCount(0);
    for (const width of [320, 390, 820]) {
      await page.setViewportSize({ width, height: 844 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        url,
      ).toBe(true);
    }
  }
});

test('case pages and Homelab pass accessibility checks in both themes and languages', async ({
  page,
}) => {
  test.setTimeout(60_000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const lang of ['es', 'en']) {
    for (const id of [...projects.map((project) => project.id), 'homelab']) {
      for (const theme of ['light', 'dark'] as const) {
        await page.emulateMedia({ colorScheme: theme });
        await page.goto(
          id === 'homelab' ? `/${lang}/#homelab` : path(lang, id),
        );
        const result = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze();
        expect(result.violations, `${id} ${lang} ${theme}`).toEqual([]);
      }
    }
  }
  expect(errors).toEqual([]);
});
