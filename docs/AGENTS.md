# docs Agent Guide

Supplements the repo-root `AGENTS.md`. The quasar.dev website, itself a
Quasar app (`quasar prepare` applies).

- Page content: `src/pages` (markdown); its build pipeline: `build/`.
- Colocated `{build,src}/**/*.test.js`; run `pnpm test:unit` for any
  `build/` change.
- `build/md/page-ids.js` collects every DOM id a page emits — from its
  headings and from the components it embeds alike. Extend its source
  list when a component starts emitting one. A collision, or a
  `related:` entry resolving to nothing, is reported in dev and fails a
  production build.
- `pnpm test` = `test:unit`, then `test:e2e:ssr` and `test:build`
  SEQUENTIALLY (`test/suites.js`): a build must never overlap the dev
  server, they share `.quasar`/`.q-cache`. Keep `pnpm generate:search`
  in the `build` chain — it is the search generator's only coverage.
  `E2E_SERVER_URL` audits a running `dev:ssr` instead of booting one.
- `pnpm generate:mcp --target ui|app-vite` writes the docs slice a
  package bundles for `@quasar/mcp` (`build/mcp/targets.js` lists the
  routes); the package's own `generate:mcp` script runs it from its
  `prepublishOnly`. A page must be in the site menu to be generated; its
  menu entry's `llmExclude` / `llmOnly` holds it out of a markdown form.
- `src/pages/guide.md` (route `/guide`, unlisted: `build/unlisted-pages.js`)
  is the authoring reference for page syntax (its frontmatter table mirrors
  `build/md/frontmatter-rules.js`, which a test holds every page to):
  update it with any change to what a page can be written with.
