import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// We link directly to our plugin's source files;
// In production, it should be import { ... } from '@quasar/vite-plugin'
import { quasar, transformAssetUrls } from '../src'

const rootFolder = fileURLToPath(new URL('.', import.meta.url))
const resolve = _path => join(rootFolder, _path)

export default defineConfig(() => ({
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
      assets: '/src/assets'
    }
  },

  server: {
    open: '/'
  }
}))
