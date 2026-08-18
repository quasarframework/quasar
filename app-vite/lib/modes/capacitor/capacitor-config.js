import { createViteConfig, extendViteConfig } from '../../config-tools.js'

/**
 * Warning!
 *
 * Remember to update this.#registerDiff() calls when adding/removing quasarConf
 * properties needed for the build.
 */
export const quasarCapacitorConfig = {
  vite: async quasarConf => {
    const { appPaths } = quasarConf.ctx

    /**
     * No modeDeps needed here: config-tools.js injects the /src-capacitor
     * deps aliases for every mode when Capacitor mode is installed.
     */
    const cfg = await createViteConfig(quasarConf, {
      compileId: 'vite-capacitor',
      shippedToClient: true
    })

    if (quasarConf.ctx.prod) {
      cfg.build.emptyOutDir = true
      cfg.build.outDir = appPaths.resolve.capacitor('www')
    }

    return extendViteConfig(cfg, quasarConf, { isClient: true })
  }
}

export const modeConfig = quasarCapacitorConfig
