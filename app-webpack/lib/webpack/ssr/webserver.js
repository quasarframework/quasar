const webpack = require('webpack')
const WebpackChain = require('webpack-chain')
const { existsSync } = require('fs-extra')

const appPaths = require('../../app-paths')
const WebserverAssetsPlugin = require('./plugin.webserver-assets')
const injectNodeTypescript = require('../inject.node-typescript')
const WebpackProgressPlugin = require('../plugin.progress')

const nodeEnvBanner = `if(process.env.NODE_ENV===void 0){process.env.NODE_ENV='production'}`
const prodExportFile = {
  js: appPaths.resolve.ssr('production-export.js'),
  ts: appPaths.resolve.ssr('production-export.ts'),
  fallback: appPaths.resolve.app('.quasar/ssr-fallback-production-export.js')
}

const flattenObject = (obj, prefix = 'process.env') => {
  return Object.keys(obj)
    .reduce((acc, k) => {
      const pre = prefix.length ? prefix + '.' : ''

      if (Object(obj[k]) === obj[k]) {
        Object.assign(acc, flattenObject(obj[k], pre + k))
      }
      else {
        acc[pre + k] = JSON.stringify(obj[k])
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
  chain.mode(cfg.ctx.prod ? 'production' : 'development')

  if (
    existsSync(prodExportFile.js) === false &&
    existsSync(prodExportFile.ts) === false
  ) {
    chain.resolve.alias.set('src-ssr/production-export', prodExportFile.fallback)
  }

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

  chain.output
    .library({
      type: 'commonjs2',
      export: 'default'
    })

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

  chain.plugin('define')
    .use(webpack.DefinePlugin, [
      // flatten the object keys
      // example: some: { object } becomes 'process.env.some.object'
      { ...flattenObject(cfg.build.env), ...cfg.__rootDefines }
    ])

  // we include it already in cfg.build.env
  chain.optimization
    .nodeEnv(false)

  injectNodeTypescript(cfg, chain)

  chain.plugin('progress')
    .use(WebpackProgressPlugin, [{ name: configName, cfg, hasExternalWork: true }])

  if (cfg.ctx.prod) {
    // we need to set process.env.NODE_ENV to 'production'
    // (unless it's already set to something)
    // in order for externalized vue/vuex/etc packages to run the
    // production code (*.cjs.prod.js) instead of the dev one
    chain.plugin('node-env-banner')
      .use(webpack.BannerPlugin, [
        { banner: nodeEnvBanner, raw: true, entryOnly: true }
      ])

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

  if (cfg.ctx.debug || (cfg.ctx.prod && cfg.build.minify !== true)) {
    // reset default webpack 4 minimizer
    chain.optimization.minimizers.delete('js')
    // also:
    chain.optimization.minimize(false)
  }

  chain.performance
    .hints(false)

  return chain
}
