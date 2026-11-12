import { test, expect } from '@playwright/test';

const origin = 'https://camiska.lat';
const ids = ['dianimilo', 'nube-camiska', 'convertix', 'portafolio'];
const pathFor = (lang: string, id?: string) =>
  id
    ? `/${lang}/${lang === 'es' ? 'proyectos' : 'projects'}/${id}/`
    : `/${lang}/`;
const paths = ['es', 'en'].flatMap((lang) => [
  pathFor(lang),
  ...ids.map((id) => pathFor(lang, id)),
]);

test('every canonical page has static, specific SEO and reciprocal translations without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const baseURL = test.info().project.use.baseURL!;
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const lang of ['es', 'en']) {
    for (const id of [undefined, ...ids]) {
      const path = pathFor(lang, id);
      const response = await page.goto(
        `${baseURL}${path}?source=test#overview`,
      );
      expect(response!.status()).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      const title = await page.title();
      const description = await page
        .locator('meta[name="description"]')
        .getAttribute('content');
      expect(title).toContain('Camilo Puentes');
      expect(description!.length).toBeGreaterThan(45);
      titles.add(title);
      descriptions.add(description!);
      await expect(page.locator('link[rel=canonical]')).toHaveAttribute(
        'href',
        origin + path,
      );
      for (const language of ['es', 'en', 'x-default']) {
        await expect(
          page.locator(`head link[hreflang="${language}"]`),
        ).toHaveAttribute(
          'href',
          origin + pathFor(language === 'x-default' ? 'en' : language, id),
        );
      }
      for (const [key, value] of Object.entries({
        title,
        description,
        url: origin + path,
        type: 'website',
        locale: lang === 'es' ? 'es_CO' : 'en_US',
        'locale:alternate': lang === 'es' ? 'en_US' : 'es_CO',
        image: `${origin}/social/portfolio-${lang}.png`,
        'image:width': '1200',
        'image:height': '630',
        'image:type': 'image/png',
      })) {
        await expect(
          page.locator(`meta[property="og:${key}"]`),
        ).toHaveAttribute('content', value!);
      }
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
        'content',
        'summary_large_image',
      );
      await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
        'content',
        title,
      );
      await expect(
        page.locator('meta[name="twitter:description"]'),
      ).toHaveAttribute('content', description!);
      await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
        'content',
        `${origin}/social/portfolio-${lang}.png`,
      );
      await expect(
        page.locator('meta[name="robots"][content*="noindex"]'),
      ).toHaveCount(0);
      const json = JSON.parse(
        await page.locator('script[type="application/ld+json"]').innerText(),
      );
      expect(json['@context']).toBe('https://schema.org');
      const work = json['@graph'].find(
        (node: Record<string, unknown>) =>
          node['@id'] === origin + path + '#page',
      );
      expect(work['@type']).toBe(id ? 'CreativeWork' : 'WebPage');
      expect(work.inLanguage).toBe(lang);
      expect(work.description).toBe(description);
      if (id)
        expect(work.isBasedOn).toMatch(/^https:\/\/github.com\/camilo477\//);
      else
        expect(
          json['@graph'].find(
            (node: Record<string, unknown>) => node['@type'] === 'Person',
          ).sameAs,
        ).toEqual([
          'https://github.com/camilo477',
          'https://www.linkedin.com/in/camilo-puentes-6671a6262/',
        ]);
      expect(JSON.stringify(json)).not.toMatch(
        /alumniOf|award|aggregateRating|ratingValue|birthDate|telephone|192\.168\./,
      );
      await expect(page.locator('#contribution-heading')).toHaveCount(
        id ? 1 : 0,
      );
      if (id) {
        await expect(page.locator('#contribution-heading')).toHaveText(
          lang === 'es' ? 'Mi contribución' : 'My contribution',
        );
        await expect(
          page.locator('[aria-labelledby="contribution-heading"] p'),
        ).not.toBeEmpty();
      }
    }
  }
  expect(titles.size).toBe(10);
  expect(descriptions.size).toBe(10);
  await context.close();
});

test('sitemap lists exactly the ten canonical pages and robots allows crawling', async ({
  request,
  page,
}) => {
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  expect(robots.headers()['content-type']).toContain('text/plain');
  expect(await robots.text()).toBe(
    `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap-index.xml\n`,
  );
  const index = await request.get('/sitemap-index.xml');
  expect(index.status()).toBe(200);
  await page.goto('/en/');
  const locations = await page.evaluate(
    (xml) =>
      [
        ...new DOMParser()
          .parseFromString(xml, 'application/xml')
          .querySelectorAll('loc'),
      ].map((el) => el.textContent),
    await index.text(),
  );
  expect(locations).toEqual([`${origin}/sitemap-0.xml`]);
  const sitemap = await request.get('/sitemap-0.xml');
  expect(sitemap.status()).toBe(200);
  const urls = await page.evaluate(
    (xml) => {
      const doc = new DOMParser().parseFromString(xml, 'application/xml');
      if (doc.querySelector('parsererror'))
        throw new Error('Malformed sitemap');
      return [...doc.querySelectorAll('url > loc')].map((el) => el.textContent);
    },
    await sitemap.text(),
  );
  expect(urls.sort()).toEqual(paths.map((path) => origin + path).sort());
  for (const path of paths)
    expect((await request.get(path)).status()).toBe(200);
  expect(
    (await request.get('/docs/borradores/TAREA_10_EDITORIAL.md')).status(),
  ).toBe(404);
});

test('social images are served as real 1200 by 630 PNGs', async ({
  request,
}) => {
  for (const lang of ['en', 'es']) {
    const response = await request.get(`/social/portfolio-${lang}.png`);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/png');
    const png = await response.body();
    expect(png.subarray(0, 8)).toEqual(
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    );
    expect(png.readUInt32BE(16)).toBe(1200);
    expect(png.readUInt32BE(20)).toBe(630);
    expect(png.length).toBeLessThan(250_000);
  }
});
