
const { writeFileSync, copySync } = require('fs-extra')
const { join } = require('path')

const appPaths = require('../../app-paths')
const { warn } = require('../../helpers/logger')

const { name, productName, description, version } = require(appPaths.resolve.app('package.json'))

module.exports.createManifest = function createManifest (quasarConf) {
  let json
  const filename = appPaths.resolve.bex('manifest.json')

  try {
    json = require(filename)
  }
  catch (err) {
    warn('Could not compile BEX manifest.json. Please check its syntax.')
    return { err, filename }
  }

  if (json.manifest_version === void 0) {
    warn('The BEX manifest.json requires a "manifest_version" prop, which is currently missing.')
    return { err: true, filename }
  }

  if (json.name === void 0) { json.name = productName || name }
  if (json.short_name === void 0) { json.short_name = json.name }
  if (json.description === void 0) { json.description = description }
  if (json.version === void 0) { json.version = version }

  if (json.manifest_version === 2) {
    json.browser_action = json.browser_action || {}

    if (json.browser_action.default_title === void 0) {
      json.browser_action.default_title = json.name
    }
  }

  if (typeof quasarConf.bex.extendBexManifestJson === 'function') {
    quasarConf.bex.extendBexManifestJson(json)
  }

  writeFileSync(
    join(quasarConf.build.distDir, 'manifest.json'),
    JSON.stringify(json, null, quasarConf.build.minify === true ? void 0 : 2),
    'utf-8'
  )

  return { filename }
}

module.exports.copyBexAssets = function copyBexAssets (quasarConf) {
  const assets = appPaths.resolve.bex('assets')
  copySync(assets, join(quasarConf.build.distDir, 'assets'))

  const icons = appPaths.resolve.bex('icons')
  copySync(icons, join(quasarConf.build.distDir, 'icons'))

  return [ assets, icons ]
}
