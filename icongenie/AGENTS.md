# icongenie Agent Guide

Supplements the repo-root `AGENTS.md`.

- NOT part of the pnpm workspace: root `pnpm i` does not install it and
  `pnpm --filter` cannot reach it. Run `pnpm i` and all commands from
  `/icongenie` itself.
- No test suite; verify changes by running the CLI directly
  (`node bin/icongenie.js <command>`).
