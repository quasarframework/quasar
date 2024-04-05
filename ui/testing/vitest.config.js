import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const rootFolder = fileURLToPath(new URL('.', import.meta.url))
const resolve = _path => join(rootFolder, _path)

import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

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
        quasar: resolve('..')
      }
    },

    test: {
      globals: true,
      environment: 'jsdom',
      // browser: {
      //   enabled: true,
      //   headless: true,
      //   name: 'chrome'
      // },
      css: {
        include: [ /.+/ ]
      },
      include: [ '../src/**/*.test.js' ],
      setupFiles: [
        './setup.js'
      ]
    }
  }
})
