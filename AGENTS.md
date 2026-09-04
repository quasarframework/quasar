# Quasar Repository Agent Guide

Applies repo-wide; a nested `AGENTS.md` takes precedence for its directory
(most packages have one — check).

When editing any `AGENTS.md` (this one included), keep it to commands,
package-specific gotchas and pointers into code. State repo-wide
mechanics once — here, not per package; leave design rationale to code
comments; drop whatever an agent can discover from the code or never
acts on. Exception: procedures that must be followed exactly (e.g.
/ui's Specs workflow) earn their length.

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
  related tests, types, API JSON and the covering `docs/src/pages` pages —
  including their `docs/src/examples` components — (search there for the
  option/feature name) are updated in the same change set.

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
- A ref that holds a DOM element or a component instance/definition is
  never a `ref()`: `shallowRef(null)` in render-function code,
  `useTemplateRef()` in SFCs (`<script setup>` and `setup()` alike).

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
- Root `pnpm test:all` runs every package's full suite — hours long,
  meant for release-grade sweeps, never routine development.
- Tests, dev servers and builds that need the built ui package
  self-heal: they build it only when `ui/dist` is missing or stale
  (`ui/build/build-stamp.js`), so expect an occasional multi-minute ui
  build mid-command. The scaffolding e2e suites install the monorepo's
  own packages through a throwaway local registry
  (`create-quasar/test/e2e/local-registry.js`) — published npm packages
  are never tested; after publishing a release train, sanity-check the
  uploads with `npm create quasar@latest` in a temp dir.
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
- Tests may write only to OS temp dirs or gitignored generated paths. A
  test that must mutate a tracked repo file follows app-vite's e2e
  backup/restore protocol (pristine copy to a gitignored sibling before
  modifying, self-heal from it on the next run) so a killed run can never
  leave the worktree dirty.
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
