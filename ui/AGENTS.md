# ui Agent Guide

Supplements the repo-root `AGENTS.md`. Run all commands from `/ui`, not
`/ui/test`.

## Test specifications

Read `test/README.md` before creating or editing `src/**/*.test.js`.

1. `pnpm test:specs --target <source_file>` (no extension); use a subpath
   relative to `/ui/src` when a filename is ambiguous (`utils/date/date`,
   not `date`).
2. Accept every required case the Specs script offers; never skip or
   ignore one merely to pass validation.
3. Replace every generated `test.todo()` with a real behavioral test; no
   `.todo()`/`.skip()` may remain on any `describe()`/`test()`.
4. Preserve the generated `describe()` statements and identifiers; align
   failing files with the exact hierarchy the script reports.
5. Rerun the same target until the script reports success.
6. Focused Vitest file while developing; root `pnpm test` after editing
   any test file.

If the Specs script itself changes, also run the extra validation from
`test/README.md`: `pnpm test:specs --dry-run`, `pnpm test:specs:ci`,
then root `pnpm test`.

### Test design

- Test public behavior and reusable structure, not a snapshot of the
  implementation.
- For generic prop/emit declaration tests, use the `$props()`/`$emits()`
  matchers from `test/vitest.setup.js`; don't duplicate exact names,
  types, defaults, validators or ordering just to prove a declaration
  valid — changing an unrelated prop/event must not break such a test.
- DO assert an exact prop, event, default, validator or payload when that
  specific behavior is the subject of the test.
- Same principle for other exported definitions: prefer structural
  matchers (`$objectValues()`, `$arrayValues()`); if a recurring form has
  no matcher, add a reusable one to `test/vitest.setup.js` instead of
  repeating implementation-specific assertions.

## Hydration tests

`pnpm test:hydration` (separate from the Specs workflow): colocated
`src/**/*.hydration.test.js` + sibling `*.hydration.fixtures.js`,
rendered by the built server bundle AND by ui/src — keep `dist` fresh
and fixtures deterministic. The harness contract (takeover rule,
`quasarOptions`, `setupApp`/router) is documented in
`test/hydration/hydrate.js`.

`pnpm test:e2e:ssr` SSR-loads every playground route in a real browser
and fails on hydration console output — playground pages must keep
their server-rendered data deterministic (no `Math.random()`/`uid()`/
live clocks in SSR markup; client-only data goes in `onMounted`).
