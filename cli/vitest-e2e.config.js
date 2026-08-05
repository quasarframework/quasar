import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['./test/e2e/*.test.js'],
    // list each step as it finishes; with the default reporter,
    // a long run only shows a single collapsed file line
    reporters: 'verbose',
    // the project e2e test installs dependencies of a scaffolded app
    testTimeout: 600_000,
    hookTimeout: 600_000
  }
})
