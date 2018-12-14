const
  fs = require('fs'),
  path = require('path'),
  chalk = require('chalk'),
  webpack = require('webpack'),
  WebpackChain = require('webpack-chain'),
  WebpackProgress = require('../plugin.progress')

const
  appPaths = require('../../app-paths')

module.exports = function (cfg, configName) {
  const
    { dependencies:appDeps = {} } = require(appPaths.resolve.cli('package.json')),
    { dependencies:cliDeps = {} } = require(appPaths.resolve.app('package.json'))

  const chain = new WebpackChain()
  const resolveModules = [
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
          extends: appPaths.resolve.app('.babelrc')
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

  chain.plugin('progress')
    .use(WebpackProgress, [{ name: configName }])

  chain.plugin('define')
    .use(webpack.DefinePlugin, [ cfg.build.env ])

  if (cfg.ctx.prod) {
    if (cfg.build.minify) {
      const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

      chain.optimization
        .minimizer([
          new UglifyJSPlugin({
            uglifyOptions: cfg.build.uglifyOptions,
            cache: true,
            parallel: true,
            sourceMap: cfg.build.sourceMap
          })
        ])
    }

    const ElectronPackageJson = require('./plugin.electron-package-json')

    // write package.json file
    chain.plugin('package-json')
      .use(ElectronPackageJson)
  }

  return chain
}
