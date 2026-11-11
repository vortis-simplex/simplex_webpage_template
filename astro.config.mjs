import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";
import site from "./src/config/site.json";

export default defineConfig({
  site: site.url,
  integrations: [sitemap()],
  build: { inlineStylesheets: "always" },
  markdown: {
    shikiConfig: { theme: "github-light" },
  },
  // Fonts are downloaded once at build time and served from this site,
  // so visitors never contact Google. To use system fonts instead, delete
  // this block and the two <Font> tags in src/layouts/Base.astro.
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Instrument Sans",
      cssVariable: "--font-sans",
      weights: ["400 700"],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["system-ui", "Helvetica Neue", "Arial", "sans-serif"],
      display: "swap",
    },
    {
      provider: fontProviders.google(),
      name: "Instrument Serif",
      cssVariable: "--font-serif",
      weights: [400],
      styles: ["normal", "italic"],
      subsets: ["latin"],
      fallbacks: ["Georgia", "Times New Roman", "serif"],
      display: "swap",
    },
  ],
});
