module.exports = class PwaManifest {
  constructor (cfg = {}) {
    this.manifest = JSON.stringify(cfg.pwa.manifest)
  }

  apply (compiler) {
    compiler.hooks.emit.tapAsync('manifest.json', (compiler, callback) => {
      compiler.assets['manifest.json'] = {
        source: () => new Buffer(this.manifest),
        size: () => Buffer.byteLength(this.manifest)
      }

      callback()
    })
  }
}
