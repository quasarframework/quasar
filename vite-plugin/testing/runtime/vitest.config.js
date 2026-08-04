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
 * Exported so that the vitest-*.config.js variants can run the whole
 * suite through every transformation mode: AST/regex-fallback times
 * treeshaking/dev, plus the default-variables setup (no custom
 * variables file - see the test:runtime* scripts).
 */
export const createConfig = ({
  astAutoImport = true,
  devTreeshaking = true,
  customVariables = true
} = {}) =>
  defineConfig(() => ({
    plugins: [
      vue({
        template: { transformAssetUrls }
      }),

      quasar({
        devTreeshaking,
        sassVariables:
          customVariables === true
            ? resolve('src/quasar-variables.sass')
            : true,
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
      exclude: [
        // without dev treeshaking, "quasar" imports intentionally stay
        // on the aliased dev bundle instead of being mapped to per-file
        // paths, so the mapping-specific specs do not apply
        ...(devTreeshaking === true
          ? []
          : ['**/tests/js-transform.test.js', '**/tests/ts-transform.test.ts']),
        // these two suites assert opposing variable values: custom
        // overrides vs the framework defaults (served through the
        // prebuilt css alias)
        customVariables === true
          ? '**/tests/default-variables.test.js'
          : '**/tests/sass-transform.test.js'
      ],
      setupFiles: ['./testing/runtime/vitest.setup.js']
    }
  }))

export default createConfig()
