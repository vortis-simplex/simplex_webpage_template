# simplexsim.com

The website for Simplex, built with [Astro](https://astro.build). It ships as static HTML and CSS with no client-side JavaScript and has three dependencies. Editing the site means editing Markdown and JSON files; GitHub builds and publishes it on every push.

## Requirements

- Git.
- Node.js 22 or newer. Install the LTS release from [nodejs.org](https://nodejs.org), or run `nvm install` in this folder (it reads `.nvmrc`).
- A GitHub account with write access to this repository. Nothing else is needed: no hosting account, no CMS, no API keys.

## Run it locally

```bash
git clone https://github.com/vortis-simplex/simplex_webpage_template.git
cd simplex_webpage_template
npm install
npm run dev              # http://localhost:4321, reloads on save
```

Other commands:

```bash
npm run build            # writes the finished site to dist/
npm run preview          # serves dist/ exactly as it will be deployed
npm run dev -- --host    # also reachable from a phone on the same Wi-Fi
```

The build downloads the two typefaces from Google Fonts, so it needs internet access.

## Where things live

| What | Where |
| --- | --- |
| Site name, email, navigation, footer links, site URL | `src/config/site.json` |
| All homepage copy | `src/content/home.md` |
| Updates, one Markdown file each | `src/content/updates/` |
| Standalone pages such as `/privacy/` | `src/content/pages/` |
| Images referenced from content | `src/assets/` |
| Colors, type scale, spacing | `src/styles/global.css` (tokens at the top) |
| Fonts | `astro.config.mjs` |
| Favicon, `robots.txt`, link-preview image `og.png` | `public/` |
| Logo | `src/components/Wordmark.astro` |
| Deployment | `.github/workflows/astro.yml` |

## Post an update

1. Create `src/content/updates/YYYY-MM-DD-short-name.md`:

   ```markdown
   ---
   title: "Title of the update"
   date: 2026-11-03
   summary: "One sentence shown in the list. Optional."
   ---

   Body text in Markdown.
   ```

2. Commit and push to `main`. GitHub Actions builds and deploys the site in about a minute.

The update gets its own page at `/updates/short-name/` (the date prefix is dropped from the URL), and the three newest updates appear on the homepage.

- `draft: true` hides an update from the live site while keeping it visible in `npm run dev`.
- `link: https://...` makes the entry point to an external page instead of having its own.
- Images: put the file in `src/assets/` and write `![description](../../assets/file.jpg)`.
- Deleting the file removes the update. With no updates at all, the homepage hides its Updates section.

## Edit the homepage

Open `src/content/home.md`. The frontmatter holds the headline, lede, the "Why Simplex" list, the image, and the contact block; the Markdown body below it is the "What we build" statement. Delete the `image:` block for a text-only page. Sections whose data is removed disappear from the page.

## Images

Keep images in `src/assets/` and reference them by relative path. Astro resizes them and converts them to WebP at build time, so a 2 MB source becomes a few 50–150 KB variants. Keep sources at or below about 2000 px wide. Do not put large images in `public/`; that folder is served exactly as-is.

## Hosting

The site is served by GitHub Pages from this repository, `vortis-simplex/simplex_webpage_template`. Nothing here needs touching for day-to-day edits; this section records how it is wired.

- **Pages.** Repository Settings → Pages → Source is **GitHub Actions**, the custom domain is `simplexsim.com`, and **Enforce HTTPS** is ticked. The domain is stored in those settings, not in a `CNAME` file, so it survives every deploy.
- **The repository must stay public.** GitHub Pages on a private repository requires a paid plan.
- **DNS.** The records at the DNS provider are:

  | Type | Name | Value |
  | --- | --- | --- |
  | A | `@` | 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153 |
  | CNAME | `www` | `vortis-simplex.github.io` |

  `www.simplexsim.com` redirects to `simplexsim.com` automatically. If the repository ever moves to another account or organization, clear the custom domain in the old repository's Pages settings, set it in the new one, and point the `www` CNAME at `<new-owner>.github.io`; the A records stay as they are.
- **If the address ever changes,** update `url` in `src/config/site.json` (canonical links, Open Graph tags, sitemap) and the sitemap line in `public/robots.txt`.
- **History.** Before November 2026 this repository held a different site built on the PowerAI Astro template. It remains in the git history; the last commit of that version is `752252c`.

## Deploy

Push to `main`. The workflow in `.github/workflows/astro.yml` runs `npm ci` and `npm run build` on Node 22 and publishes `dist/` to GitHub Pages. Progress is in the Actions tab. A red run means the build failed and the live site is unchanged; the log names the file at fault. Usual causes:

- A typo in frontmatter, such as a missing quote or a date that is not `YYYY-MM-DD`.
- `package-lock.json` out of step with `package.json`. Run `npm install` locally and commit the lockfile.

Run `npm run build` locally before pushing to catch both.

## Keep dependencies current

Every few months:

```bash
npm outdated
npm update               # stays within the ranges in package.json
npm run build            # confirm it still builds
git commit -am "Update dependencies"
```

For a new Astro major version, run `npx @astrojs/upgrade` and follow its prompts.

## Link preview image

`public/og.png` (1200×630) is what X, LinkedIn, Slack and iMessage show when someone shares a link. Its source is `design/og.html`; if the headline changes, open that file in Chrome, set the viewport to 1200×630 in DevTools, take a screenshot, and save it over `public/og.png`.

## Change the look

Design tokens are at the top of `src/styles/global.css`: paper and ink colors, the teal accent, container width, and section spacing. The typefaces are Instrument Sans (text) and Instrument Serif (headlines), downloaded once at build time and served from this site. To use system fonts instead, delete the `fonts` block in `astro.config.mjs` and the two `<Font>` lines in `src/layouts/Base.astro`.

## Notes

- The site sets no cookies and runs no analytics, and the privacy page says so. If you add an analytics script, update `src/content/pages/privacy.md` too.
- Everything is static. There is no server, database, or form backend; the contact path is the email address in `src/config/site.json`.
