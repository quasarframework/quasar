# app-vite Agent Guide

Supplements the repo-root `AGENTS.md`, which still applies.

- Any user-observable change here (options, defaults, requirements, behavior,
  performance, setup) is incomplete until the covering docs pages in
  `docs/src/pages` (search there for the option/feature name) are updated in
  the same change set.
- Tests are colocated with their source: `lib/**/<file>.test.js` (excluded
  from the npm package via the `files` field). When touching a source file,
  update/extend its sibling test; for a new testable file, add one. If an
  internal fn is worth testing directly, export it. `pnpm test:unit` (from
  `/app-vite`) runs them all — fast. CI: `.github/workflows/app-vite-tests.yml`.
- E2E tests (`test/*.test.js` — `/test` is e2e-only; `pnpm test:e2e`
  from `/app-vite`, or a single mode's slice via `pnpm test:e2e:<mode>`
  — spa|ssr|ssg|pwa|bex|electron|capacitor|cordova; append a filename
  fragment like `playground-js` to narrow to one playground) run the
  shared `test/playground-suite.js` pipeline against BOTH
  playgrounds (js + ts template variants), driving every mode through
  the real CLI: clean, prepare, SPA/SSR/SSG/PWA/BEX builds, an
  unpackaged Electron build, non-interactive Capacitor/Cordova mode
  installs (Cordova is skipped without a global `cordova` CLI; CI
  installs it), the production SSR webserver, mode add/remove, and
  dev servers with a real HTTP fetch for SPA/SSR/SSG/PWA/BEX/Electron
  (CI wraps the run in xvfb-run for Electron; cordova/capacitor dev
  needs a device/emulator and is not covered). The Electron dev step
  briefly launches a real Electron window locally. Slower — run before handoff when the change can affect
  dev/build behavior. They need the `quasar` (ui) package built
  (`pnpm --dir ../ui build`). All non-SPA mode folders
  (`playground-*/src-*`) are generated and gitignored — never commit
  them; every mode step deletes its own folder right before running, so
  each step is self-sufficient — full runs and filtered (`vitest -t`)
  runs behave identically and always exercise the CLI's full mode
  auto-install (SSR falls back to the hono webserver when it cannot
  prompt). Values pinned from playground fixtures live in ONE place —
  `test/playground-suite.js > fixtureMarkers` (and
  `lib/quasar-config-file.test.js > playgroundConfig`); the fixtures
  carry breadcrumb comments pointing back. Keep it that way.
- Manual verification happens through `/app-vite/playground-js` and
  `/app-vite/playground-ts` (`pnpm dev` / `pnpm dev:ts`, `build` /
  `build:ts` from `/app-vite`). The playgrounds use the workspace
  app-vite, so they exercise the local code.
