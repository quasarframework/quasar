# Quasar Repository Agent Guide

Applies repo-wide; a more deeply nested `AGENTS.md` takes precedence for its
directory. Nested guides: `app-vite/AGENTS.md`, `cli/AGENTS.md`,
`create-quasar/AGENTS.md`, `docs/AGENTS.md`, `icongenie/AGENTS.md`,
`ui/AGENTS.md`, `utils/AGENTS.md`, `vite-plugin/AGENTS.md`.

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
  related tests, types, API JSON, and documentation (website docs live in
  `docs/src/pages`).

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
