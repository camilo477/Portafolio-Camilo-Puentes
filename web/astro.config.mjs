import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { canonicalPages, siteOrigin } from './src/lib/site';

export default defineConfig({
  site: siteOrigin,
  integrations: [sitemap({ filter: (page) => canonicalPages.includes(page) })],
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
