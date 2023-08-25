const { existsSync } = require('node:fs')
const fse = require('fs-extra')

const { spawnSync } = require('../../utils/spawn.js')
const { log, fatal } = require('../../utils/logger.js')

function ensureWWW ({ appPaths, forced }) {
  const www = appPaths.resolve.cordova('www')

  forced === true && fse.removeSync(www)

  if (!existsSync(www)) {
    fse.copySync(
      appPaths.resolve.cli('templates/cordova/www'),
      www
    )
  }
}
module.exports.ensureWWW = ensureWWW

function ensureDeps ({ appPaths }) {
  if (existsSync(appPaths.resolve.cordova('node_modules'))) {
    return
  }

  log('Installing dependencies in /src-cordova')
  spawnSync(
    'npm',
    [ 'install' ],
    { cwd: appPaths.cordovaDir, env: { ...process.env, NODE_ENV: 'development' } },
    () => {
      fatal('npm failed installing dependencies in /src-cordova', 'FAIL')
    }
  )
}
module.exports.ensureDeps = ensureDeps

module.exports.ensureConsistency = function ensureConsistency (opts) {
  ensureWWW(opts)
  ensureDeps(opts)
}
