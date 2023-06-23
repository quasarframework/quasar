import appPaths from '../../app-paths.js'
import { createViteConfig, extendViteConfig } from '../../config-tools.js'
import { quasarVitePluginDevCordovaPlatformInject } from './vite-plugin.dev.cordova-platform-inject.js'

const quasarCordovaConfig = {
  vite: async quasarConf => {
    const cfg = await createViteConfig(quasarConf)

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

const modeConfig = quasarCordovaConfig

export {
  modeConfig,
  quasarCordovaConfig
}
