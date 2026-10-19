import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://bluewhalenetwork.com',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [
    react(),
    sitemap({
      // Labs pages are preview-only and never belong in the sitemap.
      filter: (page) => !page.includes('/labs'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
