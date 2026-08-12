import { join } from 'node:path'

import { defineConfig } from 'vite'

const rootFolder = import.meta.dirname

function getReporterConfig() {
  if (process.env.GITHUB_ACTIONS) {
    return {
      outputFile: 'test-results/umd-report.xml',
      reporters: 'junit'
    }
  }

  return {}
}

// Node-side suite over the published UMD artifacts, loaded into a real
// browser page next to the global Vue build (the CDN usage pattern):
// the global surface of both bundle flavors, every lang-pack/icon-set
// UMD asset, in-DOM (runtime compiler) boot, install config and the
// missing-Vue guard — the only coverage these dist artifacts have.
export default defineConfig(() => ({
  // the package root, so the config behaves the same from the /ui
  // scripts and from the workspace-root IDE projects config
  root: join(rootFolder, '..'),

  test: {
    ...getReporterConfig(),

    // each test file drives its own chromium; serialize them on the
    // memory-constrained CI runners
    fileParallelism: !process.env.GITHUB_ACTIONS,

    include: ['test/umd/*.test.js'],
    testTimeout: 60_000,
    // page setup loads the two bundles plus ~170 lang/icon-set scripts
    hookTimeout: 60_000
  }
}))
