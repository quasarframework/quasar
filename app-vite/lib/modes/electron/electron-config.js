const path = require('path')
const appPaths = require('../../app-paths')

const { createViteConfig, extendViteConfig, extendEsbuildConfig, createNodeEsbuildConfig } = require('../../config-tools')
const parseEnv = require('../../parse-env')
const { tempElectronDir } = require('./utils')

function getCommonEsbuild (quasarConf) {
  return {
    platform: 'node',
    target: quasarConf.build.target.node,
    format: 'cjs',
    bundle: true,
    sourcemap: quasarConf.metaConf.debugging ? 'inline' : false,
    external,
    minify: quasarConf.build.minify !== false,
    define: parseEnv({
      ...quasarConf.build.env,
      QUASAR_ELECTRON_PRELOAD: quasarConf.ctx.dev
        ? appPaths.resolve.app(`${tempElectronDir}/electron-preload.js`)
        : 'electron-preload.js',
      QUASAR_PUBLIC_FOLDER: quasarConf.ctx.dev
        ? appPaths.resolve.app('public')
        : '.'
    }, quasarConf.build.rawDefine)
  }
}

module.exports = {
  vite: quasarConf => {
    const cfg = createViteConfig(quasarConf)
    return extendViteConfig(cfg, quasarConf, { isClient: true })
  },

  main: quasarConf => {
    const cfg = createNodeEsbuildConfig(quasarConf, { cacheSuffix: 'electron-main' })

    cfg.entryPoints = [ quasarConf.sourceFiles.electronMain ]
    cfg.outfile = path.join(
      quasarConf.ctx.dev ? appPaths.resolve.app(tempElectronDir) : quasarConf.build.distDir,
      'electron-main.js'
    )

    cfg.define = {
      ...cfg.define,
      ...parseEnv({
        QUASAR_ELECTRON_PRELOAD: quasarConf.ctx.dev
          ? appPaths.resolve.app(`${tempElectronDir}/electron-preload.js`)
          : 'electron-preload.js',
        QUASAR_PUBLIC_FOLDER: quasarConf.ctx.dev
          ? appPaths.resolve.app('public')
          : '.'
      }, {})
    }

    return extendEsbuildConfig(cfg, quasarConf.electron, 'ElectronMain')
  },

  preload: quasarConf => {
    const cfg = createNodeEsbuildConfig(quasarConf, { cacheSuffix: 'electron-preload' })

    cfg.entryPoints = [ quasarConf.sourceFiles.electronPreload ]
    cfg.outfile = path.join(
      quasarConf.ctx.dev ? appPaths.resolve.app(tempElectronDir) : quasarConf.build.distDir,
      'electron-preload.js'
    )

    cfg.define = {
      ...cfg.define,
      ...parseEnv({
        QUASAR_ELECTRON_PRELOAD: quasarConf.ctx.dev
          ? appPaths.resolve.app(`${tempElectronDir}/electron-preload.js`)
          : 'electron-preload.js',
        QUASAR_PUBLIC_FOLDER: quasarConf.ctx.dev
          ? appPaths.resolve.app('public')
          : '.'
      }, {})
    }

    return extendEsbuildConfig(cfg, quasarConf.electron, 'ElectronPreload')
  }
}
