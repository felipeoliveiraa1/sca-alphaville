// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // www é o host que SERVE o site (o apex responde 308 → www). og:image,
  // canonical e sitemap precisam apontar direto pro www: o robô do WhatsApp
  // não segue redirect de imagem e derruba o card do preview.
  site: 'https://www.supercarrosalphaville.com.br',
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
