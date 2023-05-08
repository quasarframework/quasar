const fs = require('fs')

const appPaths = require('../app-paths')

const cssVariables = {
  quasarSrcExt: 'css',
  variablesFile: false
}

for (const ext of [ 'scss', 'sass' ]) {
  const file = `src/css/quasar.variables.${ ext }`
  if (fs.existsSync(appPaths.resolve.app(file))) {
    cssVariables.quasarSrcExt = 'sass'
    cssVariables.variablesFile = file
    break
  }
}

module.exports = cssVariables
