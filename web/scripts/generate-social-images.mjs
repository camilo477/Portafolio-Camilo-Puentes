import { mkdir, readFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

// Reuse the site's actual fonts and provisional color tokens; no external assets.
let css = await readFile(
  new URL('../src/styles/global.css', import.meta.url),
  'utf8',
);
for (const font of ['noto-sans', 'jetbrains-mono']) {
  const name = `@fontsource-variable/${font}/files/${font}-latin-wght-normal.woff2`;
  const data = await readFile(new URL(import.meta.resolve(name)));
  css = css.replace(
    `url('${name}')`,
    `url('data:font/woff2;base64,${data.toString('base64')}')`,
  );
}
const output = new URL('../public/social/', import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
});
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  for (const [lang, label, role] of [
    ['es', 'Portafolio profesional', 'Desarrollador backend y full stack'],
    ['en', 'Professional portfolio', 'Backend and full stack developer'],
  ]) {
    await page.setContent(`<!doctype html><html lang="${lang}" data-theme="dark"><head><meta charset="utf-8"></head><body>
      <main><div class="eyebrow"><span>$ whoami</span><span>${label}</span></div>
      <h1>Camilo Alberto<br><em>Puentes Valencia</em></h1><p class="profession">${role}</p>
      <footer><span>camiska.lat</span><span>Linux · ES / EN</span></footer></main></body></html>`);
    await page.addStyleTag({ content: css });
    await page.addStyleTag({
      content: `
      body { padding: 0; width: 1200px; height: 630px; }
      main { padding: 60px 72px; height: 100%; display: flex; flex-direction: column; }
      .eyebrow { display: flex; align-items: center; gap: 32px; color: var(--text-muted); font-size: 21px; }
      .eyebrow span:first-child { color: var(--accent); font: 24px var(--mono); }
      h1 { font-size: 76px; line-height: 1.16; letter-spacing: -3px; margin-top: 53px; font-weight: 620; }
      em { color: var(--accent); font-style: normal; }
      .profession { font-size: 30px; margin-top: 25px; }
      footer { margin-top: auto; padding-top: 24px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; font: 23px var(--mono); }
      footer span:last-child { color: var(--text-muted); font-size: 19px; }
    `,
    });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: new URL(`portfolio-${lang}.png`, output).pathname,
    });
    console.log(`Generated portfolio-${lang}.png (1200×630)`);
  }
} finally {
  await browser.close();
}
