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
    const cfg = await createNodeEsbuildConfig(quasarConf, { compileId: 'node-electron-main', format: 'esm' })
    const { appPaths } = quasarConf.ctx
    const ext = quasarConf.metaConf.packageTypeBasedExtension

    cfg.entryPoints = [ quasarConf.sourceFiles.electronMain ]
    cfg.outfile = quasarConf.ctx.dev === true
      ? appPaths.resolve.entry(`electron-main.${ ext }`)
      : join(quasarConf.build.distDir, `UnPackaged/electron-main.${ ext }`)

    cfg.define = {
      ...cfg.define,
      ...getBuildSystemDefine({
        buildEnv: quasarConf.ctx.dev === true
          ? {
              QUASAR_ELECTRON_PRELOAD: appPaths.resolve.entry(`electron-preload.${ ext }`),
              QUASAR_PUBLIC_FOLDER: appPaths.publicDir
            }
          : {
              QUASAR_ELECTRON_PRELOAD: `electron-preload.${ ext }`,
              QUASAR_PUBLIC_FOLDER: '.'
            }
      })
    }

    return extendEsbuildConfig(cfg, quasarConf.electron, quasarConf.ctx, 'extendElectronMainConf')
  },

  preload: async quasarConf => {
    const cfg = await createNodeEsbuildConfig(quasarConf, { compileId: 'node-electron-preload', format: 'esm' })
    const { appPaths } = quasarConf.ctx
    const ext = quasarConf.metaConf.packageTypeBasedExtension

    cfg.entryPoints = [ quasarConf.sourceFiles.electronPreload ]
    cfg.outfile = quasarConf.ctx.dev === true
      ? appPaths.resolve.entry(`electron-preload.${ ext }`)
      : join(quasarConf.build.distDir, `UnPackaged/electron-preload.${ ext }`)

    cfg.define = {
      ...cfg.define,
      ...getBuildSystemDefine({
        buildEnv: quasarConf.ctx.dev === true
          ? {
              QUASAR_ELECTRON_PRELOAD: appPaths.resolve.entry(`electron-preload.${ ext }`),
              QUASAR_PUBLIC_FOLDER: appPaths.publicDir
            }
          : {
              QUASAR_ELECTRON_PRELOAD: `electron-preload.${ ext }`,
              QUASAR_PUBLIC_FOLDER: '.'
            }
      })
    }

    return extendEsbuildConfig(cfg, quasarConf.electron, quasarConf.ctx, 'extendElectronPreloadConf')
  }
}

export const modeConfig = quasarElectronConfig
