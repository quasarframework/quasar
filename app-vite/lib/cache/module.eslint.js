
import { existsSync } from 'node:fs'

import { getPackage } from '../utils/get-package.js'

export async function createInstance ({ appPaths }) {
  const eslintConfigFile = [
    '.eslintrc.cjs',
    '.eslintrc.js',
    '.eslintrc.yaml',
    '.eslintrc.yml',
    '.eslintrc.json',
    'eslint.config.js'
  ].find(path => existsSync(appPaths.resolve.app(path)))

  const acc = {
    eslintConfigFile,
    hasEslint: eslintConfigFile !== void 0
  }

  if (acc.hasEslint === true) {
    const linter = await getPackage('eslint', appPaths.appDir)

    if (linter !== void 0 && linter.ESLint !== void 0) {
      acc.ESLint = linter.ESLint
    }
    else {
      acc.hasEslint = false
    }
  }

  return acc
}
