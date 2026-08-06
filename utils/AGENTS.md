# utils Agent Guide

Supplements the repo-root `AGENTS.md`. Covers the small packages under
`/utils` (art, render-ssr-error, ssl-certificate, update-notifier).

- Bundled runtime dependencies of the CLIs (`cli`, `create-quasar`,
  `app-vite`) — behavior changes ripple into those.
- Each package has its own `test` script (vitest or plain node). Run from
  its folder, or all via root `pnpm --filter './utils/**' test`.
  CI: `.github/workflows/utils-tests.yml`.
