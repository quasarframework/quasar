import { join } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { playwright } from '@vitest/browser-playwright'

import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

import { ssrRender } from './hydration/ssr-render-command.js'

const rootFolder = import.meta.dirname
const resolve = _path => join(rootFolder, _path)

function getReporterConfig() {
  if (process.env.GITHUB_ACTIONS) {
    return {
      outputFile: 'test-results/hydration-report.xml',
      reporters: 'junit'
    }
  }

  return {}
}

export default defineConfig(() => ({
  // the package root, so the config behaves the same from the /ui
  // scripts and from the workspace-root IDE projects config
  root: join(rootFolder, '..'),

  // suites may run concurrently (test/parallel.js) and each compiles
  // ui/src with different flags — a per-suite dep cache makes their
  // isolation explicit instead of relying on vite's hash-keyed
  // subdirectories inside a shared node_modules/.vite
  cacheDir: join(rootFolder, '../node_modules/.vite-hydration-tests'),

  plugins: [
    vue({
      template: { transformAssetUrls }
    }),

    quasar({
      // compile ui/src exactly like the client bundle of a real
      // hydrating app (__QUASAR_SSR__ + __QUASAR_SSR_CLIENT__ set),
      // so isRuntimeSsrPreHydration starts out true in the browser
      runMode: 'ssr-client',
      devTreeshaking: true,
      sassVariables: false,
      autoImportComponentCase: 'combined'
    })
  ],

  resolve: {
    alias: {
      testing: resolve('.'),
      quasar: resolve('..')
    }
  },

  test: {
    ...getReporterConfig(),
    name: 'ui-hydration',
    // dist freshness for run paths without the pretest hooks
    // (the workspace-root IDE projects config)
    globalSetup: './test/global-setup.js',
    globals: true,
    browser: {
      provider: playwright(),
      enabled: true,
      headless: true,
      screenshotFailures: false,
      viewport: { width: 1280, height: 800 },
      instances: [{ browser: 'chromium' }],
      // Node-side server pass: renders fixtures through the built
      // server bundle, the same one real SSR webservers load
      commands: { ssrRender }
    },
    include: ['src/**/*.hydration.test.js', 'test/hydration/*.test.js'],
    setupFiles: ['./test/hydration/vitest.setup.js']
  }
}))
