const fs = require('fs')
const { join } = require('path')

const appPaths = require('../app-paths')

const cssVariables = {
  quasarSrcExt: 'css',

  appFile: {
    styl: fs.existsSync(appPaths.resolve.src('css/quasar.variables.styl')),
    scss: fs.existsSync(appPaths.resolve.src('css/quasar.variables.scss')),
    sass: fs.existsSync(appPaths.resolve.src('css/quasar.variables.sass'))
  },

  loaders: {
    styl: join(__dirname, '../webpack/loader.quasar-stylus-variables'),
    scss: join(__dirname, '../webpack/loader.quasar-scss-variables'),
    sass: join(__dirname, '../webpack/loader.quasar-sass-variables')
  }
}

for (ext of Object.keys(cssVariables.appFile)) {
  if (cssVariables.appFile[ext]) {
    cssVariables.quasarSrcExt = ext === 'scss' ? 'sass' : ext
    break
  }
}

module.exports = cssVariables
