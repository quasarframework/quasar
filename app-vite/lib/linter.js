
const { createFilter } = require('@rollup/pluginutils')
const { resolve } = require('path')

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
  fix = false,
  warnings = true,
  errors = true,
  include = [],
  exclude = [],
  rawOptions = {}
}) {
  const eslint = new ESLint({
    cache: false, // cache is broken in ESLint
    fix,
    ...rawOptions
  })

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

module.exports = function getLinter (quasarConf) {
  const { linter } = quasarConf
  const cache = encodeForDiff(linter)

  if (cache !== optionsCache) {
    optionsCache = cache
    store = extractStore(linter)
  }

  return store
}
