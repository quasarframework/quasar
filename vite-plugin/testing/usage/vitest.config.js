import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globalSetup: './testing/ensure-ui-built.js',
    include: ['./testing/usage/tests/*.test.js']
  }
})
