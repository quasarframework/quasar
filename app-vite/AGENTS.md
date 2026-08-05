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
- Manual verification happens through `/app-vite/playground-js` and
  `/app-vite/playground-ts` (`pnpm dev` / `pnpm dev:ts`, `build` /
  `build:ts` from `/app-vite`). The playgrounds use the workspace
  app-vite, so they exercise the local code.
