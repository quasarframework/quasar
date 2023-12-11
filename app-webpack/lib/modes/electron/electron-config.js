const { join, resolve, basename } = require('node:path')

const { createWebpackChain, extendWebpackChain, extendEsbuildConfig, createNodeEsbuildConfig } = require('../../config-tools.js')
const { getBuildSystemDefine } = require('../../utils/env.js')
const { injectWebpackHtml } = require('../../utils/html-template.js')

const quasarElectronConfig = {
  webpack: async quasarConf => {
    const { ctx } = quasarConf
    const webpackChain = await createWebpackChain(quasarConf, { compileId: 'webpack-electron', threadName: 'Electron UI' })

    if (ctx.prod) {
      webpackChain.output
        .path(
          join(quasarConf.build.distDir, 'UnPackaged')
        )
    }

    injectWebpackHtml(webpackChain, quasarConf)

    return extendWebpackChain(webpackChain, quasarConf, { isClient: true })
  },

  main: async quasarConf => {
    const cfg = await createNodeEsbuildConfig(quasarConf, { compileId: 'node-electron-main', format: 'esm' })
    const { appPaths } = quasarConf.ctx

    cfg.entryPoints = [ quasarConf.sourceFiles.electronMain ]
    cfg.outfile = quasarConf.ctx.dev === true
      ? appPaths.resolve.entry('electron-main.mjs')
      : join(quasarConf.build.distDir, 'UnPackaged/electron-main.mjs')

    cfg.define = {
      ...cfg.define,
      ...getBuildSystemDefine({
        buildEnv: quasarConf.ctx.dev === true
          ? {
              QUASAR_ELECTRON_PRELOAD_FOLDER: appPaths.resolve.entry('preload'),
              QUASAR_ELECTRON_PRELOAD_EXTENSION: '.cjs',
              QUASAR_PUBLIC_FOLDER: appPaths.publicDir
            }
          : {
              QUASAR_ELECTRON_PRELOAD_FOLDER: 'preload',
              QUASAR_ELECTRON_PRELOAD_EXTENSION: '.cjs',
              QUASAR_PUBLIC_FOLDER: '.'
            }
      })
    }

    return extendEsbuildConfig(cfg, quasarConf.electron, quasarConf.ctx, 'extendElectronMainConf')
  },

  async preloadScript (quasarConf, name) {
    /**
     * We will be compiling to commonjs format because Electron requires
     * ESM preload scripts to run with sandbox disabled, which is a security risk
     * (Sandboxed preload scripts are run as plain JavaScript without an ESM context)
     *
     * However, should we decide going with ESM preload scripts at some point,
     * we need to change the compiled file extension to .mjs (which is also an Electron requirement)
     */

    const scriptName = basename(name)
    const cfg = await createNodeEsbuildConfig(quasarConf, { compileId: `node-electron-preload-${ scriptName }`, format: 'cjs' })
    const { appPaths } = quasarConf.ctx

    cfg.entryPoints = [ resolve('src-electron', name) ]
    cfg.outfile = quasarConf.ctx.dev === true
      ? appPaths.resolve.entry(`preload/${ scriptName }.cjs`)
      : join(quasarConf.build.distDir, `UnPackaged/preload/${ scriptName }.cjs`)

    cfg.define = {
      ...cfg.define,
      ...getBuildSystemDefine({
        buildEnv: {
          QUASAR_PUBLIC_FOLDER: quasarConf.ctx.dev === true
            ? appPaths.publicDir
            : '.'
        }
      })
    }

    return {
      scriptName,
      esbuildConfig: await extendEsbuildConfig(cfg, quasarConf.electron, quasarConf.ctx, 'extendElectronPreloadConf')
    }
  },

  async preloadScriptList (quasarConf) {
    const list = []

    for (const name of quasarConf.electron.preloadScripts) {
      list.push(
        await this.preloadScript(quasarConf, name)
      )
    }

    return list
  }
}

module.exports.quasarElectronConfig = quasarElectronConfig
module.exports.modeConfig = quasarElectronConfig
