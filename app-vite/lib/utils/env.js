import { existsSync, readFileSync } from 'node:fs'
import { join, isAbsolute } from 'node:path'
import { parse as dotEnvParse } from 'dotenv'
import { expand as dotEnvExpand } from 'dotenv-expand'

import { encodeForDiff } from './encode-for-diff.js'

const readFileEnvCacheKey = 'readFileEnv'

/**
 * Get the raw env definitions from the host
 * project env files.
 */
export function readFileEnv ({ ctx, quasarConf }) {
  const { cacheProxy } = ctx

  const opts = {
    envFolder: quasarConf.build.envFolder,
    envFiles: quasarConf.build.envFiles
  }

  const configHash = encodeForDiff(opts)
  const cache = cacheProxy.getRuntime(readFileEnvCacheKey, () => ({}))

  if (cache.configHash !== configHash) {
    const result = getFileEnvResult(ctx.appPaths, {
      ...opts,
      quasarMode: ctx.modeName,
      buildType: ctx.dev ? 'dev' : 'prod'
    })

    cacheProxy.setRuntime(readFileEnvCacheKey, {
      configHash,
      result: {
        ...result,
        envFromCache: true
      }
    })

    return result
  }

  return cache.result
}

function getFileEnvResult (
  appPaths,
  {
    quasarMode,
    buildType,
    envFolder = appPaths.appDir,
    envFiles = []
  }
) {
  const fileList = [
    // .env
    // loaded in all cases
    '.env',

    // .env.local
    // loaded in all cases, ignored by git
    '.env.local',

    // .env.[dev|prod]
    // loaded for dev or prod only
    `.env.${ buildType }`,

    // .env.local.[dev|prod]
    // loaded for dev or prod only, ignored by git
    `.env.local.${ buildType }`,

    // .env.[quasarMode]
    // loaded for specific Quasar CLI mode only
    `.env.${ quasarMode }`,

    // .env.local.[quasarMode]
    // loaded for specific Quasar CLI mode only, ignored by git
    `.env.local.${ quasarMode }`,

    // .env.[dev|prod].[quasarMode]
    // loaded for specific Quasar CLI mode and dev|prod only
    `.env.${ buildType }.${ quasarMode }`,

    // .env.local.[dev|prod].[quasarMode]
    // loaded for specific Quasar CLI mode and dev|prod only, ignored by git
    `.env.local.${ buildType }.${ quasarMode }`,

    // additional user-defined env files
    ...envFiles
  ]

  const usedEnvFiles = []
  const folder = isAbsolute(envFolder) === true
    ? envFolder
    : join(appPaths.appDir, envFolder)

  const env = Object.fromEntries(
    fileList.flatMap(file => {
      const filePath = isAbsolute(file) === true
        ? file
        : join(folder, file)

      if (existsSync(filePath) === false) {
        return []
      }

      usedEnvFiles.push(file)
      return Object.entries(
        dotEnvParse(readFileSync(filePath, 'utf-8'))
      )
    })
  )

  if (Object.keys(env).length === 0) {
    return {}
  }

  const { parsed: fileEnv } = dotEnvExpand({ parsed: env })

  return {
    fileEnv,
    usedEnvFiles,
    envFromCache: false
  }
}

/**
 * Get the final env definitions to supply to
 * the build system (Vite or Esbuild).
 */
export function getBuildSystemDefine ({
  fileEnv = {},
  buildEnv = {},
  buildRawDefine = {}
}) {
  const acc = {}

  for (const key in fileEnv) {
    const val = fileEnv[ key ]
    acc[ `process.env.${ key }` ] = val === 'true' || val === 'false'
      ? val // let's keep it as boolean and not transform it to string
      : JSON.stringify(fileEnv[ key ])
  }

  const flatBuildEnv = flattenObject(buildEnv)
  for (const key in flatBuildEnv) {
    acc[ `process.env.${ key }` ] = JSON.stringify(flatBuildEnv[ key ])
  }

  for (const key in buildRawDefine) {
    const val = buildRawDefine[ key ]
    acc[ key ] = typeof val === 'string'
      ? buildRawDefine[ key ]
      : JSON.stringify(buildRawDefine[ key ])
  }

  return acc
}

/**
 * Flattens the object to a single level.
 * Keys of the result will be the keypaths of the properties of the parameter.
 * It will also preserve the original nested objects with their root keypath.
 *
 * @param {Object} obj
 *
 * @example
 * flattenObject({
 *   foo: 1,
 *   bar: {
 *     baz: 2,
 *     qux: {
 *       quux: {
 *         quuz: 3
 *       }
 *     }
 *   }
 * })
 * // Result:
 * // foo: 1
 * // bar: {baz: 2, qux: {…}, qux.quux: {…}, qux.quux.quuz: 3}
 * // bar.baz: 2
 * // bar.qux: {quux: {…}, quux.quuz: 3}
 * // bar.qux.quux: {quuz: 3}
 * // bar.qux.quux.quuz: 3
 */
const flattenObject = obj => {
  const result = {}

  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue

    if (typeof obj[ key ] !== 'object') {
      result[ key ] = obj[ key ]
      continue
    }

    const flatObj = flattenObject(obj[ key ])

    // Save the object itself to it's root key
    result[ key ] = flatObj

    // Save the child keys
    for (const flatKey in flatObj) {
      if (!Object.prototype.hasOwnProperty.call(flatObj, flatKey)) continue

      result[ `${ key }.${ flatKey }` ] = flatObj[ flatKey ]
    }
  }

  return result
}
