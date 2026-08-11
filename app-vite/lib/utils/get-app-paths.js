import { existsSync } from 'node:fs'
import { join, normalize, resolve, sep } from 'node:path'

import { fatal } from './logger.js'
import { cliDir, resolveToCliDir } from './cli-runtime.js'

const quasarConfigList = [
  { name: 'quasar.config.js', inputFormat: 'esm' },
  { name: 'quasar.config.ts', inputFormat: 'ts' }
]

function getAppInfo() {
  let appDir = process.cwd()
  while (appDir.length !== 0 && appDir.at(-1) !== sep) {
    for (const { name, inputFormat } of quasarConfigList) {
      const quasarConfigFilename = join(appDir, name)
      if (existsSync(quasarConfigFilename)) {
        return {
          appDir,
          quasarConfigFilename,
          quasarConfigInputFormat: inputFormat
        }
      }
    }

    appDir = normalize(join(appDir, '..'))
  }

  fatal('Error. This command must be executed inside a Quasar project folder.')
}

function getRunType(ctx) {
  if (ctx.dev) return 'dev'
  if (ctx.prod) return 'prod'
  return 'unknown'
}

function getPrefixDir(ctx) {
  const parts = [getRunType(ctx), ctx.modeName]

  if (ctx.targetName) {
    parts.push(ctx.targetName)
  }

  return parts.join('-')
}

export function getAppPaths({ ctx, defineHiddenProp } = {}) {
  const { appDir, quasarConfigFilename, quasarConfigInputFormat } = getAppInfo()
  const prefixDir = getPrefixDir(ctx)

  const publicDir = resolve(appDir, 'public')
  const srcDir = resolve(appDir, 'src')
  const pwaDir = resolve(appDir, 'src-pwa')
  const ssrDir = resolve(appDir, 'src-ssr')
  const ssgDir = resolve(appDir, 'src-ssg')
  const cordovaDir = resolve(appDir, 'src-cordova')
  const capacitorDir = resolve(appDir, 'src-capacitor')
  const electronDir = resolve(appDir, 'src-electron')
  const bexDir = resolve(appDir, 'src-bex')

  const cacheDir = join(appDir, 'node_modules/.q-cache', prefixDir)

  const acc = {
    cliDir,
    appDir,
    srcDir,
    publicDir,
    pwaDir,
    ssrDir,
    ssgDir,
    cordovaDir,
    capacitorDir,
    electronDir,
    bexDir,
    cacheDir,

    quasarConfigFilename,
    quasarConfigInputFormat,

    resolve: {
      cli: resolveToCliDir,
      app: dir => join(appDir, dir),
      src: dir => join(srcDir, dir),
      public: dir => join(publicDir, dir),
      pwa: dir => join(pwaDir, dir),
      ssr: dir => join(ssrDir, dir),
      ssg: dir => join(ssgDir, dir),
      cordova: dir => join(cordovaDir, dir),
      capacitor: dir => join(capacitorDir, dir),
      electron: dir => join(electronDir, dir),
      bex: dir => join(bexDir, dir),
      cache: dir => join(cacheDir, dir)
    }
  }

  const entryDir = resolve(appDir, '.quasar', prefixDir)
  defineHiddenProp(acc.resolve, 'entry', dir => join(entryDir, dir))

  Object.freeze(acc.resolve)
  return Object.freeze(acc)
}
