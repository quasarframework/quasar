
import { existsSync } from 'node:fs'
import { normalize, resolve, join, sep } from 'node:path'

import { fatal } from './utils/logger.js'

const quasarConfigList = [
  { name: 'quasar.config.js', inputFormat: 'esm', outputFormat: 'esm' },
  { name: 'quasar.config.mjs', inputFormat: 'esm', outputFormat: 'esm' },
  { name: 'quasar.config.ts', inputFormat: 'ts', outputFormat: 'esm' },
  { name: 'quasar.config.cjs', inputFormat: 'cjs', outputFormat: 'cjs' },
  { name: 'quasar.conf.js', inputFormat: 'cjs', outputFormat: 'cjs' } // legacy (removed during v2)
]

function getAppInfo () {
  let appDir = process.cwd()

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

const { appDir, quasarConfigFilename, quasarConfigInputFormat, quasarConfigOutputFormat } = getAppInfo()

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
  quasarConfigInputFormat,
  quasarConfigOutputFormat,

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
