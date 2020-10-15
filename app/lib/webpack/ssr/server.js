const nodeExternals = require('webpack-node-externals')
const QuasarSSRServerPlugin = require('@quasar/ssr-helpers/webpack-server-plugin')

const appPaths = require('../../app-paths')

module.exports = function (chain, cfg) {
  chain.entry('app')
    .clear()
    .add(appPaths.resolve.app('.quasar/server-entry.js'))

  chain.resolve.alias.set('quasar$', 'quasar/dist/quasar.cjs.prod.js')

  chain.target('node')
  chain.devtool('#source-map')

  chain.output
    .filename('render-app.js')
    .chunkFilename(`chunk-[name].js`)
    .libraryTarget('commonjs2')

  chain.externals(nodeExternals({
    // do not externalize:
    //  1. vue files
    //  2. CSS files
    //  3. when importing directly from Quasar's src folder
    //  4. Quasar language files
    //  5. Quasar icon sets files
    //  6. Quasar extras
    allowlist: [
      /(\.(vue|css|styl|scss|sass|less)$|\?vue&type=style|^quasar[\\/]lang[\\/]|^quasar[\\/]icon-set[\\/]|^@quasar[\\/]extras[\\/])/,
      ...cfg.build.transpileDependencies
    ]
  }))

  chain.plugin('define')
    .tap(args => {
      return [{
        ...args[0],
        'process.env.CLIENT': false,
        'process.env.SERVER': true
      }]
    })

  chain.plugin('quasar-ssr-server')
    .use(QuasarSSRServerPlugin, [{
      filename: '../quasar.server-manifest.json'
    }])
}
