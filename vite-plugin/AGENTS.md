# vite-plugin Agent Guide

Supplements the repo-root `AGENTS.md`. Run all commands from
`/vite-plugin`.

- `pnpm test` runs every suite. Narrower: `test:usage` (plugin usage,
  node-only) and the `test:runtime*` variants (browser runtime; their
  `pretest:*` hooks install Playwright Chromium automatically).
- Values the tests pin from fixture/source files live only in
  `test/fixture-values.js`; the playground fixtures carry breadcrumb
  comments pointing back.
