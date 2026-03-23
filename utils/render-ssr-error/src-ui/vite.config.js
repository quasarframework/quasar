import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

import singleFile from './build/vite.plugin.single-file.js'

const rootFolder = fileURLToPath(new URL('.', import.meta.url))
const resolve = _path => join(rootFolder, _path)

export default defineConfig(() => ({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),

    quasar({
      sassVariables: 'src/quasar.variables.sass',
      autoImportComponentCase: 'combined'
    }),

    singleFile()
  ],

  resolve: {
    alias: {
      src: resolve('src'),
      quasar: resolve('../../../ui')
    }
  },

  build: {
    outDir: 'dist'
  },

  server: {
    open: '/'
  }
}))
