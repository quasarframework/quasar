import { createViteConfig, extendViteConfig } from '../../config-tools.js'
import { quasarVitePluginDevCordovaPlatformInject } from './vite-plugin.dev.cordova-platform-inject.js'

const quasarCordovaConfig = {
  vite: async quasarConf => {
    const cfg = await createViteConfig(quasarConf, { compileId: 'vite-cordova' })

    if (quasarConf.ctx.dev === true) {
      cfg.plugins.unshift(
        quasarVitePluginDevCordovaPlatformInject(quasarConf)
      )
    }
    else {
      cfg.build.outDir = quasarConf.ctx.appPaths.resolve.cordova('www')
    }

    return extendViteConfig(cfg, quasarConf, { isClient: true })
  }
}

const modeConfig = quasarCordovaConfig

export {
  modeConfig,
  quasarCordovaConfig
}
