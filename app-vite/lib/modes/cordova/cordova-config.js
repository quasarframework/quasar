const appPaths = require('../../app-paths')
const { createViteConfig, extendViteConfig } = require('../../config-tools')
const cordovaPlatformInject = require('./vite-plugin.dev.cordova-platform-inject')

module.exports = {
  vite: quasarConf => {
    const cfg = createViteConfig(quasarConf)

    if (quasarConf.ctx.dev === true) {
      cfg.plugins.unshift(
        cordovaPlatformInject(quasarConf)
      )
    }
    else {
      cfg.build.outDir = appPaths.resolve.cordova('www')
    }

    return extendViteConfig(cfg, quasarConf, { isClient: true })
  }
}
