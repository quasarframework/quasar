
const { existsSync } = require('fs')

const appPaths = require('../app-paths')
const appPkg = require(appPaths.resolve.app('package.json'))

const eslintConfigFile = [
  '.eslintrc.cjs',
  '.eslintrc.js',
  '.eslintrc.yaml',
  '.eslintrc.yml',
  '.eslintrc.json'
].find(path => existsSync(appPaths.resolve.app(path)))

module.exports.eslintConfigFile = eslintConfigFile
module.exports.hasEslint = appPkg.eslintConfig || eslintConfigFile
