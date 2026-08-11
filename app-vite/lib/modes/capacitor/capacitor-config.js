import { createViteConfig, extendViteConfig } from '../../config-tools.js'

/**
 * Warning!
 *
 * Remember to update this.#registerDiff() calls when adding/removing quasarConf
 * properties needed for the build.
 */
export const quasarCapacitorConfig = {
  vite: async quasarConf => {
    const {
      appPaths,
      pkg: { capacitorPkg }
    } = quasarConf.ctx

    const cfg = await createViteConfig(quasarConf, {
      compileId: 'vite-capacitor',
      shippedToClient: true,
      /**
       * We specify modeDeps because the deps in /src-capacitor
       * can be used in the /src folder too.
       *
       * This also means that types-generator will need to have
       * the deps specified in compilerOptions.paths for correct type resolution.
       */
      modeDeps: [{ dir: 'src-capacitor', deps: capacitorPkg.dependencies }]
    })

    if (quasarConf.ctx.prod) {
      cfg.build.emptyOutDir = true
      cfg.build.outDir = appPaths.resolve.capacitor('www')
    }

    return extendViteConfig(cfg, quasarConf, { isClient: true })
  }
}

export const modeConfig = quasarCapacitorConfig
