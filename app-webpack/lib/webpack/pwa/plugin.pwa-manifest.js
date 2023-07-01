const { sources } = require('webpack')
const { readFileSync } = require('node:fs')

const { appPkg } = require('../../app-pkg.js')

module.exports.PwaManifestPlugin = class PwaManifestPlugin {
  #quasarConf

  constructor (cfg = {}) {
    this.#quasarConf = cfg
  }

  #createManifest () {
    const id = appPkg.name || 'quasar-pwa'
    const pwaManifest = {
      id,
      name: appPkg.productName || appPkg.name || 'Quasar App',
      short_name: id,
      description: appPkg.description,
      display: 'standalone',
      start_url: this.#quasarConf.build.publicPath,
      ...JSON.parse(readFileSync(this.#quasarConf.metaConf.pwaManifestFile, 'utf-8'))
    }

    if (typeof this.#quasarConf.pwa.extendManifestJson === 'function') {
      this.#quasarConf.pwa.extendManifestJson(pwaManifest)
    }

    return JSON.stringify(pwaManifest, null, this.#quasarConf.build.minify === true ? 2 : null)
  }

  apply (compiler) {
    compiler.hooks.thisCompilation.tap('PwaManifestPlugin', compilation => {
      compilation.hooks.processAssets.tap(
        {
          name: 'PwaManifestPlugin',
          stage: compilation.PROCESS_ASSETS_STAGE_ADDITIONS
        },
        () => {
          const pwaManifest = this.#createManifest()
          compilation.fileDependencies.add(this.#quasarConf.metaConf.pwaManifestFile)
          compilation.emitAsset(this.#quasarConf.pwa.manifestFilename, new sources.RawSource(pwaManifest))
        }
      )

      return true
    })
  }
}
