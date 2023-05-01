
const { existsSync } = require('fs')
const { normalize, resolve, join, sep } = require('path')

const quasarConfigFilenameList = [
  'quasar.config.js',
  'quasar.config.cjs',
  'quasar.conf.js' // legacy
]

function getAppInfo () {
  let appDir = process.cwd()

  while (appDir.length && appDir[ appDir.length - 1 ] !== sep) {
    for (const name of quasarConfigFilenameList) {
      const filename = join(appDir, name)
      if (existsSync(filename)) {
        return { appDir, quasarConfigFilename: filename }
      }
    }

    appDir = normalize(join(appDir, '..'))
  }

  const { fatal } = require('./helpers/logger')
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
