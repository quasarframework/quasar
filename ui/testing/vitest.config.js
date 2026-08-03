import { join } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { playwright } from '@vitest/browser-playwright'

import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

const rootFolder = import.meta.dirname
const resolve = _path => join(rootFolder, _path)

function getReporterConfig() {
  if (process.env.GITHUB_ACTIONS) {
    return {
      outputFile: 'test-results/report.xml',
      reporters: 'junit'
    }
  }

  return {}
}

export default defineConfig(() => ({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),

    quasar({
      devTreeshaking: true,
      sassVariables: false,
      autoImportComponentCase: 'combined'
    })
  ],

  resolve: {
    alias: {
      // mount()/shallowMount() attach to the document by default
      // (needed for computed styles and layout in a real browser)
      '@vue/test-utils': resolve('runtime/test-utils.js'),
      testing: resolve('.'),
      quasar: resolve('..')
    }
  },

  test: {
    ...getReporterConfig(),
    globals: true,
    browser: {
      provider: playwright(),
      enabled: true,
      headless: true,
      screenshotFailures: false,
      // a desktop-sized viewport; tests needing other sizes
      // change it with page.viewport()
      viewport: { width: 1280, height: 800 },
      // at least one instance is required
      instances: [{ browser: 'chromium' }]
    },
    css: {
      include: [/.+/]
    },
    include: ['../src/**/*.test.js'],
    setupFiles: ['./vitest.setup.js']
  }
}))
