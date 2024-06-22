import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import playformCompress from '@playform/compress';
import robotsTxt from 'astro-robots-txt';
import { defineConfig } from 'astro/config';

import icon from 'astro-icon';

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
        }),
        icon()
    ],
    output: 'server',
    adapter: node({
        mode: 'middleware'
    })
});
