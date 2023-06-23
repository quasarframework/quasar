
import { createFilter } from '@rollup/pluginutils'
import { resolve } from 'node:path'
import fse from 'fs-extra'

import appPaths from './app-paths.js'
import { encodeForDiff } from './utils/encode-for-diff.js'
import { getPackage } from './utils/get-package.js'

const { ESLint } = await getPackage('eslint')

let optionsCache = null
let store = {}

function mapIncludeExclude (entry) {
  return typeof entry === 'string'
    ? resolve(appPaths.appDir, entry)
    : entry
}

function extractStore ({
  formatter = 'stylish',
  cache = false, // Note that cache is broken in ESLint
  // at the time of writing these lines
  // which is why we disable it by default
  fix = false,
  warnings = true,
  errors = true,
  include = [],
  exclude = [],
  rawOptions = {}
}, { // getLinterOpts
  quasarConf,
  cacheSuffix
}) {
  const eslintOptions = {
    cache,
    fix,
    errorOnUnmatchedPattern: false,
    ...rawOptions
  }

  if (eslintOptions.cache === true) {
    eslintOptions.cacheLocation = appPaths.resolve.app(
      `node_modules/.q-cache/eslint/${ cacheSuffix }`
    )

    if (quasarConf.build.rebuildCache === true) {
      fse.removeSync(eslintOptions.cacheLocation)
    }
  }

  const eslint = new ESLint(eslintOptions)

  const includeOptions = [
    /\.([jt]sx?|vue)$/,
    ...include.map(mapIncludeExclude)
  ]

  const excludeOptions = [
    /node_modules/,
    ...exclude.map(mapIncludeExclude)
  ]

  const filter = createFilter(includeOptions, excludeOptions)

  return {
    eslint,
    filter,
    errors,
    warnings,
    fix,
    outputFixes: ESLint.outputFixes,
    formatter
  }
}

export function getLinter (quasarConf, cacheSuffix) {
  const { eslint } = quasarConf
  const cache = encodeForDiff(eslint)

  if (cache !== optionsCache) {
    optionsCache = cache
    store = extractStore(eslint, { quasarConf, cacheSuffix })
  }

  return store
}
