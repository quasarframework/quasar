const webpack = require('webpack')
const merge = require('webpack-merge')
const WebpackChain = require('webpack-chain')
const WebpackProgress = require('../plugin.progress')

const appPaths = require('../../app-paths')

module.exports = function (cfg, configName) {
  const { dependencies:appDeps = {} } = require(appPaths.resolve.app('package.json'))
  const { dependencies:cliDeps = {} } = require(appPaths.resolve.cli('package.json'))

  const chain = new WebpackChain()
  const resolveModules = [
    'node_modules',
    appPaths.resolve.app('node_modules'),
    appPaths.resolve.cli('node_modules')
  ]

  chain.target('electron-main')
  chain.mode(cfg.ctx.dev ? 'development' : 'production')
  chain.node
    .merge({
      __dirname: cfg.ctx.dev,
      __filename: cfg.ctx.dev
    })

  chain.entry('electron-main')
    .add(appPaths.resolve.app(
      cfg.ctx.dev ? cfg.sourceFiles.electronMainDev : cfg.sourceFiles.electronMainProd
    ))

  chain.output
    .filename('electron-main.js')
    .libraryTarget('commonjs2')
    .path(
      cfg.ctx.dev
        ? appPaths.resolve.app('.quasar/electron')
        : cfg.build.distDir
    )

  chain.externals([
    ...Object.keys(cliDeps),
    ...Object.keys(appDeps)
  ])

  chain.module.rule('babel')
    .test(/\.js$/)
    .exclude
      .add(/node_modules/)
      .end()
    .use('babel-loader')
      .loader('babel-loader')
        .options({
          extends: appPaths.resolve.app('babel.config.js')
        })

  chain.module.rule('node')
    .test(/\.node$/)
    .use('node-loader')
      .loader('node-loader')

  chain.resolve.modules
    .merge(resolveModules)

  chain.resolve.extensions
    .merge([ '.js', '.json', '.node' ])

  chain.resolveLoader.modules
    .merge(resolveModules)

  chain.optimization
    .noEmitOnErrors(true)

  if (cfg.build.showProgress) {
    chain.plugin('progress')
      .use(WebpackProgress, [{ name: configName }])
  }

  const env = merge({}, cfg.build.env, {
    QUASAR_NODE_INTEGRATION: JSON.stringify(
      cfg.electron.nodeIntegration === true
    )
  })

  chain.plugin('define')
    .use(webpack.DefinePlugin, [ env ])

  if (cfg.ctx.prod) {
    if (cfg.build.minify) {
      const TerserPlugin = require('terser-webpack-plugin')

      chain.optimization
        .minimizer('js')
        .use(TerserPlugin, [{
          terserOptions: cfg.build.uglifyOptions,
          cache: true,
          parallel: true,
          sourceMap: cfg.build.sourceMap
        }])
    }

    const ElectronPackageJson = require('./plugin.electron-package-json')

    // write package.json file
    chain.plugin('package-json')
      .use(ElectronPackageJson)

    const fs = require('fs')
    const copyArray = []

    const filesToCopy = [
      appPaths.resolve.app('.npmrc'),
      appPaths.resolve.app('.yarnrc'),
      appPaths.resolve.electron('main-process/electron-preload.js')
    ]

    filesToCopy.forEach(filename => {
      if (fs.existsSync(filename)) {
        copyArray.push({
          from: filename,
          to: '.'
        })
      }
    })

    if (copyArray.length > 0) {
      const CopyWebpackPlugin = require('copy-webpack-plugin')
      chain.plugin('copy-webpack')
        .use(CopyWebpackPlugin, [ copyArray ])
    }
  }

  return chain
}
