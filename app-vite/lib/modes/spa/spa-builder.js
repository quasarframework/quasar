
const { AppBuilder } = require('../../app-builder.js')
const { quasarSpaConfig } = require('./spa-config.js')

module.exports.QuasarModeBuilder = class QuasarModeBuilder extends AppBuilder {
  async build () {
    const viteConfig = await quasarSpaConfig.vite(this.quasarConf)
    await this.buildWithVite('SPA UI', viteConfig)

    this.printSummary(this.quasarConf.build.distDir, true)
  }
}
