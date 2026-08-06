# cli Agent Guide

Supplements the repo-root `AGENTS.md`. This is the GLOBAL `quasar` CLI;
inside a project it defers to the locally installed
`@quasar/app-vite`/`@quasar/app-webpack` CLI (see `bin/quasar.js`).

## Tests

Run from `/cli`.

- `pnpm test:unit` — fast; run for any change here. Includes spawned-binary
  tests of every fast CLI path (help/version/errors/deferral stubs).
- `pnpm test:e2e` — boots real `quasar serve` servers and scaffolds a real
  project via `create-quasar` (pnpm install + registry access) to test
  local CLI deferral and `upgrade`.
  CI: `.github/workflows/cli-tests.yml`.

## Gotchas

- `lib/app-paths.js` and `lib/node-packager.js` resolve the project at
  import time from `process.cwd()`; tests chdir into temp projects before
  importing.
- Tests spawning the binary must strip `NODE_PATH` from the child env:
  vitest points it at the monorepo pnpm store, letting the CLI resolve
  packages a real user would not have.
