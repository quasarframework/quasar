# create-quasar Agent Guide

Supplements the repo-root `AGENTS.md`, which still applies. Run all commands
from `/create-quasar`.

## Layout

- `bin/create-quasar.js` — CLI entry: arg parsing/validation.
- `lib/` — scaffolding logic; `lib/template.js` is the templating engine.
- `templates/{app,ae}/` — rendered per preset; a leading `_` in a filename is
  stripped on render (`_package.json` → `package.json`).

## Tests

- `pnpm test:unit` — fast; run for any change here. The scaffold tests render
  every preset combo into temp dirs, so template errors surface there first.
- `pnpm test:e2e:app` / `test:e2e:ae` — per combo: scaffold with real
  dependency install → lint → build → dev-server boot. The full matrix takes
  far too long; run ONE combo matching the touched files, selected via env
  vars (app: `E2E_INSTALL`, `E2E_SCRIPT`, `E2E_LINTER`, `E2E_FBR`,
  `E2E_ALL_PRESETS`; ae: `E2E_SCRIPT`, `E2E_LINT`), e.g.
  `E2E_SCRIPT=ts E2E_LINTER=eslint pnpm test:e2e:app`. CI runs the full
  matrix (`.github/workflows/create-quasar-tests.yml`).

## Gotchas

- The CLI refuses to run inside a Quasar project; scaffold manual/e2e runs in
  a dir outside any project (tests use the OS temp dir).
- A failed dependency install does NOT fail the CLI (exit 0); verify
  `node_modules` exists instead.
- E2E failures print a "reproduce manually" command block; after a combo step
  fails, its remaining steps auto-skip.
