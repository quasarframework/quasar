const appPaths = require('../../app-paths.js')
const { createViteConfig, extendViteConfig } = require('../../config-tools.js')
const { quasarVitePluginDevCordovaPlatformInject } = require('./vite-plugin.dev.cordova-platform-inject.js')

module.exports.quasarCordovaConfig = {
  vite: quasarConf => {
    const cfg = createViteConfig(quasarConf)

    if (quasarConf.ctx.dev === true) {
      cfg.plugins.unshift(
        quasarVitePluginDevCordovaPlatformInject(quasarConf)
      )
    }
    else {
      cfg.build.outDir = appPaths.resolve.cordova('www')
    }

    return extendViteConfig(cfg, quasarConf, { isClient: true })
  }
}

module.exports.modeConfig = module.exports.quasarCordovaConfig
