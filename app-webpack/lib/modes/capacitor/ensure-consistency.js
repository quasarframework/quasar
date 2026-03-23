const { existsSync } = require('node:fs')
const fse = require('fs-extra')

function ensureWWW({ appPaths, forced }) {
  const www = appPaths.resolve.capacitor('www')

  if (forced === true) fse.removeSync(www)

  if (!existsSync(www)) {
    fse.copySync(appPaths.resolve.cli('templates/capacitor/www'), www)
  }
}
module.exports.ensureWWW = ensureWWW

function ensureDeps({ appPaths, cacheProxy }) {
  if (existsSync(appPaths.resolve.capacitor('node_modules'))) return

  const nodePackager = cacheProxy.getModule('nodePackager')
  nodePackager.install({
    cwd: appPaths.capacitorDir,
    // See https://github.com/orgs/pnpm/discussions/4735
    // We also started creating an empty pnpm-workspace.yaml file in src-capacitor as of v4.3.2
    // which addresses all cases without requiring explicit ignore-workspace flag all the time.
    // However, we are keeping this for backward compatibility of the scaffolded projects and just in case.
    params: nodePackager.name === 'pnpm' ? ['i', '--ignore-workspace'] : void 0,
    displayName: 'Capacitor'
  })
}
module.exports.ensureDeps = ensureDeps

module.exports.ensureConsistency = function ensureConsistency(opts) {
  ensureWWW(opts)
  ensureDeps(opts)
}
