const
  path = require('path'),
  webpack = require('webpack'),
  WebpackChain = require('webpack-chain'),
  HtmlWebpackPlugin = require('html-webpack-plugin')

const env = require('./env')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const chain = new WebpackChain()

// inject base
require('./webpack.inject.base')(chain)

chain.entry('app')
  .add(resolve('dev/app.entry-client.js'))

chain.plugin('define')
  .use(webpack.DefinePlugin, [{
    'process.env': {
      NODE_ENV: '"development"'
    }
  }])

chain.plugin('html-webpack')
  .use(HtmlWebpackPlugin, [{
    filename: 'index.html',
    template: 'dev/spa.index.html',
    inject: true,
    cache: true
  }])

chain.plugin('hot-module-replacement')
  .use(webpack.HotModuleReplacementPlugin)

chain.plugin('friendly-errors')
  .init(Plugin => new Plugin({
    compilationSuccessInfo: {
      messages: [
        `Running SPA with Quasar v${env.quasarVersion} at ${env.uri}\n`
      ]
    },
    clearConsole: true
  }))

chain.optimization
  .namedModules(true) // HMR shows filenames in console on update

chain.optimization
  .splitChunks({
    cacheGroups: {
      vendors: {
        name: 'vendor',
        chunks: 'all',
        priority: -10,
        // a module is extracted into the vendor chunk if...
        test: /[\\/]node_modules[\\/]/
      },
      common: {
        name: `chunk-common`,
        minChunks: 2,
        priority: -20,
        chunks: 'all',
        reuseExistingChunk: true
      }
    }
  })

chain.optimization.runtimeChunk('single')

const webpackConfig = chain.toConfig()

// tap entries for HMR
require('webpack-dev-server').addDevServerEntrypoints(webpackConfig, env.devServerConfig)

module.exports = webpackConfig
