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

// Node-side smoke over the published UMD bundle: loads it into a real
// browser page next to the global Vue build and boots an app — the
// only coverage this dist artifact has.
export default defineConfig(() => ({
  // the package root, so the config behaves the same from the /ui
  // scripts and from the workspace-root IDE projects config
  root: join(rootFolder, '..'),

  test: {
    ...getReporterConfig(),
    include: ['test/umd/*.test.js'],
    testTimeout: 60_000
  }
}))
