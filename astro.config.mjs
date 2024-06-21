import node from '@astrojs/node';
import tailwind from '@astrojs/tailwind';
import playformCompress from '@playform/compress';
import robotsTxt from 'astro-robots-txt';
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
    site: 'https://incog.nebula.christmas',
    integrations: [
        tailwind(),
        robotsTxt(),
        sitemap(),
        playformCompress({
            CSS: false,
            HTML: true,
            Image: true,
            JavaScript: true,
            SVG: true
        })
    ],
    output: 'server',
    adapter: node({
        mode: 'middleware'
    })
});
