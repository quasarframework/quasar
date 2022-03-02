
const { createFilter } = require('@rollup/pluginutils')
const { resolve } = require('path')
const { removeSync } = require('fs-extra')

const appPaths = require('./app-paths')
const encodeForDiff = require('./helpers/encode-for-diff')

let optionsCache = null
let store = {}

function mapIncludeExclude (entry) {
  return typeof entry === 'string'
    ? resolve(appPaths.appDir, entry)
    : entry
}

function extractStore ({
  ESLint,
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
  cacheSuffix
}) {

  const eslintOptions = {
    cache,
    fix,
    ...rawOptions
  }

  if (eslintOptions.cache === true) {
    eslintOptions.cacheLocation = appPaths.resolve.app(
      `node_modules/.q-cache/linter/${ cacheSuffix }`
    )

    if (quasarConf.build.rebuildCache === true) {
      removeSync(eslintOptions.cacheLocation)
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

module.exports = function getLinter (quasarConf, cacheSuffix) {
  const { linter } = quasarConf
  const cache = encodeForDiff(linter)

  if (cache !== optionsCache) {
    optionsCache = cache
    store = extractStore(linter, cacheSuffix)
  }

  return store
}
