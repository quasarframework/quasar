import { createViteConfig, extendViteConfig } from '../../config-tools.js'

export const quasarSpaConfig = {
  vite: async quasarConf => {
    const cfg = await createViteConfig(quasarConf, { compileId: 'vite-spa' })
    return extendViteConfig(cfg, quasarConf, { isClient: true })
  }
}

export const modeConfig = quasarSpaConfig
