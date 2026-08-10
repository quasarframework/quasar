import { join } from 'node:path'

import { defineConfig } from 'vite'

const rootFolder = import.meta.dirname

function getReporterConfig() {
  if (process.env.GITHUB_ACTIONS) {
    return {
      outputFile: 'test-results/e2e-ssr-report.xml',
      reporters: 'junit'
    }
  }

  return {}
}

// Node-side e2e: boots the playground in SSR dev mode and crawls every
// route with a real browser, failing on hydration console output.
export default defineConfig(() => ({
  // the package root, so the config behaves the same from the /ui
  // scripts and from the workspace-root IDE projects config
  root: join(rootFolder, '..'),

  test: {
    ...getReporterConfig(),
    include: ['test/e2e-ssr/*.test.js'],
    // the SSR dev server compiles on first boot and pages compile
    // lazily on first visit — both need generous ceilings
    hookTimeout: 240_000,
    testTimeout: 600_000
  }
}))
