# getadeo.github.io

Personal site for Genesis Tadeo, built with [Astro](https://astro.build). The site is a small mixed-content notebook with posts, links, and quotes.

## Stack

- Astro
- Astro content collections
- Tailwind CSS v4 through the Vite plugin
- TypeScript
- Self-hosted Commit Mono fonts
- Static deploy to GitHub Pages

## Content Types

Content lives in `src/content/` and is loaded through Astro content collections.

```text
src/content/
├── posts/    # Blog posts with individual pages
├── links/    # Link posts with individual pages
└── quotes/   # Saved quotes shown in the quotes archive
```

### Posts

Create Markdown files in `src/content/posts/`.

Required frontmatter:

```yaml
title: 'Post title'
date: 2026-04-27
```

Optional frontmatter:

```yaml
description: 'Short summary.'
tags: ['tag']
```

Routes:

- `/posts/`
- `/posts/[slug]/`

### Links

Create Markdown files in `src/content/links/`.

Required frontmatter:

```yaml
title: 'Link title'
date: 2026-04-27
url: 'https://example.com/'
```

Optional frontmatter:

```yaml
viaUrl: 'https://example.com/source'
viaTitle: 'Source name'
description: 'Short note.'
quote: 'Optional excerpt.'
tags: ['tag']
draft: false
```

Empty `viaUrl` / `viaTitle` values are treated as missing.

Routes:

- `/links/`
- `/links/[slug]/`

### Quotes

Create Markdown files in `src/content/quotes/`.

Required frontmatter:

```yaml
date: 2026-04-27
quote: 'Quote text.'
source: 'Source name'
```

Optional frontmatter:

```yaml
sourceUrl: 'https://example.com/'
context: 'Book, article, talk, etc.'
tags: ['tag']
draft: false
```

Quotes are archive-first and do not generate individual quote pages.

Route:

- `/quotes/`

## Routes

```text
/                    # Mixed entries timeline
/page/[page]/        # Paginated mixed entries
/posts/              # Posts archive
/posts/page/[page]/  # Paginated posts
/posts/[slug]/       # Post detail
/links/              # Links archive
/links/page/[page]/  # Paginated links
/links/[slug]/       # Link detail
/quotes/             # Quotes archive
/quotes/page/[page]/ # Paginated quotes
/rss.xml             # Full-content RSS feed for all entries
/404.html            # Not found page
```

Pagination currently uses `PAGE_SIZE` from `src/utils/allEntries.ts`.

## Key Files

```text
src/content.config.ts       # Content collection schemas
src/layouts/Base.astro      # HTML shell, metadata, theme script, ClientRouter
src/layouts/SitePage.astro  # Shared site page wrapper and header
src/components/             # Shared UI and entry components
src/utils/allEntries.ts     # Collection loading, mixed timeline, pagination helpers
src/utils/entries.ts        # Date and entry formatting helpers
src/pages/rss.xml.ts        # Full-content RSS feed
src/styles/global.css       # Tailwind v4 theme tokens and global styles
astro.config.mjs            # Astro config, site URL, Tailwind plugin
```

## RSS

`/rss.xml` includes posts, links, and quotes sorted newest first. Items include full HTML content through `content:encoded` so RSS readers like Feedly can display complete entries.

## Commands

Use Node `>=22.12.0`.

| Command                  | Action                                            |
| :----------------------- | :------------------------------------------------ |
| `npm ci`                 | Install dependencies from the lockfile            |
| `npm run dev`            | Start local dev server at `localhost:4321`        |
| `npm run astro -- check` | Run Astro checks for routes, content, and types   |
| `npm run build`          | Build production site to `./dist/`                |
| `npm run preview`        | Preview the production build locally              |

## Deployment

The site is deployed to GitHub Pages via `.github/workflows/deploy.yml`. Pushing to the main branch triggers a build and deploy automatically.

`astro.config.mjs` and `public/CNAME` should stay aligned with the production domain.
