const appPaths = require('../app-paths')

class TauriRunner {
  constructor() {
    const Tauri = require('@quasar/tauri').runner
    this.tauri = new Tauri(appPaths)
  }

  __getConfig(cfg) {
    return {
      build: cfg.build,
      ctx: cfg.ctx,
      tauri: cfg.tauri
    }
  }

  async run(quasarConfig) {
    const cfg = quasarConfig.getBuildConfig()
    return this.tauri.run(this.__getConfig(cfg))
  }

  async build(quasarConfig) {
    const cfg = quasarConfig.getBuildConfig()
    return this.tauri.build(this.__getConfig(cfg))
  }

  stop() {
    return this.tauri.stop()
  }
}

module.exports = new TauriRunner()
