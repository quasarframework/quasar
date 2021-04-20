const webpack = require('webpack')

module.exports = function (chain, cfg) {
  if (cfg.ctx.dev && cfg.devServer.hot) {
    chain.plugin('hot-module-replacement')
      .use(webpack.HotModuleReplacementPlugin)
  }
}
