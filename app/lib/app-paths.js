const fs = require('fs')
const { normalize, resolve, join, sep } = require('path')

function getAppDir () {
  let dir = process.cwd()

  while (dir.length && dir[dir.length - 1] !== sep) {
    if (fs.existsSync(join(dir, 'quasar.conf.js'))) {
      return dir
    }

    dir = normalize(join(dir, '..'))
  }

  const
    logger = require('./helpers/logger')
    warn = logger('app:paths', 'red')

  warn(`⚠️  Error. This command must be executed inside a Quasar v1+ project folder.`)
  warn()
  process.exit(1)
}

const appDir = getAppDir()
const cliDir = resolve(__dirname, '..')
const srcDir = resolve(appDir, 'src')
const pwaDir = resolve(appDir, 'src-pwa')
const ssrDir = resolve(appDir, 'src-ssr')
const cordovaDir = resolve(appDir, 'src-cordova')
const capacitorDir = resolve(appDir, 'src-capacitor')
const electronDir = resolve(appDir, 'src-electron')

module.exports = {
  cliDir,
  appDir,
  srcDir,
  pwaDir,
  ssrDir,
  cordovaDir,
  capacitorDir,
  electronDir,

  resolve: {
    cli: dir => join(cliDir, dir),
    app: dir => join(appDir, dir),
    src: dir => join(srcDir, dir),
    pwa: dir => join(pwaDir, dir),
    ssr: dir => join(ssrDir, dir),
    cordova: dir => join(cordovaDir, dir),
    capacitor: dir => join(capacitorDir, dir),
    electron: dir => join(electronDir, dir)
  }
}
