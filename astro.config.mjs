import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { baremuxPath } from '@mercuryworkshop/bare-mux';
import { epoxyPath } from '@mercuryworkshop/epoxy-transport';
import playformCompress from '@playform/compress';
import { uvPath } from '@titaniumnetwork-dev/ultraviolet';
import icon from 'astro-icon';
import robotsTxt from 'astro-robots-txt';
import { defineConfig, envField } from 'astro/config';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://astro.build/config
export default defineConfig({
    site: 'https://incog.nebula.christmas',
    integrations: [
        tailwind(),
        robotsTxt(),
        sitemap(),
        icon(),
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
    }),
    experimental: {
        env: {
            schema: {
                BARE_SERVER_OPTION: envField.boolean({ context: "client", access: "public", default: false }),
            }
        }
    },
    vite: {
        plugins: [
            viteStaticCopy({
                targets: [
                    {
                        src: `${uvPath}/**/*`.replace(/\\/g, '/'),
                        dest: 'uv',
                        overwrite: false
                    },
                    {
                        src: `${epoxyPath}/**/*`.replace(/\\/g, '/'),
                        dest: 'epoxy',
                        overwrite: false
                    },
                    {
                        src: `${baremuxPath}/**/*`.replace(/\\/g, '/'),
                        dest: 'baremux',
                        overwrite: false
                    }
                ]
            })
        ],
        server: {
            proxy: {
                '/wisp/': {
                    target: 'wss://ruby.rubynetwork.co/wisp/',
                    changeOrigin: true,
                    ws: true,
                    rewrite: (path) => path.replace(/^\/wisp\//, '')
                },
                '/bare/': {
                    target: 'https://ruby.rubynetwork.co/bare/',
                    changeOrigin: true,
                    ws: true,
                    rewrite: (path) => path.replace(/^\/bare\//, '')
                }
            }
        }
    }
});
