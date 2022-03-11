
const AppBuilder = require('../../app-builder')
const config = require('./spa-config')

class SpaBuilder extends AppBuilder {
  async build () {
    const viteConfig = await config.vite(this.quasarConf)
    await this.buildWithVite('SPA UI', viteConfig)

    this.printSummary(this.quasarConf.build.distDir, true)
  }
}

module.exports = SpaBuilder
