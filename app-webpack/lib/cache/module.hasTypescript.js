const { existsSync } = require('node:fs')

const { getPackagePath } = require('../utils/get-package-path.js')

module.exports.createInstance = function createInstance ({ appPaths }) {
  const hasTypescript = (
    appPaths.quasarConfigFilename.endsWith('.ts')
    && existsSync(appPaths.resolve.app('tsconfig.json'))
  )

  if (hasTypescript === true) {
    const typescriptPath = getPackagePath('typescript', appPaths.appDir)
    if (typescriptPath === void 0) {
      return false
    }

    const tsLoaderPath = getPackagePath('ts-loader', appPaths.appDir)
    if (tsLoaderPath === void 0) {
      return false
    }
  }

  return hasTypescript
}
