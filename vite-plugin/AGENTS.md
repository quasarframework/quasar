# vite-plugin Agent Guide

Supplements the repo-root `AGENTS.md`, which still applies. Run all commands
from `/vite-plugin`.

- Any user-observable change here (options, defaults, requirements, behavior,
  performance, setup) is incomplete until the covering docs pages in
  `docs/src/pages` (search there for the option/feature name) are updated in
  the same change set.
- `pnpm test` runs every suite. Narrower: `test:usage` (plugin usage,
  node-only) and the `test:runtime*` variants (browser runtime; their
  `pretest:*` hooks install Playwright Chromium automatically).
- The runtime tests need a built `quasar` package: root `pnpm build` first on
  a fresh checkout.
