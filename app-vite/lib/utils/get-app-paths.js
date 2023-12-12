import { existsSync } from 'node:fs'
import { normalize, resolve, join, sep } from 'node:path'

import { fatal } from './logger.js'
import { cliDir, resolveToCliDir } from './cli-runtime.js'

const quasarConfigList = [
  { name: 'quasar.config.js', inputFormat: 'esm', outputFormat: 'esm' },
  { name: 'quasar.config.mjs', inputFormat: 'esm', outputFormat: 'esm' },
  { name: 'quasar.config.ts', inputFormat: 'ts', outputFormat: 'esm' },
  { name: 'quasar.config.cjs', inputFormat: 'cjs', outputFormat: 'cjs' },
  { name: 'quasar.conf.js', inputFormat: 'cjs', outputFormat: 'cjs' } // legacy (removed during v2)
]

function getAppInfo (appDir) {
  while (appDir.length && appDir[ appDir.length - 1 ] !== sep) {
    for (const { name, inputFormat, outputFormat } of quasarConfigList) {
      const quasarConfigFilename = join(appDir, name)
      if (existsSync(quasarConfigFilename)) {
        return { appDir, quasarConfigFilename, quasarConfigInputFormat: inputFormat, quasarConfigOutputFormat: outputFormat }
      }
    }

    appDir = normalize(join(appDir, '..'))
  }

  fatal('Error. This command must be executed inside a Quasar project folder.')
}

function getRunType (ctx) {
  if (ctx.dev) return 'dev'
  if (ctx.prod) return 'prod'
  return 'unknown'
}

function getPrefixDir (ctx) {
  const parts = [
    getRunType(ctx),
    ctx.modeName
  ]

  if (ctx.targetName) {
    parts.push(ctx.targetName)
  }

  return parts.join('-')
}

export function getAppPaths ({
  ctx,
  rootDir,
  defineHiddenProp
} = {}) {
  const { appDir, quasarConfigFilename, quasarConfigInputFormat, quasarConfigOutputFormat } = getAppInfo(rootDir)

  const publicDir = resolve(appDir, 'public')
  const srcDir = resolve(appDir, 'src')
  const pwaDir = resolve(appDir, 'src-pwa')
  const ssrDir = resolve(appDir, 'src-ssr')
  const cordovaDir = resolve(appDir, 'src-cordova')
  const capacitorDir = resolve(appDir, 'src-capacitor')
  const electronDir = resolve(appDir, 'src-electron')
  const bexDir = resolve(appDir, 'src-bex')

  const acc = {
    cliDir,
    appDir,
    srcDir,
    publicDir,
    pwaDir,
    ssrDir,
    cordovaDir,
    capacitorDir,
    electronDir,
    bexDir,

    quasarConfigFilename,
    quasarConfigInputFormat,
    quasarConfigOutputFormat,

    resolve: {
      cli: resolveToCliDir,
      app: dir => join(appDir, dir),
      src: dir => join(srcDir, dir),
      public: dir => join(publicDir, dir),
      pwa: dir => join(pwaDir, dir),
      ssr: dir => join(ssrDir, dir),
      cordova: dir => join(cordovaDir, dir),
      capacitor: dir => join(capacitorDir, dir),
      electron: dir => join(electronDir, dir),
      bex: dir => join(bexDir, dir)
    }
  }

  const prefixDir = getPrefixDir(ctx)
  const entryDir = resolve(appDir, '.quasar', prefixDir)

  defineHiddenProp(acc.resolve, 'entry', dir => join(entryDir, dir))

  if (ctx !== void 0) {
    const cacheDir = join(appDir, 'node_modules/.q-cache', prefixDir)
    defineHiddenProp(acc, 'cacheDir', cacheDir)
    defineHiddenProp(acc.resolve, 'cache', dir => join(cacheDir, dir))
  }

  Object.freeze(acc.resolve)
  return Object.freeze(acc)
}
