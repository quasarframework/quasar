const
  path = require('path'),
  webpack = require('webpack'),
  env = require('./env'),
  WebpackChain = require('webpack-chain'),
  VueSSRClientPlugin = require('vue-server-renderer/client-plugin'),
  WebpackBar = require('webpackbar'),
  FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const
  resolve = file => path.resolve(__dirname, '..', file),
  chain = new WebpackChain()

// inject base
require('./webpack.inject.base')(chain)

chain.entry('client')
  .add('webpack-hot-middleware/client')
  .add(resolve('dev/ssr.app.entry-client.js'))

chain.output
  .path(resolve('dev'))
  .publicPath('/')
  .filename('[name].js')

chain.plugin('define')
  .init((Plugin, args) => new Plugin({
    'process.env.VUE_ENV': '"client"',
    ...args
  }))

// This plugins generates `vue-ssr-client-manifest.json`
chain.plugin('vue-ssr-client')
  .use(VueSSRClientPlugin)

chain.plugin('hot-module-replacement')
  .use(webpack.HotModuleReplacementPlugin)

chain.plugin('webpack-bar')
  .init(Plugin => new Plugin({
    name: 'client'
  }))

chain.optimization
  .namedModules(true) // HMR shows filenames in console on update

module.exports = chain.toConfig()
