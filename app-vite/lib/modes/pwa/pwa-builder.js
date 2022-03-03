
const AppBuilder = require('../../app-builder')
const config = require('./pwa-config')

class PwaBuilder extends AppBuilder {
  async build () { // TODO
    const viteConfig = await config.vite(this.quasarConf)
    await this.buildWithVite('PWA UI', viteConfig)
  }
}

module.exports = PwaBuilder
