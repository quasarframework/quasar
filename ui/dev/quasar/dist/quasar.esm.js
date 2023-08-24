// Vite plugin assumes a `quasar` package exists in the project and replace the import with `quasar/dist/quasar.esm.js`,
// but for `ui/dev` this isn't true, so it tries to imports from a non-existing `ui/dev/quasar/dist/quasar.esm.js`.
// This file fixes that broken import by manually re-exporting the needed code.
// We could link to '../../../dist/quasar.esm.js' instead, as we need the build result for transforms and api,
// but it would require a full re-build everytime.
// Read more about the problem into `ui/test/cypress/README.md`
// If removed, remove the corresponding line into .gitignore files
export * from '../../../src/index.dev.js'
