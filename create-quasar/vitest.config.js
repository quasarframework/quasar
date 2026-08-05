import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['./test/**/*.test.js'],
    // scaffolding & CLI tests spawn processes and render full templates
    testTimeout: 30_000
  }
})
