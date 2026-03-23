import { existsSync } from 'node:fs'
import { getPackage } from '../utils/get-package.js'

export async function createInstance({ appPaths }) {
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
    const linter = await getPackage('eslint', appPaths.appDir)

    if (linter !== void 0 && linter.ESLint !== void 0) {
      acc.ESLint = linter.ESLint
    } else {
      acc.hasEslint = false
    }
  }

  return acc
}
