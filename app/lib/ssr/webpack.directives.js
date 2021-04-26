const { join } = require('path')
const webpack = require('webpack')
const WebpackChain = require('webpack-chain')

const appPaths = require('../app-paths')

const entryFile = join(__dirname, 'runtime.ssr-directives.js')
const banner = `
/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT IT. INSTEAD, EDIT DIRECTlY IN /src-ssr/directives
 **/
`

module.exports = function () {
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

  chain.entry('directives')
    .add(entryFile)

  chain.output
    .filename('compiled-directives.js')
    .path(appPaths.resolve.app('.quasar/ssr'))

  chain.output
    .libraryTarget('commonjs2')

  chain.externals([
    '@vue/server-renderer',
    '@vue/compiler-sfc',
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

  chain.plugin('banner')
    .use(webpack.BannerPlugin, [{
      raw: true,
      banner
    }])

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
