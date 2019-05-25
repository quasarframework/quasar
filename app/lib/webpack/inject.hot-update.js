const webpack = require('webpack')

module.exports = function (chain, cfg) {
  if (cfg.ctx.dev && cfg.devServer.hot) {
    chain.optimization
      .namedModules(true) // HMR shows filenames in console on update

    chain.plugin('hot-module-replacement')
      .use(webpack.HotModuleReplacementPlugin)
  }
}
