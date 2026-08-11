import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // the e2e tests (test/e2e) install dependencies and build full
    // projects; they only run through the dedicated test:e2e script
    include: ['./test/unit/*.test.js'],
    // scaffolding & CLI tests spawn processes and render full templates
    testTimeout: 30_000
  }
})
