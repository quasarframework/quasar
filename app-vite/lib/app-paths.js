
const { existsSync } = require('node:fs')
const { normalize, resolve, join, sep } = require('node:path')

const quasarConfigFilenameList = [
  'quasar.config.js',
  'quasar.config.mjs',
  'quasar.config.ts',
  'quasar.config.cjs',
  'quasar.conf.js' // legacy (removed during v2)
]

function getAppInfo () {
  let appDir = process.cwd()

  while (appDir.length && appDir[ appDir.length - 1 ] !== sep) {
    for (const name of quasarConfigFilenameList) {
      const quasarConfigFilename = join(appDir, name)
      if (existsSync(quasarConfigFilename)) {
        return { appDir, quasarConfigFilename }
      }
    }

    appDir = normalize(join(appDir, '..'))
  }

  const { fatal } = require('./utils/logger.js')
  fatal('Error. This command must be executed inside a Quasar project folder.')
}

const { appDir, quasarConfigFilename } = getAppInfo()

const cliDir = resolve(__dirname, '..')
const publicDir = resolve(appDir, 'public')
const srcDir = resolve(appDir, 'src')
const pwaDir = resolve(appDir, 'src-pwa')
const ssrDir = resolve(appDir, 'src-ssr')
const cordovaDir = resolve(appDir, 'src-cordova')
const capacitorDir = resolve(appDir, 'src-capacitor')
const electronDir = resolve(appDir, 'src-electron')
const bexDir = resolve(appDir, 'src-bex')

module.exports = {
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
