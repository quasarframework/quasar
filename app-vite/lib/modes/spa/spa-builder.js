
const AppBuilder = require('../../app-builder')
const config = require('./spa-config')

class SpaBuilder extends AppBuilder {
  async build () {
    const viteConfig = config.vite(this.quasarConf)
    await this.buildWithVite('SPA UI', viteConfig)
  }
}

module.exports = SpaBuilder
