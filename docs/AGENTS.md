# docs Agent Guide

Supplements the repo-root `AGENTS.md`. This is the quasar.dev website — a
Quasar app itself (`quasar prepare` applies).

- Page content: `src/pages` (markdown); markdown build pipeline: `build/`.
- `pnpm test` (from `/docs`) covers the markdown/AI-docs build pipeline —
  run it for any `build/` change. CI: `.github/workflows/docs-tests.yml`.
- `pnpm dev` for a live preview of content changes.
