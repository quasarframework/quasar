import { join, normalize } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { playwright } from '@vitest/browser-playwright'

import { quasar, transformAssetUrls } from '../../src/index.js'

const playgroundFolder = normalize(
  join(import.meta.dirname, '../../playground')
)
const resolve = _path => join(playgroundFolder, _path)

/**
 * Exported so that vitest-fallback.config.js can run the whole suite
 * through the regex-based fallback transformation as well
 * (see the test:runtime:fallback script).
 */
export const createConfig = astAutoImport =>
  defineConfig(() => ({
    plugins: [
      vue({
        template: { transformAssetUrls }
      }),

      quasar({
        devTreeshaking: true,
        sassVariables: resolve('src/quasar-variables.sass'),
        autoImportComponentCase: 'combined',
        astAutoImport
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

export default createConfig(true)
