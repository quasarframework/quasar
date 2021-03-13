const webpack = require('webpack')
const WebpackChain = require('webpack-chain')

const WebpackProgress = require('../plugin.progress')
const ExpressionDependency = require('./plugin.expression-dependency')
const parseBuildEnv = require('../../helpers/parse-build-env')

const appPaths = require('../../app-paths')

const tempElectronDir = '.quasar/electron'

module.exports = (nodeType, cfg, configName) => {
  const { dependencies:appDeps = {} } = require(appPaths.resolve.app('package.json'))
  const { dependencies:cliDeps = {} } = require(appPaths.resolve.cli('package.json'))

  const chain = new WebpackChain()
  const resolveModules = [
    'node_modules',
    appPaths.resolve.app('node_modules'),
    appPaths.resolve.cli('node_modules')
  ]

  chain.target(`electron-${nodeType}`)
  chain.mode(cfg.ctx.dev ? 'development' : 'production')
  chain.node
    .merge({
      __dirname: cfg.ctx.dev,
      __filename: cfg.ctx.dev
    })

  chain.output
    .filename(`electron-${nodeType}.js`)
    .libraryTarget('commonjs2')
    .path(
      cfg.ctx.dev
        ? appPaths.resolve.app(tempElectronDir)
        : cfg.build.distDir
    )

  chain.externals([
    ...Object.keys(cliDeps),
    ...Object.keys(appDeps)
  ])

  chain.plugin('expression-dependency')
    .use(ExpressionDependency)

  if (cfg.build.transpile === true) {
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
  }

  if (cfg.supportTS !== false) {
    chain.resolve.extensions
      .merge([ '.ts' ])

    chain.module
      .rule('typescript')
      .test(/\.ts$/)
      .use('ts-loader')
        .loader('ts-loader')
        .options({
          onlyCompileBundledFiles: true,
          transpileOnly: false
        })
  }

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

  const env = {
    ...cfg.build.env,
    QUASAR_ELECTRON_PRELOAD: cfg.ctx.dev
      ? appPaths.resolve.app(`${tempElectronDir}/electron-preload.js`)
      : 'electron-preload.js',
    QUASAR_PUBLIC_FOLDER: cfg.ctx.dev
      ? appPaths.resolve.app('public')
      : '.'
  }

  chain.plugin('define')
    .use(webpack.DefinePlugin, [
      parseBuildEnv(env, cfg.__rootDefines)
    ])

  if (cfg.ctx.prod) {
    // Scope hoisting ala Rollupjs
    if (cfg.build.scopeHoisting) {
      chain.optimization
        .concatenateModules(true)
    }

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
        .use(TerserPlugin, [{
          terserOptions: cfg.build.uglifyOptions,
          cache: true,
          parallel: true,
          sourceMap: cfg.build.sourceMap
        }])
    }
  }

  return chain
}
