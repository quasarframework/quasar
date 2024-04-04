import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import vitePluginChecker from 'vite-plugin-checker'

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

      // vitePluginChecker({
      //   root: resolve('../'),
      //   eslint: {
      //     lintCommand: 'eslint --report-unused-disable-directives "./**/*.{js,mjs,cjs,vue}"'
      //   }
      // })
    ],

    resolve: {
      alias: {
        test: resolve('.'),
        quasar: resolve('..')
        // 'quasar/dist/quasar.sass': resolve('../src/css/index.sass'),
        // 'quasar/icon-set': resolve('../icon-set'),
        // 'quasar/lang': resolve('../lang'),
        // 'quasar/src': resolve('../src')
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
      include: [ '../src/**/*.{test,spec}.js' ],
      setupFiles: [
        './setup.js'
      ]
    }
  }
})
