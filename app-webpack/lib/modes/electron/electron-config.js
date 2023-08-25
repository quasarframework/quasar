const { join } = require('node:path')

const { createWebpackChain, extendWebpackChain, extendEsbuildConfig, createNodeEsbuildConfig } = require('../../config-tools.js')
const { getBuildSystemDefine } = require('../../utils/env.js')
const { injectWebpackHtml } = require('../../utils/html-template.js')

const quasarElectronConfig = {
  webpack: async quasarConf => {
    const { ctx } = quasarConf
    const webpackChain = await createWebpackChain(quasarConf, { compileId: 'webpack-electron', threadName: 'Electron UI' })

    if (ctx.prod) {
      webpackChain.output
        .libraryTarget('commonjs2')
        .path(
          join(quasarConf.build.distDir, 'UnPackaged')
        )
    }

    injectWebpackHtml(webpackChain, quasarConf)

    webpackChain.node
      .merge({
        __dirname: ctx.dev,
        __filename: ctx.dev
      })

    return extendWebpackChain(webpackChain, quasarConf, { isClient: true })
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

    return extendEsbuildConfig(cfg, quasarConf.electron, quasarConf.ctx, 'ElectronMain')
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

    return extendEsbuildConfig(cfg, quasarConf.electron, quasarConf.ctx, 'ElectronPreload')
  }
}

module.exports.quasarElectronConfig = quasarElectronConfig
module.exports.modeConfig = quasarElectronConfig
