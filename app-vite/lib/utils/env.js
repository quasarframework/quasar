import { existsSync, readFileSync } from 'node:fs'
import { isAbsolute, join, relative } from 'node:path'
import { parseEnv } from 'node:util'
import { expand as dotEnvExpand } from 'dotenv-expand'
import { merge } from 'webpack-merge'
import { isCI } from 'ci-info'

import { dot, warn } from './logger.js'
import { green } from 'kolorist'
import { encodeForDiff } from './encode-for-diff.js'

const defaultQuasarConfEnvPrefix = ''
export const defaultClientAppEnvPrefix = 'QCLI_'
export const defaultBackendAppEnvPrefix = ''
const validEnvKeyRE = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/
const appEnvBannerPrefix = green(`Env ${dot}`)

/**
 * Filter out keys that cannot be used in JS
 * as import.meta.env.[key]
 * Examples: ProgramFiles(x86), BASH_FUNC_which%%
 *
 * Also, avoid sub-deps changing process.env, resulting
 * in restarts of the devserver watching for config changes...
 */
const processEnv = Object.keys(process.env)
  .filter(key => validEnvKeyRE.test(key))
  .reduce((acc, key) => {
    if (validEnvKeyRE.test(key)) {
      acc[key] = process.env[key]
    }
    return acc
  }, {})

function getEnvFilesPrefix({ prefix, defaultPrefix, banner }) {
  if (!prefix) {
    if (!defaultPrefix) return ''
    warn(
      `No env prefix specified, using default "${defaultPrefix}" instead.`,
      banner
    )
    return defaultPrefix
  }

  if (!Array.isArray(prefix)) {
    if (!validEnvKeyRE.test(prefix)) {
      if (!defaultPrefix) {
        warn(
          `The "${prefix}" env prefix is invalid in JS. Allowing all env keys that are valid in JS (without any prefix).`,
          banner
        )
        return ''
      }

      warn(
        `Invalid env prefix specified, using default "${defaultPrefix}" instead.`,
        banner
      )
      return defaultPrefix
    }

    return prefix
  }

  const validPrefixList = []
  for (const entry of prefix) {
    if (!entry) continue

    if (!validEnvKeyRE.test(entry)) {
      warn(
        `Invalid env prefix "${entry}" specified in the array. Skipping it.`,
        banner
      )
      continue
    }

    validPrefixList.push(entry)
  }

  if (validPrefixList.length === 0) {
    if (!defaultPrefix) {
      warn(
        `No valid env prefix specified in the array. Allowing all env keys that are valid in JS (without any prefix).`,
        banner
      )
      return ''
    }

    warn(
      `No valid env prefix specified in the array, using default "${defaultPrefix}" instead.`,
      banner
    )
    return defaultPrefix
  }

  return validPrefixList
}

function convertFileToArray(value) {
  if (Array.isArray(value)) return value
  return typeof value === 'string' ? [value] : []
}

function convertFolderToArray(value, appDir) {
  if (Array.isArray(value)) return value.length !== 0 ? value : [appDir]
  return typeof value === 'string' ? [value] : [appDir]
}

export function getQuasarConfEnv({ ctx, envCfg, useSnapshot }) {
  const localEnv = merge(
    {
      // prefix: defaultQuasarConfEnvPrefix,
      // folder: ctx.appPaths.appDir | string[]
      // file: string | string[]
    },
    envCfg
  )

  const fileList = isCI ? ['.env'] : ['.env', '.env.local']
  const additionalFiles = convertFileToArray(localEnv.file)
  if (additionalFiles.length !== 0) {
    // additional user-defined env files
    fileList.push(...additionalFiles)
  }

  const { appDir } = ctx.appPaths
  const { rawFileEnv, watchEnvFiles, usedEnvFiles } = getFileEnvResult({
    appDir,
    fileList,
    folderList: convertFolderToArray(localEnv.folder, ctx.appPaths.appDir)
  })

  const prefix = getEnvFilesPrefix({
    prefix: localEnv.prefix,
    defaultPrefix: defaultQuasarConfEnvPrefix,
    banner: 'quasar.config'
  })

  const prefixLabel = Array.isArray(prefix) ? prefix.join(' | ') : prefix
  const prefixRE = Array.isArray(prefix)
    ? new RegExp(`^(${prefix.join('|')})[a-zA-Z_$][a-zA-Z0-9_$]*$`)
    : new RegExp(`^${prefix}[a-zA-Z_$][a-zA-Z0-9_$]*$`)

  const envDefineList = parseEnvDefineList(rawFileEnv, prefixRE)

  return {
    envDefineList,
    watchEnvFiles: new Set(watchEnvFiles),
    snapshot: useSnapshot
      ? {
          envDefineList: encodeForDiff(envDefineList),
          watchEnvFiles: encodeForDiff(watchEnvFiles)
        }
      : null,
    envBanner: `${prefix ? `prefix ${prefixLabel}` : 'no env prefix'}; ${
      usedEnvFiles.length !== 0
        ? `dotenv files: ${usedEnvFiles.join(' | ')}`
        : `no dotenv files`
    }`
  }
}

/**
 * Get the raw env definitions from the host project env files.
 */
export function getAppEnv({ ctx, envCfg, useSnapshot }) {
  const localEnv = merge(
    {
      clientPrefix: defaultClientAppEnvPrefix,
      backendPrefix: defaultBackendAppEnvPrefix
      // folder: ctx.appPaths.appDir | string[]
      // file: string | string[]
      // filter: (key, value) => true
    },
    envCfg
  )

  const fileList = isCI ? ['.env'] : ['.env', '.env.local']
  const additionalFiles = convertFileToArray(localEnv.file)
  if (additionalFiles.length !== 0) {
    // additional user-defined env files
    fileList.push(...additionalFiles)
  }

  const { appDir } = ctx.appPaths
  const { rawFileEnv, watchEnvFiles, usedEnvFiles } = getFileEnvResult({
    appDir,
    fileList,
    folderList: convertFolderToArray(localEnv.folder, ctx.appPaths.appDir)
  })

  const clientPrefix = getEnvFilesPrefix({
    prefix: localEnv.clientPrefix,
    defaultPrefix: defaultClientAppEnvPrefix,
    banner: 'App envClientPrefix'
  })
  const clientPrefixRE = Array.isArray(clientPrefix)
    ? new RegExp(`^(${clientPrefix.join('|')})[a-zA-Z_$][a-zA-Z0-9_$]*$`)
    : new RegExp(`^${clientPrefix}[a-zA-Z_$][a-zA-Z0-9_$]*$`)
  const clientPrefixLabel = Array.isArray(clientPrefix)
    ? clientPrefix.join(' | ')
    : clientPrefix

  const result = {
    clientEnvDefineList: parseEnvDefineList(rawFileEnv, clientPrefixRE)
  }

  const backendPrefix = getEnvFilesPrefix({
    prefix: localEnv.backendPrefix,
    defaultPrefix: defaultBackendAppEnvPrefix,
    banner: 'App envBackendPrefix'
  })
  const backendPrefixRE = Array.isArray(backendPrefix)
    ? new RegExp(`^(${backendPrefix.join('|')})[a-zA-Z_$][a-zA-Z0-9_$]*$`)
    : new RegExp(`^${backendPrefix}[a-zA-Z_$][a-zA-Z0-9_$]*$`)
  const backendPrefixLabel = Array.isArray(backendPrefix)
    ? backendPrefix.join(' | ')
    : backendPrefix

  const backendBanner =
    ctx.mode.ssr === true
      ? `${backendPrefix ? `Backend code prefix: ${backendPrefixLabel}` : 'No backend code prefix'}; `
      : ''
  result.backendEnvDefineList = parseEnvDefineList(rawFileEnv, backendPrefixRE)

  result.envBanner =
    `${appEnvBannerPrefix} ` +
    `${clientPrefix ? `Client code prefix: ${clientPrefixLabel}` : 'No client code prefix'}; ` +
    backendBanner +
    (usedEnvFiles.length !== 0
      ? `dotenv files: ${usedEnvFiles.join(' | ')}`
      : `no dotenv files`)

  if (typeof localEnv.filter === 'function') {
    result.clientEnvDefineList =
      // oxlint-disable-next-line unicorn/no-array-method-this-argument
      localEnv.filter(result.clientEnvDefineList, 'client') || {}

    result.backendEnvDefineList =
      // oxlint-disable-next-line unicorn/no-array-method-this-argument
      localEnv.filter(result.backendEnvDefineList, 'backend') || {}
  }

  if (useSnapshot) {
    result.snapshot = {
      envCfg: encodeForDiff(envCfg),
      watchEnvFiles: encodeForDiff(watchEnvFiles)
    }
  }

  result.watchEnvFiles = new Set(watchEnvFiles)
  return result
}

function getFileEnvResult({ appDir, fileList, folderList }) {
  const watchEnvFiles = []
  const usedEnvFiles = []

  const envFolderList = folderList.map(folder =>
    isAbsolute(folder) ? folder : join(appDir, folder)
  )

  const list = fileList.flatMap(file => {
    if (isAbsolute(file)) return file
    return envFolderList.map(folder => join(folder, file))
  })

  const env = Object.fromEntries(
    list.flatMap(filePath => {
      watchEnvFiles.push(filePath)
      if (!existsSync(filePath)) return []

      usedEnvFiles.push(relative(appDir, filePath))
      return Object.entries(parseEnv(readFileSync(filePath, 'utf8')))
    })
  )

  if (Object.keys(env).length === 0) {
    return {
      rawFileEnv: { ...processEnv },
      watchEnvFiles,
      usedEnvFiles
    }
  }

  const { parsed } = dotEnvExpand({
    // avoid polluting process.env
    processEnv: {},
    // make process.env available for expansion
    parsed: { ...processEnv, ...env }
  })

  return {
    // maintain the order of precedence: env files then process.env
    rawFileEnv: { ...parsed, ...processEnv },
    watchEnvFiles,
    usedEnvFiles
  }
}

const asIsList = ['true', 'false', 'null']
function getStrDefineValue(value) {
  if (asIsList.includes(value)) return value

  const trimmed = value.trim()
  return trimmed !== '' && !Number.isNaN(Number(trimmed))
    ? value
    : JSON.stringify(value)
}

function parseEnvDefineList(env, regex) {
  const validKeys = Object.keys(env).filter(key => regex.test(key))
  return validKeys.reduce((acc, key) => {
    acc[`import.meta.env.${key}`] = getStrDefineValue(env[key])
    return acc
  }, {})
}
