import { createViteConfig, extendViteConfig } from '../../config-tools.js'
import { quasarVitePluginDevCordovaPlatformInject } from './vite-plugin.dev.cordova-platform-inject.js'

/**
 * Warning!
 *
 * Remember to update this.#registerDiff() calls when adding/removing quasarConf
 * properties needed for the build.
 */
const quasarCordovaConfig = {
  vite: async quasarConf => {
    const cfg = await createViteConfig(quasarConf, {
      compileId: 'vite-cordova',
      shippedToClient: true
    })

    if (quasarConf.ctx.dev) {
      cfg.plugins.unshift(quasarVitePluginDevCordovaPlatformInject(quasarConf))
    } else {
      cfg.build.emptyOutDir = true
      cfg.build.outDir = quasarConf.ctx.appPaths.resolve.cordova('www')
    }

    return extendViteConfig(cfg, quasarConf, { isClient: true })
  }
}

const modeConfig = quasarCordovaConfig

export { modeConfig, quasarCordovaConfig }
