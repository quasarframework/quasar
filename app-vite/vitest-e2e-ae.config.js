import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // boots the shared local registry (monorepo packages + the qe2e
    // fixture extension) for the AE package-lifecycle suite; the
    // playground e2e (vitest-e2e.config.js) does not need it and so
    // does not pay for it
    globalSetup: './test/ae-lifecycle/global-setup.js',
    include: ['./test/ae-lifecycle/*.test.js'],
    reporters: 'verbose',
    // a real package-manager install against the local registry
    testTimeout: 600_000,
    hookTimeout: 600_000
  }
})
