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

  warn(`⚠️  Error. This command must be executed inside a Quasar v0.15+ project folder.`)
  warn(`For Quasar pre v0.15 projects, npm uninstall -g quasar-cli; npm i -g quasar-cli@0.6.5`)
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
  electronDir = resolve(appDir, 'src-electron')

module.exports = {
  cliDir,
  appDir,
  srcDir,
  pwaDir,
  ssrDir,
  cordovaDir,
  electronDir,

  resolve: {
    cli: dir => join(cliDir, dir),
    app: dir => join(appDir, dir),
    src: dir => join(srcDir, dir),
    pwa: dir => join(pwaDir, dir),
    ssr: dir => join(ssrDir, dir),
    cordova: dir => join(cordovaDir, dir),
    electron: dir => join(electronDir, dir)
  }
}
