import { join } from 'node:path'

import { createViteConfig, extendViteConfig, extendEsbuildConfig, createNodeEsbuildConfig } from '../../config-tools.js'
import { getBuildSystemDefine } from '../../utils/env.js'

export const quasarElectronConfig = {
  vite: async quasarConf => {
    const cfg = await createViteConfig(quasarConf, { compileId: 'vite-electron' })

    if (quasarConf.ctx.prod === true) {
      cfg.build.outDir = join(quasarConf.build.distDir, 'UnPackaged')
    }

    return extendViteConfig(cfg, quasarConf, { isClient: true })
  },

  main: async quasarConf => {
    const cfg = await createNodeEsbuildConfig(quasarConf, { compileId: 'node-electron-main', format: 'cjs' })
    const { appPaths } = quasarConf.ctx

    cfg.entryPoints = [ quasarConf.sourceFiles.electronMain ]
    cfg.outfile = quasarConf.ctx.dev === true
      ? appPaths.resolve.entry('electron-main.cjs')
      : join(quasarConf.build.distDir, 'UnPackaged/electron-main.cjs')

    cfg.define = {
      ...cfg.define,
      ...getBuildSystemDefine({
        buildEnv: {
          QUASAR_ELECTRON_PRELOAD: quasarConf.ctx.dev === true
            ? appPaths.resolve.entry('electron-preload.cjs')
            : 'electron-preload.cjs',
          QUASAR_PUBLIC_FOLDER: quasarConf.ctx.dev === true
            ? appPaths.publicDir
            : '.'
        }
      })
    }

    return extendEsbuildConfig(cfg, quasarConf.electron, quasarConf.ctx, 'extendElectronMainConf')
  },

  preload: async quasarConf => {
    const cfg = await createNodeEsbuildConfig(quasarConf, { compileId: 'node-electron-preload', format: 'cjs' })
    const { appPaths } = quasarConf.ctx

    cfg.entryPoints = [ quasarConf.sourceFiles.electronPreload ]
    cfg.outfile = quasarConf.ctx.dev === true
      ? appPaths.resolve.entry('electron-preload.cjs')
      : join(quasarConf.build.distDir, 'UnPackaged/electron-preload.cjs')

    cfg.define = {
      ...cfg.define,
      ...getBuildSystemDefine({
        buildEnv: {
          QUASAR_ELECTRON_PRELOAD: quasarConf.ctx.dev === true
            ? appPaths.resolve.entry('electron-preload.cjs')
            : 'electron-preload.cjs',
          QUASAR_PUBLIC_FOLDER: quasarConf.ctx.dev === true
            ? appPaths.publicDir
            : '.'
        }
      })
    }

    return extendEsbuildConfig(cfg, quasarConf.electron, quasarConf.ctx, 'extendElectronPreloadConf')
  }
}

export const modeConfig = quasarElectronConfig
