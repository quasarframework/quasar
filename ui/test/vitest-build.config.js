import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // dist freshness for the server-bundle tests (the pretest hook
    // covers the package script, this covers direct vitest runs)
    globalSetup: './test/global-setup.js',
    include: ['./build/**/*.test.js', './test/server-bundle/*.test.js']
  }
})
