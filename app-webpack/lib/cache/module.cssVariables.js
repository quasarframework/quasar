const fs = require('node:fs')
const { join } = require('node:path')

module.exports.createInstance = function createInstance ({ appPaths }) {
  const cssVariables = {
    quasarSrcExt: 'css',

    loader: join(__dirname, '../loaders/loader.quasar-scss-variables.js'),

    // loader options
    scss: {
      prefix: '@import \'quasar/src/css/variables.sass\';\n'
    },

    // loader options
    sass: {
      prefix: '@import \'quasar/src/css/variables.sass\'\n'
    }
  }

  for (const ext of [ 'scss', 'sass' ]) {
    const file = appPaths.resolve.app(`src/css/quasar.variables.${ ext }`)

    if (fs.existsSync(file) === true) {
      cssVariables.quasarSrcExt = 'sass'
      cssVariables.scss.prefix = `@import '~src/css/quasar.variables.${ ext }', 'quasar/src/css/variables.sass';\n`
      cssVariables.sass.prefix = `@import '~src/css/quasar.variables.${ ext }', 'quasar/src/css/variables.sass'\n`
      break
    }
  }

  return cssVariables
}
