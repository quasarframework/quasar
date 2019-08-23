const appPaths = require('../app-paths')

class TauriRunner {
  constructor() {
    const Runner = require(require.resolve('@quasar/tauri/mode/runner', {
      paths: [ appPaths.appDir ]
    }))
    this.mode = new Runner({ modeDir: appPaths.tauriDir })
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
    return this.mode.run(this.__getConfig(cfg))
  }

  async build(quasarConfig) {
    const cfg = quasarConfig.getBuildConfig()
    return this.mode.build(this.__getConfig(cfg))
  }

  stop() {
    return this.mode.stop()
  }
}

module.exports = new TauriRunner()
