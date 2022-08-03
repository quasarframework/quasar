const fs = require('fs')
const appPaths = require('../app-paths')
const appPkg = require(appPaths.resolve.app('package.json'))

function hasEslint() {
  // See: https://eslint.org/docs/user-guide/configuring/configuration-files
  const configPaths = [
    '.eslintrc.js',
    '.eslintrc.cjs',
    '.eslintrc.yaml',
    '.eslintrc.yml',
    '.eslintrc.json',
  ]

  return (
    configPaths.some(path => fs.existsSync(appPaths.resolve.app(path))) ||
    appPkg.eslintConfig !== undefined
  )
}

module.exports = hasEslint()
