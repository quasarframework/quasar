const { build } = require('vite')

const config = require('./spa-config')

class SpaBuilder {
  async build (quasarConf) {
    const viteConfig = config.vite(quasarConf)
    await build(viteConfig)
  }
}

module.exports = SpaBuilder
