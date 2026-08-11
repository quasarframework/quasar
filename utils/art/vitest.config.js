import { defineConfig } from 'vitest/config'

// Also stops Vitest from walking up to the repo-root projects config,
// whose relative paths would resolve against this package and fail.
export default defineConfig({
  test: {
    include: ['./**/*.test.js']
  }
})
