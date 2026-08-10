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
      outputFile: 'test-results/hydration-pwa-report.xml',
      reporters: 'junit'
    }
  }

  return {}
}

export default defineConfig(() => ({
  // the package root, so the config behaves the same from the /ui
  // scripts and from the workspace-root IDE projects config
  root: join(rootFolder, '..'),

  // the SSR+PWA client build: pre-hydration is gated on the
  // data-server-rendered body attribute instead of unconditional
  // (the plugin respects an externally-defined PWA flag, exactly
  // like app-vite sets it)
  define: { __QUASAR_SSR_PWA__: true },

  plugins: [
    vue({
      template: { transformAssetUrls }
    }),

    quasar({
      runMode: 'ssr-client',
      devTreeshaking: true,
      sassVariables: false,
      autoImportComponentCase: 'combined'
    })
  ],

  resolve: {
    alias: {
      // "testing" (not "test": Node claims that as the node:test
      // builtin) maps to the /ui/test directory
      testing: resolve('.'),
      quasar: resolve('..')
    }
  },

  test: {
    ...getReporterConfig(),
    name: 'ui-hydration-pwa',
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
      commands: { ssrRender }
    },
    include: ['test/hydration-pwa/*.test.js'],
    setupFiles: ['./test/hydration-pwa/vitest.setup.js']
  }
}))
