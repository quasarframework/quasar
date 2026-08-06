import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // unit tests are colocated with their sources; the e2e tests
    // (test/e2e) boot servers and scaffold full projects, so they only
    // run through the dedicated test:e2e script
    include: ['./lib/**/*.test.js', './bin/*.test.js'],
    // some unit tests spawn the CLI binary
    testTimeout: 30_000
  }
})
