
const { createViteConfig, extendViteConfig } = require('../../config-tools')

module.exports = {
  vite: quasarConf => {
    const cfg = createViteConfig(quasarConf)
    return extendViteConfig(cfg, quasarConf, { isClient: true })
  }
}
