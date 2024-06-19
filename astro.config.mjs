import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import robotsTxt from "astro-robots-txt";
import playformCompress from "@playform/compress";
import node from "@astrojs/node";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
    site: "https://incog.nebula.christmas",
  integrations: [tailwind(), robotsTxt(), playformCompress(), sitemap()],
  output: "server",
  adapter: node({
    mode: "standalone"
  })
});
