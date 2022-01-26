const fs = require('fs')
const fse = require('fs-extra')

const nodePackager = require('../helpers/node-packager')
const { spawnSync } = require('../helpers/spawn')
const appPaths = require('../app-paths')
const { log, fatal } = require('../helpers/logger')

function ensureWWW (forced) {
  const www = appPaths.resolve.capacitor('www')

  forced === true && fse.removeSync(www)

  if (!fs.existsSync(www)) {
    fse.copySync(
      appPaths.resolve.cli('templates/capacitor/www'),
      appPaths.resolve.capacitor('www')
    )
  }
}

function ensureDeps () {
  if (fs.existsSync(appPaths.resolve.capacitor('node_modules'))) {
    return
  }

  const cmdParam = nodePackager === 'npm'
    ? ['install']
    : []

  log(`Installing Capacitor dependencies...`)
  spawnSync(
    nodePackager,
    cmdParam,
    { cwd: appPaths.capacitorDir, env: { ...process.env, NODE_ENV: 'development' } },
    () => fatal('failed installing dependencies in /src-capacitor', 'FAIL')
  )
}

module.exports = function () {
  ensureWWW()
  ensureDeps()
}

module.exports.ensureWWW = ensureWWW
module.exports.ensureDeps = ensureDeps
