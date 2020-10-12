const path = require('path')
const nodeExternals = require('webpack-node-externals')

const appPaths = require('../../app-paths')

module.exports = function (chain, cfg) {
  chain.entry('app')
    .clear()
    .add(appPaths.resolve.app('.quasar/server-entry.js'))

  chain.resolve.alias.set('quasar$', 'quasar/dist/quasar.common.js')

  chain.target('node')
  chain.devtool('#source-map')

  chain.output
    .filename('render-app.js')
    .chunkFilename(`chunk-[name].js`)
    .libraryTarget('commonjs2')

  if (cfg.ctx.prod) {
    chain.output
      .path(path.join(cfg.build.distDir, 'server'))
  }

  chain.plugin('define')
    .tap(args => {
      return [{
        ...args[0],
        'process.env.CLIENT': false,
        'process.env.SERVER': true
      }]
    })

  chain.externals(nodeExternals({
    // do not externalize:
    //  1. vue files
    //  2. CSS files
    //  3. when importing directly from Quasar's src folder
    //  4. Quasar language files
    //  5. Quasar icon sets files
    //  6. Quasar extras
    allowlist: [
      /(\.(vue|css|styl|scss|sass|less)$|\?vue&type=style|^quasar[\\/]src[\\/]|^quasar[\\/]lang[\\/]|^quasar[\\/]icon-set[\\/]|^@quasar[\\/]extras[\\/])/,
      ...cfg.build.transpileDependencies
    ]
  }))
}
