import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { quasar, transformAssetUrls } from '../../src/index.js'

const playgroundFolder = fileURLToPath(new URL('../../playground', import.meta.url))
const resolve = _path => join(playgroundFolder, _path)

export default defineConfig(() => {
  return {
    plugins: [
      vue({
        template: { transformAssetUrls }
      }),

      quasar({
        devTreeshaking: true,
        sassVariables: resolve('src/quasar-variables.sass'),
        autoImportComponentCase: 'combined'
      })
    ],

    resolve: {
      alias: {
        assets: resolve('src/assets'),
        playground: resolve('src/components')
      }
    },

    test: {
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
        './testing/runtime/tests/*.test.{js,ts}'
      ],
      setupFiles: [
        './testing/runtime/vitest.setup.js'
      ]
    }
  }
})
