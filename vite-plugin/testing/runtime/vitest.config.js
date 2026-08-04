import { join, normalize } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { playwright } from '@vitest/browser-playwright'

import { quasar, transformAssetUrls } from '../../src/index.js'

const playgroundFolder = normalize(
  join(import.meta.dirname, '../../playground')
)
const resolve = _path => join(playgroundFolder, _path)

export default defineConfig(() => ({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),

    quasar({
      devTreeshaking: true,
      sassVariables: resolve('src/quasar-variables.sass'),
      autoImportComponentCase: 'combined',
      // allows exercising the regex-based fallback transformation
      // through the whole runtime suite (see test:runtime:fallback)
      astAutoImport: process.env.QUASAR_VITE_PLUGIN_AST !== 'false'
    })
  ],

  resolve: {
    alias: {
      // mount()/shallowMount() attach to the document by default
      // (needed for computed styles and layout in a real browser)
      '@vue/test-utils': join(import.meta.dirname, 'test-utils.js'),
      '@': resolve('src')
    }
  },

  test: {
    globals: true,
    browser: {
      provider: playwright(),
      enabled: true,
      headless: true,
      screenshotFailures: false,
      viewport: { width: 1280, height: 800 },
      // at least one instance is required
      instances: [{ browser: 'chromium' }]
    },
    css: {
      include: [/.+/]
    },
    include: ['./testing/runtime/tests/*.test.{js,ts}'],
    setupFiles: ['./testing/runtime/vitest.setup.js']
  }
}))
