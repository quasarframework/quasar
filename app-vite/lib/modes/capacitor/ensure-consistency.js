const fs = require('fs')
const fse = require('fs-extra')

const appPaths = require('../../app-paths')
const nodePackager = require('../../helpers/node-packager')

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

  nodePackager.install({
    cwd: appPaths.capacitorDir,
    displayName: 'Capacitor'
  })
}

module.exports = function () {
  ensureWWW()
  ensureDeps()
}

module.exports.ensureWWW = ensureWWW
module.exports.ensureDeps = ensureDeps
