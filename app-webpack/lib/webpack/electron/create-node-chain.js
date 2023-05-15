const webpack = require('webpack')
const WebpackChain = require('webpack-chain')

const appPaths = require('../../app-paths.js')
const { appPkg, cliPkg } = require('../../app-pkg.js')
const { getBuildSystemDefine } = require('../../utils/env.js')
const { injectNodeBabel } = require('../inject.node-babel.js')
const { injectNodeTypescript } = require('../inject.node-typescript.js')
const { ExpressionDependencyPlugin } = require('./plugin.expression-dependency.js')
const { WebpackProgressPlugin } = require('../plugin.progress.js')

const tempElectronDir = '.quasar/electron'

const externalsList = [
  ...Object.keys(cliPkg.dependencies || {}),
  ...Object.keys(appPkg.dependencies || {})
]

module.exports.createNodeChain = function createNodeChain (nodeType, cfg, configName) {
  const chain = new WebpackChain()
  const resolveModules = [
    'node_modules',
    appPaths.resolve.app('node_modules'),
    appPaths.resolve.cli('node_modules')
  ]

  chain.target(`electron-${ nodeType }`)
  chain.mode(cfg.ctx.dev ? 'development' : 'production')
  chain.node
    .merge({
      __dirname: cfg.ctx.dev,
      __filename: cfg.ctx.dev
    })

  chain.output
    .filename(`electron-${ nodeType }.js`)
    .path(
      cfg.ctx.dev
        ? appPaths.resolve.app(tempElectronDir)
        : cfg.build.distDir
    )

  chain.externals([ ...externalsList ])

  chain.plugin('expression-dependency')
    .use(ExpressionDependencyPlugin)

  injectNodeBabel(cfg, chain)
  injectNodeTypescript(cfg, chain)

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

  chain.plugin('progress')
    .use(WebpackProgressPlugin, [ { name: configName, cfg } ])

  const env = {
    ...cfg.build.env,
    QUASAR_ELECTRON_PRELOAD: cfg.ctx.dev
      ? appPaths.resolve.app(`${ tempElectronDir }/electron-preload.js`)
      : 'electron-preload.js',
    QUASAR_PUBLIC_FOLDER: cfg.ctx.dev
      ? appPaths.resolve.app('public')
      : '.'
  }

  chain.plugin('define')
    .use(webpack.DefinePlugin, [
      getBuildSystemDefine({
        buildEnv: env,
        buildRawDefine: cfg.build.rawDefine,
        fileEnv: cfg.__fileEnv
      })
    ])

  // we include it already in cfg.build.env
  chain.optimization
    .nodeEnv(false)

  if (cfg.ctx.prod) {
    chain.optimization
      .concatenateModules(true)

    if (cfg.ctx.debug) {
      // reset default webpack 4 minimizer
      chain.optimization.minimizers.delete('js')
      // also:
      chain.optimization.minimize(false)
    }

    if (cfg.build.minify) {
      const TerserPlugin = require('terser-webpack-plugin')

      chain.optimization
        .minimizer('js')
        .use(TerserPlugin, [ {
          terserOptions: cfg.build.uglifyOptions,
          extractComments: false,
          parallel: true
        } ])
    }
  }

  return chain
}
