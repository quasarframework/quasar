import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globalSetup: './vitest.global-setup.js',
    // /test hosts the e2e suite exclusively (unit tests are colocated
    // with their sources under /lib)
    include: ['./test/*.test.js'],
    // list each step as it finishes; with the default reporter, a
    // long-running suite only shows a single collapsed file line
    reporters: 'verbose',
    // one playground at a time: each step already parallelizes internally
    // (vite/rolldown builds), so interleaving two playgrounds would just
    // oversubscribe the machine and blur failure output
    fileParallelism: false,
    // each playground compiles multiple build modes and boots servers
    testTimeout: 600_000,
    hookTimeout: 600_000
  }
})
