const fs = require('fs')
const { normalize, resolve, join, sep } = require('path')

let quasarConfigFilename

function getAppDir () {
  let dir = process.cwd()

  while (dir.length && dir[dir.length - 1] !== sep) {
    if (fs.existsSync(join(dir, 'quasar.config.js'))) {
      quasarConfigFilename = 'quasar.config.js'
      return dir
    }
    if (fs.existsSync(join(dir, 'quasar.conf.js'))) {
      quasarConfigFilename = 'quasar.conf.js'
      return dir
    }

    dir = normalize(join(dir, '..'))
  }

  const { fatal } = require('./helpers/logger')

  fatal(`Error. This command must be executed inside a Quasar project folder.`)
}

const appDir = getAppDir()
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
  quasarConfigFilename: resolve(appDir, quasarConfigFilename),

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
