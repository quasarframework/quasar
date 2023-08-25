const { existsSync } = require('node:fs')
const fse = require('fs-extra')

function ensureWWW ({ appPaths, forced }) {
  const www = appPaths.resolve.capacitor('www')

  forced === true && fse.removeSync(www)

  if (!existsSync(www)) {
    fse.copySync(
      appPaths.resolve.cli('templates/capacitor/www'),
      www
    )
  }
}
module.exports.ensureWWW = ensureWWW

function ensureDeps ({ appPaths, cacheProxy }) {
  if (existsSync(appPaths.resolve.capacitor('node_modules'))) {
    return
  }

  const nodePackager = cacheProxy.getModule('nodePackager')
  nodePackager.install({
    cwd: appPaths.capacitorDir,
    displayName: 'Capacitor'
  })
}
module.exports.ensureDeps = ensureDeps

module.exports.ensureConsistency = function ensureConsistency (opts) {
  ensureWWW(opts)
  ensureDeps(opts)
}
