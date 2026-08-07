import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['./test/e2e/*.test.js'],
    // boots a local registry serving the monorepo's own packages to the
    // scaffolded project — the e2e always tests local code, never
    // published packages; the setup (and the registry mechanics) live
    // with create-quasar, whose scaffolder these e2e tests already drive
    globalSetup: '../create-quasar/test/e2e/local-registry.js',
    // list each step as it finishes; with the default reporter,
    // a long run only shows a single collapsed file line
    reporters: 'verbose',
    // the project e2e test installs dependencies of a scaffolded app
    testTimeout: 600_000,
    hookTimeout: 600_000
  }
})
