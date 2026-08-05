import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // tests are colocated with their source file (<file>.test.js);
    // the npm package excludes them via the "files" field
    include: ['./lib/**/*.test.js'],
    // some tests spawn the CLI binary
    testTimeout: 30_000
  }
})
