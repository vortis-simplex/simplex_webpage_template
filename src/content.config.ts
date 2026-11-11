import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const link = z.object({ label: z.string(), href: z.string() });

/** All homepage copy lives in src/content/home.md. */
const home = defineCollection({
  loader: glob({ pattern: "home.md", base: "./src/content" }),
  schema: ({ image }) =>
    z.object({
      headline: z.string(),
      headline_em: z.string().optional(),
      lede: z.string().optional(),
      cta: link.optional(),
      pillars_label: z.string().default("Why Simplex"),
      pillars: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
      image: z
        .object({ src: image(), alt: z.string(), caption: z.string().optional() })
        .optional(),
      contact: z.object({ heading: z.string(), text: z.string().optional() }).optional(),
    }),
});

/** One Markdown file per update in src/content/updates/. */
const updates = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/updates" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string().optional(),
    /** If set, the update links out to this URL instead of its own page. */
    link: z.string().url().optional(),
    /** Drafts are shown in `npm run dev` but excluded from builds. */
    draft: z.boolean().default(false),
  }),
});

/** Standalone pages such as /privacy/. */
const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { home, updates, pages };
