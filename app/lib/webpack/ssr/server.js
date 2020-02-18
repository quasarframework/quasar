const nodeExternals = require('webpack-node-externals')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

const appPaths = require('../../app-paths')

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
        'process.env': {
          ...env,
          CLIENT: false,
          SERVER: true
        },
        ...rest
      }]
    })

  chain.externals(nodeExternals({
    // do not externalize CSS files in case we need to import it from a dep
    whitelist: [
      /(\.(vue|css|styl|scss|sass|less)$|\?vue&type=style|^quasar[\\/]src[\\/]|^quasar[\\/]lang[\\/]|^quasar[\\/]icon-set[\\/]|^@quasar[\\/]extras[\\/])/
    ].concat(cfg.build.transpileDependencies)
  }))

  chain.plugin('vue-ssr-client')
    .use(VueSSRServerPlugin, [{
      filename: '../vue-ssr-server-bundle.json'
    }])

  if (cfg.ctx.prod) {
    const SsrProdArtifacts = require('./plugin.ssr-prod-artifacts')
    chain.plugin('ssr-artifacts')
      .use(SsrProdArtifacts, [ cfg ])

    const fs = require('fs')
    const copyArray = []

    const npmrc = appPaths.resolve.app('.npmrc')
    const yarnrc = appPaths.resolve.app('.yarnrc')

    fs.existsSync(npmrc) && copyArray.push({
      from: npmrc,
      to: '..'
    })

    fs.existsSync(yarnrc) && copyArray.push({
      from: yarnrc,
      to: '..'
    })

    const CopyWebpackPlugin = require('copy-webpack-plugin')
    chain.plugin('copy-webpack')
      .use(CopyWebpackPlugin, [ copyArray ])
  }
}
