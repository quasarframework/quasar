const path = require('path')
const appPaths = require('../../app-paths')

const createViteConfig = require('../../create-vite-config')
const parseEnv = require('../../parse-env')
const { tempElectronDir } = require('./utils')

const { dependencies:appDeps = {}, devDependencies:appDevDeps = {} } = require(appPaths.resolve.app('package.json'))
const { dependencies:cliDeps = {} } = require(appPaths.resolve.cli('package.json'))

const external = [
  ...Object.keys(cliDeps),
  ...Object.keys(appDeps),
  ...Object.keys(appDevDeps)
]

function getCommonEsbuild (quasarConf) {
  return {
    platform: 'node',
    target: 'node12',
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
  vite: quasarConf => createViteConfig(quasarConf),

  main: quasarConf => {
    const outfile = path.join(
      quasarConf.ctx.dev ? appPaths.resolve.app(tempElectronDir) : quasarConf.build.distDir,
      'electron-main.js'
    )

    const cfg = {
      ...getCommonEsbuild(quasarConf),
      entryPoints: [ quasarConf.sourceFiles.electronMain ],
      outfile
    }

    if (typeof quasarConf.electron.extendEsbuildOptionsMain === 'function') {
      quasarConf.electron.extendEsbuildOptionsMain(cfg)
    }

    return cfg
  },

  preload: quasarConf => {
    const outfile = path.join(
      quasarConf.ctx.dev ? appPaths.resolve.app(tempElectronDir) : quasarConf.build.distDir,
      'electron-preload.js'
    )

    const cfg = {
      ...getCommonEsbuild(quasarConf),
      entryPoints: [ quasarConf.sourceFiles.electronPreload ],
      outfile
    }

    if (typeof quasarConf.electron.extendEsbuildOptionsPreload === 'function') {
      quasarConf.electron.extendEsbuildOptionsPreload(cfg)
    }

    return cfg
  }
}
