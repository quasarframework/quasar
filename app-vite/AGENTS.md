# app-vite Agent Guide

Supplements the repo-root `AGENTS.md`.

- Unit tests are colocated: `lib/**/<file>.test.js` (npm-excluded via
  `files`). Touching a source file means updating its sibling test; a new
  testable file gets one; export internals when worth testing directly.
  Tests spawning the CLI must strip `NODE_PATH` from the child env (vitest
  points it at the monorepo pnpm store). `pnpm test:unit` (from
  `/app-vite`) runs them all — fast.
  CI: `.github/workflows/app-vite-tests.yml`.
- E2E: `/test` is e2e-only; `test/playground-suite.js` runs the same
  pipeline against both playgrounds (js + ts template variants), driving
  every mode through the real CLI — builds, mode add/remove, the
  production SSR webserver, dev servers with real HTTP checks, config
  hot-reload, vue-tsc typecheck. Run `pnpm test:e2e` (all), one mode via
  `pnpm test:e2e:<mode>`, one playground by appending a filename fragment.
  Needs the ui package built (`pnpm --dir ../ui build`); the Electron dev
  step briefly opens a real window locally. Slower — run before handoff
  when dev/build behavior may be affected. `pnpm test` (unit + e2e) gates
  publishing via `prepublishOnly`. Mode deps (electron "latest", the SSR
  webservers, workbox, @capacitor/*) resolve fresh from the registry BY
  DESIGN — an e2e failure without a repo change usually means an upstream
  release broke something. Invariants to preserve:
  - `playground-*/src-*` folders are generated + gitignored — never commit
    them; each mode step resets its own folder first, keeping every step
    self-sufficient (filtered `vitest -t` runs behave like full runs).
  - step titles stay regex-safe (no parens) and keep their mode token, so
    `-t` filters and the per-mode scripts select them.
  - values pinned from playground fixtures live only in
    `test/playground-suite.js > fixtureMarkers` and
    `lib/quasar-config-file.test.js > playgroundConfig`; the fixtures
    carry breadcrumb comments pointing back.
- Manual verification: the playgrounds (`pnpm dev`/`dev:ts`,
  `build`/`build:ts` from `/app-vite`) run the workspace app-vite, so
  they exercise the local code.
