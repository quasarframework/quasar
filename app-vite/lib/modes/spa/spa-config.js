
const { createViteConfig, extendViteConfig } = require('../../config-tools.js')

module.exports.quasarSpaConfig = {
  vite: quasarConf => {
    const cfg = createViteConfig(quasarConf)
    return extendViteConfig(cfg, quasarConf, { isClient: true })
  }
}

module.exports.modeConfig = module.exports.quasarSpaConfig
