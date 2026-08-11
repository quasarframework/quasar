# docs Agent Guide

Supplements the repo-root `AGENTS.md`. This is the quasar.dev website — a
Quasar app itself (`quasar prepare` applies).

- Page content: `src/pages` (markdown); markdown build pipeline: `build/`.
- Unit tests are colocated with the `build/` and `src/` modules they
  cover (`{build,src}/**/*.test.js`, shared pipeline helper
  `build/ai-docs/test-helpers.js`); `pnpm test:unit` runs them — do so
  for any `build/` change. Menu/related-link integrity lives in
  `src/assets/menu.test.js` and `build/md/flat-menu.test.js`.
- `pnpm test` = `test:unit`, then `test:e2e:ssr` and `test:build`
  SEQUENTIALLY (`test/suites.js` — a build must never overlap the dev
  server: they share `.quasar`/`.q-cache`). `test:build` self-heals
  through `build/build-stamp.js` — the full site build (keep the
  `pnpm generate:search` step in the `build` chain: it is the search
  generator's only test coverage) runs only when its inputs changed.
  `test:e2e:ssr` SSR-loads every markdown route in a real browser,
  failing on hydration console output (same harness pattern as /ui's
  sweep); set `E2E_SERVER_URL` to audit a running `dev:ssr` session.
  CI: `.github/workflows/docs-tests.yml`.
- `pnpm dev` for a live preview of content changes.
