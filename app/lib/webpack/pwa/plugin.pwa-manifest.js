const { sources } = require('webpack')

module.exports = class PwaManifest {
  constructor (cfg = {}) {
    this.manifest = JSON.stringify(cfg.pwa.manifest)
  }

  apply (compiler) {
    compiler.hooks.thisCompilation.tap('manifest.json', compilation => {
      compilation.emitAsset('manifest.json', new sources.RawSource(this.manifest))
    })
  }
}
