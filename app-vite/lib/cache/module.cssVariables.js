import fs from 'node:fs'

export function createInstance ({ appPaths }) {
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

  return cssVariables
}
