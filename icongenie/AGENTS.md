# icongenie Agent Guide

Supplements the repo-root `AGENTS.md`.

- `pnpm test` (vitest): unit tests colocated with their sources
  (`lib/**/*.test.js`, `bin/*.test.js`); run one with
  `pnpm exec vitest run lib/utils/parse-argv.test.js`.
- The project folder (`lib/utils/app-paths.js`) is resolved from the
  cwd ONCE, when the module loads, and most modules import it: a test
  that needs its own folder does `process.chdir(<os temp dir>)` BEFORE
  dynamically importing the module under test (and `vi.resetModules()`
  to load it again under another cwd). Without a `quasar.config.*` up
  the tree the cwd itself is the project folder.
- Pixel-exact assertions need `quality: 12`: every other level
  re-encodes pngs as a lossy palette (`lib/utils/get-compression.js`).
- Profile files hold colors WITHOUT the `#` (added when parsed).
- Error paths call `process.exit(1)`: mock it to throw.
