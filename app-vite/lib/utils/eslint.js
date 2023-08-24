import fse from 'fs-extra'
import { createFilter } from '@rollup/pluginutils'

import { encodeForDiff } from './encode-for-diff.js'

function extractStore ({
  cache = false, // Note that cache is broken in ESLint
  // at the time of writing these lines
  // which is why we disable it by default
  cacheLocation, // injected by us

  formatter = 'stylish',
  fix = false,
  warnings = true,
  errors = true,
  include = [],
  exclude = [],

  rawOptions = {}
}, {
  ESLint,
  resolveToAppDir
}) {
  const eslintOptions = {
    cache,
    cacheLocation,
    fix,
    errorOnUnmatchedPattern: false,
    ...rawOptions
  }

  if (cache === true) {
    fse.removeSync(cacheLocation)
    fse.ensureDirSync(cacheLocation)
  }

  const eslint = new ESLint(eslintOptions)
  const mapIncludeExclude = entry => {
    return typeof entry === 'string'
      ? resolveToAppDir(entry)
      : entry
  }

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
    formatter,
    errorFiles: new Set()
  }
}

export async function getLinter (quasarConf, compileId) {
  const { eslint, ctx: { appPaths, cacheProxy } } = quasarConf
  const cacheId = `eslint-${ compileId }`

  const eslintConfig = {
    ...eslint,
    cacheLocation: appPaths.resolve.cache(cacheId)
  }

  const configHash = encodeForDiff(eslintConfig)
  const cachedLinter = cacheProxy.getRuntime(cacheId, () => ({}))

  if (cachedLinter.configHash !== configHash) {
    const { ESLint } = await cacheProxy.getModule('eslint')
    const store = extractStore(eslintConfig, {
      ESLint,
      resolveToAppDir: appPaths.resolve.app
    })

    cacheProxy.setRuntime(cacheId, {
      configHash,
      store
    })

    return store
  }

  return cachedLinter.store
}
