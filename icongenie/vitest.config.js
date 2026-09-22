import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // unit tests are colocated with their sources
    include: ['./lib/**/*.test.js', './bin/*.test.js'],
    // the bin tests spawn the CLI, the runner tests rasterize whole
    // asset sets
    testTimeout: 60_000
  }
})
