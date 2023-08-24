const { sources } = require('webpack')
const { readFileSync } = require('node:fs')

const { appPkg } = require('../../app-pkg.js')

const banner = 'BexManifestPlugin'

function warn (msg) {
  console.warn(msg ? ` [warn] ${ banner } ⚠️  ${ msg }` : '')
}

module.exports.BexManifestPlugin = class BexManifestPlugin {
  #quasarConf

  constructor (cfg = {}) {
    this.#quasarConf = cfg
  }

  #createManifest () {
    let json
    try {
      json = JSON.parse(
        readFileSync(this.#quasarConf.metaConf.bexManifestFile, 'utf-8')
      )
    }
    catch (err) {
      warn('Could not read BEX manifest. Please check its syntax.')
      json = {}
    }

    if (json.manifest_version === void 0) {
      warn('The BEX manifest requires a "manifest_version" prop, which is currently missing. Assuming v2.')
      json.manifest_version = 2
    }

    if (json.name === void 0) { json.name = appPkg.productName || appPkg.name }
    if (json.short_name === void 0) { json.short_name = json.name }
    if (json.description === void 0) { json.description = appPkg.description }
    if (json.version === void 0) { json.version = appPkg.version }

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

    if (typeof this.#quasarConf.bex.extendBexManifestJson === 'function') {
      this.#quasarConf.bex.extendBexManifestJson(json)
    }

    return JSON.stringify(json, null, this.#quasarConf.build.minify === true ? 2 : null)
  }

  apply (compiler) {
    compiler.hooks.thisCompilation.tap('BexManifestPlugin', compilation => {
      compilation.hooks.processAssets.tap(
        {
          name: 'BexManifestPlugin',
          stage: compilation.PROCESS_ASSETS_STAGE_ADDITIONS
        },
        () => {
          const bexManifest = this.#createManifest()
          compilation.fileDependencies.add(this.#quasarConf.metaConf.bexManifestFile)
          compilation.emitAsset('manifest.json', new sources.RawSource(bexManifest))
        }
      )

      return true
    })
  }
}
