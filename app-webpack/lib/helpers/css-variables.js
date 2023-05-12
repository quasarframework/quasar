const fs = require('node:fs')
const { join } = require('node:path')

const appPaths = require('../app-paths.js')

const cssVariables = {
  quasarSrcExt: 'css',

  appFile: {
    scss: fs.existsSync(appPaths.resolve.src('css/quasar.variables.scss')),
    sass: fs.existsSync(appPaths.resolve.src('css/quasar.variables.sass'))
  },

  loaders: {
    scss: join(__dirname, '../webpack/loader.quasar-scss-variables'),
    sass: join(__dirname, '../webpack/loader.quasar-sass-variables')
  }
}

for (const ext of Object.keys(cssVariables.appFile)) {
  if (cssVariables.appFile[ ext ]) {
    cssVariables.quasarSrcExt = ext === 'scss' ? 'sass' : ext
    break
  }
}

module.exports.cssVariables = cssVariables
