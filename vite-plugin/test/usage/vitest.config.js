import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globalSetup: './test/ensure-ui-built.js',
    include: ['./test/usage/tests/*.test.js']
  }
})
