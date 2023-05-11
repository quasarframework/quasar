const appPaths = require('../../app-paths.js')
const { createViteConfig, extendViteConfig } = require('../../config-tools.js')
const cordovaPlatformInject = require('./vite-plugin.dev.cordova-platform-inject.js')

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
