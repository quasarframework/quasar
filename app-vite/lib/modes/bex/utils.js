
const { writeFileSync, copySync, existsSync } = require('fs-extra')
const { join } = require('path')

const appPaths = require('../../app-paths')
const { warn } = require('../../helpers/logger')

const { name, productName, description, version } = require(appPaths.resolve.app('package.json'))
const assetsFolder = appPaths.resolve.bex('assets')
const iconsFolder = appPaths.resolve.bex('icons')
const localesFolder = appPaths.resolve.bex('_locales')

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
  else if (json.manifest_version === 3) {
    json.action = json.action || {}
    if (json.action.default_title === void 0) {
      json.action.default_title = json.name
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
  const folders = [ assetsFolder, iconsFolder ]

  copySync(assetsFolder, join(quasarConf.build.distDir, 'assets'))
  copySync(iconsFolder, join(quasarConf.build.distDir, 'icons'))

  if (existsSync(localesFolder) === true) {
    folders.push(localesFolder)
    copySync(localesFolder, join(quasarConf.build.distDir, '_locales'))
  }

  return folders
}
