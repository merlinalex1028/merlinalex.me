// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import yaml from '@rollup/plugin-yaml';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://merlinalex.me',
  integrations: [icon(), mdx(), sitemap()],
  vite: {
    plugins: [tailwindcss(), yaml()],
  },
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'auto',
  },
});
