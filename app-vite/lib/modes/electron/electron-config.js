import { join } from 'node:path'

import appPaths from '../../app-paths.js'
import { createViteConfig, extendViteConfig, extendEsbuildConfig, createNodeEsbuildConfig } from '../../config-tools.js'
import { getBuildSystemDefine } from '../../utils/env.js'

export const quasarElectronConfig = {
  vite: async quasarConf => {
    const cfg = await createViteConfig(quasarConf)

    if (quasarConf.ctx.prod === true) {
      cfg.build.outDir = join(quasarConf.build.distDir, 'UnPackaged')
    }

    return extendViteConfig(cfg, quasarConf, { isClient: true })
  },

  main: async quasarConf => {
    const cfg = await createNodeEsbuildConfig(quasarConf, 'cjs', { cacheSuffix: 'electron-main' })

    cfg.entryPoints = [ quasarConf.sourceFiles.electronMain ]
    cfg.outfile = quasarConf.ctx.dev === true
      ? appPaths.resolve.app('.quasar/electron/electron-main.cjs')
      : join(quasarConf.build.distDir, 'UnPackaged/electron-main.cjs')

    cfg.define = {
      ...cfg.define,
      ...getBuildSystemDefine({
        buildEnv: {
          QUASAR_ELECTRON_PRELOAD: quasarConf.ctx.dev === true
            ? appPaths.resolve.app('.quasar/electron/electron-preload.cjs')
            : 'electron-preload.cjs',
          QUASAR_PUBLIC_FOLDER: quasarConf.ctx.dev === true
            ? appPaths.publicDir
            : '.'
        }
      })
    }

    return extendEsbuildConfig(cfg, quasarConf.electron, 'ElectronMain')
  },

  preload: async quasarConf => {
    const cfg = await createNodeEsbuildConfig(quasarConf, 'cjs', { cacheSuffix: 'electron-preload' })

    cfg.entryPoints = [ quasarConf.sourceFiles.electronPreload ]
    cfg.outfile = quasarConf.ctx.dev === true
      ? appPaths.resolve.app('.quasar/electron/electron-preload.cjs')
      : join(quasarConf.build.distDir, 'UnPackaged/electron-preload.cjs')

    cfg.define = {
      ...cfg.define,
      ...getBuildSystemDefine({
        buildEnv: {
          QUASAR_ELECTRON_PRELOAD: quasarConf.ctx.dev === true
            ? appPaths.resolve.app('.quasar/electron/electron-preload.cjs')
            : 'electron-preload.cjs',
          QUASAR_PUBLIC_FOLDER: quasarConf.ctx.dev === true
            ? appPaths.publicDir
            : '.'
        }
      })
    }

    return extendEsbuildConfig(cfg, quasarConf.electron, 'ElectronPreload')
  }
}

export const modeConfig = quasarElectronConfig
