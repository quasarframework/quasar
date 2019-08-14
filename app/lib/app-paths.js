const
  fs = require('fs'),
  path = require('path'),
  resolve = path.resolve,
  join = path.join

function getAppDir () {
  let dir = process.cwd()

  while (dir.length && dir[dir.length - 1] !== path.sep) {
    if (fs.existsSync(join(dir, 'quasar.conf.js'))) {
      return dir
    }

    dir = path.normalize(join(dir, '..'))
  }

  const
    logger = require('./helpers/logger')
    warn = logger('app:paths', 'red')

  warn(`⚠️  Error. This command must be executed inside a Quasar v1+ project folder.`)
  warn()
  process.exit(1)
}

const
  appDir = getAppDir(),
  cliDir = resolve(__dirname, '..'),
  srcDir = resolve(appDir, 'src'),
  pwaDir = resolve(appDir, 'src-pwa'),
  ssrDir = resolve(appDir, 'src-ssr'),
  cordovaDir = resolve(appDir, 'src-cordova'),
  electronDir = resolve(appDir, 'src-electron'),
  tauriDir = resolve(appDir, 'src-tauri'),
  tauriPackage = resolve(appDir, 'node_modules/@quasar/tauri')

module.exports = {
  cliDir,
  appDir,
  srcDir,
  pwaDir,
  ssrDir,
  cordovaDir,
  electronDir,
  tauriDir,
  tauriPackage,

  resolve: {
    cli: dir => join(cliDir, dir),
    app: dir => join(appDir, dir),
    src: dir => join(srcDir, dir),
    pwa: dir => join(pwaDir, dir),
    ssr: dir => join(ssrDir, dir),
    cordova: dir => join(cordovaDir, dir),
    electron: dir => join(electronDir, dir),
    tauri: dir => join(tauriDir, dir),
    tauriPackage: dir => join(cliDir, 'node_modules/@quasar/tauri', dir)
  }
}
