import { getCollection, type CollectionEntry } from "astro:content";

export type Update = CollectionEntry<"updates">;

/** Published updates, newest first. Drafts are included in `astro dev` only. */
export async function getUpdates(): Promise<Update[]> {
  const all = await getCollection("updates", ({ data }) => import.meta.env.DEV || !data.draft);
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** URL slug: the file name without a leading YYYY-MM-DD- prefix. */
export function updateSlug(entry: Update): string {
  return entry.id.replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

/** Where an update links to: its own page, or an external URL if `link` is set. */
export function updateHref(entry: Update): string {
  return entry.data.link ?? `/updates/${updateSlug(entry)}/`;
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
