# docs Agent Guide

Supplements the repo-root `AGENTS.md`. This is the quasar.dev website — a
Quasar app itself (`quasar prepare` applies).

- Page content: `src/pages` (markdown); markdown build pipeline: `build/`.
- `pnpm test` (from `/docs`) covers the markdown/AI-docs build pipeline —
  run it for any `build/` change. Keep the `pnpm generate:search` step
  in the `build` chain: it is the search generator's only test coverage.
  CI: `.github/workflows/docs-tests.yml`.
- `pnpm dev` for a live preview of content changes.
