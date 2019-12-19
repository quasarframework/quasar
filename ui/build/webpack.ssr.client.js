const
  path = require('path'),
  webpack = require('webpack'),
  WebpackChain = require('webpack-chain'),
  VueSSRClientPlugin = require('vue-server-renderer/client-plugin')

const
  resolve = file => path.resolve(__dirname, '..', file),
  chain = new WebpackChain()

// inject base
require('./webpack.inject.base')(chain)

chain.devtool('#cheap-module-source-map')

chain.entry('client')
  .add('webpack-hot-middleware/client?reload=true')
  .add(resolve('dev/app.entry-client.js'))

chain.output
  .path(resolve('dev'))
  .publicPath('/')
  .filename('[name].js')

chain.plugin('define')
  .use(webpack.DefinePlugin, [{
    'process.env': {
      NODE_ENV: '"development"',
      CLIENT: true,
      SERVER: false
    }
  }])

// This plugins generates `vue-ssr-client-manifest.json`
chain.plugin('vue-ssr-client')
  .use(VueSSRClientPlugin)

chain.plugin('hot-module-replacement')
  .use(webpack.HotModuleReplacementPlugin)

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

module.exports = chain.toConfig()
