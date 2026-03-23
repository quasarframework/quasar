const { existsSync } = require('node:fs')
const { getPackage } = require('../utils/get-package.js')

const flatConfigFileRE = /^eslint\.config\./

module.exports.createInstance = function createInstance({ appPaths }) {
  const eslintConfigFile = [
    // flat configs (ESLint >= 9)
    'eslint.config.js',
    'eslint.config.mjs',
    'eslint.config.cjs',

    // legacy configs (ESLint <= 8)
    '.eslintrc.cjs',
    '.eslintrc.js',
    '.eslintrc.yaml',
    '.eslintrc.yml',
    '.eslintrc.json'
  ].find(path => existsSync(appPaths.resolve.app(path)))

  const acc = {
    eslintConfigFile,
    hasEslint: eslintConfigFile !== void 0
  }

  if (acc.hasEslint === true) {
    acc.configType = flatConfigFileRE.test(eslintConfigFile)
      ? 'flat'
      : 'eslintrc'

    const linter = getPackage('eslint', appPaths.appDir)

    if (linter !== void 0 && linter.ESLint !== void 0) {
      acc.ESLint = linter.ESLint
    }

    const webpackPlugin = getPackage('eslint-webpack-plugin', appPaths.appDir)

    if (webpackPlugin !== void 0) {
      acc.EslintWebpackPlugin = webpackPlugin
    }
  }

  return acc
}
