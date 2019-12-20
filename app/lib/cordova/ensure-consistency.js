const fs = require('fs')
const fse = require('fs-extra')

const { spawnSync } = require('../helpers/spawn')
const appPaths = require('../app-paths')

const logger = require('../helpers/logger')
const log = logger('app:ensure-consistency')
const warn = logger('app:ensure-consistency', 'red')

function ensureWWW (forced) {
  const www = appPaths.resolve.cordova('www')

  forced === true && fse.removeSync(www)

  if (!fs.existsSync(www)) {
    fse.copySync(
      appPaths.resolve.cli('templates/cordova'),
      appPaths.cordovaDir
    )
  }
}

function ensureDeps () {
  if (fs.existsSync(appPaths.resolve.cordova('node_modules'))) {
    return
  }

  log('Installing dependencies in /src-cordova')
  spawnSync(
    'npm',
    [ 'install' ],
    { cwd: appPaths.cordovaDir },
    () => {
      warn(`⚠️  [FAIL] npm failed installing dependencies in /src-cordova`)
      process.exit(1)
    }
  )
}

module.exports = function () {
  ensureWWW()
  ensureDeps()
}

module.exports.ensureWWW = ensureWWW
module.exports.ensureDeps = ensureDeps
