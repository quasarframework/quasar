/* eslint-env node */

import { configure } from 'quasar/wrappers'
import singleFile from './build/vite.plugin.single-file.js'

export default configure(() => ({
  eslint: {
    fix: true,
    warnings: true,
    errors: true
  },

  extras: [
    'roboto-font',
    'material-icons'
  ],

  build: {
    target: {
      browser: [ 'es2022' ],
      node: 'node16'
    },

    distDir: 'dist',

    vueRouterMode: 'history',
    vitePlugins: [
      [ singleFile() ]
    ]
  },

  devServer: {
    open: false
  }
}))
