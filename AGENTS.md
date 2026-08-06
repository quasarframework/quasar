# Quasar Repository Agent Guide

Applies repo-wide; a nested `AGENTS.md` takes precedence for its directory
(most packages have one — check).

## Workflow

- pnpm workspace; run commands from the repo root unless a package's docs
  say otherwise.
- Formatting `oxfmt`, linting `oxlint` (root `lint`/`lint:check` scripts,
  lint-staged pre-commit). Never introduce Prettier, ESLint or any other
  formatter/linter.
- Before changing a package, inspect its `package.json`, nearby tests and
  READMEs.
- Keep changes focused; don't modify, discard or commit unrelated work
  already in the worktree.
- Follow existing code/test patterns. Any user-observable change (options,
  defaults, requirements, behavior, performance, setup) is incomplete until
  related tests, types, API JSON and the covering `docs/src/pages` pages
  (search there for the option/feature name) are updated in the same
  change set.

## Code style

- Never compare a native method's guaranteed-strict-boolean result
  (`RegExp.test()`, `some()`/`every()`/`includes()`, `has()`,
  `startsWith()`/`endsWith()`, `Object.hasOwn()`, `Number.isNaN()`,
  `existsSync()`, …) against `=== true`/`=== false`; use it directly or
  negate with `!`.
- DO keep explicit comparisons for non-guaranteed booleans: user-provided
  options, possibly-`undefined` values, project functions (their
  implementation can drift to non-boolean returns and silently break
  truthiness-based call sites).

## Generated Quasar configuration

- `quasar dev`/`build` generate `.quasar/` (tsconfig + type files);
  `quasar prepare` does the same without a dev server or build.
- Prepare after a fresh/clean checkout, after dependency/config changes
  affecting generated types, and whenever lint/typechecking reports
  `.quasar/tsconfig.json` missing or unreadable.
- Root `pnpm prepare:types` prepares all packages defining that script;
  `pnpm --dir <app-dir> exec quasar prepare --silent` prepares one app.
- `.quasar` is generated output; never edit or commit it.

## Validation

- Narrowest relevant test while developing; the package's complete relevant
  suite before handoff.
- Run `pnpm lint` when linted source may be affected: it runs `oxfmt`
  (rewrites in place) then `oxlint --fix`; review the diff and hand-fix
  what `oxlint` still reports. `pnpm lint:check` is a read-only CI gate —
  not for finding issues.
- Run `git diff --check` before committing.
- Never weaken assertions, ignore generated cases or change production
  behavior just to make a failing test pass; diagnose the contract first.
- Don't scatter fixture-content or presentation-formatting literals through
  assertions. Prefer, in order: derive the expected value from the fixture
  itself; assert semantic shape via regex (label + value, never column
  padding); else declare ONE named constant documenting the owning file,
  with a breadcrumb comment at the fixture pointing back. Test-created
  values may be asserted directly.
- Report every validation command run and its outcome; if one can't run,
  state the exact blocker.

## Pull requests

- One logical change per PR; describe root cause/motivation, user/developer
  impact and validation results.
- Call out public API, SSR, hydration, platform, accessibility or security
  implications when applicable.
- No unrelated dependency, lockfile, formatting or generated-file changes.
- Automated review output (CodeRabbitAI etc.) is advisory: verify each
  claim against current code, tests, generated Specs and the intended
  contract; apply valid findings, reject or explain the rest — never change
  code or weaken tests merely to satisfy a bot.
