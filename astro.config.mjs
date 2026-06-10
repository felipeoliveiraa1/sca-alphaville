// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://supercarrosalphaville.com.br',
  integrations: [sitemap()],
  trailingSlash: 'ignore',
  build: {
    inlineStylesheets: 'auto',
  },
  image: {
    // Allow remote optimization if ever needed; primary assets are local.
    responsiveStyles: true,
  },
  devToolbar: { enabled: false },
});
