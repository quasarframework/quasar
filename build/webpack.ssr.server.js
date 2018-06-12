const
  path = require('path'),
  WebpackChain = require('webpack-chain'),
  VueSSRServerPlugin = require('vue-server-renderer/server-plugin'),
  nodeExternals = require('webpack-node-externals'),
  WebpackBar = require('webpackbar')

const
  resolve = file => path.resolve(__dirname, '..', file),
  chain = new WebpackChain()

// inject base
require('./webpack.inject.base')(chain)

chain.target('node')

chain.entry('server')
  .add(resolve('dev/ssr.app.entry-server.js'))

chain.output
  .filename('server-bundle.js')
  .libraryTarget('commonjs2')
  .path(resolve('dev'))
  .publicPath('/')

// https://webpack.js.org/configuration/externals/#externals
// https://github.com/liady/webpack-node-externals
chain.externals(nodeExternals({
  // do not externalize CSS files in case we need to import it from a dep
  whitelist: /\.css$/
}))

chain.plugin('define')
  .init((Plugin, args) => new Plugin({
    'process.env.VUE_ENV': '"server"',
    ...args
  }))

chain.plugin('webpack-bar')
  .init(Plugin => new Plugin({
    name: 'server'
  }))

// This plugins generates `vue-ssr-client-manifest.json`
chain.plugin('vue-ssr-server')
  .use(VueSSRServerPlugin)

module.exports = chain.toConfig()
