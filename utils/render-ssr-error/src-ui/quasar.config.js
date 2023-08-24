/* eslint-env node */

const { configure } = require('quasar/wrappers')
const singleFile = require('./build/vite.plugin.single-file.js')

module.exports = configure(() => ({
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
