const injectHtml = require('../inject.html')

module.exports = function (chain, cfg) {
  injectHtml(chain, cfg)

  if (cfg.ctx.build) {
    chain.output
      .libraryTarget('commonjs2')
  }

  chain.node
    .merge({
      __dirname: cfg.ctx.dev,
      __filename: cfg.ctx.dev
    })
}
