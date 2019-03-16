const
  nodeExternals = require('webpack-node-externals'),
  VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

module.exports = function (chain, cfg) {
  chain.entry('app')
    .clear()
    .add(appPaths.resolve.app('.quasar/server-entry.js'))

  chain.target('node')
  chain.devtool('#source-map')

  chain.output
    .filename('server-bundle.js')
    .libraryTarget('commonjs2')

  chain.plugin('define')
    .tap(args => {
      const { 'process.env': env, ...rest } = args[0]
      return [{
        'process.env': Object.assign(
          {},
          env,
          { CLIENT: false, SERVER: true }
        ),
        ...rest
      }]
    })

  chain.externals(nodeExternals({
    // do not externalize CSS files in case we need to import it from a dep
    whitelist: /(\.css$|\.vue$|\?vue&type=style|^quasar[\\/]lang[\\/]|^quasar[\\/]icon-set[\\/]|^quasar[\\/]src[\\/])/
  }))

  chain.plugin('vue-ssr-client')
    .use(VueSSRServerPlugin, [{
      filename: '../vue-ssr-server-bundle.json'
    }])

  if (cfg.ctx.prod) {
    const SsrProdArtifacts = require('./plugin.ssr-prod-artifacts')
    chain.plugin('ssr-artifacts')
      .use(SsrProdArtifacts, [ cfg ])

    // copy src-ssr to dist folder in /server
    const CopyWebpackPlugin = require('copy-webpack-plugin')
    chain.plugin('copy-webpack')
      .use(CopyWebpackPlugin, [
        [{
          from: cfg.ssr.__dir,
          to: '../server',
          ignore: ['.*']
        }]
      ])
  }
}
