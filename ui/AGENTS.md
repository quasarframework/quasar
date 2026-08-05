# ui Agent Guide

Supplements the repo-root `AGENTS.md`, which still applies. Run all commands
from `/ui`, not `/ui/testing`.

Any user-observable change here (options, defaults, requirements, behavior,
performance, setup) is incomplete until the covering docs pages in
`docs/src/pages` (search there for the option/feature name) are updated in
the same change set.

## Test specifications

Read `testing/README.md` before creating or editing `src/**/*.test.js`.

1. Build first: `pnpm build`.
2. Run `pnpm test:specs --target <source_file>` (no extension). Use a subpath
   relative to `/ui/src` when a filename matches multiple sources, e.g.
   `utils/date/date` — not a broad `date`.
3. Accept every required case the Specs script offers; do not skip or ignore
   one merely to pass validation.
4. Replace every generated `test.todo()` with a real behavioral test; leave no
   `.todo()`/`.skip()` on any `describe()`/`test()`.
5. Preserve the generated `describe()` statements and identifiers; align
   failing existing files with the exact hierarchy the script reports.
6. Rerun the same target until the script reports success.
7. Run the focused Vitest file while developing, then root `pnpm test` after
   editing any existing or new test file.

If the Specs script itself changes, also run the extra validation from
`testing/README.md`: build the UI, `pnpm test:specs --dry-run`,
`pnpm test:specs:ci`, then root `pnpm test`.

### Test design

- Test public behavior and reusable structure, not a snapshot of the current
  implementation.
- For generic Vue prop/emit declaration tests, use the `$props()`/`$emits()`
  matchers from `testing/vitest.setup.js`; do not duplicate exact names,
  types, defaults, validators, or ordering merely to prove a declaration
  valid — changing an unrelated prop/event must not break such a test.
- Still assert an exact prop, event, default, validator, or payload when that
  specific public behavior is the subject of the test.
- Apply the same principle to other exported definitions: prefer structural
  matchers (`$objectValues()`, `$arrayValues()`); when a recurring form has no
  suitable matcher, add a reusable one to `testing/vitest.setup.js` instead
  of repeating implementation-specific assertions.
