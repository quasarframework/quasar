
import { existsSync } from 'node:fs'

import appPaths from '../app-paths.js'
import { appPkg } from '../app-pkg.js'

export const eslintConfigFile = [
  '.eslintrc.cjs',
  '.eslintrc.js',
  '.eslintrc.yaml',
  '.eslintrc.yml',
  '.eslintrc.json'
].find(path => existsSync(appPaths.resolve.app(path)))

export const hasEslint = appPkg.eslintConfig || eslintConfigFile
