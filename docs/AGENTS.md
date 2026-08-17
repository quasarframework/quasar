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
