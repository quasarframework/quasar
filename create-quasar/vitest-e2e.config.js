import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['./test/e2e/*.test.js'],
    // list each combo step as it finishes; with the default reporter,
    // a long matrix run only shows a single collapsed file line
    reporters: 'verbose',
    // each e2e combo installs dependencies, builds the project
    // and boots the dev server
    testTimeout: 600_000,
    hookTimeout: 600_000
  }
})
