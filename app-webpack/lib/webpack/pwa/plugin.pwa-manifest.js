const { sources } = require('webpack')

module.exports.PwaManifestPlugin = class PwaManifestPlugin {
  constructor (cfg = {}) {
    this.manifestFilename = cfg.pwa.manifestFilename
    this.manifest = JSON.stringify(cfg.pwa.manifest)
  }

  apply (compiler) {
    compiler.hooks.thisCompilation.tap(this.manifestFilename, compilation => {
      compilation.emitAsset(this.manifestFilename, new sources.RawSource(this.manifest))
    })
  }
}
