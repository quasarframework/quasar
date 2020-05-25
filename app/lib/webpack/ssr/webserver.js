const webpack = require('webpack')
const WebpackChain = require('webpack-chain')
const WebpackProgress = require('../plugin.progress')

const appPaths = require('../../app-paths')

// Used only in production

module.exports = function (cfg, configName) {
  const { dependencies:appDeps = {} } = require(appPaths.resolve.app('package.json'))
  const { dependencies:cliDeps = {} } = require(appPaths.resolve.cli('package.json'))

  const chain = new WebpackChain()
  const resolveModules = [
    'node_modules',
    appPaths.resolve.app('node_modules'),
    appPaths.resolve.cli('node_modules')
  ]

  chain.target('node')
  chain.mode('production')

  chain.entry('webserver')
    .add(appPaths.resolve.ssr('index.js'))

  chain.output
    .filename('index.js')
    .libraryTarget('commonjs2')
    .path(cfg.build.distDir)

  chain.externals([
    './quasar.server-manifest.json',
    './quasar.client-manifest.json',
    'compression',
    'express',
    ...Object.keys(cliDeps),
    ...Object.keys(appDeps)
  ])

  chain.node
    .merge({
      __dirname: false,
      __filename: false
    })

  const ssrConfigFile = appPaths.resolve.app('.quasar/ssr-config.js')
  chain.resolve.alias
    .merge({
      // backward compatibility for
      // "const ssr = require('../ssr')"
      '../ssr': ssrConfigFile,

      // new alias instead of "require('../ssr')"
      'quasar-ssr': ssrConfigFile
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

  // reset default webpack 4 minimizer
  chain.optimization.minimizers.delete('js')
  // also:
  chain.optimization.minimize(false)

  chain.performance
    .hints(false)

  chain.optimization
    .concatenateModules(true)

  return chain
}
