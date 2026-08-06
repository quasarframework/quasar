# vite-plugin Agent Guide

Supplements the repo-root `AGENTS.md`. Run all commands from
`/vite-plugin`.

- `pnpm test` runs every suite. Narrower: `test:usage` (plugin usage,
  node-only) and the `test:runtime*` variants (browser runtime; their
  `pretest:*` hooks install Playwright Chromium automatically).
- The runtime tests need a built `quasar` package: root `pnpm build` first
  on a fresh checkout.
- Values the tests pin from fixture/source files live only in
  `testing/fixture-values.js`; the playground fixtures carry breadcrumb
  comments pointing back.
