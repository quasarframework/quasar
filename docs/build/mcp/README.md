# Docs generator (site `.md` pages and the MCP slices)

Converts `docs/src/pages/**/*.md` (Quasar-flavored markdown with custom Vue tags) into standalone, LLM-friendly markdown.

## Run

```bash
# from docs/
pnpm generate:mcp                     # the site form, next to the SSG output in dist/quasar.dev
pnpm generate:mcp --target ui         # the quasar slice, into ui/dist/mcp
pnpm generate:mcp --target app-vite   # the @quasar/app-vite slice, into app-vite/dist/mcp
pnpm test:unit
```

Requires `ui/dist/api/*.json` (build the UI package first).

The docs build runs the site form from its `afterBuild` hook (`quasar.config.js`), so the deploy ships a `.md` sibling for every menu page (`/vue-components/button.md`) plus `/llms.txt` and `/mcp.json` (version and source commit). The slices are what `@quasar/mcp` serves offline: `targets.js` lists each package's routes, `meta.json` indexes the slice, and `<DocApi>` becomes a pointer to the server's `get_api` tool instead of the rendered API (the package ships the API JSON itself). Each package's `generate:mcp` script runs its slice as the last step of `prepublishOnly`; note that a ui build wipes `ui/dist`, slice included.

## Layout

- `generate.js` — the pipeline: page loop, sidecars, summary; `index.js` is its CLI
- `targets.js` — the per-package route lists
- `pages/` — page selection from the site menu (`menu.js`, `select.js`), route/output path rules (`routes.js`), frontmatter (`frontmatter.js`)
- `markdown/` — markdown-it parse with the site's rules (`md.js`) and the token walker (`walker.js`) that serializes tokens back to markdown through registered emitters: `prose.js` standard constructs, `containers.js` (`::: tip` → GitHub alerts, `::: details` → `<details>`), `tabs.js` (prunes tab groups: Composition > Options, TS > JS, pnpm > yarn/npm), `html-dispatcher.js` + `inline-tags.js` for HTML tokens (`tags/site-components.js` writes out the data behind the site's own components: transitions, colors, typography, Sass variables, UMD tags, Vite plugin usage), `link-rewrite.js` (in-tree links → relative `.md` among the run's pages, the live site otherwise in a slice), `collapse-markers.js` (`#region` blocks in examples), `llm-content-control.js` (`<llm-only>` / `<llm-exclude>`), `script-doc-stripper.js`
- `markdown/tags/` — the Quasar doc tags: `DocApi`, `DocExample`, `DocInstall`, `DocTree`, `DocLink`
- `api/` — renders `ui/dist/api` JSON as indented-bullet API docs (site form only) and checks every API is documented somewhere (`coverage.js`)
- `output/` — the page writer, `llms.txt`, `meta.json`, token counting for the summary

## Serving the site form

In the hosting layer (outside the repo):

- Make sure `.md` files are served with `Content-Type: text/markdown; charset=utf-8`.
- Optional, but nice to have: when a page is requested with an `Accept: text/markdown` header, respond with a 302 to the `.md` sibling. Send `Vary: Accept` on that response so that the CDN caches stay valid.

## Warnings

Every warning is printed and any warning throws: a failed page, a broken build input (a corrupt API JSON, a handler missing its context) or a docs authoring issue (a dead `related` entry, a missing API file) alike. The run feeds the docs build and the ui and app-vite `prepublishOnly`, so its output never carries a known defect.

## Adding a tag handler

Create `markdown/tags/doc-foo.js` exporting a handler factory, register it in `registerAllEmitters()` in `generate.js`. See `markdown/tags/doc-link.js` for the smallest example.
