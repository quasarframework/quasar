const webpack = require('webpack')
const WebpackChain = require('webpack-chain')

const WebpackProgress = require('../plugin.progress')
const appPaths = require('../../app-paths')
const WebserverAssetsPlugin = require('./plugin.webserver-assets')
// const injectNodeBabel = require('../inject.node-babel')
const injectNodeTypescript = require('../inject.node-typescript')

const flattenObject = (obj, prefix = 'process.env') => {
  return Object.keys(obj)
    .reduce((acc, k) => {
      const pre = prefix.length ? prefix + '.' : ''

      if (Object(obj[k]) === obj[k]) {
        Object.assign(acc, flattenObject(obj[k], pre + k))
      }
      else {
        acc[pre + k] = obj[k]
      }

      return acc
    }, {})
}

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

  chain.resolve.alias.set('src-ssr', appPaths.ssrDir)

  if (cfg.ctx.dev) {
    chain.entry('webserver')
      .add(appPaths.resolve.app('.quasar/ssr-middlewares.js'))

    chain.output
      .filename('compiled-middlewares.js')
      .path(appPaths.resolve.app('.quasar/ssr'))
  }
  else {
    chain.entry('webserver')
      .add(appPaths.resolve.app('.quasar/ssr-prod-webserver.js'))

    chain.output
      .filename('index.js')
      .path(cfg.build.distDir)
  }

  chain.output
    .libraryTarget('commonjs2')

  chain.externals([
    '@vue/server-renderer',
    '@vue/compiler-sfc',
    '@quasar/ssr-helpers/create-renderer',
    './render-template.js',
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

  chain.plugin('define')
    .use(webpack.DefinePlugin, [
      // flatten the object keys
      // example: some: { object } becomes 'process.env.some.object'
      { ...flattenObject(cfg.build.env), ...cfg.__rootDefines }
    ])

  // injectNodeBabel(cfg, chain)
  injectNodeTypescript(cfg, chain)

  if (cfg.build.showProgress) {
    chain.plugin('progress')
      .use(WebpackProgress, [{ name: configName }])
  }

  if (cfg.ctx.prod) {
    chain.plugin('webserver-assets-plugin')
      .use(WebserverAssetsPlugin, [ cfg ])

    const patterns = [
      appPaths.resolve.app('.npmrc'),
      appPaths.resolve.app('.yarnrc')
    ].map(filename => ({
      from: filename,
      to: '..',
      noErrorOnMissing: true
    }))

    const CopyWebpackPlugin = require('copy-webpack-plugin')
    chain.plugin('copy-webpack')
      .use(CopyWebpackPlugin, [{ patterns }])
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
