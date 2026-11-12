import { test, expect, type Page } from '@playwright/test';

const details = (page: Page) => page.locator('#dianimilo');

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

test('sticky navigation stays opaque and anchors remain below it in both themes and languages', async ({
  page,
}) => {
  for (const lang of ['es', 'en']) {
    for (const theme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: theme });
      await page.goto(`/${lang}/`);
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
            .locator('.site-header')
            .evaluate((el) => getComputedStyle(el).backgroundColor),
        ).toBe(theme === 'dark' ? 'rgb(19, 27, 34)' : 'rgb(242, 240, 233)');
        for (const control of await page
          .locator('.site-header a, .site-header button')
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
    await expect(details(page)).toHaveAttribute('open', '');
    const header = await page.locator('.site-header').boundingBox();
    expect(
      (await details(page).locator('summary').boundingBox())!.y,
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

test('opening and closing use intermediate heights without scrolling or clipping dynamic content', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/es/#proyectos');
  await details(page)
    .locator('summary')
    .evaluate((el) => el.scrollIntoView({ block: 'start' }));
  // Preserve the production duration, but slow Chromium's animation clock while
  // measuring intermediate geometry so busy CI workers cannot skip the transition.
  expect(
    await details(page).evaluate(
      (el) => getComputedStyle(el, '::details-content').transitionDuration,
    ),
  ).toContain('0.24s');
  const animationClock = await page.context().newCDPSession(page);
  await animationClock.send('Animation.enable');
  await animationClock.send('Animation.setPlaybackRate', { playbackRate: 0.2 });
  const samples = await details(page).evaluate(async (panel) => {
    const summary = panel.querySelector('summary')!;
    const reveal = panel.querySelector('.project-reveal')!;
    const capture = async () => {
      const frames: { height: number; scroll: number }[] = [];
      const start = performance.now();
      do {
        frames.push({
          height: reveal.getBoundingClientRect().height,
          scroll: scrollY,
        });
        await new Promise(requestAnimationFrame);
      } while (performance.now() - start < 1500);
      return frames;
    };
    const before = scrollY;
    summary.click();
    const opening = await capture();
    summary.click();
    const closing = await capture();
    return { before, opening, closing };
  });
  await animationClock.send('Animation.setPlaybackRate', { playbackRate: 1 });
  await animationClock.detach();
  const fullHeight = samples.opening.at(-1)!.height;
  expect(fullHeight).toBeGreaterThan(100);
  for (const frames of [samples.opening, samples.closing]) {
    expect(
      frames.filter((f) => f.height > 2 && f.height < fullHeight - 2).length,
    ).toBeGreaterThan(1);
    expect(
      Math.max(...frames.map((f) => Math.abs(f.scroll - samples.before))),
    ).toBeLessThan(2);
  }
  expect(samples.closing.at(-1)!.height).toBeLessThan(1);
  await expect(page).toHaveURL('/es/#proyectos');
  await details(page)
    .locator('.prose')
    .evaluate((el) => {
      const paragraph = document.createElement('p');
      paragraph.textContent =
        'Contenido dinámico para verificar la altura natural. '.repeat(40);
      el.append(paragraph);
    });
  await details(page).locator('summary').click();
  await expect
    .poll(() =>
      details(page).evaluate((panel) => {
        const reveal = panel.querySelector('.project-reveal')!;
        return Math.abs(
          reveal.getBoundingClientRect().height - reveal.scrollHeight,
        );
      }),
    )
    .toBeLessThan(1);
  expect(
    (await details(page).locator('.project-reveal').boundingBox())!.height,
  ).toBeGreaterThan(fullHeight);
});

test('rapid toggles, switching projects and history do not leave stale animation state', async ({
  page,
}) => {
  await page.goto('/es/#proyectos');
  await details(page)
    .locator('summary')
    .evaluate(async (el) => {
      for (let i = 0; i < 5; i++) {
        (el as HTMLElement).click();
        await new Promise((resolve) => setTimeout(resolve, 35));
      }
    });
  await expect(page).toHaveURL('/es/#dianimilo');
  await expect(details(page)).toHaveAttribute('open', '');
  await page.locator('#nube-camiska > summary').click();
  await expect(page).toHaveURL('/es/#nube-camiska');
  await expect(details(page)).not.toHaveAttribute('open');
  await expect(page.locator('[data-project][open]')).toHaveCount(1);
  await page.goBack();
  await expect(details(page)).toHaveAttribute('open', '');
  await expect(page.locator('[data-command]')).toHaveText(
    'cd ~/proyectos/dianimilo',
  );
  expect(
    await details(page).evaluate(
      (el) =>
        el
          .getAnimations({ subtree: true })
          .filter(
            (animation) =>
              (animation.effect as KeyframeEffect).pseudoElement ===
              '::details-content',
          ).length,
    ),
  ).toBe(0);
  // The decorative arrow may react to the pointer restored by browser history;
  // it must settle, but it must not be mistaken for a height transition.
  await expect
    .poll(() =>
      details(page).evaluate(
        (el) => el.getAnimations({ subtree: true }).length,
      ),
    )
    .toBe(0);
});

test('reduced motion and the manual setting disable project transitions', async ({
  page,
}) => {
  for (const mode of ['system', 'manual']) {
    await page.emulateMedia({
      reducedMotion: mode === 'system' ? 'reduce' : 'no-preference',
    });
    await page.goto('/es/');
    if (mode === 'manual') await page.locator('[data-motion-toggle]').uncheck();
    const state = await details(page).evaluate((el) => {
      el.querySelector('summary')!.click();
      return {
        open: (el as HTMLDetailsElement).open,
        height: el.querySelector('.project-reveal')!.getBoundingClientRect()
          .height,
        animations: el.getAnimations({ subtree: true }).length,
      };
    });
    expect(state.open).toBe(true);
    expect(state.height).toBeGreaterThan(100);
    expect(state.animations).toBe(0);
  }
});

test('closing an earlier project keeps the next activated summary below the sticky header', async ({
  page,
}) => {
  await page.goto('/es/#dianimilo');
  const next = page.locator('#nube-camiska > summary');
  await next.evaluate((el) => el.scrollIntoView({ block: 'start' }));
  const positions = await next.evaluate(async (el) => {
    const positions: number[] = [];
    const header = document
      .querySelector('.site-header')!
      .getBoundingClientRect().bottom;
    const before = el.getBoundingClientRect().top;
    (el as HTMLElement).click();
    const start = performance.now();
    do {
      positions.push(el.getBoundingClientRect().top);
      await new Promise(requestAnimationFrame);
    } while (performance.now() - start < 330);
    return { positions, header, before };
  });
  expect(Math.min(...positions.positions)).toBeGreaterThan(positions.header);
  expect(
    Math.max(
      ...positions.positions.map((top) => Math.abs(top - positions.before)),
    ),
  ).toBeLessThan(2);
  await expect(page).toHaveURL('/es/#nube-camiska');
});
