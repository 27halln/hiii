import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import playformCompress from '@playform/compress';
import robotsTxt from 'astro-robots-txt';
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import { viteStaticCopy } from "vite-plugin-static-copy";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux";

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
    vite: {
        plugins: [
            viteStaticCopy({
                targets: [
                    {
                        src: `${uvPath}/**/*`.replace(/\\/g, "/"),
                        dest: "uv",
                        overwrite: false
                    },
                    {
                        src: `${epoxyPath}/**/*`.replace(/\\/g, "/"),
                        dest: "epoxy",
                        overwrite: false
                    },
                    { 
                        src: `${baremuxPath}/**/*`.replace(/\\/g, "/"),
                        dest: "baremux",
                        overwrite: false
                    }
                ]
            })
        ],
        server: {
            proxy: {
                "/wisp/": {
                    target: "wss://ruby.rubynetwork.co/wisp/",
                    changeOrigin: true,
                    ws: true,
                    rewrite: (path) => path.replace(/^\/wisp\//, "")
                },
                "/bare/": {
                    target: "https://tomp.app/",
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/bare\//, "")
                },
            }
        }
    }
});
