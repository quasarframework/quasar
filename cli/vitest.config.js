import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // the e2e tests (test/e2e) boot servers and scaffold full projects;
    // they only run through the dedicated test:e2e script
    include: ['./test/unit/*.test.js'],
    // some unit tests spawn the CLI binary
    testTimeout: 30_000
  }
})
