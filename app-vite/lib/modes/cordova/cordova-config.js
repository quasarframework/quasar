const createViteConfig = require('../../create-vite-config')
const cordovaPlatformInject = require('./vite-plugin.dev.cordova-platform-inject')

module.exports = {
  vite: quasarConf => {
    const cfg = createViteConfig(quasarConf)

    if (quasarConf.ctx.dev === true) {
      cfg.plugins.unshift(
        cordovaPlatformInject(quasarConf)
      )
    }

    return cfg
  }
}
