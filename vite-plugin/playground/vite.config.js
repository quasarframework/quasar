import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// eslint-disable-next-line import-x/default -- can't detect `as default`
import vitePluginChecker from 'vite-plugin-checker'

const rootFolder = fileURLToPath(new URL('.', import.meta.url))
const resolve = _path => join(rootFolder, _path)

// We link directly to our plugin's source files;
// In production, it should be import { ... } from '@quasar/vite-plugin'
import { quasar, transformAssetUrls } from '../src'

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
      }),

      vitePluginChecker({
        root: resolve('../'),
        eslint: {
          lintCommand: 'eslint "./**/*.{js,mjs,cjs,vue}"',
          useFlatConfig: true
        }
      })
    ],

    resolve: {
      alias: {
        assets: '/src/assets'
      }
    },

    server: {
      open: '/'
    }
  }
})
