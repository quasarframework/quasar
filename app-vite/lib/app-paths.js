
import { existsSync } from 'node:fs'
import { normalize, resolve, join, sep } from 'node:path'

import { fatal } from './utils/logger.js'

const quasarConfigList = [
  { name: 'quasar.config.js', format: 'esm' },
  { name: 'quasar.config.mjs', format: 'esm' },
  { name: 'quasar.config.ts', format: 'ts' },
  { name: 'quasar.config.cjs', format: 'cjs' },
  { name: 'quasar.conf.js', format: 'cjs' } // legacy (removed during v2)
]

function getAppInfo () {
  let appDir = process.cwd()

  while (appDir.length && appDir[ appDir.length - 1 ] !== sep) {
    for (const { name, format } of quasarConfigList) {
      const quasarConfigFilename = join(appDir, name)
      if (existsSync(quasarConfigFilename)) {
        return { appDir, quasarConfigFilename, quasarConfigFormat: format }
      }
    }

    appDir = normalize(join(appDir, '..'))
  }

  fatal('Error. This command must be executed inside a Quasar project folder.')
}

const { appDir, quasarConfigFilename, quasarConfigFormat } = getAppInfo()

const cliDir = new URL('..', import.meta.url).pathname
const publicDir = resolve(appDir, 'public')
const srcDir = resolve(appDir, 'src')
const pwaDir = resolve(appDir, 'src-pwa')
const ssrDir = resolve(appDir, 'src-ssr')
const cordovaDir = resolve(appDir, 'src-cordova')
const capacitorDir = resolve(appDir, 'src-capacitor')
const electronDir = resolve(appDir, 'src-electron')
const bexDir = resolve(appDir, 'src-bex')

export default {
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
  quasarConfigFormat,

  resolve: {
    cli: dir => join(cliDir, dir),
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
