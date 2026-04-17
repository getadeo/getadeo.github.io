# getadeo.github.io

Personal homepage and blog built with [Astro](https://astro.build).

## Project Structure

```text
src/
├── content/posts/   # Markdown blog posts
├── layouts/         # Shared page shells (Base.astro)
├── pages/           # Route files (index, posts, RSS)
└── styles/          # Global CSS (Tailwind + custom)
public/
├── fonts/           # Self-hosted Commit Mono woff2 files
└── ...              # Favicons, CNAME, static assets
```
## Commands

All commands are run from the root of the project:

| Command                    | Action                                              |
| :------------------------- | :-------------------------------------------------- |
| `npm install`              | Install dependencies                                |
| `npm run dev`              | Start local dev server at `localhost:4321`          |
| `npm run build`            | Build production site to `./dist/`                  |
| `npm run preview`          | Preview the build locally                           |
| `npm run astro -- check`   | Run Astro project checks (routes, content, types)   |

## Deployment

The site is deployed to GitHub Pages via `.github/workflows/deploy.yml`. Pushing to the main branch triggers a build and deploy automatically.
