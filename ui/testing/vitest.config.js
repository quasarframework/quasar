import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const rootFolder = fileURLToPath(new URL('.', import.meta.url))
const resolve = _path => join(rootFolder, _path)

import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

function getReporterConfig () {
  if (process.env.GITHUB_ACTIONS) {
    return {
      outputFile: 'test-results/report.xml',
      reporters: 'junit'
    }
  }

  return {}
}

export default defineConfig(() => {
  return {
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
        testing: resolve('.'),
        quasar: resolve('..')
      }
    },

    test: {
      ...getReporterConfig(),
      globals: true,
      environment: 'jsdom',
      environmentOptions: {
        pretendToBeVisual: true
      },
      // browser: {
      //   enabled: true,
      //   headless: true,
      //   name: 'chrome'
      // },
      css: {
        include: [ /.+/ ]
      },
      include: [
        '../src/**/*.test.js'
      ],
      setupFiles: [
        './vitest.setup.js'
      ]
    }
  }
})
