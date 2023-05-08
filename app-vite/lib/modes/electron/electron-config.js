const { join } = require('path')
const appPaths = require('../../app-paths')

const { createViteConfig, extendViteConfig, extendEsbuildConfig, createNodeEsbuildConfig } = require('../../config-tools')
const parseEnv = require('../../parse-env')

module.exports = {
  vite: quasarConf => {
    const cfg = createViteConfig(quasarConf)

    if (quasarConf.ctx.prod === true) {
      cfg.build.outDir = join(quasarConf.build.distDir, 'UnPackaged')
    }

    return extendViteConfig(cfg, quasarConf, { isClient: true })
  },

  main: quasarConf => {
    const cfg = createNodeEsbuildConfig(quasarConf, { cacheSuffix: 'electron-main' })

    cfg.entryPoints = [ quasarConf.sourceFiles.electronMain ]
    cfg.outfile = quasarConf.ctx.dev === true
      ? appPaths.resolve.app('.quasar/electron/electron-main.js')
      : join(quasarConf.build.distDir, 'UnPackaged/electron-main.js')

    cfg.define = {
      ...cfg.define,
      ...parseEnv({
        QUASAR_ELECTRON_PRELOAD: quasarConf.ctx.dev === true
          ? appPaths.resolve.app('.quasar/electron/electron-preload.js')
          : 'electron-preload.js',
        QUASAR_PUBLIC_FOLDER: quasarConf.ctx.dev === true
          ? appPaths.publicDir
          : '.'
      }, {})
    }

    return extendEsbuildConfig(cfg, quasarConf.electron, 'ElectronMain')
  },

  preload: quasarConf => {
    const cfg = createNodeEsbuildConfig(quasarConf, { cacheSuffix: 'electron-preload' })

    cfg.entryPoints = [ quasarConf.sourceFiles.electronPreload ]
    cfg.outfile = quasarConf.ctx.dev === true
      ? appPaths.resolve.app('.quasar/electron/electron-preload.js')
      : join(quasarConf.build.distDir, 'UnPackaged/electron-preload.js')

    cfg.define = {
      ...cfg.define,
      ...parseEnv({
        QUASAR_ELECTRON_PRELOAD: quasarConf.ctx.dev === true
          ? appPaths.resolve.app('.quasar/electron/electron-preload.js')
          : 'electron-preload.js',
        QUASAR_PUBLIC_FOLDER: quasarConf.ctx.dev === true
          ? appPaths.publicDir
          : '.'
      }, {})
    }

    return extendEsbuildConfig(cfg, quasarConf.electron, 'ElectronPreload')
  }
}
