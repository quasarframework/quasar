# Quasar Repository Agent Guide

Applies repo-wide; a more deeply nested `AGENTS.md` takes precedence for its
directory.

## Workflow

- pnpm workspace. Run commands from the repo root unless a package's docs
  require another directory.
- Formatting: `oxfmt`; linting: `oxlint` — wired into the root
  `lint`/`lint:check` scripts and the `lint-staged` pre-commit hook. Do not
  introduce Prettier, ESLint, or any other formatter/linter.
- Before changing a package, inspect its `package.json`, nearby tests, and
  package READMEs.
- Keep changes focused; do not modify, discard, or commit unrelated work
  already in the worktree.
- Follow existing code/test patterns. When a public contract changes, update
  related tests, types, API JSON, and documentation.
- Website docs live in `docs/src/pages`. Any user-observable change to `/ui`,
  `/app-vite`, or `/vite-plugin` (options, defaults, requirements, behavior,
  performance, setup) is incomplete until the covering docs pages (search
  there for the option/feature name) are updated in the same change set.

## Code style

- Do not compare a native JS method's strict-boolean result (`RegExp.test()`,
  `Array.some()`/`every()`/`includes()`, `Set.has()`, `Map.has()`,
  `String.includes()`/`startsWith()`/`endsWith()`, `Object.hasOwn()`,
  `Number.isNaN()`, `existsSync()`, and the like) against `=== true`/
  `=== false`; use the value directly or negate with `!`.
- Keep the explicit comparison when the value is not a guaranteed strict
  boolean — user-provided options, possibly-`undefined` values, or calls to
  project functions (their implementation can change to return a non-boolean
  and silently break truthiness-based call sites).

## UI test specifications

Read `ui/testing/README.md` before creating or editing `ui/src/**/*.test.js`.
Run all `test:specs` commands from `/ui`, not `/ui/testing`.

1. Build first: `cd ui && pnpm build`.
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
`ui/testing/README.md`: build the UI, `pnpm test:specs --dry-run`,
`pnpm test:specs:ci`, then root `pnpm test`.

### Test design

- Test public behavior and reusable structure, not a snapshot of the current
  implementation.
- For generic Vue prop/emit declaration tests, use the `$props()`/`$emits()`
  matchers from `ui/testing/vitest.setup.js`; do not duplicate exact names,
  types, defaults, validators, or ordering merely to prove a declaration
  valid — changing an unrelated prop/event must not break such a test.
- Still assert an exact prop, event, default, validator, or payload when that
  specific public behavior is the subject of the test.
- Apply the same principle to other exported definitions: prefer structural
  matchers (`$objectValues()`, `$arrayValues()`); when a recurring form has no
  suitable matcher, add a reusable one to `ui/testing/vitest.setup.js` instead
  of repeating implementation-specific assertions.

## Generated Quasar configuration

- `quasar dev`/`quasar build` generate `.quasar/tsconfig.json` and related
  type files; `quasar prepare` generates them without a dev server or build.
- Prepare after a fresh checkout or clean worktree, after dependency/config
  changes affecting generated types, and whenever lint or typechecking reports
  `.quasar/tsconfig.json` missing or unreadable.
- Root `pnpm prepare:types` prepares all workspace packages defining that
  script; `pnpm --dir <app-directory> exec quasar prepare --silent` prepares
  one app.
- `.quasar` is generated output; do not edit or commit its contents.

## Validation

- Run the narrowest relevant test while developing and the package's complete
  relevant suite before handoff.
- Run `pnpm lint` when the change can affect linted source: it runs `oxfmt`
  (rewrites files in place) then `oxlint --fix`; review the resulting diff and
  hand-fix whatever `oxlint` still reports. Do not use `pnpm lint:check` to
  find formatting issues — it is a read-only CI gate.
- Run `git diff --check` before committing.
- Do not weaken assertions, ignore generated cases, or change production
  behavior solely to make a failing test pass; diagnose the contract first.
- Report every validation command run and its outcome; if a required command
  cannot run, state the exact blocker.

## Pull requests

- One logical change per PR. Include root cause/motivation, user/developer
  impact, and validation results in the description.
- Call out public API, SSR, hydration, platform, accessibility, or security
  implications when applicable.
- No unrelated dependency, lockfile, formatting, or generated-file changes.
- Automated review output (CodeRabbitAI and others) is advisory: verify each
  claim against the current code, tests, generated Specs requirements, and
  intended public contract; apply valid findings, reject or explain
  incorrect, stale, duplicate, or speculative ones — never change code or
  weaken tests merely to satisfy a bot.
