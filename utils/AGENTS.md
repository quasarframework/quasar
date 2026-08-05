# utils Agent Guide

Supplements the repo-root `AGENTS.md`, which still applies. Covers the
small packages under `/utils` (art, render-ssr-error, ssl-certificate,
update-notifier).

- They are bundled runtime dependencies of the CLIs (`cli`,
  `create-quasar`, `app-vite`) — behavior changes ripple into those.
- Each package has its own `test` script (vitest or plain node). Run one
  from its folder, or all via root
  `pnpm --filter './utils/**' test`. CI: `.github/workflows/utils-tests.yml`.
